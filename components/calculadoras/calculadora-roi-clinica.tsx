'use client'

import { useState, useMemo } from 'react'
import { ArrowRight, TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Link } from '@/i18n/routing'

const ACCENT = '#489FB5'

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function Slider({ label, value, min, max, step, unit, onChange }: {
  label: string; value: number; min: number; max: number; step: number; unit: string
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-3 group">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-[#0A1F3D] tracking-wide">{label}</label>
        <span className="text-sm font-bold tabular-nums px-3 py-1 rounded-lg bg-[#489FB5]/10 border border-[#489FB5]/20 text-[#489FB5] shadow-sm transition-all group-hover:scale-105">
          {unit === 'R$' ? formatBRL(value) : `${value}${unit}`}
        </span>
      </div>
      <div className="relative flex items-center">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-100 focus:outline-none focus:ring-0
            [&::-webkit-slider-runnable-track]:bg-slate-100 [&::-webkit-slider-runnable-track]:rounded-full
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[#489FB5] [&::-webkit-slider-thumb]:to-[#3b8599] [&::-webkit-slider-thumb]:shadow-[0_2px_8px_rgba(72,159,181,0.4)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:active:scale-125"
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 font-medium tracking-wide">
        <span>{unit === 'R$' ? formatBRL(min) : `${min}${unit}`}</span>
        <span>{unit === 'R$' ? formatBRL(max) : `${max}${unit}`}</span>
      </div>
    </div>
  )
}

export function CalculadoraROIClinica() {
  const [atendimentos, setAtendimentos] = useState(80)
  const [ticket, setTicket] = useState(200)
  const [retorno, setRetorno] = useState(40)
  const [noShow, setNoShow] = useState(15)

  const calc = useMemo(() => {
    const receitaAtual = atendimentos * ticket
    const perdaNoShow = atendimentos * (noShow / 100) * ticket
    // com Estetia: -70% no-show, +20% retorno
    const noShowComEstetia = noShow * 0.3
    const atendimentosEfetivosAtual = atendimentos * (1 - noShow / 100)
    const atendimentosEfetivosEstetia = atendimentos * (1 - noShowComEstetia / 100)
    const receitaSemNoShow = atendimentosEfetivosAtual * ticket
    const receitaComEstetia = atendimentosEfetivosEstetia * ticket * (1 + (retorno < 80 ? 0.15 : 0.05))
    const ganhoMensal = receitaComEstetia - receitaAtual
    const ganhoAnual = ganhoMensal * 12
    const perdaRetorno = receitaAtual * ((80 - retorno) / 100) * 0.3
    return {
      receitaAtual,
      perdaNoShow,
      receitaSemNoShow,
      receitaComEstetia,
      ganhoMensal: Math.max(0, ganhoMensal),
      ganhoAnual: Math.max(0, ganhoAnual),
      perdaTotal: perdaNoShow + perdaRetorno,
    }
  }, [atendimentos, ticket, retorno, noShow])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Inputs */}
      <div className="rounded-3xl border border-white/50 bg-white/70 backdrop-blur-xl p-8 shadow-[0_20px_50px_rgba(10,31,61,0.04)] space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#489FB5]" />
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#0A1F3D] mb-1">Métricas da Clínica</h3>
          <p className="text-xs text-slate-500">Arraste os controles para simular seus resultados.</p>
        </div>
        <Slider label="Atendimentos por mês" value={atendimentos} min={10} max={400} step={5} unit=" atend." onChange={setAtendimentos} />
        <Slider label="Ticket médio por procedimento" value={ticket} min={50} max={2000} step={10} unit="R$" onChange={setTicket} />
        <Slider label="Taxa de retorno atual" value={retorno} min={10} max={95} step={5} unit="%" onChange={setRetorno} />
        <Slider label="Taxa de no-show (faltas)" value={noShow} min={0} max={50} step={1} unit="%" onChange={setNoShow} />
      </div>

      {/* Results */}
      <div className="space-y-6">
        {/* Perda atual */}
        <div className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50/40 via-white to-rose-50/20 p-6 shadow-[0_10px_30px_rgba(244,63,94,0.03)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-2.5 mb-3 text-rose-800 font-medium">
            <AlertCircle className="h-4.5 w-4.5 text-rose-600 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide uppercase text-rose-700">Vazamento Financeiro Mensal Estimado</span>
          </div>
          <div className="text-4xl font-serif font-black text-rose-600 tabular-nums mb-1">
            {formatBRL(calc.perdaTotal)}
          </div>
          <p className="text-xs text-rose-500 font-medium">
            Prejuízo decorrente de pacientes que não retornam e no-shows sem recall automatizado.
          </p>
        </div>

        {/* Receita atual */}
        <div className="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-1.5 text-slate-500">
            <TrendingDown className="h-4.5 w-4.5 text-slate-400" />
            <span className="text-sm font-medium tracking-wide uppercase">Faturamento Mensal Estimado Atual</span>
          </div>
          <div className="text-3xl font-serif font-bold text-[#0A1F3D] tabular-nums">{formatBRL(calc.receitaAtual)}</div>
        </div>

        {/* Projeção com Estetia */}
        <div className="rounded-3xl border border-[#489FB5]/30 bg-gradient-to-br from-[#0A1F3D] to-[#0D2447] text-white p-7 shadow-[0_20px_45px_rgba(72,159,181,0.18)] relative overflow-hidden">
          {/* Halos de luz internos de luxo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#489FB5]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[#489FB5] font-semibold">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-bold tracking-wider uppercase">Projeção com Estetia</span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/25 rounded-full px-2.5 py-1 uppercase shadow-sm">
              Potencial Estimado
            </span>
          </div>
          
          <div className="text-4xl font-serif font-black text-white tabular-nums mb-4">
            {formatBRL(calc.receitaComEstetia)}
          </div>
          
          <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Lucro Adicional Recuperado</div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#C5A059] tabular-nums">+{formatBRL(calc.ganhoMensal)}</span>
              <span className="text-xs text-white/60 font-medium">/ mês</span>
            </div>
            <div className="text-xs text-[#489FB5] font-semibold flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Isso equivale a adicionais +{formatBRL(calc.ganhoAnual)} ao ano
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/70">
            <div className="flex items-center gap-2.5 py-2 px-3 rounded-xl bg-white/3 border border-white/5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Redução de no-show (-70%)</span>
            </div>
            <div className="flex items-center gap-2.5 py-2 px-3 rounded-xl bg-white/3 border border-white/5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Melhoria de retorno (+15%)</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2.5 w-full rounded-2xl py-4 font-bold text-sm text-white bg-gradient-to-r from-[#489FB5] to-[#3b8599] hover:from-[#3b8599] hover:to-[#2e6878] active:scale-[0.98] transition-all shadow-[0_10px_25px_rgba(72,159,181,0.25)]"
          >
            Começar Grátis por 14 Dias
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>
          <p className="text-center text-[10px] text-slate-400 font-medium tracking-wide">Sem cartão de crédito · Cancele quando quiser</p>
        </div>
      </div>
    </div>
  )
}
