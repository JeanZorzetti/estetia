-- Migration: integrations_v2 (self-service marketplace)
-- Z-API (Brazilian WhatsApp provider, BYO)
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "zapiEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "zapiInstanceId" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "zapiInstanceToken" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "zapiClientToken" TEXT;

-- Instagram DM (separado de Posts)
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "instagramDmEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "instagramDmPageId" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "instagramDmWebhookVerify" TEXT;

-- SMTP customizado (BYO email provider)
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "smtpEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "smtpHost" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "smtpPort" INTEGER DEFAULT 587;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "smtpUsername" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "smtpPassword" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "smtpFromEmail" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "smtpFromName" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "smtpUseTLS" BOOLEAN NOT NULL DEFAULT true;

-- Webhooks genéricos
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "webhookEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "webhookSecret" TEXT;

-- PABX
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "pabxEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "pabxProvider" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "pabxWebhookSecret" TEXT;

-- Extend IntegrationType enum with new providers
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'WHATSAPP_EVOLUTION';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'WHATSAPP_ZAPI';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'INSTAGRAM_DM';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'SMTP';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'WEBHOOK_GENERIC';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'PABX';
