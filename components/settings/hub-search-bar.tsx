'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Props {
  value: string
  onChange: (v: string) => void
}

export function HubSearchBar({ value, onChange }: Props) {
  return (
    <div className="relative w-full sm:max-w-xs md:max-w-sm group">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-[#C5A059] transition-colors duration-300" />
      <Input
        placeholder="Buscar no hub de configurações..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9.5 pr-4 h-10 text-xs rounded-xl bg-white/40 dark:bg-slate-900/40 border-white/50 dark:border-slate-800/40 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#C5A059]/40 focus-visible:border-[#C5A059]/30 transition-all duration-300 shadow-sm backdrop-blur-xl"
        aria-label="Buscar configurações"
      />
      {/* Reflexo metálico de borda sutil no hover */}
      <div className="absolute inset-[1px] rounded-[11px] border border-white/30 dark:border-white/[0.01] pointer-events-none group-hover:border-[#C5A059]/10 transition-colors duration-300" />
    </div>
  )
}
