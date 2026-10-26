/**
 * app/products/[id]/page.tsx — 상품 상세 페이지 (다크모드 밝은 텍스트)
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/Badge'
import { AddToCartSection } from '@/components/features/product/AddToCartSection'
import { WishlistButton } from '@/components/features/product/WishlistButton'
import { ShareButton } from '@/components/features/product/ShareButton'
import { RestockAlert } from '@/components/features/product/RestockAlert'
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery'
import { ProductDetailTabs } from '@/components/features/product/ProductDetailTabs'
import { RecentlyViewed } from '@/components/features/product/RecentlyViewed'
import { ProductGrid } from '@/components/features/product/ProductGrid'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { formatPrice, getStockStatus } from '@/lib/utils'
import { LOW_STOCK_THRESHOLD } from '@/constants'

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id))
  if (!product) return { title: '상품을 찾을 수 없습니다' }
  return { title: product.name, description: product.description }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id))
  if (!product) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isLoggedIn = !!user
  const stockStatus = getStockStatus(product.stock)
  const isSoldOut = product.stock === 0
  const isBeauty = product.channels?.includes('beauty') ?? false
  const isFootwear = product.category === '신발'
  const isAccessory = product.category === '가방' || product.category === '액세서리'

  return (
    <div className="shop-page py-6 sm:py-10">

      {/* 브레드크럼 */}
      <nav aria-label="현재 위치" className="shop-muted mb-6 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:mb-8 sm:text-sm">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-white transition-colors">홈</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gray-700 dark:hover:text-white transition-colors">상품</Link>
        <span>/</span>
        <span className="text-gray-700 dark:text-gray-200">{product.category}</span>
        <span>/</span>
        <span aria-current="page" className="min-w-0 break-words font-medium text-gray-900 dark:text-white">{product.name}</span>
      </nav>

      {/* 메인 콘텐츠 */}
      <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-8">
        <div className="min-w-0 space-y-2">
          <ProductImageGallery images={product.images} productName={product.name} isSoldOut={isSoldOut} />
          {product.imageSource && (
            <a href={product.imageSource.url} target="_blank" rel="noopener noreferrer" className="shop-muted inline-flex min-h-11 items-center px-1 text-[11px] underline decoration-gray-300 underline-offset-4 transition-colors hover:text-foreground">
              이미지 출처: {product.imageSource.label} ↗<span className="sr-only"> (새 탭에서 열림)</span>
            </a>
          )}
        </div>

        <div className="shop-surface flex min-w-0 flex-col space-y-6 p-5 sm:p-8 lg:p-9">
          <div className="space-y-2">
            <Badge variant="secondary">{product.category}</Badge>
            {product.brand && <p className="shop-kicker pt-3">{product.brand}</p>}
            <h1 className="pt-2 text-2xl font-semibold leading-snug tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              {product.name}
            </h1>
          </div>

          <p className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">{formatPrice(product.price)}</p>
          <p className="shop-muted text-sm leading-7">{product.description}</p>

          <p className={`text-sm font-medium ${isSoldOut ? 'text-red-700 dark:text-red-300' : product.stock <= LOW_STOCK_THRESHOLD ? 'text-orange-700 dark:text-orange-300' : 'text-sage-700 dark:text-sage-200'}`}>
            {stockStatus.label}
            {product.stock > 0 && product.stock <= 10 && (
              <span className="ml-2 text-gray-400">(전체 잔여 {product.stock}개)</span>
            )}
          </p>

          {/* 소재 / 핏 카드 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-sage-50 p-4 dark:bg-sage-950">
              <p className="shop-kicker mb-2">{isBeauty ? '구성' : '소재'}</p>
              <p className="text-xs font-medium leading-6 text-gray-700 dark:text-gray-200">{product.material}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800">
              <p className="shop-kicker mb-2">{isBeauty ? '사용 타입' : isFootwear ? '착화 안내' : isAccessory ? '디자인' : '핏'}</p>
              <p className="text-xs font-medium leading-6 text-gray-700 dark:text-gray-200">{product.fit.split('/')[0]}</p>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          {isSoldOut ? (
            <RestockAlert productId={product.id} isLoggedIn={isLoggedIn} />
          ) : (
            <AddToCartSection product={product} isLoggedIn={isLoggedIn} />
          )}

          {/* 찜하기 + 공유 — 나란히 배치 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <WishlistButton productId={product.id} isLoggedIn={isLoggedIn} />
            </div>
            <div className="min-w-0">
              <ShareButton
                title={product.name}
                text={product.description}
                url={`/products/${product.id}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-4 text-xs leading-6 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <span aria-hidden="true">↗</span>
            <span>5만원 이상 무료배송 · 평균 2~3일 배송</span>
          </div>
        </div>
      </div>

      <ProductDetailTabs product={product} />

      {/* 연관 상품 */}
      <section className="mt-12 sm:mt-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="shop-kicker mb-2">Complete your edit</p>
            <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">같은 카테고리 상품</h2>
          </div>
          <Link href="/products" className="shop-muted inline-flex min-h-11 shrink-0 items-center pl-3 text-sm transition-colors hover:text-gray-900 dark:hover:text-white">
            전체보기 →
          </Link>
        </div>
        <ProductGrid products={MOCK_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)} />
      </section>

      <RecentlyViewed currentProductId={product.id} />
    </div>
  )
}
