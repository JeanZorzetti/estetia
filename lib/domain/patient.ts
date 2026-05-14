import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export type PatientWithRelations = Prisma.PatientGetPayload<{
  include: {
    profissionalAssigned: true
    treatments: { include: { sessions: true } }
    consentLogs: true
  }
}>

export async function getPatientsByOrg(
  organizationId: string,
  opts: {
    search?: string
    page?: number
    pageSize?: number
    origem?: string
  } = {}
) {
  const { search, page = 1, pageSize = 50, origem } = opts
  const skip = (page - 1) * pageSize

  const where: Prisma.PatientWhereInput = {
    organizationId,
    ...(origem && { origem }),
    ...(search && {
      OR: [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { telefone: { contains: search } },
      ],
    }),
  }

  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        profissionalAssigned: { select: { id: true, nome: true } },
        _count: { select: { treatments: true } },
      },
    }),
    prisma.patient.count({ where }),
  ])

  return { patients, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function getPatientById(id: string, organizationId: string) {
  return prisma.patient.findFirst({
    where: { id, organizationId },
    include: {
      profissionalAssigned: true,
      treatments: {
        orderBy: { createdAt: 'desc' },
        include: {
          sessions: { orderBy: { dataAgendada: 'desc' } },
          profissionalResponsavel: { select: { id: true, nome: true } },
        },
      },
      medicalRecords: { orderBy: { dataAtendimento: 'desc' } },
      anamneses: { orderBy: { createdAt: 'desc' } },
      consentLogs: { orderBy: { aceitoEm: 'desc' } },
    },
  })
}

export async function createPatient(
  organizationId: string,
  data: Omit<Prisma.PatientCreateInput, 'organization'>
) {
  return prisma.patient.create({
    data: {
      ...data,
      organization: { connect: { id: organizationId } },
    },
  })
}

export async function updatePatient(
  id: string,
  organizationId: string,
  data: Prisma.PatientUpdateInput
) {
  return prisma.patient.updateMany({
    where: { id, organizationId },
    data,
  })
}

export async function getPatientStats(organizationId: string) {
  const [total, byOrigem, recentes] = await Promise.all([
    prisma.patient.count({ where: { organizationId } }),
    prisma.patient.groupBy({
      by: ['origem'],
      where: { organizationId },
      _count: true,
    }),
    prisma.patient.count({
      where: {
        organizationId,
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
  ])

  return { total, byOrigem, recentes }
}
