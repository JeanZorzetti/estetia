import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { ExportPacienteSearch } from '@/components/lgpd/exportacao/export-paciente-search'
import { HistoricoTabela } from '@/components/lgpd/historico-tabela'

export const dynamic = 'force-dynamic'

export default async function ExportacaoPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user

  const logs = await prisma.medicalAccessLog.findMany({
    where: { organizationId, action: 'EXPORT' },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })

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
    pacienteNome: pacMap[l.pacienteId]?.nome ?? 'Paciente removido',
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
        <h1 className="text-2xl font-semibold tracking-tight">Exportação de Dados</h1>
        <p className="text-muted-foreground text-sm mt-1">
          LGPD Art. 18, II — Direito à portabilidade. Toda exportação é registrada no audit log imutável.
        </p>
      </div>

      <ExportPacienteSearch />

      <div>
        <h2 className="text-base font-semibold tracking-tight mb-3">Histórico de Exportações ({entries.length})</h2>
        <HistoricoTabela entries={entries} emptyMessage="Nenhuma exportação registrada ainda." />
      </div>
    </div>
  )
}
