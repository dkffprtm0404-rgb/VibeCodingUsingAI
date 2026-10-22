import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

const product = {
  id: 1,
  name: '테스트 셔츠',
  price: 29000,
  imageUrl: '/shirt.jpg',
  images: ['/shirt.jpg'],
  category: '상의',
  description: '테스트용 상품',
  detailDescription: '사이즈별 재고가 다른 테스트용 상품',
  material: '면 100%',
  fit: '정사이즈',
  sizes: [
    { size: 'S', measurements: '가슴 90cm', stock: 0 },
    { size: 'M', measurements: '가슴 95cm', stock: 20 },
    { size: 'L', measurements: '가슴 100cm', stock: 25 },
    { size: 'XL', measurements: '가슴 105cm', stock: 5 },
  ],
  stock: 50,
}

let store

beforeEach((context) => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const values = new Map()
  // Only the browser storage boundary is replaced; Zustand and persist are real.
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key) => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, String(value)),
        removeItem: (key) => values.delete(key),
        clear: () => values.clear(),
        key: (index) => [...values.keys()][index] ?? null,
        get length() { return values.size },
      },
    },
  })
  context.after(() => {
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow)
    else delete globalThis.window
  })
  store = createTypeScriptLoader()('src/store/cartStore.ts').useCartStore
})

test('first addition caps quantity at the selected size stock', () => {
  store.getState().addItem(product, 6, 'XL')
  assert.equal(store.getState().items[0].quantity, 5)
})

test('repeated addition caps the combined quantity at the selected size stock', () => {
  store.getState().addItem(product, 4, 'XL')
  store.getState().addItem(product, 2, 'XL')
  assert.equal(store.getState().items[0].quantity, 5)
})

test('quantity updates cannot exceed the selected size stock', () => {
  store.getState().addItem(product, 2, 'XL')
  store.getState().updateQuantity(product.id, 6, 'XL')
  assert.equal(store.getState().items[0].quantity, 5)
})

test('an omitted quantity still adds one item', () => {
  store.getState().addItem(product, undefined, 'XL')
  assert.equal(store.getState().items[0].quantity, 1)
})

test('first additions without a size use total stock for backwards compatibility', () => {
  store.getState().addItem(product, 51)
  assert.equal(store.getState().items[0].quantity, 50)
})

test('repeated additions without a size cannot exceed total stock', () => {
  store.getState().addItem(product, 49)
  store.getState().addItem(product, 2)
  assert.equal(store.getState().items[0].quantity, 50)
})

test('quantity updates without a size cannot exceed total stock', () => {
  store.getState().addItem(product, 2)
  store.getState().updateQuantity(product.id, 51)
  assert.equal(store.getState().items[0].quantity, 50)
})

for (const size of ['S', 'UNKNOWN', '']) {
  test(`addition of unavailable size ${JSON.stringify(size)} creates no cart item`, () => {
    store.getState().addItem(product, 1, size)
    assert.deepEqual(store.getState().items, [])
  })
}

test('a sold-out product without a size creates no cart item', () => {
  store.getState().addItem({ ...product, stock: 0 }, 1)
  assert.deepEqual(store.getState().items, [])
})

for (const quantity of [0, -1, NaN, Infinity, -Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
  test(`addItem ignores invalid quantity ${quantity} for a new item`, () => {
    store.getState().addItem(product, quantity, 'XL')
    assert.deepEqual(store.getState().items, [])
  })

  test(`addItem ignores invalid quantity ${quantity} for an existing item`, () => {
    store.getState().addItem(product, 2, 'XL')
    store.getState().addItem(product, quantity, 'XL')
    assert.deepEqual(store.getState().items.map((item) => item.quantity), [2])
  })
}

for (const quantity of [NaN, Infinity, -Infinity, 1.5, -1.5]) {
  test(`updateQuantity ignores non-finite or fractional quantity ${quantity}`, () => {
    store.getState().addItem(product, 2, 'XL')
    store.getState().updateQuantity(product.id, quantity, 'XL')
    assert.deepEqual(store.getState().items.map((item) => item.quantity), [2])
  })
}

for (const quantity of [0, -1]) {
  test(`updateQuantity ${quantity} removes only the matching size`, () => {
    store.getState().addItem(product, 2, 'XL')
    store.getState().addItem(product, 3, 'M')
    store.getState().updateQuantity(product.id, quantity, 'XL')
    assert.deepEqual(store.getState().items.map(({ selectedSize, quantity }) => ({ selectedSize, quantity })), [
      { selectedSize: 'M', quantity: 3 },
    ])
  })
}

test('different sizes retain independent quantities and totals', () => {
  store.getState().addItem(product, 4, 'XL')
  store.getState().addItem(product, 3, 'M')
  store.getState().addItem(product, 2, 'XL')
  store.getState().updateQuantity(product.id, 4, 'M')
  assert.deepEqual(store.getState().items.map(({ selectedSize, quantity }) => ({ selectedSize, quantity })), [
    { selectedSize: 'XL', quantity: 5 },
    { selectedSize: 'M', quantity: 4 },
  ])
  assert.equal(store.getState().getTotalCount(), 9)
  assert.equal(store.getState().getTotalPrice(), 261000)
})

test('persist restores valid items and retains working cart actions after reload', () => {
  store.getState().addItem(product, 2, 'XL')
  const reloadedStore = createTypeScriptLoader()('src/store/cartStore.ts').useCartStore
  assert.equal(reloadedStore.getState().items[0].selectedSize, 'XL')
  assert.equal(reloadedStore.getState().getTotalCount(), 2)
  assert.equal(reloadedStore.getState().getTotalPrice(), 58000)
  reloadedStore.getState().updateQuantity(product.id, 3, 'XL')
  assert.equal(reloadedStore.getState().getTotalPrice(), 87000)
  reloadedStore.getState().clearCart()
  assert.deepEqual(reloadedStore.getState().items, [])
})
