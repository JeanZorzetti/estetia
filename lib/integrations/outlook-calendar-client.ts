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

interface OrgCredentials {
  clientId: string
  clientSecret: string
  tenantId: string
  redirectUri: string
}

export function getMicrosoftAuthUrl(state: string, creds: OrgCredentials) {
  const params = new URLSearchParams({
    client_id: creds.clientId,
    response_type: 'code',
    redirect_uri: creds.redirectUri,
    scope: 'offline_access Calendars.ReadWrite User.Read',
    state,
    response_mode: 'query',
  })
  return `https://login.microsoftonline.com/${creds.tenantId}/oauth2/v2.0/authorize?${params.toString()}`
}

export async function exchangeMicrosoftCode(code: string, creds: OrgCredentials) {
  const res = await fetch(
    `https://login.microsoftonline.com/${creds.tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: creds.clientId,
        client_secret: creds.clientSecret,
        redirect_uri: creds.redirectUri,
        grant_type: 'authorization_code',
        code,
      }),
    }
  )
  if (!res.ok) throw new Error(`Microsoft token exchange failed: ${res.status}`)
  return res.json() as Promise<{ access_token: string; refresh_token: string; expires_in: number }>
}

async function getAccessToken(refreshToken: string, creds: OrgCredentials): Promise<string> {
  const res = await fetch(
    `https://login.microsoftonline.com/${creds.tenantId}/oauth2/v2.0/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: creds.clientId,
        client_secret: creds.clientSecret,
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
  creds: OrgCredentials,
  path: string,
  method = 'GET',
  body?: unknown
): Promise<T> {
  const accessToken = await getAccessToken(refreshToken, creds)
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

export async function getOutlookProfile(refreshToken: string, creds: OrgCredentials) {
  return graphRequest<{ displayName: string; mail: string; userPrincipalName: string }>(
    refreshToken, creds, '/me'
  )
}

export async function createOutlookEvent(
  refreshToken: string,
  creds: OrgCredentials,
  event: OutlookEvent
) {
  return graphRequest<{ id: string; webLink: string }>(
    refreshToken, creds, '/me/calendar/events', 'POST', event
  )
}

export async function deleteOutlookEvent(
  refreshToken: string,
  creds: OrgCredentials,
  eventId: string
) {
  return graphRequest(refreshToken, creds, `/me/calendar/events/${eventId}`, 'DELETE')
}

export async function listUpcomingOutlookEvents(
  refreshToken: string,
  creds: OrgCredentials,
  maxResults = 10
) {
  const now = new Date().toISOString()
  const path = `/me/calendar/events?$filter=start/dateTime ge '${now}'&$orderby=start/dateTime&$top=${maxResults}&$select=id,subject,start,end,webLink`
  return graphRequest<{ value: OutlookEvent[] }>(refreshToken, creds, path)
}

// Hook: sync a calendar event to Outlook using the org's own Azure app credentials
export async function syncEventToOutlook(
  organizationId: string,
  event: {
    titulo: string
    inicio: Date
    fim: Date
    descricao?: string
    local?: string
  }
) {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      outlookCalendarEnabled: true,
      outlookCalendarRefreshToken: true,
      outlookClientId: true,
      outlookClientSecret: true,
      outlookTenantId: true,
    },
  })
  if (
    !org?.outlookCalendarEnabled ||
    !org.outlookCalendarRefreshToken ||
    !org.outlookClientId ||
    !org.outlookClientSecret ||
    !org.outlookTenantId
  ) return

  const creds: OrgCredentials = {
    clientId: org.outlookClientId,
    clientSecret: decrypt(org.outlookClientSecret),
    tenantId: org.outlookTenantId,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/outlook-calendar/callback`,
  }

  const refreshToken = decrypt(org.outlookCalendarRefreshToken)
  await createOutlookEvent(refreshToken, creds, {
    subject: event.titulo,
    body: event.descricao ? { contentType: 'text', content: event.descricao } : undefined,
    start: { dateTime: event.inicio.toISOString(), timeZone: 'America/Sao_Paulo' },
    end: { dateTime: event.fim.toISOString(), timeZone: 'America/Sao_Paulo' },
    location: event.local ? { displayName: event.local } : undefined,
  })
}
