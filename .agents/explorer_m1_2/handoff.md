# Handoff Report — Milestone 1: Infrastructure

## 1. Observation
*   **`package.json` (lines 12-27)**:
    ```json
      "dependencies": {
        "lucide-react": "^1.22.0",
        "react": "^19.2.7",
        "react-dom": "^19.2.7",
        "three": "^0.185.0"
      },
      "devDependencies": {
        "@types/node": "^24.13.2",
        "@types/react": "^19.2.17",
        "@types/react-dom": "^19.2.3",
        "@types/three": "^0.185.0",
        "@vitejs/plugin-react": "^6.0.2",
        "oxlint": "^1.69.0",
        "typescript": "~6.0.2",
        "vite": "^8.1.0"
      }
    ```
*   **`tsconfig.app.json` (line 7)**:
    ```json
        "types": ["vite/client"],
    ```
*   **`src/components/ThreeCanvas.tsx` (lines 1-2 & 211-220)**:
    ```typescript
    import React, { useEffect, useRef } from 'react';
    import * as THREE from 'three';
    ```
    and
    ```typescript
          // 2. Morph particle coordinates on the CPU (highly performant for 2000 points)
          const morphSpeed = 0.08; // LERP speed for smooth transition
          for (let i = 0; i < particleCount * 3; i++) {
            // Target coordinate is the mix between the source and target shape
            const targetCoord = sourceShape[i] + (targetShape[i] - sourceShape[i]) * mixRatio;
            
            // LERP from current position to target coordinate
            posArray[i] += (targetCoord - posArray[i]) * morphSpeed;
          }
    ```

## 2. Logic Chain
1.  **React 19 & Three.js Compatibility**: The project is built on React 19 (`^19.2.7`) and Three.js r185 (`^0.185.0`). Introducing `@react-three/fiber` (R3F) and `@react-three/drei` is risky because R3F v9 (the React 19 compatible version) is in early/pre-release stages, which often leads to peer dependency conflicts or installation warnings.
2.  **Architectural Fit**: The existing `ThreeCanvas.tsx` is written in vanilla Three.js using a standard React ref and a manual `requestAnimationFrame` loop. It does not use R3F. Since the entire 3D scene consists of a single particle swarm (`THREE.Points`) with custom shaders, there is no nested 3D hierarchy or complex raycasting that would benefit from R3F's component-based model.
3.  **Performance (50,000+ Particles)**: Morphing 50,000+ particles on the CPU (the current method in `ThreeCanvas.tsx` for 2,000 particles) will execute 150,000+ operations per frame on the main thread, causing severe frame drops. Running the morphing and noise calculations on the GPU via a custom `THREE.ShaderMaterial` (passing target shapes as vertex attributes) is required. This is easily achieved in vanilla Three.js.
4.  **GLSL Importing**: Since `tsconfig.app.json` includes `"types": ["vite/client"]`, Vite's built-in `?raw` suffix is natively typed. Shaders can be imported as plain strings (`import vertexShader from './shaders/vertex.glsl?raw'`) without installing `vite-plugin-glsl` or altering `vite.config.ts`.
5.  **Smooth Scrolling**: Integrating Lenis and GSAP ScrollTrigger requires installing `gsap` and `@lenis/react`.

## 3. Caveats
*   **No Active Installation**: We did not run `npm install` or `npm run build` since our instructions are strictly read-only. We did not verify the packages in a live build environment.
*   **Vite 8 Compatibility**: Vite 8 is very new. Standard plugins and packages like `gsap` and `@lenis/react` are expected to work out of the box, but any issues can be bypassed by using standard ESM imports.

## 4. Conclusion
*   **Install Scroll Packages**: Install `gsap` and `@lenis/react` to support smooth scrolling and scroll-bound animations.
*   **Do NOT Migrate to R3F**: Retain the vanilla Three.js setup in `ThreeCanvas.tsx` and upgrade it to use a custom `ShaderMaterial` for the 50,000+ particle GPU swarm. This avoids React 19 peer dependency issues and provides maximum performance.
*   **Do NOT Install `vite-plugin-glsl`**: Use Vite's built-in `?raw` suffix for shader imports to keep the project setup simple and dependency-free.

## 5. Verification Method
1.  Run `npm install gsap @lenis/react` to verify that the packages install without peer dependency conflicts.
2.  Import them in `src/App.tsx` and run `npm run build` to verify the compilation.
3.  Verify that `import vertexShader from './shaders/test.glsl?raw'` compiles without TypeScript errors.
