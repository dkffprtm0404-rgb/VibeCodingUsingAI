/**
 * next.config.ts — Next.js 설정 파일
 */

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * standalone 모드:
   * Docker 배포에 필요한 파일만 추려서 빌드합니다.
   * node_modules 전체 대신 필요한 파일만 포함 → 이미지 크기 대폭 감소
   */
  output: 'standalone',

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
