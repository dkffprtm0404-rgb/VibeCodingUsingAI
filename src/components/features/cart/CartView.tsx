'use client'
/**
 * CartView.tsx — 장바구니 페이지 뷰
 */

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { QuantitySelector } from '@/components/features/product/QuantitySelector'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

export function CartView() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">🛒</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">장바구니가 비어있어요</h2>
        <p className="text-gray-500 text-sm mb-8">마음에 드는 상품을 담아보세요!</p>
        <Link href="/products">
          <Button>쇼핑 계속하기</Button>
        </Link>
      </div>
    )
  }

  const totalPrice = getTotalPrice()
  const shippingFee = totalPrice >= 50000 ? 0 : 3000
  const remainForFreeShipping = 50000 - totalPrice

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* 왼쪽: 상품 목록 */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">상품 {items.length}종</h2>
          <button onClick={clearCart} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
            전체 삭제
          </button>
        </div>

        {items.map(({ product, quantity, selectedSize }) => (
          <div key={`${product.id}-${selectedSize ?? 'no-size'}`} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
            <Link href={`/products/${product.id}`} className="flex-shrink-0">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                <Image src={product.imageUrl} alt={product.name} fill sizes="96px" className="object-cover" />
              </div>
            </Link>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs text-gray-400">{product.category}</span>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-1 mt-0.5">
                      {product.name}
                    </h3>
                  </Link>
                  {selectedSize && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500 font-medium">
                      {selectedSize}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeItem(product.id, selectedSize)}
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-full transition-all text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <p className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</p>
              <div className="flex items-center justify-between">
                <QuantitySelector
                  value={quantity}
                  min={1}
                  max={selectedSize ? (product.sizes.find((s) => s.size === selectedSize)?.stock ?? product.stock) : product.stock}
                  onChange={(val) => updateQuantity(product.id, val, selectedSize)}
                />
                <p className="text-sm font-semibold text-gray-700">{formatPrice(product.price * quantity)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 오른쪽: 결제 요약 */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg">결제 금액</h2>

          {/* 무료배송 프로그레스 바 */}
          {shippingFee > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatPrice(remainForFreeShipping)} 더 담으면 무료배송!</span>
                <span>{formatPrice(totalPrice)} / 50,000원</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalPrice / 50000) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
          {shippingFee === 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl">
              <span className="text-green-600 text-sm">🎉</span>
              <p className="text-xs text-green-700 font-medium">무료배송 조건 달성!</p>
            </div>
          )}

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
          </div>

          <hr className="border-gray-100" />

          <div className="flex justify-between font-bold text-gray-900">
            <span>총 결제 금액</span>
            <span className="text-xl">{formatPrice(totalPrice + shippingFee)}</span>
          </div>

          <Button size="lg" className="w-full" onClick={() => router.push('/checkout')}>
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
