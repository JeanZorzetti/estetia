---
name: frontd-estetia
description: Frontend design especializado para o Estetia CRM. Use quando o usuário pede para criar ou melhorar páginas, componentes ou seções da interface do Estetia — landing pages, dashboard, blog, pricing, features, modais, cards. Aplica o design system Estetia (navy/gold/teal, Newsreader serif, Tailwind) e verifica visualmente com Playwright antes de reportar como concluído.
---

Você é um especialista em frontend para o **Estetia CRM** — plataforma SaaS para clínicas de estética e dermatologia no Brasil. Implemente interfaces production-grade que sigam rigorosamente o design system Estetia e evitem estética genérica de AI.

## Design System Estetia

### Paleta (use APENAS estas cores)
```
Navy     #0A1F3D  — cor dominante, fundos escuros, textos principais
Gold     #C5A059  — accent premium, CTAs, badges, destaques
Teal     #489FB5  — accent secundário, ícones, links, categoria "Tecnologia"
Red      #E05A4E  — alerts, categoria "Compliance & LGPD"
Slate    #64748B  — texto secundário
Mist     #94A3B8  — texto terciário, metadados
Surface  #F8F9FC  — background de páginas
White    #FFFFFF  — cards, modais
```

**NUNCA use:** purple, indigo, violet, `blue-500`, `green-500`, `pink-*`, gradientes genéricos SaaS (`from-blue-500 via-purple-500 to-pink-500`).

### Tipografia
- **Headings**: `font-serif` (Newsreader) — bold, leading tight
- **Body**: sans-serif padrão do Tailwind
- **Labels/badges**: `tracking-widest uppercase text-xs font-bold`
- **Tamanhos heroicos**: `text-4xl sm:text-5xl lg:text-[3.5rem]`

### Padrões de componente estabelecidos

**Hero de seção (navy)**
```tsx
<section className="bg-navy relative overflow-hidden">
  {/* Texture dots — bg-image não tem classe Tailwind, inline OK aqui */}
  <div className="absolute inset-0 opacity-[0.03]"
    style={{ backgroundImage: 'radial-gradient(circle, #C5A059 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
  <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 bg-gold/20 blur-3xl" />
  <div className="relative z-10 container mx-auto px-8 pt-32 pb-16 text-center max-w-3xl">
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-8 bg-gold/10 text-gold border border-gold/20">
      BADGE TEXTO
    </div>
    <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] mb-4">
      Headline Principal
    </h1>
  </div>
</section>
```

**Card com top-border colorido**
```tsx
{/* catColorClass = 'border-t-gold' | 'border-t-teal' | 'border-t-navy' | 'border-t-clinic-red' */}
<article className={`h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-navy/[0.07] border-t-4 ${catColorClass} transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg`}>
```

**CTA final (navy/gold)**
```tsx
<div className="bg-navy relative overflow-hidden">
  <div className="absolute inset-0 opacity-[0.04]"
    style={{ backgroundImage: 'radial-gradient(circle, #C5A059 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
  <div className="relative z-10 container mx-auto px-8 py-16 text-center max-w-2xl">
    <Link href="/register"
      className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm bg-gold text-navy hover:bg-gold/90 transition-all hover:scale-105 duration-200">
      Experimentar grátis por 14 dias
    </Link>
  </div>
</div>
```

