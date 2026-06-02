'use client'
/**
 * WishlistButton.tsx — 찜하기 버튼
 * useWishlist 훅으로 로직 분리 → 컴포넌트는 UI만 담당
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
          'flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium',
          'transition-all duration-150 disabled:opacity-50',
          isWished
            ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
        )}
      >
        <span className="text-lg leading-none">{isWished ? '❤️' : '🤍'}</span>
        <span>{isWished ? '찜 취소' : '찜하기'}</span>
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
