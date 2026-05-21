// 상품 관련 타입 정의

export interface Product {
  id: number
  name: string
  price: number
  imageUrl: string
  category: string
  description: string
  stock: number
}

export interface CartItem {
  product: Product
  quantity: number
}
