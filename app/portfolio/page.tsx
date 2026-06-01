/**
 * app/portfolio/page.tsx — 포트폴리오 페이지 (/portfolio)
 *
 * MyShop 프로젝트 소개 페이지입니다.
 * GitHub Pages 대신 프로젝트 내부 라우트로 제공합니다.
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '포트폴리오 | 정성윤',
  description: 'Next.js + Supabase + Claude AI 기반 풀스택 쇼핑몰 포트폴리오',
}

export default function PortfolioPage() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-[#ededed]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center text-center px-4 py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)' }} />
        </div>
        <div className="relative space-y-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full border"
            style={{ color: '#555', borderColor: '#222' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            Frontend Developer
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none">
            Next.js로 만든
            <br />
            <span style={{ color: '#333' }}>풀스택 쇼핑몰</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: '#555' }}>
            실무 수준의 구조와 기술 스택으로 개발한
            <br />AI 기능 탑재 패션 커머스 서비스
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="https://github.com/dkffprtm0404-rgb/VibeCodingUsingAI" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5"
              style={{ background: '#fff', color: '#000' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub 보기
            </a>
            <a href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border transition-all"
              style={{ background: 'transparent', color: '#666', borderColor: '#222' }}>
              라이브 데모 →
            </a>
          </div>
        </div>
      </section>

      {/* Project Card */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#333' }}>Main Project</p>
        <h2 className="text-4xl font-black tracking-tight mb-2">MyShop</h2>
        <p className="text-sm mb-12" style={{ color: '#555' }}>패션 상품 쇼핑몰 — 상품 탐색부터 AI 스타일 진단까지 실서비스 수준으로 구현</p>

        {/* Mock Browser */}
        <div className="rounded-2xl overflow-hidden border mb-0" style={{ background: '#0f0f0f', borderColor: '#1a1a1a' }}>
          <div className="border-b px-4 py-3" style={{ background: '#111', borderColor: '#1a1a1a' }}>
            <div className="rounded-lg overflow-hidden border" style={{ background: '#0d0d0d', borderColor: '#1e1e1e' }}>
              <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#181818' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <div className="flex-1 rounded h-4 mx-2" style={{ background: '#222' }} />
              </div>
              <div className="p-4">
                {/* Mock Header */}
                <div className="flex justify-between items-center mb-4 pb-3" style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <div className="h-3 w-14 rounded" style={{ background: '#2a2a2a' }} />
                  <div className="flex gap-2">
                    {[36, 36, 28].map((w, i) => (
                      <div key={i} className="h-2.5 rounded" style={{ background: i === 2 ? '#3a3a3a' : '#1e1e1e', width: w }} />
                    ))}
                  </div>
                </div>
                {/* Mock Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { bg: '#1e1e1e', sold: false },
                    { bg: '#222', sold: false },
                    { bg: '#1e1e1e', sold: true },
                    { bg: '#1a1a1a', sold: false },
                  ].map((item, i) => (
                    <div key={i} className="rounded-lg overflow-hidden border" style={{ background: '#171717', borderColor: '#1e1e1e' }}>
                      <div className="aspect-square flex items-center justify-center" style={{ background: item.bg }}>
                        {item.sold && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ color: '#ef4444', background: '#2e1515' }}>
                            SOLD
                          </span>
                        )}
                      </div>
                      <div className="p-2 space-y-1">
                        <div className="h-1.5 rounded" style={{ background: '#222' }} />
                        <div className="h-2 w-3/5 rounded" style={{ background: '#2a2a2a' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="p-8">
            <p className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: '#333' }}>🛍️ E-Commerce · Full Stack</p>
            <h3 className="text-2xl font-bold mb-3">MyShop — AI 패션 쇼핑몰</h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#555' }}>
              Next.js 16 App Router 기반 풀스택 쇼핑몰. 상품 목록/상세, 이미지 갤러리, 사이즈 가이드, 장바구니, 주문/결제, 찜하기, 검색까지 실서비스 수준으로 구현.
              Claude API로 AI 쇼핑 도우미 챗봇과 스타일 진단 기능 탑재. Supabase Auth·DB 연동, Docker 멀티스테이지 빌드 배포.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {[
                { label: 'Next.js 16', color: '#60a5fa', bg: '#0f1829', border: '#1e3355' },
                { label: 'TypeScript', color: '#60a5fa', bg: '#0f1829', border: '#1e3355' },
                { label: 'Supabase', color: '#a78bfa', bg: '#140f29', border: '#2d1e55' },
                { label: 'Claude API', color: '#4ade80', bg: '#0f2916', border: '#1a4a28' },
                { label: 'Tailwind CSS', color: '#888', bg: '#111', border: '#1e1e1e' },
                { label: 'Zustand', color: '#888', bg: '#111', border: '#1e1e1e' },
                { label: 'Docker', color: '#888', bg: '#111', border: '#1e1e1e' },
                { label: 'App Router', color: '#888', bg: '#111', border: '#1e1e1e' },
              ].map(({ label, color, bg, border }) => (
                <span key={label} className="text-xs font-medium px-3 py-1 rounded-md border"
                  style={{ color, background: bg, borderColor: border }}>
                  {label}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <a href="https://github.com/dkffprtm0404-rgb/VibeCodingUsingAI" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all hover:border-gray-500"
                style={{ background: '#111', color: '#666', borderColor: '#1e1e1e' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                소스코드
              </a>
              <a href="/products"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
                style={{ background: '#fff', color: '#000' }}>
                Live Demo →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AI Feature Banner */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="rounded-2xl p-8 sm:p-12 border relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #111 50%, #0f0f0f 100%)', borderColor: '#1e1e1e' }}>
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 relative">
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#444' }}>✨ AI Personal Stylist</p>
              <h3 className="text-2xl sm:text-3xl font-bold">나만의 스타일 유형 진단</h3>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: '#555' }}>
                4가지 질문으로 Claude AI가 스타일을 분석하고 맞춤 코디와 상품을 추천.
                단순 쇼핑몰을 넘어 AI 퍼스널 스타일리스트 서비스로 차별화.
              </p>
              <div className="flex flex-wrap gap-2">
                {['모던 미니멀리스트', '캐주얼 스트리터', '클래식 엘레강스', '모던 시크'].map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full border"
                    style={{ background: '#141414', color: '#444', borderColor: '#1e1e1e' }}>{t}</span>
                ))}
              </div>
            </div>
            <div className="text-6xl flex-shrink-0">🤖</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#333' }}>Key Features</p>
        <h2 className="text-4xl font-black tracking-tight mb-2">구현 기능</h2>
        <p className="text-sm mb-12" style={{ color: '#555' }}>실무 패턴으로 구현한 핵심 기능들</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px" style={{ background: '#161616', border: '1px solid #161616', borderRadius: 16, overflow: 'hidden' }}>
          {[
            { icon: '🛍️', title: '상품 탐색', desc: '카테고리 필터 + URL 기반 검색. Server Component로 SEO 최적화.' },
            { icon: '🖼️', title: '상품 상세', desc: '이미지 갤러리, 사이즈 선택 & 실측, 상세탭(설명/가이드/배송).' },
            { icon: '🛒', title: '장바구니', desc: 'Zustand + localStorage persist. 무료배송 프로그레스 바.' },
            { icon: '🔐', title: '인증', desc: 'Supabase Auth + Admin API. 이메일 회원가입 즉시 로그인.' },
            { icon: '📦', title: '주문/결제', desc: '배송지 입력, 주문 DB 저장, 주문 내역 조회 풀 플로우.' },
            { icon: '❤️', title: '찜하기', desc: 'Supabase RLS로 본인 데이터만 접근. 위시리스트 연동.' },
            { icon: '🤖', title: 'AI 챗봇', desc: 'Claude API + 상품 데이터 주입. 상품 카드 형태 추천.' },
            { icon: '🐳', title: 'Docker 배포', desc: '멀티스테이지 빌드로 이미지 최적화. 80:3000 포트 매핑.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="p-6 transition-colors" style={{ background: '#0a0a0a' }}>
              <div className="text-2xl mb-3">{icon}</div>
              <div className="text-sm font-bold mb-2">{title}</div>
              <div className="text-xs leading-relaxed" style={{ color: '#444' }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#333' }}>Tech Stack</p>
        <h2 className="text-4xl font-black tracking-tight mb-2">기술 스택</h2>
        <p className="text-sm mb-12" style={{ color: '#555' }}>선택 이유를 고민한 실무 표준 스택</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { emoji: '⚡', name: 'Next.js 16', role: 'App Router · SSR' },
            { emoji: '🔷', name: 'TypeScript', role: '타입 안정성' },
            { emoji: '🗄️', name: 'Supabase', role: 'DB · Auth · RLS' },
            { emoji: '🤖', name: 'Claude API', role: 'AI 챗봇 · 스타일진단' },
            { emoji: '🎨', name: 'Tailwind CSS', role: '유틸리티 스타일링' },
            { emoji: '🐻', name: 'Zustand', role: '전역 상태 관리' },
            { emoji: '🐳', name: 'Docker', role: '컨테이너 배포' },
            { emoji: '🔧', name: 'Git', role: '28개 커밋 관리' },
          ].map(({ emoji, name, role }) => (
            <div key={name} className="rounded-xl p-5 text-center border transition-all hover:-translate-y-1"
              style={{ background: '#0f0f0f', borderColor: '#1a1a1a' }}>
              <div className="text-3xl mb-3">{emoji}</div>
              <div className="text-sm font-bold mb-1">{name}</div>
              <div className="text-xs" style={{ color: '#444' }}>{role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { num: '28', label: '총 커밋 수', color: '#4ade80' },
            { num: '17', label: '페이지 & API', color: '#60a5fa' },
            { num: '8+', label: '핵심 기능', color: '#fbbf24' },
            { num: '2', label: 'AI 연동 기능', color: '#a78bfa' },
            { num: '3', label: 'DB 테이블', color: '#f87171' },
          ].map(({ num, label, color }) => (
            <div key={label} className="rounded-xl p-5 border" style={{ background: '#0f0f0f', borderColor: '#1a1a1a' }}>
              <div className="text-3xl font-black tracking-tight mb-1" style={{ color }}>{num}</div>
              <div className="text-xs" style={{ color: '#444' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Git History */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#333' }}>Git History</p>
        <h2 className="text-4xl font-black tracking-tight mb-2">커밋 히스토리</h2>
        <p className="text-sm mb-12" style={{ color: '#555' }}>기능 단위로 쌓은 의미있는 커밋 메시지</p>

        {[
          {
            date: '2026-05-28 · 최신',
            commits: [
              { hash: '4b27135', type: 'fix', msg: '404 이미지 URL 교체 (오버핏 후드 집업)' },
              { hash: '3f685bc', type: 'fix', msg: 'StyleQuiz 타입 분리 (API Route 직접 import 제거)' },
              { hash: '2b86e39', type: 'feat', msg: 'AI 스타일 진단 기능 추가 (퀴즈 → 유형 분석 → 상품 추천)' },
              { hash: 'c4953c3', type: 'feat', msg: 'error.tsx / loading.tsx 추가, README 전면 보강' },
              { hash: 'eb5467e', type: 'chore', msg: 'docker-compose 포트 80:3000으로 변경' },
              { hash: '97db546', type: 'chore', msg: 'Dockerfile, docker-compose, .dockerignore 추가' },
            ],
          },
          {
            date: '2026-05-21 · 주요 기능 개발',
            commits: [
              { hash: '2dd6b85', type: 'feat', msg: '챗봇 상품 카드 추천 기능 추가' },
              { hash: '10b877d', type: 'feat', msg: '상품 상세 개선 (이미지 갤러리, 사이즈 선택, 상세탭)' },
              { hash: 'dc371ec', type: 'fix', msg: 'CartIcon Hydration 오류 수정 (isMounted 패턴)' },
              { hash: '88594f7', type: 'feat', msg: '모바일 메뉴, 검색, 찜하기, AI 챗봇, README 추가' },
              { hash: 'f916200', type: 'style', msg: '버튼 cn 유틸 적용, 홈/상품목록/카드 UI 전면 개선' },
              { hash: '60cc741', type: 'feat', msg: '주문/결제 기능, 주문내역, 홈 UI 전면 개선' },
              { hash: '6f59fc6', type: 'feat', msg: 'Supabase Auth 연동 (회원가입/로그인/로그아웃)' },
              { hash: '095c23a', type: 'feat', msg: '회원가입, 장바구니(Zustand), 헤더 장바구니 아이콘 구현' },
              { hash: '30cb591', type: 'feat', msg: '상품 상세 페이지, 수량 선택, 장바구니 담기 구현' },
              { hash: 'cc69e87', type: 'feat', msg: '상품 목록 페이지 및 공통 컴포넌트 구현' },
              { hash: '2ebbbf7', type: 'chore', msg: '초기 프로젝트 구조 및 규칙 문서 세팅' },
            ],
          },
        ].map(({ date, commits }) => (
          <div key={date} className="rounded-xl overflow-hidden border mb-3" style={{ background: '#0f0f0f', borderColor: '#1a1a1a' }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: '#111', borderColor: '#1a1a1a' }}>
              <span style={{ color: '#333' }}>📅</span>
              <span className="text-xs font-semibold tracking-wide" style={{ color: '#333' }}>{date}</span>
            </div>
            {commits.map(({ hash, type, msg }) => {
              const typeStyle: Record<string, { bg: string; color: string }> = {
                feat:  { bg: '#0f2916', color: '#4ade80' },
                fix:   { bg: '#2e1515', color: '#f87171' },
                style: { bg: '#0f1829', color: '#60a5fa' },
                chore: { bg: '#1e1a0a', color: '#fbbf24' },
              }
              const ts = typeStyle[type] ?? { bg: '#111', color: '#888' }
              return (
                <div key={hash} className="flex items-start gap-3 px-4 py-3 border-b last:border-0" style={{ borderColor: '#111' }}>
                  <span className="text-xs px-2 py-0.5 rounded font-mono flex-shrink-0 mt-0.5" style={{ color: '#2a2a2a', background: '#141414' }}>{hash}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0" style={{ color: ts.color, background: ts.bg }}>{type}</span>
                  <span className="text-xs leading-relaxed" style={{ color: '#555' }}>{msg}</span>
                </div>
              )
            })}
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-12 text-center" style={{ borderColor: '#111' }}>
        <p className="text-sm mb-2" style={{ color: '#222' }}>정성윤 · Frontend Developer</p>
        <a href="https://github.com/dkffprtm0404-rgb/VibeCodingUsingAI" target="_blank" rel="noopener noreferrer"
          className="text-xs transition-colors hover:text-white" style={{ color: '#2a2a2a' }}>
          github.com/dkffprtm0404-rgb/VibeCodingUsingAI
        </a>
        <p className="text-xs mt-3" style={{ color: '#1a1a1a' }}>Next.js · Supabase · Claude AI · Docker · 2026</p>
      </footer>

    </div>
  )
}
