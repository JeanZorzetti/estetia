-- Add WABA (WhatsApp Business API / Meta Cloud API) fields to Organization
ALTER TABLE "Organization"
  ADD COLUMN IF NOT EXISTS "wabaEnabled"              BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "wabaPhoneNumberId"        TEXT,
  ADD COLUMN IF NOT EXISTS "wabaAccessToken"          TEXT,
  ADD COLUMN IF NOT EXISTS "wabaBusinessAccountId"    TEXT,
  ADD COLUMN IF NOT EXISTS "wabaWebhookVerifyToken"   TEXT;
