export default function ProductDetailLoading() {
  return (
    <div className="shop-page py-6 sm:py-10" role="status" aria-label="상품 상세를 불러오는 중">
      <div className="mb-8 h-4 w-48 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-8">
        <div className="aspect-[4/5] animate-pulse rounded-3xl bg-gray-200 dark:bg-gray-800" />
        <div className="shop-surface space-y-6 p-6 sm:p-8">
          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
          <div className="h-8 w-3/4 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
          <div className="h-10 w-1/3 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
          <div className="h-4 w-24 animate-pulse rounded-full bg-gray-100 dark:bg-gray-800" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
            <div className="h-24 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 4 }, (_, i) => <div key={i} className="h-12 w-14 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}
          </div>
          <div className="h-14 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
          <div className="h-14 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  )
}
