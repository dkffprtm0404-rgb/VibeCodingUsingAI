'use client'
/**
 * WishlistButton.tsx — 찜하기 버튼
 *
 * 상품 상세 페이지에서 사용
 * 로그인 안 한 경우 로그인 페이지로 이동
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface WishlistButtonProps {
  productId: number
  isLoggedIn: boolean
}

export function WishlistButton({ productId, isLoggedIn }: WishlistButtonProps) {
  const router = useRouter()
  const [isWished, setIsWished] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 찜 여부 초기 조회
  useEffect(() => {
    if (!isLoggedIn) return
    fetch('/api/wishlist')
      .then((r) => r.json())
      .then((data) => {
        if (data.productIds) {
          setIsWished(data.productIds.includes(productId))
        }
      })
  }, [productId, isLoggedIn])

  const handleToggle = async () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=/products/${productId}`)
      return
    }

    setIsLoading(true)
    const method = isWished ? 'DELETE' : 'POST'

    await fetch('/api/wishlist', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })

    setIsWished(!isWished)
    setIsLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium
        transition-all duration-150 disabled:opacity-50
        ${isWished
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
        }
      `}
      aria-label={isWished ? '찜 취소' : '찜하기'}
    >
      <span className="text-lg leading-none">{isWished ? '❤️' : '🤍'}</span>
      <span>{isWished ? '찜 취소' : '찜하기'}</span>
    </button>
  )
}
