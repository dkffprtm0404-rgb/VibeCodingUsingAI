'use client'
/**
 * SignUpForm.tsx — 회원가입 폼 (Supabase Auth 버전)
 *
 * /api/auth/signup 호출 → Supabase에 유저 생성
 * 성공 시 로그인 페이지로 이동
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export function SignUpForm() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않아요.')
      return
    }

    setIsLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })

    const data = await res.json()
    setIsLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    // 회원가입 성공 → 로그인 페이지로 이동
    router.push('/login?signup=success')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm
                     outline-none transition-colors
                     focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
                     placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
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
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="4자 이상 입력해주세요"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm
                     outline-none transition-colors
                     focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
                     placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
        <input
          id="passwordConfirm"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="비밀번호를 다시 입력해주세요"
          required
          className={`
            w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors
            placeholder:text-gray-400
            ${isPasswordMismatch
              ? 'border-red-400 focus:ring-2 focus:ring-red-400/10'
              : 'border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10'
            }
          `}
        />
        {isPasswordMismatch && (
          <p className="text-xs text-red-500">비밀번호가 일치하지 않아요.</p>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-sm">⚠️</span>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={isLoading}
        disabled={isPasswordMismatch}
      >
        회원가입
      </Button>

      <p className="text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="font-medium text-gray-900 hover:underline underline-offset-2">
          로그인
        </Link>
      </p>

    </form>
  )
}
