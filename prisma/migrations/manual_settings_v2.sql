-- Migration: settings_v2 (clinical-first hub)

-- LGPD retention
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "lgpdRetentionMonths" INTEGER DEFAULT 60;

-- Identificação jurídica
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "cnpj" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "razaoSocial" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "inscricaoEstadual" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "inscricaoMunicipal" TEXT;

-- Identidade visual
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "brandColor" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "slogan" TEXT;

-- Endereço (JSONB)
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "enderecoCompleto" JSONB;

-- Horários globais (JSONB)
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "horarioFuncionamento" JSONB;

-- Responsável Técnico
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "rtNome" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "rtConselho" "MedicalCouncil";
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "rtNumeroConselho" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "rtUfConselho" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "rtCpf" TEXT;
