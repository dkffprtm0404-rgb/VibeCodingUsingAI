/**
 * Header.tsx — 공통 헤더
 *
 * Server Component: 세션 정보 읽기
 * CartIcon은 Zustand 필요 → 별도 Client Component로 분리
 */

import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import { CartIcon } from './CartIcon'
import { APP_NAME } from '@/constants'

export async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* 로고 */}
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors">
            {APP_NAME}
          </Link>

          {/* 네비게이션 */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              상품
            </Link>
          </nav>

          {/* 우측 액션 */}
          <div className="flex items-center gap-2">

            {/* 장바구니 아이콘 (로그인 시에만 표시) */}
            {session && <CartIcon />}

            {session ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:block px-2">
                  {session.user?.name ?? session.user?.email}님
                </span>
                <form
                  action={async () => {
                    'use server'
                    await signOut({ redirectTo: '/' })
                  }}
                >
                  <button
                    type="submit"
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    로그아웃
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="text-sm bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
