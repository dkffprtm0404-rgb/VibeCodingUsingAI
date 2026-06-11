'use client'
/**
 * ProductDetailTabs.tsx — 상품 상세 탭 (다크모드 밝은 텍스트)
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Product } from '@/types/product'

type Tab = 'detail' | 'size' | 'delivery'

const TABS: { key: Tab; label: string }[] = [
  { key: 'detail', label: '상품 설명' },
  { key: 'size', label: '사이즈 가이드' },
  { key: 'delivery', label: '배송 안내' },
]

export function ProductDetailTabs({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<Tab>('detail')

  return (
    <div className="mt-16">
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              'px-6 py-4 text-sm font-medium transition-colors relative',
              activeTab === key
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-100'
            )}
          >
            {label}
            {activeTab === key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 dark:bg-white rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="py-10">

        {/* 상품 설명 */}
        {activeTab === 'detail' && (
          <div className="max-w-2xl space-y-10">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">제품 소개</h3>
              <p className="text-gray-600 dark:text-gray-100 leading-relaxed text-base">
                {product.detailDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 space-y-2">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider">소재</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{product.material}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 space-y-2">
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-400 uppercase tracking-wider">핏 안내</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{product.fit}</p>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">세탁 및 관리</h3>
              <ul className="space-y-2">
                {[
                  '세탁기 사용 시 단독 세탁 또는 세탁망 사용 권장',
                  '울/캐시미어 소재는 손세탁 또는 드라이클리닝',
                  '건조기 사용 금지',
                  '직사광선을 피해 음지에서 건조',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-100">
                    <span className="text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 사이즈 가이드 */}
        {activeTab === 'size' && (
          <div className="max-w-2xl space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">사이즈 실측 정보</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                모든 측정값은 평평하게 놓은 상태에서 측정한 값입니다.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-white w-16">사이즈</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-white">실측 정보</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-700 dark:text-white w-20">재고</th>
                  </tr>
                </thead>
                <tbody>
                  {product.sizes.map((sizeInfo) => (
                    <tr
                      key={sizeInfo.size}
                      className={cn(
                        'border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors',
                        sizeInfo.stock === 0
                          ? 'opacity-40'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
                      )}
                    >
                      <td className="px-4 py-3.5">
                        <span className={cn(
                          'inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold',
                          sizeInfo.stock === 0
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                            : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        )}>
                          {sizeInfo.size}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600 dark:text-gray-100 leading-relaxed">
                        {sizeInfo.measurements}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {sizeInfo.stock === 0 ? (
                          <span className="text-xs text-red-400 font-medium">품절</span>
                        ) : sizeInfo.stock <= 3 ? (
                          <span className="text-xs text-orange-400 font-medium">{sizeInfo.stock}개</span>
                        ) : (
                          <span className="text-xs text-green-500 font-medium">충분</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 rounded-2xl p-5 space-y-2">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">💡 핏 안내</p>
              <p className="text-sm text-blue-700 dark:text-blue-100">{product.fit}</p>
            </div>
          </div>
        )}

        {/* 배송 안내 */}
        {activeTab === 'delivery' && (
          <div className="max-w-2xl space-y-6">
            {[
              {
                title: '배송 안내', icon: '🚚',
                items: [
                  '평일 오후 2시 이전 주문 시 당일 출고',
                  '평균 배송 기간: 2~3 영업일',
                  '도서산간 지역은 추가 1~2일 소요될 수 있습니다',
                ],
              },
              {
                title: '배송비', icon: '💰',
                items: [
                  '50,000원 이상 구매 시 무료 배송',
                  '50,000원 미만 구매 시 3,000원',
                  '제주/도서산간 지역 추가 배송비 3,000원',
                ],
              },
              {
                title: '교환 / 반품', icon: '🔄',
                items: [
                  '수령 후 30일 이내 교환/반품 가능',
                  '단순 변심 반품 시 배송비 고객 부담',
                  '상품 불량/오배송 시 배송비 무료',
                  '사용/세탁/태그 제거 시 반품 불가',
                ],
              },
            ].map(({ title, icon, items }) => (
              <div key={title} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>{icon}</span> {title}
                </h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-100">
                      <span className="text-gray-300 dark:text-gray-500 flex-shrink-0 mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
