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

  const inputClass =
    'flex-1 px-4 py-3 rounded-xl border text-sm outline-none transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500 ' +
    'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white ' +
    'focus:border-gray-900 dark:focus:border-white focus:ring-2 focus:ring-gray-900/8 dark:focus:ring-white/10'

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-900 dark:text-white">쿠폰</p>

      {appliedCoupon ? (
        <div className="flex items-center justify-between px-4 py-3 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-base">🎁</span>
            <div>
              <p className="text-sm font-medium text-green-800 dark:text-green-300">{appliedCoupon.label}</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                -{formatPrice(appliedCoupon.discountAmount)} 할인 적용됨
              </p>
            </div>
          </div>
          <button
            onClick={remove}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
          >
            취소
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-2">
            <input
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
