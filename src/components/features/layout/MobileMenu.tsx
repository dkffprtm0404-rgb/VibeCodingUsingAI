'use client'
/**
 * MobileMenu.tsx — 모바일 햄버거 메뉴 (다크모드 지원)
 */

import { useState, useEffect, useRef, useId } from 'react'
import Link from 'next/link'
import { authApi } from '@/lib/api'
import { toast } from '@/components/ui/Toast'
import { Icon, type IconName } from '@/components/ui/Icon'
import { STORE_CHANNELS } from '@/constants/catalog'

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

  const menuLinks: { href: string; label: string; icon: IconName }[] = [
    { href: '/style-quiz', label: 'AI 스타일 진단', icon: 'sparkles' },
    ...(isLoggedIn ? [
      { href: '/cart', label: '장바구니', icon: 'bag' as const },
      { href: '/orders', label: '주문내역', icon: 'user' as const },
      { href: '/mypage/wishlist', label: '찜한 상품', icon: 'heart' as const },
    ] : []),
  ]

  return (
    <div className="md:hidden">
      {/* 햄버거 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="shop-icon-button"
        aria-label="메뉴"
        aria-expanded={isOpen}
        aria-controls={dialogId}
      >
        <Icon name={isOpen ? 'close' : 'menu'} />
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
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-80 max-w-full border-0 p-0 bg-background text-foreground backdrop:bg-black/40 open:flex open:flex-col"
      >
        {/* 헤더 */}
        <div className="flex shrink-0 items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <span className="font-black text-lg text-gray-900 dark:text-white">MyShop</span>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="메뉴 닫기"
            className="shop-icon-button"
          >
            <Icon name="close" />
          </button>
        </div>

        {/* 유저 정보 */}
        {isLoggedIn && (
          <div className="shrink-0 px-5 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
            <p className="shop-kicker mb-1">Your everyday, curated</p>
            <p className="font-semibold text-gray-900 dark:text-white">{userName}님</p>
          </div>
        )}

        {/* 메뉴 링크 */}
        <nav aria-label="모바일 탐색" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 space-y-1">
          <p className="shop-kicker px-2 pt-2 pb-3">Shop by store</p>
          <div className="mb-5 grid grid-cols-2 gap-2 border-b border-gray-100 pb-5 dark:border-gray-800">
            {STORE_CHANNELS.map((store) => (
              <Link
                key={store.id}
                href={store.id === 'all' ? '/products' : `/products?store=${store.id}`}
                onClick={() => setIsOpen(false)}
                className="flex min-h-12 items-center justify-between gap-2 rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 transition-colors hover:bg-sage-100 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-sage-950"
              >
                {store.id === 'all' ? '전체 스토어' : store.label}
                <Icon name="arrow" className="size-3.5 text-gray-400" />
              </Link>
            ))}
          </div>
          {menuLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="flex min-h-11 items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Icon name={icon} className="text-sage-700 dark:text-sage-200" />
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
