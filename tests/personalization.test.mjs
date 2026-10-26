import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

const STORAGE_KEY = 'myshop-personalization'
const RESULT = {
  type: '편안한 미니멀', emoji: '🌿', description: '일상에 어울리는 편안한 스타일이에요.',
  keywords: ['미니멀', '어스톤'], coordi: '셔츠와 여유로운 팬츠를 함께 입어보세요.',
  productIds: [2, 1], tip: '차분한 색을 함께 매치해보세요.',
}
const ANSWERS = { situation: '데일리', fit: '레귤러', vibe: '미니멀', color: '어스톤' }
const saved = (overrides = {}) => JSON.stringify({
  version: 1, ownerId: 'alice', createdAt: 1234, result: RESULT, ...overrides,
})

let values
let storage
let events
let load
let sessionOwner
let authListener
let effects
let state
let cursor
let getUser

beforeEach((context) => {
  values = new Map()
  events = new EventTarget()
  effects = []
  state = []
  cursor = 0
  sessionOwner = 'alice'
  getUser = async () => ({ data: { user: sessionOwner ? { id: sessionOwner } : null }, error: null })
  storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  }
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window')
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    sessionStorage: storage,
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
  } })
  context.after(() => {
    for (const cleanup of effects) cleanup?.()
    if (previous) Object.defineProperty(globalThis, 'window', previous)
    else delete globalThis.window
  })
  load = createTypeScriptLoader({
    react: {
      useState: (initial) => {
        const index = cursor++
        if (!(index in state)) state[index] = typeof initial === 'function' ? initial() : initial
        return [state[index], (value) => { state[index] = typeof value === 'function' ? value(state[index]) : value }]
      },
      useRef: (initial) => {
        const index = cursor++
        if (!(index in state)) state[index] = { current: initial }
        return state[index]
      },
      useSyncExternalStore: (_subscribe, snapshot) => snapshot(),
      useEffect: (effect) => { effects.push(effect()) },
    },
    '@/lib/supabase/client': { createClient: () => ({ auth: {
      getUser: () => getUser(),
      onAuthStateChange: (callback) => {
        authListener = callback
        return { data: { subscription: { unsubscribe: () => { authListener = undefined } } } }
      },
    } }) },
  })
})

function renderQuizHook() {
  cursor = 0
  return load('src/hooks/useStyleQuiz.ts').useStyleQuiz()
}

function deferred() {
  let resolve
  const promise = new Promise((done) => { resolve = done })
  return { promise, resolve }
}

test('restores only the authenticated owner and keeps client and SSR snapshots stable', () => {
  values.set(STORAGE_KEY, saved())
  const store = load('src/lib/personalization.ts')
  assert.equal(store.getPersonalizationSnapshot(), null)
  store.setPersonalizationIdentity('alice')
  const profile = store.getPersonalizationSnapshot()
  assert.deepEqual(profile, { ownerId: 'alice', createdAt: 1234, result: RESULT })
  assert.equal(store.getPersonalizationSnapshot(), profile)
  assert.equal(store.getServerPersonalizationSnapshot(), null)
  assert.equal(store.getServerPersonalizationSnapshot(), null)
})

for (const [label, raw] of [
  ['broken JSON', '{'], ['null', 'null'], ['newer version', saved({ version: 2 })],
  ['wrong owner', saved({ ownerId: 'bob' })], ['invalid timestamp', saved({ createdAt: -1 })],
  ['missing description', saved({ result: { ...RESULT, description: '' } })],
  ['invalid keywords', saved({ result: { ...RESULT, keywords: ['ok', 4] } })],
  ['invalid IDs', saved({ result: { ...RESULT, productIds: [1, '2'] } })],
]) {
  test(`ignores saved personalization with ${label}`, () => {
    values.set(STORAGE_KEY, raw)
    const store = load('src/lib/personalization.ts')
    store.setPersonalizationIdentity('alice')
    assert.equal(store.getPersonalizationSnapshot(), null)
  })
}

test('saves validated results with the request owner, version, and analysis time', () => {
  const store = load('src/lib/personalization.ts')
  store.setPersonalizationIdentity('alice')
  const request = store.beginPersonalizationRequest()
  assert.equal(store.savePersonalizationResult(request, RESULT), true)
  const profile = store.getPersonalizationSnapshot()
  assert.equal(profile.ownerId, 'alice')
  assert.deepEqual(profile.result, RESULT)
  assert.ok(profile.createdAt > 0)
  assert.deepEqual(JSON.parse(values.get(STORAGE_KEY)), { version: 1, ...profile })
})

