import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getMyProfile } from '@/lib/integrations/linkedin-ads-client'

export async function POST() {
  const session = await getSession()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      organization: {
        select: {
          linkedinAdsAccessToken: true,
          linkedinAdsAccountId: true,
        },
      },
    },
  })

  const org = user?.organization
  if (!org?.linkedinAdsAccessToken) {
    return NextResponse.json({ error: 'Token nao configurado' }, { status: 400 })
  }

  try {
    const accessToken = decrypt(org.linkedinAdsAccessToken)
    const profile = await getMyProfile({ accessToken })

    const name = [profile.localizedFirstName, profile.localizedLastName]
      .filter(Boolean)
      .join(' ')

    return NextResponse.json({
      ok: true,
      result: {
        stored: true,
        note: name
          ? `Token valido — perfil: ${name} (ID: ${profile.id})`
          : `Token valido — ID: ${profile.id}`,
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao testar' },
      { status: 502 }
    )
  }
}
