'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  videoSrc: string
  imgSrc: string
  imgAlt: string
  vbubble?: ReactNode
}

// Industry page video band: poster image + ambient loop video that plays when in view.
// Ports site.js vid-band IntersectionObserver behavior exactly.
export function LoopVidBand({ videoSrc, imgSrc, imgAlt, vbubble }: Props) {
  const figRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const fig = figRef.current
    const video = videoRef.current
    if (!fig || !video) return

    const wantLoops =
      matchMedia('(min-width: 720px)').matches &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!wantLoops) return

    const io = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          if (!video.src) {
            video.src = videoSrc
            video.addEventListener('canplay', () => fig.classList.add('on'), { once: true })
          }
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 }
    )
    io.observe(fig)
    return () => io.disconnect()
  }, [videoSrc])

  return (
    <figure ref={figRef} className="img-band vid-band rev">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imgSrc} alt={imgAlt} loading="lazy" width={1920} height={1080} />
      <video
        ref={videoRef}
        className="loopvid"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden
        tabIndex={-1}
      />
      {vbubble}
    </figure>
  )
}
