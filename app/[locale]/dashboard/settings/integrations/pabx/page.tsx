import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { headers } from 'next/headers'
import { Phone } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { PabxForm } from '@/components/integrations/forms/pabx-form'

export const metadata = { title: 'Telefonia / PABX | Estetia CRM' }

export default async function PabxPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          id: true,
          pabxEnabled: true,
          pabxProvider: true,
          pabxWebhookSecret: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? 'https'
  const webhookUrl = `${proto}://${host}/api/webhooks/pabx/${user.organization.id}`

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Telefonia / PABX"
        description="Receba chamadas no CRM — Intelbras, Yealink, Asterisk e PABX genéricos via webhook"
        icon={Phone}
        iconBg="bg-cyan-500/10"
        iconColor="text-cyan-500"
      />

      <PabxForm
        initial={{
          enabled: user.organization.pabxEnabled,
          provider: user.organization.pabxProvider ?? 'generic',
          hasSecret: !!user.organization.pabxWebhookSecret,
          webhookUrl,
        }}
      />
    </div>
  )
}
