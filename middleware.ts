/**
 * middleware.ts — Next.js 미들웨어 (Supabase Auth 버전)
 *
 * 모든 요청에서 Supabase 세션을 갱신하고
 * 보호된 경로는 미로그인 시 /login으로 리다이렉트합니다.
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 로그인이 필요한 경로
const PROTECTED_ROUTES = ['/cart', '/orders', '/mypage']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // 미들웨어용 Supabase 클라이언트 (쿠키 직접 조작)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 세션 갱신 (반드시 호출해야 토큰 자동 갱신됨)
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isProtectedRoute = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))

  // 미로그인 + 보호된 경로 → 로그인 페이지로
  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
