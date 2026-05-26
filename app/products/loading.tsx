/**
 * app/products/loading.tsx — 상품 목록 로딩 스켈레톤 UI
 *
 * 상품 목록 페이지 로딩 중 실제 레이아웃과 유사한 스켈레톤을 표시합니다.
 * 스켈레톤 UI: 실제 콘텐츠 모양의 회색 박스로 로딩 중임을 표시하는 UX 패턴
 */

export default function ProductsLoading() {
  return (
    <div>
      {/* 헤더 배너 스켈레톤 */}
      <div className="bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="h-3 w-20 bg-gray-800 rounded-full" />
          <div className="h-8 w-48 bg-gray-800 rounded-xl" />
          <div className="h-4 w-64 bg-gray-800 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* 필터 스켈레톤 */}
        <div className="flex gap-2 pb-4 border-b border-gray-200">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 w-16 bg-gray-100 rounded-full animate-pulse" />
          ))}
        </div>

        {/* 상품 카드 그리드 스켈레톤 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* 이미지 스켈레톤 */}
              <div className="aspect-square bg-gray-100 animate-pulse" />
              {/* 텍스트 스켈레톤 */}
              <div className="p-4 space-y-2">
                <div className="h-3.5 bg-gray-100 rounded-full animate-pulse w-3/4" />
                <div className="h-4 bg-gray-100 rounded-full animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
