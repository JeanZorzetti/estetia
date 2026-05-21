import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { PacientesListClient } from '@/components/pacientes/pacientes-list-client'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams

  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) redirect('/login')

  const where = {
    organizationId: user.organizationId,
    ...(q && {
      OR: [
        { nome: { contains: q, mode: 'insensitive' as const } },
        { email: { contains: q, mode: 'insensitive' as const } },
        { telefone: { contains: q } },
      ],
    }),
  }

  const patients = await prisma.patient.findMany({
    where,
    select: {
      id: true,
      nome: true,
      telefone: true,
      email: true,
      dataNascimento: true,
      dadosSensiveis: true,
      origem: true,
      tags: true,
      createdAt: true,
      treatments: {
        select: {
          sessions: {
            select: { dataAgendada: true },
            orderBy: { dataAgendada: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full py-8 px-4 sm:px-6 lg:px-8 overflow-hidden flex flex-col gap-6">
      {/* Premium Micro-Grain background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[radial-gradient(#0A1F3D_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Decorative ambient lighting halos */}
      <div className="absolute top-12 -left-64 w-[500px] h-[500px] rounded-full bg-[#489FB5]/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-24 -right-64 w-[500px] h-[500px] rounded-full bg-[#0A1F3D]/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 w-full">
        {/* Header Section with Editorial Elegance */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/40 pb-6">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C5A059]/20 bg-[#C5A059]/5 text-[9px] font-bold text-[#8E6D31] tracking-widest uppercase mb-3">
              👑 Gestão Operacional VIP · Registro de Pacientes
            </span>
            <h1 className="font-serif font-extrabold text-3xl text-slate-800 tracking-wide">
              Pacientes
            </h1>
            <p className="text-xs font-medium text-slate-400 mt-1 max-w-xl leading-relaxed">
              Consulte históricos clínicos, dados cadastrais e listagem de registros. Há{' '}
              <span className="font-bold text-[#8E6D31] bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/15">
                {patients.length} paciente{patients.length !== 1 ? 's' : ''}
              </span>{' '}
              cadastrado{patients.length !== 1 ? 's' : ''} no ecossistema.
            </p>
          </div>
          <div className="flex items-center flex-shrink-0">
            <Link
              href="/dashboard/pacientes/novo"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5C07B] px-5 py-3 text-xs font-bold text-white shadow-[0_10px_20px_rgba(197,160,89,0.2)] hover:shadow-[0_12px_25px_rgba(197,160,89,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_8px_15px_rgba(197,160,89,0.2)] transition-all duration-300 tracking-wider uppercase"
            >
              <UserPlus className="w-4 h-4 text-white/95" />
              Novo Paciente
            </Link>
          </div>
        </div>

        {/* List */}
        <Suspense fallback={
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div 
                key={i} 
                className="h-16 w-full rounded-2xl border border-slate-200/50 bg-white/40 backdrop-blur-md p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 w-1/3">
                  <Skeleton className="w-9 h-9 rounded-full bg-slate-200/60" />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-28 bg-slate-200/60" />
                    <Skeleton className="h-3 w-16 bg-slate-200/60" />
                  </div>
                </div>
                <Skeleton className="h-3 w-20 bg-slate-200/60 hidden sm:block" />
                <Skeleton className="h-3 w-24 bg-slate-200/60 hidden md:block" />
              </div>
            ))}
          </div>
        }>
          <PacientesListClient
            initialPatients={serialize(patients)}
            initialQuery={q}
          />
        </Suspense>
      </div>
    </div>
  )
}
