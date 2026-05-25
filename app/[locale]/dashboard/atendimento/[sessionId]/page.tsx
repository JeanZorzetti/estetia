import { notFound, redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ExecucaoClient } from "./execucao-client"

export const dynamic = "force-dynamic"

export default async function AtendimentoExecucaoPage({
  params,
}: {
  params: Promise<{ locale: string; sessionId: string }>
}) {
  const { sessionId } = await params

  const session = await getSession()
  if (!session?.user?.email) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true, orgRole: true },
  })
  if (!user?.organizationId) redirect("/login")

  const treatmentSession = await prisma.treatmentSession.findFirst({
    where: { id: sessionId, organizationId: user.organizationId },
    include: {
      treatment: {
        include: {
          paciente: {
            select: { id: true, nome: true, telefone: true, email: true, fotoPerfil: true },
          },
          procedure: { select: { id: true, nome: true, categoria: true } },
        },
      },
      profissional: { select: { id: true, nome: true } },
      sala: { select: { id: true, nome: true, cor: true } },
    },
  })
  if (!treatmentSession) notFound()

  // Buscar ids das sessões do mesmo dia para navegação anterior/próximo
  const sessionDate = new Date(treatmentSession.dataAgendada)
  const dayStart = new Date(sessionDate)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)

  const daySessions = await prisma.treatmentSession.findMany({
    where: {
      organizationId: user.organizationId,
      dataAgendada: { gte: dayStart, lt: dayEnd },
    },
    select: { id: true },
    orderBy: { dataAgendada: "asc" },
  })

  const currentIndex = daySessions.findIndex((s) => s.id === sessionId)
  const prevId = currentIndex > 0 ? daySessions[currentIndex - 1].id : null
  const nextId = currentIndex < daySessions.length - 1 ? daySessions[currentIndex + 1].id : null

  const serialize = <T extends object>(obj: T): T =>
    JSON.parse(JSON.stringify(obj))

  return (
    <ExecucaoClient
      session={serialize(treatmentSession)}
      prevId={prevId}
      nextId={nextId}
      canEdit={user.orgRole !== "MEMBER"}
    />
  )
}
