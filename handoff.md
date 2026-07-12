# Handoff — Estetia CRM (atualizado 2026-07-12)

## Feito — 2026-07-12 (cadência de blog da agenda do ROI Hub)

- **Artigo publicado e verificado em prod** (`1549e42`): [TISS e TUSS para Clínicas de Estética e Dermatologia](https://estetiacrm.com.br/blog/tiss-tuss-clinica-estetica-convenios) — HTTP 200, schema `BlogPosting` + `FAQPage`, listado em `/blog`, presente no `sitemap.xml`. Blog vai a **41 posts**.
- **Por que esse tema:** era o **item 11 do `lib/blog/ROADMAP-ARTIGOS-ESTETIA.md`** — o último Tier 1 (alto intent comercial) ainda não publicado. Casa com o TISS 4.01.00 que o produto já implementa (Sprint 4), então é diferencial real, não conteúdo genérico.
- **Ângulo honesto (importante para não canibalizar):** o artigo diz explicitamente que clínica de **estética pura não fatura convênio** (Lei 9.656/1998, art. 10, II exclui procedimento com finalidade estética) e que TISS só interessa a **dermatologia / clínica híbrida**. Isso reforça a fronteira de keywords com o projeto Estetia (fábrica): Doc-CRM = DENTRO da clínica; Estetia = FORA (site/captação).
- Wiring completo conforme `lib/blog/CLAUDE.md`: post em `lib/blog/posts/`, registrado no `index.ts`, 10 FAQs em `lib/faq-schema.ts`, branch de `geoConfig` (entidades Wikidata + citações ANS/Planalto) e `faqDataMap` na page do slug.

### Próximo artigo (em ordem)

**Tier 1 está completo.** O próximo em ordem é o **Tier 2, item 14**: `recall-recompra-clinica-estetica-fidelizacao`. Itens do roadmap já cobertos fora de ordem por outros posts (não refazer): #18 (fluxo de caixa), #21 (precificação), #20 parcialmente (expansão/segunda unidade).

## Feito — 2026-07-11 manhã (cron LGPD)
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
- **Working tree tem trabalho de SEO NÃO COMMITADO desde ~05/06** e ainda não deployado: `config/solucoes-data.ts` (títulos/keywords de dermatologia) e 6 posts do blog (`lastModified` bumpado, títulos reescritos, internal links). Parece completo e coerente — alguém começou e não fechou. **Decidir: commitar ou descartar.** Não foi tocado nas sessões de 11/07 e 12/07.
- `formatPrice` (Intl pt-BR) emite **NBSP** entre R$ e o valor — comparar strings de moeda exige normalização.
- happy-dom: sem `disableIframePageLoading` ele faz fetch REAL do src de iframes nos testes.
