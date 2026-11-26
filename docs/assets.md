# Triad Arena — Asset & Licensing Inventory

This document tracks all visual, media, and audiovisual assets used in the Triad Arena project, their generation mechanism, licenses, and technical specifications as mandated by Section 14.9 of the Master Build Specification.

---

## 1. Procedural Media & WebGL Visuals

### A. Hero Interactive 3D Canvas
- **Technology**: Native HTML5 Canvas 2D / WebGL procedural raycasting with mathematical vertex projection.
- **Source**: 100% original, procedurally calculated in `HeroCanvas.tsx`.
- **License**: MIT (Part of Triad Arena codebase).
- **Specs**:
  - Rock: Faceted icosahedron projection with electric blue specular rim light (`#2563EB`).
  - Paper: Translucent folded holographic parchment with cyan rim light (`#00F0FF`).
  - Scissors: Twin counter-crossing neon laser blades with magenta rim light (`#EC4899`).
  - Performance: Uses `requestAnimationFrame` with dirty-rect optimization; automatically throttled/paused via `IntersectionObserver` when scrolled out of viewport.

---

## 2. Sound & Audio Design

### A. Procedural Web Audio Engine (`sound.ts`)
- **Technology**: Native Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`).
- **Source**: 100% procedural waveform synthesis in `client/src/lib/sound.ts`.
- **License**: MIT.
- **Audio Files Loaded**: 0 KB (Zero external MP3/WAV/OGG downloads; synthesizes clicks, clashes, locks, and fanfares mathematically in real-time).

---

## 3. Typography

- **Orbitron** (Display Font): Google Fonts — SIL Open Font License 1.1.
- **Inter** (UI Font): Google Fonts — SIL Open Font License 1.1.
- **JetBrains Mono** (Stats Font): Google Fonts — Apache License 2.0.
- All fonts loaded with `font-display: swap` to prevent FOIT (Flash of Invisible Text) and ensure LCP < 2.5s.

---

## 4. Icons & Vectors

- **Lucide React Icons**: Lucide Project — ISC License.
- **Triad Crest Vector**: Custom SVG in `Navbar.tsx` and `Preloader.tsx` (MIT).

---

## 5. Sample Media Placeholders

- Avatar presets in `ProfilePage.tsx`: High-resolution Unsplash portraits with Unsplash License (Free commercial & personal use).
