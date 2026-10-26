import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { test } from 'node:test'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

const load = createTypeScriptLoader()
const { MOCK_PRODUCTS } = load('src/lib/mock-data.ts')
const { STORE_CHANNELS, CATEGORIES } = load('src/constants/catalog.ts')
const { matchesStore } = load('src/lib/catalog.ts')

test('the demo catalog fills every store with at least four products and uses unique IDs', () => {
  assert.ok(MOCK_PRODUCTS.length >= 34)
  assert.equal(new Set(MOCK_PRODUCTS.map((p) => p.id)).size, MOCK_PRODUCTS.length)
  for (const store of STORE_CHANNELS.filter((s) => s.id !== 'all')) {
    assert.ok(MOCK_PRODUCTS.filter((p) => matchesStore(p, store.id)).length >= 4, store.id)
  }
})

test('every catalog photo is a local image with a valid signature and its original source', () => {
  for (const product of MOCK_PRODUCTS) {
    assert.ok(CATEGORIES.includes(product.category), product.name)
    assert.ok(product.images.length > 0)
    assert.equal(product.images[0], product.imageUrl)
    assert.match(product.imageSource?.url ?? '', /^https:\/\/www\.musinsa\.com\/(snap\/\d+|products\/\d+)/)
    for (const url of product.images) {
      assert.match(url, /^\/catalog\/[a-z0-9-]+\.jpg$/)
      const file = resolve('public', url.slice(1))
      assert.ok(existsSync(file), file)
      const bytes = readFileSync(file)
      assert.ok(bytes.length > 1024)
      const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8
      const isPng = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
      const isWebp = bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP'
      assert.ok(isJpeg || isPng || isWebp, `${product.name}: unsupported image`)
    }
  }
})

test('expanded products retain valid options and the original eight price/stock contracts', () => {
  const original = [
    [29000, 50, [10,20,15,5]], [59000, 30, [8,12,7,3]],
    [79000, 20, [5,8,5,2]], [45000, 15, [3,6,4,2]],
    [65000, 25, [5,10,7,3]], [120000, 10, [2,4,3,1]],
    [89000, 0, [0,0,0,0]], [35000, 3, [1,1,1,0]],
  ]
  original.forEach(([price, stock, sizes], index) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === index + 1)
    assert.equal(product.price, price)
    assert.equal(product.stock, stock)
    assert.deepEqual(product.sizes.map((s) => s.stock), sizes)
  })
  for (const product of MOCK_PRODUCTS) {
    assert.ok(product.sizes.length > 0)
    assert.equal(new Set(product.sizes.map((s) => s.size)).size, product.sizes.length)
    assert.equal(product.sizes.reduce((sum, s) => sum + s.stock, 0), product.stock)
    assert.ok(product.sizes.every((s) => Number.isInteger(s.stock) && s.stock >= 0))
  }
})
