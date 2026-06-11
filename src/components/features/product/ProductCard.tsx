'use client'
/**
 * ProductCard.tsx — 상품 카드 (다크모드 지원)
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
  const hasSingleSize = product.sizes.length === 1

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/products/${product.id}`)
      return
    }
    setIsAdding(true)
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
      className="group block bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-600 hover:shadow-md transition-all duration-200"
    >
      <div className="relative aspect-square bg-gray-50 dark:bg-gray-800 overflow-hidden">
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 dark:text-gray-600">
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

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-gray-800 dark:text-white text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700">
              SOLD OUT
            </span>
          </div>
        )}

        {!isSoldOut && product.stock <= CRITICAL_STOCK_THRESHOLD && (
          <div className="absolute top-2 right-2">
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              LAST {product.stock}
            </span>
          </div>
        )}

        <div className="absolute top-2 left-2">
          <span className="bg-white/90 dark:bg-black/70 backdrop-blur-sm text-gray-700 dark:text-gray-300 text-[10px] font-semibold px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700">
            {product.category}
          </span>
        </div>

        {!isSoldOut && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="w-full py-2.5 bg-gray-900/90 dark:bg-white/90 backdrop-blur-sm text-white dark:text-gray-900 text-xs font-semibold hover:bg-gray-900 dark:hover:bg-white transition-colors disabled:opacity-70"
            >
              {isAdding ? '담는 중...' : hasSingleSize ? '빠른 담기' : '사이즈 선택'}
            </button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-1.5">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</p>
          <p className={cn('text-[11px] font-medium', stockStatus.color)}>{stockStatus.label}</p>
        </div>
      </div>
    </Link>
  )
}
