'use client'
/**
 * AddToCartSection.tsx — 장바구니 담기 섹션
 * Zustand 스토어와 연결해서 실제로 장바구니에 상품을 추가합니다.
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuantitySelector } from './QuantitySelector'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types/product'

interface AddToCartSectionProps {
  product: Product
  isLoggedIn: boolean
}

export function AddToCartSection({ product, isLoggedIn }: AddToCartSectionProps) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)

  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const isSoldOut = product.stock === 0
  const totalPrice = product.price * quantity

  const handleAddToCart = () => {
    // 미로그인 → 로그인 페이지로
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/products/${product.id}`)
      return
    }

    // Zustand 스토어에 상품 추가
    addItem(product, quantity)

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
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
          <QuantitySelector value={quantity} min={1} max={product.stock} onChange={setQuantity} />
          <span className="text-sm text-gray-500">최대 {product.stock}개 구매 가능</span>
        </div>
      </div>

      {/* 총 가격 */}
      <div className="flex items-center justify-between py-4 border-t border-b border-gray-100">
        <span className="text-sm text-gray-600">총 상품 금액</span>
        <span className="text-xl font-bold text-gray-900">{formatPrice(totalPrice)}</span>
      </div>

      {/* 장바구니 담기 버튼 */}
      <Button size="lg" className="w-full" onClick={handleAddToCart}>
        {isAdded ? '✓ 담겼어요!' : isLoggedIn ? '장바구니 담기' : '로그인 후 구매하기'}
      </Button>

    </div>
  )
}
