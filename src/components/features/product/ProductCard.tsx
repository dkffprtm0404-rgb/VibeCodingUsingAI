'use client'
/**
 * ProductCard.tsx — 상품 카드
 *
 * 개선:
 * - hover 시 Quick Add 버튼 표시 (요즘 쇼핑몰 표준 UX)
 * - Toast 알림 연동
 */

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrice, getStockStatus, cn } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { toast } from '@/components/ui/Toast'
import { CRITICAL_STOCK_THRESHOLD } from '@/constants'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  isLoggedIn?: boolean
}

export function ProductCard({ product, isLoggedIn = false }: ProductCardProps) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const [imgError, setImgError] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const stockStatus = getStockStatus(product.stock)
  const isSoldOut = product.stock === 0
  // 사이즈가 1개인 경우 Quick Add 가능
  const hasSingleSize = product.sizes.length === 1

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault() // Link 클릭 방지
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/products/${product.id}`)
      return
    }
    setIsAdding(true)
    // 사이즈가 여러 개면 상세 페이지로 이동
    if (!hasSingleSize) {
      router.push(`/products/${product.id}`)
      return
    }
    addItem(product, 1, product.sizes[0].size)
    toast.success(`${product.name}을(를) 담았어요 🛒`)
    setTimeout(() => setIsAdding(false), 1000)
  }

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
            className={cn(
              'object-cover transition-transform duration-500 group-hover:scale-105',
              isSoldOut && 'opacity-50'
            )}
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
        {!isSoldOut && product.stock <= CRITICAL_STOCK_THRESHOLD && (
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

        {/* Quick Add 버튼 — hover 시 하단에서 올라옴 */}
        {!isSoldOut && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="w-full py-2.5 bg-gray-900/90 backdrop-blur-sm text-white text-xs font-semibold hover:bg-gray-900 transition-colors disabled:opacity-70"
            >
              {isAdding ? '담는 중...' : hasSingleSize ? '빠른 담기' : '사이즈 선택'}
            </button>
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="p-4 space-y-1.5">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-gray-900">{formatPrice(product.price)}</p>
          <p className={cn('text-[11px] font-medium', stockStatus.color)}>
            {stockStatus.label}
          </p>
        </div>
      </div>
    </Link>
  )
}
