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
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-300 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            {category}
          </button>
        )
      })}
    </div>
  )
}
