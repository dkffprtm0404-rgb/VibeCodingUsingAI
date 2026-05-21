'use client'
/**
 * LoginForm.tsx — 로그인 폼 컴포넌트 (Client Component)
 *
 * 'use client' 이유: 폼 입력 상태, 에러 상태, 로딩 상태 관리
 *
 * 실무 패턴:
 * - useActionState 대신 직접 상태 관리 (Next.js 16 호환성)
 * - signIn() 호출 후 에러 처리
 * - callbackUrl 파라미터로 로그인 후 원래 페이지로 복귀
 */

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/Button'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 로그인 후 돌아갈 페이지 (없으면 홈으로)
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    // form 기본 동작(페이지 새로고침) 방지
    e.preventDefault()
    setError('')
    setIsLoading(true)

    /**
     * signIn('credentials', ...): NextAuth Credentials 로그인 호출
     * redirect: false → 에러 발생 시 직접 처리 (페이지 이동 X)
     */
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setIsLoading(false)

    if (result?.error) {
      // 로그인 실패 시 에러 메시지 표시
      setError('이메일 또는 비밀번호가 올바르지 않아요.')
      return
    }

    // 로그인 성공 → callbackUrl로 이동
    router.push(callbackUrl)
    router.refresh() // 서버 컴포넌트 세션 정보 갱신
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* 이메일 입력 */}
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

      {/* 비밀번호 입력 */}
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
          <span className="text-red-500 text-sm">⚠️</span>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* 로그인 버튼 */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={isLoading}
      >
        로그인
      </Button>

      {/* 테스트 계정 안내 (개발용) */}
      <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          🧪 테스트 계정: <span className="font-mono font-medium">test@test.com</span> / <span className="font-mono font-medium">1234</span>
        </p>
      </div>

    </form>
  )
}
