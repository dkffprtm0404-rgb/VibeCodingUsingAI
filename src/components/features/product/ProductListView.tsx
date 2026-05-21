'use client'
/**
 * ProductListView.tsx — 상품 목록 뷰 컴포넌트 (Client Component)
 *
 * 실무 패턴 - 역할 분리:
 * - app/products/page.tsx (Server Component): 데이터 fetch
 * - ProductListView.tsx (Client Component): 필터 상태 관리 + UI 렌더링
 *
 * 왜 분리하나요?
 * 필터(useState) 때문에 'use client'가 필요한데,
 * 최대한 작은 범위만 Client로 만들어야 성능에 좋습니다.
 * 데이터 fetch는 Server에서, 상호작용만 Client에서 처리합니다.
 */

import { useState } from 'react'
import { CategoryFilter } from './CategoryFilter'
import { ProductGrid } from './ProductGrid'
import { CATEGORIES, type Category } from '@/lib/mock-data'
import type { Product } from '@/types/product'

interface ProductListViewProps {
  // 상품 데이터는 Server Component(page.tsx)에서 받아옵니다
  products: Product[]
}

export function ProductListView({ products }: ProductListViewProps) {
  // 선택된 카테고리 상태 (기본값: '전체')
  // useState<Category>: 타입을 명시해서 잘못된 값 할당 방지
  const [selectedCategory, setSelectedCategory] = useState<Category>('전체')

  // 카테고리 필터링 로직
  // '전체' 선택 시 전체 상품, 아니면 해당 카테고리 상품만 필터링
  const filteredProducts =
    selectedCategory === '전체'
      ? products
      : products.filter((product) => product.category === selectedCategory)

  return (
    <div className="space-y-6">
      {/* 상단 헤더 영역: 상품 수 + 필터 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          총 <span className="font-semibold text-gray-900">{filteredProducts.length}</span>개의 상품
        </p>

        {/* 카테고리 필터 */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          // setSelectedCategory를 직접 넘겨도 됩니다 (타입이 일치하므로)
        />
      </div>

      {/* 상품 그리드 */}
      <ProductGrid products={filteredProducts} />
    </div>
  )
}
