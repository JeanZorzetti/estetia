import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { validateDoctoraliaCredentials } from '@/lib/integrations/doctoralia-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: { doctoraliaApiKey: true, doctoraliaClinicId: true },
      },
    },
  })

  const org = user?.organization
  if (!org?.doctoraliaApiKey) {
    return NextResponse.json({ error: 'API key não configurada' }, { status: 400 })
  }
  if (!org.doctoraliaClinicId) {
    return NextResponse.json({ error: 'Clinic ID não configurado' }, { status: 400 })
  }

  try {
    const apiKey = decrypt(org.doctoraliaApiKey)
    const facility = await validateDoctoraliaCredentials({
      apiKey,
      clinicId: org.doctoraliaClinicId,
    })
    return NextResponse.json({ ok: true, facility })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao testar' },
      { status: 502 }
    )
  }
}
