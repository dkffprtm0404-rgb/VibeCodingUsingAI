/**
 * Header.tsx — 공통 헤더 (모바일 메뉴 포함)
 */

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CartIcon } from './CartIcon'
import { LogoutButton } from './LogoutButton'
import { MobileMenu } from './MobileMenu'
import { APP_NAME } from '@/constants'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const displayName = user?.user_metadata?.name ?? user?.email?.split('@')[0] ?? '유저'

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link href="/" className="text-xl font-black text-gray-900 tracking-tight hover:text-gray-600 transition-colors">
            {APP_NAME}
          </Link>

          {/* 데스크탑 네비 */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">상품</Link>
            {user && (
              <>
                <Link href="/mypage/wishlist" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">찜목록</Link>
                <Link href="/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">주문내역</Link>
              </>
            )}
          </nav>

          {/* 우측 액션 */}
          <div className="flex items-center gap-1">
            {user ? (
              <>
                <CartIcon />
                <div className="hidden md:flex items-center gap-1 ml-1">
                  <span className="text-sm text-gray-600 px-2">{displayName}님</span>
                  <LogoutButton />
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all">
                  로그인
                </Link>
                <Link href="/signup" className="text-sm font-semibold bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors">
                  회원가입
                </Link>
              </div>
            )}

            {/* 모바일 메뉴 */}
            <MobileMenu isLoggedIn={!!user} userName={displayName} />
          </div>
        </div>
      </div>
    </header>
  )
}
