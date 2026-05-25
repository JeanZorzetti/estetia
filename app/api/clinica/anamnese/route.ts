import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'
import { encrypt, decrypt } from '@/lib/encryption'
import { createHash } from 'crypto'
import { z } from 'zod'

const CreateAnamnesisSchema = z.object({
  pacienteId: z.string().uuid(),
  treatmentId: z.string().uuid().optional(),
  profissionalId: z.string().uuid().optional(),
  templateHash: z.string().optional(),
  respostas: z.record(z.string(), z.unknown()),
  assinaturaDigital: z.string().optional(),
  preenchidoPor: z.enum(['profissional', 'paciente', 'recepcao']).default('profissional'),
})

/**
 * GET /api/clinica/anamnese?pacienteId=
 * List anamneses metadata for a patient (no encrypted content).
 *
 * POST /api/clinica/anamnese
 * Create new anamnesis — answers are AES-256-GCM encrypted at rest.
 */

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const pacienteId = req.nextUrl.searchParams.get('pacienteId')
  if (!pacienteId) return NextResponse.json({ error: 'pacienteId required' }, { status: 400 })

  const anamneses = await prisma.anamnesis.findMany({
    where: { pacienteId, organizationId: user.organizationId },
    select: {
      id: true,
      treatmentId: true,
      profissionalId: true,
      templateHash: true,
      preenchidoPor: true,
      assinadoEm: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId,
    recordType: 'Anamnesis',
    recordId: pacienteId,
    action: 'VIEW',
  })

  return NextResponse.json({ anamneses })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const body = await req.json()
  const parsed = CreateAnamnesisSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const { pacienteId, treatmentId, profissionalId, templateHash, respostas, assinaturaDigital, preenchidoPor } = parsed.data

  // Verify patient belongs to org
  const patient = await prisma.patient.findFirst({
    where: { id: pacienteId, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 })

  let respostasEncrypted: string
  try {
    respostasEncrypted = encrypt(JSON.stringify(respostas))
  } catch (err) {
    console.error('[anamnese POST] encrypt error:', err)
    return NextResponse.json({ error: 'Encryption unavailable' }, { status: 500 })
  }

  // Hash signature if provided
  const sigHash = assinaturaDigital
    ? createHash('sha256').update(assinaturaDigital).digest('hex')
    : null

  const anamnesis = await prisma.anamnesis.create({
    data: {
      organizationId: user.organizationId,
      pacienteId,
      treatmentId: treatmentId ?? null,
      profissionalId: profissionalId ?? null,
      templateHash: templateHash ?? null,
      respostas: respostasEncrypted,
      assinaturaDigital: sigHash,
      assinadoEm: assinaturaDigital ? new Date() : null,
      preenchidoPor,
    },
    select: { id: true, createdAt: true },
  })

  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId,
    recordType: 'Anamnesis',
    recordId: anamnesis.id,
    action: 'CREATE',
  })

  return NextResponse.json({ anamnesis }, { status: 201 })
}
