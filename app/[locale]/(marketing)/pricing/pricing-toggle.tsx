'use client'

import { useState } from 'react'

interface PricingToggleProps {
  children: (isAnnual: boolean) => React.ReactNode
  labelMonthly?: string
  labelAnnual?: string
}

export function PricingToggle({ children, labelMonthly = 'Mensal', labelAnnual = 'Anual' }: PricingToggleProps) {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <>
      <div className="flex items-center justify-center gap-3 mt-10">
        <span className={`text-sm font-medium ${!isAnnual ? 'text-[#0A1F3D]' : 'text-[#64748B]'}`}>
          {labelMonthly}
        </span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors"
          style={{ backgroundColor: isAnnual ? '#0A1F3D' : '#E2E8F0' }}
          aria-label={`Toggle ${labelMonthly}/${labelAnnual}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
              isAnnual ? 'translate-x-8' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${isAnnual ? 'text-[#0A1F3D]' : 'text-[#64748B]'}`}>
          {labelAnnual}
        </span>
        {isAnnual && (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#C5A059' + '20', color: '#C5A059' }}
          >
            20% OFF
          </span>
        )}
      </div>
      {children(isAnnual)}
    </>
  )
}
