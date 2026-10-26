'use client'
/**
 * CouponInput.tsx — 쿠폰 코드 입력 및 적용 UI
 *
 * 적용 전: 입력창 + 적용 버튼
 * 적용 후: 쿠폰명 + 할인금액 + 취소 버튼
 *
 * appliedCoupon 변경은 useEffect로 부모에 전달합니다.
 * (렌더링 중 setState 호출은 React 규칙 위반이라 effect로 분리)
 */

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { useCoupon } from '@/hooks/useCoupon'
import type { AppliedCoupon } from '@/types/coupon'

interface CouponInputProps {
  totalPrice: number
  onApply: (coupon: AppliedCoupon | null) => void
}

export function CouponInput({ totalPrice, onApply }: CouponInputProps) {
  const { code, setCode, appliedCoupon, isLoading, error, apply, remove } = useCoupon(totalPrice)

  // 적용된 쿠폰이 바뀔 때마다 부모(CheckoutForm)에 알림
  useEffect(() => {
    onApply(appliedCoupon)
  }, [appliedCoupon, onApply])

  const inputClass = 'shop-input min-w-0 flex-1'

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-900 dark:text-white">쿠폰</p>

      {appliedCoupon ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sage-200 bg-sage-100 px-4 py-4 dark:border-sage-800 dark:bg-sage-900">
          <div className="flex items-center gap-2">
            <span className="text-base">🎁</span>
            <div>
              <p className="text-sm font-medium text-sage-800 dark:text-sage-100">{appliedCoupon.label}</p>
              <p className="mt-1 text-xs text-sage-700 dark:text-sage-200">
                -{formatPrice(appliedCoupon.discountAmount)} 할인 적용됨
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={remove}
            className="shop-muted min-h-11 shrink-0 px-3 text-xs transition-colors hover:text-red-600 dark:hover:text-red-400"
          >
            취소
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <label htmlFor="coupon-code" className="sr-only">쿠폰 코드</label>
            <input
              id="coupon-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); apply() } }}
              placeholder="쿠폰 코드를 입력해주세요"
              className={inputClass}
            />
            <Button type="button" variant="outline" onClick={apply} isLoading={isLoading}>
              적용
            </Button>
          </div>
          {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
        </>
      )}
    </div>
  )
}
