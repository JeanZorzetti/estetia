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
  WHATSAPP: { 
    label: 'WhatsApp', 
    icon: MessageSquare, 
    color: 'text-emerald-700 border-emerald-500/20 bg-emerald-500/10 shadow-sm shadow-emerald-500/5',
    indicatorColor: 'bg-emerald-500',
    glowColor: 'bg-emerald-500/10'
  },
  EMAIL: { 
    label: 'E-mail', 
    icon: Mail, 
    color: 'text-blue-700 border-blue-500/20 bg-blue-500/10 shadow-sm shadow-blue-500/5',
    indicatorColor: 'bg-blue-500',
    glowColor: 'bg-blue-500/10'
  },
  SMS: { 
    label: 'SMS', 
    icon: MessageSquare, 
    color: 'text-slate-700 border-slate-500/20 bg-slate-500/10 shadow-sm shadow-slate-500/5',
    indicatorColor: 'bg-slate-500',
    glowColor: 'bg-slate-500/10'
  },
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
      router.refresh()
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
      <div className="relative overflow-hidden rounded-[2.2rem] border border-slate-200/50 bg-white/40 p-12 lg:p-16 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center text-center">
        {/* Moldura cristalina interna */}
        <div className="absolute inset-0.5 pointer-events-none rounded-[2.1rem] border border-white/60" />
        
        {/* Glows de suporte no fundo do empty state */}
        <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-[#C5A059]/10 blur-3xl opacity-60 pointer-events-none animate-pulse" />
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl opacity-60 pointer-events-none" />

        {/* Caixa de mensagens clínica suspensa no pedestal de vidro fosco */}
        <div className="relative mb-6 flex items-center justify-center w-24 h-24 rounded-2xl bg-white/50 border border-white/80 shadow-xl backdrop-blur-md group hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 flex items-center justify-center border border-white/40">
            <MessageSquare className="w-8 h-8 text-[#C5A059] group-hover:rotate-6 transition-transform" />
          </div>
          {/* Glows pulsantes */}
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-[#C5A059] to-cyan-500 opacity-20 blur group-hover:opacity-40 transition-opacity duration-300" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9A7D42] shadow-sm">
            👑 ESTETIA RECALL ARCHIVE
          </div>
          
          <div>
            <h3 className="font-serif text-2xl font-extrabold text-slate-800 tracking-tight leading-none mb-2">
              Nenhuma regra clínica configurada
            </h3>
            <p className="text-sm font-medium text-slate-500 max-w-md mx-auto">
              Configure regras automatizadas para engajar e reativar seus pacientes de forma estratégica via WhatsApp, E-mail ou SMS.
            </p>
          </div>

          <Link
            href="/dashboard/recall/nova"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E5C07B] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span>+ Criar Primeira Regra</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-[2.2rem] border border-slate-200/50 bg-white/40 p-8 shadow-2xl backdrop-blur-xl">
      {/* Moldura cristalina interna */}
      <div className="absolute inset-0.5 pointer-events-none rounded-[2.1rem] border border-white/60" />
      
      <div className="relative z-10 flex flex-col gap-4">
        {rules.map(rule => {
          const canalCfg = CANAL_CONFIG[rule.canal] ?? CANAL_CONFIG.EMAIL
          const CanalIcon = canalCfg.icon
          const isDeleting = confirmDelete === rule.id
          const isLoading = loading === rule.id

          return (
            <div
              key={rule.id}
              className={`relative overflow-hidden rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-5 transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-md ${
                isLoading ? 'opacity-60 cursor-not-allowed' : ''
              } ${
                rule.ativo 
                  ? 'border-slate-200/40 bg-white/30 backdrop-blur-md hover:bg-white/60' 
                  : 'border-slate-200/20 bg-slate-50/20 opacity-80 hover:opacity-100 hover:bg-white/50'
              }`}
            >
              {/* Filete lateral esquerdo reativo */}
              <div 
                className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5 ${
                  rule.ativo ? canalCfg.indicatorColor : 'bg-slate-300'
                } ${
                  rule.ativo ? 'opacity-40 group-hover:opacity-100' : 'opacity-20 group-hover:opacity-50'
                }`} 
              />

              {/* Glow reativo sob o card */}
              <div 
                className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                  rule.ativo ? canalCfg.glowColor : 'bg-slate-400/5'
                }`} 
              />

              {/* Canal badge estilo vidro soprado */}
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide shrink-0 ${canalCfg.color}`}>
                <CanalIcon className="w-3.5 h-3.5" />
                {canalCfg.label}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0 pl-1 z-10">
                <p className={`font-serif text-lg font-bold truncate transition-colors duration-300 ${
                  rule.ativo ? 'text-slate-800 group-hover:text-cyan-600' : 'text-slate-400 group-hover:text-slate-500'
                }`}>
                  {rule.nome ?? `Regra ${rule.intervaloDias} dias`}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center rounded-md bg-slate-100/50 border border-slate-200/30 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider backdrop-blur-sm">
                    {rule.procedimentoNome ?? 'Qualquer procedimento'}
                  </span>
                  <span className="text-[10px] text-slate-400/60">•</span>
                  <span className="inline-flex items-center rounded-md bg-[#C5A059]/5 border border-[#C5A059]/10 px-2 py-0.5 text-[10px] font-semibold text-[#9A7D42] uppercase tracking-wider backdrop-blur-sm">
                    A cada {rule.intervaloDias} dias
                  </span>
                  <span className="text-[10px] text-slate-400/60">•</span>
                  <span className="inline-flex items-center rounded-md bg-blue-50/50 border border-blue-100/20 px-2 py-0.5 text-[10px] font-semibold text-blue-600 uppercase tracking-wider backdrop-blur-sm">
                    {rule.totalLogs} envios
                  </span>
                </div>
              </div>

              {/* Status toggle & Actions */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 z-10 pt-3 sm:pt-0 border-t border-slate-100/50 sm:border-t-0">
                {/* Status toggle */}
                <button
                  onClick={() => toggleAtivo(rule.id, rule.ativo)}
                  disabled={isLoading}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 border outline-none ${
                    rule.ativo 
                      ? 'bg-emerald-500 border-emerald-400 shadow-md shadow-emerald-500/20' 
                      : 'bg-slate-200 border-slate-300/60 shadow-inner'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                  title={rule.ativo ? 'Pausar regra' : 'Ativar regra'}
                >
                  <span 
                    className={`absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center ${
                      rule.ativo 
                        ? 'left-[calc(100%-20px)] ring-2 ring-emerald-500/20' 
                        : 'left-1'
                    }`}
                  >
                    {isLoading && (
                      <span className="h-2.5 w-2.5 rounded-full border border-slate-400 border-t-transparent animate-spin" />
                    )}
                  </span>
                </button>

                {/* Actions */}
                {isDeleting ? (
                  <div className="flex items-center gap-2 bg-red-50/70 border border-red-200/50 rounded-full px-3 py-1 backdrop-blur-sm animate-pulse">
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Excluir?</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => deleteRule(rule.id)}
                        disabled={isLoading}
                        className="text-[10px] text-white font-bold bg-red-600 hover:bg-red-700 px-2.5 py-0.5 rounded-full shadow-sm shadow-red-500/20 transition-all active:scale-95 uppercase"
                      >
                        Sim
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-[10px] text-slate-500 font-bold hover:text-slate-700 bg-white/80 hover:bg-white px-2.5 py-0.5 rounded-full border border-slate-200 transition-all active:scale-95 uppercase"
                      >
                        Não
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/dashboard/recall/${rule.id}`}
                      className="p-2 rounded-xl text-slate-400 hover:text-cyan-600 hover:bg-cyan-50/50 border border-transparent hover:border-cyan-100/50 transition-all duration-300 active:scale-95 hover:shadow-sm"
                      title="Ver logs"
                    >
                      <BarChart2 className="w-4.5 h-4.5" />
                    </Link>
                    <Link
                      href={`/dashboard/recall/${rule.id}/editar`}
                      className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50/50 border border-transparent hover:border-amber-100/50 transition-all duration-300 active:scale-95 hover:shadow-sm"
                      title="Editar"
                    >
                      <Pencil className="w-4.5 h-4.5" />
                    </Link>
                    <button
                      onClick={() => setConfirmDelete(rule.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50/50 border border-transparent hover:border-red-100/50 transition-all duration-300 active:scale-95 hover:shadow-sm"
                      title="Excluir"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
