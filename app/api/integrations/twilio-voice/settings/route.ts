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

  const { enabled, accountSid, authToken, fromNumber } = await req.json()

  const data: Record<string, unknown> = {}
  if (typeof enabled === 'boolean') data.twilioVoiceEnabled = enabled
  if (typeof accountSid === 'string') data.twilioAccountSid = accountSid
  if (typeof fromNumber === 'string') data.twilioFromNumber = fromNumber
  if (typeof authToken === 'string' && authToken && !authToken.startsWith('•')) {
    data.twilioAuthToken = encrypt(authToken)
  }

  await prisma.organization.update({ where: { id: user.organizationId }, data })
  return NextResponse.json({ ok: true })
}
