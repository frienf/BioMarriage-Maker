# Organic Portfolio 3D Piece — Design Spec

**Date**: 2026-10-23
**Status**: Approved
**Project**: Biodata Maker — Portfolio Gallery Piece

---

## 1. Overview

An interactive 3D gallery piece for the portfolio section, featuring a collection of 5 organic forms that respond to scroll, hover, click, and orbit controls. Built with React Three Fiber + Drei, using built-in geometries with GPU vertex displacement for organic aesthetics.

**Aesthetic**: Organic / natural — warm neutrals, soft materials, gentle motion, dappled lighting.

---

## 2. Architecture

- **Framework**: React Three Fiber (R3F) + Drei helpers
- **State**: Zustand store for scroll progress, active object, interaction mode
- **Animation**: GSAP ScrollTrigger for scroll-driven timelines
- **Canvas**: Dedicated section (not full-screen background), `frameloop="demand"`
- **Performance**: Instanced meshes, GPU displacement shaders, `prefers-reduced-motion` support

---

## 3. Scene Composition

### 3.1 Objects (5 Organic Forms)

| Index | Geometry | Displacement | Material Character | Accent Color |
|-------|----------|--------------|-------------------|--------------|
| 0 | `IcosahedronGeometry(1.2, 3)` | Low-frequency simplex | Matte ceramic, subtle clearcoat | Terracotta `#c66b3d` |
| 1 | `TorusKnotGeometry(0.6, 0.2, 128, 32, 2, 3)` | Medium curl noise | Wax-like, transmission 0.15 | Sage `#7a9e7e` |
| 2 | `CapsuleGeometry(0.5, 1.8, 16, 32)` | Vertical wave | Translucent gel, thickness 0.8 | Cream `#f5f0e8` |
| 3 | `SphereGeometry(0.9, 48, 48)` | High-frequency detail | Polished stone, clearcoat 1.0 | Charcoal `#2d2d2d` |
| 4 | `OctahedronGeometry(1.1, 2)` | Faceted crystallize | Metallic pearl, iridescent sheen | Warm Gold `#c9a24a` |

### 3.2 Shared Material Properties

```tsx
const baseMaterial = {
  roughness: 0.45,
  metalness: 0.1,
  clearcoat: 0.3,
  clearcoatRoughness: 0.25,
  transmission: 0.1,
  thickness: 0.5,
  ior: 1.4,
  envMapIntensity: 1.2,
}
```

### 3.3 Displacement Shader (Vertex)

- **Noise**: Simplex 3D (GPU, no external texture)
- **Amplitude**: 0.15–0.35 per object (uniform)
- **Frequency**: 1.5–3.0 per object (uniform)
- **Time uniform**: Drives slow breathing animation (0.05 Hz)
- **Scroll uniform**: Morphs between 3 shape states

---

## 4. Interactions

### 4.1 Scroll-Driven Animation (Drei `ScrollControls`)

- **Pages**: 6 (intro + 5 objects + outro)
- **Damping**: 0.6
- **Per-object keyframes**:
  - Entry: `opacity 0 → 1`, `scale 0.5 → 1`, `y -5 → 0`
  - Idle: Gentle float (`y ±0.3`, 4s period)
  - Exit: `opacity 1 → 0`, `scale 1 → 0.5`, `y 0 → 5`

### 4.2 Hover Response (Raycast)

- **Trigger**: `onPointerMove` on canvas
- **Hit test**: Raycast against all 5 meshes
- **Response** (nearest hit):
  - `scale *= 1.15` (spring, 300ms)
  - `emissive = accentColor * 0.15` (fade in 200ms)
  - `clearcoat = 1.0` (temporary boost)
- **Reset**: On `onPointerLeave` or hit loss

### 4.3 Click to Explode / Expand

- **Trigger**: `onClick` on mesh
- **Behavior**:
  1. Disable `OrbitControls`
  2. Animate selected object to center (`position [0,0,0]`, `scale 2.5`)
  3. Fade other objects (`opacity 0.15`)
  4. Show wireframe overlay (`WireframeGeometry` + `Line2`)
  5. Open side panel with object metadata (name, material, "project" link)
- **Close**: Click backdrop or `Esc` → reverse animation, re-enable orbit

### 4.4 Orbit Controls

```tsx
<OrbitControls
  makeDefault
  enableDamping
  dampingFactor={0.05}
  minDistance={3}
  maxDistance={15}
  maxPolarAngle={Math.PI / 2 - 0.1}
  autoRotate={!isInteracting}
  autoRotateSpeed={0.3}
/>
```