test('does not expose or save a late analysis after switching accounts and returning', () => {
  const store = load('src/lib/personalization.ts')
  store.setPersonalizationIdentity('alice')
  const request = store.beginPersonalizationRequest()
  store.setPersonalizationIdentity('bob')
  store.setPersonalizationIdentity('alice')
  assert.equal(store.savePersonalizationResult(request, RESULT), false)
  assert.equal(store.getPersonalizationSnapshot(), null)
  assert.equal(values.has(STORAGE_KEY), false)
})

test('removes another account\'s saved result when a tab opens under a new authenticated owner', () => {
  values.set(STORAGE_KEY, saved())
  const store = load('src/lib/personalization.ts')
  store.setPersonalizationIdentity('bob')
  assert.equal(store.getPersonalizationSnapshot(), null)
  assert.equal(values.has(STORAGE_KEY), false)
})

test('personalization reset notifies subscribers and invalidates an in-flight diagnosis', () => {
  const store = load('src/lib/personalization.ts')
  store.setPersonalizationIdentity('alice')
  const updates = []
  const unsubscribe = store.subscribeToPersonalization(() => updates.push(store.getPersonalizationSnapshot()))
  store.savePersonalizationResult(store.beginPersonalizationRequest(), RESULT)
  const pending = store.beginPersonalizationRequest()
  store.clearPersonalizationProfile()
  assert.equal(store.savePersonalizationResult(pending, RESULT), false)
  assert.equal(store.getPersonalizationSnapshot(), null)
  assert.equal(updates.length, 2)
  assert.equal(updates[1], null)
  unsubscribe()
  store.savePersonalizationResult(store.beginPersonalizationRequest(), RESULT)
  assert.equal(updates.length, 2)
})

test('blocked writes keep the latest successful result in memory instead of reloading stale storage', () => {
  values.set(STORAGE_KEY, saved())
  const store = load('src/lib/personalization.ts')
  store.setPersonalizationIdentity('alice')
  storage.setItem = () => { throw new Error('blocked') }
  const next = { ...RESULT, type: '새 스타일', productIds: [] }
  assert.equal(store.savePersonalizationResult(store.beginPersonalizationRequest(), next), true)
  const profile = store.getPersonalizationSnapshot()
  assert.deepEqual(profile.result, next)
  assert.equal(store.getPersonalizationSnapshot(), profile)
  storage.getItem = () => { throw new Error('blocked') }
  storage.removeItem = () => { throw new Error('blocked') }
  assert.doesNotThrow(() => store.clearPersonalizationProfile())
  assert.equal(store.getPersonalizationSnapshot(), null)
})

test('blocked sessionStorage still allows a successful diagnosis in this tab', () => {
  for (const key of ['getItem', 'setItem', 'removeItem']) storage[key] = () => { throw new Error('blocked') }
  const store = load('src/lib/personalization.ts')
  assert.doesNotThrow(() => store.setPersonalizationIdentity('alice'))
  assert.equal(store.savePersonalizationResult(store.beginPersonalizationRequest(), RESULT), true)
  assert.deepEqual(store.getPersonalizationSnapshot().result, RESULT)
})

test('failed reanalysis preserves the last successful result and exposes the API failure', async (context) => {
  values.set(STORAGE_KEY, saved())
  const store = load('src/lib/personalization.ts')
  store.setPersonalizationIdentity('alice')
  const previous = store.getPersonalizationSnapshot()
  context.mock.method(globalThis, 'fetch', async () => Response.json({ error: '잠시 후 다시 시도해주세요.' }, { status: 503 }))
  assert.equal(await renderQuizHook().analyze(ANSWERS), false)
  assert.equal(store.getPersonalizationSnapshot(), previous)
  assert.equal(renderQuizHook().error, '잠시 후 다시 시도해주세요.')
})

test('successful diagnosis keeps AI ID order and excludes unavailable catalog products', async (context) => {
  const store = load('src/lib/personalization.ts')
  store.setPersonalizationIdentity('alice')
  const result = { ...RESULT, productIds: [2, 7, 99999, 1] }
  context.mock.method(globalThis, 'fetch', async () => Response.json({ result, recommendedProducts: [] }))
  assert.equal(await renderQuizHook().analyze(ANSWERS), true)
  const hook = renderQuizHook()
  assert.deepEqual(hook.result, result)
  assert.deepEqual(hook.products.map((product) => product.id), [2, 1])
})

