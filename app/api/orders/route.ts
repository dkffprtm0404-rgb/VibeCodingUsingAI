/**
 * app/api/orders/route.ts — 주문 생성 API
 *
 * POST /api/orders
 * 장바구니 상품들을 DB에 주문으로 저장합니다.
 *
 * 실무 패턴:
 * - 주문 생성은 반드시 서버에서 (가격 위변조 방지)
 * - orders 테이블 생성 후 order_items 일괄 삽입
 * - 실제 서비스에서는 결제 API 연동 후 주문 생성
 */

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

const SHIPPING_FEE = 3000
const FREE_SHIPPING_THRESHOLD = 50000

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 로그인 확인
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 })
    }

    const { items, shippingInfo } = await request.json()

    if (!items?.length) {
      return NextResponse.json({ error: '주문 상품이 없어요.' }, { status: 400 })
    }

    // 클라이언트가 보낸 가격을 신뢰하지 않고 서버에서 직접 재계산
    const computedTotalPrice = items.reduce((sum: number, item: { product: { id: number }; quantity: number }) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === item.product.id)
      if (!product) return sum
      return sum + product.price * item.quantity
    }, 0)

    if (computedTotalPrice === 0) {
      return NextResponse.json({ error: '유효한 상품이 없어요.' }, { status: 400 })
    }

    const computedShippingFee = computedTotalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE

    // Admin 클라이언트 사용 (RLS 우회해서 insert)
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 1단계: orders 테이블에 주문 생성
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

    // 2단계: order_items 일괄 삽입 (가격도 서버 데이터 기준)
    const orderItems = items.flatMap((item: { product: { id: number }; quantity: number }) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === item.product.id)
      if (!product) return []
      return [{
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_image: product.imageUrl,
        quantity: item.quantity,
      }]
    })

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
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ orders })
  } catch {
    return NextResponse.json({ error: '주문 내역을 불러오지 못했어요.' }, { status: 500 })
  }
}
