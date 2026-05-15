import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { OperadoraForm } from '@/components/financeiro/operadoras/operadora-form'

export default async function EditarOperadoraPage({
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
  const operadora = await prisma.operadora.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!operadora) notFound()

  const initialData = {
    id: operadora.id,
    nome: operadora.nome,
    codigoAns: operadora.codigoAns ?? '',
    cnpj: operadora.cnpj ?? '',
    tipo: (operadora.tipo as 'CONVENIO' | 'PARTICULAR' | 'CORTESIA') ?? 'CONVENIO',
    contatoNome: operadora.contatoNome ?? '',
    contatoEmail: operadora.contatoEmail ?? '',
    contatoTelefone: operadora.contatoTelefone ?? '',
    prazoRepasseDias: operadora.prazoRepasseDias ?? null,
    ativo: operadora.ativo,
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
        <h1 className="text-2xl font-semibold tracking-tight">Editar Operadora</h1>
        <p className="text-muted-foreground text-sm mt-1">{operadora.nome}</p>
      </div>

      <OperadoraForm initialData={initialData} />
    </div>
  )
}
