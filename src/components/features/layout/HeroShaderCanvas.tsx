'use client'

import { useState } from 'react'
import { FlowingGradient, Shader } from 'shaders/react'

export function HeroShaderCanvas() {
  const [unavailable, setUnavailable] = useState(false)

  // GPU를 사용할 수 없으면 부모의 정적 그라데이션을 그대로 보여준다.
  if (unavailable) return null

  return (
    <Shader
      className="h-full w-full"
      disableTelemetry
      onUnavailable={() => setUnavailable(true)}
    >
      <FlowingGradient
        colorA="#080e20"
        colorB="#5b4bba"
        colorC="#1f8492"
        colorD="#c0a1db"
        speed={0.18}
        distortion={0.35}
        seed={8}
      />
    </Shader>
  )
}
