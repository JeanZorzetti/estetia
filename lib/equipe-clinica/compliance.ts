import { prisma } from '@/lib/prisma'

export interface ComplianceKpis {
  total: number
  ativos: number
  pendentes: number
  inativos: number
  semCfm: number
  ultimaValidacao: Date | null
  taxaOk: number // percentage 0-100
}

export async function getComplianceKpis(orgId: string): Promise<ComplianceKpis> {
  const profs = await prisma.professional.findMany({
    where: { organizationId: orgId, ativo: true },
    select: {
      conselho: true,
      conselhoStatus: true,
      conselhoValidadoEm: true,
    },
  })

  const total = profs.length
  const ativos = profs.filter(p => p.conselhoStatus === 'ativo').length
  const pendentes = profs.filter(
    p => p.conselhoStatus === 'pendente' || p.conselhoStatus === 'pendente_manual'
  ).length
  const inativos = profs.filter(p =>
    ['inativo', 'suspenso', 'cancelado'].includes(p.conselhoStatus ?? '')
  ).length
  const semCfm = profs.filter(p => !p.conselho).length
  const ultimaValidacao = profs.reduce<Date | null>((max, p) => {
    if (!p.conselhoValidadoEm) return max
    return !max || p.conselhoValidadoEm > max ? p.conselhoValidadoEm : max
  }, null)
  const comCfm = total - semCfm
  const taxaOk = comCfm > 0 ? Math.round((ativos / comCfm) * 100) : 0

  return { total, ativos, pendentes, inativos, semCfm, ultimaValidacao, taxaOk }
}
