-- Migration: 20260512000001_estetica_domain
-- Sprint 1: Domain models for Estética & Dermatologia CRM
-- All new tables are additive — legacy tables (contacts, deals) remain unchanged.

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE "TreatmentType" AS ENUM (
  'BOTOX',
  'PREENCHIMENTO',
  'LASER',
  'PEELING',
  'HARMONIZACAO_FACIAL',
  'LIMPEZA_PELE',
  'MICROAGULHAMENTO',
  'CRIOLIPOLISE',
  'RADIOFREQUENCIA',
  'LUZ_PULSADA',
  'DEPILACAO_LASER',
  'SKINBOOSTER',
  'FIOS_PDO',
  'BICHECTOMIA',
  'RINOPLASTIA_NONCIRURGICA',
  'OUTROS'
);

CREATE TYPE "TreatmentStatus" AS ENUM (
  'AVALIACAO',
  'ORCAMENTO_ENVIADO',
  'AGENDADO',
  'EM_ANDAMENTO',
  'FINALIZADO',
  'RETORNO',
  'CANCELADO'
);

CREATE TYPE "SessionStatus" AS ENUM (
  'AGENDADA',
  'CONFIRMADA',
  'REALIZADA',
  'NO_SHOW',
  'REMARCADA',
  'CANCELADA'
);

CREATE TYPE "ConsentType" AS ENUM (
  'LGPD_DADOS_SAUDE',
  'USO_FOTO_MARKETING',
  'AUTORIZACAO_PROCEDIMENTO',
  'TERMO_RISCO',
  'TERMO_MENOR_IDADE'
);

CREATE TYPE "MedicalCouncil" AS ENUM (
  'CRM',
  'CRO',
  'CRBM',
  'CRF',
  'COREN',
  'CFBM',
  'CREFITO',
  'CRP'
);

CREATE TYPE "RoomType" AS ENUM (
  'CONSULTA',
  'PROCEDIMENTO',
  'LASER',
  'PEELING',
  'RECUPERACAO'
);

-- ============================================================
-- PROFESSIONAL (must come before Patient/Treatment to avoid FK issues)
-- ============================================================

