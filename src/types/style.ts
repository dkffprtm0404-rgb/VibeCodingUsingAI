/**
 * style.ts — 스타일 진단 관련 타입 정의
 */

export interface StyleQuizAnswer {
  situation: string
  fit: string
  vibe: string
  color: string
}

export interface StyleResult {
  type: string
  emoji: string
  description: string
  keywords: string[]
  coordi: string
  productIds: number[]
  tip: string
}
