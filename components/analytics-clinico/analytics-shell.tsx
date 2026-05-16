'use client'

import { useState, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { PeriodSelector } from './period-selector'
import { ExportButtons } from './export-buttons'
import { OverviewTab } from './tabs/overview-tab'
import { PatientsTab } from './tabs/patients-tab'
import { TreatmentsTab } from './tabs/treatments-tab'
import { ProfessionalsTab } from './tabs/professionals-tab'
import { MarketingTab } from './tabs/marketing-tab'
import type {
  OverviewKpis,
  RevenueMonthlyPoint,
  SessionsStatPoint,
  TopPatient,
  TreatmentFunnelPoint,
  ProcedurePoint,
  AcquisitionPoint,
  OrigemPoint,
  DemographicsData,
  ProfessionalProductivity,
  AdsSpendPoint,
  MarketingROI,
  ReferralBreakdown,
  LoyaltyTrendPoint,
} from '@/lib/analytics-clinico/types'
import { useSearchParams } from 'next/navigation'

interface InitialData {
  kpis: OverviewKpis
  sessions: SessionsStatPoint[]
  topPatients: TopPatient[]
  revenue: RevenueMonthlyPoint[]
}

interface AnalyticsShellProps {
  initialData: InitialData
  initialTab?: string
  currentPreset?: string
}

function TabSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
      <Skeleton className="h-72 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  )
}

export function AnalyticsShell({ initialData, initialTab = 'overview', currentPreset = '30d' }: AnalyticsShellProps) {
  const searchParams = useSearchParams()
  const preset = searchParams.get('preset') ?? currentPreset
  const fromParam = searchParams.get('from') ?? undefined
  const toParam = searchParams.get('to') ?? undefined

  function buildQuery() {
    const p = new URLSearchParams()
    p.set('preset', preset)
    if (fromParam) p.set('from', fromParam)
    if (toParam) p.set('to', toParam)
    return p.toString()
  }

  // Lazy tab data state
  const [patientsData, setPatientsData] = useState<{
    acquisition: AcquisitionPoint[]
    origem: OrigemPoint[]
    demographics: DemographicsData
    topPatients: TopPatient[]
  } | null>(null)

  const [treatmentsData, setTreatmentsData] = useState<{
    funnel: TreatmentFunnelPoint[]
    procedures: ProcedurePoint[]
  } | null>(null)

  const [professionalsData, setProfessionalsData] = useState<ProfessionalProductivity[] | null>(null)

  const [marketingData, setMarketingData] = useState<{
    adsSpend: AdsSpendPoint[]
    roi: MarketingROI
    referrals: ReferralBreakdown[]
    loyalty: LoyaltyTrendPoint[]
  } | null>(null)

  const [loadingTab, setLoadingTab] = useState<string | null>(null)

  const handleTabChange = useCallback(async (tab: string) => {
    const q = buildQuery()

    if (tab === 'patients' && !patientsData) {
      setLoadingTab('patients')
      try {
        const res = await fetch(`/api/analytics-clinico/patients?${q}`)
        if (res.ok) {
          const json = await res.json()
          setPatientsData(json)
        }
      } finally {
        setLoadingTab(null)
      }
    }

    if (tab === 'treatments' && !treatmentsData) {
      setLoadingTab('treatments')
      try {
        const res = await fetch(`/api/analytics-clinico/treatments?${q}`)
        if (res.ok) {
          const json = await res.json()
          setTreatmentsData(json)
        }
      } finally {
        setLoadingTab(null)
      }
    }

    if (tab === 'professionals' && !professionalsData) {
      setLoadingTab('professionals')
      try {
        const res = await fetch(`/api/analytics-clinico/professionals?${q}`)
        if (res.ok) {
          const json = await res.json()
          setProfessionalsData(json.data)
        }
      } finally {
        setLoadingTab(null)
      }
    }

    if (tab === 'marketing' && !marketingData) {
      setLoadingTab('marketing')
      try {
        const [mktRes, loyaltyRes] = await Promise.all([
          fetch(`/api/analytics-clinico/marketing?${q}`),
          fetch(`/api/analytics-clinico/loyalty?${q}`),
        ])
        if (mktRes.ok && loyaltyRes.ok) {
          const mkt = await mktRes.json()
          const loyalty = await loyaltyRes.json()
          setMarketingData({ ...mkt, loyalty: loyalty.data })
        }
      } finally {
        setLoadingTab(null)
      }
    }
  }, [patientsData, treatmentsData, professionalsData, marketingData, preset, fromParam, toParam])

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-3 no-print">
        <PeriodSelector currentPreset={preset} />
        <div className="ml-auto">
          <ExportButtons />
        </div>
      </div>

      {/* Print header */}
      <div className="print-header">
        <h1 className="text-2xl font-bold">Analytics Clínico — Estetia CRM</h1>
        <p className="text-sm text-muted-foreground">Período: {preset}</p>
      </div>

      <Tabs defaultValue={initialTab} onValueChange={handleTabChange}>
        <TabsList className="no-print">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="patients">Pacientes</TabsTrigger>
          <TabsTrigger value="treatments">Tratamentos</TabsTrigger>
          <TabsTrigger value="professionals">Profissionais</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab
            kpis={initialData.kpis}
            sessions={initialData.sessions}
            topPatients={initialData.topPatients}
            revenue={initialData.revenue}
          />
        </TabsContent>

        <TabsContent value="patients" className="mt-6">
          {loadingTab === 'patients' && <TabSkeleton />}
          {!loadingTab && patientsData && (
            <PatientsTab
              acquisition={patientsData.acquisition}
              origem={patientsData.origem}
              demographics={patientsData.demographics}
              topPatients={patientsData.topPatients}
            />
          )}
          {!loadingTab && !patientsData && (
            <div className="py-12 text-center text-muted-foreground text-sm">Selecione esta aba para carregar os dados.</div>
          )}
        </TabsContent>

        <TabsContent value="treatments" className="mt-6">
          {loadingTab === 'treatments' && <TabSkeleton />}
          {!loadingTab && treatmentsData && (
            <TreatmentsTab
              funnel={treatmentsData.funnel}
              procedures={treatmentsData.procedures}
            />
          )}
          {!loadingTab && !treatmentsData && (
            <div className="py-12 text-center text-muted-foreground text-sm">Selecione esta aba para carregar os dados.</div>
          )}
        </TabsContent>

        <TabsContent value="professionals" className="mt-6">
          {loadingTab === 'professionals' && <TabSkeleton />}
          {!loadingTab && professionalsData && (
            <ProfessionalsTab data={professionalsData} />
          )}
          {!loadingTab && !professionalsData && (
            <div className="py-12 text-center text-muted-foreground text-sm">Selecione esta aba para carregar os dados.</div>
          )}
        </TabsContent>

        <TabsContent value="marketing" className="mt-6">
          {loadingTab === 'marketing' && <TabSkeleton />}
          {!loadingTab && marketingData && (
            <MarketingTab
              adsSpend={marketingData.adsSpend}
              roi={marketingData.roi}
              referrals={marketingData.referrals}
              loyalty={marketingData.loyalty}
            />
          )}
          {!loadingTab && !marketingData && (
            <div className="py-12 text-center text-muted-foreground text-sm">Selecione esta aba para carregar os dados.</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
