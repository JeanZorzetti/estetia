import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { requireModule } from '@/lib/guards/require-module'
import { z } from 'zod'

const CreateFotoSchema = z.object({
  patientId: z.string().uuid(),
  url: z.string().url(),
  objectKey: z.string().optional(),
  tipo: z.enum(['BEFORE', 'AFTER', 'EVOLUTION']),
  anguloPadronizado: z.string().optional(),
  areaCorpo: z.string().optional(),
  consentimentoConcedido: z.boolean().default(false),
  treatmentSessionId: z.string().uuid().optional(),
})

/**
 * GET /api/clinica/fotos?patientId=
 * POST /api/clinica/fotos
 */

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const gate = await requireModule('fotos')
  if (!gate.allowed) return NextResponse.json({ error: 'Módulo não ativo' }, { status: 403 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const patientId = req.nextUrl.searchParams.get('patientId')
  if (!patientId) return NextResponse.json({ error: 'patientId required' }, { status: 400 })

  const tipo = req.nextUrl.searchParams.get('tipo') as 'BEFORE' | 'AFTER' | 'EVOLUTION' | null

  const fotos = await prisma.patientPhoto.findMany({
    where: {
      patientId,
      organizationId: user.organizationId,
      ...(tipo ? { tipo } : {}),
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(fotos)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const gate = await requireModule('fotos')
  if (!gate.allowed) return NextResponse.json({ error: 'Módulo não ativo' }, { status: 403 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const body = await req.json()
  const parsed = CreateFotoSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { patientId, url, objectKey, tipo, anguloPadronizado, areaCorpo, consentimentoConcedido, treatmentSessionId } = parsed.data

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, organizationId: user.organizationId },
  })
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const foto = await prisma.patientPhoto.create({
    data: {
      organizationId: user.organizationId,
      patientId,
      url,
      objectKey: objectKey ?? null,
      tipo,
      anguloPadronizado: anguloPadronizado ?? null,
      areaCorpo: areaCorpo ?? null,
      consentimentoConcedido,
      treatmentSessionId: treatmentSessionId ?? null,
    },
  })

  return NextResponse.json(foto, { status: 201 })
}
