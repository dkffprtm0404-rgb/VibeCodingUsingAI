/**
 * app/cart/page.tsx — 장바구니 페이지 (다크모드 지원)
 */

import type { Metadata } from 'next'
import { CartView } from '@/components/features/cart/CartView'

export const metadata: Metadata = { title: '장바구니' }

export default function CartPage() {
  return (
    <div className="shop-page py-10 sm:py-14">
      <header className="mb-8 space-y-3 sm:mb-10">
        <p className="shop-kicker">Your selection</p>
        <h1 className="shop-heading">장바구니</h1>
        <p className="shop-muted text-sm">마음에 담은 취향, 이제 나의 일상으로.</p>
      </header>
      <CartView />
    </div>
  )
}
