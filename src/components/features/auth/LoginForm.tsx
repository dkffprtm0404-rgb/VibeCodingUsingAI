'use client'
/**
 * LoginForm.tsx — 로그인 폼 (다크모드 지원)
 */

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useLogin } from '@/hooks/useAuth'

export function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  const { login, isLoading, error } = useLogin(callbackUrl)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  const inputClass = 'shop-input'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">이메일</label>
        <input id="email" type="email" autoComplete="email" value={email} required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className={inputClass} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">비밀번호</label>
        <input id="password" type="password" autoComplete="current-password" value={password} required
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClass} />
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl">
          <span className="text-sm">⚠️</span>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
        로그인
      </Button>

      <p className="shop-muted flex flex-wrap items-center justify-center gap-x-2 text-sm">
        아직 계정이 없으신가요?{' '}
        <Link href="/signup" className="inline-flex min-h-11 items-center font-medium text-gray-900 underline-offset-4 hover:underline dark:text-white">
          회원가입
        </Link>
      </p>
    </form>
  )
}