CREATE TABLE "Professional" (
  "id"                          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organizationId"              TEXT NOT NULL,
  "userId"                      TEXT,
  "nome"                        TEXT NOT NULL,
  "conselho"                    "MedicalCouncil",
  "numeroConselho"              TEXT,
  "ufConselho"                  TEXT,
  "conselhoValidadoEm"          TIMESTAMP(3),
  "conselhoStatus"              TEXT,
  "especialidades"              TEXT[] DEFAULT ARRAY[]::TEXT[],
  "bio"                         TEXT,
  "fotoUrl"                     TEXT,
  "cargaHoraria"                JSONB,
  "procedimentosHabilitadosIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "ativo"                       BOOLEAN NOT NULL DEFAULT true,
  "createdAt"                   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"                   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Professional_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Professional_userId_key" UNIQUE ("userId"),
  CONSTRAINT "Professional_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "Professional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE INDEX "Professional_organizationId_idx" ON "Professional"("organizationId");
CREATE INDEX "Professional_organizationId_ativo_idx" ON "Professional"("organizationId", "ativo");

-- ============================================================
-- CLINIC ROOM
-- ============================================================

CREATE TABLE "ClinicRoom" (
  "id"             TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organizationId" TEXT NOT NULL,
  "nome"           TEXT NOT NULL,
  "tipo"           "RoomType" NOT NULL DEFAULT 'PROCEDIMENTO',
  "equipamentos"   TEXT[] DEFAULT ARRAY[]::TEXT[],
  "disponibilidade" JSONB,
  "ativo"          BOOLEAN NOT NULL DEFAULT true,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ClinicRoom_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ClinicRoom_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE
);

CREATE INDEX "ClinicRoom_organizationId_idx" ON "ClinicRoom"("organizationId");

-- ============================================================
-- PATIENT
-- ============================================================

CREATE TABLE "Patient" (
  "id"                     TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organizationId"         TEXT NOT NULL,
  "nome"                   TEXT NOT NULL,
  "cpf"                    TEXT,
  "dataNascimento"         TIMESTAMP(3),
  "sexo"                   TEXT,
  "telefone"               TEXT,
  "email"                  TEXT,
  "fotoPerfil"             TEXT,
  "origem"                 TEXT,
  "alergias"               TEXT[] DEFAULT ARRAY[]::TEXT[],
  "medicacoesUso"          TEXT[] DEFAULT ARRAY[]::TEXT[],
  "contraindicacoes"       TEXT[] DEFAULT ARRAY[]::TEXT[],
  "observacoesMedicas"     TEXT,
  "consentLgpd"            JSONB,
  "dadosSensiveis"         BOOLEAN NOT NULL DEFAULT false,
  "profissionalAssignedId" TEXT,
  "legacyContactId"        TEXT,
  "createdAt"              TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"              TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Patient_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Patient_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "Patient_profissionalAssignedId_fkey" FOREIGN KEY ("profissionalAssignedId") REFERENCES "Professional"("id") ON DELETE SET NULL
);

CREATE INDEX "Patient_organizationId_idx" ON "Patient"("organizationId");
CREATE INDEX "Patient_organizationId_email_idx" ON "Patient"("organizationId", "email");
CREATE INDEX "Patient_organizationId_telefone_idx" ON "Patient"("organizationId", "telefone");
CREATE INDEX "Patient_legacyContactId_idx" ON "Patient"("legacyContactId");

-- ============================================================
-- TREATMENT
-- ============================================================

CREATE TABLE "Treatment" (
  "id"                          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organizationId"              TEXT NOT NULL,
  "pacienteId"                  TEXT NOT NULL,
  "tipoTratamento"              "TreatmentType" NOT NULL DEFAULT 'OUTROS',
  "descricaoCustomizada"        TEXT,
  "status"                      "TreatmentStatus" NOT NULL DEFAULT 'AVALIACAO',
  "valorTotal"                  DECIMAL(10,2),
  "sessoesPrevistas"            INTEGER NOT NULL DEFAULT 1,
  "sessoesRealizadas"           INTEGER NOT NULL DEFAULT 0,
  "profissionalResponsavelId"   TEXT,
  "contraindicacoesVerificadas" BOOLEAN NOT NULL DEFAULT false,
  "fotosAntes"                  TEXT[] DEFAULT ARRAY[]::TEXT[],
  "fotosDepois"                 TEXT[] DEFAULT ARRAY[]::TEXT[],
  "observacoes"                 TEXT,
  "dataInicio"                  TIMESTAMP(3),
  "dataFim"                     TIMESTAMP(3),
  "proximoRetorno"              TIMESTAMP(3),
  "legacyDealId"                TEXT,
  "createdAt"                   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"                   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Treatment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "Treatment_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Patient"("id") ON DELETE CASCADE,
  CONSTRAINT "Treatment_profissionalResponsavelId_fkey" FOREIGN KEY ("profissionalResponsavelId") REFERENCES "Professional"("id") ON DELETE SET NULL
);

CREATE INDEX "Treatment_organizationId_idx" ON "Treatment"("organizationId");
CREATE INDEX "Treatment_organizationId_pacienteId_idx" ON "Treatment"("organizationId", "pacienteId");
CREATE INDEX "Treatment_organizationId_status_idx" ON "Treatment"("organizationId", "status");
CREATE INDEX "Treatment_legacyDealId_idx" ON "Treatment"("legacyDealId");

-- ============================================================
-- TREATMENT SESSION
-- ============================================================

CREATE TABLE "TreatmentSession" (
  "id"               TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organizationId"   TEXT NOT NULL,
  "treatmentId"      TEXT NOT NULL,
  "dataAgendada"     TIMESTAMP(3) NOT NULL,
  "dataRealizada"    TIMESTAMP(3),
  "duracaoMinutos"   INTEGER,
  "status"           "SessionStatus" NOT NULL DEFAULT 'AGENDADA',
  "profissionalId"   TEXT,
  "salaId"           TEXT,
  "observacoes"      TEXT,
  "produtosAplicados" JSONB,
  "noShowScore"      INTEGER,
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "TreatmentSession_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TreatmentSession_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "TreatmentSession_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE CASCADE,
  CONSTRAINT "TreatmentSession_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Professional"("id") ON DELETE SET NULL,
  CONSTRAINT "TreatmentSession_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "ClinicRoom"("id") ON DELETE SET NULL
);

CREATE INDEX "TreatmentSession_organizationId_idx" ON "TreatmentSession"("organizationId");
CREATE INDEX "TreatmentSession_organizationId_dataAgendada_idx" ON "TreatmentSession"("organizationId", "dataAgendada");
CREATE INDEX "TreatmentSession_treatmentId_idx" ON "TreatmentSession"("treatmentId");
CREATE INDEX "TreatmentSession_profissionalId_idx" ON "TreatmentSession"("profissionalId");

-- ============================================================
-- PROCEDURE (catalog)
-- ============================================================

CREATE TABLE "Procedure" (
  "id"                       TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organizationId"           TEXT NOT NULL,
  "nome"                     TEXT NOT NULL,
  "categoria"                TEXT,
  "descricao"                TEXT,
  "duracaoMinutos"           INTEGER NOT NULL DEFAULT 60,
  "valorPadrao"              DECIMAL(10,2),
  "contraindicacoesGerais"   JSONB,
  "preCuidados"              TEXT,
  "posCuidados"              TEXT,
  "exigeAnamneseEspecifica"  BOOLEAN NOT NULL DEFAULT false,
  "anamneseTemplateId"       TEXT,
  "profissionaisHabilitadosIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "ativo"                    BOOLEAN NOT NULL DEFAULT true,
  "createdAt"                TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"                TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Procedure_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Procedure_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE
);

CREATE INDEX "Procedure_organizationId_idx" ON "Procedure"("organizationId");
CREATE INDEX "Procedure_organizationId_ativo_idx" ON "Procedure"("organizationId", "ativo");

-- ============================================================
-- MEDICAL RECORD
-- ============================================================

CREATE TABLE "MedicalRecord" (
  "id"                  TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organizationId"      TEXT NOT NULL,
  "pacienteId"          TEXT NOT NULL,
  "profissionalId"      TEXT,
  "dataAtendimento"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "queixaPrincipal"     TEXT,
  "historiaClinica"     TEXT,
  "examesAvaliados"     JSONB,
  "avaliacaoFisica"     TEXT,
  "hipoteseDiagnostica" TEXT,
  "planoTratamento"     TEXT,
  "dadosCriptografados" TEXT,
  "createdAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "MedicalRecord_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "MedicalRecord_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Patient"("id") ON DELETE CASCADE,
  CONSTRAINT "MedicalRecord_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Professional"("id") ON DELETE SET NULL
);

CREATE INDEX "MedicalRecord_organizationId_pacienteId_idx" ON "MedicalRecord"("organizationId", "pacienteId");
CREATE INDEX "MedicalRecord_organizationId_dataAtendimento_idx" ON "MedicalRecord"("organizationId", "dataAtendimento");

-- ============================================================
-- ANAMNESIS
-- ============================================================

CREATE TABLE "Anamnesis" (
  "id"               TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organizationId"   TEXT NOT NULL,
  "pacienteId"       TEXT NOT NULL,
  "treatmentId"      TEXT,
  "profissionalId"   TEXT,
  "respostas"        TEXT NOT NULL,
  "templateHash"     TEXT,
  "assinaturaDigital" TEXT,
  "assinadoEm"       TIMESTAMP(3),
  "assinadoIp"       TEXT,
  "preenchidoPor"    TEXT NOT NULL DEFAULT 'profissional',
  "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Anamnesis_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Anamnesis_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "Anamnesis_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Patient"("id") ON DELETE CASCADE,
  CONSTRAINT "Anamnesis_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE SET NULL,
  CONSTRAINT "Anamnesis_profissionalId_fkey" FOREIGN KEY ("profissionalId") REFERENCES "Professional"("id") ON DELETE SET NULL
);

CREATE INDEX "Anamnesis_organizationId_pacienteId_idx" ON "Anamnesis"("organizationId", "pacienteId");
CREATE INDEX "Anamnesis_treatmentId_idx" ON "Anamnesis"("treatmentId");

-- ============================================================
-- CONSENT LOG
-- ============================================================

CREATE TABLE "ConsentLog" (
  "id"              TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organizationId"  TEXT NOT NULL,
  "pacienteId"      TEXT NOT NULL,
  "tipo"            "ConsentType" NOT NULL,
  "versaoDocumento" TEXT NOT NULL,
  "aceitoEm"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt"       TIMESTAMP(3),
  "ipAddress"       TEXT,
  "userAgent"       TEXT,
  "evidencia"       JSONB,

  CONSTRAINT "ConsentLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ConsentLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "ConsentLog_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Patient"("id") ON DELETE CASCADE
);

CREATE INDEX "ConsentLog_organizationId_pacienteId_idx" ON "ConsentLog"("organizationId", "pacienteId");
CREATE INDEX "ConsentLog_organizationId_tipo_idx" ON "ConsentLog"("organizationId", "tipo");

-- ============================================================
-- WAITLIST ENTRY
-- ============================================================

CREATE TABLE "WaitlistEntry" (
  "id"              TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "organizationId"  TEXT NOT NULL,
  "pacienteId"      TEXT NOT NULL,
  "procedimento"    TEXT,
  "profissionalId"  TEXT,
  "preferencias"    JSONB,
  "status"          TEXT NOT NULL DEFAULT 'ativa',
  "ofertaExpiresAt" TIMESTAMP(3),
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "WaitlistEntry_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE,
  CONSTRAINT "WaitlistEntry_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Patient"("id") ON DELETE CASCADE
);

CREATE INDEX "WaitlistEntry_organizationId_status_idx" ON "WaitlistEntry"("organizationId", "status");
CREATE INDEX "WaitlistEntry_pacienteId_idx" ON "WaitlistEntry"("pacienteId");
