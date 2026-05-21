'use client'
/**
 * SignUpForm.tsx — 회원가입 폼 컴포넌트 (Client Component)
 *
 * 실무 패턴:
 * - 비밀번호 확인 유효성 검사 (클라이언트 레벨)
 * - 회원가입 성공 후 자동 로그인 → 홈으로 이동
 * - 실제 서비스에서는 API Route에서 DB에 유저 저장 + bcrypt 암호화
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
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

  // 비밀번호 확인 일치 여부 (실시간)
  const isPasswordMismatch = passwordConfirm.length > 0 && password !== passwordConfirm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 클라이언트 유효성 검사
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않아요.')
      return
    }
    if (password.length < 4) {
      setError('비밀번호는 4자 이상이어야 해요.')
      return
    }

    setIsLoading(true)

    /**
     * TODO: 실제 회원가입 API 연동
     * await fetch('/api/auth/signup', {
     *   method: 'POST',
     *   body: JSON.stringify({ name, email, password }),
     * })
     *
     * 지금은 회원가입 성공으로 간주하고 바로 로그인 처리
     * (테스트 계정 test@test.com / 1234 만 실제 로그인 가능)
     */

    // 회원가입 후 자동 로그인 시도
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setIsLoading(false)

    if (result?.error) {
      // 테스트 환경에서는 test@test.com 외 계정은 로그인 불가
      // 실제 DB 연동 시 이 분기는 사라짐
      setError('현재 테스트 환경입니다. test@test.com / 1234 계정만 사용 가능해요.')
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* 이름 */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          이름
        </label>
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
          placeholder="example@email.com"
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
          placeholder="4자 이상 입력해주세요"
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm
                     outline-none transition-colors
                     focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10
                     placeholder:text-gray-400"
        />
      </div>

      {/* 비밀번호 확인 */}
      <div className="space-y-1.5">
        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
          비밀번호 확인
        </label>
        <input
          id="passwordConfirm"
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="비밀번호를 다시 입력해주세요"
          required
          className={`
            w-full px-4 py-3 rounded-xl border text-sm
            outline-none transition-colors
            placeholder:text-gray-400
            ${isPasswordMismatch
              ? 'border-red-400 focus:ring-2 focus:ring-red-400/10'
              : 'border-gray-300 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10'
            }
          `}
        />
        {/* 실시간 비밀번호 불일치 안내 */}
        {isPasswordMismatch && (
          <p className="text-xs text-red-500">비밀번호가 일치하지 않아요.</p>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-red-500 text-sm">⚠️</span>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 회원가입 버튼 */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={isLoading}
        disabled={isPasswordMismatch}
      >
        회원가입
      </Button>

      {/* 로그인 페이지 링크 */}
      <p className="text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="font-medium text-gray-900 hover:underline underline-offset-2">
          로그인
        </Link>
      </p>

    </form>
  )
}
