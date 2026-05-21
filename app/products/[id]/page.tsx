/**
 * app/products/[id]/page.tsx — 상품 상세 페이지
 */

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Badge } from '@/components/ui/Badge'
import { AddToCartSection } from '@/components/features/product/AddToCartSection'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { formatPrice, getStockStatus } from '@/lib/utils'

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id))
  if (!product) return { title: '상품을 찾을 수 없습니다' }
  return { title: product.name, description: product.description }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params
  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id))
  if (!product) notFound()

  const session = await auth()
  const isLoggedIn = !!session
  const stockStatus = getStockStatus(product.stock)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
      >
        ← 상품 목록으로
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

        {/* 이미지 */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="bg-white text-gray-900 font-bold text-lg px-6 py-2 rounded-full">품절</span>
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="flex flex-col space-y-6">
          <Badge variant="secondary">{product.category}</Badge>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
            {product.name}
          </h1>

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

          {/* product 전체 객체 전달 (Zustand에서 상품 정보 필요) */}
          <AddToCartSection product={product} isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </div>
  )
}
