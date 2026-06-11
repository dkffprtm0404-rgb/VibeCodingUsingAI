/**
 * useRestock.ts — 재입고 알림 커스텀 훅
 * useWishlist와 동일한 패턴으로 구현
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { restockApi, ApiError } from '@/lib/api'

interface UseRestockOptions {
  productId: number
  isLoggedIn: boolean
}

export function useRestock({ productId, isLoggedIn }: UseRestockOptions) {
  const [isAlerted, setIsAlerted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoggedIn) return
    restockApi.getAll()
      .then(({ productIds }) => setIsAlerted(productIds.includes(productId)))
      .catch(() => {})
  }, [productId, isLoggedIn])

  const toggle = useCallback(async () => {
    if (!isLoggedIn) return
    setIsLoading(true)
    setError(null)
    try {
      if (isAlerted) {
        await restockApi.remove(productId)
      } else {
        await restockApi.add(productId)
      }
      setIsAlerted((prev) => !prev)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '처리 중 오류가 발생했어요.')
    } finally {
      setIsLoading(false)
    }
  }, [productId, isLoggedIn, isAlerted])

  return { isAlerted, isLoading, error, toggle }
}
