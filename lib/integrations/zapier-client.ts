import { dispatchWebhook, type WebhookEvent } from './webhook-dispatch'

export async function dispatchToZapier(webhookUrl: string, event: WebhookEvent): Promise<void> {
  return dispatchWebhook(webhookUrl, event)
}
