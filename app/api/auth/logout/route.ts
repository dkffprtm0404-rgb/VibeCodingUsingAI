/**
 * app/api/auth/logout/route.ts — 로그아웃 API
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { validateJsonMutation } from '@/lib/request-security'

export async function POST(request: Request) {
  const blocked = validateJsonMutation(request)
  if (blocked) return blocked
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: '로그아웃하지 못했어요. 다시 시도해주세요.' }, { status: 503 })
  }
}
