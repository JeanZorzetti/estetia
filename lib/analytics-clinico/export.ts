import type {
  RevenueMonthlyPoint,
  TreatmentFunnelPoint,
  ProcedurePoint,
  TopPatient,
  SessionsStatPoint,
  ProfessionalProductivity,
} from './types'

function csvEscape(v: unknown): string {
  if (v == null) return ''
  const s = String(v)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function buildCsv(headers: string[], rows: (string | number)[][]): string {
  const lines = [
    headers.join(','),
    ...rows.map(r => r.map(csvEscape).join(',')),
  ]
  return lines.join('\n')
}

function csvResponse(csv: string, filename: string): Response {
  const bom = '﻿'
  return new Response(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}-${Date.now()}.csv"`,
    },
  })
}

export function exportRevenueToCsv(data: RevenueMonthlyPoint[]): Response {
  const headers = ['Mês', 'Recebido (R$)', 'Particular (R$)', 'Glosado (R$)']
  const rows = data.map(d => [d.mes, d.recebido.toFixed(2), d.particular.toFixed(2), d.glosado.toFixed(2)])
  return csvResponse(buildCsv(headers, rows), 'receita-mensal')
}

export function exportFunnelToCsv(data: TreatmentFunnelPoint[]): Response {
  const headers = ['Status', 'Quantidade', 'Valor Total (R$)']
  const rows = data.map(d => [d.status, d.count, d.value.toFixed(2)])
  return csvResponse(buildCsv(headers, rows), 'funil-tratamentos')
}

export function exportProceduresToCsv(data: ProcedurePoint[]): Response {
  const headers = ['Procedimento', 'Quantidade', 'Receita (R$)']
  const rows = data.map(d => [d.nome, d.count, d.receita.toFixed(2)])
  return csvResponse(buildCsv(headers, rows), 'procedimentos')
}

export function exportTopPatientsToCsv(data: TopPatient[]): Response {
  const headers = ['Paciente', 'Receita (R$)', 'Sessões']
  const rows = data.map(d => [d.nome, d.receita.toFixed(2), d.sessions])
  return csvResponse(buildCsv(headers, rows), 'top-pacientes')
}

export function exportSessionsToCsv(data: SessionsStatPoint[]): Response {
  const headers = ['Mês', 'Agendadas', 'Realizadas', 'No-Show']
  const rows = data.map(d => [d.mes, d.agendadas, d.realizadas, d.noShow])
  return csvResponse(buildCsv(headers, rows), 'sessoes')
}

export function exportProfessionalsToCsv(data: ProfessionalProductivity[]): Response {
  const headers = ['Profissional', 'Sessões', 'Receita (R$)', 'Ocupação (%)']
  const rows = data.map(d => [d.nome, d.sessoes, d.receita.toFixed(2), d.ocupacaoPct])
  return csvResponse(buildCsv(headers, rows), 'produtividade-profissionais')
}
