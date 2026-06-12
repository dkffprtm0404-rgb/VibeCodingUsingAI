'use client'
/**
 * MobileMenu.tsx — 모바일 햄버거 메뉴 (다크모드 지원)
 */

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface MobileMenuProps {
  isLoggedIn: boolean
  userName?: string
}

export function MobileMenu({ isLoggedIn, userName }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  const menuLinks = [
    { href: '/products', label: '상품', icon: '🛍️' },
    { href: '/style-quiz', label: 'AI 스타일 진단', icon: '✨' },
    ...(isLoggedIn ? [
      { href: '/cart', label: '장바구니', icon: '🛒' },
      { href: '/orders', label: '주문내역', icon: '📦' },
      { href: '/mypage/wishlist', label: '찜한 상품', icon: '❤️' },
    ] : []),
  ]

  return (
    <div ref={menuRef} className="md:hidden">
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="메뉴"
      >
        <span className={`block h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${isOpen ? 'w-5 rotate-45 translate-y-2' : 'w-5'}`} />
        <span className={`block h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${isOpen ? 'opacity-0 w-5' : 'w-4'}`} />
        <span className={`block h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${isOpen ? 'w-5 -rotate-45 -translate-y-2' : 'w-5'}`} />
      </button>

      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />}

      {/* 슬라이드 메뉴 */}
      <div className={`
        fixed top-0 right-0 h-full w-72 z-50 shadow-2xl
        bg-white dark:bg-gray-950
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* 헤더 */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <span className="font-black text-lg text-gray-900 dark:text-white">MyShop</span>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 text-xl"
          >
            ×
          </button>
        </div>

        {/* 유저 정보 */}
        {isLoggedIn && (
          <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">안녕하세요 👋</p>
            <p className="font-semibold text-gray-900 dark:text-white">{userName}님</p>
          </div>
        )}

        {/* 메뉴 링크 */}
        <nav className="p-4 space-y-1">
          {menuLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <span className="text-lg">{icon}</span>
              <span className="font-medium text-sm">{label}</span>
            </Link>
          ))}
        </nav>

        {/* 하단 버튼 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full py-3 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              로그아웃
            </button>
          ) : (
            <div className="space-y-2">
              <Link href="/login" onClick={() => setIsOpen(false)}
                className="block w-full py-3 text-center text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                로그인
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)}
                className="block w-full py-3 text-center text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-700 dark:hover:bg-gray-100">
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
