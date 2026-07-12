# Ações Manuais no Google Search Console

Gerado em: 2026-06-05. Execute após cada deploy de correções SEO.

---

## 1. Ressubmeter o Sitemap

1. Acesse [Search Console → Sitemaps](https://search.google.com/search-console/sitemaps)
2. Se o sitemap `https://estetiacrm.com.br/sitemap.xml` já estiver listado, clique nos `...` ao lado e remova.
3. Adicione novamente: `https://estetiacrm.com.br/sitemap.xml` → **Enviar**.
4. Aguarde processamento (geralmente minutos a horas).

---

## 2. Solicitar Reindexação das Páginas Prioritárias

Para cada URL abaixo, vá em **Inspecionar URL** no GSC, cole a URL e clique em **Solicitar indexação**:

### Páginas de blog com ranking bom mas CTR 0% (prioridade máxima)
- `https://estetiacrm.com.br/blog/lgpd-para-clinicas-de-estetica-guia-2026` — pos. 7,2; 52 impr.
- `https://estetiacrm.com.br/blog/kpis-essenciais-clinica-de-estetica` — pos. 5,3; 31 impr.
- `https://estetiacrm.com.br/blog/spin-selling-para-clinicas-de-estetica` — pos. 7,4; 13 impr.

### Páginas de dermatologia (reforço de conteúdo feito)
- `https://estetiacrm.com.br/solucoes/dermatologia` — pos. 44; 62 impr.
- `https://estetiacrm.com.br/blog/software-gestao-dermatologia-guia` — pos. 23

### Páginas de conversão / fundo de funil
- `https://estetiacrm.com.br/precos`
- `https://estetiacrm.com.br/` (homepage)

---

## 3. Validar Correção dos Redirects

Em **Páginas** → **Redirecionamentos**, confirmar que as URLs abaixo aparecem como resolvidas (não mais como erro):

| URL com problema anterior | Destino esperado |
|---|---|
| `https://estetiacrm.com.br/en` | `https://estetiacrm.com.br/` |
| `https://estetiacrm.com.br/en/blog/...` | `https://estetiacrm.com.br/blog/...` |
| `https://estetiacrm.com.br/pricing` | `https://estetiacrm.com.br/precos` |
| `https://estetiacrm.com.br/fundadores` | `https://estetiacrm.com.br/about` |
| `https://estetiacrm.com.br/comunidade` | `https://estetiacrm.com.br/community` |
| `https://estetiacrm.com.br/ajuda` | `https://estetiacrm.com.br/help` |
| `https://estetiacrm.com.br/cadastrar` | `https://estetiacrm.com.br/register` |

---

## 4. Verificar Propriedade de Domínio

Confirmar que a propriedade configurada é do tipo **Domínio** (não URL prefix), cobrindo:
- `http://` e `https://`
- `www.` e non-www
- Todos os subdomínios

Se for URL prefix, considerar migrar para propriedade de Domínio.

---

## 5. Monitoramento — Próxima Revisão

- **Data sugerida:** 2026-07-05 (30 dias após este deploy)
- **O que checar:**
  - Impressões BR subiram? (hoje ~133 de 233 total)
  - CTR das 3 páginas prioritárias de blog saiu de 0%?
  - `/solucoes/dermatologia` subiu de pos. 44?
  - 404s residuais resolvidos em "Páginas com problemas"?
  - Impressões dos EUA caíram? (eram 86/233 = 37% — resíduo de URLs /en/ antigas)
