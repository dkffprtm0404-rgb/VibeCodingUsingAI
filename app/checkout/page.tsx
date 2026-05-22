/**
 * app/checkout/page.tsx — 주문/결제 페이지 (/checkout)
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">주문/결제</h1>
        <p className="text-gray-500 text-sm mt-1">배송지 정보를 입력하고 주문을 완료해주세요</p>
      </div>
      <CheckoutForm userName={userName} />
    </div>
  )
}
