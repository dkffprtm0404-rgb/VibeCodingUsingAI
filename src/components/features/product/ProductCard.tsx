'use client'
/**
 * ProductCard.tsx — 상품 카드 컴포넌트
 *
 * 'use client' 이유: 이미지 onError 핸들러(이벤트) 사용
 *
 * 실무 패턴:
 * - Next.js Image 컴포넌트 사용 (자동 최적화)
 * - 이미지 로드 실패 시 fallback UI 처리
 * - 품절 상태 시각적 표시
 */

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, getStockStatus } from '@/lib/utils'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // 이미지 로드 실패 상태 관리
  const [imgError, setImgError] = useState(false)

  const stockStatus = getStockStatus(product.stock)
  const isSoldOut = product.stock === 0

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-200"
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">

        {/* 이미지 로드 실패 시 fallback UI */}
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <span className="text-4xl mb-2">🛍️</span>
            <span className="text-xs">이미지 없음</span>
          </div>
        ) : (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`
              object-cover transition-transform duration-300
              group-hover:scale-105
              ${isSoldOut ? 'opacity-50' : ''}
            `}
            // 이미지 로드 실패 시 fallback 상태로 전환
            onError={() => setImgError(true)}
          />
        )}

        {/* 품절 오버레이 */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="bg-white text-gray-900 text-sm font-semibold px-3 py-1 rounded-full">
              품절
            </span>
          </div>
        )}

        {/* 카테고리 뱃지 */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary">{product.category}</Badge>
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="p-4 space-y-1">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-base font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>
        <p className={`text-xs ${stockStatus.color}`}>
          {stockStatus.label}
        </p>
      </div>
    </Link>
  )
}
