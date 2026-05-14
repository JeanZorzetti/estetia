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
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#0A1F3D]">{label}</label>
        <span className="text-sm font-bold tabular-nums" style={{ color: ACCENT }}>
          {unit === 'R$' ? formatBRL(value) : `${value}${unit}`}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: ACCENT }}
      />
      <div className="flex justify-between text-[10px] text-[#64748B]">
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Inputs */}
      <div className="rounded-2xl border border-[#489FB5]/20 bg-white p-6 shadow-sm space-y-7">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F3D] mb-1">Dados da sua clínica</h3>
          <p className="text-xs text-[#64748B]">Ajuste os sliders para refletir sua realidade atual.</p>
        </div>
        <Slider label="Atendimentos por mês" value={atendimentos} min={10} max={400} step={5} unit=" atend." onChange={setAtendimentos} />
        <Slider label="Ticket médio por procedimento" value={ticket} min={50} max={2000} step={10} unit="R$" onChange={setTicket} />
        <Slider label="Taxa de retorno atual" value={retorno} min={10} max={95} step={5} unit="%" onChange={setRetorno} />
        <Slider label="Taxa de no-show (faltas)" value={noShow} min={0} max={50} step={1} unit="%" onChange={setNoShow} />
      </div>

      {/* Results */}
      <div className="space-y-4">
        {/* Perda atual */}
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-semibold text-red-700">Você está perdendo por mês</span>
          </div>
          <div className="text-3xl font-bold text-red-600 tabular-nums">
            {formatBRL(calc.perdaTotal)}
          </div>
          <p className="text-xs text-red-500 mt-1">Com no-shows + pacientes que não retornam</p>
        </div>

        {/* Receita atual */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-4 w-4 text-[#64748B]" />
            <span className="text-sm text-[#64748B]">Receita atual estimada / mês</span>
          </div>
          <div className="text-2xl font-bold text-[#0A1F3D] tabular-nums">{formatBRL(calc.receitaAtual)}</div>
        </div>

        {/* Projeção com Estetia */}
        <div className="rounded-2xl border border-[#489FB5]/30 bg-[#489FB5]/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4" style={{ color: ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: ACCENT }}>Com Estetia CRM / mês</span>
          </div>
          <div className="text-3xl font-bold tabular-nums" style={{ color: ACCENT }}>
            {formatBRL(calc.receitaComEstetia)}
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs text-emerald-600 font-semibold">
              +{formatBRL(calc.ganhoMensal)}/mês · +{formatBRL(calc.ganhoAnual)}/ano
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#64748B]">
            <div className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> -70% no-shows</div>
            <div className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> +15% retorno</div>
          </div>
        </div>

        <Link
          href="/register"
          className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 font-bold text-sm text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          Começar grátis por 14 dias
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="text-center text-[10px] text-[#94A3B8]">Sem cartão de crédito · Cancele quando quiser</p>
      </div>
    </div>
  )
}
