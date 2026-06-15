/**
 * useCoupon.ts — 쿠폰 적용/해제 커스텀 훅
 *
 * CheckoutForm에서 쿠폰 입력 → 검증 → 할인 금액 적용까지 관리합니다.
 * 최종 검증은 /api/orders 에서 서버가 다시 수행합니다.
 */

'use client'

import { useState, useCallback } from 'react'
import { couponApi, ApiError } from '@/lib/api'
import type { AppliedCoupon } from '@/types/coupon'

export function useCoupon(totalPrice: number) {
  const [code, setCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const apply = useCallback(async () => {
    if (!code.trim()) {
      setError('쿠폰 코드를 입력해주세요.')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      const result = await couponApi.validate(code, totalPrice)
      setAppliedCoupon(result)
      setCode('')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '쿠폰 확인 중 오류가 발생했어요.')
    } finally {
      setIsLoading(false)
    }
  }, [code, totalPrice])

  const remove = useCallback(() => {
    setAppliedCoupon(null)
    setError('')
  }, [])

  return {
    code,
    setCode,
    appliedCoupon,
    isLoading,
    error,
    apply,
    remove,
  }
}
