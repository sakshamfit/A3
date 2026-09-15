# Drop a real asset here

Anything in this folder is picked up automatically by the Atelier viewer
(`src/components/three/RoomScene.tsx` → `../room-model.ts`). Nothing to import,
nothing to configure — if the folder is empty, the procedural room stays and the
three.js loaders are never even downloaded.

| File | What it is | Where to get one |
| --- | --- | --- |
| `<name>.glb` or `<name>.gltf` | The room itself. Blender → **File → Export → glTF 2.0**, format **glTF Binary (.glb)**, *Apply Modifiers*, *Include → Selected Objects*, textures embedded. | [Khronos glTF sample models](https://github.com/KhronosGroup/glTF-Sample-Models) · [Poly Haven models](https://polyhaven.com/models) (CC0) · Sketchfab filtered to *CC0* / *CC-BY* |
| `<name>.hdr` *(optional)* | Equirectangular HDRI that lights the model. This is the single biggest realism lever — without it, PBR materials read as plastic. | [Poly Haven HDRIs](https://polyhaven.com/hdris) (CC0) — the 1k or 2k file is plenty |

Both are optional and independent: a model with no HDRI still loads, an HDRI with
no model just lights the procedural room a little differently.

## Export checklist (Blender)

- **Scale is handled for you** — the model is auto-fitted to 7 world units wide and
  dropped onto the floor. Export at 1 unit = 1 metre for a sensible camera read.
- Keep the file under ~5–10 MB. Draco geometry compression and KTX2 textures both
  work out of the box (three ships the decoders) and typically cut that by 5–10×.
- Bake or keep textures ≤ 2048². The viewer runs on phones.
- Animated exports play automatically; the first animation clip is expected.
- If your model brings its own floating finish board, set
  `KEEP_MATERIAL_BOARD = false` in `../room-model.ts` so the primitive board — the
  one wired to the DOM swatch list — steps aside.

## Licence

Assets you add here are yours to licence. CC0 needs no attribution; CC-BY does —
add the credit to the Atelier caption in `src/lib/site.ts` rather than only here.
