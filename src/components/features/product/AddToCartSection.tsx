'use client'
/**
 * AddToCartSection.tsx — 사이즈 선택 + 장바구니 담기 (다크모드 밝은 텍스트)
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuantitySelector } from './QuantitySelector'
import { Button } from '@/components/ui/Button'
import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { toast } from '@/components/ui/Toast'
import { CRITICAL_STOCK_THRESHOLD } from '@/constants'
import type { Product, SizeInfo } from '@/types/product'

interface AddToCartSectionProps {
  product: Product
  isLoggedIn: boolean
}

export function AddToCartSection({ product, isLoggedIn }: AddToCartSectionProps) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)

  const [selectedSize, setSelectedSize] = useState<SizeInfo | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)

  const isSoldOut = product.stock === 0
  const totalPrice = product.price * quantity
  const optionLabel = product.optionLabel ?? '사이즈 선택'
  const optionError = `${optionLabel}이 필요해요`

  const handleSizeSelect = (size: SizeInfo) => {
    if (size.stock === 0) return
    setSelectedSize(size)
    setSizeError(false)
    setQuantity(1)
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/products/${product.id}`)
      return
    }
    if (!selectedSize) {
      setSizeError(true)
      toast.error(optionError)
      return
    }
    addItem(product, quantity, selectedSize.size)
    toast.success(`${product.name}을(를) 담았어요 🛒`)
  }

  if (isSoldOut) {
    return (
      <div className="w-full py-4 text-center bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-500 dark:text-gray-300 font-medium">
        현재 품절된 상품입니다
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* 사이즈 선택 */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{optionLabel}</p>
          {sizeError && <p role="alert" className="text-xs text-red-500 font-medium">{optionError}</p>}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label={optionLabel}>
          {product.sizes.map((sizeInfo) => {
            const isSelected = selectedSize?.size === sizeInfo.size
            const isOutOfStock = sizeInfo.stock === 0
            const isCritical = !isOutOfStock && sizeInfo.stock <= CRITICAL_STOCK_THRESHOLD

            return (
              <button
                key={sizeInfo.size}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${sizeInfo.size} ${optionLabel}${isOutOfStock ? ' 품절' : isCritical ? ` 잔여 ${sizeInfo.stock}개` : ''}`}
                onClick={() => handleSizeSelect(sizeInfo)}
                disabled={isOutOfStock}
                className={cn(
                  'relative min-h-12 min-w-14 px-4 py-3 rounded-2xl border text-sm font-medium transition-colors duration-150',
                  isSelected
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                    : isOutOfStock
                      ? 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed line-through'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-100 border-gray-200 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-300'
                )}
              >
                {sizeInfo.size}
                {isCritical && (
                  <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-orange-400 rounded-full border-2 border-white dark:border-gray-900" />
                )}
              </button>
            )
          })}
        </div>

        {selectedSize && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-xs font-semibold text-gray-700 dark:text-white mb-1">
              {selectedSize.size} · 옵션 정보
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-200 leading-relaxed">
              {selectedSize.measurements}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">
              잔여 재고: {selectedSize.stock}개
            </p>
          </div>
        )}
      </div>

      {/* 수량 선택 */}
      {selectedSize && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">수량</p>
          <div className="flex flex-wrap items-center gap-4">
            <QuantitySelector value={quantity} min={1} max={selectedSize.stock} onChange={setQuantity} />
            <span className="text-sm text-gray-400 dark:text-gray-400">최대 {selectedSize.stock}개</span>
          </div>
        </div>
      )}

      {/* 총 가격 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-gray-200 py-5 dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-300">총 상품 금액</span>
        <span className="text-xl font-bold text-gray-900 dark:text-white">{formatPrice(totalPrice)}</span>
      </div>

      <Button size="lg" className="w-full" onClick={handleAddToCart}>
        {isLoggedIn ? '장바구니 담기' : '로그인 후 구매하기'}
      </Button>
    </div>
  )
}
