export interface Snippet {
  id: string
  title: string
  label: string
  code: string
  demo: 'morph' | 'stagger' | 'counter'
}

export const SNIPPETS: Snippet[] = [
  {
    id: 'morph',
    title: 'SVG Morphing',
    label: 'Forma',
    demo: 'morph',
    code: `// Animação de morfose SVG
animate(shape, {
  d: morphTo(triangle),
  duration: 600,
  ease: 'inOutExpo',
})`,
  },
  {
    id: 'stagger',
    title: 'Stagger Grid',
    label: 'Grade',
    demo: 'stagger',
    code: `// Entrada escalonada
animate(cells, {
  scale: [0, 1],
  opacity: [0, 1],
  delay: stagger(60, {
    from: 'center'
  }),
  ease: 'outBack(1.4)',
})`,
  },
  {
    id: 'counter',
    title: 'Scroll Counter',
    label: 'Contador',
    demo: 'counter',
    code: `// Contador animado
animate(el, {
  innerHTML: [0, 340],
  duration: 1800,
  ease: 'outExpo',
  modifier: Math.round,
})`,
  },
]
