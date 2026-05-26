import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
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
  const session = await getSession()
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })

  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return new NextResponse('Forbidden', { status: 403 })

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
