# Hero Cinematic — Design Spec

**Data:** 2026-05-26
**Status:** Aprovado, em implementação
**Escopo:** Componente novo isolado, não substitui o hero atual da home

## Objetivo

Criar um hero fullscreen com vídeo em loop no background, reveal cinematográfico do texto via GSAP, e indicador de scroll que desaparece ao descer. Sensação alvo: tensão visual elegante antes da primeira interação — alinhada ao posicionamento "Tecnologia Estética de Elite" do Estetia CRM.

## Arquitetura

```
components/marketing/
  hero-cinematic.tsx                       # orquestrador client component
  hero-cinematic/
    video-background.tsx                   # <video> + overlay gradient + poster
    scroll-indicator.tsx                   # mouse SVG + dot + fade-out @ scroll
    use-mask-reveal.ts                     # hook GSAP split-by-line + animate
app/[locale]/(marketing)/design-system/
  hero-cinematic/page.tsx                  # rota demo isolada
public/videos/
  hero-placeholder.mp4                     # CC0 stock
  hero-placeholder.webm                    # variante leve
  hero-placeholder-poster.jpg              # fallback estático
```

## Composição visual

Stack de camadas (de trás pra frente):

1. `<video autoPlay muted loop playsInline>` cobrindo 100vw × 100vh, `object-cover`
2. Overlay gradient `from-[#0A1F3D]/70 via-[#0A1F3D]/40 to-[#0A1F3D]/60`
3. Conteúdo central (badge, título, subtítulo, CTAs)
4. Indicador de scroll fixo embaixo, centralizado

## Animação de entrada (GSAP timeline no mount)

| t (s) | Elemento | Efeito | Duração |
|---|---|---|---|
| 0.0 | Badge | opacity 0→1, y +12→0 | 0.6s |
| 0.3 | Título linha 1 | mask reveal (y +100% → 0) | 1.0s, power3.out |
| 0.4 | Título linha 2 | mask reveal | 1.0s |
| 0.8 | Subtítulo | opacity + y +20→0 | 0.8s |
| 1.0 | CTAs | opacity + y +16→0, stagger 0.08s | 0.7s |
| 1.4 | Indicador | opacity 0→1 | 0.5s |

Total ≈ 2.4s. Mount animation, sem ScrollTrigger.

### Mask reveal — implementação

Sem dependência de SplitText (Club GSAP). Hook `useMaskReveal` faz split manual:
- Recebe ref do título com cada linha em `<span>` próprio
- Envolve cada linha num wrapper `overflow-hidden`
- GSAP `from({ yPercent: 100 })` no `<span>` interno → desliza de baixo

## Indicador de scroll

- SVG inline de mouse com dot interno
- Dot pulsa via `@keyframes` CSS (independe de JS)
- Container fade-in @ 1.4s via GSAP
- Listener no Lenis (`getLenis()?.on('scroll', ...)`) com fallback `window.scroll`
- Quando `scrollY > 80` → GSAP fade-out 0.4s + `pointer-events: none` permanente
- Clique no indicador chama `lenis.scrollTo(window.innerHeight, { duration: 1.5 })`
- Label "Role para descobrir" em caps tracking-wide abaixo do ícone

## Vídeo background

```tsx
<video
  autoPlay muted loop playsInline
  preload="metadata"
  poster="/videos/hero-placeholder-poster.jpg"
  aria-hidden="true"
  className="absolute inset-0 w-full h-full object-cover"
>
  <source src="/videos/hero-placeholder.webm" type="video/webm" />
  <source src="/videos/hero-placeholder.mp4" type="video/mp4" />
</video>
```

Fonte do placeholder: Coverr.co (CC0) — clipe abstrato sutil (líquido/luz/seda) em tons frios pra não competir com a paleta navy/gold.

## Acessibilidade

- Vídeo `aria-hidden`, sempre `muted` (regra de autoplay)
- `prefers-reduced-motion: reduce`:
  - Vídeo trocado pelo poster estático (atributo `autoPlay` removido)
  - GSAP timeline pulada — texto renderizado em estado final
- Indicador clicável tem `aria-label="Rolar para próxima seção"`
- Overlay garante contraste AA do texto sobre qualquer frame do vídeo

## Performance

- Vídeo comprimido alvo: MP4 ~1.5MB / WebM ~800KB, 8-12s loop
- `preload="metadata"` evita baixar o vídeo inteiro antes do scroll
- Poster JPG ~80KB serve como LCP
- GSAP já no bundle (instalado anteriormente)
- ScrollTrigger NÃO usado aqui (animação de mount)

## Texto da demo (hardcoded, sem i18n na demo)

- Badge: "TECNOLOGIA ESTÉTICA DE ELITE"
- Título: "A inteligência por trás\ndas clínicas de elite."
- Subtítulo: "Estetia CRM transforma sua agenda, financeiro e relacionamento com pacientes em uma única plataforma."
- CTA primário: "Começar gratuitamente"
- CTA secundário: "Ver demonstração"
- Indicador: "Role para descobrir"

## O que NÃO faz parte

- Substituir hero da home (`<Hero />` em `page.tsx` continua intacto)
- Parallax do texto
- Botão mute/unmute (vídeo sempre mudo)
- Carousel de vídeos
- Integração com next-intl (texto hardcoded na demo)

## Verificação

- `npm run build` passa sem erros TS
- Acessar `/design-system/hero-cinematic` no dev server
- Vídeo carrega e faz loop sem som
- Reveal executa na ordem da timeline
- Scroll > 80px faz indicador desaparecer
- DevTools com `prefers-reduced-motion` ligado: vídeo congela no poster, texto aparece direto
