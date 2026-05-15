import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function getOrgId() {
  const session = await getSession()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}

function csvEscape(v: unknown): string {
  if (v == null) return ''
  const s = String(v)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export async function GET(req: Request) {
  const orgId = await getOrgId()
  if (!orgId) return new Response('Unauthorized', { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const operadoraId = searchParams.get('operadoraId')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const where: Record<string, unknown> = { organizationId: orgId }
  if (status) where.status = status
  if (operadoraId) where.operadoraId = operadoraId
  if (from || to) {
    where.dataExecucao = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    }
  }

  const guias = await prisma.guiaTiss.findMany({
    where,
    include: {
      operadora: { select: { nome: true } },
      paciente: { select: { nome: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 5000,
  })

  const headers = ['Número', 'Data Execução', 'Paciente', 'Operadora', 'Tipo', 'TUSS', 'Valor', 'Status', 'Criada em']
  const rows = guias.map(g => [
    g.numeroGuia ?? g.id.slice(0, 8),
    g.dataExecucao ? g.dataExecucao.toLocaleDateString('pt-BR') : '',
    g.paciente.nome,
    g.operadora.nome,
    g.tipo,
    g.codigoTuss ?? '',
    g.valorTotal != null ? Number(g.valorTotal).toFixed(2).replace('.', ',') : '0,00',
    g.status,
    g.createdAt.toLocaleDateString('pt-BR'),
  ])

  const csv = [
    headers.join(','),
    ...rows.map(r => r.map(csvEscape).join(',')),
  ].join('\n')

  // BOM for Excel BR (correct accent handling)
  const bom = '﻿'
  return new Response(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="financeiro-${Date.now()}.csv"`,
    },
  })
}
