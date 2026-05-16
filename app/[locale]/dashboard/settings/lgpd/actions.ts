'use server'

import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { normalizeRole } from '@/lib/role-permissions'

async function requireOwner() {
  const session = await getSession()
  if (!session?.user?.email) throw new Error('Unauthorized')
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) throw new Error('Unauthorized')
  if (normalizeRole(user.orgRole) !== 'OWNER') {
    throw new Error('Apenas OWNER pode editar configurações de LGPD')
  }
  return user
}

export async function updateDpo(input: {
  dpoName?: string | null
  dpoEmail?: string | null
  dpoPhone?: string | null
  dpoCpf?: string | null
}) {
  const owner = await requireOwner()
  await prisma.organization.update({
    where: { id: owner.organizationId },
    data: {
      dpoName: input.dpoName?.trim() || null,
      dpoEmail: input.dpoEmail?.trim() || null,
      dpoPhone: input.dpoPhone?.trim() || null,
      dpoCpf: input.dpoCpf?.trim() || null,
    },
  })
  revalidatePath('/dashboard/settings/lgpd')
  return { success: true }
}

export async function updateRetention(months: number) {
  const owner = await requireOwner()
  if (months < 6 || months > 120) {
    throw new Error('Retenção deve estar entre 6 e 120 meses')
  }
  await prisma.organization.update({
    where: { id: owner.organizationId },
    data: { lgpdRetentionMonths: months },
  })
  revalidatePath('/dashboard/settings/lgpd')
  return { success: true }
}

export async function requestPatientExport(_patientId: string) {
  await requireOwner()
  // TODO: enqueue background job to build ZIP export of all patient data
  // Placeholder — feature completa em sprint dedicada
  return { success: true, status: 'queued' }
}
