# Design Brief: High-Fidelity Technical Portfolio for an AI Systems Architect & Founder

This design brief establishes the creative direction, visual system, and technical specifications for an award-winning personal portfolio website. The objective is to combine editorial-grade layout with high-performance interactive WebGL and schematic visualization, creating a "control room" experience that reflects the subject's work in multi-agent swarms, vector retrieval, and spatio-temporal deep learning.

---

## 1. Creative Direction & Visual Concept
* **Visual Concept**: *The Blueprint of Swarms* or *Digital Cybernetics*.
* **Core Philosophy**: Avoid generic glowing gradients and overused neon-wave aesthetics. Instead, adopt a clean, high-fidelity CAD/schematic aesthetic. The portfolio should feel like a developer-focused IDE or a hardware diagnostic console, showcasing the "raw machinery" behind complex AI systems.
* **Layout Structure**: An asymmetrical two-column layout. The left column (45% width) acts as the scrolling narrative path, presenting the ventures in a bento-grid format. The right column (55% width) is a fixed viewport containing the interactive 3D WebGL Canvas and the SVG Blueprint Visualizer, serving as the visual "proof of work."

---

## 2. Typography & Type Scale
To establish a premium, tech-forward, yet highly legible editorial feel, we transition from standard system fonts to a curated typography system:

| Role | Font Family | Source | Rationale |
| :--- | :--- | :--- | :--- |
| **Display (Headers)** | `Syne` (Weights: 700, 800) <br> *Alternative: Clash Display* | Google Fonts | Wide, geometric sans-serif that feels avant-garde, structural, and premium. Perfect for large-scale typography. |
| **Body / UI** | `Geist Sans` (Weights: 300, 400, 500) <br> *Alternative: Inter* | Vercel / Google | Monospaced-influence in its tracking, designed for clean developer interfaces. Extremely legible at small sizes. |
| **Monospace / Data** | `Geist Mono` (Weights: 400, 500) <br> *Alternative: JetBrains Mono* | Vercel / Google | Clean, high-performance monospace for terminal consoles, telemetry reads, and blueprint node labels. |

### CSS Implementation
```css
:root {
  --font-display: 'Syne', sans-serif;
  --font-sans: 'Geist Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'Geist Mono', monospace;
}

h1, h2, h3 {
  font-family: var(--font-display);
  letter-spacing: -0.03em;
}

body, p {
  font-family: var(--font-sans);
  letter-spacing: -0.01em;
}

.code-text, .telemetry, .terminal {
  font-family: var(--font-mono);
  letter-spacing: -0.02em;
}
```

---

## 3. Color Palette & Dark Theme System
A restricted, high-contrast palette representing a "deep space dark theme." By using only 2-3 accents, we maintain visual sophistication and avoid the "rainbow" look common in lower-tier portfolios.

```
+-------------------------------------------------------------+
|  Base Background: Deep Void Black (#030303)                 |
+-------------------------------------------------------------+
|  Card Background: Slate-Tinted Charcoal (#08090C, 90% Opacity) |
+-------------------------------------------------------------+
|  Accents:                                                   |
|  [Cyan #00F0FF]   [Indigo #6366F1]   [Violet #A855F7]        |
+-------------------------------------------------------------+
```

### Color Token System
* **`--bg-primary`**: `#030303` — Absolute void black to maximize OLED contrast and hide canvas edges.
* **`--bg-secondary`**: `#08090C` — Slate-tinted charcoal for cards and panels.
* **`--bg-tertiary`**: `rgba(11, 13, 18, 0.5)` — Glassmorphic panels with `backdrop-filter: blur(12px)`.
* **`--border-color`**: `rgba(0, 240, 255, 0.08)` — Delicate cyan border, maintaining a schematic feel.
* **`--accent-cyan`**: `#00F0FF` — Primary action, active nodes, data packets, terminal prompts. (Represents *Helios Engine* / speed).
* **`--accent-indigo`**: `#6366F1` — Secondary paths, passive node connections, ambient light. (Represents *Chronos Predict* / time-series).
* **`--accent-purple`**: `#A855F7` — Swarm coordinator nodes, evaluator feedback loops. (Represents *Aetheris AI* / intelligence).
* **`--color-text-primary`**: `#F3F4F6` — Crisp off-white.
* **`--color-text-secondary`**: `#9CA3AF` — Medium gray for descriptions.
* **`--color-text-muted`**: `#6B7280` — Dark gray for background metrics and telemetry.

---

## 4. Scroll & Transition Strategy
To create a buttery, immersive storytelling flow, we will integrate **Lenis** and **GSAP (GreenSock Animation Platform)**.

### A. Smooth Scroll (Lenis)
* **Goal**: Normalize scroll physics across trackpads, mouse wheels, and mobile touch inputs.
* **Implementation**: Instantiate Lenis globally in `App.tsx` and sync it with GSAP’s `ScrollTrigger`. This ensures that animations triggered by scrolling feel weighted and organic rather than instantaneous and jerky.

