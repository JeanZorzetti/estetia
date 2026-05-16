import { prisma } from '@/lib/prisma'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { getPreviousPeriod } from './period'
import type { AnalyticsPeriod } from './types'
import type {
  OverviewKpis,
  KpiDelta,
  RevenueMonthlyPoint,
  TreatmentFunnelPoint,
  ProcedurePoint,
  AcquisitionPoint,
  OrigemPoint,
  DemographicsData,
  TopPatient,
  SessionsStatPoint,
  ProfessionalProductivity,
  AdsSpendPoint,
  MarketingROI,
  ReferralBreakdown,
  LoyaltyTrendPoint,
} from './types'

// Re-export getPreviousPeriod so importers only need queries.ts
export { getPreviousPeriod }

// Safe wrapper — returns default if query fails (empty table / migration gap)
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

function monthLabel(date: Date): string {
  return format(date, 'MMM/yy', { locale: ptBR })
}

function delta(value: number, previousValue: number | null): KpiDelta {
  const deltaPct =
    previousValue !== null && previousValue !== 0
      ? ((value - previousValue) / previousValue) * 100
      : null
  return { value, previousValue, deltaPct }
}

// ============================================================
// OVERVIEW
// ============================================================

export async function getOverviewKpis(orgId: string, period: AnalyticsPeriod): Promise<OverviewKpis> {
  const prev = getPreviousPeriod(period)

  // Pacientes ativos (criados no período)
  const [pacientesCurr, pacientesPrev] = await Promise.all([
    safe(() => prisma.patient.count({ where: { organizationId: orgId, createdAt: { gte: period.from, lte: period.to } } }), 0),
    safe(() => prisma.patient.count({ where: { organizationId: orgId, createdAt: { gte: prev.from, lte: prev.to } } }), 0),
  ])

  // Receita realizada (sum valorTotal dos tratamentos FINALIZADOS no período)
  const [treatCurr, treatPrev] = await Promise.all([
    safe(() => prisma.treatment.findMany({
      where: { organizationId: orgId, dataFim: { gte: period.from, lte: period.to }, status: 'FINALIZADO' },
      select: { valorTotal: true },
    }), []),
    safe(() => prisma.treatment.findMany({
      where: { organizationId: orgId, dataFim: { gte: prev.from, lte: prev.to }, status: 'FINALIZADO' },
      select: { valorTotal: true },
    }), []),
  ])
  const receitaCurr = treatCurr.reduce((s, t) => s + Number(t.valorTotal ?? 0), 0)
  const receitaPrev = treatPrev.reduce((s, t) => s + Number(t.valorTotal ?? 0), 0)

  // Taxa de no-show
  const [sessionsCurr, sessionsPrev] = await Promise.all([
    safe(() => prisma.treatmentSession.findMany({
      where: { organizationId: orgId, dataAgendada: { gte: period.from, lte: period.to } },
      select: { status: true },
    }), []),
    safe(() => prisma.treatmentSession.findMany({
      where: { organizationId: orgId, dataAgendada: { gte: prev.from, lte: prev.to } },
      select: { status: true },
    }), []),
  ])
  const noShowCurr = sessionsCurr.filter(s => s.status === 'NO_SHOW').length
  const noShowPrev = sessionsPrev.filter(s => s.status === 'NO_SHOW').length
  const taxaNoShowCurr = sessionsCurr.length > 0 ? (noShowCurr / sessionsCurr.length) * 100 : 0
  const taxaNoShowPrev = sessionsPrev.length > 0 ? (noShowPrev / sessionsPrev.length) * 100 : 0

  // Ticket médio
  const ticketCurr = treatCurr.length > 0 ? receitaCurr / treatCurr.length : 0
  const ticketPrev = treatPrev.length > 0 ? receitaPrev / treatPrev.length : 0

  return {
    pacientesAtivos: delta(pacientesCurr, pacientesPrev),
    receitaRealizada: delta(receitaCurr, receitaPrev),
    taxaNoShow: delta(taxaNoShowCurr, taxaNoShowPrev > 0 ? taxaNoShowPrev : null),
    ticketMedio: delta(ticketCurr, ticketPrev > 0 ? ticketPrev : null),
  }
}

// ============================================================
// REVENUE — 12 meses rolling
// ============================================================

