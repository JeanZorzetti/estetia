Commit: fix(i18n): silence MISSING_MESSAGE noise in feature detail probe

features/[slug] probes optional keys in loops (benefits/useCases/faq),
relying on tryT to detect where the list ends. tryT caught the missing
key but next-intl still console.error'd MISSING_MESSAGE on every probe
past the last item — flooding the build log (~40 lines) with non-errors.

Check t.has(key) before t(key): existence test that doesn't trigger the
error handler. Real FAQs/benefits still render; only the out-of-range
probes are silenced. Not missing content — the loops are working as
designed.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com> 
##########################################
### Download Github Archive Started...
### Sat, 13 Jun 2026 18:12:00 GMT
##########################################

#0 building with "default" instance using docker driver

#1 [internal] load build definition from Dockerfile
#1 transferring dockerfile: 2.39kB done
#1 DONE 0.0s

#2 [internal] load metadata for docker.io/library/node:20-slim
#2 DONE 0.3s

#3 [internal] load .dockerignore
#3 transferring context: 716B done
#3 DONE 0.0s

#4 [base 1/3] FROM docker.io/library/node:20-slim@sha256:2cf067cfed83d5ea958367df9f966191a942351a2df77d6f0193e162b5febfc0
#4 resolve docker.io/library/node:20-slim@sha256:2cf067cfed83d5ea958367df9f966191a942351a2df77d6f0193e162b5febfc0 0.0s done
#4 DONE 0.0s

#5 [internal] load build context
#5 transferring context: 37.42MB 0.4s done
#5 DONE 0.5s

#6 [base 3/3] WORKDIR /app
#6 CACHED

#7 [builder 1/5] WORKDIR /app
#7 CACHED

#8 [deps 1/2] COPY package*.json ./
#8 CACHED

#9 [deps 2/2] RUN --mount=type=cache,target=/root/.npm,sharing=locked     npm ci --legacy-peer-deps
#9 CACHED

#10 [base 2/3] RUN apt-get update && apt-get install -y --no-install-recommends     openssl ca-certificates     && rm -rf /var/lib/apt/lists/*
#10 CACHED

#11 [builder 2/5] COPY --from=deps /app/node_modules ./node_modules
#11 CACHED

#12 [builder 3/5] COPY . .
#12 DONE 0.7s

#13 [builder 4/5] RUN node_modules/.bin/prisma generate &&     node_modules/.bin/prisma generate --schema prisma/whatsapp.prisma
#13 0.389 Prisma schema loaded from prisma/schema.prisma
#13 3.773 
#13 3.773 ✔ Generated Prisma Client (v5.19.0) to ./node_modules/@prisma/client in 1.85s
#13 3.773 
#13 3.773 Start by importing your Prisma Client (See: http://pris.ly/d/importing-client)
#13 3.773 
#13 3.773 Tip: Want to turn off tips and other hints? https://pris.ly/tip-4-nohints
#13 3.773 
#13 4.351 Prisma schema loaded from prisma/whatsapp.prisma
#13 4.696 
#13 4.696 ✔ Generated Prisma Client (v5.19.0) to ./node_modules/.prisma/client-wa in 97ms
#13 4.696 
#13 4.696 Start by importing your Prisma Client (See: http://pris.ly/d/importing-client)
#13 4.696 
#13 4.696 Tip: Easily identify and fix slow SQL queries in your app. Optimize helps you enhance your visibility: https://pris.ly/--optimize
#13 4.696 
#13 4.720 ┌─────────────────────────────────────────────────────────┐
#13 4.720 │  Update available 5.19.0 -> 7.8.0                       │
#13 4.720 │                                                         │
#13 4.720 │  This is a major update - please follow the guide at    │
#13 4.720 │  https://pris.ly/d/major-version-upgrade                │
#13 4.720 │                                                         │
#13 4.720 │  Run the following to update                            │
#13 4.720 │    npm i --save-dev prisma@latest                       │
#13 4.720 │    npm i @prisma/client@latest                          │
#13 4.720 └─────────────────────────────────────────────────────────┘
#13 DONE 4.9s