### B. GSAP ScrollTrigger Integration
Instead of relying on a simple React window scroll listener (which causes layout thrashing and stuttering), we will use GSAP to bind scroll progress to the WebGL Canvas:
1. **Pinning**: Pin the right column (`.right-column`) using GSAP `ScrollTrigger` so it remains completely stationary while the left column scrolls.
2. **WebGL Morphing**: Map the scroll progress of each venture section directly to the morphing interpolation factor of the 3D particles.
3. **Bento Card Scaling**: As each bento card enters the center of the viewport:
   * Scale it from `0.98` to `1.01`.
   * Increase its opacity from `0.45` to `1.0`.
   * Trigger its internal **Border Beam** animation.
   * Fade out the previous card.

---

## 5. GPU-Accelerated 3D Canvas Experience
The current `ThreeCanvas` performs particle interpolation on the CPU (for 2,000 points). To achieve award-winning quality, we must scale the particle count to **50,000+** and move all calculations to the GPU using a **Custom Shader Material**.

### A. Shader-Based Morphing Architecture
Instead of modifying the `position` attribute array in JavaScript every frame, we will upload the coordinate sets for all 5 shapes to the GPU as custom attributes and interpolate between them inside a custom Vertex Shader.

#### Vertex Shader (`particle.vertex.glsl`)
```glsl
uniform float uTransitionProgress; // 0.0 to 4.0 representing the active section
uniform float uTime;
uniform float uMouseInfluence;
uniform vec2 uMousePos;

attribute vec3 positionIntro;
attribute vec3 positionAetheris;
attribute vec3 positionHelios;
attribute vec3 positionChronos;
attribute vec3 positionConnect;
attribute vec3 aRandomNoise;

varying vec3 vColor;
varying float vAlpha;

// Simplex/Curl Noise Helper Functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
// ... (rest of curl noise math for GPU turbulence)

void main() {
  vec3 targetPos = vec3(0.0);
  
  // Interpolate between the shapes based on uTransitionProgress
  if (uTransitionProgress <= 1.0) {
    targetPos = mix(positionIntro, positionAetheris, uTransitionProgress);
  } else if (uTransitionProgress <= 2.0) {
    targetPos = mix(positionAetheris, positionHelios, uTransitionProgress - 1.0);
  } else if (uTransitionProgress <= 3.0) {
    targetPos = mix(positionHelios, positionChronos, uTransitionProgress - 2.0);
  } else {
    targetPos = mix(positionChronos, positionConnect, uTransitionProgress - 3.0);
  }
  
  // Apply dynamic Curl Noise to simulate fluid movement (always active but scales on scroll)
  vec3 noise = snoise(targetPos * 0.02 + uTime * 0.1) * aRandomNoise * 1.5;
  targetPos += noise;
  
  // Mouse Interaction: Push particles away based on proximity
  float dist = distance(targetPos.xy, uMousePos * 50.0);
  if (dist < 20.0) {
    vec2 dir = normalize(targetPos.xy - uMousePos * 50.0);
    float force = (1.0 - dist / 20.0) * uMouseInfluence * 8.0;
    targetPos.xy += dir * force;
  }
  
  vec4 mvPosition = modelViewMatrix * vec4(targetPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  
  // Attenuate size based on depth
  gl_PointSize = (8.0 / -mvPosition.z) * (1.0 + 0.5 * sin(uTime * 2.0 + aRandomNoise.x * 10.0));
  
  // Pass color and alpha to Fragment Shader
  vColor = color;
  vAlpha = 1.0 - (dist / 100.0); // fade near edges
}
```

#### Fragment Shader (`particle.fragment.glsl`)
```glsl
varying vec3 vColor;
varying float vAlpha;
uniform sampler2D uParticleTexture;

void main() {
  // Use custom texture and apply vertex color
  vec4 texColor = texture2D(uParticleTexture, gl_PointCoord);
  gl_FragColor = vec4(vColor, vAlpha * texColor.a * 0.85);
}
```

### B. Shape-Specific Morphing Geometries
1. **Intro (Torus)**: Represents the default state of the system—organized, cyclical, and balanced.
2. **Aetheris AI (Decentralized Brain Lobe)**: The torus collapses and expands into two distinct, undulating lobes of particles, symbolizing decentralized nodes in a neural swarm.
3. **Helios Engine (Cylindrical Index)**: Particles snap into a rigid, highly structured cylinder with distinct vertical bands that rotate at varying speeds. This represents database columns, shards, and vector indexing layers.
4. **Chronos Predict (Spatio-Temporal Grid)**: The cylinder flattens out into an undulating 2D landscape grid. Waves of light ripple across it, representing time-series telemetry flowing through a GNN.
5. **Connect (Double Orbital Ring)**: The grid collapses into a dense central sphere surrounded by two interlocking, high-speed orbital rings, representing a secure gateway connection.

