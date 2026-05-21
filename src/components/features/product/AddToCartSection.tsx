'use client'
/**
 * AddToCartSection.tsx — 장바구니 담기 섹션 (Client Component)
 *
 * 실무 패턴:
 * - 로그인 여부를 체크해서 미로그인 시 로그인 페이지로 이동
 * - isLoggedIn prop을 Server Component(page.tsx)에서 받아옴
 *   (Client Component에서 직접 세션 읽으면 불필요한 클라이언트 번들 증가)
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuantitySelector } from './QuantitySelector'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

interface AddToCartSectionProps {
  productId: number
  productName: string
  price: number
  stock: number
  isLoggedIn: boolean // Server Component에서 세션 체크 후 전달
}

export function AddToCartSection({
  productId,
  productName,
  price,
  stock,
  isLoggedIn,
}: AddToCartSectionProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const isSoldOut = stock === 0
  const totalPrice = price * quantity

  const handleAddToCart = async () => {
    // 미로그인 상태 → 로그인 페이지로 이동 (현재 페이지 callbackUrl로 전달)
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/products/${productId}`)
      return
    }

    setIsLoading(true)

    /**
     * TODO: 실제 장바구니 API 연동
     * await fetch('/api/cart', {
     *   method: 'POST',
     *   body: JSON.stringify({ productId, quantity }),
     * })
     */
    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsLoading(false)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)

    console.log(`장바구니 담기: ${productName} / 수량 ${quantity}`)
  }

  if (isSoldOut) {
    return (
      <div className="w-full py-4 text-center bg-gray-100 rounded-xl text-gray-500 font-medium">
        품절된 상품입니다
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
          <span className="text-sm text-gray-500">최대 {stock}개 구매 가능</span>
        </div>
      </div>

      {/* 총 가격 */}
      <div className="flex items-center justify-between py-4 border-t border-b border-gray-100">
        <span className="text-sm text-gray-600">총 상품 금액</span>
        <span className="text-xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
      </div>

      {/* 장바구니 담기 버튼 */}
      <Button
        size="lg"
        className="w-full"
        isLoading={isLoading}
        onClick={handleAddToCart}
      >
        {isAdded
          ? '✓ 담겼어요!'
          : isLoggedIn
            ? '장바구니 담기'
            : '로그인 후 구매하기' // 미로그인 시 버튼 텍스트 변경
        }
      </Button>

    </div>
  )
}
