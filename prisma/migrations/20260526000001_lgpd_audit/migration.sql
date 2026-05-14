-- Sprint 3: LGPD Audit, Anamnesis Templates, Medical Access Log
-- Additive migration — no breaking changes to existing tables

-- ─── AnamnesisTemplate ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "AnamnesisTemplate" (
    "id"             TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "organizationId" TEXT NOT NULL,
    "nome"           TEXT NOT NULL,
    "procedimento"   TEXT,
    "descricao"      TEXT,
    "template"       JSONB NOT NULL DEFAULT '{}',
    "versao"         INTEGER NOT NULL DEFAULT 1,
    "templateHash"   TEXT NOT NULL DEFAULT '',
    "ativo"          BOOLEAN NOT NULL DEFAULT true,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnamnesisTemplate_pkey" PRIMARY KEY ("id")
);

DO $fkey$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'AnamnesisTemplate_organizationId_fkey'
          AND table_name = 'AnamnesisTemplate'
    ) THEN
        ALTER TABLE "AnamnesisTemplate"
            ADD CONSTRAINT "AnamnesisTemplate_organizationId_fkey"
            FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$fkey$;

CREATE INDEX IF NOT EXISTS "AnamnesisTemplate_organizationId_idx"
    ON "AnamnesisTemplate"("organizationId");

CREATE INDEX IF NOT EXISTS "AnamnesisTemplate_organizationId_ativo_idx"
    ON "AnamnesisTemplate"("organizationId", "ativo");

-- ─── MedicalAccessLog ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "MedicalAccessLog" (
    "id"             TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "organizationId" TEXT NOT NULL,
    "userId"         TEXT,
    "pacienteId"     TEXT NOT NULL,
    "recordType"     TEXT NOT NULL,
    "recordId"       TEXT NOT NULL,
    "action"         TEXT NOT NULL,
    "ipAddress"      TEXT,
    "userAgent"      TEXT,
    "metadata"       JSONB,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicalAccessLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "MedicalAccessLog_organizationId_pacienteId_idx"
    ON "MedicalAccessLog"("organizationId", "pacienteId");

CREATE INDEX IF NOT EXISTS "MedicalAccessLog_organizationId_userId_idx"
    ON "MedicalAccessLog"("organizationId", "userId");

CREATE INDEX IF NOT EXISTS "MedicalAccessLog_createdAt_idx"
    ON "MedicalAccessLog"("createdAt");

-- ─── Ensure ConsentLog.revokedAt column exists (may have been added in Sprint 1) ─

DO $migration$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'ConsentLog' AND column_name = 'revokedAt'
    ) THEN
        ALTER TABLE "ConsentLog" ADD COLUMN "revokedAt" TIMESTAMP(3);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'ConsentLog' AND column_name = 'userAgent'
    ) THEN
        ALTER TABLE "ConsentLog" ADD COLUMN "userAgent" TEXT;
    END IF;
END
$migration$;

-- ─── Ensure Anamnesis.preenchidoPor column exists ────────────────────────────

DO $anamnesis_cols$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Anamnesis' AND column_name = 'preenchidoPor'
    ) THEN
        ALTER TABLE "Anamnesis" ADD COLUMN "preenchidoPor" TEXT NOT NULL DEFAULT 'profissional';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'Anamnesis' AND column_name = 'assinadoIp'
    ) THEN
        ALTER TABLE "Anamnesis" ADD COLUMN "assinadoIp" TEXT;
    END IF;
END
$anamnesis_cols$;
