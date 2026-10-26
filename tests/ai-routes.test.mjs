import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

const chatReply = { message: '테스트 추천이에요.', productIds: [1, 7, 999, 1, 2, 3, 4] }
const styleReply = {
  type: '모던 미니멀리스트', emoji: '👕', description: '깔끔한 스타일입니다.',
  keywords: ['미니멀', '모던', '심플'], coordi: '셔츠와 청바지를 입어보세요.',
  productIds: [1, 7, 999, 1, 2, 3, 4], tip: '무채색을 활용하세요.',
}
const cases = [
  { name: 'chat', file: 'app/api/chat/route.ts', body: { messages: [{ role: 'user', content: '상의 추천해줘' }] }, reply: chatReply },
  { name: 'style', file: 'app/api/style-quiz/route.ts', body: { situation: '데일리', fit: '레귤러', vibe: '미니멀', color: '무채색' }, reply: styleReply },
]

beforeEach((context) => {
  delete globalThis.__myshopAiQuota
  context.after(() => { delete globalThis.__myshopAiQuota })
  const previousKey = process.env.ANTHROPIC_API_KEY
  process.env.ANTHROPIC_API_KEY = 'test-claude-key'
  context.after(() => {
    if (previousKey === undefined) delete process.env.ANTHROPIC_API_KEY
    else process.env.ANTHROPIC_API_KEY = previousKey
  })
})

function setup(context, route, { primary, fallback = JSON.stringify(route.reply), fallbackError } = {}) {
  const calls = { api: [], codex: [] }
  context.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.api.push({ url, options })
    if (primary instanceof Error) throw primary
    return primary ?? Response.json({ content: [{ type: 'text', text: JSON.stringify(route.reply) }] })
  })
  const load = createTypeScriptLoader({
    '@/lib/supabase/server': { createClient: async () => ({ auth: { getUser: async () => ({ data: { user: { id: 'verified-test-user', email_confirmed_at: '2026-10-22T00:00:00Z' } }, error: null }) } }) },
    '@/lib/ai/codex-app-server': { requestCodex: async (input) => {
      calls.codex.push(input)
      if (fallbackError) throw fallbackError
      return fallback
    } },
  })
  const post = load(route.file).POST
  const submit = (body = route.body, signal) => post(new Request(`http://localhost/api/${route.name}`, {
    method: 'POST', headers: { Origin: 'http://localhost', 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal,
  }))
  return { calls, post, submit }
}

for (const route of cases) {
  test(`${route.name}: uses the existing Claude API first and sanitizes recommendations`, async (context) => {
    const api = setup(context, route)
    const response = await api.submit()
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.deepEqual(body.recommendedProducts.map((product) => product.id), [1, 2, 3])
    if (route.name === 'chat') assert.equal(body.content, '테스트 추천이에요.')
    else assert.deepEqual(body.result.productIds, [1, 2, 3])
    assert.equal(api.calls.codex.length, 0)
    assert.equal(api.calls.api[0].url, 'https://api.anthropic.com/v1/messages')
    assert.equal(JSON.parse(api.calls.api[0].options.body).model, 'claude-haiku-4-5-20251001')
    assert.equal(response.headers.get('x-ai-provider'), 'claude')
  })

  for (const primary of [Response.json({ error: 'limited' }, { status: 429 }), new TypeError('network failed'), new DOMException('timeout', 'TimeoutError')]) {
    test(`${route.name}: falls back to Codex when primary ${primary.status ?? primary.name}`, async (context) => {
      const api = setup(context, route, { primary: primary instanceof Response ? primary.clone() : primary })
      const response = await api.submit()
      assert.equal(response.status, 200)
      assert.equal(api.calls.api.length, 1)
      assert.equal(api.calls.codex.length, 1)
      assert.equal(response.headers.get('x-ai-provider'), 'codex')
      assert.equal(response.headers.get('x-ai-model'), 'gpt-6-sol')
      assert.ok(api.calls.codex[0].systemPrompt.includes('그래픽 레이어드 스웨트셔츠'))
      assert.deepEqual((await response.json()).recommendedProducts.map((product) => product.id), [1, 2, 3])
    })
  }

  test(`${route.name}: a missing API key goes straight to Codex`, async (context) => {
    delete process.env.ANTHROPIC_API_KEY
    const api = setup(context, route)
    assert.equal((await api.submit()).status, 200)
    assert.equal(api.calls.api.length, 0)
    assert.equal(api.calls.codex.length, 1)
  })

  test(`${route.name}: invalid provider responses use Codex instead of returning unusable data`, async (context) => {
    const api = setup(context, route, { primary: Response.json({ content: [{ text: '{}' }] }) })
    assert.equal((await api.submit()).status, 200)
    assert.equal(api.calls.codex.length, 1)
  })

  test(`${route.name}: failure of both providers returns a user error without internal details`, async (context) => {
    const api = setup(context, route, { primary: new Error('primary secret detail'), fallbackError: new Error('private process detail') })
    const response = await api.submit()
    assert.equal(response.status, 503)
    const body = await response.json()
    assert.equal(typeof body.error, 'string')
    assert.ok(!JSON.stringify(body).includes('secret'))
    assert.ok(!JSON.stringify(body).includes('private'))
  })

  test(`${route.name}: an unusable Codex answer is a failure, not an empty successful response`, async (context) => {
    const api = setup(context, route, { primary: new Error('offline'), fallback: '{}' })
    assert.equal((await api.submit()).status, 503)
  })

  test(`${route.name}: invalid input never calls either provider`, async (context) => {
    const api = setup(context, route)
    assert.equal((await api.submit({})).status, 400)
    assert.equal(api.calls.api.length, 0)
    assert.equal(api.calls.codex.length, 0)
  })

  test(`${route.name}: malformed JSON is rejected before inference`, async (context) => {
    const api = setup(context, route)
    assert.equal((await api.post(new Request('http://localhost/api', { method: 'POST', headers: { Origin: 'http://localhost', 'Content-Type': 'application/json' }, body: '{' }))).status, 400)
    assert.equal(api.calls.api.length, 0)
    assert.equal(api.calls.codex.length, 0)
  })

  test(`${route.name}: cancelled requests do not start fallback inference`, async (context) => {
    const api = setup(context, route, { primary: new Error('offline') })
    const controller = new AbortController()
    controller.abort()
    assert.notEqual((await api.submit(route.body, controller.signal)).status, 200)
    assert.equal(api.calls.codex.length, 0)
  })
}

test('chat keeps the existing plain-text API answer without invoking fallback', async (context) => {
  const api = setup(context, cases[0], { primary: Response.json({ content: [{ text: '추천을 도와드릴게요.' }] }) })
  const response = await api.submit()
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { content: '추천을 도와드릴게요.', recommendedProducts: [] })
  assert.equal(api.calls.codex.length, 0)
})
