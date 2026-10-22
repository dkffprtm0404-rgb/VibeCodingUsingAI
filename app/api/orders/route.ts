/**
 * app/api/orders/route.ts — 주문 생성 API
 *
 * POST /api/orders
 * 장바구니 상품들을 DB에 주문으로 저장합니다.
 *
 * 실무 패턴:
 * - 주문 생성은 반드시 서버에서 (가격 위변조 방지)
 * - orders 테이블 생성 후 order_items 일괄 삽입
 * - 쿠폰도 서버에서 재검증 후 할인 적용 (클라이언트 값 신뢰 안 함)
 * - 실제 서비스에서는 결제 API 연동 후 주문 생성
 */

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { validateCoupon } from '@/lib/coupons'
import { validateOrderRequest } from '@/lib/order-validation'
import { SHIPPING_FEE, SHIPPING_THRESHOLD } from '@/constants'
import { validateJsonMutation } from '@/lib/request-security'

export async function POST(request: Request) {
  const blocked = validateJsonMutation(request)
  if (blocked) return blocked
  try {
    const supabase = await createClient()

    // 로그인 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: '주문 요청 형식을 확인해주세요.' }, { status: 400 })
    }
    const validation = validateOrderRequest(body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }
    const { items, shippingInfo, couponCode } = validation.data

    // 클라이언트가 보낸 가격을 신뢰하지 않고 서버에서 직접 재계산
    const productTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    // 배송비는 할인 전 상품 금액 기준으로 계산
    const computedShippingFee = productTotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE

    // 쿠폰 서버 재검증 — 클라이언트가 보낸 할인 금액은 신뢰하지 않음
    let discountAmount = 0
    if (couponCode) {
      const result = validateCoupon(couponCode, productTotal)
      if ('discountAmount' in result) {
        discountAmount = result.discountAmount
      }
      // 쿠폰이 유효하지 않으면 할인 없이 진행 (주문 자체는 막지 않음)
    }

    const computedTotalPrice = Math.max(productTotal - discountAmount, 0)

    // Admin 클라이언트 사용 (RLS 우회해서 insert)
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 1단계: orders 테이블에 주문 생성 (total_price는 쿠폰 할인 적용된 값)
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .insert({
        user_id: user.id,
        total_price: computedTotalPrice,
        shipping_fee: computedShippingFee,
        receiver_name: shippingInfo.name,
        receiver_phone: shippingInfo.phone,
        receiver_address: shippingInfo.address,
        receiver_address_detail: shippingInfo.addressDetail || null,
        memo: shippingInfo.memo || null,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // 2단계: order_items 일괄 삽입 (가격도 서버 데이터 기준, 할인 전 단가)
    const orderItems = items.map(({ product, quantity }) => ({
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_image: product.imageUrl,
        quantity,
    }))

    const { error: itemsError } = await adminClient
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return NextResponse.json({ orderId: order.id }, { status: 201 })
  } catch (error) {
    console.error('주문 생성 오류:', error)
    return NextResponse.json({ error: '주문 처리 중 오류가 발생했어요.' }, { status: 500 })
  }
}

// 주문 목록 조회
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ orders })
  } catch {
    return NextResponse.json({ error: '주문 내역을 불러오지 못했어요.' }, { status: 500 })
  }
}
