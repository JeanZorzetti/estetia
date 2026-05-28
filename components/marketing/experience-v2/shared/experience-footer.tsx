'use client'

const FOOTER_LINKS = {
  produto: [
    { label: 'Preços', href: '/precos' },
    { label: 'Funcionalidades', href: '/#features' },
    { label: 'Blog', href: '/blog' },
    { label: 'Login', href: '/login' },
  ],
  suporte: [
    { label: 'Agendar demo', href: '/demo' },
    { label: 'Política de privacidade', href: '/privacidade' },
    { label: 'LGPD', href: '/lgpd' },
  ],
}

export function ExperienceFooter() {
  return (
    <footer
      aria-label="Rodapé do Estetia CRM"
      style={{
        width: '100%',
        marginTop: '5rem',
        paddingTop: '3rem',
        borderTop: '1px solid rgba(240,237,232,0.07)',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2.5rem',
        }}
      >
        {/* Brand column */}
        <div>
          <div
            style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: '1.1rem',
              fontWeight: 300,
              fontStyle: 'italic',
              color: '#C5A059',
              marginBottom: '0.75rem',
              letterSpacing: '-0.01em',
            }}
          >
            Estetia CRM
          </div>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.75rem',
              color: 'rgba(240,237,232,0.4)',
              lineHeight: 1.6,
              maxWidth: '200px',
            }}
          >
            Gestão clínica inteligente para clínicas de estética e dermatologia.
          </p>
        </div>

        {/* Contato */}
        <div>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(240,237,232,0.3)',
              marginBottom: '1rem',
            }}
          >
            Contato
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a
              href="mailto:contato@estetiacrm.com.br"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.78rem',
                color: 'rgba(240,237,232,0.55)',
                textDecoration: 'none',
              }}
            >
              contato@estetiacrm.com.br
            </a>
            <a
              href="https://wa.me/5511000000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.78rem',
                color: 'rgba(240,237,232,0.55)',
                textDecoration: 'none',
              }}
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Produto links */}
        <div>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(240,237,232,0.3)',
              marginBottom: '1rem',
            }}
          >
            Produto
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {FOOTER_LINKS.produto.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.78rem',
                  color: 'rgba(240,237,232,0.55)',
                  textDecoration: 'none',
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Suporte + redes */}
        <div>
          <p
            style={{
              fontFamily: "'Manrope', sans-serif",
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(240,237,232,0.3)',
              marginBottom: '1rem',
            }}
          >
            Redes
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a
              href="https://instagram.com/estetiacrm"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.78rem',
                color: 'rgba(240,237,232,0.55)',
                textDecoration: 'none',
              }}
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com/company/estetiacrm"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontSize: '0.78rem',
                color: 'rgba(240,237,232,0.55)',
                textDecoration: 'none',
              }}
            >
              LinkedIn
            </a>
            {FOOTER_LINKS.suporte.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: '0.78rem',
                  color: 'rgba(240,237,232,0.55)',
                  textDecoration: 'none',
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '2.5rem auto 0',
          padding: '1.5rem 1.5rem',
          borderTop: '1px solid rgba(240,237,232,0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.65rem',
            color: 'rgba(240,237,232,0.2)',
            letterSpacing: '0.08em',
          }}
        >
          Estetia CRM · 2026 · estetiacrm.com.br
        </p>
        <p
          style={{
            fontFamily: "'Manrope', sans-serif",
            fontSize: '0.65rem',
            color: 'rgba(240,237,232,0.15)',
            letterSpacing: '0.08em',
          }}
        >
          Feito no Brasil · LGPD compliant
        </p>
      </div>
    </footer>
  )
}
