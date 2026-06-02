'use client'
/**
 * LogoutButton.tsx — 로그아웃 버튼
 * useLogout 훅으로 로직 분리
 */

import { useLogout } from '@/hooks/useAuth'

export function LogoutButton() {
  const { logout } = useLogout()

  return (
    <button
      onClick={logout}
      className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
    >
      로그아웃
    </button>
  )
}
