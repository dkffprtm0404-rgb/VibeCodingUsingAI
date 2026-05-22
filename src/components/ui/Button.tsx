/**
 * Button.tsx — 공통 버튼 컴포넌트
 *
 * 개선 사항:
 * - cn() 유틸로 className 충돌 없이 병합
 * - variant 스타일 명확하게 분리
 * - 어두운 배경용 'white' variant 추가
 */

import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'white'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  // 기본: 검정 배경 흰 글자
  primary: 'bg-gray-900 text-white hover:bg-gray-700 border border-transparent',
  // 밝은 회색
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-transparent',
  // 테두리
  outline: 'bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-50',
  // 배경 없음
  ghost: 'bg-transparent text-gray-700 border border-transparent hover:bg-gray-100',
  // 어두운 배경 위에 사용하는 흰 버튼
  white: 'bg-white text-gray-900 border border-white hover:bg-gray-100',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-sm font-semibold rounded-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={isLoading || disabled}
      className={cn(
        // 기본 스타일
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        // variant + size
        variantStyles[variant],
        sizeStyles[size],
        // 외부에서 넘긴 className (마지막에 적용되어 override 가능)
        className
      )}
      {...rest}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
