/**
 * Badge.tsx — 카테고리/상태 표시용 뱃지 컴포넌트
 *
 * 실무에서 자주 쓰이는 패턴: variant(변형)를 props로 받아서
 * 하나의 컴포넌트로 다양한 스타일을 표현합니다.
 */

// variant 타입을 명시적으로 정의 (string 대신 유니온 타입 사용)
type BadgeVariant = 'default' | 'secondary' | 'outline'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant // ? → 선택적 props (없으면 default 사용)
}

// variant별 스타일 매핑 객체 — if/else 대신 객체로 관리하면 깔끔
const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-black text-white',
  secondary: 'bg-gray-100 text-gray-700',
  outline: 'border border-gray-300 text-gray-600 bg-transparent',
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        rounded-full text-xs font-medium
        ${variantStyles[variant]}
      `}
    >
      {children}
    </span>
  )
}
