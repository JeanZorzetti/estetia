import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { startOfWeek, endOfWeek, addDays } from 'date-fns'
import { AgendaShell } from '@/components/agenda/v2/agenda-shell'

export const metadata = { title: 'Agenda — Estetia CRM' }
export const dynamic = 'force-dynamic'

const serialize = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

export default async function AgendaPage() {
  const session = await getSession()
  if (!session?.user?.email) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true, orgRole: true },
  })
  if (!user?.organizationId) redirect('/login')

  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

  const [sessions, profissionais, salas, procedures] = await Promise.all([
    prisma.treatmentSession.findMany({
      where: {
        organizationId: user.organizationId,
        dataAgendada: { gte: weekStart, lte: addDays(weekEnd, 1) },
      },
      include: {
        profissional: { select: { id: true, nome: true } },
        sala: { select: { id: true, nome: true, cor: true } },
        treatment: {
          include: {
            paciente: { select: { id: true, nome: true, telefone: true } },
            procedure: { select: { id: true, nome: true, categoria: true } },
          },
        },
      },
      orderBy: { dataAgendada: 'asc' },
      take: 500,
    }),
    prisma.professional.findMany({
      where: { organizationId: user.organizationId, ativo: true },
      select: { id: true, nome: true },
      orderBy: { nome: 'asc' },
    }),
    prisma.clinicRoom.findMany({
      where: { organizationId: user.organizationId, ativo: true },
      select: { id: true, nome: true, cor: true, tipo: true },
      orderBy: { nome: 'asc' },
    }),
    prisma.procedure.findMany({
      where: { organizationId: user.organizationId, ativo: true },
      select: { id: true, nome: true, categoria: true, duracaoMinutos: true },
      orderBy: { nome: 'asc' },
    }),
  ])

  return (
    <AgendaShell
      initialSessions={serialize(sessions) as any}
      profissionais={profissionais}
      salas={salas}
      procedures={procedures}
    />
  )
}
