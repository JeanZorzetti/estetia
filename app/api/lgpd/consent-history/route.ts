import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const CreateConsentSchema = z.object({
  pacienteId: z.string().uuid(),
  tipo: z.enum(['LGPD_DADOS_SAUDE', 'USO_FOTO_MARKETING', 'AUTORIZACAO_PROCEDIMENTO', 'TERMO_RISCO', 'TERMO_MENOR_IDADE']),
  versaoDocumento: z.string().min(1),
  evidencia: z
    .object({
      metodo: z.enum(['click', 'assinatura_digital', 'voz']),
      evidencia: z.string().optional(),
    })
    .optional(),
})

/**
 * GET /api/lgpd/consent-history?pacienteId=
 * Returns all consent entries for a patient (active + revoked).
 *
 * POST /api/lgpd/consent-history
 * Body: { pacienteId, tipo, versaoDocumento, evidencia? }
 * Creates a new consent log entry.
 */

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) {
    return NextResponse.json({ error: 'No org' }, { status: 403 })
  }

  const pacienteId = req.nextUrl.searchParams.get('pacienteId')
  if (!pacienteId) {
    return NextResponse.json({ error: 'pacienteId required' }, { status: 400 })
  }

  const consents = await prisma.consentLog.findMany({
    where: { pacienteId, organizationId: user.organizationId },
    orderBy: { aceitoEm: 'desc' },
  })

  return NextResponse.json({ consents })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) {
    return NextResponse.json({ error: 'No org' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = CreateConsentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const { pacienteId, tipo, versaoDocumento, evidencia } = parsed.data

  const patient = await prisma.patient.findFirst({
    where: { id: pacienteId, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!patient) {
    return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    undefined

  const consent = await prisma.consentLog.create({
    data: {
      organizationId: user.organizationId,
      pacienteId,
      tipo,
      versaoDocumento,
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') ?? undefined,
      evidencia: evidencia ?? undefined,
    },
  })

  return NextResponse.json({ consent }, { status: 201 })
}

/**
 * PATCH /api/lgpd/consent-history?consentId=
 * Revoke a consent (sets revokedAt = now).
 */
export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) {
    return NextResponse.json({ error: 'No org' }, { status: 403 })
  }

  const consentId = req.nextUrl.searchParams.get('consentId')
  if (!consentId) {
    return NextResponse.json({ error: 'consentId required' }, { status: 400 })
  }

  const consent = await prisma.consentLog.findFirst({
    where: { id: consentId, organizationId: user.organizationId },
  })
  if (!consent) {
    return NextResponse.json({ error: 'Consent not found' }, { status: 404 })
  }
  if (consent.revokedAt) {
    return NextResponse.json({ error: 'Already revoked' }, { status: 409 })
  }

  const updated = await prisma.consentLog.update({
    where: { id: consentId },
    data: { revokedAt: new Date() },
  })

  return NextResponse.json({ consent: updated })
}
