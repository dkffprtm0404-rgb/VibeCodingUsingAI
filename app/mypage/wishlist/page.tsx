/**
 * app/mypage/wishlist/page.tsx — 찜 목록 페이지
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { ProductCard } from '@/components/features/product/ProductCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '찜한 상품' }

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: wishlists } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', user.id)

  const wishedIds = wishlists?.map((w) => w.product_id) ?? []
  const wishedProducts = MOCK_PRODUCTS.filter((p) => wishedIds.includes(p.id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <SectionHeader
        title="찜한 상품"
        description={`총 ${wishedProducts.length}개의 상품을 찜했어요`}
      />

      {wishedProducts.length === 0 ? (
        <EmptyState
          icon="🤍"
          title="아직 찜한 상품이 없어요"
          description="마음에 드는 상품에 하트를 눌러보세요"
          actionLabel="상품 보러 가기"
          actionHref="/products"
        />
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
