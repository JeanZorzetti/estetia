import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { buildSettingsData } from '@/lib/integrations/generic-credential-helpers'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const data = buildSettingsData(await req.json(), 'callgearEnabled', [
    { name: 'callgearApiKey', sensitive: true },
  ])
  await prisma.organization.update({ where: { id: user.organizationId }, data })
  return NextResponse.json({ ok: true })
}
