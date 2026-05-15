import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ActionBadge } from '@/components/lgpd/audit-log/action-badge'

export const dynamic = 'force-dynamic'

const ACTION_LABELS_COUNT: Record<string, string> = {
  VIEW: 'Visualizações',
  CREATE: 'Criações',
  UPDATE: 'Edições',
  EXPORT: 'Exportações',
  DELETE: 'Exclusões',
  ANONYMIZE: 'Anonimizações',
}

export default async function PacienteAuditPage({
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

  const [paciente, logs, byAction] = await Promise.all([
    prisma.patient.findFirst({
      where: { id, organizationId: user.organizationId },
      select: { id: true, nome: true, telefone: true, email: true, createdAt: true },
    }),
    prisma.medicalAccessLog.findMany({
      where: { pacienteId: id, organizationId: user.organizationId },
      orderBy: { createdAt: 'desc' },
      take: 500,
    }),
    prisma.medicalAccessLog.groupBy({
      by: ['action'],
      where: { pacienteId: id, organizationId: user.organizationId },
      _count: { id: true },
    }),
  ])
  if (!paciente) notFound()

  const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean) as string[])]
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  })
  const userMap = Object.fromEntries(users.map(u => [u.id, u]))

  const actionCounts = Object.fromEntries(byAction.map(b => [b.action, b._count.id]))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <Link
          href="/dashboard/lgpd/audit-log"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Audit Log
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{paciente.nome}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Histórico completo de acessos · Cadastrado em {paciente.createdAt.toLocaleDateString('pt-BR')}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {Object.entries(ACTION_LABELS_COUNT).map(([action, label]) => (
          <Card key={action} className="border-border/60">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 truncate">{label}</p>
              <p className="text-2xl font-bold tabular-nums">{actionCounts[action] ?? 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-base font-semibold tracking-tight mb-3">Timeline ({logs.length})</h2>
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 border border-dashed border-border rounded-xl text-center">
            <p className="text-sm text-muted-foreground">Nenhum acesso registrado.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {logs.map(l => (
              <div key={l.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-card">
                <div className="text-xs text-muted-foreground tabular-nums whitespace-nowrap pt-0.5 w-32 flex-shrink-0">
                  {new Date(l.createdAt).toLocaleString('pt-BR')}
                </div>
                <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">
                  <ActionBadge action={l.action} />
                  <span className="text-sm text-muted-foreground">em</span>
                  <span className="text-sm font-mono text-xs">{l.recordType}</span>
                  <span className="text-sm text-muted-foreground">por</span>
                  <span className="text-sm font-medium">{l.userId ? userMap[l.userId]?.name ?? 'Usuário removido' : 'Sistema'}</span>
                  {l.ipAddress && (
                    <span className="text-xs font-mono text-muted-foreground ml-auto">{l.ipAddress}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
