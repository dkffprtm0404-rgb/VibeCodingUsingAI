'use client'
/**
 * QuantitySelector.tsx — 수량 선택 컴포넌트
 *
 * 'use client' 이유: 수량 증가/감소 버튼 클릭 → useState로 상태 관리
 *
 * 실무 패턴:
 * - min/max 값으로 수량 범위 제한
 * - 부모 컴포넌트에 onChange로 변경값 전달 (제어 컴포넌트 패턴)
 */

interface QuantitySelectorProps {
  value: number          // 현재 수량 (부모가 관리)
  min?: number           // 최소 수량 (기본값 1)
  max?: number           // 최대 수량 (재고 수량)
  onChange: (value: number) => void  // 수량 변경 시 부모에게 알림
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    // min보다 작아지지 않도록 제한
    if (value > min) onChange(value - 1)
  }

  const handleIncrease = () => {
    // max보다 커지지 않도록 제한
    if (value < max) onChange(value + 1)
  }

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
      {/* 감소 버튼 */}
      <button
        onClick={handleDecrease}
        disabled={value <= min}
        className="w-10 h-10 flex items-center justify-center text-gray-600
                   hover:bg-gray-100 transition-colors
                   disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="수량 감소" // 스크린 리더 접근성
      >
        −
      </button>

      {/* 현재 수량 표시 */}
      <span className="w-12 h-10 flex items-center justify-center text-sm font-medium border-x border-gray-300">
        {value}
      </span>

      {/* 증가 버튼 */}
      <button
        onClick={handleIncrease}
        disabled={value >= max}
        className="w-10 h-10 flex items-center justify-center text-gray-600
                   hover:bg-gray-100 transition-colors
                   disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="수량 증가"
      >
        +
      </button>
    </div>
  )
}
