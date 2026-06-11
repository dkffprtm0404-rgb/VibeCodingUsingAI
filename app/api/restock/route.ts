/**
 * app/api/restock/route.ts — 재입고 알림 API
 *
 * GET:    내 재입고 알림 목록 조회
 * POST:   재입고 알림 신청
 * DELETE: 재입고 알림 취소
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 })

  const { data, error } = await supabase
    .from('restock_alerts')
    .select('product_id')
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ productIds: data.map((r) => r.product_id) })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 })

  const { productId } = await request.json()

  const { error } = await supabase
    .from('restock_alerts')
    .insert({ user_id: user.id, product_id: productId })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 })

  const { productId } = await request.json()

  const { error } = await supabase
    .from('restock_alerts')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
