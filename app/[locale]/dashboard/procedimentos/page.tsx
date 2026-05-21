import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { ProceduresTable } from '@/components/procedimentos/procedures-table'
import { ProceduresKpis } from '@/components/procedimentos/procedures-kpis'
import { requireModule } from '@/lib/guards/require-module'
import { ModuleLocked } from '@/components/upgrade/module-locked'

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

  const gate = await requireModule('procedimentos')
  if (!gate.allowed) return <ModuleLocked slug={gate.slug} />

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
    <div className="relative flex flex-col gap-6 p-6 min-h-screen overflow-hidden">
      {/* Fundo com textura física de micro-grão */}
      <div className="bg-[radial-gradient(rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:16px_16px] opacity-[0.15] pointer-events-none absolute inset-0 z-0" />

      {/* Halos estelares tridimensionais desfocados */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle_at_center,rgba(72,159,181,0.08)_0%,transparent_70%)] blur-[80px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.06)_0%,transparent_70%)] blur-[80px] pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-700 border border-amber-500/20 backdrop-blur-md mb-2">
            👑 CATÁLOGO VIP · PROCEDIMENTOS CLÍNICOS
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 font-serif">
            Procedimentos
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
            Catálogo da clínica · <span className="text-[#C5A059] font-semibold">{kpis.totalAtivos}</span> ativo{kpis.totalAtivos !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/procedimentos/novo"
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E5C07B] hover:opacity-90 shadow-[0_4px_20px_rgba(197,160,89,0.25)] text-white hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 font-medium px-5 py-2.5 text-sm flex-shrink-0"
        >
          <Plus className="w-4 h-4 mr-0.5" />
          Novo Procedimento
        </Link>
      </div>

      {/* KPIs */}
      <div className="relative z-10">
        <ProceduresKpis kpis={kpis} />
      </div>

      {/* Table */}
      <div className="relative z-10">
        <ProceduresTable
          initialProcedures={serialize(serializedProcedures)}
          initialQuery={q}
          initialCategoria={categoria}
        />
      </div>
    </div>
  )
}
