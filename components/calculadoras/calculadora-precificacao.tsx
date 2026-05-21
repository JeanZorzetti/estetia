'use client'

import { useState, useMemo } from 'react'
import { ArrowRight, DollarSign, AlertCircle, Info, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { calcPrecificacao, PROCEDURE_TEMPLATES, MARGIN_PRESETS } from '@/config/ferramentas/precificacao-data'

const ACCENT = '#0A1F3D'

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function NumberInput({ label, value, min, unit, hint, onChange }: {
  label: string; value: number; min: number; unit: string; hint?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-1.5 group">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#0A1F3D] dark:text-slate-200 group-focus-within:text-[#C5A059] transition-colors">{label}</label>
        {hint && (
          <span className="text-[10px] text-[#94A3B8] flex items-center gap-0.5 font-medium">
            <Info className="h-3 w-3" />{hint}
          </span>
        )}
      </div>
      <div className="relative">
        {unit === 'R$' && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#94A3B8] font-bold">R$</span>
        )}
        <input
          type="number" min={min} value={value}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value)))}
          className={`w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm px-3.5 py-3 text-sm text-[#0A1F3D] dark:text-white font-bold focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 transition-all ${unit === 'R$' ? 'pl-10' : ''}`}
        />
        {unit !== 'R$' && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] font-bold">{unit}</span>
        )}
      </div>
    </div>
  )
}

