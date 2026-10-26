/**
 * app/layout.tsx — 루트 레이아웃
 */

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Header } from '@/components/features/layout/Header'
import { MobileBottomNav } from '@/components/features/layout/MobileBottomNav'
import { ShopFooter } from '@/components/features/layout/ShopFooter'
import { ChatBot } from '@/components/features/chat/ChatBot'
import { ToastContainer } from '@/components/ui/Toast'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
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
  description: '나를 위한 AI 스타일 큐레이션. 좋아하는 것들로 채우는 일상, MyShop에서 발견하세요.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={geist.variable} suppressHydrationWarning>
      {/* suppressHydrationWarning: next-themes가 class를 동적으로 추가해서 필요 */}
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <ThemeProvider>
          <a href="#main-content" className="fixed top-2 left-2 z-[200] -translate-y-24 rounded-full bg-gray-900 px-5 py-3 text-sm text-white focus:translate-y-0">본문으로 건너뛰기</a>
          <Header />
          <div className="shop-main flex flex-1 flex-col">
            <main id="main-content" className="flex-1">{children}</main>
            <ShopFooter />
          </div>
          <MobileBottomNav />
          <ChatBot />
          <ToastContainer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
