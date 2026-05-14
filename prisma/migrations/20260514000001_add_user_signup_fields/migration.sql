-- Adiciona jobTitle e phone ao User (capturados no signup) — idempotente

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='jobTitle' AND table_schema='public') THEN
        ALTER TABLE "User" ADD COLUMN "jobTitle" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='phone' AND table_schema='public') THEN
        ALTER TABLE "User" ADD COLUMN "phone" TEXT;
    END IF;
END $$;
