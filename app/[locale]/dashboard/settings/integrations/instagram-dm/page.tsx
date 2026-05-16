import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Instagram, Info, ExternalLink } from 'lucide-react'
import { IntegrationPageHeader } from '@/components/integrations/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = { title: 'Instagram Direct | Estetia CRM' }

export default async function InstagramDmPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          instagramDmEnabled: true,
          instagramDmPageId: true,
          instagramBusinessAccountId: true,
        },
      },
    },
  })

  if (!user?.organization) return <div>Organização não encontrada</div>

  const org = user.organization
  const hasInstagramPosts = !!org.instagramBusinessAccountId

  return (
    <div className="flex-1 space-y-6 p-6">
      <IntegrationPageHeader
        title="Instagram Direct"
        description="Receba mensagens diretas do Instagram no Chat Center do Estetia"
        icon={Instagram}
        iconBg="bg-pink-500/10"
        iconColor="text-pink-500"
        docsUrl="https://developers.facebook.com/docs/messenger-platform/instagram"
      />

      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="pt-6 text-sm flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Integração em desenvolvimento</p>
            <p className="text-muted-foreground mt-1">
              O fluxo OAuth do Instagram Direct está sendo finalizado.
              {hasInstagramPosts
                ? ' Como você já conectou o Instagram para Posts, conseguiremos reaproveitar suas credenciais.'
                : ' Para preparar a conexão, primeiro autorize sua conta Instagram Business em "Instagram (Posts)".'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pré-requisitos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>1. Conta Instagram Business ou Creator vinculada a uma Página do Facebook</p>
          <p>2. App Meta Developers aprovado com permissão <code className="bg-muted px-1 py-0.5 rounded">instagram_manage_messages</code></p>
          <p>3. Webhook configurado no painel Meta apontando para <code className="bg-muted px-1 py-0.5 rounded">{`{appUrl}/api/webhooks/instagram-dm`}</code></p>

          <div className="pt-2">
            <Link href="/dashboard/settings/integrations/instagram">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                Ir para Instagram (Posts) primeiro
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
