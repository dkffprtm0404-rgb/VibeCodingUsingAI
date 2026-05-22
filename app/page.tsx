/**
 * app/page.tsx — 홈 페이지
 */

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import { ProductCard } from '@/components/features/product/ProductCard'

export default function HomePage() {
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4)

  return (
    <div>

      {/* 히어로 섹션 */}
      <section className="relative bg-gray-950 text-white overflow-hidden min-h-[600px] flex items-center">
        {/* 배경 이미지 */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1400&q=60"
            alt="hero background"
            fill
            className="object-cover opacity-40"
            priority
          />
          {/* 그라디언트 오버레이 — 텍스트 가독성 향상 */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-lg space-y-6">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-gray-400 border border-gray-700 px-3 py-1.5 rounded-full">
              2026 Summer Collection
            </span>
            <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] tracking-tight">
              트렌디한 패션을
              <br />
              <span className="text-gray-400">한 곳에서</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              클래식부터 모던까지, 매일 새로운 스타일을 발견하세요.
            </p>
            <div className="flex gap-3 pt-2">
              {/* white variant — 어두운 배경에서 명확하게 보임 */}
              <Link href="/products">
                <Button variant="white" size="lg">
                  쇼핑 시작하기 →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* USP 배지 */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-800">
            {[
              { icon: '🚚', title: '5만원 이상 무료배송', sub: '빠른 배송 보장' },
              { icon: '🔄', title: '30일 무료 반품', sub: '조건 없이 반품 가능' },
              { icon: '🔒', title: '안전한 결제', sub: '개인정보 완벽 보호' },
              { icon: '💬', title: '고객센터 운영', sub: '평일 10:00 - 17:00' },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 px-6 py-5">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 카테고리 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">카테고리</h2>
          <p className="text-gray-500 text-sm mt-1">원하는 카테고리를 선택해보세요</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: '상의', emoji: '👕', bg: 'bg-sky-50 hover:bg-sky-100', color: 'text-sky-800', border: 'border-sky-200' },
            { label: '하의', emoji: '👖', bg: 'bg-amber-50 hover:bg-amber-100', color: 'text-amber-800', border: 'border-amber-200' },
            { label: '아우터', emoji: '🧥', bg: 'bg-violet-50 hover:bg-violet-100', color: 'text-violet-800', border: 'border-violet-200' },
            { label: '전체보기', emoji: '🛍️', bg: 'bg-gray-900 hover:bg-gray-700', color: 'text-white', border: 'border-transparent' },
          ].map(({ label, emoji, bg, color, border }) => (
            <Link
              key={label}
              href="/products"
              className={`${bg} ${color} border ${border} rounded-2xl p-7 flex flex-col items-center gap-3 transition-colors duration-150`}
            >
              <span className="text-4xl">{emoji}</span>
              <span className="text-sm font-semibold tracking-wide">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 신상품 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">New Arrivals</p>
            <h2 className="text-2xl font-bold text-gray-900">신상품</h2>
          </div>
          <Link href="/products" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            전체보기 →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 무료배송 배너 */}
      <section className="relative bg-gray-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <p className="text-gray-500 text-xs font-semibold tracking-widest uppercase">Limited Offer</p>
          <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
            5만원 이상 구매 시
            <br />
            <span className="text-gray-400">무료 배송</span>
          </h2>
          <p className="text-gray-500 text-base">지금 바로 쇼핑하고 배송비를 아껴보세요</p>
          <div className="pt-2">
            {/* white variant 사용 */}
            <Link href="/products">
              <Button variant="white" size="lg">
                지금 쇼핑하기
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-lg font-black text-gray-900 mb-3">MyShop</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                트렌디한 패션을<br />한 곳에서 만나보세요.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">쇼핑</h3>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li><Link href="/products" className="hover:text-gray-900 transition-colors">전체 상품</Link></li>
                <li><Link href="/products" className="hover:text-gray-900 transition-colors">신상품</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">고객센터</h3>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li>평일 10:00 - 17:00</li>
                <li>주말/공휴일 휴무</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">배송 안내</h3>
              <ul className="space-y-2.5 text-sm text-gray-500">
                <li>5만원 이상 무료배송</li>
                <li>기본 배송비 3,000원</li>
                <li>평균 2~3일 배송</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-400">© 2026 MyShop. All rights reserved.</p>
            <p className="text-xs text-gray-400">포트폴리오 프로젝트 · Next.js + Supabase</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
