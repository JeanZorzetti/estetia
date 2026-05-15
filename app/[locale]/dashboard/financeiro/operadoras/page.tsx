import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, ChevronLeft } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OperadorasTable } from '@/components/financeiro/operadoras/operadoras-table'
import { ConveniosTable } from '@/components/financeiro/operadoras/convenios-table'

export const dynamic = 'force-dynamic'

const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

export default async function OperadorasPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user

  const [operadoras, convenios] = await Promise.all([
    prisma.operadora.findMany({
      where: { organizationId },
      include: { _count: { select: { convenios: true, guias: true } } },
      orderBy: [{ ativo: 'desc' }, { nome: 'asc' }],
    }),
    prisma.convenio.findMany({
      where: { organizationId },
      include: { operadora: { select: { id: true, nome: true } } },
      orderBy: [{ ativo: 'desc' }, { createdAt: 'desc' }],
    }),
  ])

  const conveniosSerialized = convenios.map(c => ({
    ...c,
    valorNegociado: c.valorNegociado != null ? Number(c.valorNegociado) : null,
  }))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <Link
          href="/dashboard/financeiro"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Financeiro & TISS
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Operadoras & Convênios</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Cadastro de operadoras de saúde e tabela de preços negociados por procedimento
        </p>
      </div>

      <Tabs defaultValue="operadoras">
        <TabsList>
          <TabsTrigger value="operadoras">Operadoras ({operadoras.length})</TabsTrigger>
          <TabsTrigger value="convenios">Convênios ({convenios.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="operadoras" className="mt-6 flex flex-col gap-4">
          <div className="flex justify-end">
            <Link
              href="/dashboard/financeiro/operadoras/nova"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova Operadora
            </Link>
          </div>
          <OperadorasTable initialOperadoras={serialize(operadoras) as any} />
        </TabsContent>

        <TabsContent value="convenios" className="mt-6 flex flex-col gap-4">
          <div className="flex justify-end gap-2">
            {operadoras.length > 0 && (
              <Link
                href={`/dashboard/financeiro/operadoras/${operadoras[0].id}/convenios/novo`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo Convênio
              </Link>
            )}
          </div>
          <ConveniosTable initialConvenios={serialize(conveniosSerialized) as any} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
