/**
 * Email utility usando Resend.
 * ✅ FASE 14: Lazy init para não quebrar build quando RESEND_API_KEY não está definida.
 */
import { Resend } from 'resend'
import logger from '@/lib/logger'

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        'RESEND_API_KEY environment variable is required. ' +
        'Get your API key from: https://resend.com/api-keys'
      )
    }
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

export const emailConfig = {
  from: 'Estetia CRM <noreply@estetiacrm.com.br>',
  replyTo: 'suporte@estetiacrm.com.br',
} as const

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[]
  subject: string
  react: React.ReactElement
}) {
  try {
    const { data, error } = await getResend().emails.send({
      from: emailConfig.from,
      to,
      subject,
      react,
    })

    if (error) {
      logger.error({ error }, 'Failed to send email:')
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    logger.error({ error }, 'Email sending error:')
    return { success: false, error }
  }
}

export async function sendHtmlEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}) {
  try {
    const { data, error } = await getResend().emails.send({
      from: emailConfig.from,
      to,
      subject,
      html,
    })

    if (error) {
      logger.error({ error }, 'Failed to send email:')
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    logger.error({ error }, 'Email sending error:')
    return { success: false, error }
  }
}
