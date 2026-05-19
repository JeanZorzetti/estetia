import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { requireModule } from '@/lib/guards/require-module'

const RespostaSchema = z.object({
  status: z.enum(['AUTORIZADA', 'NEGADA', 'GLOSADA', 'PAGA', 'CANCELADA']),
  xmlResposta: z.string().optional().or(z.literal('')),
  motivoGlosa: z.string().max(2000).optional().or(z.literal('')),
})

async function getOrgId() {
  const session = await getSession()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const gate = await requireModule('tiss')
  if (!gate.allowed) return NextResponse.json({ error: 'Módulo TISS não está ativo' }, { status: 403 })
  const { id } = await params

  const existing = await prisma.guiaTiss.findFirst({ where: { id, organizationId: orgId }, select: { id: true } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = RespostaSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const guia = await prisma.guiaTiss.update({
    where: { id },
    data: {
      status: parsed.data.status,
      xmlResposta: parsed.data.xmlResposta || null,
      motivoGlosa: parsed.data.motivoGlosa || null,
    },
  })

  return NextResponse.json({
    guia: {
      ...guia,
      valorProcedimento: guia.valorProcedimento != null ? Number(guia.valorProcedimento) : null,
      valorTotal: guia.valorTotal != null ? Number(guia.valorTotal) : null,
    },
  })
}
