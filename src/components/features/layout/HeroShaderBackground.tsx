'use client'

import { useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'

const HeroShaderCanvas = dynamic(
  () => import('./HeroShaderCanvas').then((module) => module.HeroShaderCanvas),
  { ssr: false },
)

const MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeToMotionPreference(onChange: () => void) {
  const mediaQuery = window.matchMedia(MOTION_QUERY)
  mediaQuery.addEventListener('change', onChange)
  return () => mediaQuery.removeEventListener('change', onChange)
}

function canAnimate() {
  return !window.matchMedia(MOTION_QUERY).matches
}

function serverSnapshot() {
  return false
}

export function HeroShaderBackground() {
  // 서버와 첫 렌더는 정적 배경을 유지하고, 모션 허용 시에만 GPU 코드를 불러온다.
  const motionAllowed = useSyncExternalStore(
    subscribeToMotionPreference,
    canAnimate,
    serverSnapshot,
  )

  return (
    <div
      aria-hidden="true"
      className="shop-hero-background pointer-events-none absolute inset-0 overflow-hidden"
    >
      {motionAllowed && <HeroShaderCanvas />}
    </div>
  )
}
