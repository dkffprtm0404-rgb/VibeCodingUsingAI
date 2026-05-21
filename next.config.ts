/**
 * next.config.ts — Next.js 설정 파일
 *
 * Next.js의 다양한 설정을 여기서 관리합니다.
 */

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // 외부 이미지 URL을 허용할 도메인 설정
    // Next.js Image 컴포넌트는 보안상 허용된 도메인만 최적화합니다
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
