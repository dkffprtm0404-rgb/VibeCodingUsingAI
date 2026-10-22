import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAppOrigin } from '@/lib/request-security'

/** Supabase의 기본 확인 메일에서 돌아오는 PKCE 코드를 같은 브라우저의 검증자로 교환한다. */
export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get('code')
  let path = '/login?confirmation=error'
  if (code && code.length <= 2048) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) path = '/'
    } catch {
      // 공급자 오류나 인증 코드를 이동 주소·로그에 노출하지 않는다.
    }
  }
  const response = NextResponse.redirect(new URL(path, getAppOrigin(request)))
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('Referrer-Policy', 'no-referrer')
  return response
}
