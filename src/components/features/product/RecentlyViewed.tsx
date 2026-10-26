'use client'
/**
 * RecentlyViewed.tsx — 최근 본 상품 섹션
 *
 * 상품 상세 페이지 하단에 표시.
 * 요즘 쇼핑몰의 표준 UX 패턴.
 */

import { useEffect } from 'react'
import { ProductCard } from './ProductCard'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

interface RecentlyViewedProps {
  currentProductId: number  // 현재 보고 있는 상품 제외용
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const { ids, addProduct } = useRecentlyViewed()

  // 현재 상품 최근 본 목록에 추가
  useEffect(() => {
    addProduct(currentProductId)
  }, [currentProductId, addProduct])

  // 현재 상품 제외하고 최대 4개
  const recentProducts = ids
    .filter((id) => id !== currentProductId)
    .slice(0, 4)
    .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean)

  if (recentProducts.length === 0) return null

  return (
    <section className="mt-12 sm:mt-16">
      <p className="shop-kicker mb-2">On your mind</p>
      <h2 className="mb-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">이 기기에서 최근 본 상품</h2>
      <div className="grid grid-cols-1 gap-4 min-[375px]:grid-cols-2 md:grid-cols-3 sm:gap-5 xl:grid-cols-4 lg:gap-6">
        {recentProducts.map((product) => (
          product && (
            <ProductCard key={product.id} product={product} />
          )
        ))}
      </div>
    </section>
  )
}
