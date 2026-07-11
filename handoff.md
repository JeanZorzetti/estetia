# Handoff — Pendências da auditoria 06/2026 (2026-07-11, atualizado à tarde)

## Feito — manhã (cron LGPD)
- **Cron LGPD retention agendado** (`8694ce4`): a rota `/api/cron/lgpd-retention-cleanup` existia desde a auditoria mas nunca foi agendada no cron-job.org. Em vez de serviço externo, agendado **in-process** em `instrumentation.ts` com `node-cron` (dependência que já estava instalada e sem uso): mensal, dia 1 às 04:00 UTC, produção-only, chama a própria rota via localhost com `CRON_SECRET`.
- **Validação em prod** (pré-deploy, `dryRun=1`): HTTP 200, 6 orgs checadas, 0 erros.

## Feito — tarde (pós-desbloqueio do Jean: segredos rotacionados, billing GitHub liberado, Pusher conferido)
- **CI operacional e validado**: primeiro run real do ci.yml (nunca tinha rodado — billing bloqueava) expôs que só o client Prisma principal era gerado; o código também importa `.prisma/client-wa` de `prisma/whatsapp.prisma`. Fix `6a0e389` (mesmo 2-step generate do Dockerfile). **Build gate verde.**
- **Suíte de testes: 109 falhando → 0** (644 passando, 1 skip em 34 arquivos). Commits `3e0933f` (bugs de produto) + `77b44a8` (testes/infra + flip do CI).
- **Job de testes agora é BLOQUEANTE** no ci.yml (era `continue-on-error`).

### Bugs REAIS de produto corrigidos (`3e0933f`) — achados pelos testes
1. `context-extractor.ts`: intent `qualification_check` só casava com regex `/sirius .../` (resíduo do fork) — "O Estetia é pra mim?" nunca disparava; `demo_request`/`closing_intent` rejeitavam artigos naturais ("agendar **uma** demo").
2. `trigger-logic.ts`: `minLeadScore` era só penalidade de −20 no score — lead frio (30) ainda recebia DemoScheduler com score 80. Agora é gate duro no `canRender`.
3. `layout-engine.ts`: validação de grid rejeitava qualquer layout com 2+ componentes sem `span` (default 12 = linha cheia, mas cobrança por célula). Default agora é `12/columns`.
4. `DealFormGenerator.tsx`: campo Valor vazio virava `NaN` → zod rejeitava e o **form travava a submissão sem nenhum erro visível** (o erro do value nunca era renderizado). Fix: `setValueAs` + render do erro.
5. `forgot-password/route.ts` + `lib/i18n-server.ts`: o caminho de ERRO das APIs crashava se `cookies()` não estivesse disponível (apiError → resolveRequestLocale → getSession). Agora degrada para URL/Accept-Language.

### Causas dos 109 testes falhando (para referência)
Drift código-vs-teste acumulado do fork: matriz de planos antiga (FREE 50 deals/1 user → hoje 100/2), preços Sirius (67/147/397) vs **pricing Estetia deliberado** (149/297/597 no `lib/mercado-pago/products.ts`), campo `organization.plan` → `tier`, actions retornam `null` no sucesso (redirect virou client-side), paths sem `[locale]`, mocks incompletos (plan-limits, automations, pipeline default), NBSP do `Intl` pt-BR, ícones lucide renomeados, e infra de teste (happy-dom sem pointer-capture/carregando iframes de verdade, next-intl ESM não resolvia `next/server`).

## Decisões
- **In-app em vez de cron-job.org** para o cron LGPD (sem API key disponível; reversível).
- **Sweep pino segue DEFERIDO**: 233 `console.*`. Agora que o CI está verde e bloqueante, é o próximo candidato de qualidade — mas continua sem valor para destravar vendas.

## ⚠️ Pendência nova encontrada (decisão do Jean)
- **Divergência de preços entre arquivos**: `lib/mercado-pago/products.ts` = 149/297/597 (header diz "Estetia pricing", é quem gera cobrança) vs `lib/entitlements.ts` `PLAN_PRICING` = 67/147/397 (legado, usado por "scripts admin, webhooks e crons") vs `PricingComparison.tsx` que mostra **R$ 147** no PRO. Se o tier-checkout estiver ativo em algum fluxo, o cliente vê um preço e paga outro. Decidir preço canônico e alinhar os 3 lugares.

## Gotchas
- Repo tem ~750 linhas de erro TS pré-existentes (`tsc --noEmit` falha; build ignora). Gate prático: tsc + filtrar pelos arquivos tocados. Grande parte é falta dos types do vitest nos arquivos de teste (candidato barato: `"types": ["vitest/globals"]` no tsconfig).
- Working tree mantém sujeira pré-existente não relacionada (blog posts modificados, `docs/GSC/` etc.) — não commitada.
- `formatPrice` (Intl pt-BR) emite **NBSP** entre R$ e o valor — comparar strings de moeda exige normalização.
- happy-dom: sem `disableIframePageLoading` ele faz fetch REAL do src de iframes nos testes.
