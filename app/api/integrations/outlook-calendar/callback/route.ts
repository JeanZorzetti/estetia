import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/encryption'
import { exchangeMicrosoftCode, getOutlookProfile } from '@/lib/integrations/outlook-calendar-client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const redirectBase = '/dashboard/settings/integrations/outlook-calendar'

  if (error) {
    return NextResponse.redirect(
      new URL(`${redirectBase}?error=${error}`, request.url)
    )
  }
  if (!code || !state) {
    return NextResponse.redirect(
      new URL(`${redirectBase}?error=invalid_request`, request.url)
    )
  }

  let organizationId: string
  try {
    const decoded = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'))
    organizationId = decoded.organizationId
  } catch {
    return NextResponse.redirect(
      new URL(`${redirectBase}?error=invalid_state`, request.url)
    )
  }

  try {
    const tokens = await exchangeMicrosoftCode(code)
    const profile = await getOutlookProfile(tokens.refresh_token)

    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        outlookCalendarEnabled: true,
        outlookCalendarRefreshToken: encrypt(tokens.refresh_token),
        outlookCalendarEmail: profile.mail ?? profile.userPrincipalName,
      },
    })

    return NextResponse.redirect(
      new URL(`${redirectBase}?success=true`, request.url)
    )
  } catch {
    return NextResponse.redirect(
      new URL(`${redirectBase}?error=connection_failed`, request.url)
    )
  }
}
