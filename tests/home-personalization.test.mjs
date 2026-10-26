import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createTypeScriptLoader } from './helpers/load-typescript.mjs'

function product(id, stock = 5) {
  return {
    id, name: `상품 ${id}`, price: id * 1000, imageUrl: `/catalog/${id}.jpg`,
    images: [`/catalog/${id}.jpg`], category: '상의', description: '상품 설명',
    detailDescription: '상세 설명', material: '면', fit: '레귤러', stock,
    sizes: [{ size: 'M', measurements: '총장 70cm', stock }],
  }
}

const CATALOG = [product(1), product(2, 0), product(3), product(4), product(5), product(6)]

function profile(productIds) {
  return {
    ownerId: 'alice', createdAt: 1234,
    result: {
      type: '편안한 미니멀', emoji: '🌿', description: '일상에 어울리는 스타일이에요.',
      keywords: ['미니멀'], coordi: '셔츠와 팬츠를 함께 입어보세요.',
      productIds, tip: '차분한 색을 매치해보세요.',
    },
  }
}

function renderHome(currentProfile) {
  const load = createTypeScriptLoader({
    'next/link': 'a',
    'next/image': () => null,
    '@/components/features/layout/HeroShaderBackground': { HeroShaderBackground: () => null },
    // The product card boundary exposes which real products HomeDashboard selected.
    '@/components/features/product/ProductCard': {
      ProductCard: ({ product: item }) => createElement('article', { 'data-product-id': item.id }, item.name),
    },
    '@/hooks/usePersonalization': { usePersonalization: () => ({ profile: currentProfile, clearProfile: () => {} }) },
    '@/hooks/useRecentlyViewed': { useRecentlyViewed: () => ({ ids: [] }) },
  })
  const { HomeDashboard } = load('src/components/features/home/HomeDashboard.tsx')
  return renderToStaticMarkup(createElement(HomeDashboard, { products: CATALOG, userName: 'Alice' }))
}

function selectedIds(markup) {
  return [...markup.matchAll(/data-product-id="(\d+)"/g)].map((match) => Number(match[1]))
}

test('home preserves the AI product order and links its featured selection to the first recommendation', () => {
  const markup = renderHome(profile([4, 1, 3]))
  assert.deepEqual(selectedIds(markup), [4, 1, 3])
  assert.match(markup, /href="\/products\/4"[^>]*>나의 추천 상품 보기/)
  assert.match(markup, /Your AI selection/)
})

test('home omits sold-out and missing recommendations while keeping the order of available products', () => {
  const markup = renderHome(profile([2, 4, 999, 1]))
  assert.deepEqual(selectedIds(markup), [4, 1])
  assert.match(markup, /href="\/products\/4"[^>]*>나의 추천 상품 보기/)
})

test('home without a diagnosis fills the expanded editor selection with available products', () => {
  const markup = renderHome(null)
  assert.deepEqual(selectedIds(markup), [1, 3, 4, 5, 6])
  assert.match(markup, /href="\/products\/1"[^>]*>셀렉션 둘러보기/)
  assert.ok(!markup.includes('Your AI selection'))
})

for (const ids of [[], [2, 999]]) {
  test(`home keeps the diagnosis but uses editor selections when recommendations are unavailable: ${JSON.stringify(ids)}`, () => {
    const markup = renderHome(profile(ids))
    assert.deepEqual(selectedIds(markup), [1, 3, 4, 5, 6])
    assert.match(markup, /편안한 미니멀/)
    assert.match(markup, /진단 결과의 상품을 지금 구매하기 어려워요/)
    assert.ok(!markup.includes('Your AI selection'))
  })
}

test('home renders each recommended product once when persisted IDs repeat, preserving their first occurrence', () => {
  const markup = renderHome(profile([4, 4, 1, 3, 1]))
  assert.deepEqual(selectedIds(markup), [4, 1, 3])
})
