export type AnalyticsPeriod = {
  from: Date
  to: Date
  preset?: '7d' | '30d' | '90d' | '12m' | 'custom'
}

export type KpiDelta = {
  value: number
  previousValue: number | null
  deltaPct: number | null
}

export type RevenueMonthlyPoint = {
  mes: string // "Jan/25"
  recebido: number
  particular: number
  glosado: number
}

export type TreatmentFunnelPoint = {
  status: string
  count: number
  value: number
}

export type ProcedurePoint = {
  nome: string
  count: number
  receita: number
}

export type AcquisitionPoint = {
  mes: string
  count: number
}

export type OrigemPoint = {
  origem: string
  count: number
}

export type DemographicsData = {
  sexo: { label: string; count: number }[]
  faixaEtaria: { label: string; count: number }[]
}

export type TopPatient = {
  id: string
  nome: string
  receita: number
  sessions: number
}

export type SessionsStatPoint = {
  mes: string
  agendadas: number
  realizadas: number
  noShow: number
}

export type ProfessionalProductivity = {
  nome: string
  sessoes: number
  receita: number
  ocupacaoPct: number
}

export type AdsSpendPoint = {
  mes: string
  google: number
  meta: number
}

export type MarketingROI = {
  spend: number
  leads: number
  cac: number
  conversions: number
  roi: number
}

export type ReferralBreakdown = {
  status: string
  count: number
}

export type LoyaltyTrendPoint = {
  mes: string
  ganhos: number
  resgates: number
}

export type OverviewKpis = {
  pacientesAtivos: KpiDelta
  receitaRealizada: KpiDelta
  taxaNoShow: KpiDelta
  ticketMedio: KpiDelta
}
