import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Mail } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { BrevoForm } from '@/components/integrations/forms/brevo-form'

export const metadata = { title: 'Brevo | Estetia CRM' }

export default async function BrevoPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          brevoEnabled: true,
          brevoApiKey: true,
          brevoListId: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Brevo"
        description="E-mail marketing, SMS e automações de contato — plataforma europeia com LGPD"
        icon={Mail}
        iconBg="bg-teal-500/10"
        iconColor="text-teal-500"
        docsUrl="https://developers.brevo.com/"
      />

      <BrevoForm
        initial={{
          enabled: org.brevoEnabled,
          hasApiKey: !!org.brevoApiKey,
          listId: org.brevoListId ?? '',
        }}
      />
    </div>
  )
}
