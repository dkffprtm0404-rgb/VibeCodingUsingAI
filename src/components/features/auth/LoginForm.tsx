'use client'
/**
 * LoginForm.tsx — 로그인 폼 컴포넌트 (Client Component)
 */

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setIsLoading(false)

    if (result?.error) {
      setError('이메일 또는 비밀번호가 올바르지 않아요.')
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* 이메일 */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          이메일
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="test@test.com"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm
                     outline-none transition-colors
                     focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
                     placeholder:text-gray-400"
        />
      </div>

      {/* 비밀번호 */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm
                     outline-none transition-colors
                     focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
                     placeholder:text-gray-400"
        />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-sm">⚠️</span>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 로그인 버튼 */}
      <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
        로그인
      </Button>

      {/* 테스트 계정 안내 */}
      <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          🧪 테스트 계정: <span className="font-mono font-medium">test@test.com</span> / <span className="font-mono font-medium">1234</span>
        </p>
      </div>

      {/* 회원가입 링크 */}
      <p className="text-center text-sm text-gray-500">
        아직 계정이 없으신가요?{' '}
        <Link href="/signup" className="font-medium text-gray-900 hover:underline underline-offset-2">
          회원가입
        </Link>
      </p>

    </form>
  )
}
