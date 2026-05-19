import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { requireModule } from '@/lib/guards/require-module'
import { createPhotoUploadUrl } from '@/lib/storage-photos'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const UploadSchema = z.object({
  patientId: z.string().uuid(),
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
})

/**
 * POST /api/clinica/fotos/upload
 * Returns a presigned PUT URL for direct browser-to-MinIO upload.
 * After uploading, client calls POST /api/clinica/fotos to save the record.
 */
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
  const parsed = UploadSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { patientId, contentType } = parsed.data

  const patient = await prisma.patient.findFirst({
    where: { id: patientId, organizationId: user.organizationId },
    select: { id: true },
  })
  if (!patient) return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })

  const photoId = uuidv4()

  const { uploadUrl, objectKey, publicUrl } = await createPhotoUploadUrl({
    orgId: user.organizationId,
    patientId,
    photoId,
    contentType,
  })

  return NextResponse.json({ uploadUrl, objectKey, publicUrl, photoId })
}
