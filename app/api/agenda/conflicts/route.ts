import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ConflictCheckSchema } from '@/lib/agenda/schema'
import { detectConflicts } from '@/lib/agenda/conflicts'

async function getUser() {
  const session = await getSession()
  if (!session?.user?.email) return null
  return prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organizationId: true },
  })
}

export async function POST(req: Request) {
  const user = await getUser()
  if (!user?.organizationId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = ConflictCheckSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })

  const conflicts = await detectConflicts({
    organizationId: user.organizationId,
    dataAgendada: new Date(parsed.data.dataAgendada),
    duracaoMinutos: parsed.data.duracaoMinutos,
    profissionalId: parsed.data.profissionalId,
    salaId: parsed.data.salaId,
    ignoreSessionId: parsed.data.ignoreSessionId,
  })

  return NextResponse.json({ conflicts })
}
