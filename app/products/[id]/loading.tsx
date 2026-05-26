/**
 * app/products/[id]/loading.tsx — 상품 상세 로딩 스켈레톤
 */

export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 브레드크럼 스켈레톤 */}
      <div className="h-4 w-48 bg-gray-100 rounded-full animate-pulse mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* 이미지 스켈레톤 */}
        <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />

        {/* 상품 정보 스켈레톤 */}
        <div className="space-y-5">
          <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-8 w-3/4 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-10 w-1/3 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-4 w-24 bg-gray-100 rounded-full animate-pulse" />
          <hr className="border-gray-100" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
          </div>
          <hr className="border-gray-100" />
          {/* 사이즈 버튼 스켈레톤 */}
          <div className="space-y-3">
            <div className="h-4 w-20 bg-gray-100 rounded-full animate-pulse" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
