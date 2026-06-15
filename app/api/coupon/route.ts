/**
 * app/api/coupon/route.ts — 쿠폰 검증 API
 *
 * POST /api/coupon
 * 쿠폰 코드와 주문 금액을 받아 유효성을 검증하고 할인 금액을 반환합니다.
 *
 * 실제 할인은 /api/orders 에서 서버가 다시 검증/계산합니다.
 * (클라이언트 값은 신뢰하지 않는 패턴 — orders API와 동일)
 */

import { NextResponse } from 'next/server'
import { validateCoupon } from '@/lib/coupons'

export async function POST(request: Request) {
  try {
    const { code, totalPrice } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: '쿠폰 코드를 입력해주세요.' }, { status: 400 })
    }
    if (typeof totalPrice !== 'number' || totalPrice <= 0) {
      return NextResponse.json({ error: '주문 금액이 올바르지 않아요.' }, { status: 400 })
    }

    const result = validateCoupon(code, totalPrice)
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      code: result.coupon.code,
      label: result.coupon.label,
      discountAmount: result.discountAmount,
    })
  } catch {
    return NextResponse.json({ error: '쿠폰 확인 중 오류가 발생했어요.' }, { status: 500 })
  }
}
