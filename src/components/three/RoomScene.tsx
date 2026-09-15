import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { MATERIALS } from '../../lib/site'
import { prefersReducedMotion } from '../../lib/gsap'
import {
  KEEP_MATERIAL_BOARD,
  ROOM_ENV_URL,
  ROOM_MODEL_URL,
  disposeRoomAsset,
  fitRoomModel,
  loadRoomEnv,
  loadRoomModel,
} from './room-model'

interface RoomSceneProps {
  /** Index of the material currently highlighted in the DOM list. */
  activeMaterial: number | null
  className?: string
}

/**
 * Three.js "material room" — an abstract corner of an A3 interior lit through a
 * single aperture, with a floating material board.
 *
 * - the camera dollies with the section's scroll progress (driven by a ref that
 *   ScrollTrigger writes into, so no per-frame React work)
 * - the board leans with the pointer
 * - the plane matching `activeMaterial` lifts and glows, so the DOM swatch list
 *   and the 3D scene stay in sync (the "three UI" layer)
 * - rendering pauses when the canvas leaves the viewport, and falls back to a
 *   static panel when WebGL is unavailable
 */
export default function RoomScene({ activeMaterial, className = '' }: RoomSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const activeRef = useRef<number | null>(activeMaterial)
  const progressRef = useRef(0)
  const [available, setAvailable] = useState(true)
  /** 'model' once a real .glb sits in ./models/, 'procedural' when it does not. */
  const [assetState, setAssetState] = useState<'probing' | 'model' | 'procedural'>('probing')

  useEffect(() => {
    activeRef.current = activeMaterial
  }, [activeMaterial])

  /* Scroll progress feeds the camera dolly (0 = far, 1 = close). */
  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const rect = host.getBoundingClientRect()
        const total = rect.height + window.innerHeight
        const travelled = window.innerHeight - rect.top
        progressRef.current = Math.min(1, Math.max(0, travelled / total))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    } catch {
      setAvailable(false)
      return
    }
    if (!renderer.getContext()) {
      setAvailable(false)
      return
    }

    const reduced = prefersReducedMotion()

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(host.clientWidth || 1, host.clientHeight || 1, false)
    renderer.setClearColor(0x111111, 1)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    host.appendChild(renderer.domElement)

    /* ------------------------------------------------------------- scene */
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111111)
    scene.fog = new THREE.Fog(0x111111, 9, 22)

    const camera = new THREE.PerspectiveCamera(
      38,
      (host.clientWidth || 1) / (host.clientHeight || 1),
      0.1,
      60,
    )
    camera.position.set(4.9, 2.85, 7.2)
    camera.lookAt(0, 1.05, 0)

    const room = new THREE.Group()
    scene.add(room)

    /* Every primitive-built part of the room lives in one group, so a real
       .glb dropped into ./models/ can take its place in a single swap. */
    const procedural = new THREE.Group()
    room.add(procedural)

    const mat = (color: number, roughness: number, metalness = 0.04) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness })

    /* floor + walls */
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(22, 22), mat(0x2c2825, 0.62))
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    procedural.add(floor)

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(22, 9), mat(0x1d1a18, 0.95))
    backWall.position.set(0, 4.5, -5)
    backWall.receiveShadow = true
    procedural.add(backWall)

    const sideWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 9), mat(0x221f1c, 0.95))
    sideWall.position.set(-5.4, 4.5, 0)
    sideWall.rotation.y = Math.PI / 2
    sideWall.receiveShadow = true
    procedural.add(sideWall)

    /* aperture — the only light source in the room */
    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 4.4),
      new THREE.MeshBasicMaterial({ color: 0xffe6bd }),
    )
    glow.position.set(1.9, 2.9, -4.94)
    procedural.add(glow)

    const frameMaterial = mat(0x141414, 0.5, 0.35)
    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.1, 0.12), frameMaterial)
    frameTop.position.set(1.9, 5.15, -4.9)
    const frameBottom = frameTop.clone()
    frameBottom.position.y = 0.65
    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.6, 0.12), frameMaterial)
    frameLeft.position.set(0.15, 2.9, -4.9)
    const frameRight = frameLeft.clone()
    frameRight.position.x = 3.65
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.06, 4.6, 0.08), frameMaterial)
    mullion.position.set(1.9, 2.9, -4.9)
    procedural.add(frameTop, frameBottom, frameLeft, frameRight, mullion)

    /* furniture silhouettes */
    const add = (
      mesh: THREE.Mesh,
      position: [number, number, number] = [0, 0, 0],
      rotation: [number, number, number] = [0, 0, 0],
    ) => {
      mesh.position.set(...position)
      mesh.rotation.set(...rotation)
      mesh.castShadow = true
      mesh.receiveShadow = true
      procedural.add(mesh)
      return mesh
    }

    // sofa
    add(new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.42, 1.15), mat(0xb7a58d, 0.92)), [0.35, 0.28, 1.15])
    add(new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.62, 0.24), mat(0xa8957c, 0.92)), [0.35, 0.6, 0.63])
    add(new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.44, 1.15), mat(0x9c8a72, 0.92)), [-1.32, 0.52, 1.15])
    add(new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.44, 1.15), mat(0x9c8a72, 0.92)), [2.02, 0.52, 1.15])

    // coffee table — stone slab on a plinth
    add(new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 0.85), mat(0xd8d2c6, 0.42)), [-0.15, 0.44, 1.75])
    add(new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.5), mat(0xc9c2b4, 0.6)), [-0.15, 0.2, 1.75])

    // art panel leaning on the back wall
    add(new THREE.Mesh(new THREE.BoxGeometry(1.7, 2.3, 0.06), mat(0x3b3229, 0.8)), [-2.1, 1.45, -4.85], [0, 0, 0.02])

    // plinth + vessel
    add(new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.35, 0.55), mat(0x6b5a48, 0.85)), [2.75, 0.68, 2.5])
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.52, 28), mat(0xa98f74, 0.85))
    add(pot, [2.75, 1.62, 2.5])
    const foliage = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.52, 1),
      new THREE.MeshStandardMaterial({ color: 0x4d5a41, roughness: 1, flatShading: true }),
    )
    add(foliage, [2.75, 2.35, 2.5])

    /* floating material board — one plane per finish */
    const board = new THREE.Group()
    board.position.set(-0.4, 1.85, 0.2)
    room.add(board)

    const boardMeshes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>[] = []
    MATERIALS.forEach((material, i) => {
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.98, 1.32),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(material.swatch),
          roughness: material.name === 'Black Stone' ? 0.45 : 0.72,
          metalness: material.name === 'Smoked Oak' ? 0.12 : 0.05,
          emissive: new THREE.Color(material.swatch),
          emissiveIntensity: 0,
        }),
      )
      plane.position.set((i - (MATERIALS.length - 1) / 2) * 1.16, 0, (i % 2 === 0 ? 0.12 : -0.12))
      plane.rotation.y = (i - (MATERIALS.length - 1) / 2) * -0.13
      plane.castShadow = true
      board.add(plane)
      boardMeshes.push(plane)
    })

    /* warm sun patch on the floor + a soft shaft through the aperture */
    const gradientTexture = (() => {
      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 128
      const ctx = canvas.getContext('2d')
      if (ctx) {
        const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 62)
        g.addColorStop(0, 'rgba(255, 226, 176, 0.95)')
        g.addColorStop(0.55, 'rgba(255, 210, 150, 0.28)')
        g.addColorStop(1, 'rgba(255, 200, 140, 0)')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, 128, 128)
      }
      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace
      return texture
    })()

    const sunPatch = new THREE.Mesh(
      new THREE.PlaneGeometry(6.4, 5.2),
      new THREE.MeshBasicMaterial({
        map: gradientTexture,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    sunPatch.rotation.x = -Math.PI / 2
    sunPatch.rotation.z = -0.42
    sunPatch.position.set(0.2, 0.012, 1.1)
    procedural.add(sunPatch)

    /* --------------------------------------------------------- lighting */
    scene.add(new THREE.HemisphereLight(0x8ea3b8, 0x151312, 0.42))

    const key = new THREE.DirectionalLight(0xffd9a8, 2.6)
    key.position.set(3.2, 4.4, -3.2)
    key.target.position.set(-0.6, 0.4, 1.4)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.camera.near = 0.5
    key.shadow.camera.far = 22
    key.shadow.camera.left = -7
    key.shadow.camera.right = 7
    key.shadow.camera.top = 7
    key.shadow.camera.bottom = -7
    key.shadow.bias = -0.0008
    key.shadow.radius = 3
    scene.add(key, key.target)

    const fill = new THREE.PointLight(0xffc98a, 12, 12, 2)
    fill.position.set(-1.4, 2.6, 1.2)
    scene.add(fill)

    /* ------------------------------------------------------ interaction */
    const pointer = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }

    const onPointerMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      target.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
    }
    const onPointerLeave = () => {
      target.x = 0
      target.y = 0
    }
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerleave', onPointerLeave)

    /* Only render while the canvas is on screen. */
    let visible = true
    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              for (const entry of entries) visible = entry.isIntersecting
            },
            { rootMargin: '120px' },
          )
        : null
    observer?.observe(host)

    const resize = () => {
      const w = host.clientWidth || 1
      const h = host.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    resizeObserver?.observe(host)

    /* ------------------------------------------------------------- loop */
    const clock = new THREE.Clock()
    const mixers: THREE.AnimationMixer[] = []
    let raf = 0
    const highlight = new THREE.Color(0xffcf95)
    const swatchColors = MATERIALS.map((material) => new THREE.Color(material.swatch))

    const render = (time: number) => {
      const progress = progressRef.current

      mixers.forEach((mixer) => mixer.update(0.016))

      pointer.x += (target.x - pointer.x) * 0.06
      pointer.y += (target.y - pointer.y) * 0.06

      room.rotation.y = pointer.x * 0.12
      room.rotation.x = pointer.y * 0.04

      camera.position.z = 7.2 - progress * 3.1
      camera.position.y = 2.85 - progress * 0.5
      camera.lookAt(0, 1.05 - progress * 0.15, 0)

      board.position.y = 1.85 + Math.sin(time * 0.7) * 0.06
      board.rotation.y = pointer.x * 0.18 + Math.sin(time * 0.28) * 0.05

      boardMeshes.forEach((plane, i) => {
        const active = activeRef.current === i
        const lift = active ? 0.16 : 0
        const liftTarget = 1 + lift
        plane.position.y += (liftTarget - plane.position.y) * 0.09
        const emissiveTarget = active ? 0.34 : 0
        plane.material.emissiveIntensity +=
          (emissiveTarget - plane.material.emissiveIntensity) * 0.09
        plane.material.emissive.lerp(active ? highlight : swatchColors[i], 0.1)
        plane.rotation.z = Math.sin(time * 0.5 + i) * 0.012
      })

      sunPatch.material.opacity = 0.34 + Math.sin(time * 0.4) * 0.035

      renderer.render(scene, camera)
    }

    /* ------------------------------------------------- real-asset upgrade */
    let disposed = false

    void (async () => {
      if (!ROOM_MODEL_URL && !ROOM_ENV_URL) {
        setAssetState('procedural')
        return
      }
      const [model, env] = await Promise.all([
        loadRoomModel(renderer, ROOM_MODEL_URL),
        loadRoomEnv(renderer, ROOM_ENV_URL),
      ])
      if (disposed) {
        if (model) disposeRoomAsset(model.scene)
        env?.dispose()
        return
      }
      if (env) scene.environment = env
      if (!model) {
        setAssetState('procedural')
        return
      }
      procedural.visible = false
      if (!KEEP_MATERIAL_BOARD) board.visible = false
      room.add(fitRoomModel(model.scene))
      if (model.animations.length) {
        const mixer = new THREE.AnimationMixer(model.scene)
        model.animations.forEach((clip) => mixer.clipAction(clip).play())
        mixers.push(mixer)
      }
      setAssetState('model')
      if (reduced) render(0)
    })()

    if (reduced) {
      render(0)
    } else {
      const loop = () => {
        raf = requestAnimationFrame(loop)
        if (!visible || document.hidden) return
        render(clock.getElapsedTime())
      }
      raf = requestAnimationFrame(loop)
    }

    /* ---------------------------------------------------------- cleanup */
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      observer?.disconnect()
      resizeObserver?.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)

      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(material)) material.forEach((m) => m.dispose())
        else material?.dispose()
      })
      gradientTexture.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div
        ref={hostRef}
        aria-hidden="true"
        className={`h-full w-full ${available ? '' : 'opacity-0'}`}
      />

      {!available && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 62% 22%, #3a3129 0%, #1b1815 55%, #111111 100%)',
          }}
        />
      )}

      {/* DOM overlay labels that sit above the WebGL layer */}
      <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col justify-between p-6 sm:p-8">
        <div className="flex items-start justify-between gap-6">
          <p className="lbl text-chalk/45">Material board · live</p>
          <p className="lbl text-chalk/45">
            {!available ? 'Static' : assetState === 'model' ? 'Live model' : 'WebGL'}
          </p>
        </div>
        <p className="lbl max-w-[22ch] text-chalk/40">
          Drag your cursor across the room — the board follows, and the scroll closes the camera.
        </p>
      </div>
    </div>
  )
}
