'use client'
/**
 * AddToCartSection.tsx — 사이즈 선택 + 장바구니 담기 (다크모드 지원)
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
      toast.error('사이즈를 선택해주세요')
      return
    }
    addItem(product, quantity, selectedSize.size)
    toast.success(`${product.name}을(를) 담았어요 🛒`)
  }

  if (isSoldOut) {
    return (
      <div className="w-full py-4 text-center bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-500 dark:text-gray-400 font-medium">
        현재 품절된 상품입니다
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* 사이즈 선택 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">사이즈 선택</p>
          {sizeError && <p className="text-xs text-red-500 font-medium">사이즈를 선택해주세요</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          {product.sizes.map((sizeInfo) => {
            const isSelected = selectedSize?.size === sizeInfo.size
            const isOutOfStock = sizeInfo.stock === 0
            const isCritical = !isOutOfStock && sizeInfo.stock <= CRITICAL_STOCK_THRESHOLD

            return (
              <button
                key={sizeInfo.size}
                onClick={() => handleSizeSelect(sizeInfo)}
                disabled={isOutOfStock}
                className={cn(
                  'relative px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150',
                  isSelected
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                    : isOutOfStock
                      ? 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 border-gray-200 dark:border-gray-700 cursor-not-allowed line-through'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-400'
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
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {selectedSize.size} 사이즈 실측
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {selectedSize.measurements}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              잔여 재고: {selectedSize.stock}개
            </p>
          </div>
        )}
      </div>

      {/* 수량 선택 */}
      {selectedSize && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">수량</p>
          <div className="flex items-center gap-4">
            <QuantitySelector value={quantity} min={1} max={selectedSize.stock} onChange={setQuantity} />
            <span className="text-sm text-gray-400 dark:text-gray-500">최대 {selectedSize.stock}개</span>
          </div>
        </div>
      )}

      {/* 총 가격 */}
      <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 dark:border-gray-800">
        <span className="text-sm text-gray-600 dark:text-gray-400">총 상품 금액</span>
        <span className="text-xl font-bold text-gray-900 dark:text-white">{formatPrice(totalPrice)}</span>
      </div>

      <Button size="lg" className="w-full" onClick={handleAddToCart}>
        {isLoggedIn ? '장바구니 담기' : '로그인 후 구매하기'}
      </Button>
    </div>
  )
}
