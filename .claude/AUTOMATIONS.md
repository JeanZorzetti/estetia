# Automações Claude Code — Estetia CRM

## 📋 Resumo das Automações Configuradas

### ✅ Hooks Ativos

#### 1. **Auto-format ao salvar** (`PostToolUse` → `Write|Edit`)
- **O quê:** Prettier auto-formata arquivos `.ts`, `.tsx`, `.js`, `.jsx` após edição
- **Quando:** Toda vez que Claude escreve/edita código
- **Benefício:** Código sempre em estilo padrão, sem conflitos de linting
- **Timeout:** 15s

#### 2. **Type-check após edição** (`PostToolUse` → `Edit`)
- **O quê:** `npx tsc --noEmit` verifica erros de tipo
- **Quando:** Após editar arquivos TypeScript
- **Benefício:** Pega erros de tipo imediatamente, antes do commit
- **Timeout:** 30s
- **Nota:** Ignora `node_modules` para evitar slowness

#### 3. **Pre-flight antes de build/e2e** (`PreToolUse` → `Bash`)
- **O quê:** Valida que não há erros TypeScript antes de `npm run build` ou `npm run test:e2e`
- **Quando:** Usuário tenta executar build ou testes E2E
- **Benefício:** Para builds quebrados antes de rodar (economiza tempo)
- **Timeout:** 30s

---

## 🎯 Casos de Uso Recomendados

### Para Novos Features
```bash
# 1. Claude escreve código
# → Auto-format + type-check automático

# 2. Você testa localmente
npm run dev

# 3. Criar commit
git commit -m "..."
# → Pre-flight type-check roda antes de aceitar
```

### Para Bug Fixes
```bash
# 1. Editar component/route
# → Type-check automático após salvar

# 2. Rodar tests
npm run test
# → Vitest roda apenas no seu terminal

# 3. Rodar E2E
npm run test:e2e
# → Pre-flight valida TypeScript antes
```

---

## 🚀 Hooks Opcionais (Não Configurados — Recomendados)

Se quiser ainda mais automação, você pode adicionar:

### A. **Auto-run unit tests após mudanças**
```json
{
  "matcher": "Edit",
  "hooks": [{
    "type": "command",
    "command": "npx vitest run --reporter=verbose 2>&1 | tail -30 || true",
    "statusMessage": "Running unit tests...",
    "timeout": 60,
    "if": "Edit"
  }]
}
```
**Tradeoff:** Mais lento (+60s por edição), mas super confiável.

### B. **Verificar Prisma schema antes de migrate**
```json
{
  "matcher": "Edit",
  "hooks": [{
    "type": "command",
    "command": "if grep -q 'schema.prisma' <<< '$file'; then npx prisma validate 2>&1 | grep -i error && { echo '{\"continue\": false, \"stopReason\": \"Schema inválido\"}'; exit 1; }; fi",
    "timeout": 15,
    "if": "Edit"
  }]
}
```
**Tradeoff:** Pega erros de schema cedo.

### C. **Auto-lint após salvar**
```json
{
  "matcher": "Write|Edit",
  "hooks": [{
    "type": "command",
    "command": "jq -r '.tool_response.filePath // .tool_input.file_path' | { read -r f; npx eslint --fix \"$f\" 2>/dev/null || true; }",
    "timeout": 15,
    "if": "Edit|Write"
  }]
}
```
**Benefício:** ESLint + Prettier coordenados.

---

## 📊 Performance Impact

| Hook | Impacto | Quando Dispara |
|------|---------|----------------|
| Prettier | ~2-5s | Toda Write/Edit |
| Type-check (tsc) | ~5-15s | Toda Edit |
| Pre-flight (build) | ~5-15s | Antes de build/e2e |
| **Total máximo** | **~35s** | Worst-case scenario |

**Nota:** Hooks rodam em paralelo quando possível. Se achar lento, comente o hook de type-check.

---

## 🔧 Como Ajustar

### Desabilitar um hook temporariamente
Edite `.claude/settings.local.json` e remova o hook, ou:
```bash
claude config disableAllHooks=true
# Depois: desabilitar novamente
claude config disableAllHooks=false
```

### Reduzir timeout
Se hooks matam por timeout, aumente `timeout` (em segundos):
```json
{ "timeout": 60 }
```

### Focar em arquivos específicos
Use `if` para restringir:
```json
{ "if": "Edit(**/app/**)" }
```

---

## 🎨 Próximas Expansões Recomendadas

1. **GitHub Actions** — Rodar full test suite no PR
2. **Vercel Deploy** — Preview antes de merge
3. **Prisma Migration** — Auto-backup antes de migrate
4. **SEO/Analytics** — Validar Open Graph tags

---

## 📝 Referências

- Hooks docs: `.claude/settings.local.json`
- Projeto: Doc-CRM (Estetia CRM)
- Stack: Next.js 16 + Prisma 5 + Playwright
