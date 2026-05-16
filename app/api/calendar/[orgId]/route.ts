import { NextRequest, NextResponse } from 'next/server'
import {
  verifyAppleCalendarSecret,
  getOrgCalendarEventsAsIcs,
  buildIcsFeed,
} from '@/lib/integrations/apple-calendar-client'

// Route: GET /api/calendar/{orgId}?secret={feedSecret}
// Serves the .ics feed for Apple Calendar / any iCal-compatible app.
// The feed URL shown to users includes "?secret=..." for auth — no cookies needed.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orgId: string }> }
) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const { orgId } = await params

  if (!secret || !orgId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const org = await verifyAppleCalendarSecret(orgId, secret)
  if (!org || !org.appleCalendarEnabled) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const events = await getOrgCalendarEventsAsIcs(orgId)
  const icsContent = buildIcsFeed(`${org.name} — Estetia CRM`, events)

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${orgId}.ics"`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
