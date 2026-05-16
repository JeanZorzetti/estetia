-- Migration: integrations_mega (52 integrations marketplace)

-- Asaas
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "asaasEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "asaasApiKey" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "asaasEnvironment" TEXT DEFAULT 'sandbox';

-- MercadoPago Checkout (separado da assinatura SaaS)
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "mpPaymentEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "mpPaymentAccessToken" TEXT;

-- Focus NFe
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "focusnfeEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "focusnfeToken" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "focusnfeEnvironment" TEXT DEFAULT 'homologacao';

-- Telegram
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "telegramEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "telegramBotToken" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "telegramChatId" TEXT;

-- Zoom
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "zoomEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "zoomAccountId" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "zoomClientId" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "zoomClientSecret" TEXT;

-- IntegrationUpvote table
CREATE TABLE IF NOT EXISTS "IntegrationUpvote" (
  "id"             TEXT NOT NULL PRIMARY KEY,
  "organizationId" TEXT NOT NULL REFERENCES "Organization"("id") ON DELETE CASCADE,
  "userId"         TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "integrationId"  TEXT NOT NULL,
  "notes"          TEXT,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "IntegrationUpvote_userId_integrationId_key"
  ON "IntegrationUpvote"("userId", "integrationId");

CREATE INDEX IF NOT EXISTS "IntegrationUpvote_integrationId_createdAt_idx"
  ON "IntegrationUpvote"("integrationId", "createdAt");

-- Extend IntegrationType enum
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'ASAAS';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'MERCADOPAGO_CHECKOUT';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'FOCUS_NFE';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'TELEGRAM';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'ZOOM';
