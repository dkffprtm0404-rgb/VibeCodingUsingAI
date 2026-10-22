/**
 * app/api/auth/login/route.ts — 로그인 API
 *
 * Supabase Auth로 이메일/비밀번호 로그인 처리
 * 성공 시 Supabase가 자동으로 쿠키에 세션 저장
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { validateJsonMutation } from '@/lib/request-security'
import { readCredentials } from '@/lib/auth-validation'

export async function POST(request: Request) {
  const blocked = validateJsonMutation(request)
  if (blocked) return blocked
  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: '로그인 요청 형식을 확인해주세요.' }, { status: 400 })
  }
  const credentials = readCredentials(body)
  if (!credentials) return NextResponse.json({ error: '이메일과 비밀번호를 확인해주세요.' }, { status: 400 })
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword(credentials)

    if (error) {
      return NextResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않아요.' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user: data.user }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: '서버 오류가 발생했어요. 다시 시도해주세요.' },
      { status: 500 }
    )
  }
}
