'use client'

import { useState, useMemo, useEffect } from 'react'
import { ModuleCheckboxCard } from './module-checkbox-card'
import { MutexRadioGroup } from './mutex-radio-group'
import { ExtrasSliders } from './extras-sliders'
import { PriceSidebar } from './price-sidebar'
import { calculatePrice, type CalculateResult } from '@/lib/pricing/calculator'
import type { PricingModuleData } from '@/lib/pricing/modules'

interface Props {
  modules: PricingModuleData[]
  initialSelectedSlugs?: string[]
  initialExtras?: { users: number; rooms: number; profs: number }
  initialBilling?: 'MONTHLY' | 'ANNUAL'
  ctaLabel?: string
  ctaHref?: string
  onCta?: (state: BuilderState) => void
  ctaDisabled?: boolean
  mode?: 'signup' | 'dashboard'
  activeModules?: string[]       // currently contracted (dashboard mode) — shows "Ativo" badge
  currentTotalCents?: number     // current monthly total in cents (dashboard mode)
}

export interface BuilderState {
  selectedSlugs: string[]
  extraUsers: number
  extraRooms: number
  extraProfs: number
  billingPeriod: 'MONTHLY' | 'ANNUAL'
  result: CalculateResult
}

const CATEGORY_LABELS: Record<string, string> = {
  CLINICO: 'Módulos Clínicos',
  COMUNICACAO: 'Comunicação',
  GESTAO: 'Gestão & Financeiro',
  IA: 'IA & Automação',
}

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  CLINICO: 'Prontuários, procedimentos, fotos antes/depois e recall automático',
  COMUNICACAO: 'WhatsApp, marketing em massa e bot de Instagram',
  GESTAO: 'Fluxo de caixa, TISS, integração Omie ERP e analytics avançado',
  IA: 'Agentes inteligentes Estetia IA e workflows N8N',
}

export function PricingBuilder({
  modules,
  initialSelectedSlugs = [],
  initialExtras = { users: 0, rooms: 0, profs: 0 },
  initialBilling = 'MONTHLY',
  ctaLabel,
  ctaHref,
  onCta,
  ctaDisabled,
  mode = 'signup',
  activeModules,
  currentTotalCents,
}: Props) {
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialSelectedSlugs)
  const [extraUsers, setExtraUsers] = useState(initialExtras.users)
  const [extraRooms, setExtraRooms] = useState(initialExtras.rooms)
  const [extraProfs, setExtraProfs] = useState(initialExtras.profs)
  const [billingPeriod, setBillingPeriod] = useState<'MONTHLY' | 'ANNUAL'>(initialBilling)

  // Always ensure 'base' is selected
  useEffect(() => {
    if (!selectedSlugs.includes('base')) {
      setSelectedSlugs(prev => Array.from(new Set([...prev, 'base'])))
    }
  }, [selectedSlugs])

  const grouped = useMemo(() => {
    const out: Record<string, PricingModuleData[]> = {}
    for (const m of modules) {
      if (m.category === 'BASE') continue
      if (!out[m.category]) out[m.category] = []
      out[m.category].push(m)
    }
    for (const k of Object.keys(out)) out[k].sort((a, b) => a.ordem - b.ordem)
    return out
  }, [modules])

  const iaOptions = useMemo(
    () => modules.filter(m => m.exclusiveGroup === 'ia_tier').sort((a, b) => a.ordem - b.ordem),
    [modules],
  )
  const iaSlugs = useMemo(() => new Set(iaOptions.map(m => m.slug)), [iaOptions])
  const selectedIaSlug = selectedSlugs.find(s => iaSlugs.has(s)) ?? null
  const n8nModule = useMemo(() => modules.find(m => m.slug === 'n8n'), [modules])

  const result = useMemo(
    () =>
      calculatePrice(
        {
          selectedSlugs,
          extras: { users: extraUsers, rooms: extraRooms, profs: extraProfs },
          billingPeriod,
        },
        modules,
      ),
    [selectedSlugs, extraUsers, extraRooms, extraProfs, billingPeriod, modules],
  )

  const toggle = (slug: string) => {
    setSelectedSlugs(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug],
    )
  }

  const selectIa = (slug: string | null) => {
    setSelectedSlugs(prev => {
      const cleaned = prev.filter(s => !iaSlugs.has(s))
      return slug ? [...cleaned, slug] : cleaned
    })
  }

  const handleCta = () => {
    onCta?.({
      selectedSlugs,
      extraUsers,
      extraRooms,
      extraProfs,
      billingPeriod,
      result,
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
      {/* Left: module selection */}
      <div className="flex flex-col gap-10">
        {['CLINICO', 'COMUNICACAO', 'GESTAO'].map(cat => (
          <section key={cat}>
            <div className="mb-5">
              <h2 className="text-2xl font-bold tracking-tighter">{CATEGORY_LABELS[cat]}</h2>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{CATEGORY_DESCRIPTIONS[cat]}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(grouped[cat] ?? []).map(m => (
                <ModuleCheckboxCard
                  key={m.slug}
                  slug={m.slug}
                  nome={m.nome}
                  descricao={m.descricao}
                  features={m.features}
                  priceCents={m.priceCents}
                  iconLucide={m.iconLucide}
                  selected={selectedSlugs.includes(m.slug)}
                  isActive={activeModules?.includes(m.slug)}
                  onToggle={() => toggle(m.slug)}
                />
              ))}
            </div>
          </section>
        ))}

        {/* IA mutex */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold tracking-tighter">{CATEGORY_LABELS.IA}</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{CATEGORY_DESCRIPTIONS.IA}</p>
          </div>
          <MutexRadioGroup
            groupLabel="Escolha um plano de IA (opcional)"
            options={iaOptions.map(m => ({
              slug: m.slug,
              nome: m.nome,
              descricao: m.descricao,
              features: m.features,
              priceCents: m.priceCents,
              iconLucide: m.iconLucide,
            }))}
            selectedSlug={selectedIaSlug}
            onSelect={selectIa}
          />
          {n8nModule && (
            <div className="mt-4">
              <ModuleCheckboxCard
                slug={n8nModule.slug}
                nome={n8nModule.nome}
                descricao={n8nModule.descricao}
                features={n8nModule.features}
                priceCents={n8nModule.priceCents}
                iconLucide={n8nModule.iconLucide}
                selected={selectedSlugs.includes(n8nModule.slug)}
                isActive={activeModules?.includes(n8nModule.slug)}
                onToggle={() => toggle(n8nModule.slug)}
              />
            </div>
          )}
        </section>

        {/* Extras */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold tracking-tighter">Capacidade</h2>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Ajuste usuários, salas e profissionais conforme o tamanho da sua clínica
            </p>
          </div>
          <ExtrasSliders
            extraUsers={extraUsers}
            extraRooms={extraRooms}
            extraProfs={extraProfs}
            onChange={({ extraUsers, extraRooms, extraProfs }) => {
              setExtraUsers(extraUsers)
              setExtraRooms(extraRooms)
              setExtraProfs(extraProfs)
            }}
          />
        </section>
      </div>

      {/* Right: sticky sidebar */}
      <div>
        <PriceSidebar
          result={result}
          billingPeriod={billingPeriod}
          onBillingChange={setBillingPeriod}
          ctaLabel={ctaLabel}
          ctaHref={ctaHref}
          onCta={onCta ? handleCta : undefined}
          ctaDisabled={ctaDisabled}
          mode={mode}
          currentTotalCents={currentTotalCents}
        />
      </div>
    </div>
  )
}
