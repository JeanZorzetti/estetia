type Props = {
  total: number
  activeIndex: number
}

export function ProgressRail({ total, activeIndex }: Props) {
  return (
    <div
      className="flex flex-col items-center gap-4"
      role="progressbar"
      aria-valuenow={activeIndex + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label="Progresso das estações"
    >
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="relative">
          <span
            className={`block h-2 w-2 rounded-full border transition-colors duration-500 ${
              i === activeIndex
                ? 'border-[#C5A059] bg-[#C5A059]'
                : i < activeIndex
                  ? 'border-[#C5A059]/60 bg-[#C5A059]/40'
                  : 'border-white/30 bg-transparent'
            }`}
          />
          {i === activeIndex && (
            <span className="absolute inset-0 -m-1 rounded-full border border-[#C5A059]/40 animate-ping" />
          )}
        </div>
      ))}
    </div>
  )
}
