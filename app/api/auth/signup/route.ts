/**
 * app/api/auth/signup/route.ts — 회원가입 API
 *
 * 실무 패턴:
 * - POST /api/auth/signup 으로 요청
 * - Supabase Auth로 유저 생성
 * - 성공/실패 JSON 응답 반환
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // 기본 유효성 검사
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: '모든 항목을 입력해주세요.' },
        { status: 400 }
      )
    }

    if (password.length < 4) {
      return NextResponse.json(
        { error: '비밀번호는 4자 이상이어야 해요.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    /**
     * supabase.auth.signUp: Supabase Auth에 유저 생성
     * - email, password → auth.users 테이블에 저장 (Supabase 자동 관리)
     * - data.name → user_metadata에 저장
     */
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // user_metadata에 이름 저장
      },
    })

    if (error) {
      // Supabase 에러 메시지 한국어로 변환
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: '이미 사용 중인 이메일이에요.' },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user: data.user }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: '서버 오류가 발생했어요. 다시 시도해주세요.' },
      { status: 500 }
    )
  }
}
