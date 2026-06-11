import { NextRequest, NextResponse } from 'next/server'
import { requireClinicalAccess } from '@/lib/clinica/access'
import { prisma } from '@/lib/prisma'
import { getPhotoStream } from '@/lib/storage-photos'

/**
 * GET /api/clinica/fotos/[id]/blob
 * Authenticated proxy: validates session + org ownership, then streams from MinIO.
 * Browser never accesses MinIO directly — keeps patient photos private (LGPD).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await requireClinicalAccess()
  if (!access.ok) return access.response
  const { user } = access

  const { id } = await params

  const photo = await prisma.patientPhoto.findFirst({
    where: { id, organizationId: user.organizationId },
    select: { url: true, objectKey: true },
  })
  if (!photo) return new NextResponse('Not found', { status: 404 })

  // Fallback for legacy rows where objectKey was not stored: extract from public URL
  const objectKey = photo.objectKey ?? photo.url.split('/patient-photos/')[1]
  if (!objectKey) return new NextResponse('Invalid object key', { status: 500 })

  const { body, contentType, contentLength } = await getPhotoStream(objectKey)

  return new NextResponse(body as unknown as BodyInit, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=300',
      ...(contentLength != null ? { 'Content-Length': String(contentLength) } : {}),
    },
  })
}
