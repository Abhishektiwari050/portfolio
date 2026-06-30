# Handoff Report: Explorer 1 (Milestone 1: Infrastructure)

## 1. Observation
I have inspected the following files in the `C:\Users\abhis\.gemini\antigravity\scratch\portfolio` directory:
- **`package.json`** (lines 12-27):
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
- **`package-lock.json`** (lines 11-25):
  Confirmed that `lucide-react@1.22.0`, `react@19.2.7`, `react-dom@19.2.7`, and `three@0.185.0` are currently locked and installed. No entries for `gsap`, `lenis`, `@react-three/fiber`, or `@react-three/drei` exist in the lockfile.
- **`tsconfig.app.json`** (lines 6-8):
  ```json
  "module": "esnext",
  "types": ["vite/client"],
  "skipLibCheck": true,
  ```
- **`vite.config.ts`** (lines 1-8):
  ```typescript
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  // https://vite.dev/config/
  export default defineConfig({
    plugins: [react()],
  })
  ```
- **`src/components/ThreeCanvas.tsx`** (lines 208-220):
  ```typescript
  // Morph particle coordinates on the CPU (highly performant for 2000 points)
  const morphSpeed = 0.08; // LERP speed for smooth transition
  for (let i = 0; i < particleCount * 3; i++) {
    // Target coordinate is the mix between the source and target shape
    const targetCoord = sourceShape[i] + (targetShape[i] - sourceShape[i]) * mixRatio;
    
    // LERP from current position to target coordinate
    posArray[i] += (targetCoord - posArray[i]) * morphSpeed;
  }
  ```
  This file currently uses vanilla Three.js (not R3F) and morphs coordinates on the CPU.

---

## 2. Logic Chain
1. **Smooth Scrolling**: The project requires smooth scrolling and scroll-linked animations coordinated with WebGL (observed in `PROJECT.md` and request). To achieve this, `gsap` (for animations/scrolltriggers) and `lenis`/`@lenis/react` (for smooth scrolling) must be installed, as they are currently absent from `package.json`.
2. **WebGL Architecture (Three.js vs R3F)**: 
   - `ThreeCanvas.tsx` is already written in vanilla Three.js and operates via standard React lifecycle refs (Observation 4).
   - Upgrading this to R3F would require a complete rewrite of the component.
   - React 19 is active (Observation 1), which introduces peer dependency warnings and potential incompatibilities with R3F v8/v9.
   - Therefore, keeping vanilla Three.js is the safest, most maintainable, and lowest-risk approach.
3. **GPU Swarm (50,000+ Particles)**:
   - The current code morphs 2,000 particles on the CPU inside a `for` loop on every frame (Observation 4).
   - At 50,000 particles, this loop would require updating 150,000 floats per frame on the CPU, causing severe performance degradation.
   - Therefore, the particle positions must be uploaded as vertex attributes, and morphing/noise calculations must be shifted to the GPU using a custom vertex shader.
4. **GLSL Imports**:
   - `tsconfig.app.json` includes `"types": ["vite/client"]` (Observation 3).
   - Vite's client types natively support importing files as raw strings via the `?raw` suffix (e.g., `import shader from './shader.glsl?raw'`).
   - Therefore, we can import shader files as raw strings without installing `vite-plugin-glsl` or modifying `vite.config.ts`. This maintains a zero-dependency shader loading pipeline.

---

## 3. Caveats
- I did not run any `npm install` or `npm run build` commands, as I am acting in a read-only capacity.
- The React 19 peer dependency compatibility of `@lenis/react` was assessed based on library documentation; if npm throws a peer conflict during installation, the `--legacy-peer-deps` flag must be used.

---

## 4. Conclusion
1. **Smooth Scroll**: Install `gsap`, `lenis`, and `@lenis/react`.
2. **WebGL**: Retain the vanilla Three.js architecture currently in `ThreeCanvas.tsx` rather than introducing R3F/Drei. Transition the 2,000 particle CPU morphing loop to a GPU-based vertex shader (interpolating between custom attributes) to support the 50,000+ particle swarm in Milestone 4.
3. **GLSL Shaders**: Use Vite's native `?raw` import query (e.g. `import vertexShader from './vertex.glsl?raw'`). No additional plugins or configuration changes are needed.

---

## 5. Verification Method
To verify the proposed setup:
1. **Install Dependencies**:
   ```bash
   npm install gsap lenis @lenis/react
   ```
2. **Verify Compile/Build**:
   Ensure the project compiles and builds successfully by running:
   ```bash
   npm run build
   ```
3. **Verify Shader Loading**:
   Create a dummy `.vert` file and import it in `ThreeCanvas.tsx` using `?raw`:
   ```typescript
   import testShader from './test.vert?raw';
   console.log(testShader);
   ```
   Confirm that the TypeScript compiler does not complain and that the shader content is logged to the console in development mode (`npm run dev`).