export async function getRevenueMonthly(orgId: string): Promise<RevenueMonthlyPoint[]> {
  const now = new Date()
  const months: RevenueMonthlyPoint[] = []

  for (let i = 11; i >= 0; i--) {
    const d = subMonths(now, i)
    const from = startOfMonth(d)
    const to = endOfMonth(d)

    const treatments = await safe(() => prisma.treatment.findMany({
      where: { organizationId: orgId, dataFim: { gte: from, lte: to }, status: 'FINALIZADO' },
      select: { valorTotal: true },
    }), [])

    const guias = await safe(() => prisma.guiaTiss.findMany({
      where: { organizationId: orgId, dataExecucao: { gte: from, lte: to } },
      select: { valorTotal: true, status: true },
    }), [])

    const recebido = treatments.reduce((s, t) => s + Number(t.valorTotal ?? 0), 0)
    const glosado = guias.filter(g => g.status === 'GLOSADA').reduce((s, g) => s + Number(g.valorTotal ?? 0), 0)
    const planoTotal = guias.filter(g => g.status !== 'GLOSADA').reduce((s, g) => s + Number(g.valorTotal ?? 0), 0)
    const particular = Math.max(0, recebido - planoTotal)

    months.push({ mes: monthLabel(d), recebido, particular, glosado })
  }

  return months
}

// ============================================================
// TREATMENT FUNNEL
// ============================================================

export async function getTreatmentFunnel(orgId: string, period: AnalyticsPeriod): Promise<TreatmentFunnelPoint[]> {
  const treatments = await safe(() => prisma.treatment.findMany({
    where: { organizationId: orgId, createdAt: { gte: period.from, lte: period.to } },
    select: { status: true, valorTotal: true },
  }), [])

  const map: Record<string, { count: number; value: number }> = {}
  for (const t of treatments) {
    if (!map[t.status]) map[t.status] = { count: 0, value: 0 }
    map[t.status].count++
    map[t.status].value += Number(t.valorTotal ?? 0)
  }

  const statusOrder = ['AVALIACAO', 'ORCAMENTO_ENVIADO', 'AGENDADO', 'EM_ANDAMENTO', 'FINALIZADO', 'RETORNO', 'CANCELADO']
  return statusOrder
    .filter(s => map[s])
    .map(s => ({ status: s, count: map[s].count, value: map[s].value }))
}

// ============================================================
// TOP PROCEDURES
// ============================================================

export async function getTopProcedures(orgId: string, period: AnalyticsPeriod): Promise<ProcedurePoint[]> {
  const treatments = await safe(() => prisma.treatment.findMany({
    where: { organizationId: orgId, createdAt: { gte: period.from, lte: period.to }, procedureId: { not: null } },
    select: { valorTotal: true, procedure: { select: { nome: true } } },
  }), [])

  const map: Record<string, { count: number; receita: number }> = {}
  for (const t of treatments) {
    const nome = t.procedure?.nome ?? 'Outros'
    if (!map[nome]) map[nome] = { count: 0, receita: 0 }
    map[nome].count++
    map[nome].receita += Number(t.valorTotal ?? 0)
  }

  return Object.entries(map)
    .map(([nome, { count, receita }]) => ({ nome, count, receita }))
    .sort((a, b) => b.receita - a.receita)
    .slice(0, 10)
}

// ============================================================
// PATIENTS ACQUISITION (monthly)
// ============================================================

export async function getPatientsAcquisition(orgId: string): Promise<AcquisitionPoint[]> {
  const now = new Date()
  const result: AcquisitionPoint[] = []

  for (let i = 11; i >= 0; i--) {
    const d = subMonths(now, i)
    const from = startOfMonth(d)
    const to = endOfMonth(d)
    const count = await safe(() => prisma.patient.count({ where: { organizationId: orgId, createdAt: { gte: from, lte: to } } }), 0)
    result.push({ mes: monthLabel(d), count })
  }

  return result
}

// ============================================================
// PATIENTS ORIGEM
// ============================================================

export async function getPatientsOrigem(orgId: string, period: AnalyticsPeriod): Promise<OrigemPoint[]> {
  const patients = await safe(() => prisma.patient.findMany({
    where: { organizationId: orgId, createdAt: { gte: period.from, lte: period.to } },
    select: { origem: true },
  }), [])

  const map: Record<string, number> = {}
  for (const p of patients) {
    const k = p.origem ?? 'Não informado'
    map[k] = (map[k] ?? 0) + 1
  }

  return Object.entries(map)
    .map(([origem, count]) => ({ origem, count }))
    .sort((a, b) => b.count - a.count)
}

