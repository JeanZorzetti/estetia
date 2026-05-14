import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { RecallRuleForm } from '@/components/recall/recall-rule-form'

export const dynamic = 'force-dynamic'

export default async function NovaRecallPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const procedures = await prisma.procedure.findMany({
    where: { organizationId: user.organizationId, ativo: true },
    select: { id: true, nome: true },
    orderBy: { nome: 'asc' },
  })

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold">Nova Regra de Recall</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure uma regra para reativar pacientes automaticamente via WhatsApp ou e-mail.
        </p>
      </div>

      <RecallRuleForm procedures={procedures} />
    </div>
  )
}
