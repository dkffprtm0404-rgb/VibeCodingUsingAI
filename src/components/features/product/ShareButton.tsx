'use client'
/**
 * ShareButton.tsx — 상품 공유 버튼
 *
 * 모바일(Web Share API 지원)에서는 네이티브 공유 시트를 띄우고,
 * 미지원 환경(PC 브라우저 등)에서는 링크를 클립보드에 복사합니다.
 */

import { toast } from '@/components/ui/Toast'

interface ShareButtonProps {
  title: string
  text?: string
  url: string  // 절대 경로(/products/1) 또는 전체 URL
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
  const handleShare = async () => {
    const shareUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`

    // Web Share API 지원 환경 (대부분의 모바일 브라우저)
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl })
      } catch (err) {
        // 사용자가 공유를 취소한 경우(AbortError)는 무시
        if (err instanceof Error && err.name !== 'AbortError') {
          toast.error('공유 중 오류가 발생했어요')
        }
      }
      return
    }

    // 미지원 환경 — 클립보드 복사로 폴백
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('링크를 복사했어요 📋')
    } catch {
      toast.error('링크 복사에 실패했어요')
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label="상품 공유하기"
      className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium w-full
                 transition-all duration-150
                 bg-white dark:bg-gray-800
                 border-gray-200 dark:border-gray-600
                 text-gray-700 dark:text-gray-100
                 hover:border-gray-400 dark:hover:border-gray-400
                 hover:bg-gray-50 dark:hover:bg-gray-700"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
      <span>공유</span>
    </button>
  )
}
