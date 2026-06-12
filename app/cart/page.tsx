/**
 * app/cart/page.tsx — 장바구니 페이지 (다크모드 지원)
 */

import type { Metadata } from 'next'
import { CartView } from '@/components/features/cart/CartView'

export const metadata: Metadata = { title: '장바구니' }

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">장바구니</h1>
      <CartView />
    </div>
  )
}
