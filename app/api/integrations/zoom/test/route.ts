import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getMe } from '@/lib/integrations/zoom-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { zoomAccountId: true, zoomClientId: true, zoomClientSecret: true },
      },
    },
  })

  const org = user?.organization
  if (!org?.zoomAccountId || !org.zoomClientId || !org.zoomClientSecret) {
    return NextResponse.json({ error: 'Credenciais Zoom incompletas' }, { status: 400 })
  }

  try {
    const clientSecret = decrypt(org.zoomClientSecret)
    const me = await getMe({
      accountId: org.zoomAccountId,
      clientId: org.zoomClientId,
      clientSecret,
    })
    return NextResponse.json({ ok: true, user: me })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao testar' },
      { status: 502 }
    )
  }
}
