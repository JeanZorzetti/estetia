import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { validateConexaCredentials } from '@/lib/integrations/conexa-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { conexaApiKey: true, conexaClinicId: true },
      },
    },
  })

  const org = user?.organization
  if (!org?.conexaApiKey) {
    return NextResponse.json({ error: 'API key não configurada' }, { status: 400 })
  }
  if (!org.conexaClinicId) {
    return NextResponse.json({ error: 'Clinic ID não configurado' }, { status: 400 })
  }

  try {
    const apiKey = decrypt(org.conexaApiKey)
    const account = await validateConexaCredentials({
      apiKey,
      clinicId: org.conexaClinicId,
    })
    return NextResponse.json({ ok: true, account })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao testar' },
      { status: 502 }
    )
  }
}
