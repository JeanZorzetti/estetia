/**
 * SMTP client wrapper.
 * Each org can configure its own SMTP server (BYO email provider) — Gmail, Outlook, SendGrid, Resend, etc.
 *
 * If org has no SMTP configured, falls back to default Resend (lib/email.ts).
 */

import nodemailer, { Transporter } from 'nodemailer'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'

export interface SmtpConfig {
  host: string
  port: number
  username: string
  password: string // plain (already decrypted)
  fromEmail: string
  fromName?: string | null
  useTLS: boolean
}

// Cache transporters per org (LRU-ish — 50 entries max)
const transporterCache = new Map<string, { transporter: Transporter; createdAt: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000

function buildTransporter(config: SmtpConfig): Transporter {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // implicit TLS on 465
    requireTLS: config.useTLS && config.port !== 465,
    auth: {
      user: config.username,
      pass: config.password,
    },
  })
}

function buildFrom(config: SmtpConfig): string {
  return config.fromName ? `${config.fromName} <${config.fromEmail}>` : config.fromEmail
}

async function loadOrgSmtp(orgId: string): Promise<SmtpConfig | null> {
  const org = await prisma.organization.findUnique({
    where: { id: orgId },
    select: {
      smtpEnabled: true,
      smtpHost: true,
      smtpPort: true,
      smtpUsername: true,
      smtpPassword: true,
      smtpFromEmail: true,
      smtpFromName: true,
      smtpUseTLS: true,
    },
  })

  if (!org?.smtpEnabled || !org.smtpHost || !org.smtpUsername || !org.smtpPassword || !org.smtpFromEmail) {
    return null
  }

  let password: string
  try {
    password = decrypt(org.smtpPassword)
  } catch {
    return null
  }

  return {
    host: org.smtpHost,
    port: org.smtpPort ?? 587,
    username: org.smtpUsername,
    password,
    fromEmail: org.smtpFromEmail,
    fromName: org.smtpFromName,
    useTLS: org.smtpUseTLS,
  }
}

function getCached(orgId: string, config: SmtpConfig): Transporter {
  const cached = transporterCache.get(orgId)
  if (cached && Date.now() - cached.createdAt < CACHE_TTL_MS) {
    return cached.transporter
  }

  if (transporterCache.size >= 50) {
    const oldestKey = transporterCache.keys().next().value
    if (oldestKey) transporterCache.delete(oldestKey)
  }

  const transporter = buildTransporter(config)
  transporterCache.set(orgId, { transporter, createdAt: Date.now() })
  return transporter
}

export function invalidateOrgTransporter(orgId: string) {
  transporterCache.delete(orgId)
}

/**
 * Send a test email using ad-hoc credentials (no caching, no DB lookup).
 * Used by the "Send test email" button in settings.
 */
export async function sendTestEmail(
  config: SmtpConfig,
  to: string
): Promise<{ ok: true; messageId: string } | { ok: false; error: string }> {
  try {
    const transporter = buildTransporter(config)
    const info = await transporter.sendMail({
      from: buildFrom(config),
      to,
      subject: 'Teste de e-mail — Estetia CRM',
      text: 'Este é um e-mail de teste enviado pela configuração SMTP do seu Estetia CRM.\n\nSe você está lendo isso, está tudo certo!',
      html: '<p>Este é um e-mail de teste enviado pela configuração SMTP do seu Estetia CRM.</p><p>Se você está lendo isso, está tudo certo!</p>',
    })
    return { ok: true, messageId: info.messageId }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Erro desconhecido' }
  }
}

/**
 * Send an email via the org's SMTP if configured. Returns null if org has no SMTP
 * (caller should fall back to the default Resend transport).
 */
export async function sendMailForOrg(
  orgId: string,
  payload: { to: string | string[]; subject: string; html?: string; text?: string }
): Promise<{ messageId: string } | null> {
  const config = await loadOrgSmtp(orgId)
  if (!config) return null

  const transporter = getCached(orgId, config)
  const info = await transporter.sendMail({
    from: buildFrom(config),
    to: Array.isArray(payload.to) ? payload.to.join(',') : payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  })
  return { messageId: info.messageId }
}

export const SMTP_PRESETS = [
  { name: 'Gmail', host: 'smtp.gmail.com', port: 587, useTLS: true },
  { name: 'Outlook', host: 'smtp.office365.com', port: 587, useTLS: true },
  { name: 'SendGrid', host: 'smtp.sendgrid.net', port: 587, useTLS: true },
  { name: 'Resend', host: 'smtp.resend.com', port: 587, useTLS: true },
  { name: 'Mailgun', host: 'smtp.mailgun.org', port: 587, useTLS: true },
  { name: 'Amazon SES', host: 'email-smtp.us-east-1.amazonaws.com', port: 587, useTLS: true },
] as const
