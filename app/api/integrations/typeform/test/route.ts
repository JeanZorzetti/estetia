import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getTypeform } from '@/lib/integrations/typeform-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: { select: { typeformApiKey: true, typeformFormId: true } },
    },
  })
  const { typeformApiKey, typeformFormId } = user?.organization ?? {}
  if (!typeformApiKey || !typeformFormId) {
    return NextResponse.json({ error: 'API key e Form ID obrigatórios' }, { status: 400 })
  }

  try {
    const form = await getTypeform(typeformApiKey, typeformFormId)
    return NextResponse.json({ ok: true, result: { formTitle: form.title } })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Falha ao consultar Typeform' },
      { status: 502 }
    )
  }
}
