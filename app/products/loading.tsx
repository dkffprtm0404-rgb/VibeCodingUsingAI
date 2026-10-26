export default function ProductsLoading() {
  return (
    <div className="shop-page py-10 sm:py-14" role="status" aria-label="상품 목록을 불러오는 중">
      <header className="mb-9 space-y-4 border-b border-gray-200 pb-8 sm:mb-12 dark:border-gray-800">
        <div className="h-3 w-28 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
        <div className="h-9 w-3/4 max-w-md animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
      </header>
      <div className="mb-8 space-y-5">
        <div className="h-12 max-w-2xl animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }, (_, i) => <div key={i} className="h-11 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />)}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 min-[375px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 lg:gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="shop-surface overflow-hidden">
            <div className="aspect-[3/4] animate-pulse bg-gray-100 dark:bg-gray-800" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
