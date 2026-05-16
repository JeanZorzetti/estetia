import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'
import { getAdvertiserInfo } from '@/lib/integrations/tiktok-ads-client'

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
          tiktokAdsAccessToken: true,
          tiktokAdsAdvertiserId: true,
        },
      },
    },
  })

  const org = user?.organization
  if (!org?.tiktokAdsAccessToken) {
    return NextResponse.json({ error: 'Token nao configurado' }, { status: 400 })
  }

  try {
    const accessToken = decrypt(org.tiktokAdsAccessToken)
    const advertiserId = org.tiktokAdsAdvertiserId ?? ''

    // Tenta validar via Business API se advertiser ID estiver configurado
    if (advertiserId) {
      const advertiser = await getAdvertiserInfo({ accessToken, advertiserId })
      return NextResponse.json({
        ok: true,
        result: {
          stored: true,
          note: advertiser
            ? `Conta verificada: ${advertiser.advertiser_name} (${advertiser.status})`
            : 'Token valido — sem anunciante encontrado para este ID',
        },
      })
    }

    // Sem advertiser ID, apenas confirma que o token foi armazenado
    return NextResponse.json({
      ok: true,
      result: {
        stored: true,
        note: 'Token armazenado com sucesso. Configure o Advertiser ID para validar via API.',
      },
    })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao testar' },
      { status: 502 }
    )
  }
}
