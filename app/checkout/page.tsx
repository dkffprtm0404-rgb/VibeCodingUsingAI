/**
 * app/checkout/page.tsx — 주문/결제 페이지 (다크모드 지원)
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CheckoutForm } from '@/components/features/order/CheckoutForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '주문/결제' }

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?callbackUrl=/checkout')

  const userName = user.user_metadata?.name ?? ''

  return (
    <div className="shop-page py-10 sm:py-14">
      <header className="mb-8 space-y-3 sm:mb-10">
        <p className="shop-kicker">A little closer to yours</p>
        <h1 className="shop-heading">주문/결제</h1>
        <p className="shop-muted text-sm">배송지 정보를 입력하고 주문을 완료해주세요.</p>
      </header>
      <CheckoutForm userName={userName} />
    </div>
  )
}
