'use client'
/**
 * AddToCartSection.tsx — 사이즈 선택 + 장바구니 담기
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuantitySelector } from './QuantitySelector'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/utils'
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
  const [isAdded, setIsAdded] = useState(false)
  const [sizeError, setSizeError] = useState(false)

  const isSoldOut = product.stock === 0
  const maxQuantity = selectedSize ? selectedSize.stock : product.stock
  const totalPrice = product.price * quantity

  const handleSizeSelect = (size: SizeInfo) => {
    if (size.stock === 0) return
    setSelectedSize(size)
    setSizeError(false)
    setQuantity(1) // 사이즈 변경 시 수량 초기화
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/products/${product.id}`)
      return
    }
    // 사이즈 선택 안 했을 때
    if (!selectedSize) {
      setSizeError(true)
      return
    }

    addItem(product, quantity, selectedSize.size)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  if (isSoldOut) {
    return (
      <div className="w-full py-4 text-center bg-gray-100 rounded-2xl text-gray-500 font-medium">
        현재 품절된 상품입니다
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* 사이즈 선택 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">사이즈 선택</p>
          {sizeError && (
            <p className="text-xs text-red-500 font-medium">사이즈를 선택해주세요</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {product.sizes.map((sizeInfo) => {
            const isSelected = selectedSize?.size === sizeInfo.size
            const isOutOfStock = sizeInfo.stock === 0

            return (
              <button
                key={sizeInfo.size}
                onClick={() => handleSizeSelect(sizeInfo)}
                disabled={isOutOfStock}
                className={cn(
                  'relative px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150',
                  isSelected
                    ? 'bg-gray-900 text-white border-gray-900'
                    : isOutOfStock
                      ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed line-through'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-500'
                )}
              >
                {sizeInfo.size}
                {/* 재고 부족 표시 */}
                {!isOutOfStock && sizeInfo.stock <= 3 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-orange-400 rounded-full border-2 border-white" />
                )}
              </button>
            )
          })}
        </div>

        {/* 선택된 사이즈 치수 정보 */}
        {selectedSize && (
          <div className="px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-700 mb-1">{selectedSize.size} 사이즈 실측</p>
            <p className="text-xs text-gray-500 leading-relaxed">{selectedSize.measurements}</p>
            <p className="text-xs text-gray-400 mt-1">잔여 재고: {selectedSize.stock}개</p>
          </div>
        )}
      </div>

      {/* 수량 선택 */}
      {selectedSize && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-900">수량</p>
          <div className="flex items-center gap-4">
            <QuantitySelector
              value={quantity}
              min={1}
              max={selectedSize.stock}
              onChange={setQuantity}
            />
            <span className="text-sm text-gray-400">최대 {selectedSize.stock}개</span>
          </div>
        </div>
      )}

      {/* 총 가격 */}
      <div className="flex items-center justify-between py-4 border-t border-b border-gray-100">
        <span className="text-sm text-gray-600">총 상품 금액</span>
        <span className="text-xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
      </div>

      {/* 장바구니 담기 */}
      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
      >
        {isAdded
          ? '✓ 담겼어요!'
          : isLoggedIn
            ? '장바구니 담기'
            : '로그인 후 구매하기'
        }
      </Button>
    </div>
  )
}
