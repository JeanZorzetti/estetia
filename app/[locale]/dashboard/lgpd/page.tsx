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
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-100/90 p-8 overflow-hidden flex flex-col gap-8">
      {/* Halos estelares de fundo de alta costura */}
      <div className="pointer-events-none absolute -left-10 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-blue-900/5 to-slate-900/5 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-500/5 to-teal-600/5 blur-[150px]" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-[#C5A059]/5 to-yellow-600/5 blur-[130px]" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#C5A059]/30 bg-gradient-to-r from-[#C5A059]/10 to-[#E5C07B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9A7D42] shadow-sm">
            👑 Segurança, Compliance & LGPD VIP
          </div>
          <h1 className="font-serif text-4xl font-extrabold tracking-tight text-slate-800">
            LGPD & Compliance
          </h1>
          <p className="text-sm font-medium text-slate-500/90 flex items-center gap-1.5">
            <span>Consentimentos, audit log, exportação e anonimização conforme a lei</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider">Módulos VIP</span>
          </p>
        </div>

        {/* DPO Top Pill */}
        <Link
          href="/dashboard/lgpd/dpo"
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider border backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-105 ${
            dpoConfigured
              ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 text-amber-700 border-amber-500/30 hover:bg-amber-500/20'
          }`}
        >
          {dpoConfigured ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          {dpoConfigured ? `DPO: ${org!.dpoName}` : 'Configure o DPO →'}
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <HubCard
          icon={FileSignature}
          title="Consentimentos"
          description="Gerenciar termos de consentimento dos pacientes"
          href="/dashboard/lgpd/consentimentos"
          colorClass="CONSENTIMENTOS"
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
          colorClass="AUDIT_LOG"
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
          colorClass="EXPORTACAO"
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
          colorClass="ANONIMIZACAO"
          kpis={[
            { label: 'Anonim. total', value: anonsTotal },
            { label: 'Mês', value: anons30d },
            { label: 'Ativos', value: pacientesAtivos - anonsTotal },
          ]}
        />
      </div>

      {/* DPO Pending Banner */}
      {!dpoConfigured && (
        <Link
          href="/dashboard/lgpd/dpo"
          className="group block relative z-10"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-amber-200/50 bg-amber-50/40 p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-amber-50/60 hover:-translate-y-1">
            {/* Moldura cristalina interna */}
            <div className="absolute inset-0.5 pointer-events-none rounded-[1.9rem] border border-white/60" />
            
            {/* Glow de acento sob hover */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-amber-500/25" />

            <div className="relative z-10 flex items-center gap-5 flex-wrap md:flex-nowrap">
              {/* Vitrine metalizada de luxo */}
              <div className="relative flex items-center justify-center rounded-2xl p-4 border border-amber-200/50 bg-gradient-to-br from-amber-50 to-amber-100/50 text-[#C5A059] shadow-md shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>

              <div className="flex-1">
                <h3 className="font-serif text-xl font-bold text-amber-900 group-hover:text-[#9A7D42] transition-colors duration-300">
                  Configure o Encarregado de Dados (DPO)
                </h3>
                <p className="text-sm font-medium text-amber-800/90 mt-1 leading-relaxed">
                  A LGPD (Art. 41) exige que o controlador indique um encarregado pelo tratamento de dados pessoais. Configure o DPO agora e mantenha sua clínica 100% segura e em compliance jurídico.
                </p>
              </div>

              {/* Botão de chamada tátil */}
              <div className="px-4 py-2 rounded-full bg-white/80 border border-amber-200/50 shadow-sm text-xs font-bold uppercase tracking-wider text-amber-700 group-hover:text-amber-800 group-hover:bg-white group-hover:translate-x-1 transition-all duration-300 shrink-0">
                Configurar DPO →
              </div>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}
