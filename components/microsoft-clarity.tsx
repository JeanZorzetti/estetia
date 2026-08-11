'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { analyticsConfig } from '@/lib/analytics-config'
import logger from '@/lib/logger'

/**
 * Microsoft Clarity Component with Error Handling
 *
 * Handles common Clarity errors silently:
 * - 400 Bad Request from i.clarity.ms/collect
 * - CORS policy violations
 * - Network errors
 */
export function MicrosoftClarity() {
  useEffect(() => {
    // Suprimir erros específicos do Clarity no console
    const originalError = console.error
    console.error = (...args) => {
      const message = args[0]?.toString() || ''

      // Ignorar erros conhecidos do Clarity
      if (
        message.includes('clarity.ms') ||
        message.includes('i.clarity.ms/collect') ||
        message.includes('POST https://i.clarity.ms/collect')
      ) {
        // Log silencioso opcional (remova o comentário se quiser logar)
        // logger.debug({ message }, '[Clarity] Supressed error:')
        return
      }

      // Outros erros passam normalmente
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  if (!analyticsConfig.clarity.enabled) {
    return null
  }

  return (
    <Script
      id="microsoft-clarity"
      strategy="lazyOnload"
      onError={(error) => {
        // Silenciosamente logar erro de carregamento do script
        logger.debug({ message: error.message }, '[Clarity] Script load error:')
      }}
    >
      {`
        (function(c,l,a,r,i,t,y){
          try {
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            t.onerror=function(){console.debug('[Clarity] Tag load failed')};
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          } catch(e) {
            console.debug('[Clarity] Initialization error:', e.message);
          }
        })(window, document, "clarity", "script", "${analyticsConfig.clarity.id}");
      `}
    </Script>
  )
}
