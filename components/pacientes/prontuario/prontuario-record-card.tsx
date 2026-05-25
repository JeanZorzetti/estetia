'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MedicalRecord } from '@/lib/clinical/types'

interface MedicalRecordDetail {
  queixaPrincipal?: string
  hipoteseDiagnostica?: string
  historiaClinica?: string
  avaliacaoFisica?: string
  planoTratamento?: string
}

interface Props {
  record: MedicalRecord
}

export function ProntuarioRecordCard({ record }: Props) {
  const [open, setOpen] = useState(false)
  const [detail, setDetail] = useState<MedicalRecordDetail | null>(null)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    if (open) { setOpen(false); return }
    setOpen(true)
    if (detail) return
    setLoading(true)
    try {
      const res = await fetch(`/api/clinica/prontuario/${record.id}`)
      const data = await res.json()
      setDetail(data.record)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const dateObj = new Date(record.dataAtendimento)
  const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' })

  return (
    <Card className="overflow-hidden border-border/40 bg-card/45 backdrop-blur-sm transition-all duration-300 hover:border-teal-500/25 hover:shadow-md rounded-2xl group relative pl-3">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-navy to-teal rounded-l-2xl" />

      <button className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer" onClick={toggle}>
        <CardHeader className="pb-3.5 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <CardTitle className="text-sm md:text-base font-extrabold text-foreground group-hover:text-teal dark:group-hover:text-teal transition-colors capitalize flex flex-wrap items-center gap-1.5 leading-tight">
                <span>{formattedDate}</span>
                <span className="text-[11px] font-semibold text-muted-foreground lowercase">({weekday})</span>
              </CardTitle>
              {record.profissional && (
                <p className="text-[10px] md:text-xs text-muted-foreground font-bold flex items-center gap-1.5 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  Profissional: {record.profissional.nome}
                </p>
              )}
            </div>
            <div className="w-8 h-8 rounded-xl bg-muted/40 border border-border/10 flex items-center justify-center shrink-0">
              <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform duration-300', open && 'rotate-90 text-teal')} />
            </div>
          </div>
        </CardHeader>
      </button>

      {open && (
        <CardContent className="border-t border-border/10 bg-muted/10 p-5 text-xs space-y-4 font-medium leading-relaxed">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-teal" />
              <span>Carregando detalhes clínicos...</span>
            </div>
          ) : detail ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {detail.queixaPrincipal && (
                <div className="space-y-1.5 p-3.5 rounded-xl bg-white/40 dark:bg-black/10 border border-border/20">
                  <span className="text-navy dark:text-teal font-extrabold uppercase text-[10px] tracking-wider block">Queixa Principal</span>
                  <p className="text-foreground/90 font-semibold">{detail.queixaPrincipal}</p>
                </div>
              )}
              {detail.hipoteseDiagnostica && (
                <div className="space-y-1.5 p-3.5 rounded-xl bg-white/40 dark:bg-black/10 border border-border/20">
                  <span className="text-gold-600 dark:text-gold-400 font-extrabold uppercase text-[10px] tracking-wider block">Hipótese Diagnóstica</span>
                  <p className="text-foreground/90 font-semibold">{detail.hipoteseDiagnostica}</p>
                </div>
              )}
              {detail.historiaClinica && (
                <div className="space-y-1.5 p-3.5 rounded-xl bg-white/40 dark:bg-black/10 border border-border/20">
                  <span className="text-navy dark:text-teal font-extrabold uppercase text-[10px] tracking-wider block">História Clínica</span>
                  <p className="text-foreground/90 font-semibold">{detail.historiaClinica}</p>
                </div>
              )}
              {detail.avaliacaoFisica && (
                <div className="space-y-1.5 p-3.5 rounded-xl bg-white/40 dark:bg-black/10 border border-border/20">
                  <span className="text-navy dark:text-teal font-extrabold uppercase text-[10px] tracking-wider block">Avaliação Física</span>
                  <p className="text-foreground/90 font-semibold">{detail.avaliacaoFisica}</p>
                </div>
              )}
              {detail.planoTratamento && (
                <div className="space-y-1.5 p-3.5 rounded-xl bg-white/40 dark:bg-black/10 border border-border/20">
                  <span className="text-teal-600 dark:text-teal-400 font-extrabold uppercase text-[10px] tracking-wider block">Plano de Tratamento</span>
                  <p className="text-foreground/90 font-semibold">{detail.planoTratamento}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">{record.queixaPrincipal ?? 'Sem detalhes registrados.'}</p>
          )}
        </CardContent>
      )}
    </Card>
  )
}
