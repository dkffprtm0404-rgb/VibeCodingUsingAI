import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

const orders = ['alice', 'bob'].map((owner) => ({
  id: `${owner}-order`, user_id: owner, status: 'pending', created_at: '2026-10-22T00:00:00Z',
  total_price: 29000, shipping_fee: 3000, order_items: [],
  receiver_name: `${owner}-private`, receiver_phone: '010-0000-0000', receiver_address: 'test address',
}))

function orderReader(user = { id: 'alice' }) {
  let reads = 0
  // Deliberately simulate a permissive DB policy: app queries must still isolate owners.
  const load = createTypeScriptLoader({
    '@/components/ui/EmptyState': { EmptyState: 'empty-state' },
    '@/components/ui/SectionHeader': { SectionHeader: 'section-header' },
    '@/components/ui/Button': { Button: 'button' },
    'next/link': 'a',
    'next/image': 'img',
    '@/lib/supabase/server': { createClient: async () => ({
      auth: { getUser: async () => ({ data: { user }, error: null }) },
      from: () => {
        reads++
        const filters = []
        const rows = () => orders.filter((order) => filters.every(([key, value]) => order[key] === value))
        const query = {
          select: () => query,
          eq: (key, value) => { filters.push([key, value]); return query },
          order: () => query,
          single: async () => ({ data: rows()[0] ?? null, error: null }),
          then: (resolve) => Promise.resolve({ data: rows(), error: null }).then(resolve),
        }
        return query
      },
    }) },
    'next/navigation': {
      redirect: () => { throw new Error('LOGIN_REDIRECT') },
      notFound: () => { throw new Error('NOT_FOUND') },
    },
  })
  return { load, get reads() { return reads } }
}

test('order GET returns only the authenticated owner even with a permissive DB policy', async () => {
  const api = orderReader()
  const response = await api.load('app/api/orders/route.ts').GET()
  assert.equal(response.status, 200)
  assert.deepEqual((await response.json()).orders.map((order) => order.id), ['alice-order'])
})

test('orders page excludes another owner even with a permissive DB policy', async () => {
  const api = orderReader()
  const page = await api.load('app/orders/page.tsx').default()
  const rendered = JSON.stringify(page)
  assert.ok(rendered.includes('alice-order'))
  assert.ok(!rendered.includes('bob-order'))
})

test('order detail rejects another owner before rendering their delivery information', async () => {
  const api = orderReader()
  await assert.rejects(api.load('app/orders/[id]/page.tsx').default({ params: Promise.resolve({ id: 'bob-order' }) }), /NOT_FOUND/)
})

test('order detail keeps access to the authenticated owner own order', async () => {
  const api = orderReader()
  const page = await api.load('app/orders/[id]/page.tsx').default({ params: Promise.resolve({ id: 'alice-order' }) })
  assert.ok(JSON.stringify(page).includes('alice-private'))
})

test('all order read surfaces reject unauthenticated access before querying orders', async () => {
  const api = orderReader(null)
  assert.equal((await api.load('app/api/orders/route.ts').GET()).status, 401)
  await assert.rejects(api.load('app/orders/page.tsx').default(), /LOGIN_REDIRECT/)
  await assert.rejects(api.load('app/orders/[id]/page.tsx').default({ params: Promise.resolve({ id: 'alice-order' }) }), /LOGIN_REDIRECT/)
  assert.equal(api.reads, 0)
})

async function loginDestination(callbackUrl) {
  const destinations = []
  const load = createTypeScriptLoader({
    react: { useState: (initial) => [initial, () => {}], useCallback: (callback) => callback },
    'next/navigation': { useRouter: () => ({ push: (url) => destinations.push(url), refresh: () => {} }) },
    '@/lib/api': { authApi: { login: async () => ({ user: { id: 'alice' } }) }, ApiError: Error },
  })
  await load('src/hooks/useAuth.ts').useLogin(callbackUrl).login('alice@example.test', 'test-password')
  return destinations
}

for (const destination of ['https://attacker.invalid/login', '//attacker.invalid', '/\\attacker.invalid', 'javascript:alert(1)', '/\t/attacker.invalid', '/\n/attacker.invalid', '/%5cattacker.invalid', '/%2f%2fattacker.invalid', '/local/..//attacker.invalid', '/%2e%2e//attacker.invalid', '/%zz']) {
  test(`login rejects an unsafe callback destination ${JSON.stringify(destination)}`, async () => {
    assert.deepEqual(await loginDestination(destination), ['/'])
  })
}

for (const destination of ['/checkout', '/orders/alice-order', '/products?q=linen#results']) {
  test(`login preserves internal callback ${destination}`, async () => {
    assert.deepEqual(await loginDestination(destination), [destination])
  })
}
