/**
 * EmptyState.tsx — 빈 상태 공통 컴포넌트
 *
 * 재사용성: 장바구니, 주문 내역, 찜 목록 등 여러 곳에서 중복되는 빈 상태 UI
 */

import Link from 'next/link'

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
    <div className="shop-surface flex flex-col items-center justify-center px-5 py-20 text-center sm:py-24">
      <div className="mb-6 flex size-20 items-center justify-center rounded-3xl bg-sage-100 dark:bg-sage-900">
        <span aria-hidden="true" className="text-3xl">{icon}</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
      {description && <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">{description}</p>}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="shop-primary-link">{actionLabel}</Link>
      )}
    </div>
  )
}
