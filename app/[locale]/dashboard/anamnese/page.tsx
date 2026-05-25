import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'
import { CentralAnamnesesClient } from '@/components/anamnese/central-anamneses-client'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export default async function AnamnesesCentralPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    profissionalId?: string
    status?: string
    from?: string
    to?: string
    page?: string
  }>
}) {
  const { q = '', profissionalId = '', status = 'all', from = '', to = '', page = '1' } = await searchParams
  const currentPage = Math.max(1, parseInt(page) || 1)
  const pageSize = 50

  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    organizationId: user.organizationId,
    ...(status === 'assinadas' && { assinadoEm: { not: null } }),
    ...(status === 'pendentes' && { assinadoEm: null }),
    ...(profissionalId && { profissionalId }),
    ...(from || to
      ? {
          createdAt: {
            ...(from ? { gte: new Date(from) } : {}),
            ...(to ? { lte: new Date(new Date(to).setHours(23, 59, 59, 999)) } : {}),
          },
        }
      : {}),
    ...(q && {
      paciente: {
        nome: { contains: q, mode: 'insensitive' as const },
      },
    }),
  }

  const [anamneses, totalCount, professionals] = await Promise.all([
    prisma.anamnesis.findMany({
      where,
      select: {
        id: true,
        treatmentId: true,
        preenchidoPor: true,
        assinadoEm: true,
        createdAt: true,
        paciente: { select: { id: true, nome: true } },
        profissional: { select: { nome: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.anamnesis.count({ where }),
    prisma.professional.findMany({
      where: { organizationId: user.organizationId },
      select: { id: true, nome: true },
      orderBy: { nome: 'asc' },
    }),
  ])

  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId: 'central-anamneses',
    recordType: 'Anamnesis',
    recordId: 'central-anamneses',
    action: 'VIEW',
    metadata: { page: 'central-anamneses', filters: { q, profissionalId, status, from, to } },
  })

  const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full py-8 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col gap-6">
      {/* Micro-grain texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[radial-gradient(#0A1F3D_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Ambient lighting */}
      <div className="absolute top-12 -left-64 w-[500px] h-[500px] rounded-full bg-[#489FB5]/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-24 -right-64 w-[500px] h-[500px] rounded-full bg-[#0A1F3D]/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/40 pb-6">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#489FB5]/20 bg-[#489FB5]/5 text-[9px] font-bold text-[#2d7a8e] tracking-widest uppercase mb-3">
              Gestão Clínica · Central de Anamneses
            </span>
            <h1 className="font-serif font-extrabold text-3xl text-slate-800 tracking-wide">
              Anamneses
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-1 max-w-xl leading-relaxed">
              Fichas clínicas e questionários de saúde de todos os pacientes.{' '}
              <span className="font-bold text-[#2d7a8e] bg-[#489FB5]/10 px-2 py-0.5 rounded border border-[#489FB5]/15">
                {totalCount} anamnese{totalCount !== 1 ? 's' : ''}
              </span>{' '}
              registrada{totalCount !== 1 ? 's' : ''}.
            </p>
          </div>
        </div>

        {/* Client — filters + list */}
        <Suspense fallback={<AnamnesesSkeleton />}>
          <CentralAnamnesesClient
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            initialData={serialize(anamneses) as any}
            professionals={serialize(professionals)}
            initialFilters={{ q, profissionalId, status, from, to }}
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </Suspense>
      </div>
    </div>
  )
}

function AnamnesesSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-12 w-full rounded-2xl border border-slate-200/50 bg-white/40 backdrop-blur-md animate-pulse" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-[90px] w-full rounded-2xl border border-slate-200/50 bg-white/40 backdrop-blur-md p-4 flex items-start gap-3 animate-pulse"
        >
          <div className="flex-1 flex flex-col gap-2 mt-1">
            <Skeleton className="h-4 w-48 bg-slate-200/60" />
            <Skeleton className="h-3 w-64 bg-slate-200/60" />
            <Skeleton className="h-7 w-36 bg-slate-200/60 rounded-xl mt-1" />
          </div>
          <Skeleton className="h-5 w-20 bg-slate-200/60 rounded-full" />
        </div>
      ))}
    </div>
  )
}
