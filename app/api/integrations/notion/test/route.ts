import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getNotionDatabase } from '@/lib/integrations/notion-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: { select: { id: true, notionApiKey: true, notionDatabaseId: true } },
    },
  })
  const org = user?.organization
  const orgId = org?.id ?? ''
  const apiKey = org?.notionApiKey
  const databaseId = org?.notionDatabaseId
  if (!apiKey || !databaseId) {
    return NextResponse.json({ error: 'API key e Database ID são obrigatórios' }, { status: 400 })
  }

  try {
    const db = await getNotionDatabase(apiKey, databaseId)
    const title = db.title?.[0]?.plain_text ?? 'Database'
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'NOTION',
        action: 'test:connection',
        status: 'SUCCESS',
        request: {} as never,
        response: { ok: true, databaseTitle: title } as never,
      },
    }).catch(() => {})
    return NextResponse.json({ ok: true, result: { databaseTitle: title } })
  } catch (err) {
    await prisma.integrationLog.create({
      data: {
        organizationId: orgId,
        type: 'NOTION',
        action: 'test:connection',
        status: 'FAILED',
        request: {} as never,
        response: { error: err instanceof Error ? err.message : String(err) } as never,
      },
    }).catch(() => {})
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha ao consultar Notion' },
      { status: 502 }
    )
  }
}
