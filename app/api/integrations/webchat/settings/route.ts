import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateWidgetSecret } from '@/lib/integrations/webchat-client'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true, organization: { select: { webchatWidgetSecret: true } } },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const { enabled, allowedOrigins, regenerate } = await req.json()

  const data: Record<string, unknown> = {}
  if (typeof enabled === 'boolean') data.webchatEnabled = enabled
  if (typeof allowedOrigins === 'string') data.webchatAllowedOrigins = allowedOrigins.slice(0, 1000)
  if (regenerate === true || !user.organization?.webchatWidgetSecret) {
    data.webchatWidgetSecret = generateWidgetSecret()
  }

  const updated = await prisma.organization.update({
    where: { id: user.organizationId },
    data,
    select: { webchatWidgetSecret: true, webchatEnabled: true },
  })
  return NextResponse.json({ ok: true, widgetSecret: updated.webchatWidgetSecret })
}
