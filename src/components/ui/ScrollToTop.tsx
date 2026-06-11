'use client'
/**
 * ScrollToTop.tsx — 페이지 상단 이동 버튼
 *
 * 스크롤 400px 이상 내리면 나타나는 플로팅 버튼.
 * 요즘 쇼핑몰/콘텐츠 사이트에서 기본 UX 요소.
 */

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      onClick={scrollToTop}
      aria-label="페이지 상단으로 이동"
      className={cn(
        'fixed bottom-24 right-4 sm:right-6 z-40',
        'w-10 h-10 bg-white border border-gray-200 rounded-xl shadow-md',
        'flex items-center justify-center text-gray-600',
        'hover:bg-gray-50 hover:shadow-lg transition-all duration-200',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}
