/**
 * app/api/auth/[...nextauth]/route.ts — NextAuth API 라우트
 *
 * [...nextauth] = catch-all 라우트
 * /api/auth/signin, /api/auth/signout, /api/auth/session 등
 * NextAuth가 필요한 모든 API를 이 파일 하나에서 처리합니다.
 *
 * 실무에서도 이 파일은 항상 이 형태 그대로 씁니다. 건드릴 필요 없어요.
 */

import { handlers } from '@/lib/auth'

// GET, POST 요청 모두 NextAuth handlers에 위임
export const { GET, POST } = handlers
