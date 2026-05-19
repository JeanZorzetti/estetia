import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { requireModule } from '@/lib/guards/require-module'
import { ModuleLocked } from '@/components/upgrade/module-locked'
import { Camera, ImageOff, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 flex items-center gap-4">
      <div className="rounded-lg bg-primary/10 p-2.5">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

export default async function FotosPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const gate = await requireModule('fotos')
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

  const [totalFotos, totalBefore, totalAfter, totalEvolution, patientsWithPhotos, recentFotos] = await Promise.all([
    safe(() => prisma.patientPhoto.count({ where: { organizationId } }), 0),
    safe(() => prisma.patientPhoto.count({ where: { organizationId, tipo: 'BEFORE' } }), 0),
    safe(() => prisma.patientPhoto.count({ where: { organizationId, tipo: 'AFTER' } }), 0),
    safe(() => prisma.patientPhoto.count({ where: { organizationId, tipo: 'EVOLUTION' } }), 0),
    safe(async () => {
      const res = await prisma.patientPhoto.groupBy({ by: ['patientId'], where: { organizationId } })
      return res.length
    }, 0),
    safe(() => prisma.patientPhoto.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 12,
      include: { patient: { select: { id: true, nome: true } } },
    }), []),
  ])

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fotos Before/After</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Galeria fotográfica por paciente com consentimento LGPD
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total de fotos" value={totalFotos} icon={Camera} />
        <StatCard label="Pacientes com fotos" value={patientsWithPhotos} icon={Users} />
        <StatCard label="Before / After" value={totalBefore + totalAfter} icon={TrendingUp} />
        <StatCard label="Evolução" value={totalEvolution} icon={ImageOff} />
      </div>

      {/* Galeria recente */}
      <div>
        <h2 className="text-base font-semibold mb-4">Fotos recentes</h2>
        {recentFotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border p-16 text-center">
            <Camera className="h-10 w-10 text-muted-foreground/40" />
            <div>
              <p className="font-medium text-muted-foreground">Nenhuma foto cadastrada</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Acesse o perfil de um paciente para adicionar fotos
              </p>
            </div>
            <Link
              href="/dashboard/pacientes"
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Ver pacientes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {recentFotos.map((foto) => (
              <Link
                key={foto.id}
                href={`/dashboard/pacientes/${foto.patientId}`}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border/50 bg-muted transition-all hover:scale-[1.02] hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={foto.url}
                  alt={`Foto ${foto.tipo.toLowerCase()} — ${foto.patient.nome}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-xs text-white font-medium">{foto.patient.nome}</p>
                  <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    foto.tipo === 'BEFORE' ? 'bg-amber-500/80 text-white' :
                    foto.tipo === 'AFTER' ? 'bg-emerald-500/80 text-white' :
                    'bg-blue-500/80 text-white'
                  }`}>
                    {foto.tipo === 'BEFORE' ? 'Antes' : foto.tipo === 'AFTER' ? 'Depois' : 'Evolução'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Distribuição por tipo */}
      {totalFotos > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-4">Distribuição por tipo</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { tipo: 'Antes', count: totalBefore, color: 'bg-amber-500' },
              { tipo: 'Depois', count: totalAfter, color: 'bg-emerald-500' },
              { tipo: 'Evolução', count: totalEvolution, color: 'bg-blue-500' },
            ].map(({ tipo, count, color }) => (
              <div key={tipo} className="rounded-xl border border-border/50 bg-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
                  <span className="text-sm text-muted-foreground">{tipo}</span>
                </div>
                <p className="text-3xl font-bold tracking-tight">{count}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {totalFotos > 0 ? Math.round((count / totalFotos) * 100) : 0}% do total
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
