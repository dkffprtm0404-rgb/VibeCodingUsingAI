/**
 * middleware.ts — Next.js 미들웨어
 *
 * 모든 요청이 페이지에 도달하기 전에 실행되는 코드입니다.
 * 여기서 로그인 여부를 체크해서 미로그인 시 로그인 페이지로 리다이렉트합니다.
 *
 * 실무 패턴:
 * - 보호가 필요한 라우트(장바구니, 마이페이지 등)는 미들웨어에서 체크
 * - 페이지 컴포넌트 안에서 체크하면 페이지가 잠깐 보였다 사라지는 문제 발생
 * - 미들웨어에서 체크하면 서버 레벨에서 차단 (더 안전하고 깔끔)
 */

import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

/**
 * 로그인이 필요한 경로 목록
 * 이 경로들은 미로그인 시 /login 으로 리다이렉트됩니다.
 */
const PROTECTED_ROUTES = [
  '/cart',       // 장바구니
  '/orders',     // 주문 내역
  '/mypage',     // 마이페이지
]

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth // req.auth가 있으면 로그인 상태

  // 보호된 경로인지 확인
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  // 미로그인 상태에서 보호된 경로 접근 시 → 로그인 페이지로 리다이렉트
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    // callbackUrl: 로그인 후 원래 가려던 페이지로 돌아오기 위한 파라미터
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

/**
 * matcher: 미들웨어가 실행될 경로 패턴
 * 정적 파일(_next, favicon 등)은 제외해서 성능 낭비 방지
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
