import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

const verified = (id = 'alice') => ({ id, email_confirmed_at: '2026-10-22T00:00:00Z' })
const chatBody = { messages: [{ role: 'user', content: '상의 추천해줘' }] }
const styleBody = { situation: '데일리', fit: '레귤러', vibe: '미니멀', color: '무채색' }
let now
beforeEach((context) => {
  now = Date.UTC(2026, 9, 22, 0, 0)
  context.mock.method(Date, 'now', () => now)
  delete globalThis.__myshopAiQuota
  const oldOrigin = process.env.NEXT_PUBLIC_APP_URL
  delete process.env.NEXT_PUBLIC_APP_URL
  context.after(() => {
    delete globalThis.__myshopAiQuota
    if (oldOrigin === undefined) delete process.env.NEXT_PUBLIC_APP_URL
    else process.env.NEXT_PUBLIC_APP_URL = oldOrigin
  })
})

function setup({ user = verified(), authError = null, providerError = false } = {}) {
  let calls = 0
  const api = { user }
  const load = createTypeScriptLoader({
    '@/lib/supabase/server': { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: api.user }, error: authError }) } }) },
    '@/lib/ai/provider': { requestAi: async () => {
      calls++
      if (providerError) throw new Error('private provider error')
      return { value: { content: '추천이에요.', productIds: [] }, provider: 'claude', model: 'test-model' }
    } },
  })
  const chat = load('app/api/chat/route.ts').POST
  const style = load('app/api/style-quiz/route.ts').POST
  return Object.assign(api, {
    submit: (route = 'chat', body = route === 'chat' ? chatBody : styleBody, extraHeaders = {}) => (route === 'chat' ? chat : style)(new Request(`http://localhost/api/${route}`, {
      method: 'POST', headers: { Origin: 'http://localhost', 'Content-Type': 'application/json', ...extraHeaders }, body: JSON.stringify(body),
    })),
    getCalls: () => calls,
  })
}

for (const route of ['chat', 'style']) {
  test(`${route}: anonymous requests never reach inference`, async () => {
    const api = setup({ user: null })
    assert.equal((await api.submit(route)).status, 401)
    assert.equal(api.getCalls(), 0)
  })
  test(`${route}: users without confirmed email never reach inference`, async () => {
    const api = setup({ user: { id: 'unconfirmed', email_confirmed_at: null } })
    assert.equal((await api.submit(route)).status, 403)
    assert.equal(api.getCalls(), 0)
  })
}

test('auth failures fail closed without exposing provider details', async () => {
  const api = setup({ authError: { message: 'private auth detail' } })
  const response = await api.submit()
  assert.notEqual(response.status, 200)
  assert.equal(api.getCalls(), 0)
  assert.ok(!JSON.stringify(await response.json()).includes('private auth detail'))
})

test('both AI routes share the five requests per minute limit', async () => {
  const api = setup()
  for (const route of ['chat', 'style', 'chat', 'style', 'chat']) assert.equal((await api.submit(route)).status, 200)
  const response = await api.submit('style')
  assert.equal(response.status, 429)
  assert.equal(Number(response.headers.get('Retry-After')), 60)
  assert.equal(api.getCalls(), 5)
})

test('minute expiry permits another request without resetting the daily count', async () => {
  const api = setup()
  for (let i = 0; i < 5; i++) assert.equal((await api.submit()).status, 200)
  assert.equal((await api.submit()).status, 429)
  now += 60000
  assert.equal((await api.submit()).status, 200)
  assert.equal(api.getCalls(), 6)
})

test('thirty daily requests block one member while another member can still use AI', async () => {
  const api = setup()
  for (let i = 0; i < 30; i++) {
    now += 60000
    assert.equal((await api.submit()).status, 200)
  }
  now += 60000
  assert.equal((await api.submit()).status, 429)
  api.user = verified('bob')
  assert.equal((await api.submit()).status, 200)
  assert.equal(api.getCalls(), 31)
})

test('app-wide daily limit blocks the 101st request even from another authenticated member', async () => {
  const api = setup()
  for (let i = 0; i < 100; i++) {
    api.user = verified(`member-${i}`)
    assert.equal((await api.submit(i % 2 ? 'style' : 'chat')).status, 200)
  }
  api.user = verified('new-member')
  const response = await api.submit()
  assert.equal(response.status, 429)
  assert.equal(Number(response.headers.get('Retry-After')), 54000)
  assert.equal(api.getCalls(), 100)
})

test('daily quotas reset at midnight in Korea', async () => {
  const api = setup()
  const start = Date.UTC(2026, 9, 22, 14, 54)
  for (let i = 0; i < 30; i++) {
    now = start + Math.floor(i / 5) * 60000
    assert.equal((await api.submit()).status, 200)
  }
  assert.equal((await api.submit()).status, 429)
  now = Date.UTC(2026, 9, 22, 15, 0)
  assert.equal((await api.submit()).status, 200)
})

test('invalid requests do not consume inference quota', async () => {
  const api = setup()
  for (let i = 0; i < 10; i++) assert.equal((await api.submit('chat', {})).status, 400)
  for (let i = 0; i < 5; i++) assert.equal((await api.submit()).status, 200)
  assert.equal((await api.submit()).status, 429)
  assert.equal(api.getCalls(), 5)
})

test('provider failures consume reserved quota and cannot be retried without a limit', async () => {
  const api = setup({ providerError: true })
  for (let i = 0; i < 5; i++) assert.equal((await api.submit()).status, 503)
  assert.equal((await api.submit()).status, 429)
  assert.equal(api.getCalls(), 5)
})

test('concurrent requests cannot reserve more than five minute slots', async () => {
  const api = setup()
  const responses = await Promise.all(Array.from({ length: 6 }, () => api.submit()))
  assert.equal(responses.filter((response) => response.status === 200).length, 5)
  assert.equal(responses.filter((response) => response.status === 429).length, 1)
  assert.equal(api.getCalls(), 5)
})

test('payload user IDs and forwarded IPs cannot select another quota identity', async () => {
  const api = setup()
  for (let i = 0; i < 5; i++) assert.equal((await api.submit()).status, 200)
  assert.equal((await api.submit('chat', { ...chatBody, userId: 'bob' }, { 'X-Forwarded-For': '203.0.113.2' })).status, 429)
  assert.equal(api.getCalls(), 5)
})

test('quota state survives reloading route modules in the same process', async () => {
  const first = setup()
  for (let i = 0; i < 3; i++) assert.equal((await first.submit()).status, 200)
  const second = setup()
  for (let i = 0; i < 2; i++) assert.equal((await second.submit()).status, 200)
  assert.equal((await second.submit()).status, 429)
})
