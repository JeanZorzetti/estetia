import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { anonymizePatient } from '@/lib/lgpd/anonymize-patient'

/**
 * POST /api/lgpd/delete
 * Body: { pacienteId, reason }
 *
 * LGPD Art. 18, VI — direito ao esquecimento.
 * Anonymization logic lives in lib/lgpd/anonymize-patient.ts
 * (shared with the retention cron).
 */
export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true, orgRole: true },
  })
  if (!user?.organizationId) {
    return NextResponse.json({ error: 'No org' }, { status: 403 })
  }
  // Only admins can trigger LGPD deletion
  if (user.orgRole === 'MEMBER') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { pacienteId, reason } = await req.json()
  if (!pacienteId) {
    return NextResponse.json({ error: 'pacienteId required' }, { status: 400 })
  }

  const patient = await prisma.patient.findFirst({
    where: { id: pacienteId, organizationId: user.organizationId },
    select: { id: true, nome: true },
  })
  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
  }

  const { anonId } = await anonymizePatient({
    pacienteId,
    organizationId: user.organizationId,
    userId: user.id,
    reason: reason ?? 'LGPD Art. 18 VI — direito ao esquecimento',
    source: 'manual',
  })

  return NextResponse.json({
    ok: true,
    message: `Dados do paciente anonimizados. ID: ${anonId}`,
    anonId,
  })
}
