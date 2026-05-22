/**
 * app/orders/[id]/page.tsx — 주문 완료/상세 페이지
 */

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/types/order'
import type { Metadata } from 'next'
import type { Order } from '@/types/order'

export const metadata: Metadata = { title: '주문 완료' }

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()

  if (error || !order) notFound()

  const typedOrder = order as Order

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

      {/* 완료 헤더 */}
      <div className="text-center mb-10 space-y-3">
        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">주문이 완료됐어요!</h1>
        <p className="text-gray-500 text-sm">주문번호: <span className="font-mono text-gray-700">{typedOrder.id.slice(0, 8).toUpperCase()}</span></p>
      </div>

      {/* 주문 상태 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">주문 상태</h2>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${ORDER_STATUS_COLOR[typedOrder.status]}`}>
            {ORDER_STATUS_LABEL[typedOrder.status]}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          주문일시: {new Date(typedOrder.created_at).toLocaleString('ko-KR')}
        </p>
      </div>

      {/* 주문 상품 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
        <h2 className="font-bold text-gray-900 mb-4">주문 상품</h2>
        <div className="space-y-3">
          {typedOrder.order_items?.map((item) => (
            <div key={item.id} className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <Image src={item.product_image} alt={item.product_name} fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.quantity}개</p>
              </div>
              <p className="text-sm font-bold">{formatPrice(item.product_price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 배송지 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
        <h2 className="font-bold text-gray-900 mb-4">배송지 정보</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="font-medium text-gray-900">{typedOrder.receiver_name}</span> · {typedOrder.receiver_phone}</p>
          <p>{typedOrder.receiver_address}</p>
          {typedOrder.receiver_address_detail && <p>{typedOrder.receiver_address_detail}</p>}
          {typedOrder.memo && <p className="text-gray-400">메모: {typedOrder.memo}</p>}
        </div>
      </div>

      {/* 결제 금액 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-4">결제 금액</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>상품 금액</span>
            <span>{formatPrice(typedOrder.total_price)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>배송비</span>
            <span>{typedOrder.shipping_fee === 0 ? '무료' : formatPrice(typedOrder.shipping_fee)}</span>
          </div>
          <hr className="border-gray-100 my-2" />
          <div className="flex justify-between font-bold text-gray-900">
            <span>총 결제 금액</span>
            <span>{formatPrice(typedOrder.total_price + typedOrder.shipping_fee)}</span>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/orders" className="flex-1">
          <Button variant="outline" size="lg" className="w-full">주문 내역 보기</Button>
        </Link>
        <Link href="/products" className="flex-1">
          <Button size="lg" className="w-full">쇼핑 계속하기</Button>
        </Link>
      </div>
    </div>
  )
}
