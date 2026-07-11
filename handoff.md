# Handoff — Pendências da auditoria 06/2026 (2026-07-11)

## Feito
- **Cron LGPD retention agendado** (`8694ce4`): a rota `/api/cron/lgpd-retention-cleanup` existia desde a auditoria mas nunca foi agendada no cron-job.org. Em vez de serviço externo, agendado **in-process** em `instrumentation.ts` com `node-cron` (dependência que já estava instalada e sem uso): mensal, dia 1 às 04:00 UTC, produção-only, chama a própria rota via localhost com `CRON_SECRET`.
- **Validação em prod** (pré-deploy, `dryRun=1`): HTTP 200, 6 orgs checadas, 0 pacientes expirados, 0 erros. O `CRON_SECRET` do `.env.local` bate com o de prod.
- **Card do roihub atualizado** (`7d76c1f` em `roihub`): ação trocada para "Rotacionar segredos + destravar billing do GitHub Actions".

## Decisões
- **In-app em vez de cron-job.org**: sem API key do cron-job.org em nenhum repo/env → agendar lá seria ação manual do Jean. `node-cron` no `instrumentation.ts` fecha a pendência sem serviço externo. Se preferir cron-job.org depois, basta agendar lá e apagar o bloco do `instrumentation.ts`.
- **Sweep pino DEFERIDO**: 233 chamadas `console.*` em app/lib/components (medido 11/07). Diff grande, valor zero para destravar vendas, e sem CI para proteger (billing). Fazer quando o CI voltar.
- **109 testes vitest DEFERIDOS**: o payoff (flipar test job para bloqueante) depende do GitHub Actions, que segue bloqueado por billing — confirmado 11/07 (jobs falham sem executar nenhum step).

## Pendências (só o Jean resolve)
1. **Rotacionar segredos** expostos no chat da auditoria: Groq, CRON_SECRET, INTEGRATION_ENCRYPTION_KEY (exige re-encrypt dos campos cifrados), Postgres, MinIO, Redis.
2. **Billing do GitHub Actions**: github.com/settings/billing — nenhum job roda até resolver.
3. **Conferir PUSHER_SECRET real em prod.**

## Gotchas
- Repo tem **766 linhas de erro TS pré-existentes** (`tsc --noEmit` falha; build ignora). Gate prático: rodar tsc e filtrar pelos arquivos tocados.
- Working tree tinha (e mantém) sujeira pré-existente não relacionada: blog posts modificados, `docs/GSC/`, `docs/ahref/` etc. — não commitados aqui.
- Landing perf: 50→80 em 06/2026 (fase 1+2). PSI keyless dá 429; para re-medir usar a PSI_API_KEY do roilabs.
