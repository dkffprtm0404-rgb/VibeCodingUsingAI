'use client'
/**
 * RecentlyViewed.tsx — 최근 본 상품 섹션
 *
 * 상품 상세 페이지 하단에 표시.
 * 요즘 쇼핑몰의 표준 UX 패턴.
 */

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { formatPrice } from '@/lib/utils'

interface RecentlyViewedProps {
  currentProductId: number  // 현재 보고 있는 상품 제외용
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const { ids, addProduct } = useRecentlyViewed()

  // 현재 상품 최근 본 목록에 추가
  useEffect(() => {
    addProduct(currentProductId)
  }, [currentProductId]) // eslint-disable-line react-hooks/exhaustive-deps

  // 현재 상품 제외하고 최대 4개
  const recentProducts = ids
    .filter((id) => id !== currentProductId)
    .slice(0, 4)
    .map((id) => MOCK_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean)

  if (recentProducts.length === 0) return null

  return (
    <div className="mt-16">
      <h2 className="text-xl font-bold text-gray-900 mb-6">최근 본 상품</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {recentProducts.map((product) => (
          product && (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3 space-y-1">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                <p className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</p>
              </div>
            </Link>
          )
        ))}
      </div>
    </div>
  )
}
