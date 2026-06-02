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
    <div className="mb-8">
      {label && (
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          {label}
        </p>
      )}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {description && <p className="text-gray-500 mt-1 text-sm">{description}</p>}
    </div>
  )
}
