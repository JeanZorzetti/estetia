import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Mail } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { MailerLiteForm } from '@/components/integrations/forms/mailerlite-form'

export const metadata = { title: 'MailerLite | Estetia CRM' }

export default async function MailerLitePage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          mailerliteEnabled: true,
          mailerliteApiKey: true,
          mailerliteGroupId: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="MailerLite"
        description="E-mail marketing simples e eficaz — newsletters, automações e landing pages"
        icon={Mail}
        iconBg="bg-green-500/10"
        iconColor="text-green-500"
        docsUrl="https://developers.mailerlite.com/docs/"
      />

      <MailerLiteForm
        initial={{
          enabled: org.mailerliteEnabled,
          hasApiKey: !!org.mailerliteApiKey,
          groupId: org.mailerliteGroupId ?? '',
        }}
      />
    </div>
  )
}
