## 2026-07-01T02:28:48Z
You are the worker agent. Your task is to implement the TDSLoader skeleton integration in C:/Users/abhis/.gemini/antigravity/scratch/portfolio/src/components/ThreeCanvas.tsx.

Follow these instructions exactly:
1. Read the Explorer's findings at C:/Users/abhis/.gemini/antigravity/scratch/portfolio/.agents/explorer_anatomy/handoff.md.
2. Edit C:/Users/abhis/.gemini/antigravity/scratch/portfolio/src/components/ThreeCanvas.tsx to:
   - Import TDSLoader: `import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';`
   - Load the user's custom `.3ds` model `Skelet_N031209.3ds` using `TDSLoader`. The file is at `public/Skelet_N031209.3ds` (accessed as `/Skelet_N031209.3ds`).
   - Override all child mesh materials with a pure matte white standard material (`roughness: 0.9`, `metalness: 0.0`).
   - Auto-scale and position the model as a bust (only the skull and neck/spine are visible in the left panel). Remember that 3DS files often need a 90-degree X-rotation to stand upright and rotation on Y/Z to face the camera correctly. Ensure the model is centered and appropriately sized.
   - Implement slow, continuous auto-rotation of the skeleton model on the left, independent of mouse movement.
   - Remove any old GLTFLoader/DRACOLoader skull and skeleton loading code, as well as the now unused clipping plane setup (`localPlane`, `localPlaneSource`, `spineMaterial`, local clipping enabling, and localPlane updates in the animation loop).
3. Run `npm run build` to verify there are no compilation errors.
4. Run `npm run lint` to verify there are no linting errors.
5. Run the playwright E2E tests using `npx playwright test` to see if existing tests pass, and report the results.
6. Write your handoff to handoff.md in your working directory C:/Users/abhis/.gemini/antigravity/scratch/portfolio/.agents/worker_anatomy/handoff.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
