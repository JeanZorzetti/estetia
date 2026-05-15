import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { GuiaTissForm } from '@/components/financeiro/guias-tiss/guia-tiss-form'

export default async function NovaGuiaTissPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const operadoras = await prisma.operadora.findMany({
    where: { organizationId: user.organizationId, ativo: true },
    select: { id: true, nome: true },
    orderBy: { nome: 'asc' },
  })

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div>
        <Link
          href="/dashboard/financeiro/guias-tiss"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Nova Guia TISS</h1>
        <p className="text-muted-foreground text-sm mt-1">Crie uma guia para envio à operadora de saúde</p>
      </div>

      {operadoras.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma operadora cadastrada.</p>
          <Link
            href="/dashboard/financeiro/operadoras/nova"
            className="text-sm text-primary hover:underline"
          >
            Cadastrar primeira operadora →
          </Link>
        </div>
      ) : (
        <GuiaTissForm operadoras={operadoras} />
      )}
    </div>
  )
}
