import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GuiaTissUpdateSchema } from '@/lib/financeiro/schema'

async function getOrgId() {
  const session = await getSession()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  return user?.organizationId ?? null
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const guia = await prisma.guiaTiss.findFirst({
    where: { id, organizationId: orgId },
    include: {
      operadora: { select: { id: true, nome: true, codigoAns: true } },
      paciente: { select: { id: true, nome: true, telefone: true } },
    },
  })
  if (!guia) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({
    guia: {
      ...guia,
      valorProcedimento: guia.valorProcedimento != null ? Number(guia.valorProcedimento) : null,
      valorTotal: guia.valorTotal != null ? Number(guia.valorTotal) : null,
    },
  })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const existing = await prisma.guiaTiss.findFirst({ where: { id, organizationId: orgId }, select: { id: true } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const parsed = GuiaTissUpdateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const data: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(parsed.data)) {
    if (v === undefined) continue
    if (k === 'dataExecucao') data[k] = v ? new Date(v as string) : null
    else data[k] = v === '' ? null : v
  }

  const guia = await prisma.guiaTiss.update({ where: { id }, data })
  return NextResponse.json({
    guia: {
      ...guia,
      valorProcedimento: guia.valorProcedimento != null ? Number(guia.valorProcedimento) : null,
      valorTotal: guia.valorTotal != null ? Number(guia.valorTotal) : null,
    },
  })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const existing = await prisma.guiaTiss.findFirst({ where: { id, organizationId: orgId }, select: { id: true } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.guiaTiss.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
