import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Calendar } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { OutlookCalendarForm } from '@/components/integrations/forms/outlook-calendar-form'

export const metadata = { title: 'Outlook Calendar | Estetia CRM' }

export default async function OutlookCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const params = await searchParams
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          outlookCalendarRefreshToken: true,
          outlookCalendarEmail: true,
          outlookClientId: true,
          outlookTenantId: true,
          outlookClientSecret: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization

  const errorMessages: Record<string, string> = {
    access_denied: 'Acesso negado pelo usuário.',
    invalid_state: 'Erro de segurança — tente novamente.',
    missing_credentials: 'Salve as credenciais Azure antes de conectar.',
    connection_failed: 'Falha na autenticação Microsoft — verifique Client ID, Secret e Tenant ID.',
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Outlook Calendar"
        description="Sincronize agendamentos com o Microsoft Outlook Calendar via OAuth 2.0"
        icon={Calendar}
        iconBg="bg-blue-500/10"
        iconColor="text-blue-500"
        docsUrl="https://learn.microsoft.com/pt-br/graph/api/resources/calendar"
      />

      {params.success === 'true' && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-700 dark:text-emerald-300">
          Outlook Calendar conectado com sucesso!
        </div>
      )}
      {params.error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-700 dark:text-red-300">
          {errorMessages[params.error] ?? 'Erro desconhecido — tente novamente.'}
        </div>
      )}

      <OutlookCalendarForm
        initial={{
          email: org.outlookCalendarEmail ?? null,
          hasRefreshToken: !!org.outlookCalendarRefreshToken,
          hasAzureCreds: !!(org.outlookClientId && org.outlookClientSecret && org.outlookTenantId),
          clientId: org.outlookClientId ?? null,
          tenantId: org.outlookTenantId ?? null,
        }}
      />
    </div>
  )
}
