import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

let values
let events
let storage
let load

beforeEach((context) => {
  values = new Map()
  events = new EventTarget()
  storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, String(value)),
  }
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window')
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    localStorage: storage,
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
  } })
  context.after(() => {
    if (previous) Object.defineProperty(globalThis, 'window', previous)
    else delete globalThis.window
  })
  load = createTypeScriptLoader()
})

test('records the first product before any subscription or mounted-state update', () => {
  const history = load('src/lib/recently-viewed.ts')
  history.addRecentlyViewedProduct(1)
  assert.deepEqual(history.getRecentlyViewedSnapshot(), [1])
  assert.deepEqual(JSON.parse(values.get('myshop-recently-viewed')), [1])
})

test('revisiting a product moves it to the front and retains only six unique IDs', () => {
  const history = load('src/lib/recently-viewed.ts')
  for (const id of [1, 2, 3, 4, 5, 6, 7, 4]) history.addRecentlyViewedProduct(id)
  assert.deepEqual(history.getRecentlyViewedSnapshot(), [4, 7, 6, 5, 3, 2])
})

test('loads existing history, keeps a stable snapshot, and starts SSR with an empty history', () => {
  values.set('myshop-recently-viewed', '[2,1]')
  const history = load('src/lib/recently-viewed.ts')
  const first = history.getRecentlyViewedSnapshot()
  assert.deepEqual(first, [2, 1])
  assert.equal(history.getRecentlyViewedSnapshot(), first)
  assert.deepEqual(history.getServerRecentlyViewedSnapshot(), [])
})

for (const raw of ['{', 'null', '{}', '"wrong"']) {
  test(`recovers from malformed history ${raw}`, () => {
    values.set('myshop-recently-viewed', raw)
    const history = load('src/lib/recently-viewed.ts')
    assert.deepEqual(history.getRecentlyViewedSnapshot(), [])
    history.addRecentlyViewedProduct(1)
    assert.deepEqual(history.getRecentlyViewedSnapshot(), [1])
  })
}

test('filters damaged IDs and duplicates from saved history', () => {
  values.set('myshop-recently-viewed', '[2,"1",null,-1,2,1,1.5,0]')
  assert.deepEqual(load('src/lib/recently-viewed.ts').getRecentlyViewedSnapshot(), [2, 1])
})

test('retains in-memory history when browser storage throws', () => {
  storage.getItem = () => { throw new Error('blocked') }
  storage.setItem = () => { throw new Error('blocked') }
  const history = load('src/lib/recently-viewed.ts')
  assert.doesNotThrow(() => history.addRecentlyViewedProduct(1))
  history.addRecentlyViewedProduct(2)
  assert.deepEqual(history.getRecentlyViewedSnapshot(), [2, 1])
})

test('notifies consumers for same-page updates and another tab storage updates', () => {
  const history = load('src/lib/recently-viewed.ts')
  const observed = []
  const unsubscribe = history.subscribeToRecentlyViewed(() => observed.push(history.getRecentlyViewedSnapshot()))
  history.addRecentlyViewedProduct(1)
  values.set('myshop-recently-viewed', '[3,1]')
  const event = new Event('storage')
  Object.defineProperty(event, 'key', { value: 'myshop-recently-viewed' })
  events.dispatchEvent(event)
  assert.deepEqual(observed, [[1], [3, 1]])
  unsubscribe()
  history.addRecentlyViewedProduct(4)
  assert.equal(observed.length, 2)
})
