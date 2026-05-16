import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getMyAccount } from '@/lib/integrations/asaas-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { asaasApiKey: true, asaasEnvironment: true },
      },
    },
  })

  const org = user?.organization
  if (!org?.asaasApiKey) {
    return NextResponse.json({ error: 'API key não configurada' }, { status: 400 })
  }

  try {
    const apiKey = decrypt(org.asaasApiKey)
    const env = (org.asaasEnvironment ?? 'sandbox') as 'sandbox' | 'production'
    const account = await getMyAccount({ apiKey, environment: env })
    return NextResponse.json({ ok: true, account })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao testar' },
      { status: 502 }
    )
  }
}
