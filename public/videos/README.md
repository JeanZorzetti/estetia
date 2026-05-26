# Hero Cinematic — assets de vídeo

## Arquivos esperados

- `hero-placeholder.mp4` — vídeo principal (atualmente um sample neutro)
- `hero-placeholder.webm` — variante leve (opcional, navegador faz fallback)
- `hero-placeholder-poster.jpg` — frame estático de fallback (opcional)

## Como substituir pelo seu vídeo

1. Codifique seu vídeo em MP4 H.264, alvo 1920×1080, 24-30fps, bitrate ~2-4Mbps, duração 8-12s
2. (Opcional) gere variante WebM com `ffmpeg -i input.mp4 -c:v libvpx-vp9 -b:v 800k output.webm`
3. (Opcional) extraia poster com `ffmpeg -i input.mp4 -ss 00:00:01 -vframes 1 -q:v 2 hero-placeholder-poster.jpg`
4. Substitua os arquivos mantendo os mesmos nomes
5. Não precisa rebuild — assets em `public/` são servidos diretamente

## Onde é usado

`components/marketing/hero-cinematic/video-background.tsx` — aceita props `src`, `webmSrc`, `poster` se você quiser usar outros caminhos.

## Atribuição do placeholder atual

Sample neutro de download.samplelib.com (uso livre para teste). Substituir antes de publicar em produção.
