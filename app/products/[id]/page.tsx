/**
 * app/products/[id]/page.tsx — 상품 상세 페이지
 */

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/Badge'
import { AddToCartSection } from '@/components/features/product/AddToCartSection'
import { WishlistButton } from '@/components/features/product/WishlistButton'
import { ProductImageGallery } from '@/components/features/product/ProductImageGallery'
import { ProductDetailTabs } from '@/components/features/product/ProductDetailTabs'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { formatPrice, getStockStatus } from '@/lib/utils'

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* 브레드크럼 */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors">홈</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gray-700 transition-colors">상품</Link>
        <span>/</span>
        <span className="text-gray-700">{product.category}</span>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* 메인 콘텐츠 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* 왼쪽: 이미지 갤러리 */}
        <ProductImageGallery
          images={product.images}
          productName={product.name}
          isSoldOut={product.stock === 0}
        />

        {/* 오른쪽: 상품 정보 */}
        <div className="flex flex-col space-y-5">

          {/* 카테고리 + 이름 */}
          <div className="space-y-2">
            <Badge variant="secondary">{product.category}</Badge>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
              {product.name}
            </h1>
          </div>

          {/* 가격 */}
          <p className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>

          {/* 재고 상태 */}
          <p className={`text-sm font-medium ${stockStatus.color}`}>
            {stockStatus.label}
            {product.stock > 0 && product.stock <= 10 && (
              <span className="ml-2 text-gray-400">(전체 잔여 {product.stock}개)</span>
            )}
          </p>

          {/* 소재 + 핏 요약 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3.5">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">소재</p>
              <p className="text-xs text-gray-700 font-medium leading-relaxed">{product.material}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3.5">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">핏</p>
              <p className="text-xs text-gray-700 font-medium leading-relaxed">{product.fit.split('/')[0]}</p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* 사이즈 선택 + 장바구니 */}
          <AddToCartSection product={product} isLoggedIn={isLoggedIn} />

          {/* 찜하기 */}
          <WishlistButton productId={product.id} isLoggedIn={isLoggedIn} />

          {/* 배송 안내 요약 */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl text-xs text-gray-500">
            <span>🚚</span>
            <span>5만원 이상 무료배송 · 평균 2~3일 배송</span>
          </div>
        </div>
      </div>

      {/* 상세 탭 (설명 / 사이즈 가이드 / 배송 안내) */}
      <ProductDetailTabs product={product} />

      {/* 연관 상품 */}
      <div className="mt-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">같은 카테고리 상품</h2>
          <Link href="/products" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            전체보기 →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_PRODUCTS
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    sizes="25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</p>
                  <p className="text-sm font-bold text-gray-900">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
