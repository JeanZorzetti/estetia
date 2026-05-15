import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { GuiaTissForm } from '@/components/financeiro/guias-tiss/guia-tiss-form'

export default async function EditarGuiaTissPage({
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

  const [guia, operadoras] = await Promise.all([
    prisma.guiaTiss.findFirst({
      where: { id, organizationId: user.organizationId },
      include: { paciente: { select: { id: true, nome: true } } },
    }),
    prisma.operadora.findMany({
      where: { organizationId: user.organizationId, ativo: true },
      select: { id: true, nome: true },
      orderBy: { nome: 'asc' },
    }),
  ])
  if (!guia) notFound()

  if (guia.status !== 'RASCUNHO') {
    redirect(`/dashboard/financeiro/guias-tiss/${guia.id}`)
  }

  const initialData = {
    id: guia.id,
    operadoraId: guia.operadoraId,
    pacienteId: guia.pacienteId,
    tipo: guia.tipo as 'CONSULTA' | 'SADT' | 'INTERNACAO' | 'SP_SADT' | 'HONORARIOS',
    numeroGuia: guia.numeroGuia ?? '',
    codigoTuss: guia.codigoTuss ?? '',
    valorProcedimento: guia.valorProcedimento != null ? Number(guia.valorProcedimento) : null,
    valorTotal: guia.valorTotal != null ? Number(guia.valorTotal) : null,
    dataExecucao: guia.dataExecucao?.toISOString().slice(0, 10) ?? null,
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div>
        <Link
          href={`/dashboard/financeiro/guias-tiss/${guia.id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Editar Guia</h1>
        <p className="text-muted-foreground text-sm mt-1">{guia.numeroGuia ?? guia.id.slice(0, 8)}</p>
      </div>

      <GuiaTissForm
        operadoras={operadoras}
        initialData={initialData}
        initialPatient={guia.paciente}
      />
    </div>
  )
}
