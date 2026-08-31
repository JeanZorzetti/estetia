import { describe, it, expect } from 'vitest'
import { blogPosts } from '@/lib/blog'

/**
 * Todo link interno do blog tem que apontar para a URL final — a mesma que o <link rel="canonical">
 * serve. O prefixo /pt-BR/ existe na árvore de rotas ([locale]) mas em produção dá 308, e em 31/08
 * havia 89 links assim nos 41 posts (61 deles o CTA /register). O GSC contava isso como 11,8% de
 * rastreio em redirect. Um link a mais com /pt-BR/ e este teste reprova.
 */
const RETIRADAS = new Map([['/features/prontuario-digital', '/features/prontuario-eletronico']])

const linksDe = (html: string) => [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1])

describe('links internos dos posts do blog', () => {
  it('nenhum aponta para o prefixo /pt-BR (308 em produção)', () => {
    const ruins = blogPosts.flatMap((p) =>
      linksDe(p.content)
        .filter((h) => h.startsWith('/pt-BR/'))
        .map((h) => `${p.slug}: ${h}`),
    )
    expect(ruins).toEqual([])
  })

  it('nenhum aponta para rota aposentada que redireciona', () => {
    const ruins = blogPosts.flatMap((p) =>
      linksDe(p.content)
        .filter((h) => RETIRADAS.has(h))
        .map((h) => `${p.slug}: ${h} → ${RETIRADAS.get(h)}`),
    )
    expect(ruins).toEqual([])
  })
})
