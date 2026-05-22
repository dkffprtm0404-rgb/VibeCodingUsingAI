'use client'
/**
 * ProductListView.tsx — 상품 목록 뷰 (Client Component)
 */

import { useState } from 'react'
import { CategoryFilter } from './CategoryFilter'
import { ProductGrid } from './ProductGrid'
import { type Category } from '@/lib/mock-data'
import type { Product } from '@/types/product'

interface ProductListViewProps {
  products: Product[]
}

export function ProductListView({ products }: ProductListViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('전체')

  const filteredProducts =
    selectedCategory === '전체'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* 필터 + 상품 수 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <p className="text-sm text-gray-500 order-2 sm:order-1">
          총 <span className="font-semibold text-gray-900">{filteredProducts.length}</span>개의 상품
        </p>
        <div className="order-1 sm:order-2">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      <ProductGrid products={filteredProducts} />
    </div>
  )
}
