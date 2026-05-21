/**
 * app/api/auth/login/route.ts — 로그인 API
 *
 * Supabase Auth로 이메일/비밀번호 로그인 처리
 * 성공 시 Supabase가 자동으로 쿠키에 세션 저장
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

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
