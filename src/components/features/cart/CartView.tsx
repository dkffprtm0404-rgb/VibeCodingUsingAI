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
import { AvailableCoupons } from '@/components/features/order/AvailableCoupons'
import { formatPrice, getCartQuantityLimit } from '@/lib/utils'

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
    <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
      {/* 상품 목록 */}
      <div className="min-w-0 space-y-4 lg:col-span-2">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white">상품 {items.length}종</h2>
          <button type="button" onClick={clearCart} className="shop-muted min-h-11 px-2 text-xs transition-colors hover:text-red-600 dark:hover:text-red-400">
            전체 삭제
          </button>
        </div>

        {items.map(({ product, quantity, selectedSize }) => (
          <div key={`${product.id}-${selectedSize}`}
            className="shop-surface flex min-w-0 gap-3 p-4 sm:gap-5 sm:p-6">
            <Link href={`/products/${product.id}`} className="flex-shrink-0">
              <div className="relative h-28 w-20 overflow-hidden rounded-2xl bg-gray-100 sm:h-36 sm:w-28 dark:bg-gray-800">
                <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 640px) 80px, 112px" className="object-cover" />
              </div>
            </Link>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="shop-kicker">{product.category}</span>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-6 text-gray-900 transition-colors hover:text-gray-600 dark:text-white dark:hover:text-gray-300">
                      {product.name}
                    </h3>
                  </Link>
                  {selectedSize && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">옵션: {selectedSize}</span>
                  )}
                </div>
                <button
                  onClick={() => removeItem(product.id, selectedSize)}
                  type="button"
                  aria-label={`${product.name} 상품 삭제`}
                  className="-mr-2 -mt-2 flex size-11 shrink-0 items-center justify-center rounded-full text-xl leading-none text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/30 dark:hover:text-red-300"
                >
                  ×
                </button>
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(product.price)}</p>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <QuantitySelector
                  value={quantity}
                  min={1}
                  max={getCartQuantityLimit(items, product, selectedSize)}
                  onChange={(val) => updateQuantity(product.id, val, selectedSize)}
                />
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{formatPrice(product.price * quantity)}</p>
              </div>
            </div>
          </div>
        ))}

        {/* 쿠폰 안내 — 실제 적용은 주문/결제 페이지에서 */}
        <div className="shop-surface p-5 sm:p-6">
          <AvailableCoupons totalPrice={totalPrice} />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">쿠폰은 주문/결제 페이지에서 적용할 수 있어요.</p>
        </div>
      </div>

      {/* 결제 요약 */}
      <div className="shop-sticky-summary min-w-0 lg:sticky lg:col-span-1">
        <div className="shop-surface space-y-6 p-5 sm:p-7">
          <div className="space-y-2">
            <p className="shop-kicker">Order summary</p>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">결제 금액</h2>
          </div>

          {/* 무료배송 프로그레스 */}
          {!isFreeShipping ? (
            <div className="space-y-2">
              <div className="shop-muted flex flex-wrap justify-between gap-2 text-xs leading-6">
                <span>{formatPrice(remainForFree)} 더 담으면 무료배송!</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-sage-600 transition-all duration-500 dark:bg-sage-300"
                  style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-2xl bg-sage-100 px-4 py-3 text-sage-800 dark:bg-sage-900 dark:text-sage-100">
              <span aria-hidden="true" className="text-sm">✓</span>
              <p className="text-xs font-medium">무료배송 조건 달성!</p>
            </div>
          )}

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>상품 금액</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>배송비</span>
              <span className={isFreeShipping ? 'font-medium text-sage-700 dark:text-sage-200' : ''}>
                {isFreeShipping ? '무료' : formatPrice(shippingFee)}
              </span>
            </div>
          </div>

          <hr className="border-gray-100 dark:border-gray-700" />

          <div className="flex flex-wrap items-center justify-between gap-2 font-semibold text-gray-900 dark:text-white">
            <span>총 결제 금액</span>
            <span className="text-2xl tracking-tight">{formatPrice(finalPrice)}</span>
          </div>

          <Button size="lg" className="w-full" onClick={() => router.push('/checkout')}>
            주문하기
          </Button>
          <Link href="/products" className="shop-muted flex min-h-11 items-center justify-center text-sm underline-offset-4 hover:underline">쇼핑 계속하기 →</Link>
        </div>
      </div>
    </div>
  )
}
