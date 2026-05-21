'use client'
/**
 * CategoryFilter.tsx — 카테고리 필터 컴포넌트
 *
 * 'use client' 선언 이유:
 * 버튼 클릭 → 상태 변경(useState) → 화면 업데이트 같은
 * 사용자 상호작용이 필요한 컴포넌트는 Client Component로 만들어야 합니다.
 *
 * 실무 패턴: 부모(Server Component)는 데이터를 가져오고,
 * 자식(Client Component)은 사용자 상호작용만 담당합니다.
 */

import { CATEGORIES, type Category } from '@/lib/mock-data'

interface CategoryFilterProps {
  // 현재 선택된 카테고리
  selectedCategory: Category
  // 카테고리 변경 시 호출되는 콜백 함수
  onCategoryChange: (category: Category) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => {
        // 현재 선택된 카테고리인지 확인
        const isSelected = selectedCategory === category

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium
              transition-colors duration-150
              ${isSelected
                ? 'bg-black text-white'           // 선택됨
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // 미선택
              }
            `}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
