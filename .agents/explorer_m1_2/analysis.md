# Milestone 1: Infrastructure Analysis & Recommendations

## 1. Executive Summary
The portfolio codebase is a modern React 19 + TypeScript + Vite project configured for high-performance WebGL rendering. To support smooth scrolling (Lenis), scroll-triggered animations (GSAP), and a 50,000+ particle GPU swarm (Three.js), we recommend staying with **vanilla Three.js** (already installed) to avoid React 19 peer dependency conflicts, using **Vite's built-in `?raw` suffix** for GLSL shader imports to avoid unnecessary plugins, and installing **GSAP** and **`@lenis/react`** for smooth scroll coordination.

---

## 2. Current State Assessment

### 2.1 File Analysis
*   **`package.json`**:
    *   **React**: Uses React 19 (`"react": "^19.2.7"`, `"react-dom": "^19.2.7"`).
    *   **Three.js**: Uses Three.js r185 (`"three": "^0.185.0"`).
    *   **Tooling**: Uses Vite 8 (`"vite": "^8.1.0"`), TypeScript 6 (`"typescript": "~6.0.2"`), and Oxlint (`"oxlint": "^1.69.0"`) for linting.
*   **`vite.config.ts`**:
    *   Simple config utilizing `@vitejs/plugin-react` (using Rolldown under the hood for Vite 8).
*   **`tsconfig.json` & `tsconfig.app.json`**:
    *   Uses TypeScript project references (`tsconfig.app.json` and `tsconfig.node.json`).
    *   `tsconfig.app.json` includes `"types": ["vite/client"]`, which natively enables Vite-specific import types (like `?raw`).
*   **`ThreeCanvas.tsx`**:
    *   Currently implemented using **vanilla Three.js** inside a React `useEffect` hook.
    *   Performs particle morphing on the **CPU** for 2,000 particles. This will cause major frame rate drops when scaled to the 50,000+ particles required in Milestone 4.

---

## 3. Smooth Scroll & Animation Infrastructure

To implement normalized smooth scrolling and scroll-coordinated animations, the following packages are required:

| Package | Version | Purpose |
|---------|---------|---------|
| `gsap` | `^3.12.5` | Handles timeline animations, pinning, and scroll-bound transitions via ScrollTrigger. |
| `@lenis/react` | `^1.1.18` | Provides the `<ReactLenis>` wrapper for smooth scrolling, which integrates cleanly with React's lifecycle. |

### Integration Strategy
1.  Wrap the root application in `<ReactLenis root>` in `src/App.tsx`.
2.  Register the `ScrollTrigger` plugin from GSAP.
3.  Configure Lenis to update GSAP's ScrollTrigger on every scroll tick to ensure perfect synchronization:
    ```typescript
    import { useEffect, useRef } from 'react';
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { ReactLenis, useLenis } from '@lenis/react';

    gsap.registerPlugin(ScrollTrigger);

    // Inside App component:
    const lenisRef = useRef<any>(null);
    useEffect(() => {
      function update(time: number) {
        ScrollTrigger.update();
      }
      gsap.ticker.add(update);
      return () => {
        gsap.ticker.remove(update);
      };
    }, []);
    ```

---

## 4. WebGL 3D Swarm Infrastructure (Three.js vs. R3F + Drei)

Milestone 4 requires rendering a **50,000+ particle GPU swarm** with 5 morphing shapes and curl noise. We analyzed whether to migrate to **React Three Fiber (R3F) + Drei** or remain on **vanilla Three.js**.

### Option A: Migrate to R3F (`@react-three/fiber`) + Drei (`@react-three/drei`)
*   **Pros**: Declarative React-like syntax for 3D elements.
*   **Cons**:
    *   **React 19 Compatibility**: R3F and Drei have strict peer dependency requirements. While R3F v9 supports React 19, it is in active development/early release, and mixing it with Three.js r185 can lead to peer dependency conflicts during installation (requiring `--legacy-peer-deps`).
    *   **Performance Overhead**: For a single, highly-optimized particle system, R3F's declarative reconciler adds unnecessary abstraction. The particle positions and morphing must be handled via custom shaders in a single `Points` mesh, meaning R3F's component model provides no architectural benefit here.
    *   **Refactoring Cost**: Requires rewriting the entire `ThreeCanvas.tsx` component.

### Option B: Remain on Vanilla Three.js (Recommended)
*   **Pros**:
    *   **Zero React 19 Conflicts**: Avoids adding complex 3D reconciler packages that might break or conflict with React 19.
    *   **Maximum Performance**: Direct access to WebGL and Three.js APIs. A 50,000+ particle swarm is best managed as a single `THREE.Points` object with a custom `THREE.ShaderMaterial` where all calculations (interpolation, curl noise, and wave animation) run on the GPU (vertex shader).
    *   **Minimal Code Changes**: The existing `ThreeCanvas.tsx` is already written in vanilla Three.js and has the scene, camera, renderer, resize handlers, and animation loop fully set up.
*   **GPU Swarm Implementation Plan**:
    *   Increase particle count from `2,000` to `50,000+`.
    *   Pre-calculate the 5 morphing shapes on CPU once at startup.
    *   Store these shapes as custom attributes on `BufferGeometry` (e.g., `aPositionShape0`, `aPositionShape1`, etc.).
    *   Write a custom vertex shader that interpolates between these attributes using a uniform `uTransitionProgress` (0.0 to 4.0) and adds GPU-based Simplex/Curl noise.

---

## 5. GLSL Shader Import Strategy

To write custom vertex and fragment shaders for the GPU swarm, we need to import GLSL code into our TypeScript files.

### Option 1: Vite Built-in Raw Imports (Recommended)
Vite supports importing any asset as a raw string out of the box by appending `?raw` to the import path.
*   **Usage**:
    ```typescript
    import vertexShader from './shaders/particle.vert?raw';
    import fragmentShader from './shaders/particle.frag?raw';

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { ... }
    });
    ```
*   **TypeScript Support**: Already configured! `tsconfig.app.json` has `"types": ["vite/client"]`, which includes declarations for `*?raw` imports.
*   **Pros**: Zero dependencies, zero configuration changes, highly robust.
*   **Cons**: No built-in GLSL minification or `#include` resolving (though not needed for a single particle shader).

### Option 2: `vite-plugin-glsl`
*   **Usage**: Allows importing GLSL files directly: `import vertexShader from './shaders/particle.vert'`.
*   **Pros**: Supports `#include` directives (useful if we want to import Three.js shader chunks like `<common>` or `<fog_pars_vertex>`), and minifies shader code.
*   **Cons**: Requires installing `vite-plugin-glsl` as a devDependency, modifying `vite.config.ts`, and adding a custom `.d.ts` file to satisfy TypeScript.

### Recommendation
Use **Option 1 (Vite Built-in Raw Imports)**. It is the cleanest, zero-dependency approach and works immediately. If we need to support Three's built-in fog, we can easily write a few lines of fog calculation in our custom fragment shader manually, or paste the relevant Three.js fog chunks directly.

---

## 6. Summary of Recommended Actions

To prepare the project for Milestones 2-7, the implementer should run the following command to install the animation and smooth-scroll packages:

```bash
npm install gsap @lenis/react
```

No devDependencies or config changes are required. The project is ready to compile and run.
