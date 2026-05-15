import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, AlertTriangle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { AnonimizarPacienteSearch } from '@/components/lgpd/anonimizacao/anonimizar-paciente-search'
import { HistoricoTabela } from '@/components/lgpd/historico-tabela'

export const dynamic = 'force-dynamic'

export default async function AnonimizacaoPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [logs, totalAnons, anons30d] = await Promise.all([
    prisma.medicalAccessLog.findMany({
      where: { organizationId, action: 'ANONYMIZE' },
      orderBy: { createdAt: 'desc' },
      take: 200,
    }),
    prisma.medicalAccessLog.count({ where: { organizationId, action: 'ANONYMIZE' } }),
    prisma.medicalAccessLog.count({ where: { organizationId, action: 'ANONYMIZE', createdAt: { gte: thirtyDaysAgo } } }),
  ])

  const userIds = [...new Set(logs.map(l => l.userId).filter(Boolean) as string[])]
  const pacIds = [...new Set(logs.map(l => l.pacienteId))]
  const [users, pacientes] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } }),
    prisma.patient.findMany({ where: { id: { in: pacIds } }, select: { id: true, nome: true } }),
  ])
  const userMap = Object.fromEntries(users.map(u => [u.id, u]))
  const pacMap = Object.fromEntries(pacientes.map(p => [p.id, p]))

  const entries = logs.map(l => ({
    id: l.id,
    pacienteId: l.pacienteId,
    pacienteNome: pacMap[l.pacienteId]?.nome ?? 'Paciente anonimizado',
    userName: l.userId ? userMap[l.userId]?.name ?? null : null,
    ipAddress: l.ipAddress,
    createdAt: l.createdAt.toISOString(),
    metadata: l.metadata as Record<string, unknown> | null,
  }))

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <Link
          href="/dashboard/lgpd"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ChevronLeft className="w-4 h-4" />
          LGPD & Compliance
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Anonimização</h1>
        <p className="text-muted-foreground text-sm mt-1">
          LGPD Art. 18, VI — Direito ao apagamento via anonimização
        </p>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
          <strong>Anonimização é irreversível.</strong> Esta ação substitui nome, CPF, e-mail e telefone do paciente por valores anonimizados, mas <strong>preserva o prontuário clínico</strong> conforme exigência do CFM Res. 1.821/2007 (retenção de 20 anos). Para uso quando paciente solicita exclusão e a clínica precisa manter histórico médico.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border/60">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Total anonimizados</p>
            <p className="text-2xl font-bold tabular-nums">{totalAnons}</p>
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Últimos 30 dias</p>
            <p className="text-2xl font-bold tabular-nums">{anons30d}</p>
          </CardContent>
        </Card>
      </div>

      <AnonimizarPacienteSearch />

      <div>
        <h2 className="text-base font-semibold tracking-tight mb-3">Histórico de Anonimizações ({entries.length})</h2>
        <HistoricoTabela entries={entries} emptyMessage="Nenhuma anonimização registrada." />
      </div>
    </div>
  )
}
