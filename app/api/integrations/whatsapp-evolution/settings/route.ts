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

  const body = await req.json()
  const { enabled, baseUrl, instance, apiKey } = body as {
    enabled?: boolean
    baseUrl?: string
    instance?: string
    apiKey?: string
  }

  const data: Record<string, unknown> = {}
  if (typeof enabled === 'boolean') data.evolutionEnabled = enabled
  if (typeof baseUrl === 'string') data.evolutionBaseUrl = baseUrl.trim() || null
  if (typeof instance === 'string') data.evolutionInstance = instance.trim() || null
  if (typeof apiKey === 'string' && apiKey && !apiKey.startsWith('•')) {
    try {
      data.evolutionApiKey = encrypt(apiKey)
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'Erro ao encriptar API key' },
        { status: 500 }
      )
    }
  }

  await prisma.organization.update({
    where: { id: user.organizationId },
    data,
  })

  return NextResponse.json({ ok: true })
}
