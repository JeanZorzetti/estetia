'use client'

import { useEffect, useState } from 'react'
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
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.02] to-amber-600/[0.05] backdrop-blur-md p-4 shadow-[0_4px_20px_rgba(245,158,11,0.02)] transition-all duration-300">
      <div className="absolute inset-0.5 rounded-[14px] border border-white/40 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-amber-800 flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-50/60 border border-amber-200/50 shadow-sm">
              <Hourglass className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            </span>
            Fila de Espera
          </h3>
          {entries.length > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-[9px] font-bold rounded-full bg-amber-100/80 border border-amber-200 text-amber-700 tabular-nums">
              {entries.length}
            </span>
          )}
        </div>

        {loading ? (
          <p className="text-[11px] text-amber-600/70 italic px-1">Carregando fila VIP…</p>
        ) : entries.length === 0 ? (
          <p className="text-[11px] text-amber-600/60 italic px-1">Nenhum paciente aguardando.</p>
        ) : (
          <ScrollArea className="max-h-64 pr-1">
            <div className="flex flex-col gap-2">
              {entries.map(e => (
                <button
                  key={e.id}
                  onClick={() => onSelectEntry?.(e)}
                  className="group relative text-left p-2.5 rounded-xl border border-amber-500/10 bg-white/50 hover:bg-white/95 hover:border-amber-500/20 shadow-[0_2px_8px_rgba(245,158,11,0.01)] hover:shadow-[0_4px_12px_rgba(245,158,11,0.04)] transition-all duration-300"
                >
                  <p className="text-[11px] font-bold text-slate-800 group-hover:text-[#0A1F3D] transition-colors truncate">
                    {e.pacienteNome}
                  </p>
                  {e.procedimento && (
                    <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">
                      {e.procedimento}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2 text-[9px] font-semibold text-slate-400">
                    <Clock className="w-2.5 h-2.5 text-amber-500/70" />
                    <span className="tabular-nums">
                      {format(new Date(e.createdAt), "d MMM yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}

        <button
          className="w-full mt-3 h-8 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] hover:bg-amber-500/10 text-amber-800 text-[10px] font-bold uppercase tracking-widest shadow-sm hover:shadow transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
          disabled={entries.length === 0}
        >
          Encontrar Slots VIP
        </button>
      </div>
    </div>
  )
}

