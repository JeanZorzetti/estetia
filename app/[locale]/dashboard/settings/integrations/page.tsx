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
          wabaPhoneNumberId: true,
          evolutionBaseUrl: true,
          zapiInstanceId: true,
          instagramDmPageId: true,
          telegramBotToken: true,
          googleCalendarEmail: true,
          outlookCalendarRefreshToken: true,
          appleCalendarFeedSecret: true,
          smtpHost: true,
          googleAdsCustomerId: true,
          facebookAdAccountId: true,
          instagramBusinessAccountId: true,
          asaasApiKey: true,
          mpPaymentAccessToken: true,
          focusnfeToken: true,
          omieAppKey: true,
          n8nBaseUrl: true,
          webhookSecret: true,
          pabxProvider: true,
          zoomAccountId: true,
          viberEnabled: true,
          webchatEnabled: true,
          slackWebhookUrl: true,
          teamsWebhookUrl: true,
          notionApiKey: true,
          trelloToken: true,
          asanaApiKey: true,
          typeformApiKey: true,
          jotformApiKey: true,
          zapierWebhookUrl: true,
          makeWebhookUrl: true,
          contaazulRefreshToken: true,
          blingRefreshToken: true,
          mailchimpApiKey: true,
          brevoApiKey: true,
          activecampaignApiKey: true,
          mailerliteApiKey: true,
          rdStationRefreshToken: true,
          tiktokAdsAccessToken: true,
          linkedinAdsAccessToken: true,
          pagseguroToken: true,
          pagarmeApiKey: true,
          stripeSecretKey: true,
          enotasApiKey: true,
          nfeioApiKey: true,
          plugnotasApiKey: true,
          unimedEnabled: true,
          unimedCredentialsJson: true,
          amilEnabled: true,
          amilCredentialsJson: true,
          bradescoSaudeEnabled: true,
          bradescoSaudeCredentialsJson: true,
          medtissEnabled: true,
          medtissApiKey: true,
          hapvidaEnabled: true,
          hapvidaCredentialsJson: true,
          // Sprint 9 — Telemedicina
          doctoraliaApiKey: true,
          conexaApiKey: true,
          memedApiKey: true,
          whitebookApiKey: true,
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
    telegram: !!org.telegramBotToken,
    'google-calendar': !!org.googleCalendarEmail,
    'outlook-calendar': !!org.outlookCalendarRefreshToken,
    'apple-calendar': !!org.appleCalendarFeedSecret,
    smtp: !!org.smtpHost,
    'google-ads': !!org.googleAdsCustomerId,
    'facebook-ads': !!org.facebookAdAccountId,
    'instagram-posts': !!org.instagramBusinessAccountId,
    asaas: !!org.asaasApiKey,
    'mercadopago-checkout': !!org.mpPaymentAccessToken,
    'focus-nfe': !!org.focusnfeToken,
    omie: !!org.omieAppKey,
    n8n: !!org.n8nBaseUrl,
    'webhook-generic': !!org.webhookSecret,
    pabx: !!org.pabxProvider,
    zoom: !!org.zoomAccountId,
    'cfm-validator': true,
    viber: org.viberEnabled,
    webchat: org.webchatEnabled,
    slack: !!org.slackWebhookUrl,
    teams: !!org.teamsWebhookUrl,
    notion: !!org.notionApiKey,
    trello: !!org.trelloToken,
    asana: !!org.asanaApiKey,
    typeform: !!org.typeformApiKey,
    jotform: !!org.jotformApiKey,
    zapier: !!org.zapierWebhookUrl,
    make: !!org.makeWebhookUrl,
    contaazul: !!org.contaazulRefreshToken,
    bling: !!org.blingRefreshToken,
    mailchimp: !!org.mailchimpApiKey,
    brevo: !!org.brevoApiKey,
    activecampaign: !!org.activecampaignApiKey,
    mailerlite: !!org.mailerliteApiKey,
    'rd-station': !!org.rdStationRefreshToken,
    'tiktok-ads': !!org.tiktokAdsAccessToken,
    'linkedin-ads': !!org.linkedinAdsAccessToken,
    pagseguro: !!org.pagseguroToken,
    pagarme: !!org.pagarmeApiKey,
    stripe: !!org.stripeSecretKey,
    enotas: !!org.enotasApiKey,
    nfeio: !!org.nfeioApiKey,
    plugnotas: !!org.plugnotasApiKey,
    unimed: !!org.unimedCredentialsJson,
    amil: !!org.amilCredentialsJson,
    'bradesco-saude': !!org.bradescoSaudeCredentialsJson,
    medtiss: !!org.medtissApiKey,
    hapvida: !!org.hapvidaCredentialsJson,
    // Sprint 9 — Telemedicina
    doctoralia: !!org.doctoraliaApiKey,
    conexa: !!org.conexaApiKey,
    memed: !!org.memedApiKey,
    whitebook: !!org.whitebookApiKey,
  }

  // Aggregate upvote counts (only for visible "soon" integrations)
  const upvoteRows = await prisma.integrationUpvote.groupBy({
    by: ['integrationId'],
    _count: { integrationId: true },
  })
  const upvoteCounts: Record<string, number> = {}
  upvoteRows.forEach((r) => {
    upvoteCounts[r.integrationId] = r._count.integrationId
  })

  return (
    <div className="flex-1 space-y-6 p-6 relative">
      {/* Premium decorative gradient glow at the top right */}
      <div className="absolute top-0 right-0 w-[500px] h-[350px] bg-gradient-to-bl from-primary/5 via-transparent to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      <div className="flex items-center gap-4 relative z-10">
        <Link href="/dashboard/settings">
          <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4 flex-wrap relative z-10">
        <div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground bg-clip-text">
            Integrações
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl font-medium">
            Conecte suas próprias contas e ferramentas — você no controle completo das suas credenciais
          </p>
        </div>
        <Link href="/dashboard/settings/integrations/status">
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0 rounded-xl bg-background/50 backdrop-blur-sm shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:bg-muted">
            <span className="relative flex h-2 w-2 mr-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Activity className="h-3.5 h-3.5" />
            Ver Status
          </Button>
        </Link>
      </div>

      <div className="relative z-10 border-t border-border/20 pt-6">
        <IntegrationGrid orgStatus={{ configured }} upvoteCounts={upvoteCounts} />
      </div>
    </div>
  )
}
