-- Migration: equipe_clinica_v2
-- Add UserCategoria enum
DO $$ BEGIN
  CREATE TYPE "UserCategoria" AS ENUM ('CLINICO', 'ADMINISTRATIVO', 'PROPRIETARIO');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Add categoria column to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "categoria" "UserCategoria" NOT NULL DEFAULT 'ADMINISTRATIVO';

-- Backfill: users with professionalProfile get CLINICO
UPDATE "User" u SET "categoria" = 'CLINICO'
WHERE EXISTS (SELECT 1 FROM "Professional" p WHERE p."userId" = u.id);

-- Add clinical permission columns to RolePermissions
ALTER TABLE "RolePermissions" ADD COLUMN IF NOT EXISTS "canAccessProntuario" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "RolePermissions" ADD COLUMN IF NOT EXISTS "canScheduleAppointments" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "RolePermissions" ADD COLUMN IF NOT EXISTS "canValidateCouncil" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "RolePermissions" ADD COLUMN IF NOT EXISTS "canManageProfessionals" BOOLEAN NOT NULL DEFAULT false;

-- Add columns to Invite
ALTER TABLE "Invite" ADD COLUMN IF NOT EXISTS "accepted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Invite" ADD COLUMN IF NOT EXISTS "acceptedAt" TIMESTAMP(3);
ALTER TABLE "Invite" ADD COLUMN IF NOT EXISTS "categoria" "UserCategoria" NOT NULL DEFAULT 'ADMINISTRATIVO';
ALTER TABLE "Invite" ADD COLUMN IF NOT EXISTS "prefilledData" JSONB;
