'use client'
/**
 * ProductImageGallery.tsx — 상품 이미지 갤러리
 * 메인 이미지 클릭으로 썸네일 전환
 */

import { useState } from 'react'
import Image from 'next/image'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  isSoldOut: boolean
}

export function ProductImageGallery({ images, productName, isSoldOut }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="space-y-3">
      {/* 메인 이미지 */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={images[selectedIndex]}
          alt={`${productName} ${selectedIndex + 1}번 이미지`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-200 ${isSoldOut ? 'opacity-60' : ''}`}
          priority
        />
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="bg-white/95 text-gray-900 font-bold text-lg px-6 py-2.5 rounded-full shadow-sm">
              SOLD OUT
            </span>
          </div>
        )}
        {/* 이미지 인덱스 표시 */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* 썸네일 */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                selectedIndex === i
                  ? 'border-gray-900 opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-90'
              }`}
            >
              <Image
                src={img}
                alt={`썸네일 ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
