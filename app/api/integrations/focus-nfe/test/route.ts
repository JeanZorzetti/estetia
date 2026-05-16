import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { listEmpresas } from '@/lib/integrations/focusnfe-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { focusnfeToken: true, focusnfeEnvironment: true },
      },
    },
  })

  const org = user?.organization
  if (!org?.focusnfeToken) {
    return NextResponse.json({ error: 'Token não configurado' }, { status: 400 })
  }

  try {
    const token = decrypt(org.focusnfeToken)
    const env = (org.focusnfeEnvironment ?? 'homologacao') as 'homologacao' | 'producao'
    const empresas = await listEmpresas({ token, environment: env })
    return NextResponse.json({ ok: true, empresas })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao testar' },
      { status: 502 }
    )
  }
}
