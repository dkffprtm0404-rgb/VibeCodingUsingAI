/**
 * layout.tsx — 루트 레이아웃
 */

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Header } from '@/components/features/layout/Header'
import { ChatBot } from '@/components/features/chat/ChatBot'
import './globals.css'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'MyShop',
    template: '%s | MyShop',
  },
  description: '트렌디한 패션 아이템을 만나보세요.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={geist.variable}>
      <body className="min-h-screen flex flex-col bg-[#fafafa] text-gray-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        {/* AI 쇼핑 도우미 — 모든 페이지에서 접근 가능 */}
        <ChatBot />
      </body>
    </html>
  )
}
