import { prisma } from '@/lib/prisma'

export interface IcsEvent {
  uid: string
  summary: string
  description?: string
  location?: string
  dtstart: Date
  dtend: Date
  created?: Date
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace('.000Z', 'Z')
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')
}

function buildVEvent(event: IcsEvent): string {
  const lines: string[] = [
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(event.dtstart)}`,
    `DTEND:${formatIcsDate(event.dtend)}`,
    `SUMMARY:${escapeIcsText(event.summary)}`,
  ]
  if (event.description) lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`)
  if (event.location) lines.push(`LOCATION:${escapeIcsText(event.location)}`)
  if (event.created) lines.push(`CREATED:${formatIcsDate(event.created)}`)
  lines.push('END:VEVENT')
  return lines.join('\r\n')
}

export function buildIcsFeed(calName: string, events: IcsEvent[]): string {
  const vEvents = events.map(buildVEvent).join('\r\n')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Estetia CRM//Apple Calendar Feed//PT',
    `X-WR-CALNAME:${escapeIcsText(calName)}`,
    'X-WR-TIMEZONE:America/Sao_Paulo',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    vEvents,
    'END:VCALENDAR',
  ].join('\r\n')
}

// Generates the public .ics feed URL for an organization
export function getAppleCalendarFeedUrl(orgId: string, feedSecret: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? ''
  return `${base}/api/calendar/${orgId}?secret=${feedSecret}`
}

// Fetches upcoming CalendarEvents for an org and returns IcsEvent[]
export async function getOrgCalendarEventsAsIcs(
  organizationId: string,
  limit = 200
): Promise<IcsEvent[]> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const events = await prisma.calendarEvent.findMany({
    where: {
      organizationId,
      startTime: { gte: thirtyDaysAgo },
    },
    orderBy: { startTime: 'asc' },
    take: limit,
    select: {
      id: true,
      title: true,
      description: true,
      startTime: true,
      endTime: true,
      location: true,
    },
  })

  return events.map((e) => ({
    uid: `estetia-event-${e.id}@estetiacrm`,
    summary: e.title,
    description: e.description ?? undefined,
    location: e.location ?? undefined,
    dtstart: e.startTime,
    dtend: e.endTime,
  }))
}

// Verifies the feedSecret belongs to an org and returns org info
export async function verifyAppleCalendarSecret(
  orgId: string,
  secret: string
): Promise<{ id: string; name: string; appleCalendarEnabled: boolean } | null> {
  const org = await prisma.organization.findFirst({
    where: { id: orgId, appleCalendarFeedSecret: secret },
    select: { id: true, name: true, appleCalendarEnabled: true },
  })
  return org
}
