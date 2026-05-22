/**
 * app/products/[id]/page.tsx — 상품 상세 페이지
 */

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/Badge'
import { AddToCartSection } from '@/components/features/product/AddToCartSection'
import { WishlistButton } from '@/components/features/product/WishlistButton'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8">
        ← 상품 목록으로
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* 이미지 */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="bg-white text-gray-900 font-bold text-lg px-6 py-2 rounded-full">품절</span>
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="flex flex-col space-y-5">
          <Badge variant="secondary">{product.category}</Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">{product.name}</h1>
          <p className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>
          <p className={`text-sm font-medium ${stockStatus.color}`}>
            {stockStatus.label}
            {product.stock > 0 && product.stock <= 10 && (
              <span className="ml-2 text-gray-400">(잔여 {product.stock}개)</span>
            )}
          </p>

          <hr className="border-gray-200" />

          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-700">상품 설명</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
          </div>

          <hr className="border-gray-200" />

          <AddToCartSection product={product} isLoggedIn={isLoggedIn} />

          {/* 찜하기 버튼 */}
          <WishlistButton productId={product.id} isLoggedIn={isLoggedIn} />
        </div>
      </div>

      {/* 연관 상품 */}
      <div className="mt-20">
        <h2 className="text-xl font-bold text-gray-900 mb-6">같은 카테고리 상품</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_PRODUCTS
            .filter((p) => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                <div className="relative aspect-square bg-gray-50">
                  <Image src={p.imageUrl} alt={p.name} fill sizes="25vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</p>
                  <p className="text-sm font-bold mt-1">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
