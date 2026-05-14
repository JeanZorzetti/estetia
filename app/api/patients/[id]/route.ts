import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UpdatePatientSchema } from '@/lib/patients/schema'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const patient = await prisma.patient.findFirst({
    where: { id, organizationId: user.organizationId },
    include: {
      _count: {
        select: { treatments: true, anamneses: true, medicalRecords: true, consentLogs: true },
      },
    },
  })
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  return NextResponse.json({ patient })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const existing = await prisma.patient.findFirst({
    where: { id, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!existing) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const body = await req.json()
  const parsed = UpdatePatientSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 400 })
  }

  const { nome, telefone, email, cpf, dataNascimento, sexo, origem, alergias, medicacoesUso, contraindicacoes, observacoesMedicas, tags } = parsed.data

  const patient = await prisma.patient.update({
    where: { id },
    data: {
      ...(nome !== undefined && { nome }),
      ...(telefone !== undefined && { telefone: telefone || null }),
      ...(email !== undefined && { email: email || null }),
      ...(cpf !== undefined && { cpf: cpf || null }),
      ...(dataNascimento !== undefined && { dataNascimento: dataNascimento ? new Date(dataNascimento) : null }),
      ...(sexo !== undefined && { sexo }),
      ...(origem !== undefined && { origem }),
      ...(alergias !== undefined && { alergias }),
      ...(medicacoesUso !== undefined && { medicacoesUso }),
      ...(contraindicacoes !== undefined && { contraindicacoes }),
      ...(observacoesMedicas !== undefined && { observacoesMedicas: observacoesMedicas || null }),
      ...(tags !== undefined && { tags }),
    },
    select: { id: true, nome: true, telefone: true, email: true, updatedAt: true },
  })

  return NextResponse.json({ patient })
}
