import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { AuditKpiCards } from '@/components/lgpd/audit-log/audit-kpi-cards'
import { AuditLineChart } from '@/components/lgpd/audit-log/audit-line-chart'
import { TopUsersList, TopPacientesList } from '@/components/lgpd/audit-log/top-lists'
import { AnomaliesCard } from '@/components/lgpd/audit-log/anomalies-card'
import { AuditTable } from '@/components/lgpd/audit-log/audit-table'

export const dynamic = 'force-dynamic'

const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

export default async function AuditLogPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setHours(0, 0, 0, 0)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const pageSize = 50

  const [total, exports, anons, topUsersRaw, topPacientesRaw, anomaliasRaw, chartLogs, logs, totalCount] = await Promise.all([
    prisma.medicalAccessLog.count({ where: { organizationId, createdAt: { gte: thirtyDaysAgo } } }),
    prisma.medicalAccessLog.count({ where: { organizationId, action: 'EXPORT', createdAt: { gte: thirtyDaysAgo } } }),
    prisma.medicalAccessLog.count({ where: { organizationId, action: 'ANONYMIZE', createdAt: { gte: thirtyDaysAgo } } }),
    prisma.medicalAccessLog.groupBy({
      by: ['userId'],
      where: { organizationId, createdAt: { gte: thirtyDaysAgo }, userId: { not: null } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    }),
    prisma.medicalAccessLog.groupBy({
      by: ['pacienteId'],
      where: { organizationId, createdAt: { gte: thirtyDaysAgo } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    }),
    prisma.medicalAccessLog.groupBy({
      by: ['pacienteId'],
      where: { organizationId, createdAt: { gte: sevenDaysAgo } },
      _count: { id: true },
      having: { id: { _count: { gt: 50 } } },
    }),
    prisma.medicalAccessLog.findMany({
      where: { organizationId, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, action: true },
    }),
    prisma.medicalAccessLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: pageSize,
    }),
    prisma.medicalAccessLog.count({ where: { organizationId } }),
  ])

  // Hydrate user + paciente names
  const userIds = [...new Set([
    ...topUsersRaw.map(u => u.userId).filter(Boolean) as string[],
    ...logs.map(l => l.userId).filter(Boolean) as string[],
  ])]
  const pacIds = [...new Set([
    ...topPacientesRaw.map(p => p.pacienteId),
    ...anomaliasRaw.map(a => a.pacienteId),
    ...logs.map(l => l.pacienteId),
  ])]
  const [users, pacientes] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } }),
    prisma.patient.findMany({ where: { id: { in: pacIds } }, select: { id: true, nome: true } }),
  ])
  const userMap = Object.fromEntries(users.map(u => [u.id, u]))
  const pacMap = Object.fromEntries(pacientes.map(p => [p.id, p]))

  const topUsers = topUsersRaw.map(u => ({
    user: u.userId ? userMap[u.userId] ?? null : null,
    count: u._count.id,
  }))
  const topPacientes = topPacientesRaw.map(p => ({
    paciente: pacMap[p.pacienteId] ?? null,
    count: p._count.id,
  }))
  const anomalias = anomaliasRaw.map(a => ({
    paciente: pacMap[a.pacienteId] ?? null,
    count: a._count.id,
  }))

  const topUserName = topUsers[0]?.user?.name ?? '—'

  // Build 30-day chart buckets
  const buckets: Record<string, Record<string, number>> = {}
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo)
    d.setDate(d.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    buckets[key] = { VIEW: 0, CREATE: 0, UPDATE: 0, EXPORT: 0, DELETE: 0, ANONYMIZE: 0 }
  }
  for (const log of chartLogs) {
    const key = log.createdAt.toISOString().slice(0, 10)
    if (!buckets[key]) continue
    buckets[key][log.action] = (buckets[key][log.action] ?? 0) + 1
  }
  const chartData = Object.entries(buckets).map(([date, counts]) => {
    const d = new Date(date)
    return {
      dia: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
      VIEW: counts.VIEW, CREATE: counts.CREATE, UPDATE: counts.UPDATE,
      EXPORT: counts.EXPORT, DELETE: counts.DELETE, ANONYMIZE: counts.ANONYMIZE,
    }
  })

  const hydratedLogs = logs.map(l => ({
    ...l,
    user: l.userId ? userMap[l.userId] ?? null : null,
    paciente: pacMap[l.pacienteId] ?? null,
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
        <h1 className="text-2xl font-semibold tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Trilha imutável de auditoria de acesso a dados sensíveis · LGPD Art. 46
        </p>
      </div>

      <AuditKpiCards total={total} exports={exports} anons={anons} topUserName={topUserName} />

      <AnomaliesCard anomalias={anomalias} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AuditLineChart data={chartData} />
        <div className="flex flex-col gap-5">
          <TopUsersList users={topUsers} />
          <TopPacientesList pacientes={topPacientes} />
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold tracking-tight mb-3">Registros Recentes</h2>
        <AuditTable
          initialLogs={serialize(hydratedLogs) as any}
          initialTotal={totalCount}
          initialPage={1}
          pageSize={pageSize}
        />
      </div>
    </div>
  )
}
