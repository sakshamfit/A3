import * as THREE from 'three'

/**
 * Drop-in upgrade path for the Atelier "One language, four finishes" board.
 *
 * The section ships with a procedural room built from primitives. Drop a real
 * asset into `src/components/three/models/` and the same viewer swaps it in —
 * nothing else changes, and nothing is downloaded (or bundled) when the folder
 * is empty:
 *
 *   src/components/three/models/room.glb   → the room (Blender → glTF 2.0 .glb)
 *   src/components/three/models/studio.hdr → optional HDRI environment
 *
 * The three.js loaders are imported dynamically, so GLTFLoader + companions only
 * ever reach the browser *after* a model has been detected — visitors never pay
 * for a feature that is not in use. See "Material board — real assets" in the
 * README for export settings and framing knobs.
 */

/* Build-time discovery: an empty folder yields no URL and the whole path is skipped. */
const modelFiles = import.meta.glob('./models/*.{glb,gltf}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const envFiles = import.meta.glob('./models/*.hdr', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

/** `null` until a .glb/.gltf lands in `./models/` (alphabetically first wins). */
export const ROOM_MODEL_URL: string | null = Object.values(modelFiles).sort()[0] ?? null

/** `null` until a .hdr lands in `./models/`. */
export const ROOM_ENV_URL: string | null = Object.values(envFiles).sort()[0] ?? null

/**
 * Set to false only if your .glb already contains the floating finish board —
 * otherwise the primitive board (the one wired to the DOM swatch list) stays on
 * top of the real room so the four finishes remain clickable.
 */
export const KEEP_MATERIAL_BOARD = true

export interface RoomAsset {
  scene: THREE.Group
  animations: THREE.AnimationClip[]
}

export interface FitOptions {
  /** World width the model is scaled to — the procedural room is ~7 units across. */
  width?: number
  /** Floor height the model's bounding box is dropped onto. */
  ground?: number
  /** Depth placement in the room. */
  z?: number
}

/**
 * Loads a .glb/.gltf room. Resolves to `null` when there is no asset, when the
 * file is unreadable, or when a decoder is missing — the caller keeps the
 * procedural scene and no error reaches the visitor.
 */
export async function loadRoomModel(
  renderer: THREE.WebGLRenderer,
  url: string | null = ROOM_MODEL_URL,
): Promise<RoomAsset | null> {
  if (!url) return null
  try {
    const [{ GLTFLoader }, { DRACOLoader }, { KTX2Loader }] = await Promise.all([
      import('three/examples/jsm/loaders/GLTFLoader.js'),
      import('three/examples/jsm/loaders/DRACOLoader.js'),
      import('three/examples/jsm/loaders/KTX2Loader.js'),
    ])

    /* Both decoders default to the copies that ship inside three itself, so a
       Draco-compressed or KTX2-textured .glb works with no extra setup — and
       neither is fetched unless the file actually uses them. */
    const draco = new DRACOLoader()
    const ktx2 = new KTX2Loader().detectSupport(renderer)
    const loader = new GLTFLoader()
    loader.setDRACOLoader(draco)
    loader.setKTX2Loader(ktx2)

    return await new Promise<RoomAsset | null>((resolve) => {
      loader.load(
        url,
        (gltf) => {
          draco.dispose()
          ktx2.dispose()
          resolve({ scene: gltf.scene, animations: gltf.animations })
        },
        undefined,
        () => {
          draco.dispose()
          ktx2.dispose()
          resolve(null)
        },
      )
    })
  } catch {
    return null
  }
}

/**
 * Opens an equirectangular HDRI and bakes it into a prefiltered environment map,
 * which is what makes a PBR model read as a real room instead of as plastic.
 * Resolves to `null` when there is no file.
 */
export async function loadRoomEnv(
  renderer: THREE.WebGLRenderer,
  url: string | null = ROOM_ENV_URL,
): Promise<THREE.Texture | null> {
  if (!url) return null
  try {
    const { RGBELoader } = await import('three/examples/jsm/loaders/RGBELoader.js')
    return await new Promise<THREE.Texture | null>((resolve) => {
      new RGBELoader().load(
        url,
        (texture) => {
          texture.mapping = THREE.EquirectangularReflectionMapping
          const pmrem = new THREE.PMREMGenerator(renderer)
          const env = pmrem.fromEquirectangular(texture).texture
          pmrem.dispose()
          texture.dispose()
          resolve(env)
        },
        undefined,
        () => resolve(null),
      )
    })
  } catch {
    return null
  }
}

/**
 * Fits an imported room to the viewer: re-centred on the origin, dropped onto
 * the floor plane and scaled so its width matches `width` world units.
 */
export function fitRoomModel(scene: THREE.Object3D, options: FitOptions = {}): THREE.Group {
  const { width = 7, ground = 0, z = -0.6 } = options

  const group = new THREE.Group()
  group.add(scene)

  const box = new THREE.Box3().setFromObject(scene)
  const size = new THREE.Vector3()
  const centre = new THREE.Vector3()
  box.getSize(size)
  box.getCenter(centre)

  const scale = size.x > 0.0001 ? width / size.x : 1
  scene.scale.setScalar(scale)
  scene.position.set(-centre.x * scale, ground - box.min.y * scale, z - centre.z * scale)

  group.traverse((object) => {
    const mesh = object as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.castShadow = true
    mesh.receiveShadow = true
  })

  return group
}

/** Frees the geometries and textures of an imported asset on unmount. */
export function disposeRoomAsset(root: THREE.Object3D) {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh
    mesh.geometry?.dispose()
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    materials.forEach((material) => {
      if (!material) return
      Object.values(material as unknown as Record<string, unknown>).forEach((value) => {
        if (value && (value as THREE.Texture).isTexture) (value as THREE.Texture).dispose()
      })
      material.dispose()
    })
  })
}
