// 상품 관련 타입 정의

export interface SizeInfo {
  size: string        // ex) S, M, L, XL / 28, 30, 32
  measurements: string // ex) "가슴 96cm / 어깨 42cm / 총장 68cm"
  stock: number       // 해당 사이즈 재고
}

export interface DetailImage {
  url: string
  alt: string
}

export interface Product {
  id: number
  name: string
  price: number
  imageUrl: string
  images: string[]        // 다중 이미지 (썸네일 + 착용샷)
  category: string
  description: string
  detailDescription: string  // 상세 설명 (긴 텍스트)
  material: string           // 소재
  fit: string                // 핏 설명 ex) "슬림핏 / 어깨 정사이즈"
  sizes: SizeInfo[]          // 사이즈별 정보
  stock: number              // 전체 재고 (하위 호환)
}

export interface CartItem {
  product: Product
  quantity: number
  selectedSize?: string
}
