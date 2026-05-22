'use client'
/**
 * CartIcon.tsx — 헤더 장바구니 아이콘
 *
 * Hydration 오류 해결 패턴:
 * Zustand persist(localStorage)는 서버에서 읽을 수 없어요.
 * 서버: count=0, 클라이언트: count=N → HTML 불일치 → Hydration 오류
 *
 * 해결: isMounted 상태로 클라이언트에서만 뱃지 렌더링
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export function CartIcon() {
  // 클라이언트 마운트 여부 — false일 때는 뱃지 숨김
  const [isMounted, setIsMounted] = useState(false)
  const totalCount = useCartStore((state) => state.getTotalCount())

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="장바구니"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20" height="20"
        viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="text-gray-700"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {/* isMounted 확인 후에만 뱃지 렌더링 */}
      {isMounted && totalCount > 0 && (
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
