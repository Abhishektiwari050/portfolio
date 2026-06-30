# Infrastructure Analysis: Portfolio Website (Milestone 1)

## Executive Summary
The portfolio codebase is currently built on a modern stack comprising **React 19.2**, **Vite 8.1**, **TypeScript 6.0**, and **Three.js 0.185**. To support the upcoming milestones, we recommend installing `gsap`, `lenis`, and `@lenis/react` for smooth scrolling, and leveraging Vite's built-in `?raw` import query for GLSL shaders to avoid unnecessary plugins. For the 50,000+ particle swarm in Milestone 4, vanilla Three.js (already implemented) is highly recommended over React Three Fiber (R3F) to eliminate React 19 peer dependency risks and maximize GPU rendering performance.

---

## 1. Current Dependency Verification

Based on `package.json` and `package-lock.json`, the following core dependencies are currently installed:

| Dependency | Package.json Version | Locked Version in Lockfile | Category |
|---|---|---|---|
| `react` | `^19.2.7` | `19.2.7` | Core |
| `react-dom` | `^19.2.7` | `19.2.7` | Core |
| `three` | `^0.185.0` | `0.185.0` | 3D Graphics |
| `lucide-react` | `^1.22.0` | `1.22.0` | Icons |
| `@types/react` | `^19.2.17` | `19.2.17` | Dev Dependency (Types) |
| `@types/react-dom` | `^19.2.3` | `19.2.3` | Dev Dependency (Types) |
| `@types/three` | `^0.185.0` | `0.185.0` | Dev Dependency (Types) |
| `@vitejs/plugin-react` | `^6.0.2` | `6.0.3` | Dev Dependency (Vite Plugin) |
| `typescript` | `~6.0.2` | `6.0.2` | Dev Dependency (Compiler) |
| `vite` | `^8.1.0` | `8.1.0` | Dev Dependency (Bundler) |
| `oxlint` | `^1.69.0` | `1.71.0` | Dev Dependency (Linter) |

### Key Observations:
- **React 19** is active. Any additional React-reliant packages (like R3F, Drei, or `@lenis/react`) must either support React 19 natively or be installed using `--legacy-peer-deps` to bypass strict peer dependency checks.
- **Three.js v0.185.0** is installed. Types are aligned.
- **Vite 8.1** and **TypeScript 6.0** are in use, representing an extremely modern and fast build setup.

---

## 2. Smooth Scroll Infrastructure (GSAP & Lenis)

To implement the asymmetrical scroll coordination, we require GSAP (for scroll-linked animations) and Lenis (for smooth, normalized kinetic scrolling).

### Recommended Packages
1. **`gsap` (version `^3.12.5`)**
   - *Role*: Core animation engine, specifically utilizing the `ScrollTrigger` plugin.
   - *React 19 Compatibility*: Fully compatible. GSAP is framework-agnostic and has no direct React peer dependencies.
2. **`lenis` (version `^1.1.18`)**
   - *Role*: Core smooth scrolling library.
   - *React 19 Compatibility*: Fully compatible.
3. **`@lenis/react` (version `^1.1.18`)**
   - *Role*: React wrapper providing the `<ReactLenis>` provider and `useLenis` hook.
   - *React 19 Compatibility*: Compatible, but may require `--legacy-peer-deps` during installation if its internal `package.json` peer dependencies have not been formally bumped to React 19.

### Implementation Strategy
In `src/App.tsx`, wrap the application in `<ReactLenis root>` and coordinate with GSAP's `ScrollTrigger` so that Lenis updates GSAP on every scroll tick:
```typescript
import { useEffect, useRef } from 'react';
import { ReactLenis, useLenis } from '@lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Inside App component:
const lenisRef = useRef<any>(null);
useEffect(() => {
  function update(time: number) {
    ScrollTrigger.update();
  }
  // Connect GSAP ScrollTrigger to Lenis
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      return lenisRef.current?.lenis?.scroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    }
  });
  
  gsap.ticker.add(update);
  return () => {
    gsap.ticker.remove(update);
  };
}, []);
```

