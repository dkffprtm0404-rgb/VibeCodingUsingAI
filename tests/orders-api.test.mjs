import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

const shippingInfo = { name: '테스트', phone: '010-1234-5678', address: '서울시 테스트로 1' }
const item = { product: { id: 1, price: 1, name: '변조된 이름' }, quantity: 2, selectedSize: 'XL' }
const validRequest = () => ({ items: [structuredClone(item)], shippingInfo: { ...shippingInfo } })

function setup({ user = { id: 'test-user' } } = {}) {
  const writes = []
  let adminCalls = 0
  // 외부 인증·DB만 대체한다. POST, 검증, 상품·쿠폰 계산, 응답은 실제 코드를 실행한다.
  const load = createTypeScriptLoader({
    '@/lib/supabase/server': { createClient: async () => ({ auth: { getUser: async () => ({ data: { user }, error: null }) } }) },
    '@supabase/supabase-js': {
      createClient: () => {
        adminCalls++
        return { from: (table) => ({ insert: (payload) => {
          writes.push({ table, payload })
          return table === 'orders'
            ? { select: () => ({ single: async () => ({ data: { id: 'order-1' }, error: null }) }) }
            : Promise.resolve({ data: null, error: null })
        } }) }
      },
    },
  })
  return { post: load('app/api/orders/route.ts').POST, writes, get adminCalls() { return adminCalls } }
}

async function submit(api, payload) {
  return api.post(new Request('http://localhost/api/orders', {
    method: 'POST', headers: { Origin: 'http://localhost', 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  }))
}

test('unauthenticated orders return 401 without creating an admin client or writing', async () => {
  const api = setup({ user: null })
  assert.equal((await submit(api, validRequest())).status, 401)
  assert.equal(api.adminCalls, 0)
  assert.deepEqual(api.writes, [])
})

const invalidRequests = [
  ['negative quantity', (body) => { body.items[0].quantity = -1 }],
  ['zero quantity', (body) => { body.items[0].quantity = 0 }],
  ['fractional quantity', (body) => { body.items[0].quantity = 1.5 }],
  ['numeric string quantity', (body) => { body.items[0].quantity = '2' }],
  ['unsafe quantity', (body) => { body.items[0].quantity = Number.MAX_SAFE_INTEGER + 1 }],
  ['size stock overflow', (body) => { body.items[0].quantity = 6 }],
  ['unknown size', (body) => { body.items[0].selectedSize = 'UNKNOWN' }],
  ['empty size', (body) => { body.items[0].selectedSize = '' }],
  ['null size', (body) => { body.items[0].selectedSize = null }],
  ['unknown product mixed with a valid product', (body) => { body.items.push({ product: { id: 999 }, quantity: 1 }) }],
  ['sold-out product', (body) => { body.items.push({ product: { id: 7 }, quantity: 1 }) }],
  ['missing product', (body) => { delete body.items[0].product }],
  ['string product id', (body) => { body.items[0].product.id = '1' }],
  ['duplicate rows exceeding size stock', (body) => { body.items = [{ ...item, quantity: 3 }, { ...item, quantity: 3 }] }],
  ['combined legacy and size stock overflow', (body) => { body.items = [{ ...item, quantity: 5 }, { product: { id: 1 }, quantity: 46 }] }],
  ['missing shipping info', (body) => { delete body.shippingInfo }],
  ['blank receiver name', (body) => { body.shippingInfo.name = '  ' }],
  ['non-string phone', (body) => { body.shippingInfo.phone = 1234 }],
  ['blank address', (body) => { body.shippingInfo.address = '\t' }],
  ['invalid optional address detail', (body) => { body.shippingInfo.addressDetail = {} }],
  ['invalid coupon type', (body) => { body.couponCode = 12 }],
  ['items object instead of array', (body) => { body.items = { length: 1 } }],
  ['empty items', (body) => { body.items = [] }],
]

for (const [name, invalidate] of invalidRequests) {
  test(`rejects ${name} before any DB write`, async () => {
    const api = setup()
    const body = validRequest()
    invalidate(body)
    const response = await submit(api, body)
    assert.equal(response.status, 400)
    assert.equal(typeof (await response.json()).error, 'string')
    assert.equal(api.adminCalls, 0)
    assert.deepEqual(api.writes, [])
  })
}

test('rejects a null JSON body before writing', async () => {
  const api = setup()
  assert.equal((await submit(api, null)).status, 400)
  assert.deepEqual(api.writes, [])
})

test('rejects malformed JSON as 400 before writing', async () => {
  const api = setup()
  const response = await api.post(new Request('http://localhost/api/orders', { method: 'POST', headers: { Origin: 'http://localhost', 'Content-Type': 'application/json' }, body: '{' }))
  assert.equal(response.status, 400)
  assert.deepEqual(api.writes, [])
})

test('uses server product facts, capped coupon discount and discount-before-shipping policy', async () => {
  const api = setup()
  const body = validRequest()
  body.couponCode = 'WELCOME10'
  body.totalPrice = 1
  body.shippingFee = 999
  body.shippingInfo.name = '  테스트  '
  const response = await submit(api, body)
  assert.equal(response.status, 201)
  assert.deepEqual(await response.json(), { orderId: 'order-1' })
  assert.equal(api.writes[0].table, 'orders')
  assert.equal(api.writes[0].payload.total_price, 53000)
  assert.equal(api.writes[0].payload.shipping_fee, 0)
  assert.equal(api.writes[0].payload.user_id, 'test-user')
  assert.equal(api.writes[0].payload.receiver_name, '테스트')
  assert.equal(api.writes[1].table, 'order_items')
  assert.equal(api.writes[1].payload[0].product_name, '클래식 화이트 티셔츠')
  assert.equal(api.writes[1].payload[0].product_price, 29000)
  assert.equal(api.writes[1].payload[0].quantity, 2)
})

test('legacy size-free orders and invalid coupon codes keep the existing pricing behavior', async () => {
  const api = setup()
  const body = validRequest()
  body.items = [{ product: { id: 1 }, quantity: 1 }]
  body.couponCode = 'INVALID'
  assert.equal((await submit(api, body)).status, 201)
  assert.equal(api.writes[0].payload.total_price, 29000)
  assert.equal(api.writes[0].payload.shipping_fee, 3000)
})
