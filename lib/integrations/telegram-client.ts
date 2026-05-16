/**
 * Telegram Bot API client.
 * Docs: https://core.telegram.org/bots/api
 */

const TELEGRAM_BASE = 'https://api.telegram.org'

export interface TelegramConfig {
  botToken: string
  chatId?: string
}

async function telegramRequest<T>(
  config: TelegramConfig,
  method: string,
  body: Record<string, unknown>
): Promise<T> {
  const url = `${TELEGRAM_BASE}/bot${config.botToken}/${method}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Telegram ${res.status}: ${text || res.statusText}`)
  }
  const data = (await res.json()) as { ok: boolean; result?: T; description?: string }
  if (!data.ok) {
    throw new Error(data.description ?? 'Telegram API error')
  }
  return data.result as T
}

export async function getMe(config: TelegramConfig): Promise<{ username: string; first_name: string; id: number }> {
  return telegramRequest(config, 'getMe', {})
}

export async function sendMessage(
  config: TelegramConfig,
  text: string,
  chatId?: string
): Promise<unknown> {
  const target = chatId ?? config.chatId
  if (!target) throw new Error('chatId é obrigatório')
  return telegramRequest(config, 'sendMessage', {
    chat_id: target,
    text,
    parse_mode: 'HTML',
  })
}
