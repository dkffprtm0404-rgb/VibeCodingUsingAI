'use client'
/**
 * CheckoutForm.tsx — 주문/결제 폼
 * useShipping 훅 + ordersApi 적용
 * 쿠폰 적용 시 상품금액에서 할인 차감 후 배송비 합산
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { useShipping } from '@/hooks/useShipping'
import { Button } from '@/components/ui/Button'
import { CouponInput } from './CouponInput'
import { AvailableCoupons } from './AvailableCoupons'
import { formatPrice } from '@/lib/utils'
import { ordersApi, ApiError } from '@/lib/api'
import type { AppliedCoupon } from '@/types/coupon'

interface ShippingInfo {
  name: string
  phone: string
  address: string
  addressDetail: string
  memo: string
}

interface CheckoutFormProps {
  userName: string
}

export function CheckoutForm({ userName }: CheckoutFormProps) {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const totalPrice = getTotalPrice()
  // 배송비는 쿠폰 할인 전 상품 금액 기준 (서버와 동일한 정책)
  const { shippingFee, isFreeShipping } = useShipping(totalPrice)

  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)
  const discountAmount = appliedCoupon?.discountAmount ?? 0
  // 쿠폰 할인 적용 후 최종 결제 금액
  const finalPrice = Math.max(totalPrice - discountAmount, 0) + shippingFee

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: userName,
    phone: '',
    address: '',
    addressDetail: '',
    memo: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange =
    (field: keyof ShippingInfo) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setShippingInfo((prev) => ({ ...prev, [field]: e.target.value }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      setError('배송지 정보를 모두 입력해주세요.')
      return
    }

    setIsLoading(true)
    try {
      const { orderId } = await ordersApi.create({
        items,
        shippingInfo,
        totalPrice,
        shippingFee,
        couponCode: appliedCoupon?.code ?? null,
      })
      clearCart()
      router.push(`/orders/${orderId}`)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '주문 처리 중 오류가 발생했어요.')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = 'shop-input'

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300'

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">

        {/* 배송지 + 상품 확인 */}
        <div className="min-w-0 space-y-5 lg:col-span-2">

          {/* 배송지 */}
          <section className="shop-surface space-y-5 p-5 sm:p-8">
            <div className="mb-6 space-y-2">
              <p className="shop-kicker">01 · Delivery</p>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">배송지 정보</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="shipping-name" className={labelClass}>받는 분 <span className="text-red-500">*</span></label>
                <input id="shipping-name" autoComplete="shipping name" type="text" value={shippingInfo.name} onChange={handleChange('name')}
                  placeholder="이름을 입력해주세요" required className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="shipping-phone" className={labelClass}>연락처 <span className="text-red-500">*</span></label>
                <input id="shipping-phone" autoComplete="shipping tel" type="tel" value={shippingInfo.phone} onChange={handleChange('phone')}
                  placeholder="010-0000-0000" required className={inputClass} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="shipping-address" className={labelClass}>주소 <span className="text-red-500">*</span></label>
              <input id="shipping-address" autoComplete="shipping address-line1" type="text" value={shippingInfo.address} onChange={handleChange('address')}
                placeholder="도로명 주소를 입력해주세요" required className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="shipping-address-detail" className={labelClass}>상세 주소</label>
              <input id="shipping-address-detail" autoComplete="shipping address-line2" type="text" value={shippingInfo.addressDetail} onChange={handleChange('addressDetail')}
                placeholder="아파트 동/호수, 상세 주소" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="shipping-memo" className={labelClass}>배송 메모</label>
              <select id="shipping-memo" value={shippingInfo.memo} onChange={handleChange('memo')} className={inputClass}>
                <option value="">배송 메모를 선택해주세요</option>
                <option value="문 앞에 놔주세요">문 앞에 놔주세요</option>
                <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                <option value="부재 시 연락주세요">부재 시 연락주세요</option>
                <option value="직접 수령할게요">직접 수령할게요</option>
              </select>
            </div>
          </section>

          {/* 주문 상품 */}
          <section className="shop-surface space-y-5 p-5 sm:p-8">
            <div className="space-y-2">
              <p className="shop-kicker">02 · Your pieces</p>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">주문 상품 <span className="shop-muted text-sm font-normal">{items.length}종</span></h2>
            </div>
            <div className="space-y-3">
              {items.map(({ product, quantity, selectedSize }) => (
                <div key={`${product.id}-${selectedSize}`}
                  className="grid grid-cols-[64px_minmax(0,1fr)] items-start gap-x-4 gap-y-2 border-b border-gray-100 py-4 last:border-0 sm:grid-cols-[80px_minmax(0,1fr)_auto] dark:border-gray-800">
                  <div className="relative row-span-2 h-20 w-16 overflow-hidden rounded-xl bg-gray-100 sm:row-span-1 sm:h-24 sm:w-20 dark:bg-gray-800">
                    <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 640px) 64px, 80px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {quantity}개 {selectedSize && `/ 옵션: ${selectedSize}`}
                    </p>
                  </div>
                  <p className="col-start-2 text-sm font-semibold text-gray-900 sm:col-start-auto dark:text-white">{formatPrice(product.price * quantity)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 쿠폰 — 사용 가능한 쿠폰 안내 + 입력 */}
          <section className="shop-surface space-y-5 p-5 sm:p-8">
            <p className="shop-kicker">03 · A little extra</p>
            <AvailableCoupons totalPrice={totalPrice} />
            <hr className="border-gray-100 dark:border-gray-800" />
            <CouponInput totalPrice={totalPrice} onApply={setAppliedCoupon} />
          </section>
        </div>

        {/* 결제 요약 */}
        <div className="shop-sticky-summary min-w-0 lg:sticky lg:col-span-1">
          <div className="shop-surface space-y-6 p-5 sm:p-7">
            <div className="space-y-2">
              <p className="shop-kicker">Order summary</p>
              <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">결제 금액</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>상품 금액</span><span>{formatPrice(totalPrice)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sage-700 dark:text-sage-200">
                  <span>쿠폰 할인</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
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
            {error && (
              <div role="alert" className="px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400">⚠️ {error}</p>
              </div>
            )}
            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              {formatPrice(finalPrice)} 결제하기
            </Button>
            <p className="shop-muted text-center text-xs leading-6">주문 내용을 확인하였으며 결제에 동의합니다.</p>
          </div>
        </div>

      </div>
    </form>
  )
}
