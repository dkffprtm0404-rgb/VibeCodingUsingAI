/**
 * Header.tsx — 공통 헤더 컴포넌트
 *
 * 모든 페이지 상단에 표시되는 네비게이션 헤더입니다.
 * Server Component로 작성 (상호작용 없음).
 */

import Link from 'next/link'
import { APP_NAME } from '@/constants'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* sticky: 스크롤해도 상단에 고정 / z-50: 다른 요소 위에 표시 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* 로고 */}
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors">
            {APP_NAME}
          </Link>

          {/* 네비게이션 메뉴 */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              상품
            </Link>
            {/* 추후 추가 예정 */}
            {/* <Link href="/cart">장바구니</Link> */}
          </nav>

          {/* 우측 액션 영역 (장바구니, 로그인 등 추후 추가) */}
          <div className="flex items-center gap-3">
            <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              로그인
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
