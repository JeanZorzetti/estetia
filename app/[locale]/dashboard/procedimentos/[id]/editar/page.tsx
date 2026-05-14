import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ProcedureForm } from '@/components/procedimentos/procedure-form'

export default async function EditarProcedimentoPage({
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

  const procedure = await prisma.procedure.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!procedure) notFound()

  const serialized = {
    id: procedure.id,
    nome: procedure.nome,
    categoria: procedure.categoria,
    descricao: procedure.descricao,
    duracaoMinutos: procedure.duracaoMinutos,
    valorPadrao: procedure.valorPadrao != null ? Number(procedure.valorPadrao) : null,
    contraindicacoesGerais: procedure.contraindicacoesGerais as string[],
    preCuidados: procedure.preCuidados,
    posCuidados: procedure.posCuidados,
    exigeAnamneseEspecifica: procedure.exigeAnamneseEspecifica,
    profissionaisHabilitadosIds: procedure.profissionaisHabilitadosIds,
    ativo: procedure.ativo,
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div>
        <Link
          href="/dashboard/procedimentos"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Procedimentos
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Editar Procedimento</h1>
        <p className="text-muted-foreground text-sm mt-1">{procedure.nome}</p>
      </div>

      <ProcedureForm initialData={serialized} />
    </div>
  )
}
