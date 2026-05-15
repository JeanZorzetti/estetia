import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StatusChangeSchema } from '@/lib/agenda/schema'

async function getUser() {
  const session = await getSession()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true },
  })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const existing = await prisma.treatmentSession.findFirst({
    where: { id, organizationId: user.organizationId },
    select: { id: true, observacoes: true },
  })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = StatusChangeSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const data: Record<string, unknown> = { status: parsed.data.status }
  if (parsed.data.status === 'REALIZADA') data.dataRealizada = new Date()
  if (parsed.data.observacao) {
    data.observacoes = (existing.observacoes ? existing.observacoes + '\n' : '') +
      `[${new Date().toLocaleString('pt-BR')}] ${parsed.data.observacao}`
  }
  data.googleSyncStatus = 'PENDING'

  const session = await prisma.treatmentSession.update({
    where: { id },
    data,
    include: {
      profissional: { select: { id: true, nome: true } },
      sala: { select: { id: true, nome: true, cor: true } },
      treatment: {
        include: {
          paciente: { select: { id: true, nome: true } },
          procedure: { select: { id: true, nome: true } },
        },
      },
    },
  })

  return NextResponse.json({ session })
}
