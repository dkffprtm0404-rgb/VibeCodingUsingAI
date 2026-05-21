'use client'
/**
 * AddToCartSection.tsx — 장바구니 담기 섹션 (Client Component)
 *
 * 'use client' 이유:
 * - 수량 상태(useState) 관리
 * - 버튼 클릭 이벤트 처리
 *
 * 실무 패턴:
 * - 상세 페이지(Server Component)에서 상호작용 부분만 분리
 * - 추후 전역 장바구니 상태(Zustand)와 연결 예정
 */

import { useState } from 'react'
import { QuantitySelector } from './QuantitySelector'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

interface AddToCartSectionProps {
  productId: number
  productName: string
  price: number
  stock: number
}

export function AddToCartSection({
  productId,
  productName,
  price,
  stock,
}: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const isSoldOut = stock === 0
  // 총 가격 = 단가 × 수량
  const totalPrice = price * quantity

  const handleAddToCart = async () => {
    setIsLoading(true)

    /**
     * 실무에서는 여기서 API 호출:
     * await fetch('/api/cart', {
     *   method: 'POST',
     *   body: JSON.stringify({ productId, quantity }),
     * })
     *
     * 지금은 setTimeout으로 API 호출 흉내냄 (UX 흐름 확인용)
     */
    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsLoading(false)
    setIsAdded(true)

    // 2초 후 버튼 원상복구
    setTimeout(() => setIsAdded(false), 2000)

    console.log(`장바구니 담기: 상품 ${productId} / 수량 ${quantity}`)
  }

  if (isSoldOut) {
    return (
      <div className="space-y-4">
        <div className="w-full py-4 text-center bg-gray-100 rounded-xl text-gray-500 font-medium">
          품절된 상품입니다
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* 수량 선택 */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">수량</p>
        <div className="flex items-center gap-4">
          <QuantitySelector
            value={quantity}
            min={1}
            max={stock}
            onChange={setQuantity}
          />
          <span className="text-sm text-gray-500">
            최대 {stock}개 구매 가능
          </span>
        </div>
      </div>

      {/* 총 가격 */}
      <div className="flex items-center justify-between py-4 border-t border-b border-gray-100">
        <span className="text-sm text-gray-600">총 상품 금액</span>
        <span className="text-xl font-bold text-gray-900">
          {formatPrice(totalPrice)}
        </span>
      </div>

      {/* 장바구니 담기 버튼 */}
      <Button
        size="lg"
        className="w-full"
        isLoading={isLoading}
        onClick={handleAddToCart}
      >
        {isAdded ? '✓ 담겼어요!' : '장바구니 담기'}
      </Button>
    </div>
  )
}
