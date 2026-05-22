'use client'
/**
 * ProductListView.tsx — 상품 목록 뷰
 * 검색 + 카테고리 필터 동시 지원
 */

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { CategoryFilter } from './CategoryFilter'
import { ProductGrid } from './ProductGrid'
import { SearchBar } from './SearchBar'
import { type Category } from '@/lib/mock-data'
import type { Product } from '@/types/product'

interface ProductListViewProps {
  products: Product[]
}

function ProductListContent({ products }: ProductListViewProps) {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q')?.toLowerCase() ?? ''
  const [selectedCategory, setSelectedCategory] = useState<Category>('전체')

  // 카테고리 + 검색어 동시 필터링
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === '전체' || p.category === selectedCategory
    const matchSearch = searchQuery === '' || p.name.toLowerCase().includes(searchQuery)
    return matchCategory && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* 검색 바 */}
      <SearchBar />

      {/* 필터 + 결과 수 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <p className="text-sm text-gray-500 order-2 sm:order-1">
          {searchQuery && (
            <span className="mr-2">
              <span className="font-semibold text-gray-900">&quot;{searchQuery}&quot;</span> 검색 결과 ·
            </span>
          )}
          총 <span className="font-semibold text-gray-900">{filteredProducts.length}</span>개의 상품
        </p>
        <div className="order-1 sm:order-2">
          <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </div>
      </div>

      {/* 검색 결과 없을 때 */}
      {filteredProducts.length === 0 && searchQuery && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold text-gray-900 mb-1">&quot;{searchQuery}&quot; 검색 결과가 없어요</p>
          <p className="text-sm text-gray-500">다른 검색어를 입력해보세요</p>
        </div>
      )}

      <ProductGrid products={filteredProducts} />
    </div>
  )
}

export function ProductListView({ products }: ProductListViewProps) {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse bg-gray-50 rounded-2xl" />}>
      <ProductListContent products={products} />
    </Suspense>
  )
}
