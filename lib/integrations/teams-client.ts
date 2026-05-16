/**
 * Microsoft Teams Incoming Webhook client (legacy MessageCard format).
 * Docs: https://learn.microsoft.com/microsoftteams/platform/webhooks-and-connectors/how-to/connectors-using
 */

import { decrypt } from '@/lib/encryption'

export interface TeamsCard {
  '@type': 'MessageCard'
  '@context': 'https://schema.org/extensions'
  themeColor?: string
  summary: string
  title?: string
  sections?: Array<{
    activityTitle?: string
    activitySubtitle?: string
    facts?: Array<{ name: string; value: string }>
    text?: string
  }>
}

function resolveWebhookUrl(stored: string): string {
  if (stored.includes(':') && stored.split(':').length === 3) {
    return decrypt(stored)
  }
  return stored
}

export async function sendTeamsCard(webhookUrlEncrypted: string, card: TeamsCard): Promise<void> {
  const url = resolveWebhookUrl(webhookUrlEncrypted)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Teams webhook ${res.status}: ${text || res.statusText}`)
  }
}

export function buildAppointmentCard(p: {
  patient: string
  professional: string
  procedure: string
  date: string
  time: string
}): TeamsCard {
  return {
    '@type': 'MessageCard',
    '@context': 'https://schema.org/extensions',
    themeColor: '0EA5E9',
    summary: `Novo agendamento — ${p.patient}`,
    title: 'Novo agendamento',
    sections: [
      {
        facts: [
          { name: 'Paciente', value: p.patient },
          { name: 'Profissional', value: p.professional },
          { name: 'Procedimento', value: p.procedure },
          { name: 'Data', value: `${p.date} às ${p.time}` },
        ],
      },
    ],
  }
}