---

## 3. WebGL / GPU Swarm Infrastructure (Three.js vs. R3F + Drei)

Milestone 4 requires rendering a **50,000+ particle GPU swarm** that morphs between 5 shapes, animated with curl noise and affected by mouse repulsion.

### Option A: Maintain Vanilla Three.js (Recommended)
The current `ThreeCanvas.tsx` is implemented in vanilla Three.js using a standard canvas container ref and an animation loop.
- **Pros**:
  - **Zero React 19 Compatibility Risk**: Vanilla Three.js does not interact with React's render cycle, avoiding any fiber reconciler overhead or peer dependency issues.
  - **Direct WebGL Control**: Managing 50,000+ particles requires custom shaders. Writing raw WebGL shaders and binding them to a `THREE.ShaderMaterial` in vanilla Three.js is extremely clean and highly performant.
  - **No Extra Bundle Weight**: Avoids adding `@react-three/fiber` and `@react-three/drei` to the bundle.
- **Cons**:
  - Requires manual resize listeners and cleanup (already implemented in the baseline code).

### Option B: Transition to React Three Fiber (R3F) & Drei
If R3F and Drei are preferred for a declarative component structure:
- **Required Packages**:
  - `@react-three/fiber` (version `^9.0.0` or `^8.17.0` with `--legacy-peer-deps`)
  - `@react-three/drei` (version `^10.0.0` or `^9.100.0` with `--legacy-peer-deps`)
- **Pros**:
  - Declarative canvas and scene graph.
  - Access to Drei's helpers (e.g., `shaderMaterial` for quick custom shader creation).
- **Cons**:
  - React 19 compatibility is still relatively fresh for R3F/Drei, which could introduce subtle compiler or runtime issues with Vite 8 + TS 6.
  - Rebuilding the existing working canvas in R3F adds unnecessary refactoring overhead.

### Recommendation: **Option A (Vanilla Three.js)**
Given the **Repository-First Rule** ("Prefer extending current patterns... over introducing new ones") and the **Prime Directive** ("Use the smallest reliable change that solves the problem"), we should keep the vanilla Three.js structure. The current `ThreeCanvas.tsx` is already robustly written with proper cleanup, resize handling, and clock-based animation. 

### GPU Swarm Architecture (50,000+ Particles)
The current implementation morphs 2,000 particles on the **CPU** inside the animation loop:
```typescript
// Line 213 in ThreeCanvas.tsx:
for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] += (targetCoord - posArray[i]) * morphSpeed;
}
```
For **50,000+ particles**, this CPU loop would require updating **150,000 floats every frame**, causing severe CPU bottlenecks and frame drops. 

**To transition this to the GPU:**
1. **Shader Attributes**: Define all 5 shapes' positions as custom attributes on a single `THREE.BufferGeometry` (e.g., `aPositionTorus`, `aPositionBrain`, `aPositionCylinder`, `aPositionWave`, `aPositionHub`).
2. **Shader Material**: Use `THREE.ShaderMaterial` instead of `THREE.PointsMaterial`.
3. **Vertex Shader Interpolation**: Pass `uTransitionProgress` (a float from `0.0` to `4.0`) as a uniform. In the vertex shader, LERP between the attributes based on the integer and fractional parts of `uTransitionProgress`.
4. **Curl Noise**: Compute 3D simplex/curl noise directly in the vertex shader, using `uTime` to animate the noise and perturb particle coordinates.
5. **Mouse Repulsion**: Pass `uMousePos` and `uMouseInfluence` as uniforms. In the vertex shader, calculate the distance from each particle to the projected mouse position and push the particle away if it falls within the influence radius.

This ensures all 50,000+ particles are calculated in parallel on the GPU, maintaining a locked 60 FPS.

---

## 4. GLSL Shader Import Strategy

