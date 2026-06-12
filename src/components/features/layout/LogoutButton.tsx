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
      className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
    >
      로그아웃
    </button>
  )
}
