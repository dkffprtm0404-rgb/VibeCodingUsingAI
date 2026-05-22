/**
 * app/mypage/wishlist/page.tsx — 찜 목록 페이지
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { ProductCard } from '@/components/features/product/ProductCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '찜한 상품' }

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 찜 목록 조회
  const { data: wishlists } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', user.id)

  const wishedIds = wishlists?.map((w) => w.product_id) ?? []
  const wishedProducts = MOCK_PRODUCTS.filter((p) => wishedIds.includes(p.id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">찜한 상품</h1>
        <p className="text-gray-500 text-sm mt-1">
          총 <span className="font-semibold text-gray-900">{wishedProducts.length}</span>개의 상품을 찜했어요
        </p>
      </div>

      {wishedProducts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🤍</p>
          <p className="text-gray-500 font-medium">아직 찜한 상품이 없어요</p>
          <p className="text-gray-400 text-sm mt-1">마음에 드는 상품에 하트를 눌러보세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
