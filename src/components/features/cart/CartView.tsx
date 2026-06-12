'use client'
/**
 * CartView.tsx — 장바구니 뷰 (다크모드 지원)
 */

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { useShipping } from '@/hooks/useShipping'
import { QuantitySelector } from '@/components/features/product/QuantitySelector'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatPrice } from '@/lib/utils'

export function CartView() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore()
  const totalPrice = getTotalPrice()
  const { shippingFee, finalPrice, isFreeShipping, remainForFree, progressPercent } = useShipping(totalPrice)

  if (items.length === 0) {
    return (
      <EmptyState
        icon="🛒"
        title="장바구니가 비어있어요"
        description="마음에 드는 상품을 담아보세요!"
        actionLabel="쇼핑 계속하기"
        actionHref="/products"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 상품 목록 */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">상품 {items.length}종</h2>
          <button onClick={clearCart} className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors">
            전체 삭제
          </button>
        </div>

        {items.map(({ product, quantity, selectedSize }) => (
          <div key={`${product.id}-${selectedSize}`}
            className="flex gap-4 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
            <Link href={`/products/${product.id}`} className="flex-shrink-0">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image src={product.imageUrl} alt={product.name} fill sizes="96px" className="object-cover" />
              </div>
            </Link>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{product.category}</span>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors line-clamp-1 mt-0.5">
                      {product.name}
                    </h3>
                  </Link>
                  {selectedSize && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">사이즈: {selectedSize}</span>
                  )}
                </div>
                <button
                  onClick={() => removeItem(product.id, selectedSize)}
                  aria-label="상품 삭제"
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-all text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</p>
              <div className="flex items-center justify-between">
                <QuantitySelector
                  value={quantity}
                  min={1}
                  max={product.stock}
                  onChange={(val) => updateQuantity(product.id, val, selectedSize)}
                />
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{formatPrice(product.price * quantity)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 결제 요약 */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
          <h2 className="font-bold text-gray-900 dark:text-white text-lg">결제 금액</h2>

          {/* 무료배송 프로그레스 */}
          {!isFreeShipping ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{formatPrice(remainForFree)} 더 담으면 무료배송!</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-gray-900 dark:bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-950/40 rounded-xl">
              <span className="text-green-600 text-sm">🎉</span>
              <p className="text-xs text-green-700 dark:text-green-300 font-medium">무료배송 조건 달성!</p>
            </div>
          )}

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>상품 금액</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>배송비</span>
              <span className={isFreeShipping ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
                {isFreeShipping ? '무료' : formatPrice(shippingFee)}
              </span>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-700" />

          <div className="flex justify-between font-bold text-gray-900 dark:text-white">
            <span>총 결제 금액</span>
            <span className="text-xl">{formatPrice(finalPrice)}</span>
          </div>

          <Button size="lg" className="w-full" onClick={() => router.push('/checkout')}>
            주문하기
          </Button>
          <Link href="/products">
            <Button variant="outline" size="lg" className="w-full mt-2">쇼핑 계속하기</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
