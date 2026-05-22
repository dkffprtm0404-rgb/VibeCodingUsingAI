/**
 * app/page.tsx — 홈 페이지
 */

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { ProductCard } from '@/components/features/product/ProductCard'

export default function HomePage() {
  // 신상품 4개만 표시
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4)

  return (
    <div className="space-y-20">

      {/* 히어로 섹션 */}
      <section className="relative bg-gray-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=60"
            alt="hero"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
          <div className="max-w-xl space-y-6">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gray-400 border border-gray-700 px-3 py-1 rounded-full">
              2026 Summer Collection
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
              트렌디한 패션을
              <br />
              <span className="text-gray-400">한 곳에서</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              클래식부터 모던까지, 매일 새로운 스타일을 발견하세요.
            </p>
            <div className="flex gap-3 pt-2">
              <Link href="/products">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                  쇼핑 시작하기 →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 배너 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: '상의', emoji: '👕', bg: 'bg-blue-50', color: 'text-blue-700' },
            { label: '하의', emoji: '👖', bg: 'bg-amber-50', color: 'text-amber-700' },
            { label: '아우터', emoji: '🧥', bg: 'bg-purple-50', color: 'text-purple-700' },
            { label: '전체보기', emoji: '🛍️', bg: 'bg-gray-900', color: 'text-white' },
          ].map(({ label, emoji, bg, color }) => (
            <Link
              key={label}
              href={`/products`}
              className={`${bg} ${color} rounded-2xl p-6 flex flex-col items-center gap-2 hover:opacity-90 transition-opacity`}
            >
              <span className="text-3xl">{emoji}</span>
              <span className="text-sm font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 신상품 섹션 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">신상품</h2>
            <p className="text-gray-500 text-sm mt-1">가장 최근에 입고된 상품들이에요</p>
          </div>
          <Link href="/products" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            전체보기 →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 배너 섹션 */}
      <section className="bg-gray-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-gray-400 text-sm tracking-widest uppercase">Limited Offer</p>
          <h2 className="text-3xl sm:text-4xl font-bold">5만원 이상 구매 시<br />무료 배송</h2>
          <p className="text-gray-400">지금 바로 쇼핑하고 배송비를 아껴보세요</p>
          <Link href="/products" className="inline-block mt-4">
            <Button className="bg-white text-black hover:bg-gray-100" size="lg">
              지금 쇼핑하기
            </Button>
          </Link>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">MyShop</h3>
              <p className="text-sm text-gray-500 leading-relaxed">트렌디한 패션을<br />한 곳에서 만나보세요.</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">쇼핑</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/products" className="hover:text-gray-900">전체 상품</Link></li>
                <li><Link href="/products" className="hover:text-gray-900">신상품</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">고객센터</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>평일 10:00 - 17:00</li>
                <li>주말/공휴일 휴무</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">배송 안내</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>5만원 이상 무료배송</li>
                <li>기본 배송비 3,000원</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8">
            <p className="text-xs text-gray-400 text-center">© 2026 MyShop. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
