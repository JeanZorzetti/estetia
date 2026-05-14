import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ProceduresTable } from '@/components/procedimentos/procedures-table'
import { ProceduresKpis } from '@/components/procedimentos/procedures-kpis'

export const dynamic = 'force-dynamic'

const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

export default async function ProcedimentosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>
}) {
  const { q = '', categoria = '' } = await searchParams

  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user

  const where = {
    organizationId,
    ...(q && { nome: { contains: q, mode: 'insensitive' as const } }),
    ...(categoria && { categoria }),
  }

  const [procedures, kpiCounts] = await Promise.all([
    prisma.procedure.findMany({
      where,
      select: {
        id: true,
        nome: true,
        categoria: true,
        duracaoMinutos: true,
        valorPadrao: true,
        profissionaisHabilitadosIds: true,
        ativo: true,
      },
      orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
    }),
    prisma.procedure.groupBy({
      by: ['categoria', 'ativo'],
      where: { organizationId, ativo: true },
      _count: { id: true },
    }),
  ])

  const kpis = {
    totalAtivos: kpiCounts.reduce((sum, g) => sum + g._count.id, 0),
    faciais: kpiCounts.filter(g => g.categoria === 'facial').reduce((s, g) => s + g._count.id, 0),
    corporais: kpiCounts.filter(g => g.categoria === 'corporal').reduce((s, g) => s + g._count.id, 0),
    capilares: kpiCounts.filter(g => g.categoria === 'capilar').reduce((s, g) => s + g._count.id, 0),
    outros: kpiCounts.filter(g => !g.categoria || g.categoria === 'outros').reduce((s, g) => s + g._count.id, 0),
  }

  const serializedProcedures = procedures.map(p => ({
    ...p,
    valorPadrao: p.valorPadrao != null ? Number(p.valorPadrao) : null,
  }))

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Procedimentos</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Catálogo da clínica · {kpis.totalAtivos} ativo{kpis.totalAtivos !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/procedimentos/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Novo Procedimento
        </Link>
      </div>

      {/* KPIs */}
      <ProceduresKpis kpis={kpis} />

      {/* Table */}
      <ProceduresTable
        initialProcedures={serialize(serializedProcedures)}
        initialQuery={q}
        initialCategoria={categoria}
      />
    </div>
  )
}