// ============================================================
// DEMOGRAPHICS
// ============================================================

export async function getDemographics(orgId: string, period: AnalyticsPeriod): Promise<DemographicsData> {
  const patients = await safe(() => prisma.patient.findMany({
    where: { organizationId: orgId, createdAt: { gte: period.from, lte: period.to } },
    select: { sexo: true, dataNascimento: true },
  }), [])

  const sexoMap: Record<string, number> = {}
  const faixaMap: Record<string, number> = {}

  const now = new Date()
  for (const p of patients) {
    const s = p.sexo ?? 'NI'
    sexoMap[s] = (sexoMap[s] ?? 0) + 1

    if (p.dataNascimento) {
      const age = Math.floor((now.getTime() - new Date(p.dataNascimento).getTime()) / (365.25 * 24 * 3600 * 1000))
      let faixa = '60+'
      if (age < 18) faixa = '<18'
      else if (age < 25) faixa = '18-24'
      else if (age < 35) faixa = '25-34'
      else if (age < 45) faixa = '35-44'
      else if (age < 60) faixa = '45-59'
      faixaMap[faixa] = (faixaMap[faixa] ?? 0) + 1
    }
  }

  const sexoLabels: Record<string, string> = { M: 'Masculino', F: 'Feminino', NB: 'Não-binário', NI: 'Não informado' }
  const faixaOrder = ['<18', '18-24', '25-34', '35-44', '45-59', '60+']

  return {
    sexo: Object.entries(sexoMap).map(([k, count]) => ({ label: sexoLabels[k] ?? k, count })),
    faixaEtaria: faixaOrder.filter(f => faixaMap[f]).map(f => ({ label: f, count: faixaMap[f] })),
  }
}

// ============================================================
// TOP PATIENTS
// ============================================================

export async function getTopPatients(orgId: string, period: AnalyticsPeriod): Promise<TopPatient[]> {
  const treatments = await safe(() => prisma.treatment.findMany({
    where: { organizationId: orgId, createdAt: { gte: period.from, lte: period.to } },
    select: {
      valorTotal: true,
      sessoesRealizadas: true,
      paciente: { select: { id: true, nome: true } },
    },
  }), [])

  const map: Record<string, { nome: string; receita: number; sessions: number }> = {}
  for (const t of treatments) {
    const id = t.paciente.id
    if (!map[id]) map[id] = { nome: t.paciente.nome, receita: 0, sessions: 0 }
    map[id].receita += Number(t.valorTotal ?? 0)
    map[id].sessions += t.sessoesRealizadas
  }

  return Object.entries(map)
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.receita - a.receita)
    .slice(0, 10)
}

// ============================================================
// SESSIONS STATS (monthly)
// ============================================================

export async function getSessionsStats(orgId: string): Promise<SessionsStatPoint[]> {
  const now = new Date()
  const result: SessionsStatPoint[] = []

  for (let i = 5; i >= 0; i--) {
    const d = subMonths(now, i)
    const from = startOfMonth(d)
    const to = endOfMonth(d)

    const sessions = await safe(() => prisma.treatmentSession.findMany({
      where: { organizationId: orgId, dataAgendada: { gte: from, lte: to } },
      select: { status: true },
    }), [])

    result.push({
      mes: monthLabel(d),
      agendadas: sessions.length,
      realizadas: sessions.filter(s => s.status === 'REALIZADA').length,
      noShow: sessions.filter(s => s.status === 'NO_SHOW').length,
    })
  }

  return result
}

// ============================================================
// PROFESSIONALS PRODUCTIVITY
// ============================================================

