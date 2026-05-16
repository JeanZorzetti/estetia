-- Sprint 9: Telemedicina (doctoralia, conexa, memed, whitebook)
-- Additive migration — no breaking changes
-- Run manually: psql $DATABASE_URL -f manual_integrations_sprint9.sql

-- Doctoralia (Docplanner API)
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "doctoraliaEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "doctoraliaApiKey" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "doctoraliaClinicId" TEXT;

-- Conexa Saúde (Telemedicina)
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "conexaEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "conexaApiKey" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "conexaClinicId" TEXT;

-- Memed (Prescrição Digital)
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "memedEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "memedApiKey" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "memedPublicKey" TEXT;

-- Whitebook (PEBMED — Decisão Clínica)
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "whitebookEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "whitebookApiKey" TEXT;