- **Auto-rotate**: Pauses on any user interaction (hover, scroll, click)
- **Resume**: 3s after last interaction

---

## 5. Lighting & Shadows

| Light | Config | Purpose |
|-------|--------|---------|
| `<Environment preset="forest" />` | HDRI background | Organic ambient + reflections |
| `<directionalLight>` | pos `[5, 10, 7]`, intensity 1.8, `castShadow` | Key light, sharp shadows |
| `<directionalLight>` | pos `[-5, 5, -5]`, intensity 0.6, color `#8fb3ae` | Cool fill |
| `<pointLight>` | pos `[0, 3, 5]`, intensity 0.8, color `#fff8e7`, decay 2 | Catchlights |
| `<ContactShadows />` | opacity 0.4, scale 8, blur 2, resolution 256 | Ground contact |

**Shadow Map**: `PCFSoftShadowMap`, 2048×2048, bias -0.001

---

## 6. Camera

- **Type**: `PerspectiveCamera`
- **FOV**: 50°
- **Position**: `[0, 1.5, 8]`
- **Near/Far**: 0.1 / 50
- **Controlled by**: `OrbitControls` + `ScrollControls` (dolly on scroll)

---

## 7. Responsive & Accessibility

- **Canvas size**: Full section width, height `min(60vh, 500px)`
- **DPR**: `[1, 2]` (capped at 2×)
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables:
  - Auto-rotation
  - Scroll-driven morph/float
  - Hover spring (instant scale)
  - Click explode (instant expand)
- **Fallback**: Static `<picture>` with WebP renders of each object at 3 angles

---

## 8. Performance Budget

| Metric | Target |
|--------|--------|
| Draw calls | ≤ 12 (5 objects + shadows + environment) |
| Triangle count | ≤ 45k total |
| GPU memory | ≤ 80 MB |
| Frame time (desktop) | ≤ 8 ms (120 fps headroom) |
| Frame time (mobile) | ≤ 16 ms (60 fps) |
| Initial load | ≤ 200 KB gzipped (code + shaders) |

---

## 9. File Structure

```
src/
  components/
    portfolio-3d/
      OrganicGallery.tsx          # Main canvas wrapper
      OrganicForm.tsx             # Single form component
      OrganicFormMaterial.tsx     # Material + displacement shader
      ScrollController.tsx        # ScrollControls + progress store
      InteractionController.tsx   # Hover/click/raycast logic
      InfoPanel.tsx               # Click-expand side panel
      useOrganicForms.ts          # Zustand store
      shaders/
        displacement.vert.glsl    # Vertex displacement
      index.ts                    # Exports
  app/
    [locale]/
      portfolio/
        page.tsx                  # Portfolio page with gallery section
```

---

## 10. Dependencies (Already in package.json)

- `@react-three/fiber` ^9.8.2
- `@react-three/drei` ^10.7.9
- `three` ^0.186.1
- `gsap` ^3.15.0
- `zustand` ^4.x (already used in project)
- `@gsap/react` ^2.1.2

---

## 11. Implementation Order

1. **Shader & Material** — Displacement vertex shader + physical material
2. **Single Form Component** — Geometry + material + hover/click handlers
3. **Gallery Scene** — 5 forms positioned, lighting, environment, shadows
4. **Scroll Integration** — `ScrollControls` + GSAP timelines per object
5. **Click Expand** — State machine, wireframe overlay, info panel
6. **Orbit Controls** — Config + auto-rotate pause/resume logic
7. **Reduced Motion** — Media query hook + feature flags
8. **Fallback Images** — Render static views, add `<picture>` fallback
9. **Portfolio Page Integration** — Add section to portfolio page

---

## 12. Success Criteria

- [ ] All 5 forms render with unique organic displacement
- [ ] Scroll animates each form in/out smoothly
- [ ] Hover lifts + glows nearest form (< 100ms response)
- [ ] Click expands form to center with wireframe + panel
- [ ] Orbit controls work, auto-rotate pauses on interaction
- [ ] `prefers-reduced-motion` disables all motion cleanly
- [ ] 60 fps on 5-year-old mobile (iPhone 12 / Pixel 5 class)
- [ ] Fallback images display when WebGL unavailable
- [ ] No console errors or warnings
- [ ] TypeScript strict mode passes