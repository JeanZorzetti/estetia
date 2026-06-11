import { NextRequest, NextResponse } from 'next/server'
import { requireClinicalAccess } from '@/lib/clinica/access'
import { prisma } from '@/lib/prisma'
import { requireModule } from '@/lib/guards/require-module'
import { deletePhoto } from '@/lib/storage-photos'

/**
 * DELETE /api/clinica/fotos/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await requireClinicalAccess()
  if (!access.ok) return access.response
  const { user } = access

  const gate = await requireModule('fotos')
  if (!gate.allowed) return NextResponse.json({ error: 'Módulo não ativo' }, { status: 403 })

  const { id } = await params

  const foto = await prisma.patientPhoto.findFirst({
    where: { id, organizationId: user.organizationId },
  })
  if (!foto) return NextResponse.json({ error: 'Foto não encontrada' }, { status: 404 })

  // Delete from MinIO if objectKey is stored (new uploads), ignore errors for legacy URLs
  if (foto.objectKey) {
    try { await deletePhoto(foto.objectKey) } catch {}
  }

  await prisma.patientPhoto.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
