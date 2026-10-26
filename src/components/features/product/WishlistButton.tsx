'use client'
/**
 * WishlistButton.tsx — 찜하기 버튼 (다크모드 밝은 텍스트)
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
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        aria-label={isWished ? '찜 취소' : '찜하기'}
        className={cn(
          'flex min-h-12 items-center justify-center gap-2 px-3 py-3 rounded-2xl border text-sm font-medium w-full',
          'transition-all duration-150 disabled:opacity-50',
          isWished
            ? 'bg-sage-100 dark:bg-sage-900 border-sage-200 dark:border-sage-800 text-sage-800 dark:text-sage-100 hover:bg-sage-200 dark:hover:bg-sage-800'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-100 hover:border-gray-400 dark:hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
        )}
      >
        <svg aria-hidden="true" className="size-4 shrink-0" viewBox="0 0 24 24" fill={isWished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" /></svg>
        <span>{isWished ? '찜 취소' : '찜하기'}</span>
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
