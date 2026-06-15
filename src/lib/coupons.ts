/**
 * coupons.ts — 쿠폰 목 데이터 + 할인 계산 로직
 *
 * 클라이언트(미리보기)와 서버(API Route) 양쪽에서 공유합니다.
 * 실제 서비스에서는 이 데이터를 DB의 coupons 테이블로 교체합니다.
 */

import type { Coupon } from '@/types/coupon'

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    label: '신규 가입 10% 할인',
    type: 'percent',
    value: 10,
    minPrice: 20000,
    maxDiscount: 5000,
  },
  {
    code: 'SAVE5000',
    label: '5,000원 즉시 할인',
    type: 'fixed',
    value: 5000,
    minPrice: 50000,
  },
  {
    code: 'WEEKEND15',
    label: '주말 특가 15% 할인',
    type: 'percent',
    value: 15,
    minPrice: 30000,
    maxDiscount: 10000,
  },
]

/**
 * 쿠폰 코드로 쿠폰 정보를 찾습니다 (대소문자 무시)
 */
export function findCoupon(code: string): Coupon | undefined {
  const normalized = code.trim().toUpperCase()
  return MOCK_COUPONS.find((c) => c.code === normalized)
}

/**
 * 쿠폰 적용 시 할인 금액을 계산합니다.
 * - 최소 주문 금액 미달 시 0원
 * - percent: maxDiscount 한도 적용
 * - fixed: 상품 금액을 초과하지 않도록 제한
 */
export function calculateDiscount(coupon: Coupon, totalPrice: number): number {
  if (coupon.minPrice && totalPrice < coupon.minPrice) return 0

  if (coupon.type === 'fixed') {
    return Math.min(coupon.value, totalPrice)
  }

  // percent
  const raw = Math.floor(totalPrice * (coupon.value / 100))
  return coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw
}

/**
 * 쿠폰 코드를 검증하고 할인 금액을 반환합니다.
 * 검증 실패 시 에러 메시지를 반환합니다.
 */
export function validateCoupon(
  code: string,
  totalPrice: number
): { coupon: Coupon; discountAmount: number } | { error: string } {
  const coupon = findCoupon(code)
  if (!coupon) return { error: '존재하지 않는 쿠폰 코드예요.' }

  if (coupon.minPrice && totalPrice < coupon.minPrice) {
    return { error: `이 쿠폰은 ${coupon.minPrice.toLocaleString()}원 이상 구매 시 사용할 수 있어요.` }
  }

  const discountAmount = calculateDiscount(coupon, totalPrice)
  return { coupon, discountAmount }
}
