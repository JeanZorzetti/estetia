import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Mail } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { MailchimpForm } from '@/components/integrations/forms/mailchimp-form'

export const metadata = { title: 'Mailchimp | Estetia CRM' }

export default async function MailchimpPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          mailchimpEnabled: true,
          mailchimpApiKey: true,
          mailchimpListId: true,
          mailchimpServer: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Mailchimp"
        description="Sincronize pacientes com suas listas e dispare campanhas de e-mail automaticamente"
        icon={Mail}
        iconBg="bg-yellow-500/10"
        iconColor="text-yellow-500"
        docsUrl="https://mailchimp.com/developer/marketing/api/root/"
      />

      <MailchimpForm
        initial={{
          enabled: org.mailchimpEnabled,
          hasApiKey: !!org.mailchimpApiKey,
          listId: org.mailchimpListId ?? '',
          server: org.mailchimpServer ?? '',
        }}
      />
    </div>
  )
}
