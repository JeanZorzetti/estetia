import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadMedia, getMediaUrl } from '@/lib/storage'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

async function getOrgId() {
  const session = await getSession()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, orgRole: true },
  })
  if (user?.orgRole === 'MEMBER') return null
  return user?.organizationId ?? null
}

export async function POST(req: Request) {
  const orgId = await getOrgId()
  if (!orgId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG or WEBP.' }, { status: 415 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 413 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const ts = Date.now()

  try {
    const key = await uploadMedia({
      orgId,
      contactId: 'professionals',
      messageId: `photo-${ts}`,
      buffer,
      mimetype: file.type,
      fileName: file.name,
    })

    const signedUrl = await getMediaUrl(key)
    return NextResponse.json({ key, signedUrl })
  } catch (err) {
    return NextResponse.json({
      error: err instanceof Error ? err.message : 'Upload failed',
    }, { status: 500 })
  }
}
