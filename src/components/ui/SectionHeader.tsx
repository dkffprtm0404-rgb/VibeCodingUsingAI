/**
 * SectionHeader.tsx — 섹션 헤더 공통 컴포넌트
 *
 * 재사용성: 상품목록, 주문내역, 찜목록 등 페이지 상단 헤더 패턴 통일
 */

interface SectionHeaderProps {
  label?: string       // 상단 소제목 (ex: "Collection")
  title: string        // 메인 제목
  description?: string // 부제목
}

export function SectionHeader({ label, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-8 space-y-3 sm:mb-10">
      {label && (
        <p className="shop-kicker">
          {label}
        </p>
      )}
      <h1 className="shop-heading">{title}</h1>
      {description && <p className="shop-muted text-sm leading-relaxed">{description}</p>}
    </div>
  )
}
