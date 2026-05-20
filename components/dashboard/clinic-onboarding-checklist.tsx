'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const STEPS = [
  {
    id: 'clinic_cnpj',
    label: 'Cadastrar CNPJ e Responsável Técnico',
    description: 'Obrigatório para emitir NFS-e e prontuários clínicos.',
    href: '/dashboard/settings',
  },
  {
    id: 'clinic_first_professional',
    label: 'Adicionar primeiro profissional',
    description: 'Vincule um(a) especialista para habilitar a agenda.',
    href: '/dashboard/settings/team',
  },
  {
    id: 'clinic_first_patient',
    label: 'Cadastrar primeiro paciente',
    description: 'Comece a gerenciar prontuários e tratamentos.',
    href: '/dashboard/pacientes',
  },
  {
    id: 'clinic_whatsapp',
    label: 'Conectar WhatsApp (Evolution API)',
    description: 'Ative confirmações automáticas e recall.',
    href: '/dashboard/settings/integrations',
  },
  {
    id: 'clinic_first_appointment',
    label: 'Agendar primeira consulta',
    description: 'Teste o fluxo completo de agendamento.',
    href: '/dashboard/agenda',
  },
] as const

type StepId = typeof STEPS[number]['id']

interface Props {
  initialCompletedSteps?: string[]
}

export function ClinicOnboardingChecklist({ initialCompletedSteps = [] }: Props) {
  const [completedSteps, setCompletedSteps] = useState<string[]>(initialCompletedSteps)
  const [collapsed, setCollapsed] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const progress = completedSteps.length
  const total = STEPS.length
  const allDone = progress === total

  useEffect(() => {
    if (dismissed || allDone) return
    fetch('/api/onboarding/checklist')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.completedSteps)) setCompletedSteps(d.completedSteps) })
      .catch(() => {})
  }, [])

  const markComplete = useCallback(async (stepId: StepId) => {
    if (completedSteps.includes(stepId)) return
    setLoading(stepId)
    try {
      const res = await fetch('/api/onboarding/checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId }),
      })
      const data = await res.json()
      if (Array.isArray(data.completedSteps)) setCompletedSteps(data.completedSteps)
    } catch { /* silencioso */ }
    setLoading(null)
  }, [completedSteps])

  if (dismissed || allDone) return null

  return (
    <div className="rounded-2xl border border-navy/10 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-surface transition-colors"
        onClick={() => setCollapsed(v => !v)}
      >
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8">
            <svg className="h-8 w-8 -rotate-90" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="13" fill="none" stroke="#E2E8F0" strokeWidth="3" />
              <circle
                cx="16" cy="16" r="13" fill="none"
                stroke="#C5A059" strokeWidth="3"
                strokeDasharray={`${(progress / total) * 81.7} 81.7`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gold">
              {progress}/{total}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-navy">Primeiros passos</p>
            <p className="text-xs text-slate-400">{total - progress} tarefa{total - progress !== 1 ? 's' : ''} restante{total - progress !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={e => { e.stopPropagation(); setDismissed(true) }}
            aria-label="Fechar"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          {collapsed ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronUp className="h-4 w-4 text-slate-400" />}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-100">
        <div
          className="h-full bg-gold transition-all duration-500"
          style={{ width: `${(progress / total) * 100}%` }}
        />
      </div>

      {/* Steps list */}
      {!collapsed && (
        <ul className="divide-y divide-slate-50">
          {STEPS.map(step => {
            const done = completedSteps.includes(step.id)
            const isLoading = loading === step.id
            return (
              <li key={step.id} className={cn('flex items-start gap-3 px-4 py-3 group', done && 'bg-surface/60')}>
                <button
                  onClick={() => markComplete(step.id as StepId)}
                  disabled={done || isLoading}
                  aria-label={done ? 'Concluído' : 'Marcar como concluído'}
                  className="mt-0.5 shrink-0 disabled:cursor-default"
                >
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-gold" />
                  ) : (
                    <Circle className={cn('h-5 w-5 text-slate-300 transition-colors', !isLoading && 'group-hover:text-gold/60')} />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium', done ? 'text-slate-400 line-through' : 'text-navy')}>
                    {step.label}
                  </p>
                  {!done && (
                    <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                  )}
                </div>
                {!done && (
                  <Link
                    href={step.href as any}
                    className="shrink-0 text-xs font-medium text-teal hover:text-teal/70 transition-colors whitespace-nowrap"
                  >
                    Ir →
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
