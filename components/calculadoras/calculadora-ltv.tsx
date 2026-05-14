'use client'

import { useState, useMemo } from 'react'
import { ArrowRight, Users, TrendingUp, CheckCircle2 } from 'lucide-react'
import { Link } from '@/i18n/routing'

const ACCENT = '#C5A059'

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function Slider({ label, value, min, max, step, unit, onChange, hint }: {
  label: string; value: number; min: number; max: number; step: number; unit: string
  onChange: (v: number) => void; hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-[#0A1F3D]">{label}</label>
          {hint && <p className="text-[10px] text-[#94A3B8]">{hint}</p>}
        </div>
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

export function CalculadoraLTV() {
  const [ticket, setTicket] = useState(200)
  const [frequencia, setFrequencia] = useState(4)
  const [anos, setAnos] = useState(2)
  const [cac, setCac] = useState(80)

  const calc = useMemo(() => {
    const ltvBruto = ticket * frequencia * anos
    const ltvCac = cac > 0 ? ltvBruto / cac : 0
    const receitaPorAnoPaciente = ticket * frequencia

    // Cenário com retenção melhorada (+20% frequência com Estetia)
    const frequenciaComEstetia = frequencia * 1.2
    const ltvComEstetia = ticket * frequenciaComEstetia * anos
    const ganhoLTV = ltvComEstetia - ltvBruto

    // Máximo investimento válido de aquisição (LTV/3 = regra saudável)
    const maxCAC = ltvBruto / 3

    return { ltvBruto, ltvCac, receitaPorAnoPaciente, ltvComEstetia, ganhoLTV, maxCAC }
  }, [ticket, frequencia, anos, cac])

  const ltvCacColor = calc.ltvCac >= 3 ? '#10B981' : calc.ltvCac >= 1.5 ? '#F59E0B' : '#EF4444'
  const ltvCacLabel = calc.ltvCac >= 3 ? 'Excelente' : calc.ltvCac >= 1.5 ? 'Razoável' : 'Atenção'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Inputs */}
      <div className="rounded-2xl border border-[#C5A059]/20 bg-white p-6 shadow-sm space-y-7">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F3D] mb-1">Perfil do seu paciente</h3>
          <p className="text-xs text-[#64748B]">Valores médios para o paciente típico da sua clínica.</p>
        </div>
        <Slider label="Ticket médio por procedimento" value={ticket} min={50} max={2000} step={10} unit="R$" onChange={setTicket} />
        <Slider label="Procedimentos por ano" value={frequencia} min={1} max={24} step={1} unit=" proc./ano" hint="Quantas vezes em média o paciente retorna" onChange={setFrequencia} />
        <Slider label="Tempo como paciente ativo" value={anos} min={1} max={10} step={0.5} unit=" anos" onChange={setAnos} />
        <Slider label="Custo de aquisição (CAC)" value={cac} min={0} max={500} step={5} unit="R$" hint="Gasto em marketing para atrair 1 paciente" onChange={setCac} />
      </div>

      {/* Results */}
      <div className="space-y-4">
        {/* LTV principal */}
        <div className="rounded-2xl border border-[#C5A059]/30 bg-[#C5A059]/5 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4" style={{ color: ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: ACCENT }}>LTV bruto por paciente</span>
          </div>
          <div className="text-4xl font-bold tabular-nums" style={{ color: ACCENT }}>{formatBRL(calc.ltvBruto)}</div>
          <p className="text-xs text-[#94A3B8] mt-1">{formatBRL(calc.receitaPorAnoPaciente)}/ano × {anos} anos</p>
        </div>

        {/* LTV/CAC */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold tabular-nums" style={{ color: ltvCacColor }}>
                {cac > 0 ? `${calc.ltvCac.toFixed(1)}x` : '∞'}
              </div>
              <div className="text-[10px] text-[#64748B]">Ratio LTV/CAC</div>
              <div className="text-[10px] font-semibold mt-0.5" style={{ color: ltvCacColor }}>{ltvCacLabel}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#0A1F3D] tabular-nums">{formatBRL(calc.maxCAC)}</div>
              <div className="text-[10px] text-[#64748B]">CAC máximo saudável</div>
              <div className="text-[10px] text-[#94A3B8] mt-0.5">Regra LTV/3</div>
            </div>
          </div>
        </div>

        {/* Com Estetia */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Com retenção aprimorada (+20% retorno)</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600 tabular-nums">{formatBRL(calc.ltvComEstetia)}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-xs text-emerald-600 font-semibold">+{formatBRL(calc.ganhoLTV)} a mais por paciente</span>
          </div>
          <p className="text-[10px] text-emerald-600/70 mt-1.5">
            Recall automático + WhatsApp integrado aumentam frequência de retorno.
          </p>
        </div>

        <Link
          href={"/features/recall-automatico" as any}
          className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 font-bold text-sm text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          Ver como aumentar retenção
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={"/features/analytics-pro" as any}
          className="flex items-center justify-center gap-2 w-full rounded-xl py-3 font-semibold text-sm text-[#0A1F3D] border border-[#0A1F3D]/20 hover:bg-[#0A1F3D]/5 transition-colors"
        >
          Monitorar LTV no Analytics PRO
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
