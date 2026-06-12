'use client'
/**
 * SignUpForm.tsx — 회원가입 폼 (다크모드 지원)
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

  const baseInput =
    'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors placeholder:text-gray-400 ' +
    'bg-white dark:bg-gray-800 text-gray-900 dark:text-white '

  const normalInput = cn(baseInput,
    'border-gray-300 dark:border-gray-600 focus:border-gray-900 dark:focus:border-white focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-white/10')
  const errorInput = cn(baseInput,
    'border-red-400 dark:border-red-600 focus:ring-2 focus:ring-red-400/10')

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="name" className={labelClass}>이름</label>
        <input id="name" type="text" value={name} required
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동" className={normalInput} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className={labelClass}>이메일</label>
        <input id="email" type="email" value={email} required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com" className={normalInput} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className={labelClass}>비밀번호</label>
        <input id="password" type="password" value={password} required
          onChange={(e) => setPassword(e.target.value)}
          placeholder={`${MIN_PASSWORD_LENGTH}자 이상 입력해주세요`}
          className={isPasswordTooShort ? errorInput : normalInput} />
        {isPasswordTooShort && (
          <p className="text-xs text-red-500 dark:text-red-400">비밀번호는 {MIN_PASSWORD_LENGTH}자 이상이어야 해요.</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="passwordConfirm" className={labelClass}>비밀번호 확인</label>
        <input id="passwordConfirm" type="password" value={passwordConfirm} required
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="비밀번호를 다시 입력해주세요"
          className={isPasswordMismatch ? errorInput : normalInput} />
        {isPasswordMismatch && (
          <p className="text-xs text-red-500 dark:text-red-400">비밀번호가 일치하지 않아요.</p>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl">
          <span className="text-sm">⚠️</span>
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" isLoading={isLoading}
        disabled={isPasswordMismatch || isPasswordTooShort}>
        회원가입
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="font-medium text-gray-900 dark:text-white hover:underline underline-offset-2">
          로그인
        </Link>
      </p>
    </form>
  )
}
