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
      organization: { select: { notionApiKey: true, notionDatabaseId: true } },
    },
  })
  const apiKey = user?.organization?.notionApiKey
  const databaseId = user?.organization?.notionDatabaseId
  if (!apiKey || !databaseId) {
    return NextResponse.json({ error: 'API key e Database ID são obrigatórios' }, { status: 400 })
  }

  try {
    const db = await getNotionDatabase(apiKey, databaseId)
    const title = db.title?.[0]?.plain_text ?? 'Database'
    return NextResponse.json({ ok: true, result: { databaseTitle: title } })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha ao consultar Notion' },
      { status: 502 }
    )
  }
}
