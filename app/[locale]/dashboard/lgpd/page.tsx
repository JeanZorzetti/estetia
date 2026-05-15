import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileSignature, History, Download, UserX, UserCheck, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { HubCard } from '@/components/lgpd/hub-card'

export const dynamic = 'force-dynamic'

export default async function LgpdPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [
    consentsAtivos, consentsRevogados30d, consentsTipos,
    accessTotal30d, exports30d, anons30d,
    exportsTotal, anonsTotal, pacientesAtivos,
    org,
  ] = await Promise.all([
    prisma.consentLog.count({ where: { organizationId, revokedAt: null } }),
    prisma.consentLog.count({ where: { organizationId, revokedAt: { gte: thirtyDaysAgo } } }),
    prisma.consentLog.groupBy({
      by: ['tipo'],
      where: { organizationId },
      _count: { id: true },
    }),
    prisma.medicalAccessLog.count({ where: { organizationId, createdAt: { gte: thirtyDaysAgo } } }),
    prisma.medicalAccessLog.count({ where: { organizationId, action: 'EXPORT', createdAt: { gte: thirtyDaysAgo } } }),
    prisma.medicalAccessLog.count({ where: { organizationId, action: 'ANONYMIZE', createdAt: { gte: thirtyDaysAgo } } }),
    prisma.medicalAccessLog.count({ where: { organizationId, action: 'EXPORT' } }),
    prisma.medicalAccessLog.count({ where: { organizationId, action: 'ANONYMIZE' } }),
    prisma.patient.count({ where: { organizationId } }),
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: { dpoName: true, dpoEmail: true },
    }),
  ])

  const dpoConfigured = !!(org?.dpoName && org?.dpoEmail)

  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">LGPD & Compliance</h1>
          <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
            Consentimentos, audit log, exportação e anonimização conforme Lei Geral de Proteção de Dados
          </p>
        </div>
        <Link
          href="/dashboard/lgpd/dpo"
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border transition-colors ${
            dpoConfigured
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900'
              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900'
          }`}
        >
          {dpoConfigured ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {dpoConfigured ? `DPO: ${org!.dpoName}` : 'Configure o DPO →'}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <HubCard
          icon={FileSignature}
          title="Consentimentos"
          description="Gerenciar termos de consentimento dos pacientes"
          href="/dashboard/lgpd/consentimentos"
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300"
          kpis={[
            { label: 'Ativos', value: consentsAtivos },
            { label: 'Revogados (30d)', value: consentsRevogados30d },
            { label: 'Tipos', value: consentsTipos.length },
          ]}
        />
        <HubCard
          icon={History}
          title="Audit Log"
          description="Trilha de auditoria de acesso a dados sensíveis"
          href="/dashboard/lgpd/audit-log"
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
          kpis={[
            { label: 'Acessos (30d)', value: accessTotal30d.toLocaleString('pt-BR') },
            { label: 'Exports', value: exports30d },
            { label: 'Anonim.', value: anons30d },
          ]}
        />
        <HubCard
          icon={Download}
          title="Exportação de Dados"
          description="Direito à portabilidade (LGPD Art. 18, II)"
          href="/dashboard/lgpd/exportacao"
          colorClass="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300"
          kpis={[
            { label: 'Exports total', value: exportsTotal },
            { label: 'Mês', value: exports30d },
            { label: 'Pacientes', value: pacientesAtivos },
          ]}
        />
        <HubCard
          icon={UserX}
          title="Anonimização"
          description="Direito ao apagamento (LGPD Art. 18, VI)"
          href="/dashboard/lgpd/anonimizacao"
          colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300"
          kpis={[
            { label: 'Anonim. total', value: anonsTotal },
            { label: 'Mês', value: anons30d },
            { label: 'Ativos', value: pacientesAtivos - anonsTotal },
          ]}
        />
      </div>

      {!dpoConfigured && (
        <Link
          href="/dashboard/lgpd/dpo"
          className="group block"
        >
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 p-5 flex items-center gap-4 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-6 h-6 text-amber-700 dark:text-amber-300" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100">Configure o Encarregado de Dados</h3>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-0.5">
                A LGPD (Art. 41) exige que o controlador indique um DPO. Configure agora →
              </p>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}
