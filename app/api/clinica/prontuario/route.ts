import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'
import { encrypt } from '@/lib/encryption'
import { z } from 'zod'

const CreateRecordSchema = z.object({
  pacienteId: z.string().uuid(),
  profissionalId: z.string().uuid().optional(),
  dataAtendimento: z.string().datetime().optional(),
  queixaPrincipal: z.string().optional(),
  historiaClinica: z.string().optional(),
  examesAvaliados: z
    .array(z.object({ tipo: z.string(), resultado: z.string(), data: z.string().optional() }))
    .optional(),
  avaliacaoFisica: z.string().optional(),
  hipoteseDiagnostica: z.string().optional(),
  planoTratamento: z.string().optional(),
  dadosExtras: z.record(z.string(), z.unknown()).optional(),
})

/**
 * GET /api/clinica/prontuario?pacienteId=
 * Returns all medical records for a patient (non-encrypted fields only — no dadosCriptografados).
 * Full content available per-record at GET /api/clinica/prontuario/[id].
 *
 * POST /api/clinica/prontuario
 * Create a new medical record. dadosExtras are AES-256-GCM encrypted.
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

  const records = await prisma.medicalRecord.findMany({
    where: { pacienteId, organizationId: user.organizationId },
    select: {
      id: true,
      dataAtendimento: true,
      queixaPrincipal: true,
      hipoteseDiagnostica: true,
      planoTratamento: true,
      profissionalId: true,
      profissional: { select: { nome: true } },
      createdAt: true,
    },
    orderBy: { dataAtendimento: 'desc' },
  })

  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId,
    recordType: 'MedicalRecord',
    recordId: pacienteId,
    action: 'VIEW',
  })

  return NextResponse.json({ records })
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
  const parsed = CreateRecordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const {
    pacienteId,
    profissionalId,
    dataAtendimento,
    queixaPrincipal,
    historiaClinica,
    examesAvaliados,
    avaliacaoFisica,
    hipoteseDiagnostica,
    planoTratamento,
    dadosExtras,
  } = parsed.data

  const patient = await prisma.patient.findFirst({
    where: { id: pacienteId, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 })

  const dadosCriptografados = dadosExtras
    ? encrypt(JSON.stringify(dadosExtras))
    : null

  const record = await prisma.medicalRecord.create({
    data: {
      organizationId: user.organizationId,
      pacienteId,
      profissionalId: profissionalId ?? null,
      dataAtendimento: dataAtendimento ? new Date(dataAtendimento) : new Date(),
      queixaPrincipal: queixaPrincipal ?? null,
      historiaClinica: historiaClinica ?? null,
      examesAvaliados: examesAvaliados ?? undefined,
      avaliacaoFisica: avaliacaoFisica ?? null,
      hipoteseDiagnostica: hipoteseDiagnostica ?? null,
      planoTratamento: planoTratamento ?? null,
      dadosCriptografados,
    },
    select: { id: true, dataAtendimento: true },
  })

  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId,
    recordType: 'MedicalRecord',
    recordId: record.id,
    action: 'CREATE',
  })

  return NextResponse.json({ record }, { status: 201 })
}
