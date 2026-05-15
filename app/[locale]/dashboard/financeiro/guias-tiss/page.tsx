import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, ChevronLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { GuiasTissTable } from '@/components/financeiro/guias-tiss/guias-tiss-table'

export const dynamic = 'force-dynamic'

const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

const KPI_COLORS: Record<string, string> = {
  RASCUNHO: 'text-muted-foreground',
  ENVIADA: 'text-blue-600 dark:text-blue-300',
  AUTORIZADA: 'text-emerald-600 dark:text-emerald-300',
  GLOSADA: 'text-amber-600 dark:text-amber-300',
  PAGA: 'text-green-700 dark:text-green-300',
}

export default async function GuiasTissPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [guias, operadoras, rascunho, enviadasMes, autorizadas, glosadas, pagasMes] = await Promise.all([
    prisma.guiaTiss.findMany({
      where: { organizationId },
      include: {
        operadora: { select: { id: true, nome: true } },
        paciente: { select: { id: true, nome: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.operadora.findMany({
      where: { organizationId, ativo: true },
      select: { id: true, nome: true },
      orderBy: { nome: 'asc' },
    }),
    prisma.guiaTiss.count({ where: { organizationId, status: 'RASCUNHO' } }),
    prisma.guiaTiss.count({ where: { organizationId, status: 'ENVIADA', createdAt: { gte: startOfMonth } } }),
    prisma.guiaTiss.count({ where: { organizationId, status: 'AUTORIZADA' } }),
    prisma.guiaTiss.count({ where: { organizationId, status: 'GLOSADA' } }),
    prisma.guiaTiss.count({ where: { organizationId, status: 'PAGA', updatedAt: { gte: startOfMonth } } }),
  ])

  const guiasSerialized = guias.map(g => ({
    ...g,
    valorTotal: g.valorTotal != null ? Number(g.valorTotal) : null,
  }))

  const kpis = [
    { label: 'Rascunho', value: rascunho, status: 'RASCUNHO' },
    { label: 'Enviadas (mês)', value: enviadasMes, status: 'ENVIADA' },
    { label: 'Autorizadas', value: autorizadas, status: 'AUTORIZADA' },
    { label: 'Glosadas', value: glosadas, status: 'GLOSADA' },
    { label: 'Pagas (mês)', value: pagasMes, status: 'PAGA' },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard/financeiro"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Financeiro & TISS
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Guias TISS</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Criação, envio e tracking de guias TISS · padrão ANS 4.01.00
          </p>
        </div>
        <Link
          href="/dashboard/financeiro/guias-tiss/nova"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nova Guia
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.label} className="border-border/60">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">{kpi.label}</p>
              <p className={`text-2xl font-bold tabular-nums ${KPI_COLORS[kpi.status] ?? ''}`}>{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <GuiasTissTable initialGuias={serialize(guiasSerialized) as any} operadoras={operadoras} />
    </div>
  )
}
