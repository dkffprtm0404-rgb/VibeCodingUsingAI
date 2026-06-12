/**
 * app/loading.tsx — 전역 로딩 UI (다크모드 지원)
 */

export default function GlobalLoading() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
        <p className="text-sm text-gray-400 dark:text-gray-500">불러오는 중...</p>
      </div>
    </div>
  )
}