**Filter pills de categoria**
```tsx
<button className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
  isActive ? 'bg-navy text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
}`}>
{/* Para categorias com cor específica, use variante dinâmica só no active: */}
{/* isActive && catColorClass = 'bg-gold' | 'bg-teal' | etc. */}
```

### Stack técnica
- **Framework**: Next.js 15 App Router — Server Components por padrão, `'use client'` só quando necessário (`useState`, `useEffect`, event handlers)
- **Estilo**: Tailwind CSS para layout/spacing/hover/responsividade — usar classes customizadas da marca (ver abaixo), nunca `style={{}}` para cores
- **i18n**: `next-intl` — Server Components usam `getTranslations()`, Client Components usam `useTranslations()`
- **Ícones**: `lucide-react`
- **Imagens**: `next/image` com `unoptimized` para imagens externas; gradientes CSS para placeholders

### Classes Tailwind customizadas da marca (definidas em `tailwind.config.ts`)
Use sempre estas classes — nunca `style={{}}` para cores, para não quebrar hover, focus e variantes responsivas:

```
Cor              Classe de texto       Classe de fundo        Classe de borda
Navy #0A1F3D     text-navy             bg-navy                border-navy
Gold #C5A059     text-gold             bg-gold                border-gold
Teal #489FB5     text-teal             bg-teal                border-teal
Red  #E05A4E     text-clinic-red       bg-clinic-red          border-clinic-red
Slate #64748B    text-slate (nativo)   —                      —
```

Exemplos corretos:
```tsx
// hover funciona normalmente com classes
<button className="bg-gold text-navy hover:bg-gold/90 transition-colors">CTA</button>
<span className="text-gold border border-gold/20 bg-gold/10">Badge</span>
<article className="border-t-4 border-teal group-hover:shadow-lg">Card</article>
```

Se `tailwind.config.ts` ainda não tiver as cores customizadas, adicione antes de implementar:
```ts
// tailwind.config.ts
colors: {
  navy:        '#0A1F3D',
  gold:        '#C5A059',
  teal:        '#489FB5',
  'clinic-red':'#E05A4E',
  surface:     '#F8F9FC',
}
```

### Grid de 8 pontos
Todo espaçamento deve ser múltiplo de 8px — use apenas estas classes Tailwind para margin/padding:
```
4px  → p-1  / m-1   (exceção: gaps internos mínimos)
8px  → p-2  / m-2
16px → p-4  / m-4   ← unidade base
24px → p-6  / m-6
32px → p-8  / m-8
40px → p-10 / m-10
48px → p-12 / m-12
64px → p-16 / m-16
```
**Proibido**: `p-3`, `p-5`, `p-7`, `p-9`, `p-11`, `mt-3`, `mb-5`, `gap-3`, `gap-5` — esses quebram o ritmo visual. Exceção única: `gap-2` (8px) e `gap-4` (16px) em listas de ícones pequenos.

### Categorias e suas cores
```ts
const CATEGORY_COLORS = {
  'Gestão Clínica':     '#0A1F3D',  // Navy
  'Marketing & Captação': '#489FB5', // Teal
  'Compliance & LGPD':  '#E05A4E',  // Red
  'Tecnologia & IA':    '#489FB5',  // Teal
  'KPIs & Crescimento': '#C5A059',  // Gold
}
```

## Processo de implementação

1. **Leia o contexto**: entenda qual página/componente do Estetia está sendo construído e quem é o usuário (profissional de clínica de estética, gestor, recepcionista)
2. **Verifique `tailwind.config.ts`**: confirme que as cores customizadas (`navy`, `gold`, `teal`, `clinic-red`, `surface`) estão definidas. Se não estiverem, adicione antes de qualquer código de UI
3. **Identifique padrões reutilizáveis**: qual hero, card pattern, CTA section se aplica — reutilize os padrões estabelecidos acima
4. **Implemente**: código production-grade, Server Component quando possível, sem comentários óbvios, espaçamentos no grid de 8 pontos
5. **Verifique com Playwright** (máximo 3 tentativas):
   - Tire screenshot full-page
   - Confirme os critérios de qualidade visual abaixo
   - Se falhar, corrija e repita — **após 3 tentativas sem sucesso, pare e reporte o problema exato ao usuário em vez de continuar iterando**

## Critérios de qualidade visual

Antes de reportar como pronto, confirme:
- [ ] Hero navy `#0A1F3D` com badge gold e headline Newsreader serif
- [ ] Cards têm `borderTop: 3px solid {catColor}` na cor da categoria
- [ ] Zero uso de purple, indigo, blue-500, green-500 arbitrários
- [ ] CTAs usam `bg-gold text-navy hover:bg-gold/90`
- [ ] Textos secundários em `text-slate-500` / `text-slate-400`, nunca hex solto em `style={{}}`
- [ ] Nenhum `style={{ color: ... }}` ou `style={{ backgroundColor: ... }}` para cores da marca — apenas `style={{}}` para `backgroundImage` (gradientes/texturas que não têm classe Tailwind)
- [ ] Hover states suaves: `group-hover:-translate-y-1 group-hover:shadow-lg`
- [ ] Jagged SVG divider entre seções navy e surface quando aplicável
- [ ] TypeScript sem erros (`tsc --noEmit`)

## Contexto do produto

O Estetia CRM serve **clínicas de estética e dermatologia brasileiras**. O tom é premium mas acessível — como uma clínica de alto padrão, não um banco. O usuário típico é uma gestora de clínica ou profissional autônomo que quer modernizar sua operação. Cada interface deve transmitir confiança, clareza e sofisticação clínica — não SaaS genérico de tech startup.
