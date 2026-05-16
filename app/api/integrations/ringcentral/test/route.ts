import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getMyExtension } from '@/lib/integrations/ringcentral-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organization: { select: { ringcentralJwtToken: true } } },
  })
  const enc = user?.organization?.ringcentralJwtToken
  if (!enc) return NextResponse.json({ error: 'JWT Token não configurado' }, { status: 400 })
  try {
    const account = await getMyExtension({ jwtToken: decrypt(enc) })
    return NextResponse.json({ ok: true, account })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Erro' }, { status: 502 })
  }
}
