import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CreatePatientSchema } from '@/lib/patients/schema'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100)
  const cursor = searchParams.get('cursor')

  const where = {
    organizationId: user.organizationId,
    ...(q && {
      OR: [
        { nome: { contains: q, mode: 'insensitive' as const } },
        { email: { contains: q, mode: 'insensitive' as const } },
        { telefone: { contains: q } },
      ],
    }),
  }

  const patients = await prisma.patient.findMany({
    where,
    select: {
      id: true,
      nome: true,
      telefone: true,
      email: true,
      dataNascimento: true,
      sexo: true,
      origem: true,
      dadosSensiveis: true,
      tags: true,
      createdAt: true,
      treatments: {
        select: {
          sessions: {
            select: { dataAgendada: true },
            orderBy: { dataAgendada: 'desc' },
            take: 1,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
  })

  const nextCursor = patients.length === limit ? patients[patients.length - 1].id : null

  return NextResponse.json({ patients, nextCursor })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await req.json()
  const parsed = CreatePatientSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.flatten() }, { status: 400 })
  }

  const { nome, telefone, email, cpf, dataNascimento, sexo, origem, alergias, medicacoesUso, contraindicacoes, observacoesMedicas, tags } = parsed.data

  const patient = await prisma.patient.create({
    data: {
      organizationId: user.organizationId,
      nome,
      telefone: telefone || null,
      email: email || null,
      cpf: cpf || null,
      dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
      sexo: sexo || null,
      origem: origem || null,
      alergias,
      medicacoesUso,
      contraindicacoes,
      observacoesMedicas: observacoesMedicas || null,
      tags,
      consentLgpd: {
        aceitoEm: new Date().toISOString(),
        ip: req.headers.get('x-forwarded-for') ?? 'unknown',
        versaoDoc: '1.0',
      },
    },
    select: { id: true, nome: true, telefone: true, email: true, createdAt: true },
  })

  return NextResponse.json({ patient }, { status: 201 })
}
