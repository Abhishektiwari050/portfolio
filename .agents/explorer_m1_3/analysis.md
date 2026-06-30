# Infrastructure Analysis Report — Milestone 1

This report analyzes the infrastructure of the portfolio codebase located at `C:\Users\abhis\.gemini\antigravity\scratch\portfolio` to prepare for the integration of smooth scrolling (Lenis + GSAP) and a GPU-accelerated particle swarm (Three.js + R3F + Drei + Custom Shaders).

---

## 1. Executive Summary
- **Current State**: The project is a Vite-based React application using React 19 (`19.2.7`) and Three.js (`0.185.0`). It currently implements a CPU-based particle morphing system (2,000 particles) using vanilla Three.js in `src/components/ThreeCanvas.tsx`.
- **Key Findings**:
  - **No Smooth Scroll**: Neither GSAP nor Lenis is installed or configured. Scroll tracking is handled via a standard window scroll listener in `src/App.tsx`.
  - **React 19 Compatibility**: React 19 introduces breaking changes for older React Three Fiber (R3F) and Drei versions. We must carefully specify compatible next-generation versions (`@react-three/fiber@9` and `@react-three/drei@10`).
  - **GLSL Shaders**: Vite 8 supports importing GLSL files as raw text using the `?raw` suffix out of the box, requiring zero additional configuration. However, for modular shaders (e.g. sharing noise functions via `#include`), `vite-plugin-glsl` is recommended.

---

## 2. Configuration Files Analysis

### 2.1. `package.json`
- **React Version**: `^19.2.7` (dependencies)
- **Three.js Version**: `^0.185.0` (dependencies)
- **Vite Version**: `^8.1.0` (devDependencies)
- **TypeScript**: `~6.0.2` (devDependencies)
- **Linter**: `oxlint` (`^1.69.0`) is used instead of ESLint.
- **Analysis**: The project uses very modern versions of its core stack (React 19, Vite 8, TS 6). This is excellent for performance but requires bleeding-edge versions of R3F and Drei.

### 2.2. `vite.config.ts`
- **Current Configuration**:
  ```typescript
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  export default defineConfig({
    plugins: [react()],
  })
  ```
- **Analysis**: Standard React Vite config. If we decide to use `vite-plugin-glsl`, this file must be modified to include the plugin. If we use Vite's native `?raw` imports, this file remains untouched.

### 2.3. `tsconfig.json` & Sub-configs
- **`tsconfig.json`**: References `tsconfig.app.json` (for the app source) and `tsconfig.node.json` (for Vite config).
- **`tsconfig.app.json`**:
  - Target: `es2023`
  - Module Resolution: `bundler`
  - Types: `["vite/client"]`
  - Strict linting compiler options: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`.
- **Analysis**: The TypeScript configuration is clean and uses modern bundler resolution. To support GLSL imports, we will need to declare wildcard modules in a `.d.ts` declaration file in `src/` to prevent compilation errors.

---

## 3. Dependency Verification

The following table summarizes the status of the required dependencies:

| Package | Desired Functionality | Status | Current Version | Recommended Action / Version |
|---|---|---|---|---|
| `react` | Core UI library | Installed | `19.2.7` | Keep as is |
| `react-dom` | DOM rendering | Installed | `19.2.7` | Keep as is |
| `three` | 3D WebGL Engine | Installed | `0.185.0` | Keep as is |
| `@types/three` | TypeScript types for Three.js | Installed | `0.185.0` | Keep as is |
| `gsap` | Scroll-triggered animations | **Missing** | N/A | Install `^3.12.5` |
| `lenis` | Smooth scroll normalization | **Missing** | N/A | Install `^1.1.20` |
| `@lenis/react` | React wrapper for Lenis | **Missing** | N/A | Install `^1.1.20` |
| `@react-three/fiber` | React renderer for Three.js | **Missing** | N/A | Install `^9.0.0` (React 19 support) |
| `@react-three/drei` | Useful helpers for R3F | **Missing** | N/A | Install `^10.0.0` (React 19 support) |
| `vite-plugin-glsl` | GLSL shader loader for Vite | **Missing** | N/A | *Optional*: Install `^1.3.1` as devDependency |

---

## 4. Detailed Package Recommendations & Compatibility

### 4.1. React 19 Compatibility (Critical)
Older versions of R3F (v8) and Drei (v9) will fail on React 19 due to internal changes in React's reconciler and the deprecation of `forwardRef`. 
- **Recommendation**:
  - Install `@react-three/fiber@9.0.0` (or `^9.0.0` once stable, or the latest pre-release if required). v9 is the dedicated version rewriting the reconciler for React 19.
  - Install `@react-three/drei@10.0.0` (or `^10.0.0`), which is designed to work with R3F v9 and React 19.
  - **Command to propose** (to be executed by the Implementer):
    ```bash
    npm install gsap@^3.12.5 lenis@^1.1.20 @lenis/react@^1.1.20 @react-three/fiber@^9.0.0 @react-three/drei@^10.0.0
    ```

### 4.2. GSAP & Lenis
- **Lenis**: The official modern package is `lenis` (rebranded from `@studio-freight/lenis`).
- **React Wrapper**: `@lenis/react` provides the `<ReactLenis>` wrapper, making it simple to manage scroll lifecycle in React.
- **GSAP Integration**: GSAP's `ScrollTrigger` integrates seamlessly with Lenis. We can configure Lenis to emit scroll events and tell GSAP to use Lenis's scroll position.

---

## 5. GLSL Shader Integration

Milestone 4 requires a 50,000+ particle GPU swarm with custom shaders and curl noise. There are two main ways to load these shaders in Vite.

### Option A: Native Vite `?raw` Imports (Recommended for Simplicity)
Vite can load any file as a raw string if you append `?raw` to the import.
- **How it works**:
  ```typescript
  import vertexShader from './shaders/vertex.glsl?raw';
  import fragmentShader from './shaders/fragment.glsl?raw';
  ```
- **TypeScript Setup**: Create `src/types/shaders.d.ts` (or add to `src/vite-env.d.ts`):
  ```typescript
  declare module '*.glsl?raw' {
    const content: string;
    default content;
  }
  declare module '*.vert?raw' {
    const content: string;
    default content;
  }
  declare module '*.frag?raw' {
    const content: string;
    default content;
  }
  ```
- **Pros**: Zero-dependency, no configuration changes, highly robust.
- **Cons**: Does not support GLSL `#include` directives natively.

