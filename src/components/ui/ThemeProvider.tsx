'use client'
/**
 * ThemeProvider.tsx — 다크모드 테마 프로바이더
 *
 * next-themes: Next.js에서 다크모드를 가장 간단하게 구현하는 라이브러리
 * - 시스템 설정 자동 감지
 * - localStorage에 사용자 선택 저장
 * - Hydration 오류 없이 동작
 */

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"        // html 태그에 class="dark" 추가 방식
      defaultTheme="system"    // 시스템 설정 기본값
      enableSystem             // 시스템 다크모드 감지 활성화
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
