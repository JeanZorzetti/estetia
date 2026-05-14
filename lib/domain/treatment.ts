import { prisma } from '@/lib/prisma'
import { Prisma, TreatmentStatus, TreatmentType } from '@prisma/client'

export async function getTreatmentsByOrg(
  organizationId: string,
  opts: {
    status?: TreatmentStatus
    tipoTratamento?: TreatmentType
    pacienteId?: string
    profissionalId?: string
    page?: number
    pageSize?: number
  } = {}
) {
  const { status, tipoTratamento, pacienteId, profissionalId, page = 1, pageSize = 50 } = opts
  const skip = (page - 1) * pageSize

  const where: Prisma.TreatmentWhereInput = {
    organizationId,
    ...(status && { status }),
    ...(tipoTratamento && { tipoTratamento }),
    ...(pacienteId && { pacienteId }),
    ...(profissionalId && { profissionalResponsavelId: profissionalId }),
  }

  const [treatments, total] = await Promise.all([
    prisma.treatment.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        paciente: { select: { id: true, nome: true, telefone: true, fotoPerfil: true } },
        profissionalResponsavel: { select: { id: true, nome: true } },
        _count: { select: { sessions: true } },
      },
    }),
    prisma.treatment.count({ where }),
  ])

  return { treatments, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function getTreatmentById(id: string, organizationId: string) {
  return prisma.treatment.findFirst({
    where: { id, organizationId },
    include: {
      paciente: true,
      profissionalResponsavel: true,
      sessions: {
        orderBy: { dataAgendada: 'asc' },
        include: {
          profissional: { select: { id: true, nome: true } },
          sala: { select: { id: true, nome: true } },
        },
      },
      anamneses: { orderBy: { createdAt: 'desc' } },
    },
  })
}

export async function createTreatment(
  organizationId: string,
  data: {
    pacienteId: string
    tipoTratamento?: TreatmentType
    descricaoCustomizada?: string
    valorTotal?: number
    sessoesPrevistas?: number
    profissionalResponsavelId?: string
    observacoes?: string
    dataInicio?: Date
  }
) {
  return prisma.treatment.create({
    data: {
      organizationId,
      pacienteId: data.pacienteId,
      tipoTratamento: data.tipoTratamento ?? 'OUTROS',
      descricaoCustomizada: data.descricaoCustomizada,
      valorTotal: data.valorTotal,
      sessoesPrevistas: data.sessoesPrevistas ?? 1,
      profissionalResponsavelId: data.profissionalResponsavelId,
      observacoes: data.observacoes,
      dataInicio: data.dataInicio,
    },
    include: {
      paciente: { select: { id: true, nome: true } },
    },
  })
}

export async function scheduleSession(
  treatmentId: string,
  organizationId: string,
  data: {
    dataAgendada: Date
    profissionalId?: string
    salaId?: string
    duracaoMinutos?: number
    observacoes?: string
  }
) {
  const [session] = await Promise.all([
    prisma.treatmentSession.create({
      data: {
        organizationId,
        treatmentId,
        dataAgendada: data.dataAgendada,
        profissionalId: data.profissionalId,
        salaId: data.salaId,
        duracaoMinutos: data.duracaoMinutos,
        observacoes: data.observacoes,
        status: 'AGENDADA',
      },
    }),
    prisma.treatment.updateMany({
      where: { id: treatmentId, organizationId },
      data: { status: 'AGENDADO' },
    }),
  ])
  return session
}

export async function markSessionRealizada(
  sessionId: string,
  organizationId: string,
  data: {
    observacoes?: string
    produtosAplicados?: object
  } = {}
) {
  const [session] = await prisma.$transaction([
    prisma.treatmentSession.update({
      where: { id: sessionId },
      data: {
        status: 'REALIZADA',
        dataRealizada: new Date(),
        observacoes: data.observacoes,
        produtosAplicados: data.produtosAplicados ?? Prisma.JsonNull,
      },
    }),
    // Increment sessoesRealizadas on the parent treatment
    prisma.$executeRaw`
      UPDATE "Treatment"
      SET "sessoesRealizadas" = "sessoesRealizadas" + 1
      WHERE "id" = (SELECT "treatmentId" FROM "TreatmentSession" WHERE "id" = ${sessionId})
        AND "organizationId" = ${organizationId}
    `,
  ])
  return session
}

export async function getTreatmentKanban(organizationId: string) {
  const treatments = await prisma.treatment.findMany({
    where: { organizationId, status: { not: 'CANCELADO' } },
    orderBy: { updatedAt: 'desc' },
    include: {
      paciente: { select: { id: true, nome: true, fotoPerfil: true, telefone: true } },
      profissionalResponsavel: { select: { id: true, nome: true } },
      _count: { select: { sessions: true } },
    },
  })

  // Group by status for kanban columns
  const kanban: Record<string, typeof treatments> = {
    AVALIACAO: [],
    ORCAMENTO_ENVIADO: [],
    AGENDADO: [],
    EM_ANDAMENTO: [],
    FINALIZADO: [],
    RETORNO: [],
  }

  for (const t of treatments) {
    if (kanban[t.status]) kanban[t.status].push(t)
  }

  return kanban
}
