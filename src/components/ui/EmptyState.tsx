/**
 * EmptyState.tsx — 빈 상태 공통 컴포넌트
 *
 * 재사용성: 장바구니, 주문 내역, 찜 목록 등 여러 곳에서 중복되는 빈 상태 UI
 */

import Link from 'next/link'
import { Button } from './Button'

interface EmptyStateProps {
  icon: string
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
      {description && <p className="text-gray-500 text-sm mb-8">{description}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  )
}
