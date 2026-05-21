'use client'

import { useState, useMemo } from 'react'
import { ArrowRight, Users, TrendingUp, CheckCircle2, Sparkles } from 'lucide-react'
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
    <div className="space-y-2 group">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-[#0A1F3D] dark:text-slate-200 group-hover:text-[#C5A059] transition-colors">{label}</label>
          {hint && <p className="text-[10px] text-[#94A3B8] dark:text-slate-400 mt-0.5">{hint}</p>}
        </div>
        <span className="text-sm font-bold tabular-nums px-2.5 py-0.5 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059]">
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
  const ltvCacLabel = calc.ltvCac >= 3 ? 'Excelente' : calc.ltvCac >= 1.5 ? 'Saudável' : 'Atenção Crítica'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
      {/* Inputs - 5 cols */}
      <div className="lg:col-span-5 rounded-3xl border border-white/40 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-8 relative">
        <div className="absolute top-0 left-0 w-2 h-16 bg-[#C5A059] rounded-r-full" />
        
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">Métricas</span>
          <h3 className="font-serif text-xl font-normal text-[#0A1F3D] dark:text-white mb-1.5 mt-0.5">Perfil do seu paciente</h3>
          <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed font-medium">Ajuste de acordo com a estimativa do paciente típico na sua clínica.</p>
        </div>

        <div className="space-y-6">
          <Slider label="Ticket médio por procedimento" value={ticket} min={50} max={2000} step={10} unit="R$" onChange={setTicket} />
          <Slider label="Procedimentos por ano" value={frequencia} min={1} max={24} step={1} unit=" proc./ano" hint="Quantas vezes em média o paciente retorna por ano" onChange={setFrequencia} />
          <Slider label="Tempo como paciente ativo" value={anos} min={1} max={10} step={0.5} unit=" anos" onChange={setAnos} />
          <Slider label="Custo de aquisição (CAC)" value={cac} min={0} max={500} step={5} unit="R$" hint="Gasto estimado em anúncios e vendas para atrair 1 paciente" onChange={setCac} />
        </div>
      </div>

      {/* Results - 7 cols */}
      <div className="lg:col-span-7 space-y-6">
        {/* LTV Principal (Dourado de Luxo) */}
        <div className="group rounded-3xl border border-[#C5A059]/30 dark:border-[#C5A059]/10 bg-gradient-to-br from-[#C5A059]/8 to-[#C5A059]/3 dark:from-[#C5A059]/10 dark:to-transparent p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#C5A059]/10 to-transparent rounded-full pointer-events-none" />
          
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#C5A059]/15 text-[#C5A059]">
                <Users className="h-4.5 w-4.5" />
              </div>
              <span className="text-sm font-bold text-[#C5A059] tracking-wide uppercase">Lifetime Value (LTV) Bruto</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest bg-[#C5A059] text-[#0A1F3D] px-2 py-0.5 rounded-full shadow-sm">
              <Sparkles className="h-2.5 w-2.5" /> Receita Acumulada
            </span>
          </div>
          
          <div className="text-5xl font-black text-[#C5A059] tabular-nums tracking-tight leading-none mb-1">
            {formatBRL(calc.ltvBruto)}
          </div>
          <p className="text-xs text-[#64748B] dark:text-slate-400 font-semibold mt-1">
            Projeção calculada para uma receita de {formatBRL(calc.receitaPorAnoPaciente)}/ano ao longo de {anos} anos de relacionamento.
          </p>
        </div>

        {/* LTV/CAC e CAC Máximo */}
        <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40 p-6 backdrop-blur-md shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-4 text-center shadow-sm">
              <div className="text-3xl font-black tabular-nums tracking-tight" style={{ color: ltvCacColor }}>
                {cac > 0 ? `${calc.ltvCac.toFixed(1)}x` : '∞'}
              </div>
              <div className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mt-1.5">Ratio LTV/CAC</div>
              <div className="text-[10px] font-extrabold uppercase tracking-widest mt-1 px-2.5 py-0.5 rounded-full inline-block" style={{ backgroundColor: `${ltvCacColor}15`, color: ltvCacColor }}>
                {ltvCacLabel}
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 p-4 text-center shadow-sm">
              <div className="text-3xl font-black text-[#0A1F3D] dark:text-white tabular-nums tracking-tight">
                {formatBRL(calc.maxCAC)}
              </div>
              <div className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mt-1.5">CAC máximo saudável</div>
              <div className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider mt-1">
                Teto sugerido (Regra LTV/3)
              </div>
            </div>
          </div>
        </div>

        {/* Com Estetia (Retenção Melhorada) */}
        <div className="group rounded-3xl border-2 border-emerald-500/30 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50/90 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-950/5 p-7 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
            <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300 tracking-wide">Com Retenção Aprimorada Estetia (+20% retorno)</span>
          </div>

          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-500 tabular-nums mb-3">
            {formatBRL(calc.ltvComEstetia)} <span className="text-sm font-bold text-emerald-600/70">por paciente</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-900/80 border border-emerald-500/10 rounded-xl p-3 shadow-inner">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold">
              +{formatBRL(calc.ganhoLTV)} adicionais acumulados por cliente na sua clínica
            </span>
          </div>

          <p className="text-[10.5px] text-emerald-800/60 dark:text-emerald-400/60 font-semibold leading-relaxed mt-3">
            O recall automatizado integrado à comunicação via WhatsApp reduzem o abandono da agenda e reativam pacientes ociosos sistematicamente.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Link
            href={"/features/recall-automatico" as any}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-sm text-white shadow-xl shadow-[#C5A059]/20 active:scale-[0.98] transition-all hover:opacity-95"
            style={{ backgroundColor: ACCENT }}
          >
            Ver como aumentar a retenção
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={"/features/analytics-pro" as any}
            className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-sm text-[#0A1F3D] dark:text-white border border-[#0A1F3D]/15 dark:border-white/10 hover:bg-[#0A1F3D]/5 dark:hover:bg-white/5 active:scale-[0.98] transition-all"
          >
            Monitorar LTV no Analytics PRO
          </Link>
        </div>
      </div>
    </div>
  )
}
