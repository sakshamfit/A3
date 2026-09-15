import { useEffect, useRef, useState } from 'react'

/**
 * CloudFront source (exact).
 */
const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_090628_7052d8a6-a094-4341-a4a2-ad58493a67a9.mp4'

/** Max width of captured frames; height is scaled proportionally. */
const CAPTURE_MAX_WIDTH = 960

/** Boomerang playback rate. */
const PLAYBACK_FPS = 30

/**
 * Minimal typing for the (not-yet-in-lib.dom everywhere) frame-callback API.
 */
type RVFCVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (cb: () => void) => number
  cancelVideoFrameCallback?: (handle: number) => void
}

/**
 * Full-bleed hero background that plays the source video once while capturing
 * every frame into offscreen canvases, then swaps to a display canvas that
 * ping-pongs (forward → reverse) through the captured frames forever.
 */
export default function BoomerangVideoBg() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [framesReady, setFramesReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current as RVFCVideo | null
    const display = canvasRef.current
    if (!video || !display) return

    const frames: HTMLCanvasElement[] = []
    let lastCapturedTime = -1
    let rafId = 0
    let rvfcHandle = 0
    let capturing = false
    let playIntervalId = 0
    let finished = false
    let retriedWithoutCors = false

    /* ------------------------------ capture ------------------------------ */

    const captureFrame = () => {
      if (!capturing || finished) return

      const vw = video.videoWidth
      const vh = video.videoHeight
      if (vw > 0 && vh > 0) {
        // Deduplicate by currentTime so we only keep unique frames.
        const t = video.currentTime
        if (Math.abs(t - lastCapturedTime) > 1e-4) {
          lastCapturedTime = t
          const scale = Math.min(1, CAPTURE_MAX_WIDTH / vw)
          const w = Math.max(2, Math.round(vw * scale))
          const h = Math.max(2, Math.round(vh * scale))
          const frame = document.createElement('canvas')
          frame.width = w
          frame.height = h
          const fctx = frame.getContext('2d')
          if (fctx) {
            fctx.drawImage(video, 0, 0, w, h)
            frames.push(frame)
          }
        }
      }

      // Prefer requestVideoFrameCallback; fall back to rAF.
      if (typeof video.requestVideoFrameCallback === 'function') {
        rvfcHandle = video.requestVideoFrameCallback(captureFrame)
      } else {
        rafId = requestAnimationFrame(captureFrame)
      }
    }

    const beginCapture = () => {
      if (capturing || finished) return
      capturing = true
      captureFrame()
    }

    const stopCapture = () => {
      capturing = false
      if (rvfcHandle && typeof video.cancelVideoFrameCallback === 'function') {
        video.cancelVideoFrameCallback(rvfcHandle)
        rvfcHandle = 0
      }
      if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    /* --------------------------- boomerang loop --------------------------- */

    const startPingPong = () => {
      if (frames.length < 2) return
      const dctx = display.getContext('2d')
      if (!dctx) return

      display.width = frames[0].width
      display.height = frames[0].height

      let idx = 0
      let dir = 1

      const draw = () => {
        const frame = frames[idx]
        if (frame) {
          if (display.width !== frame.width || display.height !== frame.height) {
            display.width = frame.width
            display.height = frame.height
          }
          dctx.drawImage(frame, 0, 0)
        }
      }

      draw()
      setFramesReady(true)

      playIntervalId = window.setInterval(() => {
        idx += dir
        if (idx >= frames.length - 1) {
          idx = frames.length - 1
          dir = -1
        } else if (idx <= 0) {
          idx = 0
          dir = 1
        }
        draw()
      }, 1000 / PLAYBACK_FPS)
    }

    /* ------------------------------ video glue ---------------------------- */

    const handleCanPlay = () => {
      // Play exactly once (no native loop) — frames are captured meanwhile.
      void video.play().catch(() => {
        /* autoplay rejected; capture will still not start */
      })
    }

    const handleEnded = () => {
      finished = true
      stopCapture()
      if (frames.length >= 2) {
        startPingPong()
      } else {
        // Fallback: nothing capturable — restart the video for a forward loop.
        video.currentTime = 0
        void video.play().catch(() => {})
      }
    }

    const handleError = () => {
      // If the CORS-clean fetch failed, retry without crossOrigin so at least
      // the background renders (tainted canvases still display fine).
      if (!retriedWithoutCors) {
        retriedWithoutCors = true
        video.removeAttribute('crossorigin')
        video.load()
      }
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('play', beginCapture)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)

    if (video.readyState >= 3) handleCanPlay()
    else video.load()

    return () => {
      stopCapture()
      if (playIntervalId) window.clearInterval(playIntervalId)
      finished = true
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('play', beginCapture)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-white">
      <div className="w-full h-full scale-[1.15] origin-top overflow-hidden">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className="w-full h-full object-cover object-top"
          style={framesReady ? { display: 'none' } : undefined}
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover object-top"
          style={framesReady ? undefined : { display: 'none' }}
        />
      </div>
    </div>
  )
}
