'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, X } from 'lucide-react'

interface Procedure { id: string; nome: string; categoria: string | null }

interface Props {
  procedures: Procedure[]
  value: string[]
  onChange: (ids: string[]) => void
}

export function ProcedureMultiSelect({ procedures, value, onChange }: Props) {
  const [query, setQuery] = useState('')

  const filtered = procedures.filter(p =>
    !query || p.nome.toLowerCase().includes(query.toLowerCase())
  )

  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter(v => v !== id))
    else onChange([...value, id])
  }

  const selected = procedures.filter(p => value.includes(p.id))

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">Procedimentos habilitados</Label>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-1">
          {selected.map(p => (
            <Badge key={p.id} variant="secondary" className="gap-1 pr-1">
              {p.nome}
              <button
                type="button"
                onClick={() => toggle(p.id)}
                className="hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="border border-border/60 rounded-xl overflow-hidden">
        <div className="relative border-b border-border/60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9 border-0 rounded-none focus-visible:ring-0"
            placeholder="Buscar procedimento..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <ScrollArea className="h-48">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhum procedimento encontrado.</p>
          ) : (
            <div className="flex flex-col">
              {filtered.map(p => (
                <label
                  key={p.id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <Checkbox
                    checked={value.includes(p.id)}
                    onCheckedChange={() => toggle(p.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.nome}</p>
                    {p.categoria && (
                      <p className="text-xs text-muted-foreground capitalize">{p.categoria}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
      <p className="text-xs text-muted-foreground">
        {value.length} procedimento{value.length !== 1 ? 's' : ''} selecionado{value.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
