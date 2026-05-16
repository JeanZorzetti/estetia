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
  const data: Record<string, unknown> = {}

  // Save Azure app credentials (BYOA)
  if (typeof body.clientId === 'string' && body.clientId)
    data.outlookClientId = body.clientId.trim()

  if (typeof body.clientSecret === 'string' && body.clientSecret && !body.clientSecret.startsWith('•'))
    data.outlookClientSecret = encrypt(body.clientSecret.trim())

  if (typeof body.tenantId === 'string' && body.tenantId)
    data.outlookTenantId = body.tenantId.trim()

  // Disconnect: wipe OAuth tokens
  if (body.disconnect === true) {
    data.outlookCalendarEnabled = false
    data.outlookCalendarRefreshToken = null
    data.outlookCalendarEmail = null
  }

  // Full reset: also wipe Azure credentials
  if (body.reset === true) {
    data.outlookCalendarEnabled = false
    data.outlookCalendarRefreshToken = null
    data.outlookCalendarEmail = null
    data.outlookClientId = null
    data.outlookClientSecret = null
    data.outlookTenantId = null
  }

  await prisma.organization.update({ where: { id: user.organizationId }, data })
  return NextResponse.json({ ok: true })
}
