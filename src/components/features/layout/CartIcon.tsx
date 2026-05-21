'use client'
/**
 * CartIcon.tsx — 헤더 장바구니 아이콘 (Client Component)
 *
 * Zustand 스토어에서 수량을 읽어야 해서 Client Component로 분리합니다.
 * 헤더 전체를 Client로 만들지 않고 이 부분만 분리하는 게 실무 패턴이에요.
 */

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export function CartIcon() {
  // getTotalCount만 구독 → 수량 변경 시에만 리렌더링
  const totalCount = useCartStore((state) => state.getTotalCount())

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="장바구니"
    >
      {/* 장바구니 아이콘 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-700"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {/* 수량 뱃지: 상품이 있을 때만 표시 */}
      {totalCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
                         flex items-center justify-center
                         bg-black text-white text-[10px] font-bold
                         rounded-full leading-none">
          {totalCount > 99 ? '99+' : totalCount}
        </span>
      )}
    </Link>
  )
}
