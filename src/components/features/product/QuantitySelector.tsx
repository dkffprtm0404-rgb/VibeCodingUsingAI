'use client'
/**
 * QuantitySelector.tsx — 수량 선택 컴포넌트 (다크모드 밝은 텍스트)
 */

interface QuantitySelectorProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}

export function QuantitySelector({ value, min = 1, max = 99, onChange }: QuantitySelectorProps) {
  return (
    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden w-fit">
      <button
        onClick={() => value > min && onChange(value - 1)}
        disabled={value <= min}
        aria-label="수량 감소"
        className="w-10 h-10 flex items-center justify-center
                   text-gray-600 dark:text-white
                   hover:bg-gray-100 dark:hover:bg-gray-700
                   transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        −
      </button>
      <span className="w-12 h-10 flex items-center justify-center
                       text-sm font-medium
                       border-x border-gray-300 dark:border-gray-600
                       text-gray-900 dark:text-white
                       bg-white dark:bg-gray-800">
        {value}
      </span>
      <button
        onClick={() => value < max && onChange(value + 1)}
        disabled={value >= max}
        aria-label="수량 증가"
        className="w-10 h-10 flex items-center justify-center
                   text-gray-600 dark:text-white
                   hover:bg-gray-100 dark:hover:bg-gray-700
                   transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  )
}
