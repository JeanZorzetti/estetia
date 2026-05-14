'use client'

import { useState, useMemo } from 'react'
import { ArrowRight, AlertCircle, CheckCircle2, TrendingDown } from 'lucide-react'
import { Link } from '@/i18n/routing'

const ACCENT = '#E05A4E'

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

export function CalculadoraNoShow() {
  const [agendaDia, setAgendaDia] = useState(10)
  const [diasMes, setDiasMes] = useState(22)
  const [pctFaltas, setPctFaltas] = useState(18)
  const [valorProcedimento, setValorProcedimento] = useState(180)

  const calc = useMemo(() => {
    const totalAtendimentos = agendaDia * diasMes
    const faltasMes = Math.round(totalAtendimentos * (pctFaltas / 100))
    const perdaMes = faltasMes * valorProcedimento
    const perdaAno = perdaMes * 12
    // Com recall automático: média de 4% no-show no mercado
    const noShowComRecall = 0.04
    const faltasComRecall = Math.round(totalAtendimentos * noShowComRecall)
    const perdaComRecall = faltasComRecall * valorProcedimento
    const economiaMes = perdaMes - perdaComRecall
    const economiaAno = economiaMes * 12
    return { faltasMes, perdaMes, perdaAno, faltasComRecall, economiaMes, economiaAno, totalAtendimentos }
  }, [agendaDia, diasMes, pctFaltas, valorProcedimento])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Inputs */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm space-y-7">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F3D] mb-1">Como é sua agenda hoje?</h3>
          <p className="text-xs text-[#64748B]">Ajuste para refletir sua realidade atual.</p>
        </div>
        <Slider label="Atendimentos por dia" value={agendaDia} min={2} max={30} step={1} unit=" atend." onChange={setAgendaDia} />
        <Slider label="Dias úteis por mês" value={diasMes} min={15} max={26} step={1} unit=" dias" onChange={setDiasMes} />
        <Slider label="Taxa de no-show (faltas sem aviso)" value={pctFaltas} min={1} max={50} step={1} unit="%" onChange={setPctFaltas} />
        <Slider label="Valor médio do procedimento" value={valorProcedimento} min={50} max={2000} step={10} unit="R$" onChange={setValorProcedimento} />
      </div>

      {/* Results */}
      <div className="space-y-4">
        {/* Perda atual */}
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-semibold text-red-700">Você perde por mês com faltas</span>
          </div>
          <div className="text-4xl font-bold text-red-600 tabular-nums">{formatBRL(calc.perdaMes)}</div>
          <p className="text-xs text-red-400 mt-1">{calc.faltasMes} faltas × {formatBRL(valorProcedimento)} = prejuízo real</p>
          <div className="mt-2 text-sm font-semibold text-red-700">{formatBRL(calc.perdaAno)} por ano</div>
        </div>

        {/* Situação atual */}
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-[#94A3B8]" />
            <span className="text-sm text-[#64748B]">Cenário sem automação</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="rounded-xl bg-white border border-[#E2E8F0] p-3">
              <div className="text-xl font-bold text-[#0A1F3D]">{pctFaltas}%</div>
              <div className="text-[10px] text-[#64748B]">taxa de no-show</div>
            </div>
            <div className="rounded-xl bg-white border border-[#E2E8F0] p-3">
              <div className="text-xl font-bold text-[#0A1F3D]">{calc.faltasMes}</div>
              <div className="text-[10px] text-[#64748B]">faltas / mês</div>
            </div>
          </div>
        </div>

        {/* Com recall automático */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Com recall automático Estetia</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center mb-3">
            <div className="rounded-xl bg-white border border-emerald-100 p-3">
              <div className="text-xl font-bold text-emerald-600">~4%</div>
              <div className="text-[10px] text-[#64748B]">no-show (média mercado)</div>
            </div>
            <div className="rounded-xl bg-white border border-emerald-100 p-3">
              <div className="text-xl font-bold text-emerald-600">{calc.faltasComRecall}</div>
              <div className="text-[10px] text-[#64748B]">faltas / mês</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 tabular-nums">+{formatBRL(calc.economiaMes)}/mês</div>
            <div className="text-xs text-emerald-600">+{formatBRL(calc.economiaAno)}/ano recuperados</div>
          </div>
        </div>

        <Link
          href={"/features/recall-automatico" as any}
          className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 font-bold text-sm text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: ACCENT }}
        >
          Ver como o recall automático funciona
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/register"
          className="flex items-center justify-center gap-2 w-full rounded-xl py-3 font-semibold text-sm text-[#0A1F3D] border border-[#0A1F3D]/20 hover:bg-[#0A1F3D]/5 transition-colors"
        >
          Começar grátis — sem cartão
        </Link>
      </div>
    </div>
  )
}
