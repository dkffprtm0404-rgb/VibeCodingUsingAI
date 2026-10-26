'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatPrice, getStockStatus, cn } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { toast } from '@/components/ui/Toast'
import { CRITICAL_STOCK_THRESHOLD, LOW_STOCK_THRESHOLD } from '@/constants'
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
  const optionLabel = product.optionLabel ?? '사이즈 선택'

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
    <article className="shop-surface group relative min-w-0 overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-900/5">
      <Link href={`/products/${product.id}`} className="block h-full">
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
          {imgError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500 dark:text-gray-400">
              <span className="text-3xl" aria-hidden="true">◇</span>
              <span className="text-xs">이미지 없음</span>
            </div>
          ) : (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 374px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn('object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]', isSoldOut && 'opacity-50')}
              onError={() => setImgError(true)}
            />
          )}
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-medium tracking-wide text-gray-800 backdrop-blur-sm dark:bg-gray-950/90 dark:text-gray-200">
            {product.category}
          </span>
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-semibold tracking-widest text-gray-900 dark:bg-gray-950/95 dark:text-white">SOLD OUT</span>
            </div>
          )}
          {!isSoldOut && product.stock <= CRITICAL_STOCK_THRESHOLD && (
            <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-medium text-gray-800 dark:bg-gray-950/90 dark:text-gray-200">잔여 {product.stock}개</span>
          )}
        </div>
        <div className="space-y-2 p-3.5 sm:p-5">
          {product.brand && <p className="truncate text-[10px] font-semibold tracking-wide text-gray-600 dark:text-gray-300">{product.brand}</p>}
          <h3 className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-gray-900 dark:text-white">{product.name}</h3>
          <p className="text-sm font-semibold tracking-tight text-gray-900 sm:text-base dark:text-white">{formatPrice(product.price)}</p>
          <p className={cn('text-[11px] font-medium', isSoldOut ? 'text-red-700 dark:text-red-300' : product.stock <= LOW_STOCK_THRESHOLD ? 'text-orange-700 dark:text-orange-300' : 'text-sage-700 dark:text-sage-200')}>{stockStatus.label}</p>
        </div>
      </Link>
      {!isSoldOut && (
        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={isAdding}
          aria-label={`${product.name} ${hasSingleSize ? '빠른 담기' : optionLabel}`}
          title={isAdding ? '담는 중...' : hasSingleSize ? '빠른 담기' : optionLabel}
          className="absolute right-2 top-2 flex size-11 items-center justify-center rounded-full border border-white/50 bg-white/95 text-gray-900 shadow-sm backdrop-blur-sm transition-colors hover:bg-gray-900 hover:text-white disabled:opacity-60 dark:border-gray-700 dark:bg-gray-950/95 dark:text-white dark:hover:bg-white dark:hover:text-gray-900"
        >
          <span aria-hidden="true" className="text-xl font-light leading-none">{isAdding ? '✓' : '+'}</span>
        </button>
      )}
    </article>
  )
}
