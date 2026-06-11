'use client'
/**
 * WishlistButton.tsx — 찜하기 버튼 (다크모드 지원)
 */

import { useRouter } from 'next/navigation'
import { useWishlist } from '@/hooks/useWishlist'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: number
  isLoggedIn: boolean
}

export function WishlistButton({ productId, isLoggedIn }: WishlistButtonProps) {
  const router = useRouter()
  const { isWished, isLoading, error, toggle } = useWishlist({ productId, isLoggedIn })

  const handleClick = async () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/products/${productId}`)
      return
    }
    await toggle()
  }

  return (
    <div className="space-y-1">
      <button
        onClick={handleClick}
        disabled={isLoading}
        aria-label={isWished ? '찜 취소' : '찜하기'}
        className={cn(
          'flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium w-full',
          'transition-all duration-150 disabled:opacity-50',
          isWished
            ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
        )}
      >
        <span className="text-lg leading-none">{isWished ? '❤️' : '🤍'}</span>
        <span>{isWished ? '찜 취소' : '찜하기'}</span>
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
