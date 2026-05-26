/**
 * app/orders/loading.tsx — 주문 내역 로딩 스켈레톤
 */

export default function OrdersLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="h-8 w-32 bg-gray-100 rounded-xl animate-pulse mb-8" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between">
              <div className="h-4 w-40 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="w-14 h-14 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-gray-100 rounded-full animate-pulse" />
              <div className="h-5 w-24 bg-gray-100 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
