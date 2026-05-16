import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Activity } from 'lucide-react'
import { IntegrationGrid } from '@/components/integrations/marketplace/integration-grid'

export const metadata = { title: 'Integrações | Estetia CRM' }

export default async function IntegrationsPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      organization: {
        select: {
          id: true,
          tier: true,
          wabaEnabled: true,
          wabaPhoneNumberId: true,
          evolutionEnabled: true,
          evolutionBaseUrl: true,
          zapiEnabled: true,
          zapiInstanceId: true,
          instagramDmEnabled: true,
          instagramDmPageId: true,
          googleCalendarEnabled: true,
          googleCalendarEmail: true,
          smtpEnabled: true,
          smtpHost: true,
          adsIntegrationEnabled: true,
          googleAdsCustomerId: true,
          facebookAdAccountId: true,
          instagramBusinessAccountId: true,
          omieEnabled: true,
          omieAppKey: true,
          n8nEnabled: true,
          n8nBaseUrl: true,
          webhookEnabled: true,
          webhookSecret: true,
          pabxEnabled: true,
          pabxProvider: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Usuário não encontrado</div>

  const org = user.organization

  const configured: Record<string, boolean> = {
    'whatsapp-oficial': !!org.wabaPhoneNumberId,
    'whatsapp-evolution': !!org.evolutionBaseUrl,
    'whatsapp-zapi': !!org.zapiInstanceId,
    'instagram-dm': !!org.instagramDmPageId,
    'google-calendar': !!org.googleCalendarEmail,
    smtp: !!org.smtpHost,
    'google-ads': !!org.googleAdsCustomerId,
    'facebook-ads': !!org.facebookAdAccountId,
    'instagram-posts': !!org.instagramBusinessAccountId,
    omie: !!org.omieAppKey,
    n8n: !!org.n8nBaseUrl,
    'webhook-generic': !!org.webhookSecret,
    pabx: !!org.pabxProvider,
    'cfm-validator': true,
  }

  const enabled: Record<string, boolean> = {
    'whatsapp-oficial': org.wabaEnabled,
    'whatsapp-evolution': org.evolutionEnabled,
    'whatsapp-zapi': org.zapiEnabled,
    'instagram-dm': org.instagramDmEnabled,
    'google-calendar': org.googleCalendarEnabled,
    smtp: org.smtpEnabled,
    'google-ads': org.adsIntegrationEnabled && !!org.googleAdsCustomerId,
    'facebook-ads': org.adsIntegrationEnabled && !!org.facebookAdAccountId,
    'instagram-posts': !!org.instagramBusinessAccountId,
    omie: org.omieEnabled,
    n8n: org.n8nEnabled,
    'webhook-generic': org.webhookEnabled,
    pabx: org.pabxEnabled,
    'cfm-validator': true,
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/settings">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Integrações</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Conecte suas próprias contas e ferramentas — você no controle das credenciais
          </p>
        </div>
        <Link href="/dashboard/settings/integrations/status">
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
            <Activity className="h-4 w-4" />
            Ver Status
          </Button>
        </Link>
      </div>

      <IntegrationGrid orgStatus={{ configured, enabled }} />
    </div>
  )
}
