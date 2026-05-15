import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ConvenioForm } from '@/components/financeiro/operadoras/convenio-form'

export default async function EditarConvenioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { id } = await params
  const [convenio, operadoras] = await Promise.all([
    prisma.convenio.findFirst({ where: { id, organizationId: user.organizationId } }),
    prisma.operadora.findMany({
      where: { organizationId: user.organizationId, ativo: true },
      select: { id: true, nome: true },
      orderBy: { nome: 'asc' },
    }),
  ])
  if (!convenio) notFound()

  const initialData = {
    id: convenio.id,
    operadoraId: convenio.operadoraId,
    procedureId: convenio.procedureId,
    codigoTuss: convenio.codigoTuss ?? '',
    descricaoTuss: convenio.descricaoTuss ?? '',
    valorNegociado: convenio.valorNegociado != null ? Number(convenio.valorNegociado) : null,
    porcentagemCo: convenio.porcentagemCo ?? null,
    vigenciaInicio: convenio.vigenciaInicio?.toISOString() ?? null,
    vigenciaFim: convenio.vigenciaFim?.toISOString() ?? null,
    ativo: convenio.ativo,
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div>
        <Link
          href="/dashboard/financeiro/operadoras"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Editar Convênio</h1>
        <p className="text-muted-foreground text-sm mt-1">{convenio.descricaoTuss ?? convenio.codigoTuss ?? 'Convênio'}</p>
      </div>

      <ConvenioForm initialData={initialData} operadoras={operadoras} />
    </div>
  )
}
