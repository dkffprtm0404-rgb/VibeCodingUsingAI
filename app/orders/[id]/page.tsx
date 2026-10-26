/**
 * app/orders/[id]/page.tsx — 주문 완료/상세 페이지 (다크모드 지원)
 */

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/types/order'
import type { Metadata } from 'next'
import type { Order } from '@/types/order'

export const metadata: Metadata = { title: '주문 완료' }

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: order, error } = await supabase
    .from('orders').select('*, order_items(*)').eq('user_id', user.id).eq('id', id).single()

  if (error || !order) notFound()
  const typedOrder = order as Order

  const cardClass = 'shop-surface p-5 sm:p-7'

  return (
    <div className="shop-page py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">

        {/* 완료 헤더 */}
        <div className="mb-10 space-y-4 text-center">
          <p className="shop-kicker">Thank you for your order</p>
          <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-sage-100 text-sage-800 dark:bg-sage-900 dark:text-sage-100">
            <svg aria-hidden="true" className="size-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="shop-heading">주문이 완료됐어요!</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            주문번호: <span className="font-mono text-gray-700 dark:text-gray-300">{typedOrder.id.slice(0, 8).toUpperCase()}</span>
          </p>
        </div>

        {/* 주문 상태 */}
        <div className={`${cardClass} mb-4`}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-bold text-gray-900 dark:text-white">주문 상태</h2>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${ORDER_STATUS_COLOR[typedOrder.status]}`}>
              {ORDER_STATUS_LABEL[typedOrder.status]}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            주문일시: {new Date(typedOrder.created_at).toLocaleString('ko-KR')}
          </p>
        </div>

        {/* 주문 상품 */}
        <div className={`${cardClass} mb-4`}>
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">주문 상품</h2>
          <div className="space-y-3">
            {typedOrder.order_items?.map((item) => (
              <div key={item.id} className="grid grid-cols-[64px_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-gray-100 py-4 last:border-0 sm:grid-cols-[80px_minmax(0,1fr)_auto] dark:border-gray-800">
                <div className="relative row-span-2 h-20 w-16 overflow-hidden rounded-xl bg-gray-100 sm:row-span-1 sm:h-24 sm:w-20 dark:bg-gray-800">
                  <Image src={item.product_image} alt={item.product_name} fill sizes="(max-width: 640px) 64px, 80px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.product_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.quantity}개</p>
                </div>
                <p className="col-start-2 text-sm font-semibold text-gray-900 sm:col-start-auto dark:text-white">{formatPrice(item.product_price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 배송지 */}
        <div className={`${cardClass} mb-4`}>
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">배송지 정보</h2>
          <div className="space-y-2 break-words text-sm leading-7 text-gray-600 dark:text-gray-300">
            <p><span className="font-medium text-gray-900 dark:text-white">{typedOrder.receiver_name}</span> · {typedOrder.receiver_phone}</p>
            <p>{typedOrder.receiver_address}</p>
            {typedOrder.receiver_address_detail && <p>{typedOrder.receiver_address_detail}</p>}
            {typedOrder.memo && <p className="text-gray-400 dark:text-gray-500">메모: {typedOrder.memo}</p>}
          </div>
        </div>

        {/* 결제 금액 */}
        <div className={`${cardClass} mb-8`}>
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">결제 금액</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>상품 금액</span>
              <span>{formatPrice(typedOrder.total_price)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-300">
              <span>배송비</span>
              <span>{typedOrder.shipping_fee === 0 ? '무료' : formatPrice(typedOrder.shipping_fee)}</span>
            </div>
            <hr className="border-gray-100 dark:border-gray-700 my-2" />
            <div className="flex flex-wrap justify-between gap-2 pt-2 font-semibold text-gray-900 dark:text-white">
              <span>총 결제 금액</span>
              <span className="text-xl tracking-tight">{formatPrice(typedOrder.total_price + typedOrder.shipping_fee)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/orders" className="flex min-h-12 flex-1 items-center justify-center rounded-full border border-gray-300 px-5 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">주문 내역 보기</Link>
          <Link href="/products" className="shop-primary-link flex-1">쇼핑 계속하기</Link>
        </div>
      </div>
    </div>
  )
}
