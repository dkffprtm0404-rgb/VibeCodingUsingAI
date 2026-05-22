/**
 * app/orders/page.tsx — 주문 내역 페이지 (/orders)
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/types/order'
import type { Metadata } from 'next'
import type { Order } from '@/types/order'

export const metadata: Metadata = { title: '주문 내역' }

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  const typedOrders = (orders ?? []) as Order[]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">주문 내역</h1>

      {typedOrders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-gray-500 font-medium">아직 주문 내역이 없어요</p>
          <Link href="/products" className="mt-6 inline-block">
            <Button>쇼핑하러 가기</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {typedOrders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-400 hover:shadow-sm transition-all duration-150">

                {/* 주문 헤더 */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400 font-mono">
                      {new Date(order.created_at).toLocaleDateString('ko-KR')} · #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${ORDER_STATUS_COLOR[order.status]}`}>
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                </div>

                {/* 주문 상품 미리보기 */}
                <div className="flex gap-2 mb-4">
                  {order.order_items?.slice(0, 4).map((item) => (
                    <div key={item.id} className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={item.product_image} alt={item.product_name} fill sizes="56px" className="object-cover" />
                    </div>
                  ))}
                  {(order.order_items?.length ?? 0) > 4 && (
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-gray-500">+{(order.order_items?.length ?? 0) - 4}</span>
                    </div>
                  )}
                </div>

                {/* 결제 금액 */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    총 {order.order_items?.length}종
                  </p>
                  <p className="font-bold text-gray-900">
                    {formatPrice(order.total_price + order.shipping_fee)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
