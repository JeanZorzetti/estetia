import { OrgRole } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export interface ClinicalPermissions {
  canAccessProntuario: boolean
  canScheduleAppointments: boolean
  canValidateCouncil: boolean
  canManageProfessionals: boolean
}

const OWNER_CLINICAL_PERMISSIONS: ClinicalPermissions = {
  canAccessProntuario: true,
  canScheduleAppointments: true,
  canValidateCouncil: true,
  canManageProfessionals: true,
}

const DEFAULT_CLINICAL_PERMISSIONS: ClinicalPermissions = {
  canAccessProntuario: false,
  canScheduleAppointments: true,
  canValidateCouncil: false,
  canManageProfessionals: false,
}

function normalizeRole(role: OrgRole): OrgRole {
  return role === 'MEMBER' ? 'VENDEDOR' : role
}

export async function getClinicalPermissions(
  organizationId: string,
  role: OrgRole
): Promise<ClinicalPermissions> {
  const normalized = normalizeRole(role)
  if (normalized === 'OWNER') return OWNER_CLINICAL_PERMISSIONS

  const row = await prisma.rolePermissions.findUnique({
    where: { organizationId_role: { organizationId, role: normalized } },
    select: {
      canAccessProntuario: true,
      canScheduleAppointments: true,
      canValidateCouncil: true,
      canManageProfessionals: true,
    },
  })

  if (!row) return DEFAULT_CLINICAL_PERMISSIONS
  return {
    canAccessProntuario: row.canAccessProntuario,
    canScheduleAppointments: row.canScheduleAppointments,
    canValidateCouncil: row.canValidateCouncil,
    canManageProfessionals: row.canManageProfessionals,
  }
}

export async function canManageProfessionalsGate(
  organizationId: string,
  role: OrgRole
): Promise<boolean> {
  if (normalizeRole(role) === 'OWNER') return true
  const perms = await getClinicalPermissions(organizationId, role)
  return perms.canManageProfessionals
}

export async function canValidateCouncilGate(
  organizationId: string,
  role: OrgRole
): Promise<boolean> {
  if (normalizeRole(role) === 'OWNER') return true
  const perms = await getClinicalPermissions(organizationId, role)
  return perms.canValidateCouncil
}
