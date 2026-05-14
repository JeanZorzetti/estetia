import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Send, Users, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<string, string> = {
  RASCUNHO: 'Rascunho', AGENDADA: 'Agendada', ENVIANDO: 'Enviando', ENVIADA: 'Enviada', CANCELADA: 'Cancelada',
}
const STATUS_COLORS: Record<string, string> = {
  RASCUNHO: 'bg-muted text-muted-foreground',
  AGENDADA: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  ENVIANDO: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  ENVIADA: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  CANCELADA: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

export default async function CampanhaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { id } = await params
  const campaign = await prisma.marketingCampaign.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!campaign) notFound()

  const CANAL_LABELS: Record<string, string> = { WHATSAPP: 'WhatsApp', EMAIL: 'E-mail' }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl">
      <div>
        <Link
          href="/dashboard/marketing-clinico/campanhas"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Campanhas
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{campaign.nome}</h1>
          <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[campaign.status] ?? STATUS_COLORS.RASCUNHO)}>
            {STATUS_LABELS[campaign.status] ?? campaign.status}
          </span>
        </div>
        <p className="text-muted-foreground text-sm mt-1">{CANAL_LABELS[campaign.canal]} · criada em {campaign.createdAt.toLocaleDateString('pt-BR')}</p>
      </div>

      {/* Metrics */}
      {campaign.status === 'ENVIADA' && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Destinatários', value: campaign.totalDestinatarios, icon: Users },
            { label: 'Enviados', value: campaign.totalEnviados, icon: Send },
            { label: 'Falhas', value: campaign.totalFalhas, icon: CheckCircle2 },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label} className="border-border/60">
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-xl font-bold tabular-nums">{value.toLocaleString('pt-BR')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Message */}
      <Card className="border-border/60">
        <CardContent className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Mensagem</p>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{campaign.mensagem}</p>
        </CardContent>
      </Card>

      {/* Segment */}
      <Card className="border-border/60">
        <CardContent className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Segmento</p>
          <pre className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 overflow-auto">
            {JSON.stringify(campaign.segmento, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {campaign.enviadoEm && (
        <p className="text-xs text-muted-foreground">Enviada em {campaign.enviadoEm.toLocaleString('pt-BR')}</p>
      )}
    </div>
  )
}
