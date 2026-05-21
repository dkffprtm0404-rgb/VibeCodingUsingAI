/**
 * layout.tsx — 루트 레이아웃
 *
 * Next.js App Router에서 layout.tsx는 모든 페이지를 감싸는 공통 틀입니다.
 * 헤더, 푸터처럼 모든 페이지에 공통으로 들어가는 요소를 여기에 넣습니다.
 */

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Header } from '@/components/features/layout/Header'
import './globals.css'

// Google Font 설정 (Next.js가 자동으로 최적화해서 로드)
const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

// metadata: SEO를 위한 페이지 메타 정보 (Next.js 자동 처리)
export const metadata: Metadata = {
  title: {
    default: 'MyShop',
    template: '%s | MyShop', // 하위 페이지에서 "상품목록 | MyShop" 형태로 표시
  },
  description: '트렌디한 패션 아이템을 만나보세요.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={geist.variable}>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        {/* 공통 헤더 */}
        <Header />

        {/* 페이지 컨텐츠 — children 위치에 각 page.tsx가 렌더링됨 */}
        <main className="flex-1">
          {children}
        </main>

        {/* 푸터 — 추후 추가 예정 */}
      </body>
    </html>
  )
}
