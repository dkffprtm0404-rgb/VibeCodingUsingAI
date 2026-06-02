'use client'
/**
 * LoginForm.tsx — 로그인 폼
 * useLogin 훅으로 비즈니스 로직 분리 → UI만 담당
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

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-300 text-sm outline-none transition-colors ' +
    'focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 placeholder:text-gray-400'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
        <input
          id="email" type="email" value={email} required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
        <input
          id="password" type="password" value={password} required
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-sm">⚠️</span>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
        로그인
      </Button>

      <p className="text-center text-sm text-gray-500">
        아직 계정이 없으신가요?{' '}
        <Link href="/signup" className="font-medium text-gray-900 hover:underline underline-offset-2">
          회원가입
        </Link>
      </p>
    </form>
  )
}
