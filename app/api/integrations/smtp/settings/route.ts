import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/encryption'
import { invalidateOrgTransporter } from '@/lib/integrations/smtp-client'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const body = await req.json()
  const {
    enabled,
    host,
    port,
    username,
    password,
    fromEmail,
    fromName,
    useTLS,
  } = body

  const data: Record<string, unknown> = {}
  if (typeof enabled === 'boolean') data.smtpEnabled = enabled
  if (typeof host === 'string') data.smtpHost = host.trim() || null
  if (typeof port === 'number' && port > 0) data.smtpPort = port
  if (typeof username === 'string') data.smtpUsername = username.trim() || null
  if (typeof password === 'string' && password && !password.startsWith('•')) {
    data.smtpPassword = encrypt(password)
  }
  if (typeof fromEmail === 'string') data.smtpFromEmail = fromEmail.trim() || null
  if (typeof fromName === 'string') data.smtpFromName = fromName.trim() || null
  if (typeof useTLS === 'boolean') data.smtpUseTLS = useTLS

  await prisma.organization.update({
    where: { id: user.organizationId },
    data,
  })

  invalidateOrgTransporter(user.organizationId)

  return NextResponse.json({ ok: true })
}
