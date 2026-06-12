/**
 * LoadingSpinner.tsx — 로딩 스피너 공통 컴포넌트
 *
 * 재사용성: 여러 곳에서 중복 사용되는 로딩 UI
 */

import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

const sizeStyles = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-4',
}

export function LoadingSpinner({ size = 'md', label, className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className={cn(
        'border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin',
        sizeStyles[size]
      )} />
      {label && <p className="text-sm text-gray-400 dark:text-gray-500">{label}</p>}
    </div>
  )
}
