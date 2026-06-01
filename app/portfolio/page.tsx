/**
 * app/portfolio/page.tsx — 포트폴리오 페이지 (/portfolio)
 */

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '포트폴리오 | 정성윤',
  description: 'Next.js + Supabase + Claude AI 기반 풀스택 쇼핑몰 포트폴리오',
}

export default function PortfolioPage() {
  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#f8f8f8', color: '#111', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e5e5', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>정성윤 · Portfolio</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['프로젝트', '기능', '기술스택', '커밋'].map((item) => (
            <a key={item} href={`#${item}`} style={{ fontSize: '0.82rem', color: '#666', textDecoration: 'none' }}>{item}</a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 2rem', background: 'linear-gradient(160deg, #fff 0%, #f0f4ff 100%)' }}>
        <div style={{ maxWidth: 640 }}>
          {/* 프로필 아바타 */}
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem', boxShadow: '0 8px 24px rgba(102,126,234,0.3)' }}>
            👨‍💻
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#667eea', background: '#eef2ff', border: '1px solid #c7d2fe', padding: '6px 14px', borderRadius: 100, marginBottom: '2rem' }}>
            <span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Frontend Developer
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '1.5rem', color: '#111' }}>
            Next.js로 만든
            <br />
            <span style={{ color: '#667eea' }}>풀스택 쇼핑몰</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#666', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            실무 수준의 구조와 기술 스택으로 개발한<br />
            AI 기능 탑재 패션 커머스 서비스
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://github.com/dkffprtm0404-rgb/VibeCodingUsingAI" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: '0.875rem', background: '#111', color: '#fff', textDecoration: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub 보기
            </a>
            <a href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: '0.875rem', background: '#fff', color: '#111', border: '1.5px solid #e5e5e5', textDecoration: 'none' }}>
              라이브 데모 →
            </a>
          </div>
        </div>
      </section>

      {/* Project */}
      <section id="프로젝트" style={{ maxWidth: 1000, margin: '0 auto', padding: '6rem 2rem' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#667eea', marginBottom: '0.75rem' }}>Main Project</p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>MyShop</h2>
        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '3rem' }}>패션 상품 쇼핑몰 — 상품 탐색부터 AI 스타일 진단까지 실서비스 수준으로 구현</p>

        <div style={{ background: '#fff', border: '1.5px solid #e5e5e5', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          {/* 브라우저 목업 */}
          <div style={{ background: '#f5f5f5', padding: '1.5rem', borderBottom: '1px solid #e5e5e5' }}>
            <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e5e5', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              {/* 브라우저 바 */}
              <div style={{ background: '#f0f0f0', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #e5e5e5' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28ca41' }} />
                <div style={{ flex: 1, background: '#e5e5e5', borderRadius: 5, height: 18, margin: '0 10px', display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
                  <span style={{ fontSize: '0.65rem', color: '#999' }}>localhost/products</span>
                </div>
              </div>
              {/* 브라우저 콘텐츠 */}
              <div style={{ padding: 16 }}>
                {/* 헤더 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ fontWeight: 900, fontSize: '0.9rem', color: '#111' }}>MyShop</div>
                  <div style={{ display: 'flex', gap: 16, fontSize: '0.72rem', color: '#888' }}>
                    <span>상품</span><span>스타일 진단</span><span>찜목록</span>
                  </div>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: '#fff' }}>🛒</div>
                </div>
                {/* 상품 그리드 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {[
                    { color: '#f5f0eb', label: '화이트 티셔츠', price: '29,000원', badge: '상의' },
                    { color: '#1a1a2e', label: '블랙 청바지', price: '59,000원', badge: '하의', dark: true },
                    { color: '#e8e0d5', label: '오버핏 후드', price: '79,000원', badge: '아우터', sold: true },
                    { color: '#d4e8d4', label: '린넨 셔츠', price: '45,000원', badge: '상의' },
                  ].map((item, i) => (
                    <div key={i} style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #f0f0f0', background: '#fff' }}>
                      <div style={{ background: item.color, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <span style={{ fontSize: '1.4rem' }}>{['👕', '👖', '🧥', '👔'][i]}</span>
                        {item.sold && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ background: '#fff', color: '#333', fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 100 }}>SOLD OUT</span>
                          </div>
                        )}
                        <span style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(255,255,255,0.9)', fontSize: '0.55rem', padding: '2px 6px', borderRadius: 100, fontWeight: 600, color: '#555' }}>{item.badge}</span>
                      </div>
                      <div style={{ padding: '8px 8px 10px' }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#333', marginBottom: 3 }}>{item.label}</div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#111' }}>{item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 프로젝트 정보 */}
          <div style={{ padding: '2rem 2.25rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#667eea', marginBottom: '1rem' }}>🛍️ E-Commerce · Full Stack</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.75rem', color: '#111' }}>MyShop — AI 패션 쇼핑몰</h3>
            <p style={{ color: '#666', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Next.js 16 App Router 기반 풀스택 쇼핑몰. 상품 목록/상세, 이미지 갤러리, 사이즈 가이드, 장바구니, 주문/결제, 찜하기, 검색까지 실서비스 수준으로 구현.
              Claude API로 AI 쇼핑 도우미 챗봇과 스타일 진단 기능 탑재. Supabase Auth·DB 연동, Docker 멀티스테이지 빌드 배포.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: '2rem' }}>
              {[
                { label: 'Next.js 16', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
                { label: 'TypeScript', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
                { label: 'Supabase', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
                { label: 'Claude API', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
                { label: 'Tailwind CSS', color: '#555', bg: '#f5f5f5', border: '#e5e5e5' },
                { label: 'Zustand', color: '#555', bg: '#f5f5f5', border: '#e5e5e5' },
                { label: 'Docker', color: '#555', bg: '#f5f5f5', border: '#e5e5e5' },
                { label: 'App Router', color: '#555', bg: '#f5f5f5', border: '#e5e5e5' },
              ].map(({ label, color, bg, border }) => (
                <span key={label} style={{ fontSize: '0.71rem', fontWeight: 600, padding: '4px 11px', borderRadius: 6, background: bg, color, border: `1px solid ${border}` }}>{label}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="https://github.com/dkffprtm0404-rgb/VibeCodingUsingAI" target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: '0.8rem', fontWeight: 700, padding: '9px 18px', borderRadius: 9, background: '#f5f5f5', color: '#333', border: '1px solid #e5e5e5', textDecoration: 'none' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                소스코드
              </a>
              <a href="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: '0.8rem', fontWeight: 700, padding: '9px 18px', borderRadius: 9, background: '#111', color: '#fff', textDecoration: 'none' }}>
                Live Demo →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* AI Banner */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 2rem 6rem' }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 20, padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(102,126,234,0.25)' }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', position: 'relative' }}>
            <div style={{ color: '#fff' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '0.75rem' }}>✨ AI Personal Stylist</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem' }}>나만의 스타일 유형 진단</h3>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)', maxWidth: 400 }}>
                4가지 질문으로 Claude AI가 스타일을 분석하고 맞춤 코디와 상품을 추천. 단순 쇼핑몰을 넘어 AI 퍼스널 스타일리스트 서비스로 차별화.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '1rem' }}>
                {['모던 미니멀리스트', '캐주얼 스트리터', '클래식 엘레강스', '모던 시크'].map((t) => (
                  <span key={t} style={{ fontSize: '0.72rem', padding: '4px 12px', background: 'rgba(255,255,255,0.15)', borderRadius: 100, color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ fontSize: '5rem', flexShrink: 0 }}>👗</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="기능" style={{ maxWidth: 1000, margin: '0 auto', padding: '0 2rem 6rem' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#667eea', marginBottom: '0.75rem' }}>Key Features</p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>구현 기능</h2>
        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '3rem' }}>실무 패턴으로 구현한 핵심 기능들</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {[
            { icon: '🔍', title: '상품 탐색', desc: '카테고리 필터 + URL 기반 검색. Server Component로 SEO 최적화.' },
            { icon: '🖼️', title: '상품 상세', desc: '이미지 갤러리, 사이즈 선택 & 실측, 상세탭(설명/가이드/배송).' },
            { icon: '🛒', title: '장바구니', desc: 'Zustand + localStorage persist. 무료배송 프로그레스 바.' },
            { icon: '🔐', title: '인증', desc: 'Supabase Auth + Admin API. 이메일 회원가입 즉시 로그인.' },
            { icon: '📦', title: '주문/결제', desc: '배송지 입력, 주문 DB 저장, 주문 내역 조회 풀 플로우.' },
            { icon: '❤️', title: '찜하기', desc: 'Supabase RLS로 본인 데이터만 접근. 위시리스트 연동.' },
            { icon: '💬', title: 'AI 챗봇', desc: 'Claude API + 상품 데이터 주입. 상품 카드 형태 추천.' },
            { icon: '🐳', title: 'Docker 배포', desc: '멀티스테이지 빌드로 이미지 최적화. 80:3000 포트 매핑.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: '#fff', border: '1.5px solid #e5e5e5', borderRadius: 16, padding: '1.5rem', transition: 'all 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{icon}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111' }}>{title}</div>
              <div style={{ fontSize: '0.8rem', color: '#888', lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section id="기술스택" style={{ maxWidth: 1000, margin: '0 auto', padding: '0 2rem 6rem' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#667eea', marginBottom: '0.75rem' }}>Tech Stack</p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>기술 스택</h2>
        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '3rem' }}>선택 이유를 고민한 실무 표준 스택</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {[
            { emoji: '⚡', name: 'Next.js 16', role: 'App Router · SSR', color: '#3b82f6' },
            { emoji: '🔷', name: 'TypeScript', role: '타입 안정성', color: '#3b82f6' },
            { emoji: '🗄️', name: 'Supabase', role: 'DB · Auth · RLS', color: '#7c3aed' },
            { emoji: '🧠', name: 'Claude API', role: 'AI 챗봇 · 스타일진단', color: '#059669' },
            { emoji: '🎨', name: 'Tailwind CSS', role: '유틸리티 스타일링', color: '#0891b2' },
            { emoji: '🐻', name: 'Zustand', role: '전역 상태 관리', color: '#d97706' },
            { emoji: '🐳', name: 'Docker', role: '컨테이너 배포', color: '#2563eb' },
            { emoji: '🌿', name: 'Git', role: '28개 커밋 관리', color: '#dc2626' },
          ].map(({ emoji, name, role, color }) => (
            <div key={name} style={{ background: '#fff', border: '1.5px solid #e5e5e5', borderRadius: 14, padding: '1.25rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{emoji}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '0.25rem', color: '#111' }}>{name}</div>
              <div style={{ fontSize: '0.7rem', color: '#888' }}>{role}</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginTop: 16 }}>
          {[
            { num: '28', label: '총 커밋 수', color: '#059669', bg: '#ecfdf5' },
            { num: '17', label: '페이지 & API', color: '#2563eb', bg: '#eff6ff' },
            { num: '8+', label: '핵심 기능', color: '#d97706', bg: '#fffbeb' },
            { num: '2', label: 'AI 연동 기능', color: '#7c3aed', bg: '#f5f3ff' },
            { num: '3', label: 'DB 테이블', color: '#dc2626', bg: '#fef2f2' },
          ].map(({ num, label, color, bg }) => (
            <div key={label} style={{ background: bg, border: `1.5px solid ${color}22`, borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.04em', color, marginBottom: '0.25rem' }}>{num}</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Git History */}
      <section id="커밋" style={{ maxWidth: 1000, margin: '0 auto', padding: '0 2rem 6rem' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#667eea', marginBottom: '0.75rem' }}>Git History</p>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '0.75rem' }}>커밋 히스토리</h2>
        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '3rem' }}>기능 단위로 쌓은 의미있는 커밋 메시지</p>

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
        ].map(({ date, commits }) => {
          const typeStyle: Record<string, { bg: string; color: string }> = {
            feat:  { bg: '#ecfdf5', color: '#059669' },
            fix:   { bg: '#fef2f2', color: '#dc2626' },
            style: { bg: '#eff6ff', color: '#2563eb' },
            chore: { bg: '#fffbeb', color: '#d97706' },
          }
          return (
            <div key={date} style={{ background: '#fff', border: '1.5px solid #e5e5e5', borderRadius: 16, overflow: 'hidden', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ background: '#f8f8f8', padding: '10px 16px', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📅</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#555', letterSpacing: '0.04em' }}>{date}</span>
              </div>
              {commits.map(({ hash, type, msg }) => {
                const ts = typeStyle[type] ?? { bg: '#f5f5f5', color: '#666' }
                return (
                  <div key={hash} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 16px', borderBottom: '1px solid #f5f5f5' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.68rem', color: '#aaa', background: '#f5f5f5', padding: '3px 8px', borderRadius: 5, flexShrink: 0, marginTop: 1 }}>{hash}</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '3px 9px', borderRadius: 5, flexShrink: 0, background: ts.bg, color: ts.color }}>{type}</span>
                    <span style={{ fontSize: '0.82rem', color: '#444', lineHeight: 1.5 }}>{msg}</span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e5e5e5', padding: '3rem 2rem', textAlign: 'center', background: '#fff' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.4rem' }}>
          👨‍💻
        </div>
        <p style={{ color: '#333', fontWeight: 700, marginBottom: '0.5rem' }}>정성윤 · Frontend Developer</p>
        <a href="https://github.com/dkffprtm0404-rgb/VibeCodingUsingAI" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: '0.82rem', color: '#667eea', textDecoration: 'none' }}>
          github.com/dkffprtm0404-rgb/VibeCodingUsingAI
        </a>
        <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '1rem' }}>Next.js · Supabase · Claude AI · Docker · 2026</p>
      </footer>

    </div>
  )
}
