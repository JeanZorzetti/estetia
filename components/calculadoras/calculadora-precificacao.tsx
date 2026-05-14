'use client'

import { useState, useMemo } from 'react'
import { ArrowRight, DollarSign, AlertCircle, Info } from 'lucide-react'
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
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#0A1F3D]">{label}</label>
        {hint && (
          <span className="text-[10px] text-[#94A3B8] flex items-center gap-0.5">
            <Info className="h-3 w-3" />{hint}
          </span>
        )}
      </div>
      <div className="relative">
        {unit === 'R$' && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#94A3B8]">R$</span>
        )}
        <input
          type="number" min={min} value={value}
          onChange={(e) => onChange(Math.max(min, Number(e.target.value)))}
          className={`w-full rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#0A1F3D] focus:outline-none focus:border-[#0A1F3D]/30 focus:ring-1 focus:ring-[#0A1F3D]/20 transition-all ${unit === 'R$' ? 'pl-9' : ''}`}
        />
        {unit !== 'R$' && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#94A3B8]">{unit}</span>
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
    { label: 'Preço mínimo', value: result.precoMinimo, margin: 20, color: '#E05A4E', desc: 'Cobre custos com margem de 20%. Abaixo disso é prejuízo.' },
    { label: 'Preço sugerido', value: result.precoSugerido, margin: margemPct, color: ACCENT, desc: `Margem de ${margemPct}% — equilibrio entre competitividade e rentabilidade.` },
    { label: 'Preço premium', value: result.precoPremium, margin: result.margemPremium, color: '#C5A059', desc: 'Posicionamento de excelência. Para procedimentos diferenciados.' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      {/* Inputs — 2/5 */}
      <div className="lg:col-span-2 rounded-2xl border border-[#0A1F3D]/10 bg-white p-6 shadow-sm space-y-5">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F3D] mb-1">Dados do procedimento</h3>
          <p className="text-xs text-[#64748B] mb-3">Ou escolha um template rápido:</p>
          <div className="flex flex-wrap gap-1.5">
            {PROCEDURE_TEMPLATES.map((t, i) => (
              <button
                key={t.label}
                onClick={() => applyTemplate(i)}
                className="rounded-lg border border-[#E2E8F0] px-2.5 py-1 text-[11px] font-medium text-[#64748B] hover:border-[#0A1F3D]/30 hover:text-[#0A1F3D] transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <NumberInput label="Custo de insumos" value={insumos} min={0} unit="R$" hint="por sessão" onChange={setInsumos} />
        <NumberInput label="Tempo de execução" value={tempoMin} min={5} unit="min" onChange={setTempoMin} />
        <NumberInput label="Custo/hora do profissional" value={custoHora} min={0} unit="R$/h" onChange={setCustoHora} />
        <NumberInput label="Custo fixo rateado" value={custoFixo} min={0} unit="R$" hint="aluguel, água, energia..." onChange={setCustoFixo} />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[#0A1F3D]">Margem desejada</label>
            <span className="text-sm font-bold text-[#0A1F3D]">{margemPct}%</span>
          </div>
          <div className="flex gap-1.5">
            {MARGIN_PRESETS.map((p) => (
              <button
                key={p.value}
                onClick={() => setMargemPct(p.value)}
                className={`flex-1 rounded-lg py-1.5 text-[11px] font-semibold transition-colors ${margemPct === p.value ? 'bg-[#0A1F3D] text-white' : 'border border-[#E2E8F0] text-[#64748B] hover:border-[#0A1F3D]/30'}`}
              >
                {p.value}%
              </button>
            ))}
          </div>
        </div>

        {/* Custo total breakdown */}
        <div className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 text-xs space-y-1.5">
          <div className="font-semibold text-[#0A1F3D] mb-1">Breakdown de custos</div>
          <div className="flex justify-between text-[#64748B]">
            <span>Insumos</span><span>{formatBRL(insumos)}</span>
          </div>
          <div className="flex justify-between text-[#64748B]">
            <span>Tempo ({tempoMin}min)</span><span>{formatBRL(result.custoTempo)}</span>
          </div>
          <div className="flex justify-between text-[#64748B]">
            <span>Custos fixos</span><span>{formatBRL(custoFixo)}</span>
          </div>
          <div className="flex justify-between font-bold text-[#0A1F3D] border-t border-[#E2E8F0] pt-1.5">
            <span>Custo total</span><span>{formatBRL(result.custoTotal)}</span>
          </div>
        </div>
      </div>

      {/* Results — 3/5 */}
      <div className="lg:col-span-3 space-y-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0A1F3D] mb-1">Seus 3 preços de referência</h3>
          <p className="text-xs text-[#94A3B8] flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Estimativa. Valide com os preços praticados no seu mercado local.
          </p>
        </div>

        {prices.map((p) => (
          <div
            key={p.label}
            className="rounded-2xl border p-5 flex items-center gap-5"
            style={{ borderColor: `${p.color}30`, backgroundColor: `${p.color}06` }}
          >
            <div className="h-12 w-12 shrink-0 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${p.color}15` }}>
              <DollarSign className="h-5 w-5" style={{ color: p.color }} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: p.color }}>{p.label}</div>
              <div className="text-3xl font-bold tabular-nums" style={{ color: p.color }}>{formatBRL(p.value)}</div>
              <div className="text-[10px] text-[#64748B] mt-0.5">{p.desc}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold" style={{ color: p.color }}>{p.margin}%</div>
              <div className="text-[10px] text-[#94A3B8]">margem</div>
            </div>
          </div>
        ))}

        <Link
          href={"/features/financeiro-tiss" as any}
          className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 font-bold text-sm text-white transition-opacity hover:opacity-90 mt-2"
          style={{ backgroundColor: ACCENT }}
        >
          Gerenciar financeiro da clínica
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
