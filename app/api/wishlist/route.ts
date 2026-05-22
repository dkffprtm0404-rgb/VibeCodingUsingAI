/**
 * app/api/wishlist/route.ts — 찜하기 API
 *
 * GET: 내 찜 목록 조회
 * POST: 찜 추가
 * DELETE: 찜 삭제
 */

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// 찜 목록 조회
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 })

  const { data, error } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ productIds: data.map((w) => w.product_id) })
}

// 찜 추가
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 })

  const { productId } = await request.json()

  const { error } = await supabase
    .from('wishlists')
    .insert({ user_id: user.id, product_id: productId })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}

// 찜 삭제
export async function DELETE(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요해요.' }, { status: 401 })

  const { productId } = await request.json()

  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
