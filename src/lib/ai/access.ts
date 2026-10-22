import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function requireAiUser(): Promise<string | NextResponse> {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'AI 기능은 로그인 후 이용할 수 있어요.' }, { status: 401 })
    if (!user.email_confirmed_at) return NextResponse.json({ error: '이메일 인증을 완료한 후 AI 기능을 이용해주세요.' }, { status: 403 })
    return user.id
  } catch {
    return NextResponse.json({ error: '로그인 상태를 확인할 수 없어요. 잠시 후 다시 시도해주세요.' }, { status: 503 })
  }
}
