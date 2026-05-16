-- Sprint 6 — Pagamentos: PagSeguro, Pagar.me, Stripe
-- Idempotent: uses ADD COLUMN IF NOT EXISTS

ALTER TABLE "Organization"
  ADD COLUMN IF NOT EXISTS "pagseguroEnabled"     BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "pagseguroToken"        TEXT,
  ADD COLUMN IF NOT EXISTS "pagseguroEnvironment"  TEXT DEFAULT 'sandbox',
  ADD COLUMN IF NOT EXISTS "pagarmeEnabled"        BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "pagarmeApiKey"         TEXT,
  ADD COLUMN IF NOT EXISTS "pagarmeRecipientId"    TEXT,
  ADD COLUMN IF NOT EXISTS "stripeEnabled"         BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "stripeSecretKey"       TEXT,
  ADD COLUMN IF NOT EXISTS "stripeWebhookSecret"   TEXT;
