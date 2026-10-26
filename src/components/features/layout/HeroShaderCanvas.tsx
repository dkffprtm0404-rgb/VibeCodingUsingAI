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
        colorA="#14281d"
        colorB="#496f51"
        colorC="#8faa76"
        colorD="#c5d6ab"
        speed={0.12}
        distortion={0.3}
        seed={8}
      />
    </Shader>
  )
}
