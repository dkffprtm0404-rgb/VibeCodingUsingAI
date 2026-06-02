'use client'
/**
 * SignUpForm.tsx — 회원가입 폼
 * useSignUp 훅으로 비즈니스 로직 분리 → UI만 담당
 */

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { useSignUp } from '@/hooks/useAuth'
import { MIN_PASSWORD_LENGTH } from '@/constants'
import { cn } from '@/lib/utils'

export function SignUpForm() {
  const { signUp, isLoading, error } = useSignUp()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm
  const isPasswordTooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signUp(name, email, password, passwordConfirm)
  }

  const baseInputClass =
    'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors placeholder:text-gray-400'
  const normalInputClass = cn(baseInputClass, 'border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10')
  const errorInputClass = cn(baseInputClass, 'border-red-400 focus:ring-2 focus:ring-red-400/10')

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
        <input id="name" type="text" value={name} required
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동" className={normalInputClass} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
        <input id="email" type="email" value={email} required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com" className={normalInputClass} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
        <input id="password" type="password" value={password} required
          onChange={(e) => setPassword(e.target.value)}
          placeholder={`${MIN_PASSWORD_LENGTH}자 이상 입력해주세요`}
          className={isPasswordTooShort ? errorInputClass : normalInputClass} />
        {isPasswordTooShort && (
          <p className="text-xs text-red-500">비밀번호는 {MIN_PASSWORD_LENGTH}자 이상이어야 해요.</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">비밀번호 확인</label>
        <input id="passwordConfirm" type="password" value={passwordConfirm} required
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="비밀번호를 다시 입력해주세요"
          className={isPasswordMismatch ? errorInputClass : normalInputClass} />
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

      <Button type="submit" size="lg" className="w-full" isLoading={isLoading}
        disabled={isPasswordMismatch || isPasswordTooShort}>
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
