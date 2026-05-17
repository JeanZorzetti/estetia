-- Manual migration: Billing Modular (Asaas SaaS subscription)
-- Run on production BEFORE deploy

ALTER TABLE "Organization"
  ADD COLUMN IF NOT EXISTS "asaasCustomerId"      TEXT,
  ADD COLUMN IF NOT EXISTS "asaasSubscriptionId"  TEXT,
  ADD COLUMN IF NOT EXISTS "billingCycle"          TEXT DEFAULT 'MONTHLY',
  ADD COLUMN IF NOT EXISTS "billingNextDueDate"    TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "billingActiveModules"  JSONB,
  ADD COLUMN IF NOT EXISTS "billingMonthlyTotal"   DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS "billingYearlyTotal"    DECIMAL(10,2);
