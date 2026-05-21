/**
 * Button.tsx — 공통 버튼 컴포넌트
 *
 * 실무 패턴: React.ButtonHTMLAttributes를 extends 해서
 * 기본 button의 모든 속성(onClick, disabled 등)을 그대로 사용할 수 있게 합니다.
 * shadcn/ui, MUI 같은 UI 라이브러리도 이 방식으로 만들어져 있어요.
 */

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

// React.ButtonHTMLAttributes<HTMLButtonElement>를 extends 하면
// onClick, disabled, type 등 button의 모든 기본 속성을 자동으로 사용 가능
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean // 로딩 스피너 표시용
  children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-black text-white hover:bg-gray-800',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  ghost: 'text-gray-700 hover:bg-gray-100',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...rest // 나머지 button 속성들 (onClick 등) 그대로 전달
}: ButtonProps) {
  return (
    <button
      // disabled 상태: 로딩 중이거나 disabled props가 true일 때
      disabled={isLoading || disabled}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-md font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...rest}
    >
      {/* 로딩 중일 때 스피너 표시 */}
      {isLoading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
