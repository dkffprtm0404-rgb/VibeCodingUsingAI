/**
 * app/layout.tsx — 루트 레이아웃
 */

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Header } from '@/components/features/layout/Header'
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
  description: '트렌디한 패션 아이템을 만나보세요.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={geist.variable} suppressHydrationWarning>
      {/* suppressHydrationWarning: next-themes가 class를 동적으로 추가해서 필요 */}
      <body className="min-h-screen flex flex-col bg-[--background] text-[--foreground] antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <ChatBot />
          <ToastContainer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
