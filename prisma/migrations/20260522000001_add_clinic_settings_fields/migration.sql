-- Migration: add_clinic_settings_fields
-- Adds Organization columns needed by /dashboard/settings/clinica/*
-- All statements use IF NOT EXISTS to be idempotent (safe if manual_settings_v2.sql was already run)

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

-- Endereço completo (JSON: { rua, numero, complemento, bairro, cidade, uf, cep })
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "enderecoCompleto" JSONB;

-- Horários globais da clínica (JSON: { seg: [{inicio,fim}], ... dom: [] })
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "horarioFuncionamento" JSONB;

-- Responsável Técnico
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "rtNome" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "rtConselho" "MedicalCouncil";
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "rtNumeroConselho" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "rtUfConselho" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "rtCpf" TEXT;
