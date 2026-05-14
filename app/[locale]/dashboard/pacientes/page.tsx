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
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pacientes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {patients.length} paciente{patients.length !== 1 ? 's' : ''} cadastrado{patients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/dashboard/pacientes/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Novo Paciente
        </Link>
      </div>

      {/* List */}
      <Suspense fallback={
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      }>
        <PacientesListClient
          initialPatients={serialize(patients)}
          initialQuery={q}
        />
      </Suspense>
    </div>
  )
}
