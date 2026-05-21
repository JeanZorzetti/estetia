import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { requireModule } from '@/lib/guards/require-module'
import { ModuleLocked } from '@/components/upgrade/module-locked'
import { Camera, ImageOff, TrendingUp, Users, Sparkles } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

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
    <div className="relative min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-100/90 p-8 overflow-hidden flex flex-col gap-8">
      {/* Halos estelares de fundo de alta costura */}
      <div className="pointer-events-none absolute -left-10 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-cyan-500/5 to-blue-600/5 blur-[120px]" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-500/5 to-orange-600/5 blur-[150px]" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-pink-500/5 to-purple-600/5 blur-[130px]" />

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#C5A059]/30 bg-gradient-to-r from-[#C5A059]/10 to-[#E5C07B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#9A7D42] shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059] animate-pulse" />
          👑 Arquivo Estético VIP • Antes e Depois
        </div>
        <h1 className="font-serif text-4xl font-extrabold tracking-tight text-slate-800">
          Vitrine de Fotos Clínicas
        </h1>
        <p className="text-sm font-medium text-slate-500/90 flex items-center gap-1.5">
          <span>Galeria fotográfica por paciente com consentimento LGPD ativo</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="text-xs font-semibold text-[#C5A059] uppercase tracking-wider">Acesso Seguro</span>
        </p>
      </div>

      {/* KPIs */}
      <div className="relative z-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard 
          label="Total de fotos" 
          value={totalFotos} 
          icon={Camera} 
          glowColor="bg-cyan-500/20"
          iconBg="bg-gradient-to-br from-cyan-50 to-cyan-100/50"
          iconColor="text-cyan-600"
        />
        <StatCard 
          label="Pacientes com fotos" 
          value={patientsWithPhotos} 
          icon={Users} 
          glowColor="bg-amber-500/20"
          iconBg="bg-gradient-to-br from-amber-50 to-amber-100/50"
          iconColor="text-[#C5A059]"
        />
        <StatCard 
          label="Before / After" 
          value={totalBefore + totalAfter} 
          icon={TrendingUp} 
          glowColor="bg-emerald-500/20"
          iconBg="bg-gradient-to-br from-emerald-50 to-emerald-100/50"
          iconColor="text-emerald-600"
        />
        <StatCard 
          label="Evolução" 
          value={totalEvolution} 
          icon={Sparkles} 
          glowColor="bg-pink-500/20"
          iconBg="bg-gradient-to-br from-pink-50 to-pink-100/50"
          iconColor="text-pink-600"
        />
      </div>

      {/* Galeria recente */}
      <div className="relative z-10">
        {recentFotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 rounded-[2.2rem] border border-slate-200/50 bg-white/30 backdrop-blur-xl p-20 text-center relative overflow-hidden shadow-xl max-w-3xl mx-auto">
            {/* Moldura interna */}
            <div className="absolute inset-0.5 border border-white/60 pointer-events-none rounded-[2.1rem]" />
            
            {/* Câmera clínica suspensa tridimensional com glows */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 border border-white shadow-xl group hover:scale-105 transition-transform duration-500">
              <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/10 to-pink-500/10 rounded-[2rem] blur-md opacity-70 animate-pulse" />
              <Camera className="h-10 w-10 text-slate-600 relative z-10" />
              <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-ping" />
              <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]" />
            </div>

            <div className="space-y-2 max-w-md relative z-10">
              <span className="inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700/90 border border-amber-500/20">
                👑 Estetia Gallery Archive
              </span>
              <h3 className="font-serif text-2xl font-bold text-slate-800">
                Nenhuma joia fotográfica registrada
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                Acesse a ficha de um paciente para fazer o upload seguro e organizar o portfólio clínico dele com termos de consentimento ativos.
              </p>
            </div>

            <Link
              href="/dashboard/pacientes"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#C5A059] to-[#E5C07B] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/15 hover:shadow-amber-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Users className="h-4 w-4" />
              <span>Selecionar Paciente</span>
            </Link>
          </div>
        ) : (
          <div className="relative rounded-[2.2rem] border border-slate-200/50 bg-white/40 p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Moldura interna de luxo de vidro fosco */}
            <div className="absolute inset-0.5 border border-white/60 pointer-events-none rounded-[2.1rem]" />
            
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-xl font-bold text-slate-800">Fotos Recentes</h2>
                <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-700 border border-cyan-500/10">
                  {totalFotos} {totalFotos === 1 ? 'Foto' : 'Fotos'}
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-slate-200/80 to-transparent mx-4" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 relative z-10">
              {recentFotos.map((foto) => (
                <Link
                  key={foto.id}
                  href={`/dashboard/pacientes/${foto.patientId}`}
                  className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-white bg-slate-100 shadow-md transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-cyan-400/30"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={foto.url}
                    alt={`Foto ${foto.tipo.toLowerCase()} — ${foto.patient.nome}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay degradê reativo que revela informações do paciente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="font-serif text-sm font-bold text-white tracking-wide truncate mb-1.5 drop-shadow-md">
                      {foto.patient.nome}
                    </p>
                    
                    <span className={`inline-flex items-center justify-center self-start rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${
                      foto.tipo === 'BEFORE' ? 'bg-[#C5A059]/80 border-[#C5A059]/30 text-white' :
                      foto.tipo === 'AFTER' ? 'bg-emerald-500/80 border-emerald-500/30 text-white' :
                      'bg-blue-500/80 border-blue-500/30 text-white'
                    }`}>
                      {foto.tipo === 'BEFORE' ? 'Antes' : foto.tipo === 'AFTER' ? 'Depois' : 'Evolução'}
                    </span>
                  </div>
                  
                  {/* Pequena Badge discreta visível sem hover */}
                  <div className="absolute top-2 right-2 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                    <span className={`inline-flex items-center justify-center h-4 w-4 rounded-full text-[0px] shadow-md border-2 border-white ${
                      foto.tipo === 'BEFORE' ? 'bg-[#C5A059]' :
                      foto.tipo === 'AFTER' ? 'bg-emerald-500' :
                      'bg-blue-500'
                    }`} title={foto.tipo === 'BEFORE' ? 'Antes' : foto.tipo === 'AFTER' ? 'Depois' : 'Evolução'} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Distribuição por tipo */}
      {totalFotos > 0 && (
        <div className="relative z-10 rounded-[2.2rem] border border-slate-200/50 bg-white/40 p-8 backdrop-blur-xl shadow-xl overflow-hidden">
          {/* Moldura interna */}
          <div className="absolute inset-0.5 border border-white/60 pointer-events-none rounded-[2.1rem]" />

          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-serif text-xl font-bold text-slate-800">Distribuição por Categoria</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200/80 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 relative z-10">
            {[
              { tipo: 'Antes', count: totalBefore, gemaColor: 'from-amber-400 to-[#C5A059] shadow-amber-500/30', glowColor: 'bg-amber-500/5', type: 'BEFORE' },
              { tipo: 'Depois', count: totalAfter, gemaColor: 'from-emerald-400 to-emerald-600 shadow-emerald-500/30', glowColor: 'bg-emerald-500/5', type: 'AFTER' },
              { tipo: 'Evolução', count: totalEvolution, gemaColor: 'from-cyan-400 to-blue-600 shadow-blue-500/30', glowColor: 'bg-blue-500/5', type: 'EVOLUTION' },
            ].map(({ tipo, count, gemaColor, glowColor }) => (
              <div 
                key={tipo} 
                className="relative group rounded-2xl border border-slate-200/40 bg-white/30 p-5 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md overflow-hidden"
              >
                <div className="absolute inset-0.5 border border-white/40 pointer-events-none rounded-[14px]" />
                <div className={`absolute -right-4 -bottom-4 w-12 h-12 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${glowColor}`} />
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {/* Gema tridimensional brilhante de acento */}
                    <div className={`h-3 w-3 rounded-full bg-gradient-to-br ${gemaColor} shadow-[0_0_8px_var(--tw-shadow-color)]`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{tipo}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 border border-slate-200/30 rounded-full px-2 py-0.5">
                    {totalFotos > 0 ? Math.round((count / totalFotos) * 100) : 0}%
                  </span>
                </div>
                
                <div className="flex items-baseline gap-1">
                  <p className="font-serif text-3.5xl font-extrabold text-slate-800 tracking-tight leading-none tabular-nums">
                    {count}
                  </p>
                  <span className="text-xs text-slate-400 font-medium">registros</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
