import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getAccountInfo } from '@/lib/integrations/viber-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { organization: { select: { viberAuthToken: true } } },
  })

  const org = user?.organization
  if (!org?.viberAuthToken) {
    return NextResponse.json({ error: 'Token Viber não configurado' }, { status: 400 })
  }

  try {
    const authToken = decrypt(org.viberAuthToken)
    const account = await getAccountInfo({ authToken })
    return NextResponse.json({ ok: true, account })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao testar' },
      { status: 502 }
    )
  }
}
