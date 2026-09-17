import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { ZoomIn, ZoomOut, Box, ChevronLeft, ChevronRight } from 'lucide-react'
import { MATERIALS } from '../../lib/site'
import { prefersReducedMotion } from '../../lib/gsap'
import { cn } from '../../lib/utils'
import {
  disposeRoomAsset,
  fitRoomModel,
  loadRoomEnv,
  loadRoomModel,
} from './room-model'

/** Intrinsic size of the room plate — `MATERIALS[].hotspot` is authored against it. */
const ROOM_PLATE = { src: '/images/material-board-room.jpg', w: 1376, h: 768 }

type CoverBox = { scale: number; dx: number; dy: number; w: number; h: number }

const SQUARE: CoverBox = { scale: 1, dx: 0, dy: 0, w: 1, h: 1 }

/**
 * Measures the box the room plate is painted into and resolves the
 * `object-contain` fit: `scale` is device pixels per image pixel, `dx`/`dy` the
 * centring offset. `hotspot` percentages are image space, the dots and the zoom
 * origin are box space, and only this mapping keeps the two lined up — a dot
 * placed by eye on the un-cropped photo drifts off its surface as soon as the
 * card changes shape.
 *
 * `contain` rather than `cover` on purpose: the plate is never cropped, so no
 * finish can be lettered out of the frame on a narrow phone. The dark bars are
 * the section's own ink, and the zoom removes them anyway.
 */
function usePlateBox(ref: React.RefObject<HTMLElement | null>, iw: number, ih: number) {
  const [box, setBox] = useState<CoverBox>(SQUARE)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      const scale = Math.min(w / iw, h / ih)
      setBox({ scale, dx: (w - iw * scale) / 2, dy: (h - ih * scale) / 2, w, h })
    }
    measure()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, iw, ih])

  return box
}

interface RoomSceneProps {
  /** Index of the material currently highlighted in the DOM list. */
  activeMaterial: number | null
  /** Callback when a hotspot or material pin is clicked. */
  onSelectMaterial?: (index: number) => void
  /** Controlled zoom state (if passed) */
  isZoomed?: boolean
  /** Callback when zoom state changes */
  onToggleZoom?: (zoomed: boolean) => void
  className?: string
}

type ViewMode = 'room' | '3d'

/**
 * Architectural Material Showroom & Zoomable In-Situ Visualizer.
 *
 * Provides an authentic, photorealistic in-situ living pavilion showing how
 * Travertine, Smoked Oak, Black Stone, and Limewash harmonize in an actual
 * space. Clicking any hotspot pin smoothly zooms directly into that location
 * to reveal the tactile 1:1 macro close shot with full material specifications.
 */
