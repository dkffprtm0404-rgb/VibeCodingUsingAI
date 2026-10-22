import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requiresEmailConfirmation } from '@/lib/supabase/auth-settings'
import { readSignup } from '@/lib/auth-validation'
import { getAppOrigin, validateJsonMutation } from '@/lib/request-security'

export async function POST(request: Request) {
  const blocked = validateJsonMutation(request)
  if (blocked) return blocked
  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: '회원가입 요청 형식을 확인해주세요.' }, { status: 400 })
  }
  const details = readSignup(body)
  if (!details) return NextResponse.json({ error: '이름·이메일과 6자 이상 비밀번호를 확인해주세요.' }, { status: 400 })
  if (!await requiresEmailConfirmation(request.signal)) {
    return NextResponse.json({ error: '지금은 이메일 인증을 준비할 수 없어요. 잠시 후 다시 시도해주세요.' }, { status: 503 })
  }
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signUp({
      email: details.email, password: details.password,
      options: { data: { name: details.name }, emailRedirectTo: `${getAppOrigin(request)}/auth/callback` },
    })
    if (error) {
      return NextResponse.json({ error: '회원가입을 완료하지 못했어요. 입력 내용을 확인하거나 잠시 후 다시 시도해주세요.' }, { status: 400 })
    }
    if (data.session) {
      await supabase.auth.signOut({ scope: 'local' })
      return NextResponse.json({ error: '이메일 인증 설정을 확인할 수 없어요. 잠시 후 다시 시도해주세요.' }, { status: 503 })
    }
    return NextResponse.json({ requireEmailConfirmation: true }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했어요. 다시 시도해주세요.' }, { status: 500 })
  }
}
