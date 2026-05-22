'use client'
/**
 * ProductCard.tsx — 상품 카드 컴포넌트
 */

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, getStockStatus } from '@/lib/utils'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false)
  const stockStatus = getStockStatus(product.stock)
  const isSoldOut = product.stock === 0

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200"
    >
      {/* 이미지 */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
            <span className="text-4xl mb-1">🛍️</span>
            <span className="text-xs">이미지 없음</span>
          </div>
        ) : (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isSoldOut ? 'opacity-50' : ''}`}
            onError={() => setImgError(true)}
          />
        )}

        {/* 품절 오버레이 */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200">
              SOLD OUT
            </span>
          </div>
        )}

        {/* 품절 임박 뱃지 */}
        {!isSoldOut && product.stock <= 5 && (
          <div className="absolute top-2 right-2">
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              LAST {product.stock}
            </span>
          </div>
        )}

        {/* 카테고리 뱃지 */}
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-gray-200">
            {product.category}
          </span>
        </div>
      </div>

      {/* 상품 정보 */}
      <div className="p-4 space-y-1.5">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>
          <p className={`text-[11px] font-medium ${stockStatus.color}`}>
            {stockStatus.label}
          </p>
        </div>
      </div>
    </Link>
  )
}