test('malformed successful AI responses cannot replace a previous result', async (context) => {
  values.set(STORAGE_KEY, saved())
  const store = load('src/lib/personalization.ts')
  store.setPersonalizationIdentity('alice')
  const previous = store.getPersonalizationSnapshot()
  context.mock.method(globalThis, 'fetch', async () => Response.json({ result: { ...RESULT, keywords: null }, recommendedProducts: [] }))
  assert.equal(await renderQuizHook().analyze(ANSWERS), false)
  assert.equal(store.getPersonalizationSnapshot(), previous)
  assert.ok(renderQuizHook().error)
})

test('late AI responses are discarded when an account changes while the request runs', async (context) => {
  const store = load('src/lib/personalization.ts')
  store.setPersonalizationIdentity('alice')
  const response = deferred()
  context.mock.method(globalThis, 'fetch', () => response.promise)
  const pending = renderQuizHook().analyze(ANSWERS)
  store.setPersonalizationIdentity('bob')
  sessionOwner = 'bob'
  response.resolve(Response.json({ result: RESULT, recommendedProducts: [] }))
  assert.equal(await pending, false)
  assert.equal(renderQuizHook().result, null)
  assert.equal(store.getPersonalizationSnapshot(), null)
})

test('rechecks browser authentication before saving even if an auth broadcast has not arrived', async (context) => {
  const store = load('src/lib/personalization.ts')
  store.setPersonalizationIdentity('alice')
  sessionOwner = 'bob'
  context.mock.method(globalThis, 'fetch', async () => Response.json({ result: RESULT, recommendedProducts: [] }))
  assert.equal(await renderQuizHook().analyze(ANSWERS), false)
  assert.equal(store.getPersonalizationSnapshot(), null)
  assert.equal(values.has(STORAGE_KEY), false)
})

test('failed logout preserves personalization and successful logout invalidates a pending result', async (context) => {
  values.set(STORAGE_KEY, saved())
  const store = load('src/lib/personalization.ts')
  store.setPersonalizationIdentity('alice')
  const previous = store.getPersonalizationSnapshot()
  const pending = store.beginPersonalizationRequest()
  const api = load('src/lib/api.ts').authApi
  let succeeds = false
  context.mock.method(globalThis, 'fetch', async () => succeeds
    ? Response.json({ success: true }) : Response.json({ error: '로그아웃 실패' }, { status: 503 }))
  await assert.rejects(api.logout())
  assert.equal(store.getPersonalizationSnapshot(), previous)
  assert.equal(store.isPersonalizationRequestCurrent(pending), true)
  succeeds = true
  await api.logout()
  assert.equal(store.getPersonalizationSnapshot(), null)
  assert.equal(store.savePersonalizationResult(pending, RESULT), false)
  assert.equal(values.has(STORAGE_KEY), false)
})

test('a logout response without success cannot clear the current profile', async (context) => {
  values.set(STORAGE_KEY, saved())
  const store = load('src/lib/personalization.ts')
  store.setPersonalizationIdentity('alice')
  const previous = store.getPersonalizationSnapshot()
  context.mock.method(globalThis, 'fetch', async () => Response.json({ success: false }))
  await assert.rejects(load('src/lib/api.ts').authApi.logout())
  assert.equal(store.getPersonalizationSnapshot(), previous)
})

test('browser identity sync ignores stale INITIAL_SESSION and handles cross-tab signout', async () => {
  values.set(STORAGE_KEY, saved())
  const store = load('src/lib/personalization.ts')
  const { PersonalizationIdentity } = load('src/components/features/style/PersonalizationIdentity.tsx')
  assert.equal(PersonalizationIdentity({ userId: 'alice' }), null)
  authListener('SIGNED_IN', { user: { id: 'bob' } })
  authListener('INITIAL_SESSION', { user: { id: 'alice' } })
  await Promise.resolve()
  const request = store.beginPersonalizationRequest()
  assert.equal(request.ownerId, 'bob')
  authListener('SIGNED_OUT', null)
  assert.equal(store.savePersonalizationResult(request, RESULT), false)
  assert.equal(store.getPersonalizationSnapshot(), null)
})

test('a stale browser identity check cannot restore the owner after successful logout', async (context) => {
  const identity = deferred()
  getUser = () => identity.promise
  const store = load('src/lib/personalization.ts')
  load('src/components/features/style/PersonalizationIdentity.tsx').PersonalizationIdentity({ userId: 'alice' })
  context.mock.method(globalThis, 'fetch', async () => Response.json({ success: true }))
  await load('src/lib/api.ts').authApi.logout()
  identity.resolve({ data: { user: { id: 'alice' } }, error: null })
  await Promise.resolve()
  assert.equal(store.beginPersonalizationRequest(), null)
})
