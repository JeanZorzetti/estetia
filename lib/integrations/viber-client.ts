/**
 * Viber Business API client
 * Docs: https://developers.viber.com/docs/api/rest-bot-api/
 */

const VIBER_API_BASE = 'https://chatapi.viber.com/pa'

interface ViberConfig {
  authToken: string
  senderName?: string
}

export async function getAccountInfo({ authToken }: ViberConfig) {
  const res = await fetch(`${VIBER_API_BASE}/get_account_info`, {
    method: 'POST',
    headers: {
      'X-Viber-Auth-Token': authToken,
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  if (data.status !== 0) {
    throw new Error(data.status_message || 'Falha ao validar token Viber')
  }
  return { name: data.name as string, uri: data.uri as string, id: data.id as string }
}

export async function sendTextMessage(
  { authToken, senderName = 'Estetia' }: ViberConfig,
  receiverId: string,
  text: string
) {
  const res = await fetch(`${VIBER_API_BASE}/send_message`, {
    method: 'POST',
    headers: {
      'X-Viber-Auth-Token': authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      receiver: receiverId,
      type: 'text',
      sender: { name: senderName },
      text,
    }),
  })
  const data = await res.json()
  if (data.status !== 0) {
    throw new Error(data.status_message || 'Falha ao enviar mensagem Viber')
  }
  return { messageToken: data.message_token as string }
}
