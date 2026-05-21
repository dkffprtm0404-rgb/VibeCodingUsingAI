/**
 * app/api/auth/signup/route.ts — 회원가입 API
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

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    })

    if (error) {
      if (error.message.includes('already registered')) {
        return NextResponse.json({ error: '이미 사용 중인 이메일이에요.' }, { status: 400 })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ user: data.user }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했어요. 다시 시도해주세요.' }, { status: 500 })
  }
}