export function CalculadoraPrecificacao() {
  const [insumos, setInsumos] = useState(60)
  const [tempoMin, setTempoMin] = useState(60)
  const [custoHora, setCustoHora] = useState(90)
  const [custoFixo, setCustoFixo] = useState(35)
  const [margemPct, setMargemPct] = useState(35)

  const result = useMemo(() => calcPrecificacao(insumos, tempoMin, custoHora, custoFixo, margemPct), [
    insumos, tempoMin, custoHora, custoFixo, margemPct
  ])

  function applyTemplate(idx: number) {
    const t = PROCEDURE_TEMPLATES[idx]
    setInsumos(t.insumos)
    setTempoMin(t.tempoMin)
    setCustoHora(t.custoHoraProfissional)
    setCustoFixo(t.custoFixoRateado)
  }

  const prices = [
    { label: 'Preço mínimo de segurança', value: result.precoMinimo, margin: 20, color: '#E05A4E', desc: 'Cobre o custo total somado a uma margem mínima prudente de 20%. Cobrar menos gera prejuízo operacional.', badge: 'Margem Limite' },
    { label: 'Preço sugerido comercial', value: result.precoSugerido, margin: margemPct, color: '#0A1F3D', desc: `Equilibra perfeitamente competitividade no mercado regional com sua margem desejada de ${margemPct}%.`, badge: 'Ideal Estetia' },
    { label: 'Preço de posicionamento premium', value: result.precoPremium, margin: result.margemPremium, color: '#C5A059', desc: 'Valor ideal para posicionamento com alto valor agregado, ambientes VIP e experiência memorável de marca.', badge: 'Alta Fidelidade' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
      {/* Inputs — 5 cols */}
      <div className="lg:col-span-5 rounded-3xl border border-white/40 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none space-y-6 relative">
        <div className="absolute top-0 left-0 w-2 h-16 bg-[#0A1F3D] dark:bg-[#C5A059] rounded-r-full" />
        
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">Auditoria</span>
          <h3 className="font-serif text-xl font-normal text-[#0A1F3D] dark:text-white mb-1.5 mt-0.5">Parâmetros de Custo</h3>
          <p className="text-xs text-[#64748B] dark:text-slate-400 mb-4">Escolha um template de referência rápida:</p>
          <div className="flex flex-wrap gap-2">
            {PROCEDURE_TEMPLATES.map((t, i) => (
              <button
                key={t.label}
                onClick={() => applyTemplate(i)}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-[#64748B] dark:text-slate-300 hover:border-[#C5A059] hover:text-[#C5A059] active:scale-95 transition-all"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <NumberInput label="Custo de insumos descartáveis" value={insumos} min={0} unit="R$" hint="por sessão" onChange={setInsumos} />
          <NumberInput label="Tempo total de execução" value={tempoMin} min={5} unit="min" onChange={setTempoMin} />
          <NumberInput label="Custo da hora do profissional" value={custoHora} min={0} unit="R$/h" onChange={setCustoHora} />
          <NumberInput label="Custo fixo indireto rateado" value={custoFixo} min={0} unit="R$" hint="aluguel, equipe, água..." onChange={setCustoFixo} />
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#0A1F3D] dark:text-slate-200 uppercase tracking-wider">Margem de lucro desejada</label>
            <span className="text-sm font-bold text-[#C5A059] px-2.5 py-0.5 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/20">{margemPct}%</span>
          </div>
          <div className="flex gap-2">
            {MARGIN_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => setMargemPct(p.value)}
                className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all active:scale-95 ${margemPct === p.value ? 'bg-[#0A1F3D] dark:bg-[#C5A059] text-white dark:text-[#0A1F3D] shadow-md' : 'border border-slate-200 dark:border-slate-800 text-[#64748B] dark:text-slate-300 bg-white dark:bg-slate-900 hover:border-[#0A1F3D]/30'}`}
              >
                {p.value}%
              </button>
            ))}
          </div>
        </div>

        {/* Custo total breakdown (Receipt styling) */}
        <div className="rounded-2xl bg-[#F8FAFC]/90 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-5 text-xs space-y-2.5 shadow-inner">
          <div className="font-bold text-[#0A1F3D] dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">Breakdown de custos</div>
          
          <div className="flex justify-between text-[#64748B] dark:text-slate-400 font-semibold">
            <span>Insumos Consumidos</span>
            <span className="tabular-nums font-bold text-slate-800 dark:text-white">{formatBRL(insumos)}</span>
          </div>
          <div className="flex justify-between text-[#64748B] dark:text-slate-400 font-semibold">
            <span>Tempo Clínico ({tempoMin}min)</span>
            <span className="tabular-nums font-bold text-slate-800 dark:text-white">{formatBRL(result.custoTempo)}</span>
          </div>
          <div className="flex justify-between text-[#64748B] dark:text-slate-400 font-semibold">
            <span>Custo Operacional Fixo</span>
            <span className="tabular-nums font-bold text-slate-800 dark:text-white">{formatBRL(custoFixo)}</span>
          </div>
          
          <div className="flex justify-between font-bold text-base text-[#0A1F3D] dark:text-white border-t-2 border-dashed border-slate-300 dark:border-slate-700 pt-3 mt-1">
            <span>CUSTO OPERACIONAL TOTAL</span>
            <span className="tabular-nums text-[#0A1F3D] dark:text-[#C5A059]">{formatBRL(result.custoTotal)}</span>
          </div>
        </div>
      </div>

      {/* Results — 7 cols */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">Projeções</span>
          <h3 className="font-serif text-xl font-normal text-[#0A1F3D] dark:text-white mb-1.5 mt-0.5">Seus 3 preços de referência</h3>
          <p className="text-xs text-[#94A3B8] flex items-center gap-1 font-semibold leading-none">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            Estimativa operacional. Considere validações tributárias antes de faturar.
          </p>
        </div>

        {prices.map((p) => {
          const bgOpacityColor = p.color === '#0A1F3D' ? 'dark:bg-slate-900/60 bg-[#0A1F3D]/5' : `${p.color}08`
          const borderOpacityColor = p.color === '#0A1F3D' ? 'border-[#0A1F3D]/20 dark:border-slate-800' : ''
          const inlineBorder = p.color !== '#0A1F3D' ? { borderColor: `${p.color}25` } : {}
          const inlineBg = p.color !== '#0A1F3D' ? { backgroundColor: bgOpacityColor } : {}
          
          return (
            <div
              key={p.label}
              className={`rounded-3xl border p-6 flex flex-col md:flex-row md:items-center gap-5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden ${borderOpacityColor}`}
              style={{ ...inlineBorder, ...inlineBg }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-transparent to-transparent opacity-10 rounded-full pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, ${p.color} 0%, transparent 80%)` }} />
              
              <div className="h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${p.color}15` }}>
                <DollarSign className="h-6 w-6" style={{ color: p.color }} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: p.color }}>{p.label}</div>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: `${p.color}15`, color: p.color }}>
                    {p.badge}
                  </span>
                </div>
                <div className="text-4xl font-black tabular-nums tracking-tight leading-none" style={{ color: p.color === '#0A1F3D' ? undefined : p.color }}>
                  {p.color === '#0A1F3D' ? (
                    <span className="text-[#0A1F3D] dark:text-[#E2C384]">{formatBRL(p.value)}</span>
                  ) : formatBRL(p.value)}
                </div>
                <div className="text-[11px] text-[#64748B] dark:text-slate-400 font-semibold leading-relaxed mt-2">{p.desc}</div>
              </div>
              
              <div className="text-left md:text-right shrink-0 border-t border-slate-200/65 md:border-t-0 md:pt-0 pt-3 mt-1 md:mt-0 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1.5">
                <div className="text-2xl font-black" style={{ color: p.color === '#0A1F3D' ? undefined : p.color }}>
                  {p.color === '#0A1F3D' ? (
                    <span className="text-[#0A1F3D] dark:text-[#E2C384]">{p.margin}%</span>
                  ) : `${p.margin}%`}
                </div>
                <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Margem Bruta</div>
              </div>
            </div>
          )
        })}

        <Link
          href={"/features/financeiro-tiss" as any}
          className="flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-bold text-sm text-white transition-all shadow-xl shadow-[#0A1F3D]/20 hover:opacity-95 active:scale-[0.98] mt-4"
          style={{ backgroundColor: '#0A1F3D' }}
        >
          <Sparkles className="h-4 w-4 text-[#C5A059] animate-pulse" />
          Gerenciar financeiro da clínica no Estetia
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
