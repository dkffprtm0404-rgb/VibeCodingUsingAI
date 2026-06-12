/**
 * app/products/loading.tsx — 상품 목록 스켈레톤 (다크모드 지원)
 */

export default function ProductsLoading() {
  return (
    <div>
      <div className="bg-gray-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="h-3 w-20 bg-gray-800 rounded-full" />
          <div className="h-8 w-48 bg-gray-800 rounded-xl" />
          <div className="h-4 w-64 bg-gray-800 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="flex gap-2 pb-4 border-b border-gray-200 dark:border-gray-800">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 w-16 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-3.5 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse w-3/4" />
                <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
