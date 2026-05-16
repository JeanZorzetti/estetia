/**
 * Slack Incoming Webhook client.
 * Docs: https://api.slack.com/messaging/webhooks
 */

import { decrypt } from '@/lib/encryption'

export interface SlackBlock {
  type: string
  text?: { type: 'mrkdwn' | 'plain_text'; text: string }
  fields?: Array<{ type: 'mrkdwn'; text: string }>
}

export interface SlackMessage {
  text: string
  blocks?: SlackBlock[]
}

function resolveWebhookUrl(stored: string): string {
  if (stored.includes(':') && stored.split(':').length === 3) {
    return decrypt(stored)
  }
  return stored
}

export async function sendSlackMessage(webhookUrlEncrypted: string, message: SlackMessage): Promise<void> {
  const url = resolveWebhookUrl(webhookUrlEncrypted)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Slack webhook ${res.status}: ${text || res.statusText}`)
  }
}

export function buildAppointmentBlocks(p: {
  patient: string
  professional: string
  procedure: string
  date: string
  time: string
}): SlackBlock[] {
  return [
    {
      type: 'header',
      text: { type: 'plain_text', text: 'Novo agendamento' },
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Paciente:*\n${p.patient}` },
        { type: 'mrkdwn', text: `*Profissional:*\n${p.professional}` },
        { type: 'mrkdwn', text: `*Procedimento:*\n${p.procedure}` },
        { type: 'mrkdwn', text: `*Data:*\n${p.date} às ${p.time}` },
      ],
    },
  ]
}
