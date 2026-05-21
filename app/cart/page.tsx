/**
 * app/cart/page.tsx — 장바구니 페이지 (/cart)
 *
 * middleware.ts에서 로그인 체크를 하므로
 * 이 페이지는 항상 로그인된 상태에서만 접근 가능합니다.
 */

import type { Metadata } from 'next'
import { CartView } from '@/components/features/cart/CartView'

export const metadata: Metadata = {
  title: '장바구니',
}

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">장바구니</h1>
      <CartView />
    </div>
  )
}
