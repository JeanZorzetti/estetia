import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RecallRuleForm } from '@/components/recall/recall-rule-form'

export const dynamic = 'force-dynamic'

export default async function EditarRecallPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { id } = await params

  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const rule = await prisma.recallRule.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!rule) notFound()

  const procedures = await prisma.procedure.findMany({
    where: { organizationId: user.organizationId, ativo: true },
    select: { id: true, nome: true },
    orderBy: { nome: 'asc' },
  })

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/recall/${id}`}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Editar Regra de Recall</h1>
          <p className="text-muted-foreground text-sm mt-1">{rule.nome ?? `Regra ${rule.intervaloDias} dias`}</p>
        </div>
      </div>

      <RecallRuleForm
        procedures={procedures}
        initialData={{
          id: rule.id,
          nome: rule.nome ?? '',
          procedimentoId: rule.procedimentoId ?? '',
          intervaloDias: rule.intervaloDias,
          canal: rule.canal as 'WHATSAPP' | 'EMAIL',
          template: rule.template,
          ativo: rule.ativo,
        }}
      />
    </div>
  )
}
