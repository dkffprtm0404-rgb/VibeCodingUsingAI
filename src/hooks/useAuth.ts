/**
 * useAuth.ts — 인증 커스텀 훅
 *
 * 재사용성: LoginForm, SignUpForm의 중복 로직 추상화
 * → 폼 상태, 로딩, 에러 처리 패턴 통일
 */

'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, ApiError } from '@/lib/api'
import { MIN_PASSWORD_LENGTH } from '@/constants'

// 로그인 훅
export function useLogin(callbackUrl: string = '/') {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const login = useCallback(async (email: string, password: string) => {
    setError('')
    setIsLoading(true)

    try {
      await authApi.login(email, password)
      router.push(callbackUrl)
      router.refresh()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '로그인 중 오류가 발생했어요.')
    } finally {
      setIsLoading(false)
    }
  }, [callbackUrl, router])

  return { login, isLoading, error }
}

// 회원가입 훅
export function useSignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validatePassword = (password: string, confirm: string): string | null => {
    if (password.length < MIN_PASSWORD_LENGTH)
      return `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 해요.`
    if (password !== confirm)
      return '비밀번호가 일치하지 않아요.'
    return null
  }

  const signUp = useCallback(async (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    setError('')

    const validationError = validatePassword(password, passwordConfirm)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    try {
      const data = await authApi.signup(name, email, password)
      if (data.autoLogin) {
        router.push('/')
        router.refresh()
      } else {
        router.push('/login?signup=success')
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '회원가입 중 오류가 발생했어요.')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  return { signUp, isLoading, error }
}

// 로그아웃 훅
export function useLogout() {
  const router = useRouter()

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
      router.push('/')
      router.refresh()
    } catch {
      // 로그아웃 실패해도 홈으로 이동
      router.push('/')
      router.refresh()
    }
  }, [router])

  return { logout }
}
