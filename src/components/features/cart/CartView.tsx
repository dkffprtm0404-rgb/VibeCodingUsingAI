'use client'
/**
 * CartView.tsx — 장바구니 페이지 뷰 (Client Component)
 *
 * Zustand 스토어에서 장바구니 데이터를 읽어서 표시합니다.
 * 수량 변경, 상품 삭제, 전체 금액 계산을 담당합니다.
 */

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { QuantitySelector } from '@/components/features/product/QuantitySelector'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

export function CartView() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore()

  // 장바구니가 비어있을 때
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">장바구니가 비어있어요</h2>
        <p className="text-gray-500 text-sm mb-8">마음에 드는 상품을 담아보세요!</p>
        <Link href="/products">
          <Button>쇼핑 계속하기</Button>
        </Link>
      </div>
    )
  }

  const totalPrice = getTotalPrice()
  // 배송비: 5만원 이상 무료
  const SHIPPING_THRESHOLD = 50000
  const shippingFee = totalPrice >= SHIPPING_THRESHOLD ? 0 : 3000

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* 왼쪽: 상품 목록 */}
      <div className="lg:col-span-2 space-y-4">

        {/* 헤더 */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">
            상품 {items.length}종
          </h2>
          <button
            onClick={clearCart}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            전체 삭제
          </button>
        </div>

        {/* 상품 리스트 */}
        {items.map(({ product, quantity }) => (
          <div
            key={product.id}
            className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
          >
            {/* 상품 이미지 */}
            <Link href={`/products/${product.id}`} className="flex-shrink-0">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            </Link>

            {/* 상품 정보 */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                {/* 삭제 버튼 */}
                <button
                  onClick={() => removeItem(product.id)}
                  className="flex-shrink-0 text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                  aria-label="상품 삭제"
                >
                  ×
                </button>
              </div>

              <p className="text-sm font-bold text-gray-900">
                {formatPrice(product.price)}
              </p>

              {/* 수량 + 소계 */}
              <div className="flex items-center justify-between">
                <QuantitySelector
                  value={quantity}
                  min={1}
                  max={product.stock}
                  onChange={(val) => updateQuantity(product.id, val)}
                />
                <p className="text-sm font-semibold text-gray-700">
                  {formatPrice(product.price * quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽: 결제 요약 */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-bold text-gray-900 text-lg">결제 금액</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>상품 금액</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>배송비</span>
              <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                {shippingFee === 0 ? '무료' : formatPrice(shippingFee)}
              </span>
            </div>
            {/* 무료배송 기준 안내 */}
            {shippingFee > 0 && (
              <p className="text-xs text-gray-400">
                {formatPrice(SHIPPING_THRESHOLD - totalPrice)} 더 담으면 무료배송!
              </p>
            )}
          </div>

          <hr className="border-gray-100" />

          <div className="flex justify-between font-bold text-gray-900">
            <span>총 결제 금액</span>
            <span className="text-lg">{formatPrice(totalPrice + shippingFee)}</span>
          </div>

          {/* 주문하기 버튼 (추후 구현) */}
          <Button size="lg" className="w-full">
            주문하기
          </Button>

          <Link href="/products">
            <Button variant="outline" size="lg" className="w-full mt-2">
              쇼핑 계속하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
