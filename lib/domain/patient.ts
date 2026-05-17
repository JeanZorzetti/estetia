import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { createMailchimpClient } from '@/lib/integrations/mailchimp-client'
import { createBrevoClient } from '@/lib/integrations/brevo-client'
import { createActiveCampaignClient } from '@/lib/integrations/activecampaign-client'
import { createMailerLiteClient } from '@/lib/integrations/mailerlite-client'
import { createRDStationClient } from '@/lib/integrations/rd-station-client'

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
  const patient = await prisma.patient.create({
    data: {
      ...data,
      organization: { connect: { id: organizationId } },
    },
  })

  // Fire-and-forget: sync to email-marketing providers — never blocks patient creation
  syncPatientToEmailMarketing(organizationId, patient).catch(() => null)

  return patient
}

async function syncPatientToEmailMarketing(
  organizationId: string,
  patient: { nome: string; email?: string | null; telefone?: string | null }
) {
  if (!patient.email) return

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      mailchimpEnabled: true,
      mailchimpApiKey: true,
      mailchimpListId: true,
      mailchimpServer: true,
      brevoEnabled: true,
      brevoApiKey: true,
      brevoListId: true,
      activecampaignEnabled: true,
      activecampaignApiKey: true,
      activecampaignUrl: true,
      mailerliteEnabled: true,
      mailerliteApiKey: true,
      mailerliteGroupId: true,
      rdStationEnabled: true,
      rdStationClientId: true,
      rdStationClientSecret: true,
      rdStationRefreshToken: true,
    },
  })

  if (!org) return

  const [firstName, ...rest] = patient.nome.trim().split(' ')
  const lastName = rest.join(' ')
  const phone = patient.telefone ?? undefined

  const tasks: Promise<unknown>[] = []

  if (org.mailchimpEnabled && org.mailchimpApiKey && org.mailchimpListId && org.mailchimpServer) {
    tasks.push(
      createMailchimpClient(org.mailchimpApiKey, org.mailchimpServer)
        .addOrUpdateContact(org.mailchimpListId, {
          email: patient.email,
          firstName,
          lastName,
          phone,
          tags: ['estetia-crm'],
        })
        .catch(() => null)
    )
  }

  if (org.brevoEnabled && org.brevoApiKey && org.brevoListId) {
    tasks.push(
      createBrevoClient(org.brevoApiKey)
        .addOrUpdateContact(org.brevoListId, {
          email: patient.email,
          firstName,
          lastName,
          phone,
        })
        .catch(() => null)
    )
  }

  if (org.activecampaignEnabled && org.activecampaignApiKey && org.activecampaignUrl) {
    tasks.push(
      createActiveCampaignClient(org.activecampaignApiKey, org.activecampaignUrl)
        .addOrUpdateContact({
          email: patient.email,
          firstName,
          lastName,
          phone,
          tags: ['estetia-crm'],
        })
        .catch(() => null)
    )
  }

  if (org.mailerliteEnabled && org.mailerliteApiKey && org.mailerliteGroupId) {
    tasks.push(
      createMailerLiteClient(org.mailerliteApiKey)
        .addOrUpdateSubscriber(org.mailerliteGroupId, {
          email: patient.email,
          firstName,
          lastName,
          phone,
        })
        .catch(() => null)
    )
  }

  if (
    org.rdStationEnabled &&
    org.rdStationClientId &&
    org.rdStationClientSecret &&
    org.rdStationRefreshToken
  ) {
    tasks.push(
      createRDStationClient(
        org.rdStationClientId,
        org.rdStationClientSecret,
        org.rdStationRefreshToken
      )
        .upsertContact({
          email: patient.email,
          name: patient.nome,
          mobile_phone: phone,
          tags: ['estetia-crm'],
        })
        .catch(() => null)
    )
  }

  await Promise.allSettled(tasks)
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
