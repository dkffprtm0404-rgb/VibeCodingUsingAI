'use client'

import { useRef, useState } from 'react'
import { usePersonalization } from '@/hooks/usePersonalization'
import { ApiError, styleQuizApi } from '@/lib/api'
import { MOCK_PRODUCTS } from '@/lib/mock-data'
import {
  beginPersonalizationRequest,
  isPersonalizationRequestCurrent,
  savePersonalizationResult,
  setPersonalizationIdentity,
} from '@/lib/personalization'
import { createClient } from '@/lib/supabase/client'
import type { StyleQuizAnswer } from '@/types/style'

export function useStyleQuiz() {
  const { profile } = usePersonalization()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [loginRequired, setLoginRequired] = useState(false)
  const inFlight = useRef(false)

  const clearError = () => { setError(''); setLoginRequired(false) }

  const analyze = async (answers: Partial<StyleQuizAnswer>): Promise<boolean> => {
    if (inFlight.current) return false
    inFlight.current = true
    setIsAnalyzing(true)
    clearError()
    const request = beginPersonalizationRequest()
    try {
      if (!request) throw new ApiError(401, '로그인하고 스타일 진단을 진행해주세요.')
      const data = await styleQuizApi.analyze(answers)
      if (!isPersonalizationRequestCurrent(request)) return false

      // 다른 탭의 인증 이벤트가 아직 전달되지 않은 경우에도 현재 소유자를 재확인한다.
      const { data: auth, error: authError } = await createClient().auth.getUser()
      if (!isPersonalizationRequestCurrent(request)) return false
      if (authError) throw new Error('AUTH_VERIFICATION_FAILED')
      if (auth.user?.id !== request.ownerId) {
        setPersonalizationIdentity(auth.user?.id ?? null)
        return false
      }
      if (!savePersonalizationResult(request, data.result)) {
        throw new ApiError(502, '진단 결과를 확인하지 못했어요. 다시 시도해주세요.')
      }
      return true
    } catch (cause) {
      if (request && !isPersonalizationRequestCurrent(request)) return false
      setLoginRequired(cause instanceof ApiError && cause.status === 401)
      setError(cause instanceof ApiError ? cause.message : '분석 중 오류가 발생했어요. 다시 시도해주세요.')
      return false
    } finally {
      inFlight.current = false
      setIsAnalyzing(false)
    }
  }

  const products = [...new Set(profile?.result.productIds ?? [])].flatMap((id) => {
    const product = MOCK_PRODUCTS.find((item) => item.id === id && item.stock > 0)
    return product ? [product] : []
  })

  return { result: profile?.result ?? null, products, analyze, isAnalyzing, error, loginRequired, clearError }
}
