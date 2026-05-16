import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, organizationId: true },
  })
  if (!user?.organizationId) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

  const { integrationId, notes } = await req.json()
  if (!integrationId || typeof integrationId !== 'string') {
    return NextResponse.json({ error: 'integrationId obrigatório' }, { status: 400 })
  }

  await prisma.integrationUpvote.upsert({
    where: { userId_integrationId: { userId: user.id, integrationId } },
    create: {
      userId: user.id,
      organizationId: user.organizationId,
      integrationId,
      notes: typeof notes === 'string' ? notes.trim() || null : null,
    },
    update: {
      notes: typeof notes === 'string' ? notes.trim() || null : null,
    },
  })

  const total = await prisma.integrationUpvote.count({ where: { integrationId } })
  return NextResponse.json({ ok: true, total, voted: true })
}

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const sp = new URL(req.url).searchParams
  const integrationId = sp.get('integrationId')
  if (!integrationId) return NextResponse.json({ error: 'integrationId obrigatório' }, { status: 400 })

  const [total, mine] = await Promise.all([
    prisma.integrationUpvote.count({ where: { integrationId } }),
    prisma.integrationUpvote.findUnique({
      where: { userId_integrationId: { userId: user.id, integrationId } },
    }),
  ])

  return NextResponse.json({ total, voted: !!mine })
}
