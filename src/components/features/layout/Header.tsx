/**
 * Header.tsx — 공통 헤더 컴포넌트
 *
 * Server Component: 세션 정보를 서버에서 읽어서 로그인 상태 표시
 * 로그인 여부에 따라 "로그인" 버튼 또는 유저 이름 + 로그아웃 표시
 */

import Link from 'next/link'
import { auth, signOut } from '@/lib/auth'
import { APP_NAME } from '@/constants'

export async function Header() {
  // 서버에서 세션 정보 읽기
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

          {/* 우측: 로그인 상태에 따라 다르게 표시 */}
          <div className="flex items-center gap-3">
            {session ? (
              // 로그인 상태
              <>
                <span className="text-sm text-gray-600 hidden sm:block">
                  {session.user?.name ?? session.user?.email}님
                </span>
                {/* signOut은 Server Action으로 처리 */}
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
              // 미로그인 상태
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                로그인
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
