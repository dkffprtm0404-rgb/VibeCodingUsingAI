'use client'
/**
 * CheckoutForm.tsx — 주문/결제 폼 (Client Component)
 *
 * 배송지 정보 입력 + 주문 상품 확인 + 주문하기
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

interface ShippingInfo {
  name: string
  phone: string
  address: string
  addressDetail: string
  memo: string
}

interface CheckoutFormProps {
  userName: string
}

export function CheckoutForm({ userName }: CheckoutFormProps) {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()

  const totalPrice = getTotalPrice()
  const shippingFee = totalPrice >= 50000 ? 0 : 3000

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: userName,
    phone: '',
    address: '',
    addressDetail: '',
    memo: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field: keyof ShippingInfo) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      setError('배송지 정보를 모두 입력해주세요.')
      return
    }

    setIsLoading(true)

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        shippingInfo,
        totalPrice,
        shippingFee,
      }),
    })

    const data = await res.json()
    setIsLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    // 주문 성공 → 장바구니 비우고 완료 페이지로
    clearCart()
    router.push(`/orders/${data.orderId}`)
  }

  const inputClass = `
    w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
    outline-none transition-all duration-150 bg-white
    focus:border-gray-900 focus:ring-2 focus:ring-gray-900/8
    placeholder:text-gray-400
  `

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* 왼쪽: 배송지 입력 */}
        <div className="lg:col-span-2 space-y-6">

          {/* 배송지 정보 카드 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <h2 className="font-bold text-gray-900 text-lg">배송지 정보</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 받는 분 */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">받는 분 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={shippingInfo.name}
                  onChange={handleChange('name')}
                  placeholder="이름을 입력해주세요"
                  required
                  className={inputClass}
                />
              </div>

              {/* 연락처 */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">연락처 <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={handleChange('phone')}
                  placeholder="010-0000-0000"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* 주소 */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">주소 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={shippingInfo.address}
                onChange={handleChange('address')}
                placeholder="도로명 주소를 입력해주세요"
                required
                className={inputClass}
              />
            </div>

            {/* 상세 주소 */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">상세 주소</label>
              <input
                type="text"
                value={shippingInfo.addressDetail}
                onChange={handleChange('addressDetail')}
                placeholder="아파트 동/호수, 상세 주소"
                className={inputClass}
              />
            </div>

            {/* 배송 메모 */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">배송 메모</label>
              <select
                value={shippingInfo.memo}
                onChange={handleChange('memo')}
                className={inputClass}
              >
                <option value="">배송 메모를 선택해주세요</option>
                <option value="문 앞에 놔주세요">문 앞에 놔주세요</option>
                <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                <option value="부재 시 연락주세요">부재 시 연락주세요</option>
                <option value="직접 수령할게요">직접 수령할게요</option>
              </select>
            </div>
          </div>

          {/* 주문 상품 확인 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="font-bold text-gray-900 text-lg">주문 상품 ({items.length}종)</h2>
            <div className="space-y-3">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={product.imageUrl} alt={product.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{quantity}개</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{formatPrice(product.price * quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽: 결제 요약 */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <h2 className="font-bold text-gray-900 text-lg">결제 금액</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>상품 금액</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>배송비</span>
                <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                  {shippingFee === 0 ? '무료' : formatPrice(shippingFee)}
                </span>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="flex justify-between font-bold text-gray-900">
              <span>총 결제 금액</span>
              <span className="text-xl text-black">{formatPrice(totalPrice + shippingFee)}</span>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">⚠️ {error}</p>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>
              {formatPrice(totalPrice + shippingFee)} 결제하기
            </Button>

            <p className="text-xs text-gray-400 text-center">
              주문 내용을 확인하였으며 결제에 동의합니다.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}
