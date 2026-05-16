'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Props {
  value: string
  onChange: (v: string) => void
}

export function HubSearchBar({ value, onChange }: Props) {
  return (
    <div className="relative max-w-sm">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Buscar configurações..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 h-9"
        aria-label="Buscar configurações"
      />
    </div>
  )
}
