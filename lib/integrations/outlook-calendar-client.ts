import { decrypt } from '@/lib/encryption'
import { prisma } from '@/lib/prisma'

const GRAPH_BASE = 'https://graph.microsoft.com/v1.0'

export interface OutlookEvent {
  id?: string
  subject: string
  body?: { contentType: 'text' | 'html'; content: string }
  start: { dateTime: string; timeZone: string }
  end: { dateTime: string; timeZone: string }
  location?: { displayName: string }
  attendees?: Array<{ emailAddress: { address: string; name?: string }; type: 'required' | 'optional' }>
}

export function getMicrosoftAuthUrl(state: string) {
  const tenant = process.env.MICROSOFT_TENANT_ID ?? 'common'
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: process.env.MICROSOFT_REDIRECT_URI!,
    scope: 'offline_access Calendars.ReadWrite User.Read',
    state,
    response_mode: 'query',
  })
  return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?${params.toString()}`
}

export async function exchangeMicrosoftCode(code: string) {
  const tenant = process.env.MICROSOFT_TENANT_ID ?? 'common'
  const res = await fetch(
    `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        redirect_uri: process.env.MICROSOFT_REDIRECT_URI!,
        grant_type: 'authorization_code',
        code,
      }),
    }
  )
  if (!res.ok) throw new Error(`Microsoft token exchange failed: ${res.status}`)
  return res.json() as Promise<{ access_token: string; refresh_token: string; expires_in: number }>
}

async function getAccessToken(refreshToken: string): Promise<string> {
  const tenant = process.env.MICROSOFT_TENANT_ID ?? 'common'
  const res = await fetch(
    `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID!,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        scope: 'offline_access Calendars.ReadWrite User.Read',
      }),
    }
  )
  if (!res.ok) throw new Error(`Microsoft token refresh failed: ${res.status}`)
  const data = await res.json()
  return data.access_token as string
}

async function graphRequest<T = unknown>(
  refreshToken: string,
  path: string,
  method = 'GET',
  body?: unknown
): Promise<T> {
  const accessToken = await getAccessToken(refreshToken)
  const res = await fetch(`${GRAPH_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Graph API error ${res.status}: ${err}`)
  }
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

export async function getOutlookProfile(refreshToken: string) {
  return graphRequest<{ displayName: string; mail: string; userPrincipalName: string }>(
    refreshToken,
    '/me'
  )
}

export async function createOutlookEvent(refreshToken: string, event: OutlookEvent) {
  return graphRequest<{ id: string; webLink: string }>(
    refreshToken,
    '/me/calendar/events',
    'POST',
    event
  )
}

export async function deleteOutlookEvent(refreshToken: string, eventId: string) {
  return graphRequest(refreshToken, `/me/calendar/events/${eventId}`, 'DELETE')
}

export async function listUpcomingOutlookEvents(refreshToken: string, maxResults = 10) {
  const now = new Date().toISOString()
  const path = `/me/calendar/events?$filter=start/dateTime ge '${now}'&$orderby=start/dateTime&$top=${maxResults}&$select=id,subject,start,end,webLink`
  return graphRequest<{ value: OutlookEvent[] }>(refreshToken, path)
}

// Hook: sync an agendamento as an Outlook Calendar event
export async function syncAgendamentoToOutlook(
  organizationId: string,
  agendamento: {
    id: string
    titulo: string
    inicio: Date
    fim: Date
    pacienteNome?: string
    local?: string
  }
) {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { outlookCalendarEnabled: true, outlookCalendarRefreshToken: true },
  })
  if (!org?.outlookCalendarEnabled || !org.outlookCalendarRefreshToken) return

  const refreshToken = decrypt(org.outlookCalendarRefreshToken)
  const event: OutlookEvent = {
    subject: agendamento.titulo,
    body: agendamento.pacienteNome
      ? { contentType: 'text', content: `Paciente: ${agendamento.pacienteNome}` }
      : undefined,
    start: { dateTime: agendamento.inicio.toISOString(), timeZone: 'America/Sao_Paulo' },
    end: { dateTime: agendamento.fim.toISOString(), timeZone: 'America/Sao_Paulo' },
    location: agendamento.local ? { displayName: agendamento.local } : undefined,
  }
  await createOutlookEvent(refreshToken, event)
}
