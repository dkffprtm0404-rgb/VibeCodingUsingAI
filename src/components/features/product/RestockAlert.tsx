'use client'
/**
 * RestockAlert.tsx — 재입고 알림 버튼
 *
 * 품절 상품 상세 페이지에서만 표시
 * 로그인 안 한 경우 로그인 페이지로 이동
 */

import { useRouter } from 'next/navigation'
import { useRestock } from '@/hooks/useRestock'
import { toast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

interface RestockAlertProps {
  productId: number
  isLoggedIn: boolean
}

export function RestockAlert({ productId, isLoggedIn }: RestockAlertProps) {
  const router = useRouter()
  const { isAlerted, isLoading, error, toggle } = useRestock({ productId, isLoggedIn })

  const handleClick = async () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/products/${productId}`)
      return
    }
    await toggle()
    if (!error) {
      if (isAlerted) {
        toast.info('재입고 알림을 취소했어요')
      } else {
        toast.success('재입고 시 알림을 보내드릴게요 🔔')
      }
    }
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={cn(
          'w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl',
          'text-sm font-semibold border-2 transition-all duration-150 disabled:opacity-50',
          isAlerted
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
            : 'bg-white dark:bg-transparent text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-400'
        )}
      >
        <span className="text-base">{isAlerted ? '🔔' : '🔕'}</span>
        {isAlerted ? '재입고 알림 신청됨' : '재입고 알림 신청'}
      </button>
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      <p className="text-xs text-gray-400 text-center">
        {isAlerted
          ? '재입고 시 이메일로 알려드려요'
          : '품절 상품이 다시 입고되면 알림을 보내드려요'
        }
      </p>
    </div>
  )
}
