/**
 * Clinical RBAC guard — LGPD Art. 46 (access restriction to health data).
 *
 * Access to clinical records (prontuário, anamnese, fotos clínicas) is
 * limited to:
 *   - users linked to an active Professional in the organization, or
 *   - org OWNER / GERENTE (management oversight & DPO duties).
 *
 * Reception/sales roles (VENDEDOR, MEMBER, etc.) keep access to agenda,
 * waitlist and scheduling routes — those do NOT use this guard.
 */

import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const MANAGEMENT_ROLES = ['OWNER', 'GERENTE'] as const

export type ClinicalAccess =
  | {
      ok: true
      user: { id: string; organizationId: string; orgRole: string }
      professional: { id: string } | null
    }
  | { ok: false; response: NextResponse }

export async function requireClinicalAccess(): Promise<ClinicalAccess> {
  const session = await getSession()
  if (!session?.user?.email) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true, orgRole: true },
  })
  if (!user?.organizationId) {
    return { ok: false, response: NextResponse.json({ error: 'No org' }, { status: 403 }) }
  }

  const professional = await prisma.professional.findFirst({
    where: { userId: user.id, organizationId: user.organizationId, ativo: true },
    select: { id: true },
  })

  const isManagement = (MANAGEMENT_ROLES as readonly string[]).includes(user.orgRole)

  if (!professional && !isManagement) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: 'Forbidden — acesso a dados clínicos restrito a profissionais habilitados' },
        { status: 403 }
      ),
    }
  }

  return {
    ok: true,
    user: { id: user.id, organizationId: user.organizationId, orgRole: user.orgRole },
    professional,
  }
}
