/**
 * server.ts — Supabase 서버 클라이언트
 *
 * Server Component, API Route, Server Action에서 씁니다.
 * 쿠키 기반으로 세션을 읽어서 인증 상태를 유지합니다.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component에서 set은 무시됨 (미들웨어에서 처리)
          }
        },
      },
    }
  )
}
