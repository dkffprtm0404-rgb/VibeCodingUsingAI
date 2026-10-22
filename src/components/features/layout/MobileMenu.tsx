'use client'
/**
 * MobileMenu.tsx — 모바일 햄버거 메뉴 (다크모드 지원)
 */

import { useState, useEffect, useRef, useId } from 'react'
import Link from 'next/link'
import { authApi } from '@/lib/api'
import { toast } from '@/components/ui/Toast'

interface MobileMenuProps {
  isLoggedIn: boolean
  userName?: string
}

export function MobileMenu({ isLoggedIn, userName }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const dialogId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    // top layer로 열어 헤더의 backdrop-filter가 만드는 위치 제약을 피한다.
    if (isOpen && !dialog.open) dialog.showModal()
    if (!isOpen && dialog.open) dialog.close()
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)')
    const closeOnDesktop = () => {
      if (desktop.matches) setIsOpen(false)
    }
    desktop.addEventListener('change', closeOnDesktop)
    return () => desktop.removeEventListener('change', closeOnDesktop)
  }, [])

  const handleLogout = async () => {
    try {
      await authApi.logout()
      window.location.href = '/'
    } catch {
      setIsOpen(false)
      toast.error('로그아웃하지 못했어요. 다시 시도해주세요.')
    }
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
    <div className="md:hidden">
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="메뉴"
        aria-expanded={isOpen}
        aria-controls={dialogId}
      >
        <span className={`block h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${isOpen ? 'w-5 rotate-45 translate-y-2' : 'w-5'}`} />
        <span className={`block h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${isOpen ? 'opacity-0 w-5' : 'w-4'}`} />
        <span className={`block h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${isOpen ? 'w-5 -rotate-45 -translate-y-2' : 'w-5'}`} />
      </button>

      {/* 슬라이드 메뉴 */}
      <dialog
        ref={dialogRef}
        id={dialogId}
        aria-label="모바일 메뉴"
        onCancel={() => setIsOpen(false)}
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return
          const bounds = event.currentTarget.getBoundingClientRect()
          if (event.clientX < bounds.left || event.clientX > bounds.right
            || event.clientY < bounds.top || event.clientY > bounds.bottom) setIsOpen(false)
        }}
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-72 max-w-full border-0 p-0 shadow-2xl bg-white text-gray-900 dark:bg-gray-950 dark:text-white backdrop:bg-black/50 open:flex open:flex-col"
      >
        {/* 헤더 */}
        <div className="flex shrink-0 items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <span className="font-black text-lg text-gray-900 dark:text-white">MyShop</span>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="메뉴 닫기"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 text-xl"
          >
            ×
          </button>
        </div>

        {/* 유저 정보 */}
        {isLoggedIn && (
          <div className="shrink-0 px-5 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">안녕하세요 👋</p>
            <p className="font-semibold text-gray-900 dark:text-white">{userName}님</p>
          </div>
        )}

        {/* 메뉴 링크 */}
        <nav className="min-h-0 flex-1 overflow-y-auto p-4 space-y-1">
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
        <div className="shrink-0 p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
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
      </dialog>
    </div>
  )
}
