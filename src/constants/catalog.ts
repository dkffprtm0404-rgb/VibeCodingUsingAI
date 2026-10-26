import type { StoreChannelId } from '@/types/product'

export type StoreId = 'all' | StoreChannelId

export const STORE_CHANNELS = [
  { id: 'all', label: '전체', eyebrow: 'ALL STORES', description: '취향을 넓혀줄 모든 스토어' },
  { id: 'fashion', label: '패션', eyebrow: 'FASHION', description: '매일의 룩을 완성하는 스타일' },
  { id: 'beauty', label: '뷰티', eyebrow: 'BEAUTY', description: '나를 가꾸는 뷰티 셀렉션' },
  { id: 'sports', label: '스포츠', eyebrow: 'SPORTS', description: '움직이는 일상을 위한 아이템' },
  { id: 'outlet', label: '아울렛', eyebrow: 'OUTLET', description: '다시 발견하는 시즌 아이템' },
  { id: 'boutique', label: '부티크', eyebrow: 'BOUTIQUE', description: '디테일로 고른 프리미엄 셀렉션' },
  { id: 'kicks', label: '킥스', eyebrow: 'KICKS', description: '발끝에서 시작하는 새로운 스타일' },
  { id: 'kids', label: '키즈', eyebrow: 'KIDS', description: '작은 일상을 위한 즐거운 스타일' },
] as const satisfies ReadonlyArray<{ id: StoreId; label: string; eyebrow: string; description: string }>

export const CATEGORIES = [
  '전체', '상의', '하의', '아우터', '원피스', '스커트', '신발', '가방', '액세서리', '뷰티', '스포츠웨어', '키즈',
] as const

export type Category = (typeof CATEGORIES)[number]
