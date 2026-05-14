import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateProfessionalCouncil, bulkValidateOrg } from '@/lib/integrations/cfm-validator'

/**
 * POST /api/clinica/cfm-validate
 * Body: { professionalId } — validate single professional
 *    or { bulk: true }     — validate all org professionals
 */
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const body = await req.json()

  if (body.bulk === true) {
    const stats = await bulkValidateOrg(user.organizationId)
    return NextResponse.json({ ok: true, ...stats })
  }

  const { professionalId } = body
  if (!professionalId) {
    return NextResponse.json({ error: 'professionalId required' }, { status: 400 })
  }

  // Verify belongs to org
  const prof = await prisma.professional.findFirst({
    where: { id: professionalId, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!prof) return NextResponse.json({ error: 'Professional not found' }, { status: 404 })

  const result = await validateProfessionalCouncil(professionalId)
  return NextResponse.json({ ok: true, result })
}
