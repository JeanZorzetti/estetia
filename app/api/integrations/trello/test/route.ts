import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTrelloBoard } from '@/lib/integrations/trello-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { trelloApiKey: true, trelloToken: true, trelloBoardId: true },
      },
    },
  })
  const { trelloApiKey, trelloToken, trelloBoardId } = user?.organization ?? {}
  if (!trelloApiKey || !trelloToken || !trelloBoardId) {
    return NextResponse.json({ error: 'API key, token e Board ID obrigatórios' }, { status: 400 })
  }

  try {
    const board = await getTrelloBoard(trelloApiKey, trelloToken, trelloBoardId)
    return NextResponse.json({ ok: true, result: { boardName: board.name, url: board.url } })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha ao consultar Trello' },
      { status: 502 }
    )
  }
}
