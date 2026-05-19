import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { requireModule } from '@/lib/guards/require-module'

/**
 * DELETE /api/clinica/fotos/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const gate = await requireModule('fotos')
  if (!gate.allowed) return NextResponse.json({ error: 'Módulo não ativo' }, { status: 403 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'No org' }, { status: 403 })

  const { id } = await params

  const foto = await prisma.patientPhoto.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!foto) return NextResponse.json({ error: 'Foto não encontrada' }, { status: 404 })

  await prisma.patientPhoto.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
