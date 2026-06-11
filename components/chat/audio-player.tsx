'use client'

// WhatsApp-style audio player (extracted from message-area.tsx)

import { useState, useEffect, useRef } from 'react'
import { Mic, Loader2, Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isMediaLoaded } from './message-helpers'

export function fmtDurationStatic(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function fmtAudioTime(s: number): string {
  if (!isFinite(s) || isNaN(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function AudioPlayer({
  mediaData, outbound, loading, onFetch, containerRef, knownDuration, error,
}: {
  mediaData: string | null
  outbound: boolean
  loading: boolean
  onFetch: () => void
  containerRef: React.RefObject<HTMLDivElement | null>
  knownDuration?: number
  error?: boolean
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(knownDuration ?? 0)
  const [playbackRate, setPlaybackRate] = useState(1)

  // Sync knownDuration into state when it arrives (e.g. after message reloads)
  useEffect(() => {
    if (knownDuration && knownDuration > 0) setDuration(knownDuration)
  }, [knownDuration])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  useEffect(() => {
    if (!mediaData) return
    const audio = audioRef.current
    if (!audio) return

    const trySetDuration = () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
      } else if (!isFinite(audio.duration)) {
        // Blob/stream Infinity bug — seek far to force real duration
        audio.currentTime = 9999
      }
    }

    const onSeeked = () => {
      if (audio.currentTime > 0 && (!isFinite(audio.duration) || audio.duration === 0)) {
        setDuration(audio.currentTime)
      }
      audio.currentTime = 0
    }

    const onTime = () => setCurrentTime(audio.currentTime)
    const onEnded = () => { setPlaying(false); setCurrentTime(0) }

    audio.addEventListener('loadedmetadata', trySetDuration)
    audio.addEventListener('durationchange', trySetDuration)
    audio.addEventListener('seeked', onSeeked)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)
    audio.load()

    return () => {
      audio.removeEventListener('loadedmetadata', trySetDuration)
      audio.removeEventListener('durationchange', trySetDuration)
      audio.removeEventListener('seeked', onSeeked)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
    }
  }, [mediaData])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  function seekTo(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * duration
  }

  function cycleSpeed() {
    const rates = [1, 1.5, 2]
    const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length]
    setPlaybackRate(next)
    if (audioRef.current) audioRef.current.playbackRate = next
  }

  const bg = outbound ? 'bg-[#d9fdd3] dark:bg-emerald-900/60' : 'bg-white dark:bg-zinc-800'
  const waveColor = outbound ? '#4acd8d' : '#8696a0'
  const progressColor = '#00a884'

  if (!isMediaLoaded(mediaData)) {
    // Sent audio (WABA outbound) — no playback URL available, show duration badge only
    if (error) {
      return (
        <div ref={containerRef}>
          <div className={cn('flex items-center gap-2.5 rounded-2xl px-3 py-2.5', bg)}>
            <div className="w-10 h-10 rounded-full bg-[#00a884]/20 flex items-center justify-center flex-shrink-0">
              <Mic className="h-5 w-5 text-[#00a884]" />
            </div>
            <span className="text-[13px] text-[#667781]">
              {knownDuration ? fmtDurationStatic(knownDuration) : 'Áudio enviado'}
            </span>
          </div>
        </div>
      )
    }

    return (
      <div ref={containerRef}>
        <div className={cn('flex items-center gap-3 rounded-2xl px-3 py-2.5 min-w-[220px]', bg)}>
          <button
            onClick={onFetch}
            disabled={loading}
            className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center flex-shrink-0 hover:bg-[#008f72] transition-colors disabled:opacity-60"
          >
            {loading
              ? <Loader2 className="h-5 w-5 animate-spin text-white" />
              : <Play className="h-5 w-5 text-white fill-white ml-0.5" />}
          </button>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-[2px] h-6">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] rounded-full"
                  style={{
                    height: `${6 + Math.abs(Math.sin(i * 0.8)) * 14}px`,
                    backgroundColor: waveColor,
                    opacity: 0.5,
                  }}
                />
              ))}
            </div>
            <span className="text-[11px] text-[#667781]">0:00</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef}>
      <audio ref={audioRef} src={mediaData!} preload="metadata" />
      <div className={cn('flex items-center gap-3 rounded-2xl px-3 py-2.5 min-w-[220px] max-w-[280px]', bg)}>
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center flex-shrink-0 hover:bg-[#008f72] transition-colors"
        >
          {playing
            ? <Pause className="h-5 w-5 text-white fill-white" />
            : <Play className="h-5 w-5 text-white fill-white ml-0.5" />}
        </button>

        <div className="flex-1 space-y-1.5 min-w-0">
          {/* Waveform / seekbar */}
          <div
            className="relative h-6 flex items-center cursor-pointer"
            onClick={seekTo}
          >
            {/* Static waveform bars */}
            <div className="absolute inset-0 flex items-center gap-[2px]">
              {Array.from({ length: 28 }).map((_, i) => {
                const barH = 6 + Math.abs(Math.sin(i * 0.8)) * 14
                const filled = (i / 28) * 100 <= progress
                return (
                  <div
                    key={i}
                    className="w-[2px] rounded-full flex-shrink-0 transition-colors duration-100"
                    style={{
                      height: `${barH}px`,
                      backgroundColor: filled ? progressColor : waveColor,
                      opacity: filled ? 1 : 0.45,
                    }}
                  />
                )
              })}
            </div>
          </div>

          {/* Time + speed */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#667781] tabular-nums">
              {playing || currentTime > 0 ? fmtAudioTime(currentTime) : fmtAudioTime(duration)}
            </span>
            <button
              onClick={cycleSpeed}
              className="text-[11px] font-semibold text-[#667781] hover:text-[#00a884] transition-colors px-1"
            >
              {playbackRate}×
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
