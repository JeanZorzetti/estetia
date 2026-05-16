-- Sprint 3: Calendários — Outlook Calendar (OAuth Microsoft Graph) + Apple Calendar (.ics feed)
-- Idempotente via IF NOT EXISTS.

ALTER TABLE "Organization"
  ADD COLUMN IF NOT EXISTS "outlookCalendarEnabled"      BOOLEAN  NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "outlookCalendarRefreshToken" TEXT,
  ADD COLUMN IF NOT EXISTS "outlookCalendarEmail"        TEXT;

ALTER TABLE "Organization"
  ADD COLUMN IF NOT EXISTS "appleCalendarEnabled"    BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "appleCalendarFeedSecret" TEXT;

-- Estende enum IntegrationType com os novos providers
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'OUTLOOK_CALENDAR';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'APPLE_CALENDAR';
