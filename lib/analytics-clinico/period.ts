import { AnalyticsPeriod } from './types'
import { format, subDays, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function parsePeriodFromSearchParams(params: {
  preset?: string
  from?: string
  to?: string
}): AnalyticsPeriod {
  const now = new Date()
  const preset = params.preset as AnalyticsPeriod['preset']

  if (params.from && params.to) {
    return {
      from: new Date(params.from),
      to: new Date(params.to),
      preset: 'custom',
    }
  }

  switch (preset) {
    case '7d':
      return { from: subDays(now, 7), to: now, preset }
    case '90d':
      return { from: subDays(now, 90), to: now, preset }
    case '12m':
      return { from: subMonths(now, 12), to: now, preset }
    case '30d':
    default:
      return { from: subDays(now, 30), to: now, preset: '30d' }
  }
}

export function getPreviousPeriod(p: AnalyticsPeriod): { from: Date; to: Date } {
  const diff = p.to.getTime() - p.from.getTime()
  return {
    from: new Date(p.from.getTime() - diff),
    to: new Date(p.from.getTime()),
  }
}

export function formatPeriodLabel(p: AnalyticsPeriod): string {
  switch (p.preset) {
    case '7d': return 'Últimos 7 dias'
    case '30d': return 'Últimos 30 dias'
    case '90d': return 'Últimos 90 dias'
    case '12m': return 'Últimos 12 meses'
    default:
      return `${format(p.from, 'dd/MM', { locale: ptBR })} a ${format(p.to, 'dd/MM/yyyy', { locale: ptBR })}`
  }
}
