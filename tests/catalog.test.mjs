import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

const load = createTypeScriptLoader()

function product(id, overrides = {}) {
  return {
    id,
    name: '기본 상품',
    price: 30000,
    imageUrl: '/catalog/sample.jpg',
    images: ['/catalog/sample.jpg'],
    category: '상의',
    description: '데모 상품',
    detailDescription: '데모 상품 상세',
    material: '면',
    fit: '레귤러',
    stock: 2,
    sizes: [{ size: 'M', measurements: '기본 옵션', stock: 2 }],
    ...overrides,
  }
}

const PRODUCTS = [
  product(1, { name: '레거시 티셔츠' }),
  product(2, { name: '아카이브 데님', category: '하의', channels: ['fashion', 'outlet'], brand: 'ARCHIVE' }),
  product(3, { name: 'Tinted Lip Balm', category: '뷰티', channels: ['beauty'], brand: 'LUMEN' }),
  product(4, { name: 'Runner Sneaker', category: '신발', channels: ['kicks', 'sports'], brand: 'STRIDE' }),
  product(5, { name: 'Track Jacket', category: '스포츠웨어', channels: ['sports'], brand: 'FIELD' }),
  product(6, { name: 'Wool Coat', category: '아우터', channels: ['fashion', 'boutique'], brand: 'ATELIER' }),
  product(7, { name: '키즈 티셔츠', category: '키즈', channels: ['kids'], brand: 'LITTLE' }),
  product(8, {
    name: '아카이브 자켓', category: '아우터', channels: ['fashion', 'outlet'], brand: 'ARCHIVE',
    stock: 0, sizes: [{ size: 'M', measurements: '기본 옵션', stock: 0 }],
  }),
  product(9, { name: 'Daily Serum', category: '뷰티', channels: ['beauty'], brand: 'LUMEN' }),
]

test('editor selections include each store, avoid duplicates and sold-out products, then fill remaining slots', () => {
  const { getEditorSelection } = load('src/lib/catalog.ts')
  assert.deepEqual(getEditorSelection(PRODUCTS).map((p) => p.id), [1, 3, 4, 2, 6, 7, 5, 9])
  assert.deepEqual(getEditorSelection(PRODUCTS, 3).map((p) => p.id), [1, 3, 4])
  assert.deepEqual(getEditorSelection([]), [])
})

test('store URL values accept supported channels and fall back safely for unknown values', () => {
  const { getStoreId } = load('src/lib/catalog.ts')

  for (const channel of ['all', 'fashion', 'beauty', 'sports', 'outlet', 'boutique', 'kicks', 'kids']) {
    assert.equal(getStoreId(channel), channel)
  }
  for (const value of [undefined, null, '', 'unknown', 'FASHION', ' fashion ', '__proto__']) {
    assert.equal(getStoreId(value), 'all')
  }
})

test('legacy products without channels remain available in fashion and all stores', () => {
  const { matchesStore } = load('src/lib/catalog.ts')
  assert.equal(matchesStore(PRODUCTS[0], 'fashion'), true)
  assert.equal(matchesStore(PRODUCTS[0], 'all'), true)
  assert.equal(matchesStore(PRODUCTS[0], 'beauty'), false)
})

test('a product can belong to outlet and fashion without appearing in unrelated stores', () => {
  const { matchesStore } = load('src/lib/catalog.ts')
  assert.equal(matchesStore(PRODUCTS[1], 'fashion'), true)
  assert.equal(matchesStore(PRODUCTS[1], 'outlet'), true)
  assert.equal(matchesStore(PRODUCTS[1], 'boutique'), false)
  assert.equal(matchesStore(product(10, { channels: [] }), 'fashion'), false)
})

test('store categories contain only present valid kinds in canonical display order', () => {
  const { getStoreCategories } = load('src/lib/catalog.ts')
  const products = [...PRODUCTS].reverse().concat(product(10, { category: '잘못된 종류', channels: ['sports'] }))
  assert.deepEqual(getStoreCategories(products, 'fashion'), ['전체', '상의', '하의', '아우터'])
  assert.deepEqual(getStoreCategories(products, 'sports'), ['전체', '신발', '스포츠웨어'])
  assert.deepEqual(getStoreCategories(products, 'beauty'), ['전체', '뷰티'])
})

test('an empty store still offers its all-category reset', () => {
  const { getStoreCategories } = load('src/lib/catalog.ts')
  assert.deepEqual(getStoreCategories([], 'kids'), ['전체'])
  assert.deepEqual(getStoreCategories([PRODUCTS[0]], 'beauty'), ['전체'])
})

test('store, kind and trimmed case-insensitive product search are combined', () => {
  const { filterCatalog } = load('src/lib/catalog.ts')
  assert.deepEqual(filterCatalog(PRODUCTS, {
    store: 'sports', category: '신발', query: '  rUnNeR  ',
  }).map((item) => item.id), [4])
  assert.deepEqual(filterCatalog(PRODUCTS, {
    store: 'sports', category: '스포츠웨어', query: 'runner',
  }), [])
})

test('brand search is case-insensitive and safe for products without a brand', () => {
  const { filterCatalog } = load('src/lib/catalog.ts')
  assert.deepEqual(filterCatalog(PRODUCTS, {
    store: 'beauty', category: '전체', query: '  lUmEn ',
  }).map((item) => item.id), [3, 9])
  assert.deepEqual(filterCatalog(PRODUCTS, {
    store: 'all', category: '전체', query: '레거시',
  }).map((item) => item.id), [1])
})

test('unknown category URL values safely reset to all within the selected store', () => {
  const { filterCatalog } = load('src/lib/catalog.ts')
  for (const category of [undefined, null, '', '없는 종류', 'toString']) {
    assert.deepEqual(filterCatalog(PRODUCTS, {
      store: 'beauty', category, query: '',
    }).map((item) => item.id), [3, 9])
  }
})

test('changing stores resets a category that is unavailable in the next store', () => {
  const { filterCatalog } = load('src/lib/catalog.ts')
  assert.deepEqual(filterCatalog(PRODUCTS, {
    store: 'beauty', category: '상의', query: '',
  }).map((item) => item.id), [3, 9])
})

test('clearing the query restores all matching products including sold-out stock', () => {
  const { filterCatalog } = load('src/lib/catalog.ts')
  for (const query of [undefined, null, '', '   ']) {
    assert.deepEqual(filterCatalog(PRODUCTS, {
      store: 'outlet', category: '전체', query,
    }).map((item) => item.id), [2, 8])
  }
})

test('a query with no match returns an empty result', () => {
  const { filterCatalog } = load('src/lib/catalog.ts')
  assert.deepEqual(filterCatalog(PRODUCTS, {
    store: 'all', category: '전체', query: '찾을 수 없는 검색어',
  }), [])
  assert.deepEqual(filterCatalog([], { store: 'all', category: '전체', query: '' }), [])
})

test('filtering preserves catalog order and never mutates products or their channels', () => {
  const { filterCatalog, getStoreCategories } = load('src/lib/catalog.ts')
  const products = structuredClone(PRODUCTS)
  const before = structuredClone(products)
  for (const item of products) {
    if (item.channels) Object.freeze(item.channels)
    Object.freeze(item)
  }
  Object.freeze(products)

  assert.deepEqual(filterCatalog(products, {
    store: 'fashion', category: '전체', query: '',
  }).map((item) => item.id), [1, 2, 6, 8])
  getStoreCategories(products, 'all')
  assert.deepEqual(products, before)
})
