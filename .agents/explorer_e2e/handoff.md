# Handoff Report — E2E Test Strategy & Selectors

## 1. Observation
I have inspected the main entry points and components in `src/` of the portfolio project:
- **Hero/Intro**: Located in `src/components/NarrativeSection.tsx` (Lines 14–79). Has `id="intro"`.
- **Aetheris AI**: Located in `src/components/NarrativeSection.tsx` (Lines 82–203). Has `id="aetheris"`.
- **Helios Engine**: Located in `src/components/NarrativeSection.tsx` (Lines 82–203). Has `id="helios"`.
- **Chronos Predict**: Located in `src/components/NarrativeSection.tsx` (Lines 82–203). Has `id="chronos"`.
- **Contact Section**: Located in `src/components/NarrativeSection.tsx` (Lines 206–270). Has `id="connect"`. *No HTML form inputs or submit buttons exist.*
- **Terminal Console**: Located in `src/components/TerminalConsole.tsx` (Lines 53–162). Lacks classes or IDs. Relies on text content like `>_ Agent_Console_Stream`.
- **Custom Cursor**: Located in `src/components/CustomCursor.tsx` (Lines 3–215). Lacks classes or IDs. Relies on position-based coordinates text `X:120 Y:350` and interactive lock state.
- **Smooth Scroll**: Currently no third-party smooth scroll library is installed in `package.json`. Scroll progress is calculated natively in `src/App.tsx` (Lines 62–102).
- **3D Canvas**: Located in `src/components/ThreeCanvas.tsx` (Lines 8–283). Appends `canvas` dynamically via `containerRef.current.appendChild(renderer.domElement)`.

## 2. Logic Chain
1. Since the core narrative sections (`intro`, `aetheris`, `helios`, `chronos`, `connect`) have unique `id` attributes (e.g. `<section id="intro">`), they can be directly targeted using `page.locator('#id')` without adding extra selectors.
2. Since there are no input fields or submit buttons in the `connect` section (it only contains anchor links like `mailto:` and social links), standard form filling tests are not applicable. We must target the anchor tags instead.
3. Since `TerminalConsole` and `CustomCursor` lack IDs or classes, they must be targeted via text content or by recommending the addition of `data-testid` attributes to prevent brittle tests.
4. Since the 3D Canvas renders dynamically in WebGL, verifying it requires asserting the canvas element exists and using visual regression screenshots at different scroll states to verify particle morphing.
5. A standard Playwright configuration with a local `webServer` targeting port `5173` and launch options forcing GPU acceleration (`--use-gl=angle`) will ensure reliable headless execution of the WebGL canvas.

## 3. Caveats
- No actual Playwright tests were run or packages installed, as this was a read-only investigation.
- WebGL testing in headless environments (like CI) can sometimes fail if the runner lacks GPU support. The configuration includes `--use-gl=angle` as a mitigation, but visual screenshot thresholds (`maxDiffPixelRatio`) may need adjustment depending on the runner.
- Smooth scroll library (Lenis/GSAP) is not yet integrated. If it is integrated in the future, the scroll test strategy might need updates to account for custom scroll containers or scroll events.

## 4. Conclusion
The codebase is ready for Playwright E2E integration. Most sections are easily targetable via existing IDs, but custom UI elements (cursor, terminal, canvas) will benefit from adding `data-testid` attributes. A comprehensive selector strategy and a complete `playwright.config.ts` have been written to `C:\Users\abhis\.gemini\antigravity\scratch\portfolio\.agents\e2e_testing_orchestrator\explorer_analysis.md`.

## 5. Verification Method
To verify the findings and the proposed strategy:
1. Open and inspect the analysis report at `C:\Users\abhis\.gemini\antigravity\scratch\portfolio\.agents\e2e_testing_orchestrator\explorer_analysis.md`.
2. Inspect the source files `src/components/NarrativeSection.tsx`, `src/components/TerminalConsole.tsx`, `src/components/CustomCursor.tsx`, and `src/components/ThreeCanvas.tsx` to confirm the DOM structures and line references matches.
