'use client'

import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headingElements = doc.querySelectorAll('h2, h3')

    const extracted: Heading[] = []
    headingElements.forEach((heading, index) => {
      const text = heading.textContent || ''
      const id = `heading-${index}`
      const level = parseInt(heading.tagName.substring(1))
      extracted.push({ id, text, level })
    })
    setHeadings(extracted)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-100px 0px -80% 0px' }
    )

    document.querySelectorAll('article h2, article h3').forEach((heading, index) => {
      heading.id = `heading-${index}`
      observer.observe(heading)
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const top = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({ top: top - offset, behavior: 'smooth' })
    }
  }

  if (headings.length === 0) return null

  return (
    <nav className="sticky top-24 self-start hidden lg:block">
      <div className="rounded-2xl p-6"
        style={{ backgroundColor: '#fff', border: '1px solid rgba(10,31,61,0.08)', boxShadow: '0 1px 6px rgba(10,31,61,0.06)' }}>
        <h4 className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: '#94A3B8' }}>
          Neste Artigo
        </h4>
        <ul className="space-y-1 text-sm">
          {headings.map((heading) => {
            const isActive = activeId === heading.id
            return (
              <li key={heading.id} className={heading.level === 3 ? 'ml-3' : ''}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className="text-left w-full py-1.5 px-3 rounded-lg transition-all duration-150"
                  style={isActive
                    ? { color: '#0A1F3D', backgroundColor: 'rgba(10,31,61,0.06)', fontWeight: 600, borderLeft: '2px solid #C5A059', paddingLeft: '10px' }
                    : { color: '#64748B', borderLeft: '2px solid transparent' }
                  }
                >
                  {heading.text}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