To write custom shaders for the GPU swarm, we need a way to import `.glsl` (or `.vert` and `.frag`) files into our TypeScript components.

### Option 1: Vite's Built-in Raw Import (`?raw`) — (Recommended)
Vite has native support for importing any asset as a raw string using the `?raw` suffix.
- **Syntax**:
  ```typescript
  import vertexShader from '../shaders/swarm.vert?raw';
  import fragmentShader from '../shaders/swarm.frag?raw';
  ```
- **Pros**:
  - **Zero Configuration**: Works immediately with no changes to `vite.config.ts`.
  - **Zero Dependencies**: No extra npm packages to install.
  - **Out-of-the-box TypeScript Support**: Because `tsconfig.app.json` contains `"types": ["vite/client"]`, TypeScript automatically types `*?raw` imports as `string`.
  - **Future-proof**: Guaranteed to work with Vite 8 and future versions.
- **Cons**:
  - Does not support GLSL `#include` directives natively (though we can concatenate strings in TypeScript or use Three.js's built-in shader chunks if needed).

### Option 2: `vite-plugin-glsl`
A Vite plugin that processes GLSL files.
- **Syntax**:
  ```typescript
  import vertexShader from '../shaders/swarm.vert';
  import fragmentShader from '../shaders/swarm.frag';
  ```
- **Pros**:
  - Supports GLSL `#include` statements (useful for sharing noise functions).
  - Handles GLSL minification during the production build.
- **Cons**:
  - Requires installing `vite-plugin-glsl` as a devDependency.
  - Requires modifying `vite.config.ts` to register the plugin.
  - Requires adding custom TypeScript declarations (e.g., in a `shaders.d.ts` file) to prevent TS compiler errors.
  - Potential compatibility issues with Vite 8's new internals.

### Recommendation: **Vite's Built-in `?raw` Import**
Consistent with the **Prime Directive** ("Use the simplest reliable approach") and **Code Quality Bar** ("Avoid overengineering"), **Vite's native `?raw` query** is the superior choice. The shader for our particle swarm will be self-contained (incorporating a simplex/curl noise function directly in the file), meaning we do not need complex `#include` resolution.

---

## 5. Configuration File Analysis

### `tsconfig.json` & `tsconfig.app.json`
- `tsconfig.app.json` is configured with `"moduleResolution": "bundler"`, `"target": "es2023"`, and `"module": "esnext"`.
- It includes `"types": ["vite/client"]`, which ensures Vite-specific import features (like `?raw` and asset queries) are fully typed.
- The TS compiler settings are strict and modern, which is excellent for catching type issues early. No changes are required.

### `vite.config.ts`
- Current config is minimal:
  ```typescript
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  export default defineConfig({
    plugins: [react()],
  })
  ```
- If we use the recommended `?raw` shader imports, this file **requires zero modifications**, keeping our build pipeline simple and clean.

---

## 6. Actionable Recommendations

To set up the infrastructure for the portfolio, the following steps should be executed by the implementer:

### 1. Install Smooth Scroll and Animation Packages
Run the following command to install the required packages:
```bash
npm install gsap lenis @lenis/react
```
*Note: If npm raises a peer dependency warning regarding React 19 for `@lenis/react`, install using `npm install gsap lenis @lenis/react --legacy-peer-deps`.*

### 2. Verify Shader Typing
Verify that importing shaders using `?raw` works without compilation errors. 
Example test import in `src/components/ThreeCanvas.tsx`:
```typescript
import testShader from '../shaders/test.vert?raw';
console.log(testShader); // Should output the shader source string
```

### 3. Keep Vanilla Three.js for the GPU Swarm
Do **not** install `@react-three/fiber` or `@react-three/drei`. Maintain the existing vanilla Three.js architecture in `ThreeCanvas.tsx`, and transition the particle morphing from the CPU to the GPU using `THREE.ShaderMaterial` and custom vertex attributes.
