'use client'
/**
 * CategoryFilter.tsx — 카테고리 필터
 */

import { cn } from '@/lib/utils'
import { CATEGORIES, type Category } from '@/constants/catalog'

interface CategoryFilterProps {
  selectedCategory: Category
  categories?: readonly Category[]
  onCategoryChange: (category: Category) => void
}

export function CategoryFilter({ selectedCategory, categories = CATEGORIES, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="상품 종류">
      {categories.map((category) => {
        const isSelected = selectedCategory === category
        return (
          <button
            key={category}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onCategoryChange(category)}
            className={cn(
              'min-h-11 px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-150 border',
              isSelected
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
