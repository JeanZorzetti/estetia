import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Activity,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const metadata = { title: 'Status das Integrações | Estetia CRM' }

export default async function IntegrationsStatusPage() {
  const session = await getSession()
  if (!session?.user?.email) return <div>Não autorizado</div>

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return <div>Organização não encontrada</div>

  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const [total24h, success24h, recentLogs] = await Promise.all([
    prisma.integrationLog.count({
      where: { organizationId: user.organizationId, createdAt: { gte: last24h } },
    }),
    prisma.integrationLog.count({
      where: {
        organizationId: user.organizationId,
        createdAt: { gte: last24h },
        status: 'SUCCESS',
      },
    }),
    prisma.integrationLog.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        type: true,
        action: true,
        status: true,
        createdAt: true,
        errorMessage: true,
      },
    }),
  ])

  const successRate = total24h > 0 ? Math.round((success24h / total24h) * 100) : 100
  const health = successRate >= 95 ? 'Ótimo' : successRate >= 80 ? 'Bom' : 'Atenção'

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/settings/integrations">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Status das Integrações</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Métricas e atividade recente das suas integrações
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3 max-w-4xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Eventos (24h)
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">{total24h}</div>
            <p className="text-xs text-muted-foreground mt-1">{success24h} bem-sucedidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Taxa de Sucesso
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">{successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">últimas 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Health Status
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                successRate >= 95
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : successRate >= 80
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-red-600 dark:text-red-400'
              }`}
            >
              {health}
            </div>
            <p className="text-xs text-muted-foreground mt-1">sistema operacional</p>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Atividade Recente
            </CardTitle>
            <Link href="/dashboard/settings/integrations/logs">
              <Button variant="outline" size="sm">
                Ver todos os logs
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Sem eventos recentes
            </p>
          ) : (
            <div className="divide-y divide-border/50">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between py-2 text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    {log.status === 'SUCCESS' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    )}
                    <span className="font-medium text-foreground truncate">{log.type}</span>
                    <span className="text-muted-foreground text-xs">{log.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 ml-2">
                    {formatDistanceToNow(new Date(log.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
