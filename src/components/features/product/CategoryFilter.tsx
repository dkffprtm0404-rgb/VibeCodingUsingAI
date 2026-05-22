'use client'
/**
 * CategoryFilter.tsx — 카테고리 필터
 */

import { cn } from '@/lib/utils'
import { CATEGORIES, type Category } from '@/lib/mock-data'

interface CategoryFilterProps {
  selectedCategory: Category
  onCategoryChange: (category: Category) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border',
              isSelected
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
            )}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
