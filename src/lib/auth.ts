/**
 * auth.ts — NextAuth 설정
 *
 * NextAuth v5 (beta) 설정 파일입니다.
 * 이메일 + 비밀번호 로그인을 위해 Credentials Provider를 사용합니다.
 *
 * 실무 패턴:
 * - auth 설정을 lib/auth.ts 에 두고 앱 전체에서 import해서 사용
 * - 실제 서비스에서는 DB 연동 (Prisma + PostgreSQL 등)
 * - 지금은 하드코딩된 테스트 계정으로 동작 확인 후 DB 연동 예정
 */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  /**
   * 커스텀 로그인 페이지 경로 지정
   * 지정하지 않으면 NextAuth 기본 UI 사용
   */
  pages: {
    signIn: '/login',
  },

  providers: [
    Credentials({
      /**
       * authorize: 로그인 시 자격증명 검증 함수
       * credentials: 로그인 폼에서 넘어온 값 (email, password)
       *
       * 실무에서는 여기서 DB 조회 + bcrypt 비밀번호 검증
       * 지금은 테스트 계정으로 동작 확인
       */
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }

        /**
         * TODO: 실제 DB 연동 시 아래로 교체
         * const user = await db.user.findUnique({ where: { email } })
         * if (!user) return null
         * const isValid = await bcrypt.compare(password, user.password)
         * if (!isValid) return null
         * return user
         */

        // 임시 테스트 계정 (개발용)
        const TEST_ACCOUNT = {
          email: 'test@test.com',
          password: '1234',
        }

        if (
          email === TEST_ACCOUNT.email &&
          password === TEST_ACCOUNT.password
        ) {
          // 반환값이 세션에 저장되는 유저 정보
          return {
            id: '1',
            email: TEST_ACCOUNT.email,
            name: '테스트 유저',
          }
        }

        // 인증 실패 시 null 반환 → 로그인 실패 처리
        return null
      },
    }),
  ],

  /**
   * session 전략: jwt (기본값)
   * DB 없이도 동작하는 방식 (토큰 기반)
   * 실무에서 DB 연동 시 "database" 전략으로 변경
   */
  session: {
    strategy: 'jwt',
  },
})
