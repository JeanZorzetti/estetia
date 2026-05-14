import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { logMedicalAccess } from '@/lib/audit/medical-access-log'
import { decrypt } from '@/lib/encryption'
import { z } from 'zod'

const UpdateRecordSchema = z.object({
  queixaPrincipal: z.string().optional(),
  historiaClinica: z.string().optional(),
  examesAvaliados: z.array(z.object({ tipo: z.string(), resultado: z.string() })).optional(),
  avaliacaoFisica: z.string().optional(),
  hipoteseDiagnostica: z.string().optional(),
  planoTratamento: z.string().optional(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const record = await prisma.medicalRecord.findFirst({
    where: { id, organizationId: user.organizationId },
    include: { profissional: { select: { nome: true } } },
  })

  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let dadosExtras: unknown = null
  if (record.dadosCriptografados) {
    try {
      dadosExtras = JSON.parse(decrypt(record.dadosCriptografados))
    } catch {
      dadosExtras = '[encrypted]'
    }
  }

  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId: record.pacienteId,
    recordType: 'MedicalRecord',
    recordId: id,
    action: 'VIEW',
  })

  return NextResponse.json({
    record: {
      ...record,
      dadosCriptografados: undefined,
      dadosExtras,
    },
  })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const record = await prisma.medicalRecord.findFirst({
    where: { id, organizationId: user.organizationId },
    select: { id: true, pacienteId: true },
  })
  if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = UpdateRecordSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data', details: parsed.error.flatten() }, { status: 400 })
  }

  const updated = await prisma.medicalRecord.update({
    where: { id },
    data: parsed.data,
    select: { id: true, updatedAt: true },
  })

  await logMedicalAccess({
    organizationId: user.organizationId,
    userId: user.id,
    pacienteId: record.pacienteId,
    recordType: 'MedicalRecord',
    recordId: id,
    action: 'UPDATE',
  })

  return NextResponse.json({ record: updated })
}
