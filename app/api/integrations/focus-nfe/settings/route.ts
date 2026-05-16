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

  const { enabled, token, environment } = await req.json()

  const data: Record<string, unknown> = {}
  if (typeof enabled === 'boolean') data.focusnfeEnabled = enabled
  if (typeof environment === 'string' && ['homologacao', 'producao'].includes(environment)) {
    data.focusnfeEnvironment = environment
  }
  if (typeof token === 'string' && token && !token.startsWith('•')) {
    data.focusnfeToken = encrypt(token)
  }

  await prisma.organization.update({ where: { id: user.organizationId }, data })
  return NextResponse.json({ ok: true })
}
