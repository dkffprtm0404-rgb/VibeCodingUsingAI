'use client'
/**
 * ProductListView.tsx — 상품 목록 뷰
 * URL 기반 스토어 + 상품 종류 + 검색 필터
 */

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { CategoryFilter } from './CategoryFilter'
import { ProductGrid } from './ProductGrid'
import { SearchBar } from './SearchBar'
import { STORE_CHANNELS, type Category } from '@/constants/catalog'
import { filterCatalog, getStoreCategories, getStoreId } from '@/lib/catalog'
import type { Product } from '@/types/product'

interface ProductListViewProps {
  products: Product[]
}

function ProductListContent({ products }: ProductListViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const store = getStoreId(searchParams.get('store'))
  const channel = STORE_CHANNELS.find((item) => item.id === store) ?? STORE_CHANNELS[0]
  const searchQuery = searchParams.get('q')?.trim() ?? ''
  const categories = getStoreCategories(products, store)
  const selectedCategory = categories.find((item) => item === searchParams.get('cat')) ?? '전체'

  const handleCategoryChange = (category: Category) => {
    const params = new URLSearchParams()
    if (store !== 'all') params.set('store', store)
    if (category !== '전체') params.set('cat', category)
    if (searchQuery) params.set('q', searchQuery)
    const query = params.toString()
    router.push(query ? `/products?${query}` : '/products')
  }

  const filteredProducts = filterCatalog(products, { store, category: selectedCategory, query: searchQuery })

  return (
    <div className="min-w-0 space-y-7 sm:space-y-9">
      <header className="mb-9 flex flex-col gap-5 border-b border-gray-200 pb-8 sm:mb-12 sm:flex-row sm:items-end sm:justify-between dark:border-gray-800">
        <div className="min-w-0 space-y-3">
          <p className="shop-kicker">{channel.eyebrow} · THE COLLECTION</p>
          <h1 className="shop-heading">{store === 'all' ? '모든 취향의 발견' : `${channel.label} 스토어`}</h1>
        </div>
        <p className="shop-muted max-w-xs text-sm leading-6">{channel.description}.<br className="hidden sm:block" /> 오늘의 셀렉션을 둘러보세요.</p>
      </header>
      {/* 검색 바 */}
      <SearchBar store={store} category={selectedCategory} storeLabel={channel.label} />

      {/* 필터 + 결과 수 */}
      <div className="flex flex-col gap-5 border-b border-gray-200 pb-6 dark:border-gray-800">
        <CategoryFilter categories={categories} selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
        <p role="status" aria-live="polite" className="shop-muted break-words text-sm">
          {searchQuery && (
            <span className="mr-2">
              <span className="font-semibold text-gray-900 dark:text-white">&quot;{searchQuery}&quot;</span> 검색 결과 ·
            </span>
          )}
          총 <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span>개의 상품
        </p>
      </div>

      {/* 검색 결과 없을 때 */}
      {filteredProducts.length === 0 && searchQuery && (
        <div className="shop-surface px-6 py-16 text-center">
          <p className="shop-kicker mb-3">No matches yet</p>
          <p className="font-semibold text-gray-900 dark:text-white mb-1">&quot;{searchQuery}&quot; 검색 결과가 없어요</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">현재 스토어에서 다른 검색어를 입력해보세요</p>
        </div>
      )}

      {!(filteredProducts.length === 0 && searchQuery) && <ProductGrid products={filteredProducts} />}
    </div>
  )
}

export function ProductListView({ products }: ProductListViewProps) {
  return (
    <Suspense fallback={<div className="shop-surface h-96 animate-pulse bg-gray-100 dark:bg-gray-800" />}>
      <ProductListContent products={products} />
    </Suspense>
  )
}
