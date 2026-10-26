/**
 * app/orders/page.tsx — 주문 내역 페이지 (다크모드 지원)
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { EmptyState } from '@/components/ui/EmptyState'
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
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const typedOrders = (orders ?? []) as Order[]

  return (
    <div className="shop-page py-10 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 space-y-3 sm:mb-10">
          <p className="shop-kicker">Your wardrobe story</p>
          <h1 className="shop-heading">주문 내역</h1>
          <p className="shop-muted text-sm">총 {typedOrders.length}건의 주문</p>
        </header>

        {typedOrders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="아직 주문 내역이 없어요"
            description="마음에 드는 상품을 주문해보세요"
            actionLabel="쇼핑하러 가기"
            actionHref="/products"
          />
        ) : (
          <div className="space-y-5">
            {typedOrders.map((order) => (
              <Link key={order.id} href={`/orders/${order.id}`} className="shop-surface group block p-5 transition-shadow hover:shadow-md hover:shadow-gray-900/5 sm:p-7">
                <div>

                  {/* 주문 헤더 */}
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="shop-muted text-xs tracking-wide">
                        {new Date(order.created_at).toLocaleDateString('ko-KR')} · #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${ORDER_STATUS_COLOR[order.status]}`}>
                      {ORDER_STATUS_LABEL[order.status]}
                    </span>
                  </div>

                  {/* 상품 이미지 */}
                  <div className="mb-5 flex flex-wrap gap-2.5">
                    {order.order_items?.slice(0, 4).map((item) => (
                      <div key={item.id} className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-20 dark:bg-gray-800">
                        <Image src={item.product_image} alt={item.product_name} fill sizes="(max-width: 640px) 56px, 80px" className="object-cover" />
                      </div>
                    ))}
                    {(order.order_items?.length ?? 0) > 4 && (
                      <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 sm:h-24 sm:w-20 dark:bg-gray-800">
                        <span className="text-xs text-gray-500 dark:text-gray-400">+{(order.order_items?.length ?? 0) - 4}</span>
                      </div>
                    )}
                  </div>

                  {/* 결제 금액 */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      총 {order.order_items?.length}종
                    </p>
                    <p className="flex items-center gap-5 font-semibold tracking-tight text-gray-900 dark:text-white">
                      {formatPrice(order.total_price + order.shipping_fee)} <span aria-hidden="true" className="shop-muted text-lg transition-transform motion-safe:group-hover:translate-x-1">↗</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