export default function RoomScene({
  activeMaterial,
  onSelectMaterial,
  isZoomed: externalZoom,
  onToggleZoom,
  className = '',
}: RoomSceneProps) {
  const [internalZoom, setInternalZoom] = useState(false)
  const isZoomed = externalZoom !== undefined ? externalZoom : internalZoom

  const setZoom = (value: boolean) => {
    setInternalZoom(value)
    onToggleZoom?.(value)
  }

  const [mode, setMode] = useState<ViewMode>('room')
  const [hoveredHotspot, setHoveredHotspot] = useState<number | null>(null)
  const [hasWebGL, setHasWebGL] = useState(true)

  // Tilt coordinates for smooth parallax in wide room mode
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  // Micro pan coordinates for close shot inspection
  const [macroPan, setMacroPan] = useState({ x: 0, y: 0 })

  const containerRef = useRef<HTMLDivElement | null>(null)
  const host3dRef = useRef<HTMLDivElement | null>(null)

  const activeIdx =
    activeMaterial !== null && activeMaterial >= 0 && activeMaterial < MATERIALS.length
      ? activeMaterial
      : 0
  const currentMaterial = MATERIALS[activeIdx]

  /* image-space hotspot → the box the plate is actually painted into */
  const plateBox = usePlateBox(containerRef, ROOM_PLATE.w, ROOM_PLATE.h)
  /* Before the first measurement (and in any environment that lays nothing
     out) there is no crop to undo, so map 1:1 instead of scaling by a
     zero-sized box — that would push every dot out of range. */
  const measurable = plateBox.w > 2 && plateBox.h > 2
  const toBoxPct = useMemo(() => {
    if (!measurable) return (point: { x: number; y: number }) => ({ ...point })
    const { scale, dx, dy, w, h } = plateBox
    return (point: { x: number; y: number }) => ({
      x: ((dx + (point.x / 100) * ROOM_PLATE.w * scale) / w) * 100,
      y: ((dy + (point.y / 100) * ROOM_PLATE.h * scale) / h) * 100,
    })
  }, [plateBox, measurable])

  const activeAt = toBoxPct(currentMaterial.hotspot)

  /** A dot the fitted plate cannot actually show is skipped, not clipped. */
  const visibleHotspots = MATERIALS.map((material, i) => ({
    material,
    index: i,
    at: toBoxPct(material.hotspot),
  })).filter(({ at }) => at.x >= -1 && at.x <= 101 && at.y >= -1 && at.y <= 101)
  // Track cursor movement for subtle parallax / macro panning
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2

    if (!isZoomed) {
      setTilt({ x: x * 8, y: -y * 6 })
    } else {
      setMacroPan({ x: -x * 20, y: -y * 20 })
    }
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setMacroPan({ x: 0, y: 0 })
  }

  // Keyboard accessibility: ESC key to zoom out
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZoomed) {
        setZoom(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isZoomed])

  /* -------------------------------------------------- Three.js 3D Setup (for '3d' mode & test suite) */
  useEffect(() => {
    if (mode !== '3d') return
    const host = host3dRef.current
    if (!host) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    } catch {
      setHasWebGL(false)
      return
    }
    if (!renderer.getContext()) {
      setHasWebGL(false)
      return
    }

    const reduced = prefersReducedMotion()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(host.clientWidth || 1, host.clientHeight || 1, false)
    renderer.setClearColor(0x161412, 1)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x161412)
    scene.fog = new THREE.Fog(0x161412, 9, 24)

    const camera = new THREE.PerspectiveCamera(
      36,
      (host.clientWidth || 1) / (host.clientHeight || 1),
      0.1,
      60,
    )
    camera.position.set(4.2, 2.6, 6.8)
    camera.lookAt(0, 1.1, 0)

    const room = new THREE.Group()
    scene.add(room)

    const procedural = new THREE.Group()
    room.add(procedural)

    const mat = (color: number, roughness: number, metalness = 0.04) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness })

    // Floor & Walls
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), mat(0x282420, 0.65))
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    procedural.add(floor)

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(24, 10), mat(0x1e1a17, 0.9))
    backWall.position.set(0, 5, -5)
    backWall.receiveShadow = true
    procedural.add(backWall)

    // Architectural volumes
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 1.2), mat(0xd9cfbd, 0.5, 0.02))
    plinth.position.set(-0.2, 0.22, 1.2)
    plinth.castShadow = true
    plinth.receiveShadow = true
    procedural.add(plinth)

    const oakPanel = new THREE.Mesh(new THREE.BoxGeometry(0.18, 3.8, 1.8), mat(0x9a6b3f, 0.7, 0.08))
    oakPanel.position.set(2.2, 1.9, 0.4)
    oakPanel.castShadow = true
    oakPanel.receiveShadow = true
    procedural.add(oakPanel)

    const blackStonePillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.4, 0.8), mat(0x22201d, 0.85, 0.1))
    blackStonePillar.position.set(-2.2, 1.2, 0.2)
    blackStonePillar.castShadow = true
    blackStonePillar.receiveShadow = true
    procedural.add(blackStonePillar)

    // Floating material board
    const board = new THREE.Group()
    board.position.set(-0.2, 2.1, 0.8)
    room.add(board)

    const boardMeshes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>[] = []
    MATERIALS.forEach((material, i) => {
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.85, 1.2),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(material.swatch),
          roughness: 0.6,
          metalness: 0.05,
          emissive: new THREE.Color(material.swatch),
          emissiveIntensity: 0,
        }),
      )
      plane.position.set((i - (MATERIALS.length - 1) / 2) * 1.05, 0, (i % 2 === 0 ? 0.08 : -0.08))
      plane.rotation.y = (i - (MATERIALS.length - 1) / 2) * -0.1
      plane.castShadow = true
      board.add(plane)
      boardMeshes.push(plane)
    })

    // Lighting
    scene.add(new THREE.HemisphereLight(0xb2c0cc, 0x1f1a16, 0.55))
    const sunLight = new THREE.DirectionalLight(0xffebd2, 3.2)
    sunLight.position.set(4.5, 5.2, -2.8)
    sunLight.target.position.set(-0.5, 0.5, 1.2)
    sunLight.castShadow = true
    scene.add(sunLight, sunLight.target)

    let loadedModel: THREE.Object3D | null = null
    let loadedEnv: THREE.Texture | null = null
    let cancelled = false

    // Real asset upgrade path check
    ;(async () => {
      try {
        const [model, env] = await Promise.all([loadRoomModel(renderer), loadRoomEnv(renderer)])
        if (cancelled) {
          if (model) disposeRoomAsset(model.scene)
          if (env) env.dispose()
          return
        }
        if (env) {
          loadedEnv = env
          scene.environment = env
        }
        if (model) {
          loadedModel = model.scene
          procedural.visible = false
          room.add(fitRoomModel(model.scene))
        }
      } catch {
        /* Fall back to procedural */
      }
    })()

    let raf = 0
    const startTime = performance.now()

    const render = () => {
      const elapsed = (performance.now() - startTime) * 0.001
      boardMeshes.forEach((plane, i) => {
        const active = activeMaterial === i
        plane.position.y = active ? 0.18 : 0
        plane.material.emissiveIntensity = active ? 0.45 : 0.02
      })
      board.position.y = 2.1 + Math.sin(elapsed * 0.8) * 0.05
      renderer.render(scene, camera)
    }

    if (reduced) {
      render()
    } else {
      const loop = () => {
        raf = requestAnimationFrame(loop)
        render()
      }
      raf = requestAnimationFrame(loop)
    }

    const resize = () => {
      const w = host.clientWidth || 1
      const h = host.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', resize)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      if (loadedModel) disposeRoomAsset(loadedModel)
      if (loadedEnv) loadedEnv.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement)
      }
    }
  }, [mode, activeMaterial])

  const handleHotspotClick = (index: number) => {
    onSelectMaterial?.(index)
    // If already on this material and already zoomed, toggle; otherwise zoom into it
    if (activeIdx === index && isZoomed) {
      // stay zoomed or toggle
    } else {
      setZoom(true)
    }
  }

  const handlePrevMaterial = () => {
    const nextIdx = (activeIdx - 1 + MATERIALS.length) % MATERIALS.length
    onSelectMaterial?.(nextIdx)
  }

  const handleNextMaterial = () => {
    const nextIdx = (activeIdx + 1) % MATERIALS.length
    onSelectMaterial?.(nextIdx)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden bg-inkdeep select-none ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* -------------------------------- VIEW 1: IN SITU ZOOMABLE ROOM */}
      {mode === 'room' && (
        <div className="relative h-full w-full overflow-hidden">
          {/* Main Zoomable Living Room Canvas.
              `data-room-plate` is the contract the smoke test reads: this layer
              is photograph + dots only — no copy, no badges, no legend. */}
          <div
            data-room-plate
            className="relative h-full w-full will-change-transform"
            style={{
              transformOrigin: `${activeAt.x}% ${activeAt.y}%`,
              transform: isZoomed
                ? `scale(3.2)`
                : `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(1.025)`,
              transition: isZoomed
                ? 'transform 750ms cubic-bezier(0.16, 1, 0.3, 1)'
                : 'transform 300ms ease-out',
            }}
          >
            {/* Photorealistic Living Room */}
            <img
              src={ROOM_PLATE.src}
              alt="A3 Interior Designer Material Showroom Living Room"
              className="h-full w-full object-contain object-center"
              loading="eager"
            />

            {/* Ambient light + vignette. Deliberately copy-free: nothing is
                written over the room — the pins carry the interaction and the
                finish names live in the list on the right. */}
            <div
              className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
                isZoomed
                  ? 'bg-inkdeep/25 opacity-30'
                  : 'bg-gradient-to-t from-inkdeep/70 via-transparent to-inkdeep/25 opacity-100'
              }`}
              aria-hidden="true"
            />

            {/* One dot per finish, placed on the surface it belongs to. */}
            <div
              className={`transition-opacity duration-500 ${
                isZoomed ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
            >
              {visibleHotspots.map(({ material, index, at }) => {
                const isActive = activeIdx === index
                const isHovered = hoveredHotspot === index

                return (
                  <button
                    key={material.name}
                    type="button"
                    onClick={() => handleHotspotClick(index)}
                    onMouseEnter={() => {
                      setHoveredHotspot(index)
                      onSelectMaterial?.(index)
                    }}
                    onMouseLeave={() => setHoveredHotspot(null)}
                    onFocus={() => onSelectMaterial?.(index)}
                    aria-label={`Zoom into the ${material.name} close shot`}
                    title={material.hotspot.label}
                    data-room-dot
                    className="group/pin absolute z-20 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-zoom-in items-center justify-center focus:outline-none"
                    style={{ left: `${at.x}%`, top: `${at.y}%` }}
                  >
                    <span className="relative flex h-7 w-7 items-center justify-center">
                      <span
                        className={cn(
                          'absolute inline-flex h-full w-full rounded-full border transition-all duration-500',
                          isActive
                            ? 'animate-ping border-amber-300/70 bg-amber-300/20'
                            : 'border-white/45 bg-white/10 opacity-70 group-hover/pin:opacity-100',
                        )}
                      />
                      <span
                        className={cn(
                          'relative flex h-2.5 w-2.5 rounded-full transition-all duration-300 group-hover/pin:scale-125',
                          isActive
                            ? 'scale-125 bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.8)]'
                            : isHovered
                              ? 'bg-amber-200'
                              : 'bg-chalk/85',
                        )}
                      />
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* -------------------------------- CLOSE SHOT / MACRO OVERLAY (Revealed when Zoomed)
              Deliberately wordless: the texture fills the frame, one line says
              what it is, four dots move between finishes. The spec copy that
              used to sit on top of the macro now lives in the list beside the
              board, where it can be read without covering the photograph. */}
          <div
            className={`absolute inset-0 z-30 flex flex-col justify-between transition-all duration-700 ease-smooth ${
              isZoomed ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'
            }`}
          >
            <div className="absolute inset-0 overflow-hidden bg-inkdeep">
              <img
                src={currentMaterial.macroImage}
                alt={`${currentMaterial.name} 1:1 macro tactile close shot`}
                className="h-full w-full object-cover object-center transition-transform duration-300 ease-out will-change-transform"
                style={{
                  transform: `scale(1.06) translate(${macroPan.x}px, ${macroPan.y}px)`,
                }}
              />

              {/* hairline vignette, only enough to keep the two bars readable */}
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-inkdeep/70 via-transparent to-inkdeep/40"
                aria-hidden="true"
              />

              {/* four viewfinder marks — the only ornament */}
              <div className="pointer-events-none absolute inset-3 sm:inset-5" aria-hidden="true">
                <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-amber-300/70" />
                <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-amber-300/70" />
                <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-amber-300/70" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-amber-300/70" />
              </div>
            </div>

            {/* top right — the only control up here, and it says nothing */}
            <div className="relative z-40 flex items-start justify-end p-3 sm:p-4">
              <button
                type="button"
                onClick={() => setZoom(false)}
                aria-label="Zoom back out to the room"
                title="Zoom back out · Esc"
                className="flex h-8 w-8 items-center justify-center border border-white/20 bg-ink/70 text-chalk/80 backdrop-blur-md transition-colors hover:border-amber-300/60 hover:text-chalk focus:outline-none"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
            </div>

            {/* bottom — one line to name the finish, four dots to change it */}
            <div className="relative z-40 flex items-end justify-between gap-4 p-3 sm:p-4">
              <p className="flex min-w-0 items-center gap-2.5">
                <span
                  className="h-3 w-3 shrink-0 border border-white/25"
                  style={{ backgroundColor: currentMaterial.swatch }}
                  aria-hidden="true"
                />
                <span className="truncate font-mono text-[11px] uppercase tracking-wider text-chalk/85">
                  {currentMaterial.name} · {currentMaterial.finish}
                </span>
              </p>

              <div className="flex shrink-0 items-center gap-1 border border-white/15 bg-ink/70 p-1 backdrop-blur-md">
                <button
                  type="button"
                  onClick={handlePrevMaterial}
                  aria-label="Previous finish"
                  className="flex h-6 w-6 items-center justify-center text-chalk/65 transition-colors hover:text-chalk focus:outline-none"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                {MATERIALS.map((mat, i) => (
                  <button
                    key={mat.name}
                    type="button"
                    onClick={() => onSelectMaterial?.(i)}
                    aria-label={`${mat.name} close shot`}
                    aria-current={activeIdx === i}
                    className={`flex h-6 w-6 items-center justify-center focus:outline-none ${
                      activeIdx === i ? '' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full border transition-all duration-300 ${
                        activeIdx === i
                          ? 'scale-125 border-amber-300 bg-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.7)]'
                          : 'border-white/40 bg-white/25'
                      }`}
                    />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleNextMaterial}
                  aria-label="Next finish"
                  className="flex h-6 w-6 items-center justify-center text-chalk/65 transition-colors hover:text-chalk focus:outline-none"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------- VIEW 2: 3D THREE.JS PERSPECTIVE */}
      {mode === '3d' && (
        <div className="relative h-full w-full">
          <div ref={host3dRef} className="h-full w-full" />
          {!hasWebGL && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-chalk/70">
              WebGL is unavailable in this environment. Showing architectural preview.
            </div>
          )}
        </div>
      )}

      {/* Controls: icon-only, so the photograph stays a photograph. */}
      {!isZoomed && (
        <div className="absolute right-3 top-3 z-40 flex items-center gap-1 border border-white/15 bg-ink/70 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => {
              setMode('room')
              setZoom(true)
            }}
            aria-label="Zoom into the 1:1 close shot"
            title="Zoom into the 1:1 close shot"
            className="flex h-7 w-7 items-center justify-center text-chalk/70 transition-colors hover:bg-white/10 hover:text-chalk"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === '3d' ? 'room' : '3d')}
            aria-label="Toggle the 3D spatial perspective"
            title="Toggle the 3D spatial perspective"
            aria-pressed={mode === '3d'}
            className={cn(
              'flex h-7 w-7 items-center justify-center transition-colors',
              mode === '3d' ? 'bg-chalk text-ink' : 'text-chalk/55 hover:bg-white/10 hover:text-chalk',
            )}
          >
            <Box className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
