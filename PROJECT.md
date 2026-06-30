# Project: AI Engineer & Founder Portfolio Website

## Architecture
An asymmetrical two-column desktop-first layout that coordinates storytelling, interactive WebGL, and schematic diagrams into a cohesive "cybernetic control room" experience.
- **Left Column (45% width)**: Scrolling narrative path presenting the ventures in a bento-grid format. Includes the real-time diagnostic Terminal Console at the bottom.
- **Right Column (55% width, fixed)**: Fixed WebGL 3D Canvas rendering a GPU-accelerated particle swarm (50,000+ particles) and an SVG Blueprint Visualizer overlay.
- **Coordination**:
  - **Scroll**: Normalized via **Lenis**. **GSAP ScrollTrigger** pins the right column, transitions the WebGL particle shapes, scales/fades the bento cards, and triggers SVG blueprint morphing.
  - **Intersection Observer**: Detects the active section in the viewport to update global state (`activeVentureId`).
  - **Interactivity**: Mouse movement drives custom cursor states, card spotlight highlights, and WebGL particle repulsion. Node clicks on the SVG blueprint trigger local canvas ripples and stream detailed node-specific logs to the Terminal Console.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|--------------|--------|
| 1 | Infrastructure | Install `gsap`, `lenis`, verify baseline project compiles | None | DONE |
| 2 | Design System & Theme | Curate typography (`Syne` + `Geist`), set up color tokens in `index.css`, custom scrollbar | M1 | PLANNED |
| 3 | Smooth Scroll & Loader | Integrate Lenis + GSAP, build custom animated preloader, prevent FOUC | M2 | PLANNED |
| 4 | GPU WebGL Swarm | Upgrade `ThreeCanvas` to 50,000+ particles, write custom shaders, implement 5 morphing shapes, add curl noise | M3 | PLANNED |
| 5 | Story & Blueprint | Complete bento card showcases, implement SVG LERP morphing, connect Terminal Console stream | M4 | PLANNED |
| 6 | Micro-interactions | Spotlight card hovers, SVG Border Beams, Custom CAD Cursor states, Decrypt text animations | M5 | PLANNED |
| 7 | Final Polish & QA | Perform E2E testing, optimize load time (<3s), verify zero console errors, run Forensic Audit | M6 | PLANNED |

## Interface Contracts
### WebGL Canvas (`ThreeCanvas.tsx`)
- **Props**:
  - `scrollProgress: number` (0.0 to 1.0)
- **Uniforms**:
  - `uTransitionProgress: float` (0.0 to 4.0, representing transition between Intro -> Aetheris -> Helios -> Chronos -> Connect)
  - `uTime: float` (elapsed time for noise and size animations)
  - `uMousePos: vec2` (normalized mouse coordinates)
  - `uMouseInfluence: float` (intensity of repulsion)

### Blueprint Visualizer (`BlueprintVisualizer.tsx`)
- **Props**:
  - `activeVenture: Venture`
- **State**:
  - Interpolated node coordinates. When `activeVenture` changes, node coordinates LERP from their current position to the new layout over 0.8s.

### Terminal Console (`TerminalConsole.tsx`)
- **Props**:
  - `activeVentureId: string`
- **Behavior**:
  - Clears buffer on venture change, then streams 5-8 lines of simulated terminal logs representing the active system's telemetry.

## Code Layout
- `src/components/ThreeCanvas.tsx` — WebGL Canvas & custom shader setup
- `src/components/BlueprintVisualizer.tsx` — Morphing SVG schematic
- `src/components/TerminalConsole.tsx` — Live telemetry log stream
- `src/components/CustomCursor.tsx` — React-based custom CAD reticle
- `src/components/BackgroundGrid.tsx` — Parallax background grid lines
- `src/components/NarrativeSection.tsx` — Left column content wrapper
- `src/data/ventures.ts` — Structured venture text & blueprint data
- `src/index.css` — Global styles, typography imports, theme variables
- `src/App.tsx` — Scroll mapping, layout container, state coordination
