/**
 * app/api/auth/signup/route.ts — 회원가입 API
 *
 * Admin API (service_role 키) 사용:
 * - createUser로 이메일 인증 없이 바로 유저 생성
 * - email_confirm: true 옵션으로 인증된 상태로 생성
 * - 생성 후 바로 signInWithPassword로 로그인 처리
 *
 * 실무 패턴:
 * - service_role 키는 절대 클라이언트에 노출 금지
 * - 반드시 서버(API Route)에서만 사용
 */

import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
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

    /**
     * Admin 클라이언트: service_role 키 사용
     * 일반 클라이언트(anon 키)와 다르게 RLS를 우회하고
     * 관리자 권한으로 유저를 직접 생성할 수 있어요.
     */
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Admin API로 유저 생성 (email_confirm: true → 인증된 상태로 바로 생성)
    const { error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // 이메일 인증 건너뜀
      user_metadata: { name },
    })

    if (createError) {
      if (createError.message.includes('already been registered')) {
        return NextResponse.json({ error: '이미 사용 중인 이메일이에요.' }, { status: 400 })
      }
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    // 생성 성공 후 바로 로그인 처리
    const supabase = await createServerClient()
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      // 로그인 실패 시 로그인 페이지로 안내
      return NextResponse.json({ requireLogin: true }, { status: 201 })
    }

    return NextResponse.json({ user: signInData.user, autoLogin: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했어요. 다시 시도해주세요.' }, { status: 500 })
  }
}
