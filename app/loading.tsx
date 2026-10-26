export default function GlobalLoading() {
  return (
    <div className="shop-page" role="status" aria-label="페이지를 불러오는 중">
      <div className="mb-8 space-y-3"><div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" /><div className="h-9 w-64 max-w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" /></div>
      <div className="grid gap-5 md:grid-cols-3"><div className="shop-surface h-80 animate-pulse bg-sage-100 md:col-span-2 dark:bg-sage-900" /><div className="shop-surface h-80 animate-pulse" /></div>
      <p className="shop-muted mt-6 text-center text-xs">당신의 다음 취향을 불러오고 있어요.</p>
    </div>
  )
}
