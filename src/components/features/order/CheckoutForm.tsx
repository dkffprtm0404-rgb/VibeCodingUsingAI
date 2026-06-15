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

  const inputClass =
    'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ' +
    'bg-white dark:bg-gray-800 ' +
    'border-gray-200 dark:border-gray-600 ' +
    'text-gray-900 dark:text-white ' +
    'placeholder:text-gray-400 dark:placeholder:text-gray-500 ' +
    'focus:border-gray-900 dark:focus:border-white focus:ring-2 focus:ring-gray-900/8 dark:focus:ring-white/10'

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300'

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 배송지 + 상품 확인 */}
        <div className="lg:col-span-2 space-y-6">

          {/* 배송지 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">배송지 정보</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>받는 분 <span className="text-red-500">*</span></label>
                <input type="text" value={shippingInfo.name} onChange={handleChange('name')}
                  placeholder="이름을 입력해주세요" required className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>연락처 <span className="text-red-500">*</span></label>
                <input type="tel" value={shippingInfo.phone} onChange={handleChange('phone')}
                  placeholder="010-0000-0000" required className={inputClass} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>주소 <span className="text-red-500">*</span></label>
              <input type="text" value={shippingInfo.address} onChange={handleChange('address')}
                placeholder="도로명 주소를 입력해주세요" required className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>상세 주소</label>
              <input type="text" value={shippingInfo.addressDetail} onChange={handleChange('addressDetail')}
                placeholder="아파트 동/호수, 상세 주소" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>배송 메모</label>
              <select value={shippingInfo.memo} onChange={handleChange('memo')} className={inputClass}>
                <option value="">배송 메모를 선택해주세요</option>
                <option value="문 앞에 놔주세요">문 앞에 놔주세요</option>
                <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                <option value="부재 시 연락주세요">부재 시 연락주세요</option>
                <option value="직접 수령할게요">직접 수령할게요</option>
              </select>
            </div>
          </div>

          {/* 주문 상품 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">주문 상품 ({items.length}종)</h2>
            <div className="space-y-3">
              {items.map(({ product, quantity, selectedSize }) => (
                <div key={`${product.id}-${selectedSize}`}
                  className="flex gap-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                    <Image src={product.imageUrl} alt={product.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {quantity}개 {selectedSize && `/ 사이즈: ${selectedSize}`}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(product.price * quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 쿠폰 — 데스크탑에서는 좌측 컬럼, 모바일에서도 결제 요약 위에 위치 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <CouponInput totalPrice={totalPrice} onApply={setAppliedCoupon} />
          </div>
        </div>

        {/* 결제 요약 */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-5">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg">결제 금액</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>상품 금액</span><span>{formatPrice(totalPrice)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>쿠폰 할인</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
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
            {error && (
              <div className="px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400">⚠️ {error}</p>
              </div>
            )}
            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              {formatPrice(finalPrice)} 결제하기
            </Button>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">주문 내용을 확인하였으며 결제에 동의합니다.</p>
          </div>
        </div>

      </div>
    </form>
  )
}
