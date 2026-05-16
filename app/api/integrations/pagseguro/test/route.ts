import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getAccount } from '@/lib/integrations/pagseguro-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { pagseguroToken: true, pagseguroEnvironment: true },
      },
    },
  })

  const org = user?.organization
  if (!org?.pagseguroToken) {
    return NextResponse.json({ error: 'Token PagSeguro não configurado' }, { status: 400 })
  }

  try {
    const token = decrypt(org.pagseguroToken)
    const environment = (org.pagseguroEnvironment ?? 'sandbox') as 'sandbox' | 'production'
    const account = await getAccount({ token, environment })
    return NextResponse.json({ ok: true, account })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao conectar com PagSeguro' },
      { status: 400 }
    )
  }
}
