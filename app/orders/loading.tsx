export default function OrdersLoading() {
  return (
    <div className="shop-page py-10 sm:py-14" role="status" aria-label="주문 내역을 불러오는 중">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 space-y-4">
          <div className="h-3 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="h-9 w-40 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="space-y-5">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="shop-surface space-y-5 p-5 sm:p-7">
              <div className="flex flex-wrap justify-between gap-3">
                <div className="h-4 w-40 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
              </div>
              <div className="flex gap-3">
                {Array.from({ length: 3 }, (_, j) => <div key={j} className="h-20 w-14 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800 sm:h-24 sm:w-20" />)}
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-5 dark:border-gray-800">
                <div className="h-4 w-16 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
                <div className="h-5 w-24 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
