/**
 * app/mypage/wishlist/page.tsx — 찜 목록 페이지
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { ProductCard } from '@/components/features/product/ProductCard'
import { EmptyState } from '@/components/ui/EmptyState'
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
    <div className="shop-page py-10 sm:py-14">
      <header className="mb-8 space-y-3 sm:mb-10">
        <p className="shop-kicker">Saved for a little later</p>
        <h1 className="shop-heading">찜한 상품</h1>
        <p className="shop-muted text-sm">총 {wishedProducts.length}개의 상품을 찜했어요</p>
      </header>

      {wishedProducts.length === 0 ? (
        <EmptyState
          icon="🤍"
          title="아직 찜한 상품이 없어요"
          description="마음에 드는 상품에 하트를 눌러보세요"
          actionLabel="상품 보러 가기"
          actionHref="/products"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 min-[375px]:grid-cols-2 md:grid-cols-3 sm:gap-5 xl:grid-cols-4 lg:gap-6">
          {wishedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
