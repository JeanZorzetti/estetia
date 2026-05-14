-- Sprint 4: Convênios, TISS, Operadoras, NFS-e
-- Additive migration — no breaking changes

-- ─── Enums ───────────────────────────────────────────────────────────────────

DO $enums$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'TipoGuia') THEN
        CREATE TYPE "TipoGuia" AS ENUM ('CONSULTA', 'SADT', 'INTERNACAO', 'SP_SADT', 'HONORARIOS');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'StatusGuia') THEN
        CREATE TYPE "StatusGuia" AS ENUM ('RASCUNHO', 'ENVIADA', 'AUTORIZADA', 'NEGADA', 'GLOSADA', 'PAGA', 'CANCELADA');
    END IF;
END
$enums$;

-- ─── Operadora ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Operadora" (
    "id"              TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "organizationId"  TEXT NOT NULL,
    "nome"            TEXT NOT NULL,
    "codigoAns"       TEXT,
    "cnpj"            TEXT,
    "tipo"            TEXT NOT NULL DEFAULT 'CONVENIO',
    "contatoNome"     TEXT,
    "contatoEmail"    TEXT,
    "contatoTelefone" TEXT,
    "prazoRepasseDias" INTEGER,
    "ativo"           BOOLEAN NOT NULL DEFAULT true,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Operadora_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Operadora"
    ADD CONSTRAINT "Operadora_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "Operadora_organizationId_idx" ON "Operadora"("organizationId");
CREATE INDEX IF NOT EXISTS "Operadora_organizationId_ativo_idx" ON "Operadora"("organizationId", "ativo");

-- ─── Convenio ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Convenio" (
    "id"               TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "organizationId"   TEXT NOT NULL,
    "operadoraId"      TEXT NOT NULL,
    "procedureId"      TEXT,
    "codigoTuss"       TEXT,
    "descricaoTuss"    TEXT,
    "valorNegociado"   DECIMAL(10, 2),
    "porcentagemCo"    DOUBLE PRECISION,
    "vigenciaInicio"   TIMESTAMP(3),
    "vigenciaFim"      TIMESTAMP(3),
    "ativo"            BOOLEAN NOT NULL DEFAULT true,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Convenio_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Convenio"
    ADD CONSTRAINT "Convenio_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Convenio"
    ADD CONSTRAINT "Convenio_operadoraId_fkey"
    FOREIGN KEY ("operadoraId") REFERENCES "Operadora"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "Convenio_organizationId_operadoraId_idx" ON "Convenio"("organizationId", "operadoraId");
CREATE INDEX IF NOT EXISTS "Convenio_codigoTuss_idx" ON "Convenio"("codigoTuss");

-- ─── GuiaTiss ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "GuiaTiss" (
    "id"                 TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "organizationId"     TEXT NOT NULL,
    "operadoraId"        TEXT NOT NULL,
    "pacienteId"         TEXT NOT NULL,
    "sessionId"          TEXT,
    "tipo"               "TipoGuia" NOT NULL DEFAULT 'CONSULTA',
    "status"             "StatusGuia" NOT NULL DEFAULT 'RASCUNHO',
    "numeroGuia"         TEXT,
    "codigoTuss"         TEXT,
    "valorProcedimento"  DECIMAL(10, 2),
    "valorTotal"         DECIMAL(10, 2),
    "dataExecucao"       TIMESTAMP(3),
    "xmlEnviado"         TEXT,
    "xmlResposta"        TEXT,
    "motivoGlosa"        TEXT,
    "loteId"             TEXT,
    "nfseNumero"         TEXT,
    "nfseStatus"         TEXT,
    "nfsePayload"        JSONB,
    "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuiaTiss_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "GuiaTiss"
    ADD CONSTRAINT "GuiaTiss_organizationId_fkey"
    FOREIGN KEY ("organizationId") REFERENCES "Organization"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "GuiaTiss"
    ADD CONSTRAINT "GuiaTiss_operadoraId_fkey"
    FOREIGN KEY ("operadoraId") REFERENCES "Operadora"("id")
    ON UPDATE CASCADE;

ALTER TABLE "GuiaTiss"
    ADD CONSTRAINT "GuiaTiss_pacienteId_fkey"
    FOREIGN KEY ("pacienteId") REFERENCES "Patient"("id")
    ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "GuiaTiss_organizationId_status_idx" ON "GuiaTiss"("organizationId", "status");
CREATE INDEX IF NOT EXISTS "GuiaTiss_organizationId_operadoraId_idx" ON "GuiaTiss"("organizationId", "operadoraId");
CREATE INDEX IF NOT EXISTS "GuiaTiss_pacienteId_idx" ON "GuiaTiss"("pacienteId");
