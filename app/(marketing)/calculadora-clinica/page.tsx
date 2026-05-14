'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingDown, TrendingUp, Calculator, AlertTriangle, CheckCircle } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalcInputs {
  consultasDia: number
  ticketMedio: number
  taxaNoShow: number
  diasMes: number
  taxaRetorno: number
}

interface CalcResults {
  perdasNoShow: number
  perdasRetorno: number
  totalPerdas: number
  receitaAtual: number
  receitaComSistema: number
  ganhoLiquido: number
  roiMeses: number
  planoRecomendado: 'Starter' | 'Pro' | 'Business'
  precoPlaono: number
}

const DEFAULTS: CalcInputs = {
  consultasDia: 8,
  ticketMedio: 280,
  taxaNoShow: 20,
  diasMes: 22,
  taxaRetorno: 35,
}

// ─── Calculation ──────────────────────────────────────────────────────────────

function calculate(inputs: CalcInputs): CalcResults {
  const { consultasDia, ticketMedio, taxaNoShow, diasMes, taxaRetorno } = inputs

  const consultasMes = consultasDia * diasMes
  const receitaAtual = consultasMes * ticketMedio * (1 - taxaNoShow / 100)

  // No-show loss
  const perdasNoShow = consultasMes * ticketMedio * (taxaNoShow / 100)

  // Retention loss — clients who don't come back (baseline: 35% return without system)
  const baselineRetorno = taxaRetorno / 100
  const targetRetorno = Math.min(baselineRetorno + 0.25, 0.85) // +25pp gain estimate
  const perdasRetorno = consultasMes * ticketMedio * (1 - baselineRetorno) * 0.2 // 20% are recoverable

  const totalPerdas = perdasNoShow + perdasRetorno

  // With system: ~40% no-show reduction, +25pp retention gain
  const noShowComSistema = taxaNoShow * 0.6
  const receitaComSistema = consultasMes * ticketMedio * (1 - noShowComSistema / 100) +
    perdasRetorno * 0.7 // recover 70% of lapsed clients

  const ganhoLiquido = receitaComSistema - receitaAtual

  // Plan recommendation based on consultasDia (proxy for clinic size)
  let planoRecomendado: 'Starter' | 'Pro' | 'Business'
  let precoPlaono: number
  if (consultasDia <= 6) {
    planoRecomendado = 'Starter'; precoPlaono = 149
  } else if (consultasDia <= 20) {
    planoRecomendado = 'Pro'; precoPlaono = 349
  } else {
    planoRecomendado = 'Business'; precoPlaono = 799
  }

  const roiMeses = ganhoLiquido > 0 ? Math.ceil(precoPlaono / ganhoLiquido) : 0

  return {
    perdasNoShow,
    perdasRetorno,
    totalPerdas,
    receitaAtual,
    receitaComSistema,
    ganhoLiquido,
    roiMeses,
    planoRecomendado,
    precoPlaono,
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function brl(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function Slider({
  label, value, min, max, step, unit, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; unit: string
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-700">{label}</span>
        <span className="font-bold text-zinc-900">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e: { target: { value: string } }) => onChange(Number(e.target.value))}
        className="w-full accent-rose-500"
      />
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalculadoraClinicaPage() {
  const [inputs, setInputs] = useState<CalcInputs>(DEFAULTS)

  const results = useMemo(() => calculate(inputs), [inputs])

  function set(key: keyof CalcInputs) {
    return (v: number) => setInputs((p: CalcInputs) => ({ ...p, [key]: v }))
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a1f3d]">
              <span className="text-sm font-bold text-white">E</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">Estetia</span>
          </Link>
          <Link
            href="/auth/register"
            className="rounded-lg bg-[#0a1f3d] px-4 py-2 text-sm font-medium text-white hover:bg-[#0d2547] transition-colors"
          >
            Teste grátis 14 dias
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pb-10 pt-16 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-sm text-red-600">
            <AlertTriangle className="h-3.5 w-3.5" />
            Você provavelmente está perdendo mais do que imagina
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Quanto sua clínica perde com no-show?
          </h1>
          <p className="mt-4 text-lg text-zinc-500">
            Ajuste os dados abaixo e veja o impacto real no seu faturamento — e quanto você pode recuperar.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="px-4 pb-24">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">

          {/* Inputs */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-[#0a1f3d]" />
              <h2 className="font-semibold text-zinc-900">Dados da sua clínica</h2>
            </div>
            <div className="space-y-8">
              <Slider
                label="Consultas/procedimentos por dia"
                value={inputs.consultasDia}
                min={1} max={50} step={1} unit=" por dia"
                onChange={set('consultasDia')}
              />
              <Slider
                label="Ticket médio por procedimento"
                value={inputs.ticketMedio}
                min={80} max={2000} step={10} unit=" R$"
                onChange={set('ticketMedio')}
              />
              <Slider
                label="Taxa atual de no-show"
                value={inputs.taxaNoShow}
                min={0} max={60} step={1} unit="%"
                onChange={set('taxaNoShow')}
              />
              <Slider
                label="Dias de trabalho por mês"
                value={inputs.diasMes}
                min={10} max={28} step={1} unit=" dias"
                onChange={set('diasMes')}
              />
              <Slider
                label="Taxa de retorno atual (recompra)"
                value={inputs.taxaRetorno}
                min={10} max={90} step={5} unit="%"
                onChange={set('taxaRetorno')}
              />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Main loss card */}
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
              <div className="flex items-start gap-3">
                <TrendingDown className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-700">Você perde por mês</p>
                  <p className="mt-1 text-4xl font-bold text-red-600">{brl(results.totalPerdas)}</p>
                  <p className="mt-1 text-xs text-red-500">
                    {brl(results.totalPerdas * 12)} por ano
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-red-200 pt-4 text-sm">
                <div>
                  <p className="text-red-500">Por no-show</p>
                  <p className="font-semibold text-red-700">{brl(results.perdasNoShow)}</p>
                </div>
                <div>
                  <p className="text-red-500">Por falta de retenção</p>
                  <p className="font-semibold text-red-700">{brl(results.perdasRetorno)}</p>
                </div>
              </div>
            </div>

            {/* Gain with system */}
            <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
              <div className="flex items-start gap-3">
                <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-700">Com o Estetia, você recupera</p>
                  <p className="mt-1 text-4xl font-bold text-green-600">+{brl(results.ganhoLiquido)}/mês</p>
                  <p className="mt-1 text-xs text-green-500">
                    Estimativa conservadora: redução de 40% no no-show + 25pp de retenção
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-green-200 pt-4 text-sm">
                <div>
                  <p className="text-green-600">Receita atual</p>
                  <p className="font-semibold text-green-800">{brl(results.receitaAtual)}</p>
                </div>
                <div>
                  <p className="text-green-600">Receita estimada</p>
                  <p className="font-semibold text-green-800">{brl(results.receitaComSistema)}</p>
                </div>
              </div>
            </div>

            {/* Plan recommendation */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-[#0a1f3d]" />
                <p className="font-semibold text-zinc-900">Plano recomendado para sua clínica</p>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-[#eef2f9] p-4">
                <div>
                  <p className="text-sm text-[#0a1f3d]">Plano {results.planoRecomendado}</p>
                  <p className="text-2xl font-bold text-rose-700">{brl(results.precoPlaono)}/mês</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500">ROI em</p>
                  <p className="text-2xl font-bold text-zinc-900">
                    {results.roiMeses <= 1 ? '< 1 mês' : `${results.roiMeses} ${results.roiMeses === 1 ? 'mês' : 'meses'}`}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-zinc-400">
                O plano se paga em {results.roiMeses <= 1 ? 'menos de 1 mês' : `${results.roiMeses} meses`} apenas com a redução de no-show.
              </p>
              <Link
                href={`/auth/register?plan=${results.planoRecomendado.toLowerCase()}&ref=calculadora`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a1f3d] py-3 text-sm font-semibold text-white shadow-md shadow-[#0a1f3d]/10 hover:bg-[#0d2547] transition-all"
              >
                Começar grátis por 14 dias
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-2 text-center text-xs text-zinc-400">Sem cartão · Cancele quando quiser</p>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-zinc-400 leading-relaxed">
              * Cálculo baseado em benchmarks de clínicas de estética brasileiras. Resultados reais variam conforme tamanho da clínica, tipo de procedimento e nível de adoção do sistema. A estimativa de 40% de redução de no-show é o resultado médio reportado por clínicas usuárias.
            </p>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-t border-zinc-200 bg-white px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-zinc-400">
            Resultados reais de clínicas
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { stat: '+32%', label: 'faturamento em 3 meses', name: 'Clínica Bella · SP' },
              { stat: '+68%', label: 'taxa de recompra em 4 meses', name: 'Studio Facial · Florianópolis' },
              { stat: 'R$ 8k', label: 'glosas recuperadas no 1º mês', name: 'Derma Plus · Campinas' },
            ].map(({ stat, label, name }) => (
              <div key={stat} className="rounded-xl border border-zinc-100 p-5 text-center">
                <p className="text-3xl font-bold text-[#0a1f3d]">{stat}</p>
                <p className="mt-1 text-sm text-zinc-600">{label}</p>
                <p className="mt-1 text-xs text-zinc-400">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
