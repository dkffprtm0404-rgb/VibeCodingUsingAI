'use client'
/**
 * ProductImageGallery.tsx — 상품 이미지 갤러리 (다크모드 지원)
 */

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  isSoldOut: boolean
}

export function ProductImageGallery({ images, productName, isSoldOut }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="min-w-0 space-y-3 sm:space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800">
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
            <span className="bg-white/95 dark:bg-black/80 text-gray-900 dark:text-white font-bold text-lg px-6 py-2.5 rounded-full shadow-sm">
              SOLD OUT
            </span>
          </div>
        )}
        <div className="absolute bottom-4 right-4 rounded-full bg-gray-950/65 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto p-1" aria-label="상품 이미지 선택">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${productName} ${i + 1}번 이미지 보기`}
              aria-pressed={selectedIndex === i}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                'relative flex-shrink-0 w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-150',
                selectedIndex === i
                  ? 'border-gray-900 dark:border-white opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-90'
              )}
            >
              <Image src={img} alt={`썸네일 ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
