import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Mail } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { SmtpForm } from '@/components/integrations/forms/smtp-form'

export const metadata = { title: 'E-mail SMTP | Estetia CRM' }

export default async function SmtpPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      email: true,
      organization: {
        select: {
          smtpEnabled: true,
          smtpHost: true,
          smtpPort: true,
          smtpUsername: true,
          smtpPassword: true,
          smtpFromEmail: true,
          smtpFromName: true,
          smtpUseTLS: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="E-mail SMTP"
        description="Envie e-mails do CRM usando seu próprio domínio (Gmail, Outlook, SendGrid, Resend ou qualquer servidor SMTP)"
        icon={Mail}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
      />

      <SmtpForm
        initial={{
          enabled: org.smtpEnabled,
          host: org.smtpHost ?? '',
          port: org.smtpPort ?? 587,
          username: org.smtpUsername ?? '',
          hasPassword: !!org.smtpPassword,
          fromEmail: org.smtpFromEmail ?? '',
          fromName: org.smtpFromName ?? '',
          useTLS: org.smtpUseTLS,
        }}
        userEmail={user.email}
      />
    </div>
  )
}