### Option B: `vite-plugin-glsl` (Recommended for Complex Shaders)
If you need to modularize your shaders (e.g., separating curl noise calculations into a shared file and importing it into the vertex shader using `#include './noise.glsl'`), `vite-plugin-glsl` is the standard tool.
- **Vite Config Modification**:
  ```typescript
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import glsl from 'vite-plugin-glsl'

  export default defineConfig({
    plugins: [react(), glsl()],
  })
  ```
- **TypeScript Setup**:
  ```typescript
  declare module '*.glsl' {
    const content: string;
    default content;
  }
  ```
- **Pros**: Supports `#include` statements, glslify, and automatically optimizes/minifies shaders.
- **Cons**: Adds a devDependency, requires modifying `vite.config.ts`.

**Conclusion on GLSL**: Since a 50,000+ particle GPU swarm with morphing shapes and curl noise will require complex mathematical functions (like simplex noise or curl noise), we recommend **Option B (`vite-plugin-glsl`)** as it allows cleaner, modular shader code.

---

## 6. GPU Swarm Architecture Recommendations (Milestone 4 Preview)

To render 50,000+ particles smoothly at 60 FPS, CPU-based morphing (currently used in `ThreeCanvas.tsx` for 2,000 particles) is highly inefficient. We must offload all calculations to the GPU.

### 6.1. Attribute-Based Morphing
Instead of updating the particle positions in JavaScript on every frame, we should pass the positions of all 5 morphing shapes to the GPU as custom attributes on a `BufferGeometry`:
- `attribute vec3 aPositionTorus`
- `attribute vec3 aPositionBrain`
- `attribute vec3 aPositionCylinder`
- `attribute vec3 aPositionWave`
- `attribute vec3 aPositionHub`

In the custom Vertex Shader, we can interpolate between these attributes based on a uniform `uTransitionProgress` (ranging from 0.0 to 4.0):
```glsl
uniform float uTransitionProgress;
attribute vec3 aPositionTorus;
attribute vec3 aPositionBrain;
// ...

void main() {
  vec3 targetPosition = vec3(0.0);
  
  if (uTransitionProgress <= 1.0) {
    targetPosition = mix(aPositionTorus, aPositionBrain, uTransitionProgress);
  } else if (uTransitionProgress <= 2.0) {
    targetPosition = mix(aPositionBrain, aPositionCylinder, uTransitionProgress - 1.0);
  } else if (uTransitionProgress <= 3.0) {
    targetPosition = mix(aPositionCylinder, aPositionWave, uTransitionProgress - 2.0);
  } else {
    targetPosition = mix(aPositionWave, aPositionHub, uTransitionProgress - 3.0);
  }
  
  // Apply curl noise displacement based on uTime and mouse influence
  // ...
  
  vec4 mvPosition = modelViewMatrix * vec4(targetPosition, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = uSize * (300.0 / -mvPosition.z);
}
```

### 6.2. Integrating with GSAP
We can map the global `scrollProgress` (0.0 to 1.0) to `uTransitionProgress` (0.0 to 4.0) using GSAP's `ScrollTrigger`. GSAP can smoothly tween the uniform value, preventing sudden jumps if the user scrolls quickly or uses trackpads.