#14 [builder 5/5] RUN NODE_OPTIONS="--max-old-space-size=4096" node_modules/.bin/next build
#14 1.126 ⚠ `eslint` configuration in next.config.ts is no longer supported. See more info here: https://nextjs.org/docs/app/api-reference/cli/next#next-lint-options
#14 1.132 ⚠ Invalid next.config.ts options detected: 
#14 1.132 ⚠     Unrecognized key(s) in object: 'eslint'
#14 1.132 ⚠ See more info here: https://nextjs.org/docs/messages/invalid-next-config
#14 1.156 ▲ Next.js 16.1.1 (Turbopack)
#14 1.156 - Experiments (use with caution):
#14 1.156   · optimizePackageImports
#14 1.156   · staleTimes
#14 1.156 
#14 1.158 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
#14 1.253   Creating an optimized production build ...
#14 68.78 ✓ Compiled successfully in 67s
#14 68.79   Skipping validation of types
#14 69.31   Collecting page data using 3 workers ...
#14 73.79 ⚠ Using edge runtime on a page currently disables static generation for that page
#14 75.44   Generating static pages using 3 workers (0/654) ...
#14 75.51 ⚠ metadataBase property in metadata export is not set for resolving social open graph or twitter images, using "http://localhost:3000". See https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase
#14 75.58 ⚠ metadataBase property in metadata export is not set for resolving social open graph or twitter images, using "http://localhost:3000". See https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase
#14 75.81   Generating static pages using 3 workers (163/654) 
#14 76.11 ⚠ metadataBase property in metadata export is not set for resolving social open graph or twitter images, using "http://localhost:3000". See https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase
#14 76.30 [getPostEntities] Error for comparar-sistema-gestao-clinica-estetica: Error [PrismaClientInitializationError]: 
#14 76.30 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.30 
#14 76.30 
#14 76.30 error: Environment variable not found: DATABASE_URL.
#14 76.30   -->  schema.prisma:10
#14 76.30    | 
#14 76.30  9 |   provider = "postgresql"
#14 76.30 10 |   url      = env("DATABASE_URL")
#14 76.30    | 
#14 76.30 
#14 76.30 Validation Error Count: 1
#14 76.30     at <unknown> (-->  schema.prisma:10)
#14 76.30     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.30     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.30     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.30   clientVersion: '5.19.0',
#14 76.30   errorCode: undefined
#14 76.30 }
#14 76.30 [getPostEntities] Error for como-migrar-crm-clinica-estetica: Error [PrismaClientInitializationError]: 
#14 76.30 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.30 
#14 76.30 
#14 76.30 error: Environment variable not found: DATABASE_URL.
#14 76.30   -->  schema.prisma:10
#14 76.30    | 
#14 76.30  9 |   provider = "postgresql"
#14 76.30 10 |   url      = env("DATABASE_URL")
#14 76.30    | 
#14 76.30 
#14 76.30 Validation Error Count: 1
#14 76.30     at <unknown> (-->  schema.prisma:10)
#14 76.30     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.30     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.30     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.30   clientVersion: '5.19.0',
#14 76.30   errorCode: undefined
#14 76.30 }
#14 76.30 [getPostEntities] Error for quanto-custa-crm-clinica-estetica: Error [PrismaClientInitializationError]: 
#14 76.30 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.30 
#14 76.30 
#14 76.30 error: Environment variable not found: DATABASE_URL.
#14 76.30   -->  schema.prisma:10
#14 76.30    | 
#14 76.30  9 |   provider = "postgresql"
#14 76.30 10 |   url      = env("DATABASE_URL")
#14 76.30    | 
#14 76.30 
#14 76.30 Validation Error Count: 1
#14 76.30     at <unknown> (-->  schema.prisma:10)
#14 76.30     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.30     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.30     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.30   clientVersion: '5.19.0',
#14 76.30   errorCode: undefined
#14 76.30 }
#14 76.30 [getPostEntities] Error for roi-crm-clinica-estetica-faturamento: Error [PrismaClientInitializationError]: 
#14 76.30 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.30 
#14 76.30 
#14 76.30 error: Environment variable not found: DATABASE_URL.
#14 76.30   -->  schema.prisma:10
#14 76.30    | 
#14 76.30  9 |   provider = "postgresql"
#14 76.30 10 |   url      = env("DATABASE_URL")
#14 76.30    | 
#14 76.30 
#14 76.30 Validation Error Count: 1
#14 76.30     at <unknown> (-->  schema.prisma:10)
#14 76.30     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.30     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.30     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.30   clientVersion: '5.19.0',
#14 76.30   errorCode: undefined
#14 76.30 }
#14 76.30 [getPostEntities] Error for melhor-crm-clinica-estetica-2026: Error [PrismaClientInitializationError]: 
#14 76.30 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.30 
#14 76.30 
#14 76.30 error: Environment variable not found: DATABASE_URL.
#14 76.30   -->  schema.prisma:10
#14 76.30    | 
#14 76.30  9 |   provider = "postgresql"
#14 76.30 10 |   url      = env("DATABASE_URL")
#14 76.30    | 
#14 76.30 
#14 76.30 Validation Error Count: 1
#14 76.30     at <unknown> (-->  schema.prisma:10)
#14 76.30     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.30     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.30     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.30   clientVersion: '5.19.0',
#14 76.30   errorCode: undefined
#14 76.30 }
#14 76.30 [getPostEntities] Error for spin-selling-para-clinicas-de-estetica: Error [PrismaClientInitializationError]: 
#14 76.30 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.30 
#14 76.30 
#14 76.30 error: Environment variable not found: DATABASE_URL.
#14 76.30   -->  schema.prisma:10
#14 76.30    | 
#14 76.30  9 |   provider = "postgresql"
#14 76.30 10 |   url      = env("DATABASE_URL")
#14 76.30    | 
#14 76.30 
#14 76.30 Validation Error Count: 1
#14 76.30     at <unknown> (-->  schema.prisma:10)
#14 76.30     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.30     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.30     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.30   clientVersion: '5.19.0',
#14 76.30   errorCode: undefined
#14 76.30 }
#14 76.30 [getPostEntities] Error for como-reduzir-no-show-em-clinicas-de-estetica: Error [PrismaClientInitializationError]: 
#14 76.30 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.30 
#14 76.30 
#14 76.30 error: Environment variable not found: DATABASE_URL.
#14 76.30   -->  schema.prisma:10
#14 76.30    | 
#14 76.30  9 |   provider = "postgresql"
#14 76.30 10 |   url      = env("DATABASE_URL")
#14 76.30    | 
#14 76.30 
#14 76.30 Validation Error Count: 1
#14 76.30     at <unknown> (-->  schema.prisma:10)
#14 76.30     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.30     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.30     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.30   clientVersion: '5.19.0',
#14 76.30   errorCode: undefined
#14 76.30 }
#14 76.30 [getPostEntities] Error for lgpd-para-clinicas-de-estetica-guia-2026: Error [PrismaClientInitializationError]: 
#14 76.30 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.30 
#14 76.30 
#14 76.30 error: Environment variable not found: DATABASE_URL.
#14 76.30   -->  schema.prisma:10
#14 76.30    | 
#14 76.30  9 |   provider = "postgresql"
#14 76.30 10 |   url      = env("DATABASE_URL")
#14 76.30    | 
#14 76.30 
#14 76.30 Validation Error Count: 1
#14 76.30     at <unknown> (-->  schema.prisma:10)
#14 76.30     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.30     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.30     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.30   clientVersion: '5.19.0',
#14 76.30   errorCode: undefined
#14 76.30 }
#14 76.68 [getPostEntities] Error for anamnese-digital-clinica-de-estetica: Error [PrismaClientInitializationError]: 
#14 76.68 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.68 
#14 76.68 
#14 76.68 error: Environment variable not found: DATABASE_URL.
#14 76.68   -->  schema.prisma:10
#14 76.68    | 
#14 76.68  9 |   provider = "postgresql"
#14 76.68 10 |   url      = env("DATABASE_URL")
#14 76.68    | 
#14 76.68 
#14 76.68 Validation Error Count: 1
#14 76.68     at <unknown> (-->  schema.prisma:10)
#14 76.68     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.68     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.68     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.68   clientVersion: '5.19.0',
#14 76.68   errorCode: undefined
#14 76.68 }
#14 76.68 [getPostEntities] Error for kpis-essenciais-clinica-de-estetica: Error [PrismaClientInitializationError]: 
#14 76.68 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.68 
#14 76.68 
#14 76.68 error: Environment variable not found: DATABASE_URL.
#14 76.68   -->  schema.prisma:10
#14 76.68    | 
#14 76.68  9 |   provider = "postgresql"
#14 76.68 10 |   url      = env("DATABASE_URL")
#14 76.68    | 
#14 76.68 
#14 76.68 Validation Error Count: 1
#14 76.68     at <unknown> (-->  schema.prisma:10)
#14 76.68     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.68     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.68     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.68   clientVersion: '5.19.0',
#14 76.68   errorCode: undefined
#14 76.68 }
#14 76.68 [getPostEntities] Error for crm-para-clinica-de-estetica-guia-completo: Error [PrismaClientInitializationError]: 
#14 76.68 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.68 
#14 76.68 
#14 76.68 error: Environment variable not found: DATABASE_URL.
#14 76.68   -->  schema.prisma:10
#14 76.68    | 
#14 76.68  9 |   provider = "postgresql"
#14 76.68 10 |   url      = env("DATABASE_URL")
#14 76.68    | 
#14 76.68 
#14 76.68 Validation Error Count: 1
#14 76.68     at <unknown> (-->  schema.prisma:10)
#14 76.68     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.68     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.68     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.68   clientVersion: '5.19.0',
#14 76.68   errorCode: undefined
#14 76.68 }
#14 76.68 [getPostEntities] Error for prontuario-eletronico-clinica-estetica: Error [PrismaClientInitializationError]: 
#14 76.68 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.68 
#14 76.68 
#14 76.68 error: Environment variable not found: DATABASE_URL.
#14 76.68   -->  schema.prisma:10
#14 76.68    | 
#14 76.68  9 |   provider = "postgresql"
#14 76.68 10 |   url      = env("DATABASE_URL")
#14 76.68    | 
#14 76.68 
#14 76.68 Validation Error Count: 1
#14 76.68     at <unknown> (-->  schema.prisma:10)
#14 76.68     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.68     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.68     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.68   clientVersion: '5.19.0',
#14 76.68   errorCode: undefined
#14 76.68 }
#14 76.68 [getPostEntities] Error for software-gestao-dermatologia-guia: Error [PrismaClientInitializationError]: 
#14 76.68 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.68 
#14 76.68 
#14 76.68 error: Environment variable not found: DATABASE_URL.
#14 76.68   -->  schema.prisma:10
#14 76.68    | 
#14 76.68  9 |   provider = "postgresql"
#14 76.68 10 |   url      = env("DATABASE_URL")
#14 76.68    | 
#14 76.68 
#14 76.68 Validation Error Count: 1
#14 76.68     at <unknown> (-->  schema.prisma:10)
#14 76.68     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.68     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.68     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.68   clientVersion: '5.19.0',
#14 76.68   errorCode: undefined
#14 76.68 }
#14 76.68 [getPostEntities] Error for whatsapp-business-clinica-estetica-automacao: Error [PrismaClientInitializationError]: 
#14 76.68 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.68 
#14 76.68 
#14 76.68 error: Environment variable not found: DATABASE_URL.
#14 76.68   -->  schema.prisma:10
#14 76.68    | 
#14 76.68  9 |   provider = "postgresql"
#14 76.68 10 |   url      = env("DATABASE_URL")
#14 76.68    | 
#14 76.68 
#14 76.68 Validation Error Count: 1
#14 76.68     at <unknown> (-->  schema.prisma:10)
#14 76.68     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.68     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.68     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.68   clientVersion: '5.19.0',
#14 76.68   errorCode: undefined
#14 76.68 }
#14 76.68 [getPostEntities] Error for gestao-toxina-botulinica-clinica-estetica: Error [PrismaClientInitializationError]: 
#14 76.68 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.68 
#14 76.68 
#14 76.68 error: Environment variable not found: DATABASE_URL.
#14 76.68   -->  schema.prisma:10
#14 76.68    | 
#14 76.68  9 |   provider = "postgresql"
#14 76.68 10 |   url      = env("DATABASE_URL")
#14 76.68    | 
#14 76.68 
#14 76.68 Validation Error Count: 1
#14 76.68     at <unknown> (-->  schema.prisma:10)
#14 76.68     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.68     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.68     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.68   clientVersion: '5.19.0',
#14 76.68   errorCode: undefined
#14 76.68 }
#14 76.68 [getPostEntities] Error for agendamento-online-clinica-estetica: Error [PrismaClientInitializationError]: 
#14 76.68 Invalid `prisma.contentEntity.findMany()` invocation:
#14 76.68 
#14 76.68 
#14 76.68 error: Environment variable not found: DATABASE_URL.
#14 76.68   -->  schema.prisma:10
#14 76.68    | 
#14 76.68  9 |   provider = "postgresql"
#14 76.68 10 |   url      = env("DATABASE_URL")
#14 76.68    | 
#14 76.68 
#14 76.68 Validation Error Count: 1
#14 76.68     at <unknown> (-->  schema.prisma:10)
#14 76.68     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 76.68     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 76.68     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 76.68   clientVersion: '5.19.0',
#14 76.68   errorCode: undefined
#14 76.68 }
#14 76.87   Generating static pages using 3 workers (326/654) 
#14 77.11 [getPostEntities] Error for preenchimento-acido-hialuronico-captacao-pacientes: Error [PrismaClientInitializationError]: 
#14 77.11 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.11 
#14 77.11 
#14 77.11 error: Environment variable not found: DATABASE_URL.
#14 77.11   -->  schema.prisma:10
#14 77.11    | 
#14 77.11  9 |   provider = "postgresql"
#14 77.11 10 |   url      = env("DATABASE_URL")
#14 77.11    | 
#14 77.11 
#14 77.11 Validation Error Count: 1
#14 77.11     at <unknown> (-->  schema.prisma:10)
#14 77.11     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.11     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.11     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.11   clientVersion: '5.19.0',
#14 77.11   errorCode: undefined
#14 77.11 }
#14 77.11 [getPostEntities] Error for harmonizacao-facial-precificacao-avaliacao: Error [PrismaClientInitializationError]: 
#14 77.11 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.11 
#14 77.11 
#14 77.11 error: Environment variable not found: DATABASE_URL.
#14 77.11   -->  schema.prisma:10
#14 77.11    | 
#14 77.11  9 |   provider = "postgresql"
#14 77.11 10 |   url      = env("DATABASE_URL")
#14 77.11    | 
#14 77.11 
#14 77.11 Validation Error Count: 1
#14 77.11     at <unknown> (-->  schema.prisma:10)
#14 77.11     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.11     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.11     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.11   clientVersion: '5.19.0',
#14 77.11   errorCode: undefined
#14 77.11 }
#14 77.11 [getPostEntities] Error for depilacao-laser-pacotes-recorrencia: Error [PrismaClientInitializationError]: 
#14 77.11 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.11 
#14 77.11 
#14 77.11 error: Environment variable not found: DATABASE_URL.
#14 77.11   -->  schema.prisma:10
#14 77.11    | 
#14 77.11  9 |   provider = "postgresql"
#14 77.11 10 |   url      = env("DATABASE_URL")
#14 77.11    | 
#14 77.11 
#14 77.11 Validation Error Count: 1
#14 77.11     at <unknown> (-->  schema.prisma:10)
#14 77.11     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.11     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.11     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.11   clientVersion: '5.19.0',
#14 77.11   errorCode: undefined
#14 77.11 }
#14 77.11 [getPostEntities] Error for limpeza-de-pele-protocolos-fidelizacao: Error [PrismaClientInitializationError]: 
#14 77.11 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.11 
#14 77.11 
#14 77.11 error: Environment variable not found: DATABASE_URL.
#14 77.11   -->  schema.prisma:10
#14 77.11    | 
#14 77.11  9 |   provider = "postgresql"
#14 77.11 10 |   url      = env("DATABASE_URL")
#14 77.11    | 
#14 77.11 
#14 77.11 Validation Error Count: 1
#14 77.11     at <unknown> (-->  schema.prisma:10)
#14 77.11     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.11     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.11     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.11   clientVersion: '5.19.0',
#14 77.11   errorCode: undefined
#14 77.11 }
#14 77.11 [getPostEntities] Error for bioestimuladores-colageno-clinica-estetica: Error [PrismaClientInitializationError]: 
#14 77.11 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.11 
#14 77.11 
#14 77.11 error: Environment variable not found: DATABASE_URL.
#14 77.11   -->  schema.prisma:10
#14 77.11    | 
#14 77.11  9 |   provider = "postgresql"
#14 77.11 10 |   url      = env("DATABASE_URL")
#14 77.11    | 
#14 77.11 
#14 77.11 Validation Error Count: 1
#14 77.11     at <unknown> (-->  schema.prisma:10)
#14 77.11     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.11     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.11     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.11   clientVersion: '5.19.0',
#14 77.11   errorCode: undefined
#14 77.11 }
#14 77.11 [getPostEntities] Error for criolipolise-gordura-localizada-pacotes: Error [PrismaClientInitializationError]: 
#14 77.11 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.11 
#14 77.11 
#14 77.11 error: Environment variable not found: DATABASE_URL.
#14 77.11   -->  schema.prisma:10
#14 77.11    | 
#14 77.11  9 |   provider = "postgresql"
#14 77.11 10 |   url      = env("DATABASE_URL")
#14 77.11    | 
#14 77.11 
#14 77.11 Validation Error Count: 1
#14 77.11     at <unknown> (-->  schema.prisma:10)
#14 77.11     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.11     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.11     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.11   clientVersion: '5.19.0',
#14 77.11   errorCode: undefined
#14 77.11 }
#14 77.11 [getPostEntities] Error for microagulhamento-protocolos-fidelizacao: Error [PrismaClientInitializationError]: 
#14 77.11 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.11 
#14 77.11 
#14 77.11 error: Environment variable not found: DATABASE_URL.
#14 77.11   -->  schema.prisma:10
#14 77.11    | 
#14 77.11  9 |   provider = "postgresql"
#14 77.11 10 |   url      = env("DATABASE_URL")
#14 77.11    | 
#14 77.11 
#14 77.11 Validation Error Count: 1
#14 77.11     at <unknown> (-->  schema.prisma:10)
#14 77.11     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.11     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.11     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.11   clientVersion: '5.19.0',
#14 77.11   errorCode: undefined
#14 77.11 }
#14 77.12 [getPostEntities] Error for peeling-quimico-captacao-jornada-paciente: Error [PrismaClientInitializationError]: 
#14 77.12 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.12 
#14 77.12 
#14 77.12 error: Environment variable not found: DATABASE_URL.
#14 77.12   -->  schema.prisma:10
#14 77.12    | 
#14 77.12  9 |   provider = "postgresql"
#14 77.12 10 |   url      = env("DATABASE_URL")
#14 77.12    | 
#14 77.12 
#14 77.12 Validation Error Count: 1
#14 77.12     at <unknown> (-->  schema.prisma:10)
#14 77.12     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.12     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.12     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.12   clientVersion: '5.19.0',
#14 77.12   errorCode: undefined
#14 77.12 }
#14 77.44 [getPostEntities] Error for fios-pdo-lifting-avaliacao-ticket-alto: Error [PrismaClientInitializationError]: 
#14 77.44 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.44 
#14 77.44 
#14 77.44 error: Environment variable not found: DATABASE_URL.
#14 77.44   -->  schema.prisma:10
#14 77.44    | 
#14 77.44  9 |   provider = "postgresql"
#14 77.44 10 |   url      = env("DATABASE_URL")
#14 77.44    | 
#14 77.44 
#14 77.44 Validation Error Count: 1
#14 77.44     at <unknown> (-->  schema.prisma:10)
#14 77.44     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.44     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.44     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.44   clientVersion: '5.19.0',
#14 77.44   errorCode: undefined
#14 77.44 }
#14 77.44 [getPostEntities] Error for enzimas-papada-gordura-submentual-captacao: Error [PrismaClientInitializationError]: 
#14 77.44 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.44 
#14 77.44 
#14 77.44 error: Environment variable not found: DATABASE_URL.
#14 77.44   -->  schema.prisma:10
#14 77.44    | 
#14 77.44  9 |   provider = "postgresql"
#14 77.44 10 |   url      = env("DATABASE_URL")
#14 77.44    | 
#14 77.44 
#14 77.44 Validation Error Count: 1
#14 77.44     at <unknown> (-->  schema.prisma:10)
#14 77.44     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.44     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.44     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.44   clientVersion: '5.19.0',
#14 77.44   errorCode: undefined
#14 77.44 }
#14 77.44 [getPostEntities] Error for radiofrequencia-ultrassom-microfocado-pacotes: Error [PrismaClientInitializationError]: 
#14 77.44 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.44 
#14 77.44 
#14 77.44 error: Environment variable not found: DATABASE_URL.
#14 77.44   -->  schema.prisma:10
#14 77.44    | 
#14 77.44  9 |   provider = "postgresql"
#14 77.44 10 |   url      = env("DATABASE_URL")
#14 77.44    | 
#14 77.44 
#14 77.44 Validation Error Count: 1
#14 77.44     at <unknown> (-->  schema.prisma:10)
#14 77.44     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.44     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.44     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.44   clientVersion: '5.19.0',
#14 77.44   errorCode: undefined
#14 77.44 }
#14 77.44 [getPostEntities] Error for micropigmentacao-sobrancelha-recorrencia-retoque: Error [PrismaClientInitializationError]: 
#14 77.44 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.44 
#14 77.44 
#14 77.44 error: Environment variable not found: DATABASE_URL.
#14 77.44   -->  schema.prisma:10
#14 77.44    | 
#14 77.44  9 |   provider = "postgresql"
#14 77.44 10 |   url      = env("DATABASE_URL")
#14 77.44    | 
#14 77.44 
#14 77.44 Validation Error Count: 1
#14 77.44     at <unknown> (-->  schema.prisma:10)
#14 77.44     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.44     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.44     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.44   clientVersion: '5.19.0',
#14 77.44   errorCode: undefined
#14 77.44 }
#14 77.44 [getPostEntities] Error for tratamento-capilar-calvicie-protocolos-fidelizacao: Error [PrismaClientInitializationError]: 
#14 77.44 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.44 
#14 77.44 
#14 77.44 error: Environment variable not found: DATABASE_URL.
#14 77.44   -->  schema.prisma:10
#14 77.44    | 
#14 77.44  9 |   provider = "postgresql"
#14 77.44 10 |   url      = env("DATABASE_URL")
#14 77.44    | 
#14 77.44 
#14 77.44 Validation Error Count: 1
#14 77.44     at <unknown> (-->  schema.prisma:10)
#14 77.44     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.44     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.44     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.44   clientVersion: '5.19.0',
#14 77.44   errorCode: undefined
#14 77.44 }
#14 77.44 [getPostEntities] Error for drenagem-linfatica-pos-operatorio-recorrencia: Error [PrismaClientInitializationError]: 
#14 77.44 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.44 
#14 77.44 
#14 77.44 error: Environment variable not found: DATABASE_URL.
#14 77.44   -->  schema.prisma:10
#14 77.44    | 
#14 77.44  9 |   provider = "postgresql"
#14 77.44 10 |   url      = env("DATABASE_URL")
#14 77.44    | 
#14 77.44 
#14 77.44 Validation Error Count: 1
#14 77.44     at <unknown> (-->  schema.prisma:10)
#14 77.44     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.44     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.44     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.44   clientVersion: '5.19.0',
#14 77.44   errorCode: undefined
#14 77.44 }
#14 77.44 [getPostEntities] Error for contratar-treinar-recepcionista-clinica-estetica: Error [PrismaClientInitializationError]: 
#14 77.44 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.44 
#14 77.44 
#14 77.44 error: Environment variable not found: DATABASE_URL.
#14 77.44   -->  schema.prisma:10
#14 77.44    | 
#14 77.44  9 |   provider = "postgresql"
#14 77.44 10 |   url      = env("DATABASE_URL")
#14 77.44    | 
#14 77.44 
#14 77.44 Validation Error Count: 1
#14 77.44     at <unknown> (-->  schema.prisma:10)
#14 77.44     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.44     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.44     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.44   clientVersion: '5.19.0',
#14 77.44   errorCode: undefined
#14 77.44 }
#14 77.44 [getPostEntities] Error for comissao-profissionais-clinica-estetica-modelos: Error [PrismaClientInitializationError]: 
#14 77.44 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.44 
#14 77.44 
#14 77.44 error: Environment variable not found: DATABASE_URL.
#14 77.44   -->  schema.prisma:10
#14 77.44    | 
#14 77.44  9 |   provider = "postgresql"
#14 77.44 10 |   url      = env("DATABASE_URL")
#14 77.44    | 
#14 77.44 
#14 77.44 Validation Error Count: 1
#14 77.44     at <unknown> (-->  schema.prisma:10)
#14 77.44     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.44     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.44     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.44   clientVersion: '5.19.0',
#14 77.44   errorCode: undefined
#14 77.44 }
#14 77.60   Generating static pages using 3 workers (490/654) 
#14 77.76 [getPostEntities] Error for gestao-estoque-produtos-clinica-estetica: Error [PrismaClientInitializationError]: 
#14 77.76 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.76 
#14 77.76 
#14 77.76 error: Environment variable not found: DATABASE_URL.
#14 77.76   -->  schema.prisma:10
#14 77.76    | 
#14 77.76  9 |   provider = "postgresql"
#14 77.76 10 |   url      = env("DATABASE_URL")
#14 77.76    | 
#14 77.76 
#14 77.76 Validation Error Count: 1
#14 77.76     at <unknown> (-->  schema.prisma:10)
#14 77.76     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.76     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.76     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.76   clientVersion: '5.19.0',
#14 77.76   errorCode: undefined
#14 77.76 }
#14 77.76 [getPostEntities] Error for produtividade-equipe-clinica-estetica-indicadores: Error [PrismaClientInitializationError]: 
#14 77.76 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.76 
#14 77.76 
#14 77.76 error: Environment variable not found: DATABASE_URL.
#14 77.76   -->  schema.prisma:10
#14 77.76    | 
#14 77.76  9 |   provider = "postgresql"
#14 77.76 10 |   url      = env("DATABASE_URL")
#14 77.76    | 
#14 77.76 
#14 77.76 Validation Error Count: 1
#14 77.76     at <unknown> (-->  schema.prisma:10)
#14 77.76     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.76     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.76     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.76   clientVersion: '5.19.0',
#14 77.76   errorCode: undefined
#14 77.76 }
#14 77.76 [getPostEntities] Error for gestao-salas-agenda-equipe-clinica-estetica: Error [PrismaClientInitializationError]: 
#14 77.76 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.76 
#14 77.76 
#14 77.76 error: Environment variable not found: DATABASE_URL.
#14 77.76   -->  schema.prisma:10
#14 77.76    | 
#14 77.76  9 |   provider = "postgresql"
#14 77.76 10 |   url      = env("DATABASE_URL")
#14 77.76    | 
#14 77.76 
#14 77.76 Validation Error Count: 1
#14 77.76     at <unknown> (-->  schema.prisma:10)
#14 77.76     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.76     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.76     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.76   clientVersion: '5.19.0',
#14 77.76   errorCode: undefined
#14 77.76 }
#14 77.76 [getPostEntities] Error for fluxo-de-caixa-clinica-estetica-gestao-financeira: Error [PrismaClientInitializationError]: 
#14 77.76 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.76 
#14 77.76 
#14 77.76 error: Environment variable not found: DATABASE_URL.
#14 77.76   -->  schema.prisma:10
#14 77.76    | 
#14 77.76  9 |   provider = "postgresql"
#14 77.76 10 |   url      = env("DATABASE_URL")
#14 77.76    | 
#14 77.76 
#14 77.76 Validation Error Count: 1
#14 77.76     at <unknown> (-->  schema.prisma:10)
#14 77.76     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.76     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.76     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.76   clientVersion: '5.19.0',
#14 77.76   errorCode: undefined
#14 77.76 }
#14 77.76 [getPostEntities] Error for precificacao-procedimentos-esteticos-margem-lucro: Error [PrismaClientInitializationError]: 
#14 77.76 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.76 
#14 77.76 
#14 77.76 error: Environment variable not found: DATABASE_URL.
#14 77.76   -->  schema.prisma:10
#14 77.76    | 
#14 77.76  9 |   provider = "postgresql"
#14 77.76 10 |   url      = env("DATABASE_URL")
#14 77.76    | 
#14 77.76 
#14 77.76 Validation Error Count: 1
#14 77.76     at <unknown> (-->  schema.prisma:10)
#14 77.76     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.76     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.76     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.76   clientVersion: '5.19.0',
#14 77.76   errorCode: undefined
#14 77.76 }
#14 77.76 [getPostEntities] Error for expansao-segunda-unidade-clinica-estetica: Error [PrismaClientInitializationError]: 
#14 77.76 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.76 
#14 77.76 
#14 77.76 error: Environment variable not found: DATABASE_URL.
#14 77.76   -->  schema.prisma:10
#14 77.76    | 
#14 77.76  9 |   provider = "postgresql"
#14 77.76 10 |   url      = env("DATABASE_URL")
#14 77.76    | 
#14 77.76 
#14 77.76 Validation Error Count: 1
#14 77.76     at <unknown> (-->  schema.prisma:10)
#14 77.76     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.76     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.76     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.76   clientVersion: '5.19.0',
#14 77.76   errorCode: undefined
#14 77.76 }
#14 77.76 [getPostEntities] Error for capital-de-giro-saude-financeira-clinica-estetica: Error [PrismaClientInitializationError]: 
#14 77.76 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.76 
#14 77.76 
#14 77.76 error: Environment variable not found: DATABASE_URL.
#14 77.76   -->  schema.prisma:10
#14 77.76    | 
#14 77.76  9 |   provider = "postgresql"
#14 77.76 10 |   url      = env("DATABASE_URL")
#14 77.76    | 
#14 77.76 
#14 77.76 Validation Error Count: 1
#14 77.76     at <unknown> (-->  schema.prisma:10)
#14 77.76     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.76     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.76     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.76   clientVersion: '5.19.0',
#14 77.76   errorCode: undefined
#14 77.76 }
#14 77.76 [getPostEntities] Error for inadimplencia-parcelamento-clinica-estetica: Error [PrismaClientInitializationError]: 
#14 77.76 Invalid `prisma.contentEntity.findMany()` invocation:
#14 77.76 
#14 77.76 
#14 77.76 error: Environment variable not found: DATABASE_URL.
#14 77.76   -->  schema.prisma:10
#14 77.76    | 
#14 77.76  9 |   provider = "postgresql"
#14 77.76 10 |   url      = env("DATABASE_URL")
#14 77.76    | 
#14 77.76 
#14 77.76 Validation Error Count: 1
#14 77.76     at <unknown> (-->  schema.prisma:10)
#14 77.76     at async cn (.next/server/chunks/ssr/_4c025c68._.js:36:834)
#14 77.76     at async co (.next/server/chunks/ssr/_4c025c68._.js:36:1139)
#14 77.76     at async ai (.next/server/chunks/ssr/_c6ebb912._.js:1:42151) {
#14 77.76   clientVersion: '5.19.0',
#14 77.76   errorCode: undefined
#14 77.76 }
#14 80.66 Error: MISSING_MESSAGE: marketing.integrations.items.whatsapp.detail.howItWorks.5.title (pt-BR)
#14 80.66     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.66     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.66     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.66     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.66     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 80.66   code: 'MISSING_MESSAGE',
#14 80.66   originalMessage: 'marketing.integrations.items.whatsapp.detail.howItWorks.5.title (pt-BR)'
#14 80.66 }
#14 80.66 Error: MISSING_MESSAGE: marketing.integrations.items.whatsapp.detail.howItWorks.5.text (pt-BR)
#14 80.66     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.66     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.66     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.66     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.66     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 80.66   code: 'MISSING_MESSAGE',
#14 80.66   originalMessage: 'marketing.integrations.items.whatsapp.detail.howItWorks.5.text (pt-BR)'
#14 80.66 }
#14 80.66 Error: MISSING_MESSAGE: marketing.integrations.items.whatsapp.detail.faq.5.q (pt-BR)
#14 80.66     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.66     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.66     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.66     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.66     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 80.66   code: 'MISSING_MESSAGE',
#14 80.66   originalMessage: 'marketing.integrations.items.whatsapp.detail.faq.5.q (pt-BR)'
#14 80.66 }
#14 80.66 Error: MISSING_MESSAGE: marketing.integrations.items.whatsapp.detail.faq.5.a (pt-BR)
#14 80.66     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.66     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.66     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.66     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.66     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 80.66   code: 'MISSING_MESSAGE',
#14 80.66   originalMessage: 'marketing.integrations.items.whatsapp.detail.faq.5.a (pt-BR)'
#14 80.66 }
#14 80.69 Error: MISSING_MESSAGE: marketing.integrations.items.tiss.detail.benefits.6.title (pt-BR)
#14 80.69     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.69     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.69     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.69     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.69     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 80.69   code: 'MISSING_MESSAGE',
#14 80.69   originalMessage: 'marketing.integrations.items.tiss.detail.benefits.6.title (pt-BR)'
#14 80.69 }
#14 80.69 Error: MISSING_MESSAGE: marketing.integrations.items.tiss.detail.benefits.6.text (pt-BR)
#14 80.69     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.69     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.69     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.69     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.69     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 80.69   code: 'MISSING_MESSAGE',
#14 80.69   originalMessage: 'marketing.integrations.items.tiss.detail.benefits.6.text (pt-BR)'
#14 80.69 }
#14 80.69 Error: MISSING_MESSAGE: marketing.integrations.items.tiss.detail.howItWorks.5.title (pt-BR)
#14 80.69     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.69     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.69     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.69     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.69     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 80.69   code: 'MISSING_MESSAGE',
#14 80.69   originalMessage: 'marketing.integrations.items.tiss.detail.howItWorks.5.title (pt-BR)'
#14 80.69 }
#14 80.69 Error: MISSING_MESSAGE: marketing.integrations.items.tiss.detail.howItWorks.5.text (pt-BR)
#14 80.69     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.69     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.69     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.69     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.69     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 80.69   code: 'MISSING_MESSAGE',
#14 80.69   originalMessage: 'marketing.integrations.items.tiss.detail.howItWorks.5.text (pt-BR)'
#14 80.69 }
#14 80.69 Error: MISSING_MESSAGE: marketing.integrations.items.tiss.detail.faq.4.q (pt-BR)
#14 80.69     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.69     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.69     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.69     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.69     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 80.69   code: 'MISSING_MESSAGE',
#14 80.69   originalMessage: 'marketing.integrations.items.tiss.detail.faq.4.q (pt-BR)'
#14 80.69 }
#14 80.69 Error: MISSING_MESSAGE: marketing.integrations.items.tiss.detail.faq.4.a (pt-BR)
#14 80.69     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.69     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.69     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.69     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.69     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 80.69   code: 'MISSING_MESSAGE',
#14 80.69   originalMessage: 'marketing.integrations.items.tiss.detail.faq.4.a (pt-BR)'
#14 80.69 }
#14 80.70 Error: MISSING_MESSAGE: marketing.integrations.items.mercadoPago.detail.benefits.6.title (pt-BR)
#14 80.70     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.70     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.70     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.70     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.70     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 80.70   code: 'MISSING_MESSAGE',
#14 80.70   originalMessage: 'marketing.integrations.items.mercadoPago.detail.benefits.6.title (pt-BR)'
#14 80.70 }
#14 80.71 Error: MISSING_MESSAGE: marketing.integrations.items.mercadoPago.detail.benefits.6.text (pt-BR)
#14 80.71     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.71     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.71     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.71     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.71     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 80.71   code: 'MISSING_MESSAGE',
#14 80.71   originalMessage: 'marketing.integrations.items.mercadoPago.detail.benefits.6.text (pt-BR)'
#14 80.71 }
#14 80.71 Error: MISSING_MESSAGE: marketing.integrations.items.mercadoPago.detail.howItWorks.4.title (pt-BR)
#14 80.71     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.71     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.71     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.71     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.71     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 80.71   code: 'MISSING_MESSAGE',
#14 80.71   originalMessage: 'marketing.integrations.items.mercadoPago.detail.howItWorks.4.title (pt-BR)'
#14 80.71 }
#14 80.71 Error: MISSING_MESSAGE: marketing.integrations.items.mercadoPago.detail.howItWorks.4.text (pt-BR)
#14 80.71     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.71     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.71     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.71     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.71     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 80.71   code: 'MISSING_MESSAGE',
#14 80.71   originalMessage: 'marketing.integrations.items.mercadoPago.detail.howItWorks.4.text (pt-BR)'
#14 80.71 }
#14 80.71 Error: MISSING_MESSAGE: marketing.integrations.items.mercadoPago.detail.faq.4.q (pt-BR)
#14 80.71     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.71     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.71     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.71     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.71     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 80.71   code: 'MISSING_MESSAGE',
#14 80.71   originalMessage: 'marketing.integrations.items.mercadoPago.detail.faq.4.q (pt-BR)'
#14 80.71 }
#14 80.71 Error: MISSING_MESSAGE: marketing.integrations.items.mercadoPago.detail.faq.4.a (pt-BR)
#14 80.71     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.71     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.71     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.71     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.71     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 80.71   code: 'MISSING_MESSAGE',
#14 80.71   originalMessage: 'marketing.integrations.items.mercadoPago.detail.faq.4.a (pt-BR)'
#14 80.71 }
#14 80.72 Error: MISSING_MESSAGE: marketing.integrations.items.apiWebhooks.detail.benefits.6.title (pt-BR)
#14 80.72     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.72     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.72     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.72     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.72     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 80.72   code: 'MISSING_MESSAGE',
#14 80.72   originalMessage: 'marketing.integrations.items.apiWebhooks.detail.benefits.6.title (pt-BR)'
#14 80.72 }
#14 80.72 Error: MISSING_MESSAGE: marketing.integrations.items.apiWebhooks.detail.benefits.6.text (pt-BR)
#14 80.72     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.72     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.72     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.72     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.72     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 80.72   code: 'MISSING_MESSAGE',
#14 80.72   originalMessage: 'marketing.integrations.items.apiWebhooks.detail.benefits.6.text (pt-BR)'
#14 80.72 }
#14 80.72 Error: MISSING_MESSAGE: marketing.integrations.items.apiWebhooks.detail.howItWorks.5.title (pt-BR)
#14 80.72     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.72     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.72     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.72     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.72     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 80.72   code: 'MISSING_MESSAGE',
#14 80.72   originalMessage: 'marketing.integrations.items.apiWebhooks.detail.howItWorks.5.title (pt-BR)'
#14 80.72 }
#14 80.72 Error: MISSING_MESSAGE: marketing.integrations.items.apiWebhooks.detail.howItWorks.5.text (pt-BR)
#14 80.72     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.72     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.72     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.72     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.72     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 80.72   code: 'MISSING_MESSAGE',
#14 80.72   originalMessage: 'marketing.integrations.items.apiWebhooks.detail.howItWorks.5.text (pt-BR)'
#14 80.72 }
#14 80.72 Error: MISSING_MESSAGE: marketing.integrations.items.apiWebhooks.detail.faq.5.q (pt-BR)
#14 80.72     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.72     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.72     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.72     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.72     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 80.72   code: 'MISSING_MESSAGE',
#14 80.72   originalMessage: 'marketing.integrations.items.apiWebhooks.detail.faq.5.q (pt-BR)'
#14 80.72 }
#14 80.72 Error: MISSING_MESSAGE: marketing.integrations.items.apiWebhooks.detail.faq.5.a (pt-BR)
#14 80.72     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.72     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.72     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.72     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.72     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 80.72   code: 'MISSING_MESSAGE',
#14 80.72   originalMessage: 'marketing.integrations.items.apiWebhooks.detail.faq.5.a (pt-BR)'
#14 80.72 }
#14 80.74 Error: MISSING_MESSAGE: marketing.integrations.items.whatsappEvolution.detail.benefits.5.title (pt-BR)
#14 80.74     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.74     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.74     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.74     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.74     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 80.74   code: 'MISSING_MESSAGE',
#14 80.74   originalMessage: 'marketing.integrations.items.whatsappEvolution.detail.benefits.5.title (pt-BR)'
#14 80.74 }
#14 80.74 Error: MISSING_MESSAGE: marketing.integrations.items.whatsappEvolution.detail.benefits.5.text (pt-BR)
#14 80.74     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.74     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.74     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.74     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.74     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 80.74   code: 'MISSING_MESSAGE',
#14 80.74   originalMessage: 'marketing.integrations.items.whatsappEvolution.detail.benefits.5.text (pt-BR)'
#14 80.74 }
#14 80.74 Error: MISSING_MESSAGE: marketing.integrations.items.whatsappEvolution.detail.howItWorks.5.title (pt-BR)
#14 80.74     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.74     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.74     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.74     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.74     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 80.74   code: 'MISSING_MESSAGE',
#14 80.74   originalMessage: 'marketing.integrations.items.whatsappEvolution.detail.howItWorks.5.title (pt-BR)'
#14 80.74 }
#14 80.74 Error: MISSING_MESSAGE: marketing.integrations.items.whatsappEvolution.detail.howItWorks.5.text (pt-BR)
#14 80.74     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.74     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.74     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.74     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.74     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 80.74   code: 'MISSING_MESSAGE',
#14 80.74   originalMessage: 'marketing.integrations.items.whatsappEvolution.detail.howItWorks.5.text (pt-BR)'
#14 80.74 }
#14 80.74 Error: MISSING_MESSAGE: marketing.integrations.items.whatsappEvolution.detail.faq.4.q (pt-BR)
#14 80.74     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.74     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.74     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.74     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.74     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 80.74   code: 'MISSING_MESSAGE',
#14 80.74   originalMessage: 'marketing.integrations.items.whatsappEvolution.detail.faq.4.q (pt-BR)'
#14 80.74 }
#14 80.74 Error: MISSING_MESSAGE: marketing.integrations.items.whatsappEvolution.detail.faq.4.a (pt-BR)
#14 80.74     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.74     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.74     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.74     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.74     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 80.74   code: 'MISSING_MESSAGE',
#14 80.74   originalMessage: 'marketing.integrations.items.whatsappEvolution.detail.faq.4.a (pt-BR)'
#14 80.74 }
#14 80.76 Error: MISSING_MESSAGE: marketing.integrations.items.n8n.detail.benefits.5.title (pt-BR)
#14 80.76     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.76     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.76     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.76     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.76     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 80.76   code: 'MISSING_MESSAGE',
#14 80.76   originalMessage: 'marketing.integrations.items.n8n.detail.benefits.5.title (pt-BR)'
#14 80.76 }
#14 80.76 Error: MISSING_MESSAGE: marketing.integrations.items.n8n.detail.benefits.5.text (pt-BR)
#14 80.76     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.76     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.76     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.76     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.76     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 80.76   code: 'MISSING_MESSAGE',
#14 80.76   originalMessage: 'marketing.integrations.items.n8n.detail.benefits.5.text (pt-BR)'
#14 80.76 }
#14 80.76 Error: MISSING_MESSAGE: marketing.integrations.items.n8n.detail.howItWorks.5.title (pt-BR)
#14 80.76     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.76     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.76     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.76     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.76     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 80.76   code: 'MISSING_MESSAGE',
#14 80.76   originalMessage: 'marketing.integrations.items.n8n.detail.howItWorks.5.title (pt-BR)'
#14 80.76 }
#14 80.76 Error: MISSING_MESSAGE: marketing.integrations.items.n8n.detail.howItWorks.5.text (pt-BR)
#14 80.76     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.76     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.76     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.76     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.76     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 80.76   code: 'MISSING_MESSAGE',
#14 80.76   originalMessage: 'marketing.integrations.items.n8n.detail.howItWorks.5.text (pt-BR)'
#14 80.76 }
#14 80.76 Error: MISSING_MESSAGE: marketing.integrations.items.n8n.detail.faq.4.q (pt-BR)
#14 80.76     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.76     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.76     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.76     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.76     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 80.76   code: 'MISSING_MESSAGE',
#14 80.76   originalMessage: 'marketing.integrations.items.n8n.detail.faq.4.q (pt-BR)'
#14 80.76 }
#14 80.76 Error: MISSING_MESSAGE: marketing.integrations.items.n8n.detail.faq.4.a (pt-BR)
#14 80.76     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.76     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.76     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.76     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.76     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 80.76   code: 'MISSING_MESSAGE',
#14 80.76   originalMessage: 'marketing.integrations.items.n8n.detail.faq.4.a (pt-BR)'
#14 80.76 }
#14 80.80 Error: MISSING_MESSAGE: marketing.integrations.items.whatsappZapi.detail.benefits.5.title (pt-BR)
#14 80.80     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.80     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.80     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.80     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.80     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 80.80   code: 'MISSING_MESSAGE',
#14 80.80   originalMessage: 'marketing.integrations.items.whatsappZapi.detail.benefits.5.title (pt-BR)'
#14 80.80 }
#14 80.80 Error: MISSING_MESSAGE: marketing.integrations.items.whatsappZapi.detail.benefits.5.text (pt-BR)
#14 80.80     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.80     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.80     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.80     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.80     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 80.80   code: 'MISSING_MESSAGE',
#14 80.80   originalMessage: 'marketing.integrations.items.whatsappZapi.detail.benefits.5.text (pt-BR)'
#14 80.80 }
#14 80.80 Error: MISSING_MESSAGE: marketing.integrations.items.whatsappZapi.detail.howItWorks.5.title (pt-BR)
#14 80.80     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.80     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.80     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.80     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.80     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 80.80   code: 'MISSING_MESSAGE',
#14 80.80   originalMessage: 'marketing.integrations.items.whatsappZapi.detail.howItWorks.5.title (pt-BR)'
#14 80.80 }
#14 80.80 Error: MISSING_MESSAGE: marketing.integrations.items.whatsappZapi.detail.howItWorks.5.text (pt-BR)
#14 80.80     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.80     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.80     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.80     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.80     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 80.80   code: 'MISSING_MESSAGE',
#14 80.80   originalMessage: 'marketing.integrations.items.whatsappZapi.detail.howItWorks.5.text (pt-BR)'
#14 80.80 }
#14 80.80 Error: MISSING_MESSAGE: marketing.integrations.items.whatsappZapi.detail.faq.4.q (pt-BR)
#14 80.80     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.80     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.80     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.80     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.80     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 80.80   code: 'MISSING_MESSAGE',
#14 80.80   originalMessage: 'marketing.integrations.items.whatsappZapi.detail.faq.4.q (pt-BR)'
#14 80.80 }
#14 80.80 Error: MISSING_MESSAGE: marketing.integrations.items.whatsappZapi.detail.faq.4.a (pt-BR)
#14 80.80     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.80     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.80     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.80     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.80     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 80.80   code: 'MISSING_MESSAGE',
#14 80.80   originalMessage: 'marketing.integrations.items.whatsappZapi.detail.faq.4.a (pt-BR)'
#14 80.80 }
#14 80.82 Error: MISSING_MESSAGE: marketing.integrations.items.googleCalendar.detail.benefits.5.title (pt-BR)
#14 80.82     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.82     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.82     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.82     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.82     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 80.82   code: 'MISSING_MESSAGE',
#14 80.82   originalMessage: 'marketing.integrations.items.googleCalendar.detail.benefits.5.title (pt-BR)'
#14 80.82 }
#14 80.82 Error: MISSING_MESSAGE: marketing.integrations.items.googleCalendar.detail.benefits.5.text (pt-BR)
#14 80.82     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.82     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.82     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.82     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.82     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 80.82   code: 'MISSING_MESSAGE',
#14 80.82   originalMessage: 'marketing.integrations.items.googleCalendar.detail.benefits.5.text (pt-BR)'
#14 80.82 }
#14 80.82 Error: MISSING_MESSAGE: marketing.integrations.items.googleCalendar.detail.howItWorks.4.title (pt-BR)
#14 80.82     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.82     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.82     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.82     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.82     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 80.82   code: 'MISSING_MESSAGE',
#14 80.82   originalMessage: 'marketing.integrations.items.googleCalendar.detail.howItWorks.4.title (pt-BR)'
#14 80.82 }
#14 80.82 Error: MISSING_MESSAGE: marketing.integrations.items.googleCalendar.detail.howItWorks.4.text (pt-BR)
#14 80.82     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.82     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.82     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.82     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.82     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 80.82   code: 'MISSING_MESSAGE',
#14 80.82   originalMessage: 'marketing.integrations.items.googleCalendar.detail.howItWorks.4.text (pt-BR)'
#14 80.82 }
#14 80.82 Error: MISSING_MESSAGE: marketing.integrations.items.googleCalendar.detail.faq.4.q (pt-BR)
#14 80.82     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.82     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.82     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.82     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.82     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 80.82   code: 'MISSING_MESSAGE',
#14 80.82   originalMessage: 'marketing.integrations.items.googleCalendar.detail.faq.4.q (pt-BR)'
#14 80.82 }
#14 80.82 Error: MISSING_MESSAGE: marketing.integrations.items.googleCalendar.detail.faq.4.a (pt-BR)
#14 80.82     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.82     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.82     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.82     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.82     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 80.82   code: 'MISSING_MESSAGE',
#14 80.82   originalMessage: 'marketing.integrations.items.googleCalendar.detail.faq.4.a (pt-BR)'
#14 80.82 }
#14 80.99 Error: MISSING_MESSAGE: marketing.integrations.items.instagramDirect.detail.benefits.5.title (pt-BR)
#14 80.99     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.99     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.99     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.99     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.99     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 80.99   code: 'MISSING_MESSAGE',
#14 80.99   originalMessage: 'marketing.integrations.items.instagramDirect.detail.benefits.5.title (pt-BR)'
#14 80.99 }
#14 80.99 Error: MISSING_MESSAGE: marketing.integrations.items.instagramDirect.detail.benefits.5.text (pt-BR)
#14 80.99     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.99     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.99     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.99     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.99     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 80.99   code: 'MISSING_MESSAGE',
#14 80.99   originalMessage: 'marketing.integrations.items.instagramDirect.detail.benefits.5.text (pt-BR)'
#14 80.99 }
#14 80.99 Error: MISSING_MESSAGE: marketing.integrations.items.instagramDirect.detail.howItWorks.5.title (pt-BR)
#14 80.99     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.99     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.99     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.99     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.99     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 80.99   code: 'MISSING_MESSAGE',
#14 80.99   originalMessage: 'marketing.integrations.items.instagramDirect.detail.howItWorks.5.title (pt-BR)'
#14 80.99 }
#14 80.99 Error: MISSING_MESSAGE: marketing.integrations.items.instagramDirect.detail.howItWorks.5.text (pt-BR)
#14 80.99     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.99     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.99     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.99     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.99     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 80.99   code: 'MISSING_MESSAGE',
#14 80.99   originalMessage: 'marketing.integrations.items.instagramDirect.detail.howItWorks.5.text (pt-BR)'
#14 80.99 }
#14 80.99 Error: MISSING_MESSAGE: marketing.integrations.items.instagramDirect.detail.faq.4.q (pt-BR)
#14 80.99     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.99     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.99     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.99     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.99     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 80.99   code: 'MISSING_MESSAGE',
#14 80.99   originalMessage: 'marketing.integrations.items.instagramDirect.detail.faq.4.q (pt-BR)'
#14 80.99 }
#14 80.99 Error: MISSING_MESSAGE: marketing.integrations.items.instagramDirect.detail.faq.4.a (pt-BR)
#14 80.99     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 80.99     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 80.99     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 80.99     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 80.99     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 80.99   code: 'MISSING_MESSAGE',
#14 80.99   originalMessage: 'marketing.integrations.items.instagramDirect.detail.faq.4.a (pt-BR)'
#14 80.99 }
#14 81.01 Error: MISSING_MESSAGE: marketing.integrations.items.pagseguro.detail.benefits.5.title (pt-BR)
#14 81.01     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.01     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.01     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.01     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.01     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 81.01   code: 'MISSING_MESSAGE',
#14 81.01   originalMessage: 'marketing.integrations.items.pagseguro.detail.benefits.5.title (pt-BR)'
#14 81.01 }
#14 81.01 Error: MISSING_MESSAGE: marketing.integrations.items.pagseguro.detail.benefits.5.text (pt-BR)
#14 81.01     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.01     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.01     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.01     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.01     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 81.01   code: 'MISSING_MESSAGE',
#14 81.01   originalMessage: 'marketing.integrations.items.pagseguro.detail.benefits.5.text (pt-BR)'
#14 81.01 }
#14 81.01 Error: MISSING_MESSAGE: marketing.integrations.items.pagseguro.detail.howItWorks.5.title (pt-BR)
#14 81.01     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.01     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.01     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.01     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.01     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 81.01   code: 'MISSING_MESSAGE',
#14 81.01   originalMessage: 'marketing.integrations.items.pagseguro.detail.howItWorks.5.title (pt-BR)'
#14 81.01 }
#14 81.01 Error: MISSING_MESSAGE: marketing.integrations.items.pagseguro.detail.howItWorks.5.text (pt-BR)
#14 81.01     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.01     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.01     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.01     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.01     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 81.01   code: 'MISSING_MESSAGE',
#14 81.01   originalMessage: 'marketing.integrations.items.pagseguro.detail.howItWorks.5.text (pt-BR)'
#14 81.01 }
#14 81.01 Error: MISSING_MESSAGE: marketing.integrations.items.pagseguro.detail.faq.4.q (pt-BR)
#14 81.01     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.01     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.01     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.01     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.01     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 81.01   code: 'MISSING_MESSAGE',
#14 81.01   originalMessage: 'marketing.integrations.items.pagseguro.detail.faq.4.q (pt-BR)'
#14 81.01 }
#14 81.01 Error: MISSING_MESSAGE: marketing.integrations.items.pagseguro.detail.faq.4.a (pt-BR)
#14 81.01     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.01     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.01     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.01     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.01     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 81.01   code: 'MISSING_MESSAGE',
#14 81.01   originalMessage: 'marketing.integrations.items.pagseguro.detail.faq.4.a (pt-BR)'
#14 81.01 }
#14 81.03 Error: MISSING_MESSAGE: marketing.integrations.items.stripe.detail.benefits.5.title (pt-BR)
#14 81.03     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.03     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.03     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.03     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.03     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 81.03   code: 'MISSING_MESSAGE',
#14 81.03   originalMessage: 'marketing.integrations.items.stripe.detail.benefits.5.title (pt-BR)'
#14 81.03 }
#14 81.03 Error: MISSING_MESSAGE: marketing.integrations.items.stripe.detail.benefits.5.text (pt-BR)
#14 81.03     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.03     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.03     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.03     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.03     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 81.03   code: 'MISSING_MESSAGE',
#14 81.03   originalMessage: 'marketing.integrations.items.stripe.detail.benefits.5.text (pt-BR)'
#14 81.03 }
#14 81.03 Error: MISSING_MESSAGE: marketing.integrations.items.stripe.detail.howItWorks.5.title (pt-BR)
#14 81.03     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.03     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.03     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.03     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.03     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 81.03   code: 'MISSING_MESSAGE',
#14 81.03   originalMessage: 'marketing.integrations.items.stripe.detail.howItWorks.5.title (pt-BR)'
#14 81.03 }
#14 81.03 Error: MISSING_MESSAGE: marketing.integrations.items.stripe.detail.howItWorks.5.text (pt-BR)
#14 81.03     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.03     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.03     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.03     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.03     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 81.03   code: 'MISSING_MESSAGE',
#14 81.03   originalMessage: 'marketing.integrations.items.stripe.detail.howItWorks.5.text (pt-BR)'
#14 81.03 }
#14 81.03 Error: MISSING_MESSAGE: marketing.integrations.items.stripe.detail.faq.4.q (pt-BR)
#14 81.03     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.03     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.03     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.03     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.03     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 81.03   code: 'MISSING_MESSAGE',
#14 81.03   originalMessage: 'marketing.integrations.items.stripe.detail.faq.4.q (pt-BR)'
#14 81.03 }
#14 81.03 Error: MISSING_MESSAGE: marketing.integrations.items.stripe.detail.faq.4.a (pt-BR)
#14 81.03     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.03     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.03     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.03     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.03     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 81.03   code: 'MISSING_MESSAGE',
#14 81.03   originalMessage: 'marketing.integrations.items.stripe.detail.faq.4.a (pt-BR)'
#14 81.03 }
#14 81.04 Error: MISSING_MESSAGE: marketing.integrations.items.asaas.detail.benefits.6.title (pt-BR)
#14 81.04     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.04     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.04     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.04     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.04     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 81.04   code: 'MISSING_MESSAGE',
#14 81.04   originalMessage: 'marketing.integrations.items.asaas.detail.benefits.6.title (pt-BR)'
#14 81.04 }
#14 81.04 Error: MISSING_MESSAGE: marketing.integrations.items.asaas.detail.benefits.6.text (pt-BR)
#14 81.04     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.04     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.04     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.04     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.04     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 81.04   code: 'MISSING_MESSAGE',
#14 81.04   originalMessage: 'marketing.integrations.items.asaas.detail.benefits.6.text (pt-BR)'
#14 81.04 }
#14 81.04 Error: MISSING_MESSAGE: marketing.integrations.items.asaas.detail.howItWorks.5.title (pt-BR)
#14 81.04     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.04     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.04     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.04     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.04     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 81.04   code: 'MISSING_MESSAGE',
#14 81.04   originalMessage: 'marketing.integrations.items.asaas.detail.howItWorks.5.title (pt-BR)'
#14 81.04 }
#14 81.04 Error: MISSING_MESSAGE: marketing.integrations.items.asaas.detail.howItWorks.5.text (pt-BR)
#14 81.04     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.04     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.04     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.04     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.04     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 81.04   code: 'MISSING_MESSAGE',
#14 81.04   originalMessage: 'marketing.integrations.items.asaas.detail.howItWorks.5.text (pt-BR)'
#14 81.04 }
#14 81.04 Error: MISSING_MESSAGE: marketing.integrations.items.asaas.detail.faq.4.q (pt-BR)
#14 81.04     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.04     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.04     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.04     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.04     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 81.04   code: 'MISSING_MESSAGE',
#14 81.04   originalMessage: 'marketing.integrations.items.asaas.detail.faq.4.q (pt-BR)'
#14 81.04 }
#14 81.04 Error: MISSING_MESSAGE: marketing.integrations.items.asaas.detail.faq.4.a (pt-BR)
#14 81.04     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.04     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.04     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.04     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.04     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 81.04   code: 'MISSING_MESSAGE',
#14 81.04   originalMessage: 'marketing.integrations.items.asaas.detail.faq.4.a (pt-BR)'
#14 81.04 }
#14 81.06 Error: MISSING_MESSAGE: marketing.integrations.items.googleAds.detail.benefits.5.title (pt-BR)
#14 81.06     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.06     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.06     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.06     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.06     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 81.06   code: 'MISSING_MESSAGE',
#14 81.06   originalMessage: 'marketing.integrations.items.googleAds.detail.benefits.5.title (pt-BR)'
#14 81.06 }
#14 81.06 Error: MISSING_MESSAGE: marketing.integrations.items.googleAds.detail.benefits.5.text (pt-BR)
#14 81.06     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.06     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.06     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.06     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.06     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 81.06   code: 'MISSING_MESSAGE',
#14 81.06   originalMessage: 'marketing.integrations.items.googleAds.detail.benefits.5.text (pt-BR)'
#14 81.06 }
#14 81.06 Error: MISSING_MESSAGE: marketing.integrations.items.googleAds.detail.howItWorks.5.title (pt-BR)
#14 81.06     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.06     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.06     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.06     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.06     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 81.06   code: 'MISSING_MESSAGE',
#14 81.06   originalMessage: 'marketing.integrations.items.googleAds.detail.howItWorks.5.title (pt-BR)'
#14 81.06 }
#14 81.06 Error: MISSING_MESSAGE: marketing.integrations.items.googleAds.detail.howItWorks.5.text (pt-BR)
#14 81.06     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.06     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.06     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.06     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.06     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 81.06   code: 'MISSING_MESSAGE',
#14 81.06   originalMessage: 'marketing.integrations.items.googleAds.detail.howItWorks.5.text (pt-BR)'
#14 81.06 }
#14 81.06 Error: MISSING_MESSAGE: marketing.integrations.items.googleAds.detail.faq.4.q (pt-BR)
#14 81.06     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.06     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.06     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.06     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.06     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 81.06   code: 'MISSING_MESSAGE',
#14 81.06   originalMessage: 'marketing.integrations.items.googleAds.detail.faq.4.q (pt-BR)'
#14 81.06 }
#14 81.06 Error: MISSING_MESSAGE: marketing.integrations.items.googleAds.detail.faq.4.a (pt-BR)
#14 81.06     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.06     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.06     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.06     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.06     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 81.06   code: 'MISSING_MESSAGE',
#14 81.06   originalMessage: 'marketing.integrations.items.googleAds.detail.faq.4.a (pt-BR)'
#14 81.06 }
#14 81.07 Error: MISSING_MESSAGE: marketing.integrations.items.metaAds.detail.benefits.5.title (pt-BR)
#14 81.07     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.07     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.07     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.07     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.07     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 81.07   code: 'MISSING_MESSAGE',
#14 81.07   originalMessage: 'marketing.integrations.items.metaAds.detail.benefits.5.title (pt-BR)'
#14 81.07 }
#14 81.08 Error: MISSING_MESSAGE: marketing.integrations.items.metaAds.detail.benefits.5.text (pt-BR)
#14 81.08     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.08     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.08     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.08     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.08     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 81.08   code: 'MISSING_MESSAGE',
#14 81.08   originalMessage: 'marketing.integrations.items.metaAds.detail.benefits.5.text (pt-BR)'
#14 81.08 }
#14 81.08 Error: MISSING_MESSAGE: marketing.integrations.items.metaAds.detail.howItWorks.5.title (pt-BR)
#14 81.08     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.08     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.08     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.08     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.08     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 81.08   code: 'MISSING_MESSAGE',
#14 81.08   originalMessage: 'marketing.integrations.items.metaAds.detail.howItWorks.5.title (pt-BR)'
#14 81.08 }
#14 81.08 Error: MISSING_MESSAGE: marketing.integrations.items.metaAds.detail.howItWorks.5.text (pt-BR)
#14 81.08     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.08     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.08     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.08     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.08     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 81.08   code: 'MISSING_MESSAGE',
#14 81.08   originalMessage: 'marketing.integrations.items.metaAds.detail.howItWorks.5.text (pt-BR)'
#14 81.08 }
#14 81.08 Error: MISSING_MESSAGE: marketing.integrations.items.metaAds.detail.faq.4.q (pt-BR)
#14 81.08     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.08     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.08     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.08     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.08     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 81.08   code: 'MISSING_MESSAGE',
#14 81.08   originalMessage: 'marketing.integrations.items.metaAds.detail.faq.4.q (pt-BR)'
#14 81.08 }
#14 81.08 Error: MISSING_MESSAGE: marketing.integrations.items.metaAds.detail.faq.4.a (pt-BR)
#14 81.08     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.08     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.08     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.08     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.08     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 81.08   code: 'MISSING_MESSAGE',
#14 81.08   originalMessage: 'marketing.integrations.items.metaAds.detail.faq.4.a (pt-BR)'
#14 81.08 }
#14 81.10 Error: MISSING_MESSAGE: marketing.integrations.items.make.detail.benefits.5.title (pt-BR)
#14 81.10     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.10     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.10     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.10     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.10     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 81.10   code: 'MISSING_MESSAGE',
#14 81.10   originalMessage: 'marketing.integrations.items.make.detail.benefits.5.title (pt-BR)'
#14 81.10 }
#14 81.10 Error: MISSING_MESSAGE: marketing.integrations.items.make.detail.benefits.5.text (pt-BR)
#14 81.10     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.10     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.10     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.10     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.10     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 81.10   code: 'MISSING_MESSAGE',
#14 81.10   originalMessage: 'marketing.integrations.items.make.detail.benefits.5.text (pt-BR)'
#14 81.10 }
#14 81.10 Error: MISSING_MESSAGE: marketing.integrations.items.make.detail.howItWorks.5.title (pt-BR)
#14 81.10     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.10     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.10     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.10     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.10     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 81.10   code: 'MISSING_MESSAGE',
#14 81.10   originalMessage: 'marketing.integrations.items.make.detail.howItWorks.5.title (pt-BR)'
#14 81.10 }
#14 81.10 Error: MISSING_MESSAGE: marketing.integrations.items.make.detail.howItWorks.5.text (pt-BR)
#14 81.10     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.10     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.10     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.10     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.10     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 81.10   code: 'MISSING_MESSAGE',
#14 81.10   originalMessage: 'marketing.integrations.items.make.detail.howItWorks.5.text (pt-BR)'
#14 81.10 }
#14 81.10 Error: MISSING_MESSAGE: marketing.integrations.items.make.detail.faq.4.q (pt-BR)
#14 81.10     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.10     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.10     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.10     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.10     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 81.10   code: 'MISSING_MESSAGE',
#14 81.10   originalMessage: 'marketing.integrations.items.make.detail.faq.4.q (pt-BR)'
#14 81.10 }
#14 81.10 Error: MISSING_MESSAGE: marketing.integrations.items.make.detail.faq.4.a (pt-BR)
#14 81.10     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.10     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.10     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.10     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.10     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 81.10   code: 'MISSING_MESSAGE',
#14 81.10   originalMessage: 'marketing.integrations.items.make.detail.faq.4.a (pt-BR)'
#14 81.10 }
#14 81.12 Error: MISSING_MESSAGE: marketing.integrations.items.zapier.detail.benefits.5.title (pt-BR)
#14 81.12     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.12     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.12     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.12     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.12     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3727) {
#14 81.12   code: 'MISSING_MESSAGE',
#14 81.12   originalMessage: 'marketing.integrations.items.zapier.detail.benefits.5.title (pt-BR)'
#14 81.12 }
#14 81.12 Error: MISSING_MESSAGE: marketing.integrations.items.zapier.detail.benefits.5.text (pt-BR)
#14 81.12     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.12     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.12     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.12     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.12     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3761) {
#14 81.12   code: 'MISSING_MESSAGE',
#14 81.12   originalMessage: 'marketing.integrations.items.zapier.detail.benefits.5.text (pt-BR)'
#14 81.12 }
#14 81.12 Error: MISSING_MESSAGE: marketing.integrations.items.zapier.detail.howItWorks.5.title (pt-BR)
#14 81.12     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.12     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.12     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.12     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.12     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3873) {
#14 81.12   code: 'MISSING_MESSAGE',
#14 81.12   originalMessage: 'marketing.integrations.items.zapier.detail.howItWorks.5.title (pt-BR)'
#14 81.12 }
#14 81.12 Error: MISSING_MESSAGE: marketing.integrations.items.zapier.detail.howItWorks.5.text (pt-BR)
#14 81.12     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.12     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.12     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.12     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.12     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:3909) {
#14 81.12   code: 'MISSING_MESSAGE',
#14 81.12   originalMessage: 'marketing.integrations.items.zapier.detail.howItWorks.5.text (pt-BR)'
#14 81.12 }
#14 81.12 Error: MISSING_MESSAGE: marketing.integrations.items.zapier.detail.faq.4.q (pt-BR)
#14 81.12     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.12     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.12     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.12     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.12     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4181) {
#14 81.12   code: 'MISSING_MESSAGE',
#14 81.12   originalMessage: 'marketing.integrations.items.zapier.detail.faq.4.q (pt-BR)'
#14 81.12 }
#14 81.12 Error: MISSING_MESSAGE: marketing.integrations.items.zapier.detail.faq.4.a (pt-BR)
#14 81.12     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.12     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.12     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.12     at y (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:947)
#14 81.12     at C (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_[slug]_page_tsx_0e3c08a2._.js:1:4206) {
#14 81.12   code: 'MISSING_MESSAGE',
#14 81.12   originalMessage: 'marketing.integrations.items.zapier.detail.faq.4.a (pt-BR)'
#14 81.12 }
#14 81.33 Error: MISSING_MESSAGE: marketing.integrations.faq.6.q (pt-BR)
#14 81.33     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.33     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.33     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.33     at u (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_page_tsx_c8f18606._.js:1:4341) {
#14 81.33   code: 'MISSING_MESSAGE',
#14 81.33   originalMessage: 'marketing.integrations.faq.6.q (pt-BR)'
#14 81.33 }
#14 81.33 Error: MISSING_MESSAGE: marketing.integrations.faq.6.a (pt-BR)
#14 81.33     at l (.next/server/chunks/ssr/_f7d2abf5._.js:3:4308)
#14 81.33     at m (.next/server/chunks/ssr/_f7d2abf5._.js:3:4496)
#14 81.33     at n (.next/server/chunks/ssr/_f7d2abf5._.js:3:4958)
#14 81.33     at u (.next/server/chunks/ssr/app_[locale]_(marketing)_integracoes_page_tsx_c8f18606._.js:1:4359) {
#14 81.33   code: 'MISSING_MESSAGE',
#14 81.33   originalMessage: 'marketing.integrations.faq.6.a (pt-BR)'
#14 81.33 }
#14 81.55 Error occurred prerendering page "/pt-BR/precos". Read more: https://nextjs.org/docs/messages/prerender-error
#14 81.55 Error [PrismaClientInitializationError]: 
#14 81.55 Invalid `prisma.pricingModule.findMany()` invocation:
#14 81.55 
#14 81.55 
#14 81.55 error: Environment variable not found: DATABASE_URL.
#14 81.55   -->  schema.prisma:10
#14 81.55    | 
#14 81.55  9 |   provider = "postgresql"
#14 81.55 10 |   url      = env("DATABASE_URL")
#14 81.55    | 
#14 81.55 
#14 81.55 Validation Error Count: 1
#14 81.55     at <unknown> (-->  schema.prisma:10)
#14 81.55     at async m (.next/server/chunks/ssr/[root-of-the-server]__c71e317f._.js:1:10347) {
#14 81.55   clientVersion: '5.19.0',
#14 81.55   errorCode: undefined,
#14 81.55   digest: '2580346796'
#14 81.55 }
#14 81.55 Export encountered an error on /[locale]/(marketing)/precos/page: /pt-BR/precos, exiting the build.
#14 81.65 ⨯ Next.js build worker exited with code: 1 and signal: null
#14 ERROR: process "/bin/sh -c NODE_OPTIONS=\"--max-old-space-size=4096\" node_modules/.bin/next build" did not complete successfully: exit code: 1
------
 > [builder 5/5] RUN NODE_OPTIONS="--max-old-space-size=4096" node_modules/.bin/next build:
81.55 
81.55 Validation Error Count: 1
81.55     at <unknown> (-->  schema.prisma:10)
81.55     at async m (.next/server/chunks/ssr/[root-of-the-server]__c71e317f._.js:1:10347) {
81.55   clientVersion: '5.19.0',
81.55   errorCode: undefined,
81.55   digest: '2580346796'
81.55 }
81.55 Export encountered an error on /[locale]/(marketing)/precos/page: /pt-BR/precos, exiting the build.
81.65 ⨯ Next.js build worker exited with code: 1 and signal: null
------
Dockerfile:29
--------------------
  27 |     ENV NEXT_TELEMETRY_DISABLED=1
  28 |     ENV NODE_ENV=production
  29 | >>> RUN NODE_OPTIONS="--max-old-space-size=4096" node_modules/.bin/next build
  30 |     
  31 |     # ===== Runner =====
--------------------
ERROR: failed to build: failed to solve: process "/bin/sh -c NODE_OPTIONS=\"--max-old-space-size=4096\" node_modules/.bin/next build" did not complete successfully: exit code: 1
##########################################
### Error
### Sat, 13 Jun 2026 18:13:31 GMT
##########################################