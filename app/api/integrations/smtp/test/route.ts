import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { sendTestEmail, type SmtpConfig } from '@/lib/integrations/smtp-client'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      email: true,
      organization: {
        select: {
          smtpHost: true,
          smtpPort: true,
          smtpUsername: true,
          smtpPassword: true,
          smtpFromEmail: true,
          smtpFromName: true,
          smtpUseTLS: true,
        },
      },
    },
  })

  if (!user?.organization) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const body = await req.json().catch(() => ({}))
  const org = user.organization

  // Use body credentials if present, otherwise load from DB
  const host = body.host || org.smtpHost
  const port = body.port || org.smtpPort || 587
  const username = body.username || org.smtpUsername
  const fromEmail = body.fromEmail || org.smtpFromEmail
  const fromName = body.fromName ?? org.smtpFromName
  const useTLS = typeof body.useTLS === 'boolean' ? body.useTLS : org.smtpUseTLS

  let password = body.password
  if (!password && org.smtpPassword) {
    try {
      password = decrypt(org.smtpPassword)
    } catch {
      return NextResponse.json({ error: 'Falha ao decriptar senha salva' }, { status: 500 })
    }
  }

  if (!host || !username || !password || !fromEmail) {
    return NextResponse.json({ error: 'Configuração incompleta' }, { status: 400 })
  }

  const config: SmtpConfig = { host, port, username, password, fromEmail, fromName, useTLS }
  const result = await sendTestEmail(config, user.email)

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 502 })
  return NextResponse.json({ ok: true, messageId: result.messageId })
}
