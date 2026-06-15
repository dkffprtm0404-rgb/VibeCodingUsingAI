/**
 * coupon.ts — 쿠폰 관련 타입 정의
 */

export type CouponType = 'percent' | 'fixed'

export interface Coupon {
  code: string          // 쿠폰 코드 (대문자로 비교)
  label: string          // 표시용 이름
  type: CouponType        // 할인 방식
  value: number           // percent: 0~100, fixed: 원 단위 금액
  minPrice?: number        // 최소 주문 금액 (없으면 제한 없음)
  maxDiscount?: number      // percent 할인 시 최대 할인 한도 (원)
}

export interface AppliedCoupon {
  code: string
  label: string
  discountAmount: number
}
