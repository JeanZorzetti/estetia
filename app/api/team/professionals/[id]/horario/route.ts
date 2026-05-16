import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const actor = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true },
  })
  if (!actor?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const { id } = await params
  const body = await req.json()
  const { cargaHoraria } = body

  const professional = await prisma.professional.findUnique({
    where: { id, organizationId: actor.organizationId },
  })
  if (!professional) return NextResponse.json({ error: 'Profissional não encontrado' }, { status: 404 })

  const updated = await prisma.professional.update({
    where: { id },
    data: { cargaHoraria },
  })

  return NextResponse.json(updated)
}
