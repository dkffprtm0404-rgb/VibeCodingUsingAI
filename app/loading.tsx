/**
 * app/loading.tsx — 전역 로딩 UI
 *
 * Next.js App Router에서 페이지 로딩 중 자동으로 표시됩니다.
 * Suspense 경계로 동작 — 페이지 데이터 fetch 중 보여줌
 */

export default function GlobalLoading() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* 스피너 */}
        <div className="w-10 h-10 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">불러오는 중...</p>
      </div>
    </div>
  )
}
