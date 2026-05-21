'use client'
/**
 * LogoutButton.tsx — 로그아웃 버튼 (Client Component)
 *
 * 로그아웃 API 호출 후 페이지 새로고침으로 세션 제거
 */

import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
    >
      로그아웃
    </button>
  )
}
