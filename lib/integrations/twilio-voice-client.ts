/**
 * Twilio Voice REST API client
 * Docs: https://www.twilio.com/docs/voice/api
 */

const TWILIO_API_BASE = 'https://api.twilio.com/2010-04-01'

interface TwilioConfig {
  accountSid: string
  authToken: string
}

function authHeader({ accountSid, authToken }: TwilioConfig) {
  return 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64')
}

export async function getAccount(cfg: TwilioConfig) {
  const res = await fetch(`${TWILIO_API_BASE}/Accounts/${cfg.accountSid}.json`, {
    headers: { Authorization: authHeader(cfg) },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Twilio: ${res.status} ${text.slice(0, 200)}`)
  }
  const data = await res.json()
  return { friendlyName: data.friendly_name as string, status: data.status as string }
}

export async function logIncomingCall(
  cfg: TwilioConfig,
  callSid: string,
  from: string,
  to: string
) {
  return { callSid, from, to, loggedAt: new Date().toISOString() }
}
