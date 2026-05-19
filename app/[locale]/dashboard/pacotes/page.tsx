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
  ATIVO: { label: 'Ativo', icon: Clock, cls: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  CONCLUIDO: { label: 'Concluído', icon: CheckCircle2, cls: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  EXPIRADO: { label: 'Expirado', icon: XCircle, cls: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  CANCELADO: { label: 'Cancelado', icon: XCircle, cls: 'bg-red-500/10 text-red-600 border-red-200' },
} as const

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: number; icon: React.ElementType; accent?: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 flex items-center gap-4">
      <div className={`rounded-lg p-2.5 ${accent ?? 'bg-primary/10'}`}>
        <Icon className={`h-5 w-5 ${accent ? 'text-current' : 'text-primary'}`} />
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
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
    <div className="flex flex-col gap-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pacotes de Sessões</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Controle de pacotes vendidos e sessões consumidas
          </p>
        </div>
        <Link
          href="/dashboard/pacientes"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Package className="h-4 w-4" />
          Novo pacote
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Pacotes ativos" value={totalAtivos} icon={Clock} accent="bg-emerald-500/10 text-emerald-600" />
        <StatCard label="Concluídos" value={totalConcluidos} icon={CheckCircle2} accent="bg-blue-500/10 text-blue-600" />
        <StatCard label="Expirados" value={totalExpirados} icon={XCircle} accent="bg-amber-500/10 text-amber-600" />
        <StatCard label="Sessões realizadas" value={sessoesRealizadas} icon={TrendingUp} />
      </div>

      {/* Progresso total */}
      {sessoesTotaisVendidas > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium">Aproveitamento global</p>
            <p className="text-sm text-muted-foreground">
              {sessoesRealizadas} / {sessoesTotaisVendidas} sessões
            </p>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${Math.round((sessoesRealizadas / sessoesTotaisVendidas) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {Math.round((sessoesRealizadas / sessoesTotaisVendidas) * 100)}% das sessões realizadas
          </p>
        </div>
      )}

      {/* Lista de pacotes */}
      <div>
        <h2 className="text-base font-semibold mb-4">
          {totalPacotes === 0 ? 'Pacotes' : `${totalPacotes} pacote${totalPacotes !== 1 ? 's' : ''}`}
        </h2>

        {pacotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-16 text-center">
            <Package className="h-10 w-10 text-muted-foreground/40" />
            <div>
              <p className="font-medium text-muted-foreground">Nenhum pacote cadastrado</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Acesse o perfil de um paciente para criar um pacote de sessões
              </p>
            </div>
            <Link
              href="/dashboard/pacientes"
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
            >
              Ver pacientes
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-border/50 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-border/50 bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Paciente</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sessões</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Expira</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Criado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {pacotes.map((pacote) => {
                  const cfg = STATUS_CONFIG[pacote.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.ATIVO
                  const progresso = pacote.sessoesTotais > 0
                    ? Math.round((pacote.sessoesUtilizadas / pacote.sessoesTotais) * 100)
                    : 0

                  return (
                    <tr key={pacote.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <Link
                          href={`/dashboard/pacientes/${pacote.patientId}`}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {pacote.patient.nome}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{pacote.sessoesUtilizadas}/{pacote.sessoesTotais}</span>
                          <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${progresso}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{progresso}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${cfg.cls}`}>
                          <cfg.icon className="h-3 w-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {pacote.expiraEm
                          ? format(new Date(pacote.expiraEm), 'dd/MM/yyyy', { locale: ptBR })
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {format(new Date(pacote.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
