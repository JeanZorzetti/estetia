import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontFamily: 'Georgia, "Times New Roman", serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient navy */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #0a1f3d 0%, #0d2547 60%, #0a2050 100%)',
          }}
        />

        {/* Subtle dot grid */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.06,
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Gold glow — top right */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-80px',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(197,160,89,0.22) 0%, transparent 65%)',
            borderRadius: '50%',
          }}
        />

        {/* Teal glow — bottom left */}
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '-60px',
            width: '380px',
            height: '380px',
            background: 'radial-gradient(circle, rgba(72,159,181,0.15) 0%, transparent 65%)',
            borderRadius: '50%',
          }}
        />

        {/* Content layer */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '60px 70px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Header — logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #c5a059 0%, #a8853f 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                fontWeight: 'bold',
                color: '#0a1f3d',
                fontFamily: 'Georgia, serif',
              }}
            >
              E
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  letterSpacing: '0.08em',
                  fontFamily: 'Georgia, serif',
                }}
              >
                ESTETIA
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: 'rgba(197,160,89,0.85)',
                  letterSpacing: '0.2em',
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: '600',
                }}
              >
                CRM
              </span>
            </div>
          </div>

          {/* Center — headline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                fontSize: '56px',
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.15,
                maxWidth: '860px',
                fontFamily: 'Georgia, "Times New Roman", serif',
              }}
            >
              CRM para clínicas de
              <br />
              <span style={{ color: '#c5a059' }}>estética e dermatologia</span>
            </div>

            {/* Accent line */}
            <div
              style={{
                width: '80px',
                height: '3px',
                borderRadius: '2px',
                background: 'linear-gradient(90deg, #c5a059, rgba(197,160,89,0.3))',
              }}
            />

            {/* Pills */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              {['Agenda inteligente', 'Anamnese digital', 'LGPD'].map((label) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(197,160,89,0.3)',
                    color: 'rgba(255,255,255,0.8)',
                    padding: '8px 20px',
                    borderRadius: '24px',
                    fontSize: '17px',
                    fontFamily: 'system-ui, sans-serif',
                    letterSpacing: '0.02em',
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: '18px',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '0.04em',
              }}
            >
              estetiacrm.com.br
            </span>
            <span
              style={{
                fontSize: '16px',
                color: 'rgba(197,160,89,0.6)',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '0.08em',
              }}
            >
              14 dias grátis
            </span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
