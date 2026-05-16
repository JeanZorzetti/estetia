import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const VALID_PROVIDERS = ['intelbras', 'yealink', 'asterisk', 'generic']

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const { enabled, provider } = await req.json()

  const data: Record<string, unknown> = {}
  if (typeof enabled === 'boolean') data.pabxEnabled = enabled
  if (typeof provider === 'string' && VALID_PROVIDERS.includes(provider)) {
    data.pabxProvider = provider
  }

  await prisma.organization.update({
    where: { id: user.organizationId },
    data,
  })

  return NextResponse.json({ ok: true })
}
