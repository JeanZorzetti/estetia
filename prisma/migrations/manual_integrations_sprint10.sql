-- Sprint 10: Webhooks & Produtividade — Slack, Teams, Notion, Trello, Asana,
-- Typeform, JotForm, Zapier, Make, ContaAzul, Bling.
--
-- Os campos Organization já existiam no schema.prisma desde o commit do mega marketplace,
-- portanto este SQL só é necessário em ambientes onde o `db push` não foi rodado.
-- Idempotente via IF NOT EXISTS.

-- Estende enum IntegrationType com os novos providers usados pelo IntegrationLog
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'SLACK';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'TEAMS';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'NOTION';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'TRELLO';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'ASANA';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'TYPEFORM';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'JOTFORM';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'ZAPIER';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'MAKE';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'CONTAAZUL';
ALTER TYPE "IntegrationType" ADD VALUE IF NOT EXISTS 'BLING';

-- Slack
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "slackEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "slackWebhookUrl" TEXT;

-- Microsoft Teams
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "teamsEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "teamsWebhookUrl" TEXT;

-- Notion
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "notionEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "notionApiKey" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "notionDatabaseId" TEXT;

-- Trello
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "trelloEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "trelloApiKey" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "trelloToken" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "trelloBoardId" TEXT;

-- Asana
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "asanaEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "asanaApiKey" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "asanaProjectId" TEXT;

-- Typeform
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "typeformEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "typeformApiKey" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "typeformFormId" TEXT;

-- JotForm
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "jotformEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "jotformApiKey" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "jotformFormId" TEXT;

-- Zapier
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "zapierEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "zapierWebhookUrl" TEXT;

-- Make (Integromat)
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "makeEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "makeWebhookUrl" TEXT;

-- ContaAzul (OAuth)
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "contaazulEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "contaazulClientId" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "contaazulClientSecret" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "contaazulRefreshToken" TEXT;

-- Bling (OAuth)
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "blingEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "blingClientId" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "blingClientSecret" TEXT;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "blingRefreshToken" TEXT;