export async function getProfessionalsProductivity(orgId: string, period: AnalyticsPeriod): Promise<ProfessionalProductivity[]> {
  const sessions = await safe(() => prisma.treatmentSession.findMany({
    where: { organizationId: orgId, dataAgendada: { gte: period.from, lte: period.to }, profissionalId: { not: null } },
    select: {
      status: true,
      profissional: { select: { nome: true } },
      treatment: { select: { valorTotal: true } },
    },
  }), [])

  const map: Record<string, { sessoes: number; realizadas: number; receita: number }> = {}
  for (const s of sessions) {
    const nome = s.profissional?.nome ?? 'Sem profissional'
    if (!map[nome]) map[nome] = { sessoes: 0, realizadas: 0, receita: 0 }
    map[nome].sessoes++
    if (s.status === 'REALIZADA') {
      map[nome].realizadas++
      map[nome].receita += Number(s.treatment?.valorTotal ?? 0)
    }
  }

  return Object.entries(map)
    .map(([nome, v]) => ({
      nome,
      sessoes: v.sessoes,
      receita: v.receita,
      ocupacaoPct: v.sessoes > 0 ? Math.round((v.realizadas / v.sessoes) * 100) : 0,
    }))
    .sort((a, b) => b.receita - a.receita)
}

// ============================================================
// ADS SPEND (monthly)
// ============================================================

export async function getAdsSpend(orgId: string): Promise<AdsSpendPoint[]> {
  const now = new Date()
  const result: AdsSpendPoint[] = []

  for (let i = 5; i >= 0; i--) {
    const d = subMonths(now, i)
    const from = startOfMonth(d)
    const to = endOfMonth(d)

    const metrics = await safe(() => prisma.adsMetric.findMany({
      where: { organizationId: orgId, date: { gte: from, lte: to } },
      select: { source: true, spend: true },
    }), [])

    const google = metrics.filter(m => m.source === 'google_ads').reduce((s, m) => s + Number(m.spend), 0)
    const meta = metrics.filter(m => m.source === 'facebook_ads').reduce((s, m) => s + Number(m.spend), 0)

    result.push({ mes: monthLabel(d), google, meta })
  }

  return result
}

// ============================================================
// MARKETING ROI
// ============================================================

export async function getMarketingROI(orgId: string, period: AnalyticsPeriod): Promise<MarketingROI> {
  const [metrics, referrals] = await Promise.all([
    safe(() => prisma.adsMetric.findMany({
      where: { organizationId: orgId, date: { gte: period.from, lte: period.to } },
      select: { spend: true, conversions: true },
    }), []),
    safe(() => prisma.patientReferral.count({ where: { organizationId: orgId, createdAt: { gte: period.from, lte: period.to }, status: 'CONVERTIDO' } }), 0),
  ])

  const spend = metrics.reduce((s, m) => s + Number(m.spend), 0)
  const conversions = metrics.reduce((s, m) => s + m.conversions, 0) + referrals
  const leads = conversions // simplification
  const cac = conversions > 0 ? spend / conversions : 0

  // ROI = (receita atribuída - spend) / spend * 100 — sem dados de atribuição, use proxy
  const roi = spend > 0 ? ((conversions * 500 - spend) / spend) * 100 : 0 // R$500 proxy LTV

  return { spend, leads, cac, conversions, roi }
}

// ============================================================
// REFERRAL BREAKDOWN
// ============================================================

export async function getReferralBreakdown(orgId: string, period: AnalyticsPeriod): Promise<ReferralBreakdown[]> {
  const referrals = await safe(() => prisma.patientReferral.findMany({
    where: { organizationId: orgId, createdAt: { gte: period.from, lte: period.to } },
    select: { status: true },
  }), [])

  const map: Record<string, number> = {}
  for (const r of referrals) {
    map[r.status] = (map[r.status] ?? 0) + 1
  }

  return Object.entries(map).map(([status, count]) => ({ status, count }))
}

// ============================================================
// LOYALTY TREND (monthly)
// ============================================================

export async function getLoyaltyTrend(orgId: string): Promise<LoyaltyTrendPoint[]> {
  const now = new Date()
  const result: LoyaltyTrendPoint[] = []

  for (let i = 5; i >= 0; i--) {
    const d = subMonths(now, i)
    const from = startOfMonth(d)
    const to = endOfMonth(d)

    const txs = await safe(() => prisma.loyaltyTransaction.findMany({
      where: { organizationId: orgId, createdAt: { gte: from, lte: to } },
      select: { tipo: true, pontos: true },
    }), [])

    result.push({
      mes: monthLabel(d),
      ganhos: txs.filter(t => t.tipo === 'GANHO').reduce((s, t) => s + t.pontos, 0),
      resgates: txs.filter(t => t.tipo === 'RESGATE').reduce((s, t) => s + t.pontos, 0),
    })
  }

  return result
}
