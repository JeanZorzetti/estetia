import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { requireModule } from '@/lib/guards/require-module'
import { ModuleLocked } from '@/components/upgrade/module-locked'
import { Package, CheckCircle2, Clock, XCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

const STATUS_CONFIG = {
  ATIVO: { 
    label: 'Ativo', 
    icon: Clock, 
    cls: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20' 
  },
  CONCLUIDO: { 
    label: 'Concluído', 
    icon: CheckCircle2, 
    cls: 'bg-blue-500/10 text-blue-700 border-blue-500/20' 
  },
  EXPIRADO: { 
    label: 'Expirado', 
    icon: XCircle, 
    cls: 'bg-amber-500/10 text-amber-700 border-amber-500/20' 
  },
  CANCELADO: { 
    label: 'Cancelado', 
    icon: XCircle, 
    cls: 'bg-red-500/10 text-red-700 border-red-500/20' 
  },
} as const

function StatCard({ 
  label, 
  value, 
  icon: Icon,
  glowColor,
  iconColor,
  iconBg
}: { 
  label: string; 
  value: number; 
  icon: React.ElementType;
  glowColor: string;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="relative group overflow-hidden rounded-2xl border border-slate-200/50 bg-white/40 p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Moldura interna de seda branca para o Glassmorphic Duplo */}
      <div className="absolute inset-0.5 border border-white/60 pointer-events-none rounded-[14px]" />
      
      {/* Glow de acento sob o hover */}
      <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${glowColor}`} />
      
      <div className="relative flex items-center gap-4">
        {/* Vitrine metálica de luxo para o ícone */}
        <div className={`relative flex items-center justify-center rounded-xl p-3 border border-white/80 shadow-md ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="font-serif text-3xl font-extrabold text-slate-800 tracking-tight leading-none mb-1">
            {value}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}

export default async function PacotesPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const gate = await requireModule('pacotes')
  if (!gate.allowed) return <ModuleLocked slug={gate.slug} />

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const { organizationId } = user

  const safe = async <T,>(fn: () => Promise<T>, fallback: T): Promise<T> => {
    try { return await fn() } catch { return fallback }
  }

  const [pacotes, totalAtivos, totalConcluidos, totalExpirados] = await Promise.all([
    safe(() => prisma.sessionPackage.findMany({
      where: { organizationId },
      include: { patient: { select: { id: true, nome: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }), []),
    safe(() => prisma.sessionPackage.count({ where: { organizationId, status: 'ATIVO' } }), 0),
    safe(() => prisma.sessionPackage.count({ where: { organizationId, status: 'CONCLUIDO' } }), 0),
    safe(() => prisma.sessionPackage.count({ where: { organizationId, status: 'EXPIRADO' } }), 0),
  ])

  const totalPacotes = pacotes.length
  const sessoesTotaisVendidas = pacotes.reduce((acc, p) => acc + p.sessoesTotais, 0)
  const sessoesRealizadas = pacotes.reduce((acc, p) => acc + p.sessoesUtilizadas, 0)

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-100/90 p-8 overflow-hidden flex flex-col gap-8">
      {/* Halos estelares de fundo de alta costura */}
      <div className="pointer-events-none absolute -left-10 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-cyan-500/5 to-blue-600/5 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-500/5 to-orange-600/5 blur-[150px]" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-[#C5A059]/5 to-yellow-600/5 blur-[130px]" />

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#C5A059]/30 bg-gradient-to-r from-[#C5A059]/10 to-[#E5C07B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9A7D42] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-pulse" />
            👑 Hub Operacional VIP • Pacotes de Sessões
          </div>
          <h1 className="font-serif text-4xl font-extrabold tracking-tight text-slate-800">
            Pacotes de Sessões
          </h1>
          <p className="text-sm font-medium text-slate-500/90 flex items-center gap-1.5">
            <span>Controle de pacotes vendidos e sessões consumidas</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider">Acesso Seguro</span>
          </p>
        </div>

        <Link
          href="/dashboard/pacientes"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E5C07B] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Package className="h-4 w-4" />
          <span>Novo pacote</span>
        </Link>
      </div>

      {/* KPIs */}
      <div className="relative z-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard 
          label="Pacotes ativos" 
          value={totalAtivos} 
          icon={Clock} 
          glowColor="bg-emerald-500/20"
          iconBg="bg-gradient-to-br from-emerald-50 to-emerald-100/50"
          iconColor="text-emerald-600"
        />
        <StatCard 
          label="Concluídos" 
          value={totalConcluidos} 
          icon={CheckCircle2} 
          glowColor="bg-blue-500/20"
          iconBg="bg-gradient-to-br from-blue-50 to-blue-100/50"
          iconColor="text-blue-600"
        />
        <StatCard 
          label="Expirados" 
          value={totalExpirados} 
          icon={XCircle} 
          glowColor="bg-amber-500/20"
          iconBg="bg-gradient-to-br from-amber-50 to-amber-100/50"
          iconColor="text-[#C5A059]"
        />
        <StatCard 
          label="Sessões realizadas" 
          value={sessoesRealizadas} 
          icon={TrendingUp} 
          glowColor="bg-pink-500/20"
          iconBg="bg-gradient-to-br from-pink-50 to-pink-100/50"
          iconColor="text-pink-600"
        />
      </div>

      {/* Progresso total */}
      {sessoesTotaisVendidas > 0 && (
        <div className="relative z-10 group rounded-[2.2rem] border border-slate-200/50 bg-white/40 p-8 backdrop-blur-xl shadow-xl overflow-hidden">
          {/* Moldura interna de seda branca */}
          <div className="absolute inset-0.5 border border-white/60 pointer-events-none rounded-[2.1rem]" />

          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#C5A059]" />
              <h3 className="font-serif text-lg font-bold text-slate-800">Aproveitamento Global</h3>
            </div>
            <p className="font-serif text-slate-700 font-bold tabular-nums text-lg">
              {sessoesRealizadas} <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">de</span> {sessoesTotaisVendidas} <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">sessões</span>
            </p>
          </div>

          <div className="relative z-10 h-3 rounded-full bg-slate-200/50 border border-slate-300/20 overflow-hidden backdrop-blur-sm shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-[#C5A059] shadow-md shadow-cyan-500/20 transition-all duration-1000"
              style={{ width: `${Math.round((sessoesRealizadas / sessoesTotaisVendidas) * 100)}%` }}
            />
          </div>

          <p className="relative z-10 text-xs font-medium text-slate-500 mt-3 flex items-center gap-1.5">
            <span className="inline-flex rounded-full bg-cyan-500/10 px-2 py-0.5 font-bold text-cyan-600 border border-cyan-500/10">
              {Math.round((sessoesRealizadas / sessoesTotaisVendidas) * 100)}%
            </span>
            <span>das sessões contratadas já foram concluídas e documentadas.</span>
          </p>
        </div>
      )}

      {/* Lista de pacotes */}
      <div className="relative z-10">
        {pacotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 rounded-[2.2rem] border border-slate-200/50 bg-white/30 backdrop-blur-xl p-20 text-center relative overflow-hidden shadow-xl max-w-3xl mx-auto">
            {/* Moldura interna */}
            <div className="absolute inset-0.5 border border-white/60 pointer-events-none rounded-[2.1rem]" />
            
            {/* Pacote clínica suspensa tridimensional com glows */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 border border-white shadow-xl group hover:scale-105 transition-transform duration-500">
              <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/10 to-pink-500/10 rounded-[2rem] blur-md opacity-70 animate-pulse" />
              <Package className="h-10 w-10 text-slate-600 relative z-10" />
              <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-ping" />
              <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
            </div>

            <div className="space-y-2 max-w-md relative z-10">
              <span className="inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700/90 border border-amber-500/20">
                👑 Estetia Package Archive
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-800">
                Nenhum pacote clínico registrado
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Acesse o perfil de um paciente para fazer a venda e configurar um pacote personalizado de sessões.
              </p>
            </div>

            <Link
              href="/dashboard/pacientes"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E5C07B] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Package className="h-4 w-4" />
              <span>Selecionar Paciente</span>
            </Link>
          </div>
        ) : (
          <div className="relative rounded-[2.2rem] border border-slate-200/50 bg-white/40 p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Moldura interna de luxo de vidro fosco */}
            <div className="absolute inset-0.5 border border-white/60 pointer-events-none rounded-[2.1rem]" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-xl font-bold text-slate-800">
                  {totalPacotes === 0 ? 'Pacotes' : `${totalPacotes} Pacote${totalPacotes !== 1 ? 's' : ''}`}
                </h2>
                <span className="inline-flex items-center rounded-full bg-[#C5A059]/10 px-2.5 py-0.5 text-xs font-semibold text-[#9A7D42] border border-[#C5A059]/10">
                  Controle de consumo
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-200/80 to-transparent mx-4" />
            </div>

            <div className="overflow-x-auto relative z-10 rounded-2xl border border-slate-200/40 bg-white/30 backdrop-blur-md">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/60 bg-slate-50/50">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#9A7D42]">Paciente</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#9A7D42]">Sessões Consumidas</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#9A7D42]">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#9A7D42]">Expiração</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#9A7D42]">Data de Venda</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pacotes.map((pacote) => {
                    const cfg = STATUS_CONFIG[pacote.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.ATIVO
                    const progresso = pacote.sessoesTotais > 0
                      ? Math.round((pacote.sessoesUtilizadas / pacote.sessoesTotais) * 100)
                      : 0

                    return (
                      <tr key={pacote.id} className="relative group hover:bg-white/60 transition-all duration-300">
                        {/* Filete lateral reativo com a cor do status */}
                        <td className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md scale-y-50 group-hover:scale-y-100 transition-all duration-300 origin-center pointer-events-none" 
                            style={{ backgroundColor: pacote.status === 'ATIVO' ? '#10B981' : pacote.status === 'CONCLUIDO' ? '#3B82F6' : pacote.status === 'EXPIRADO' ? '#F59E0B' : '#EF4444' }} 
                        />
                        
                        <td className="px-6 py-4">
                          <Link
                            href={`/dashboard/pacientes/${pacote.patientId}`}
                            className="font-serif font-bold text-slate-800 hover:text-cyan-600 transition-colors"
                          >
                            {pacote.patient.nome}
                          </Link>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-serif font-bold text-slate-800 tabular-nums text-sm">
                              {pacote.sessoesUtilizadas}/{pacote.sessoesTotais}
                            </span>
                            
                            {/* Pequena canaleta de progresso técnico */}
                            <div className="h-2 w-20 rounded-full bg-slate-200/50 overflow-hidden border border-slate-300/10">
                              <div
                                className="h-full rounded-full bg-cyan-500"
                                style={{ width: `${progresso}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 tabular-nums">{progresso}%</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${cfg.cls}`}>
                            <cfg.icon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 text-xs font-semibold text-slate-500 tabular-nums">
                          {pacote.expiraEm
                            ? format(new Date(pacote.expiraEm), 'dd/MM/yyyy', { locale: ptBR })
                            : 'Sem expiração'}
                        </td>
                        
                        <td className="px-6 py-4 text-xs font-medium text-slate-400 tabular-nums">
                          {format(new Date(pacote.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
