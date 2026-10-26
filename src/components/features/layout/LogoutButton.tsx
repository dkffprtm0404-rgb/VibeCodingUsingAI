'use client'
/**
 * LogoutButton.tsx — 로그아웃 버튼 (다크모드 지원)
 */

import { useLogout } from '@/hooks/useAuth'

export function LogoutButton() {
  const { logout } = useLogout()

  return (
    <button
      onClick={logout}
      className="min-h-11 rounded-full px-3 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      로그아웃
    </button>
  )
}
