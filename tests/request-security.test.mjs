import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

beforeEach((context) => {
  const previous = process.env.NEXT_PUBLIC_APP_URL
  delete process.env.NEXT_PUBLIC_APP_URL
  context.after(() => {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_APP_URL
    else process.env.NEXT_PUBLIC_APP_URL = previous
  })
})

const mutations = [
  ['auth/login', 'POST'], ['auth/signup', 'POST'], ['auth/logout', 'POST'],
  ['chat', 'POST'], ['style-quiz', 'POST'], ['orders', 'POST'],
  ['wishlist', 'POST'], ['wishlist', 'DELETE'], ['restock', 'POST'], ['restock', 'DELETE'], ['coupon', 'POST'],
]

for (const [route, method] of mutations) {
  for (const [name, headers, status] of [
    ['cross-origin form', { Origin: 'https://attacker.invalid', 'Content-Type': 'text/plain' }, 403],
    ['same-origin form', { Origin: 'http://localhost', 'Content-Type': 'text/plain' }, 415],
  ]) {
    test(`${method} ${route} rejects ${name} before any external operation`, async (context) => {
      let externalCalls = 0
      const unavailable = () => { externalCalls++; throw new Error('UNEXPECTED_EXTERNAL_OPERATION') }
      context.mock.method(globalThis, 'fetch', unavailable)
      const load = createTypeScriptLoader({
        '@/lib/supabase/server': { createClient: unavailable },
        '@supabase/supabase-js': { createClient: unavailable },
        '@/lib/ai/codex-app-server': { requestCodex: unavailable },
      })
      const response = await load(`app/api/${route}/route.ts`)[method](new Request(`http://localhost/api/${route}`, {
        method, headers, body: '{}',
      }))
      assert.equal(response.status, status)
      assert.equal(externalCalls, 0)
    })
  }
}

for (const [name, headers] of [
  ['missing origin', {}], ['opaque origin', { Origin: 'null' }],
  ['different port', { Origin: 'http://localhost:4000' }],
  ['cross-site fetch metadata', { Origin: 'http://localhost', 'Sec-Fetch-Site': 'cross-site' }],
  ['same-site sibling origin', { Origin: 'http://localhost', 'Sec-Fetch-Site': 'same-site' }],
]) {
  test(`request guard rejects ${name}`, () => {
    const { validateJsonMutation } = createTypeScriptLoader()('src/lib/request-security.ts')
    const request = new Request('http://localhost/api/test', { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: '{}' })
    assert.equal(validateJsonMutation(request)?.status, 403)
  })
}

test('request guard accepts same-origin JSON with charset', () => {
  const { validateJsonMutation } = createTypeScriptLoader()('src/lib/request-security.ts')
  const request = new Request('http://localhost/api/test', {
    method: 'POST', headers: { Origin: 'http://localhost', 'Content-Type': 'Application/JSON; charset=utf-8', 'Sec-Fetch-Site': 'same-origin' }, body: '{}',
  })
  assert.equal(validateJsonMutation(request), null)
})

test('configured public origin works behind a proxy without trusting forwarded host headers', () => {
  process.env.NEXT_PUBLIC_APP_URL = 'https://shop.example.test'
  const { validateJsonMutation } = createTypeScriptLoader()('src/lib/request-security.ts')
  const request = (origin) => new Request('http://internal:3000/api/test', {
    method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json', 'X-Forwarded-Host': 'attacker.invalid' }, body: '{}',
  })
  assert.equal(validateJsonMutation(request('https://shop.example.test')), null)
  assert.equal(validateJsonMutation(request('https://attacker.invalid'))?.status, 403)
})
