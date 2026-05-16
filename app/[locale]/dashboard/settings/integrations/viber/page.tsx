import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { MessageSquare } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { ViberForm } from '@/components/integrations/forms/viber-form'

export const metadata = { title: 'Viber | Estetia CRM' }

export default async function ViberPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          viberEnabled: true,
          viberAuthToken: true,
          viberSenderName: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Viber"
        description="Mensagens via Viber Business — alcance pacientes em outros mercados"
        icon={MessageSquare}
        iconBg="bg-violet-500/10"
        iconColor="text-violet-500"
        docsUrl="https://developers.viber.com/docs/api/rest-bot-api/"
      />

      <ViberForm
        initial={{
          enabled: org.viberEnabled,
          senderName: org.viberSenderName ?? 'Estetia',
          hasToken: !!org.viberAuthToken,
        }}
      />
    </div>
  )
}
