/**
 * useWishlist.ts — 찜하기 커스텀 훅
 *
 * 재사용성: WishlistButton 컴포넌트에서 로직 분리
 * → 다른 컴포넌트(상품 카드, 목록 페이지)에서도 재사용 가능
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { wishlistApi, ApiError } from '@/lib/api'

interface UseWishlistOptions {
  productId: number
  isLoggedIn: boolean
}

interface UseWishlistReturn {
  isWished: boolean
  isLoading: boolean
  error: string | null
  toggle: () => Promise<void>
}

export function useWishlist({ productId, isLoggedIn }: UseWishlistOptions): UseWishlistReturn {
  const [isWished, setIsWished] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 초기 찜 여부 조회
  useEffect(() => {
    if (!isLoggedIn) return

    wishlistApi.getAll()
      .then(({ productIds }) => setIsWished(productIds.includes(productId)))
      .catch(() => {
        // 찜 목록 조회 실패는 조용히 처리 (UX에 영향 최소화)
      })
  }, [productId, isLoggedIn])

  const toggle = useCallback(async () => {
    if (!isLoggedIn) return
    setIsLoading(true)
    setError(null)

    try {
      if (isWished) {
        await wishlistApi.remove(productId)
      } else {
        await wishlistApi.add(productId)
      }
      setIsWished((prev) => !prev)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : '찜하기 처리 중 오류가 발생했어요.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [productId, isLoggedIn, isWished])

  return { isWished, isLoading, error, toggle }
}
