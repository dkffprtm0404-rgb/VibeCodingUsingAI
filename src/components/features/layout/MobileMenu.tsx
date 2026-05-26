'use client'
/**
 * MobileMenu.tsx — 모바일 햄버거 메뉴
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="메뉴"
      >
        <span className={`block h-0.5 bg-gray-900 transition-all duration-300 ${isOpen ? 'w-5 rotate-45 translate-y-2' : 'w-5'}`} />
        <span className={`block h-0.5 bg-gray-900 transition-all duration-300 ${isOpen ? 'opacity-0 w-5' : 'w-4'}`} />
        <span className={`block h-0.5 bg-gray-900 transition-all duration-300 ${isOpen ? 'w-5 -rotate-45 -translate-y-2' : 'w-5'}`} />
      </button>

      {isOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsOpen(false)} />}

      <div className={`
        fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <span className="font-black text-lg text-gray-900">MyShop</span>
          <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 text-xl">×</button>
        </div>

        {isLoggedIn && (
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
            <p className="text-sm text-gray-500">안녕하세요 👋</p>
            <p className="font-semibold text-gray-900">{userName}님</p>
          </div>
        )}

        <nav className="p-4 space-y-1">
          {menuLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <span className="text-lg">{icon}</span>
              <span className="font-medium text-sm">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 space-y-2">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="w-full py-3 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors">
              로그아웃
            </button>
          ) : (
            <div className="space-y-2">
              <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full py-3 text-center text-sm font-medium border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50">
                로그인
              </Link>
              <Link href="/signup" onClick={() => setIsOpen(false)} className="block w-full py-3 text-center text-sm font-semibold bg-gray-900 text-white rounded-xl hover:bg-gray-700">
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
