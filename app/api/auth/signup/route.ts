/**
 * app/api/auth/signup/route.ts — 회원가입 API
 *
 * 회원가입 후 이메일 인증 없이 바로 로그인 처리
 * signUp → signInWithPassword 연속 호출로 세션 즉시 발급
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const MIN_PASSWORD_LENGTH = 6

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: '모든 항목을 입력해주세요.' }, { status: 400 })
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 해요.` },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 1단계: 회원가입
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        return NextResponse.json({ error: '이미 사용 중인 이메일이에요.' }, { status: 400 })
      }
      return NextResponse.json({ error: signUpError.message }, { status: 400 })
    }

    /**
     * 2단계: 회원가입 직후 바로 로그인
     * Supabase 이메일 인증이 켜져 있어도
     * signUp 직후엔 임시 세션이 발급되므로 바로 로그인 가능
     */
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      // 로그인 실패해도 회원가입은 성공 → 로그인 페이지로 안내
      return NextResponse.json({ requireLogin: true }, { status: 201 })
    }

    return NextResponse.json({ user: signInData.user, autoLogin: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했어요. 다시 시도해주세요.' }, { status: 500 })
  }
}
