'use client'
/**
 * LoginForm.tsx — 로그인 폼 (Supabase Auth 버전)
 *
 * NextAuth 대신 Supabase Auth API를 직접 호출합니다.
 */

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    setIsLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    // 로그인 성공 → 페이지 새로고침 후 이동 (세션 반영)
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          이메일
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm
                     outline-none transition-colors
                     focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
                     placeholder:text-gray-400"
        />
      </div>

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
