'use client'
/**
 * AvailableCoupons.tsx — 사용 가능한 쿠폰 안내
 *
 * 사용자가 쿠폰 코드를 알 방법이 없으면 쿠폰 기능 자체가 무용지물이라
 * 장바구니/체크아웃에서 발급 가능한 쿠폰 목록과 코드를 안내합니다.
 * 코드 클릭 시 클립보드로 복사됩니다.
 */

import { MOCK_COUPONS, calculateDiscount } from '@/lib/coupons'
import { formatPrice, cn } from '@/lib/utils'
import { toast } from '@/components/ui/Toast'

interface AvailableCouponsProps {
  totalPrice: number
}

export function AvailableCoupons({ totalPrice }: AvailableCouponsProps) {
  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success(`${code} 코드를 복사했어요 📋`)
    } catch {
      toast.error('복사에 실패했어요')
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-900 dark:text-white">🎁 사용 가능한 쿠폰</p>
      <div className="space-y-2">
        {MOCK_COUPONS.map((coupon) => {
          const isEligible = !coupon.minPrice || totalPrice >= coupon.minPrice
          const discount = calculateDiscount(coupon, totalPrice)

          return (
            <div
              key={coupon.code}
              className={cn(
                'flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm transition-opacity',
                isEligible
                  ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600'
                  : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-50'
              )}
            >
              <div className="min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">{coupon.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {coupon.minPrice ? `${formatPrice(coupon.minPrice)} 이상 구매 시` : '구매 금액 제한 없음'}
                  {isEligible && discount > 0 && (
                    <span className="text-green-600 dark:text-green-400 font-medium"> · {formatPrice(discount)} 할인</span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(coupon.code)}
                disabled={!isEligible}
                className={cn(
                  'flex-shrink-0 font-mono text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors',
                  isEligible
                    ? 'border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                    : 'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                )}
              >
                {coupon.code}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
