import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

const load = createTypeScriptLoader()
const { MOCK_PRODUCTS } = load('src/lib/mock-data.ts')
const { ProductDetailTabs } = load('src/components/features/product/ProductDetailTabs.tsx')

test('a bag uses a single option and source-specific care, without unsupported clothing wash advice', () => {
  const bag = MOCK_PRODUCTS.find((p) => p.category === '가방')
  assert.deepEqual(bag.sizes.map((s) => s.size), ['FREE'])
  const markup = renderToStaticMarkup(createElement(ProductDetailTabs, { product: bag }))
  assert.ok(!markup.includes('세탁기'))
  assert.ok(!markup.includes('손세탁'))
  assert.match(markup, /상품 관리/)
})

test('beauty products use product instructions and volume labels instead of clothing care', () => {
  const beauty = MOCK_PRODUCTS.find((p) => p.channels.includes('beauty'))
  const markup = renderToStaticMarkup(createElement(ProductDetailTabs, { product: beauty }))
  assert.match(markup, /용량·구성 안내/)
  assert.match(markup, /사용 타입/)
  assert.ok(!markup.includes('세탁기'))
})