---

## 6. 21st.dev Components & Micro-interactions
To create a high-fidelity feel, we will implement several micro-interactions inspired by top-tier modern components (similar to Magic UI and Aceternity UI).

### A. Spotlight Card Hover (Magic UI)
* **Behavior**: When the cursor hovers over a Bento Card, a subtle radial gradient (Spotlight) follows the mouse, revealing a faint, high-density grid background underneath and lighting up the card's border.
* **Implementation**: Write a React wrapper component that tracks relative mouse position `(x, y)` and sets CSS variables `--mouse-x` and `--mouse-y` on the card container, which are read by a CSS `radial-gradient` background.

### B. Border Beam (Magic UI)
* **Behavior**: A thin, glowing beam of light moves around the border of the active bento card.
* **Implementation**: We will enhance the current CSS `@property` implementation by adding an SVG path outline that matches the card's rounded corners exactly. Using GSAP, we can animate the `strokeDashoffset` of this path, which is much more performant than conic gradients on older GPUs.

### C. Custom CAD Cursor
* **Behavior**: The cursor is hidden, replaced by a custom React-based cursor with multiple states:
  1. **Default State**: A small, clean 4px cyan dot.
  2. **Interactive Hover (Buttons, Links, Nodes)**: The dot expands into a 24px circular target reticle with crosshairs. The crosshairs rotate slightly, and a tiny readout in monospace text appears next to it, indicating the action (e.g., `[SYS: DECRYPT]` or `[NODE: SELECT]`).
  3. **3D Canvas Hover**: The cursor displays the simulated 3D coordinates `(X, Y)` in real time.

### D. Text Reveal / Decrypt Animation
* **Behavior**: When a section becomes active, its title (e.g., `HELIOS ENGINE`) undergoes a "matrix decrypt" transition. Random characters (cyphers, numbers, and hex codes) rapidly cycle before settling on the correct letters from left to right over 0.8 seconds.
* **Implementation**: A custom React hook or a GSAP text scrambler plugin that interpolates string values.

---

## 7. Integrated Storytelling Layout & UX Flow
The core value of the portfolio is the tight integration between the **Narrative (Left)**, **Canvas (Right)**, and **Terminal (Bottom Left)**.

```
+-------------------------------------------------------------+
|                        HEADER OVERLAY                       |
| [SYS_MODE: HELIOS_BLUEPRINT]                 [STATUS: OK]   |
+------------------------------------+------------------------+
|                                    |                        |
|                                    |   STIKY 3D VIEWPORT    |
|   SCROLLING NARRATIVE COLUMN       |                        |
|                                    |   +----------------+   |
|   +----------------------------+   |   |   3D Particle  |   |
|   | Bento Card: Helios Engine  |   |   |   Swarm (GPU)  |   |
|   | - Role & Period            |   |   +----------------+   |
|   | - Core Narrative           |   |                        |
|   | - Metrics Grid             |   |   +----------------+   |
|   | - Tech Stack Badges        |   |   | SVG Blueprint  |   |
|   +----------------------------+   |   | Visualizer     |   |
|                                    |   +----------------+   |
|                                    |                        |
+------------------------------------+------------------------+
| TERMINAL CONSOLE STREAM                                     |
| [10:43:12] HELIOS: CUDA Search initiated...                  |
+-------------------------------------------------------------+
```

### Scroll & Selection Interaction Loop
1. **User Scrolls**: As the user scrolls into a new venture (e.g., *Helios Engine*):
   * The left bento card highlights, and its **Border Beam** activates.
   * The WebGL Canvas morphs the particle swarm from the *Aetheris* brain shape into the *Helios* cylinder.
   * The `BlueprintVisualizer` receives the new venture object. The SVG nodes smoothly slide (using LERP) from their old coordinate layout into the new database/storage cluster layout, and their connections fade in/out.
   * The `TerminalConsole` clears its previous buffer and streams 5 lines of real-time diagnostic logs simulating the operations of the Helios Engine (e.g., indexing speeds, PQ compression logs).
2. **User Clicks a Blueprint Node**: 
   * If the user clicks on the `hnsw` node in the Helios blueprint, a ripple wave is emitted from that node's coordinates.
   * The custom shader on the WebGL Canvas increases its `uMouseInfluence` at that coordinate, causing the 3D particles in that region to pulse.
   * The `TerminalConsole` prints a detailed status report for that specific node (e.g., `[SYS] Querying HNSW Graph: 1.2B vectors, capacity optimal.`).
   * A detailed description card fades in at the bottom of the blueprint overlay.

This multi-sensory feedback loop ensures the portfolio feels like a living, breathing software system rather than a static resume.
