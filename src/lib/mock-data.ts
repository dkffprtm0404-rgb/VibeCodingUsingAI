/**
 * mock-data.ts — 목 데이터
 *
 * 실무에서 백엔드 API가 아직 없을 때 프론트 개발을 먼저 진행하기 위해
 * 가짜 데이터를 만들어두는 파일이에요.
 * 나중에 실제 API 연동 시 이 파일 대신 API 호출로 교체하면 됩니다.
 */

import type { Product } from '@/types/product'

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: '클래식 화이트 티셔츠',
    price: 29000,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80',
    category: '상의',
    description: '어디에나 잘 어울리는 베이직 화이트 티셔츠입니다.',
    stock: 50,
  },
  {
    id: 2,
    name: '슬림 블랙 청바지',
    price: 59000,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80',
    category: '하의',
    description: '깔끔한 실루엣의 슬림핏 블랙 청바지입니다.',
    stock: 30,
  },
  {
    id: 3,
    name: '오버핏 후드 집업',
    price: 79000,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500&q=80',
    category: '아우터',
    description: '편안한 오버핏 후드 집업. 캐주얼 룩에 딱입니다.',
    stock: 20,
  },
  {
    id: 4,
    name: '린넨 셔츠',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&q=80',
    category: '상의',
    description: '여름에 시원한 린넨 소재의 캐주얼 셔츠입니다.',
    stock: 15,
  },
  {
    id: 5,
    name: '와이드 슬랙스',
    price: 65000,
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80',
    category: '하의',
    description: '트렌디한 와이드 핏의 슬랙스입니다.',
    stock: 25,
  },
  {
    id: 6,
    name: '캐시미어 니트',
    price: 120000,
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80',
    category: '상의',
    description: '부드러운 캐시미어 소재의 프리미엄 니트입니다.',
    stock: 10,
  },
  {
    id: 7,
    name: '데님 자켓',
    price: 89000,
    imageUrl: 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=500&q=80',
    category: '아우터',
    description: '데일리로 활용하기 좋은 클래식 데님 자켓입니다.',
    stock: 0,
  },
  {
    id: 8,
    name: '스트라이프 티셔츠',
    price: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1622445275576-721325763afe?w=500&q=80',
    category: '상의',
    description: '마린 룩의 클래식 스트라이프 티셔츠입니다.',
    stock: 3,
  },
]

/**
 * 카테고리 목록 (필터에서 사용)
 */
export const CATEGORIES = ['전체', '상의', '하의', '아우터'] as const
export type Category = (typeof CATEGORIES)[number]
