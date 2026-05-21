'use client'

import { useState, useMemo } from 'react'
import { ArrowRight, AlertCircle, CheckCircle2, TrendingDown, TrendingUp, Sparkles } from 'lucide-react'
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
    <div className="space-y-2 group">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#0A1F3D] dark:text-slate-200 group-hover:text-[#E05A4E] transition-colors">{label}</label>
        <span className="text-sm font-bold tabular-nums px-2.5 py-0.5 rounded-lg bg-[#E05A4E]/10 border border-[#E05A4E]/20 text-[#E05A4E]">
          {unit === 'R$' ? formatBRL(value) : `${value}${unit}`}
        </span>
      </div>
      <div className="relative flex items-center">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 active:cursor-grabbing transition-all focus:outline-none"
          style={{ 
            accentColor: ACCENT,
            backgroundImage: `linear-gradient(to right, ${ACCENT} 0%, ${ACCENT} ${((value - min) / (max - min)) * 100}%, rgb(226, 232, 240) ${((value - min) / (max - min)) * 100}%, rgb(226, 232, 240) 100%)`
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[#64748B] dark:text-slate-400 font-semibold tracking-wider">
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
      {/* Inputs - 5 cols */}
      <div className="lg:col-span-5 rounded-3xl border border-white/40 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-8 relative">
        <div className="absolute top-0 left-0 w-2 h-16 bg-[#E05A4E] rounded-r-full" />
        
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#E05A4E]">Parâmetros</span>
          <h3 className="font-serif text-xl font-normal text-[#0A1F3D] dark:text-white mb-1.5 mt-0.5">Como é sua agenda hoje?</h3>
          <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">Ajuste os valores para refletir a realidade da sua clínica.</p>
        </div>

        <div className="space-y-6">
          <Slider label="Atendimentos por dia" value={agendaDia} min={2} max={30} step={1} unit=" atend." onChange={setAgendaDia} />
          <Slider label="Dias úteis por mês" value={diasMes} min={15} max={26} step={1} unit=" dias" onChange={setDiasMes} />
          <Slider label="Taxa de no-show (faltas)" value={pctFaltas} min={1} max={50} step={1} unit="%" onChange={setPctFaltas} />
          <Slider label="Valor médio do procedimento" value={valorProcedimento} min={50} max={2000} step={10} unit="R$" onChange={setValorProcedimento} />
        </div>
      </div>

      {/* Results - 7 cols */}
      <div className="lg:col-span-7 space-y-6">
        {/* Perda atual (Alerta) */}
        <div className="group rounded-3xl border border-red-100/50 dark:border-red-950/20 bg-gradient-to-br from-red-50/90 to-red-100/40 dark:from-red-950/20 dark:to-red-950/5 p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-red-500/10 to-transparent rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-bold text-red-800 dark:text-red-300 tracking-wide">Custo da Inércia (Prejuízo Mensal)</span>
          </div>
          
          <div className="text-5xl font-black text-red-600 dark:text-red-500 tabular-nums tracking-tight leading-none mb-1">
            {formatBRL(calc.perdaMes)}
          </div>
          <p className="text-xs text-red-700/60 dark:text-red-400/60 font-semibold mt-1">
            Com {calc.faltasMes} faltas sem aviso custando {formatBRL(valorProcedimento)} cada.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-red-800 dark:text-red-300 bg-red-200/40 dark:bg-red-950/30 px-3 py-1 rounded-xl">
            Perda anual acumulada de {formatBRL(calc.perdaAno)}
          </div>
        </div>

        {/* Cenário atual */}
        <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 p-6 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="h-4.5 w-4.5 text-[#94A3B8]" />
            <span className="text-xs font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">Cenário sem Automação</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-4 shadow-sm">
              <div className="text-2xl font-black text-[#0A1F3D] dark:text-white tracking-tight">{pctFaltas}%</div>
              <div className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mt-1">taxa de no-show</div>
            </div>
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-4 shadow-sm">
              <div className="text-2xl font-black text-[#0A1F3D] dark:text-white tracking-tight">{calc.faltasMes}</div>
              <div className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mt-1">faltas / mês</div>
            </div>
          </div>
        </div>

        {/* Com recall automático (Sucesso) */}
        <div className="group rounded-3xl border-2 border-emerald-500/30 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50/90 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-950/5 p-7 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full pointer-events-none" />
          
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-4.5 w-4.5" />
              </div>
              <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 tracking-wide">Com Recall Automático Estetia</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest bg-emerald-500 text-white dark:bg-emerald-600 px-2 py-0.5 rounded-full shadow-sm">
              <Sparkles className="h-2.5 w-2.5" /> Projeção VIP
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center mb-6">
            <div className="rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-emerald-500/10 p-3.5 shadow-sm">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">~4%</div>
              <div className="text-[10px] font-semibold text-[#64748B] dark:text-slate-400 mt-0.5">no-show do mercado</div>
            </div>
            <div className="rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-emerald-500/10 p-3.5 shadow-sm">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">{calc.faltasComRecall}</div>
              <div className="text-[10px] font-semibold text-[#64748B] dark:text-slate-400 mt-0.5">faltas residuais / mês</div>
            </div>
          </div>

          <div className="text-center bg-white/80 dark:bg-slate-900/70 border border-emerald-500/10 rounded-2xl p-4 shadow-inner">
            <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest mb-0.5">Faturamento Recuperado</div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-500 tabular-nums">{formatBRL(calc.economiaMes)}<span className="text-base font-bold text-emerald-600/70">/mês</span></div>
            <div className="text-[10px] text-emerald-800/60 dark:text-emerald-400/60 font-bold uppercase tracking-wider mt-1">+{formatBRL(calc.economiaAno)} ao ano recuperados</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Link
            href={"/features/recall-automatico" as any}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-sm text-white shadow-xl shadow-red-500/20 active:scale-[0.98] transition-all hover:opacity-95"
            style={{ backgroundColor: ACCENT }}
          >
            Ver como o recall automático funciona
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/register"
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-sm text-[#0A1F3D] dark:text-white border border-[#0A1F3D]/15 dark:border-white/10 hover:bg-[#0A1F3D]/5 dark:hover:bg-white/5 active:scale-[0.98] transition-all"
          >
            Começar grátis — 14 dias
          </Link>
        </div>
      </div>
    </div>
  )
}
