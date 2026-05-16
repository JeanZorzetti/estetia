import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/encryption'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const { enabled, apiKey, publicKey } = await req.json()

  const data: Record<string, unknown> = {}
  if (typeof enabled === 'boolean') data.memedEnabled = enabled
  if (typeof publicKey === 'string') data.memedPublicKey = publicKey.trim() || null
  if (typeof apiKey === 'string' && apiKey && !apiKey.startsWith('•')) {
    data.memedApiKey = encrypt(apiKey)
  }

  await prisma.organization.update({ where: { id: user.organizationId }, data })
  return NextResponse.json({ ok: true })
}
