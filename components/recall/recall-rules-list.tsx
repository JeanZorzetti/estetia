'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, Mail, Pencil, Trash2, BarChart2 } from 'lucide-react'

interface RecallRule {
  id: string
  nome: string | null
  procedimentoId: string | null
  procedimentoNome: string | null
  intervaloDias: number
  canal: 'WHATSAPP' | 'EMAIL' | 'SMS'
  ativo: boolean
  totalLogs: number
  createdAt: string
}

interface RecallRulesListProps {
  rules: RecallRule[]
}

const CANAL_CONFIG = {
  WHATSAPP: { label: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  EMAIL: { label: 'E-mail', icon: Mail, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  SMS: { label: 'SMS', icon: MessageSquare, color: 'text-gray-600 bg-gray-50 border-gray-200' },
}

export function RecallRulesList({ rules: initialRules }: RecallRulesListProps) {
  const router = useRouter()
  const [rules, setRules] = useState(initialRules)
  const [loading, setLoading] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  async function toggleAtivo(id: string, current: boolean) {
    setLoading(id)
    try {
      await fetch(`/api/recall-rules/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !current }),
      })
      setRules(prev => prev.map(r => r.id === id ? { ...r, ativo: !current } : r))
    } finally {
      setLoading(null)
    }
  }

  async function deleteRule(id: string) {
    setLoading(id)
    try {
      await fetch(`/api/recall-rules/${id}`, { method: 'DELETE' })
      setRules(prev => prev.filter(r => r.id !== id))
      setConfirmDelete(null)
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  if (rules.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-16 flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-muted-foreground/50" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Nenhuma regra configurada</p>
          <p className="text-xs text-muted-foreground mt-0.5">Configure regras para reativar pacientes automaticamente via WhatsApp ou e-mail.</p>
        </div>
        <Link
          href="/dashboard/recall/nova"
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#0A1F3D] px-4 py-2 text-xs font-medium text-white hover:bg-[#0A1F3D]/90 transition-colors"
        >
          + Criar primeira regra
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {rules.map(rule => {
        const canalCfg = CANAL_CONFIG[rule.canal] ?? CANAL_CONFIG.EMAIL
        const CanalIcon = canalCfg.icon
        const isDeleting = confirmDelete === rule.id
        const isLoading = loading === rule.id

        return (
          <div
            key={rule.id}
            className={`rounded-xl border bg-card p-4 flex items-center gap-4 transition-opacity ${isLoading ? 'opacity-60' : ''} ${rule.ativo ? 'border-border/60' : 'border-border/30 bg-muted/20'}`}
          >
            {/* Canal badge */}
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shrink-0 ${canalCfg.color}`}>
              <CanalIcon className="w-3 h-3" />
              {canalCfg.label}
            </span>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${rule.ativo ? 'text-foreground' : 'text-muted-foreground'}`}>
                {rule.nome ?? `Regra ${rule.intervaloDias} dias`}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {rule.procedimentoNome ?? 'Qualquer procedimento'} · a cada {rule.intervaloDias} dias · {rule.totalLogs} envios
              </p>
            </div>

            {/* Status toggle */}
            <button
              onClick={() => toggleAtivo(rule.id, rule.ativo)}
              disabled={isLoading}
              className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${rule.ativo ? 'bg-emerald-500' : 'bg-gray-300'}`}
              title={rule.ativo ? 'Pausar regra' : 'Ativar regra'}
            >
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${rule.ativo ? 'left-[calc(100%-18px)]' : 'left-0.5'}`} />
            </button>

            {/* Actions */}
            {isDeleting ? (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-red-600">Confirmar exclusão?</span>
                <button
                  onClick={() => deleteRule(rule.id)}
                  disabled={isLoading}
                  className="text-xs text-red-600 font-medium hover:underline"
                >
                  Excluir
                </button>
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/dashboard/recall/${rule.id}`}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Ver logs"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/dashboard/recall/${rule.id}/editar`}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Editar"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setConfirmDelete(rule.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
