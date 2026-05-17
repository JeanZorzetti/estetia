import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getMe, sendMessage } from '@/lib/integrations/telegram-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { id: true, telegramBotToken: true, telegramChatId: true },
      },
    },
  })

  const org = user?.organization
  const orgId = org?.id ?? ''
  if (!org?.telegramBotToken) {
    return NextResponse.json({ error: 'Bot token não configurado' }, { status: 400 })
  }

  try {
    const botToken = decrypt(org.telegramBotToken)
    const me = await getMe({ botToken })

    if (org.telegramChatId) {
      await sendMessage(
        { botToken, chatId: org.telegramChatId },
        `<b>✅ Estetia CRM conectado!</b>\n\nSeu bot @${me.username} está pronto para enviar notificações.`
      )
    }

    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'TELEGRAM',
        action: 'test:connection',
        status: 'SUCCESS',
        request: {} as never,
        response: { ok: true, botUsername: me.username } as never,
      },
    }).catch(() => {})
    return NextResponse.json({ ok: true, botUsername: me.username, messageSent: !!org.telegramChatId })
  } catch (err) {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'TELEGRAM',
        action: 'test:connection',
        status: 'FAILED',
        request: {} as never,
        response: { error: err instanceof Error ? err.message : String(err) } as never,
      },
    }).catch(() => {})
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao testar' },
      { status: 502 }
    )
  }
}
