/**
 * Header.tsx — 공통 헤더 (Supabase Auth 버전)
 */

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CartIcon } from './CartIcon'
import { LogoutButton } from './LogoutButton'
import { APP_NAME } from '@/constants'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // user_metadata에서 이름 가져오기 (없으면 이메일 앞부분)
  const displayName = user?.user_metadata?.name
    ?? user?.email?.split('@')[0]
    ?? '유저'

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors">
            {APP_NAME}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              상품
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <CartIcon />
                <span className="text-sm text-gray-600 hidden sm:block px-2">
                  {displayName}님
                </span>
                {/* 로그아웃은 Client Component로 분리 */}
                <LogoutButton />
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
