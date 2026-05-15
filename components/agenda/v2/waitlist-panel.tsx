'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Hourglass, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { AgendaWaitlist } from './types'

interface Props {
  onSelectEntry?: (entry: AgendaWaitlist) => void
}

export function WaitlistPanel({ onSelectEntry }: Props) {
  const [entries, setEntries] = useState<AgendaWaitlist[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/clinica/waitlist?status=ativa')
      .then(r => r.json())
      .then(data => setEntries(data.entries ?? data.waitlist ?? []))
      .catch(() => null)
      .finally(() => setLoading(false))
  }, [])

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Hourglass className="w-3.5 h-3.5" />
          Lista de Espera
        </CardTitle>
        {entries.length > 0 && (
          <Badge variant="secondary" className="text-[10px] h-5">{entries.length}</Badge>
        )}
      </CardHeader>
      <CardContent className="pb-3">
        {loading ? (
          <p className="text-xs text-muted-foreground italic">Carregando…</p>
        ) : entries.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Sem pacientes aguardando.</p>
        ) : (
          <ScrollArea className="max-h-64">
            <div className="flex flex-col gap-2">
              {entries.map(e => (
                <button
                  key={e.id}
                  onClick={() => onSelectEntry?.(e)}
                  className="text-left p-2 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <p className="text-xs font-medium truncate">{e.pacienteNome}</p>
                  {e.procedimento && (
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{e.procedimento}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-muted-foreground">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{format(new Date(e.createdAt), "d MMM", { locale: ptBR })}</span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
        <Button variant="ghost" size="sm" className="w-full mt-3 text-xs h-7" disabled={entries.length === 0}>
          Encontrar slots livres
        </Button>
      </CardContent>
    </Card>
  )
}
