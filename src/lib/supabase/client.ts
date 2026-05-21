/**
 * client.ts — Supabase 브라우저 클라이언트
 *
 * 브라우저(Client Component)에서 Supabase를 사용할 때 씁니다.
 * 예: 클라이언트에서 직접 데이터 조회, 실시간 구독 등
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
