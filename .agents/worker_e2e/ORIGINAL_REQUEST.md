## 2026-06-29T05:18:00Z
You are a Worker tasked with setting up and implementing the E2E test suite for the personal portfolio website.

Your working directory is: `C:\Users\abhis\.gemini\antigravity\scratch\portfolio`

### MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

### Tasks:
1. **Install Playwright**:
   - Install `@playwright/test` as a devDependency in `package.json` (use `npm install -D @playwright/test`).
   - Run `npx playwright install` to install the required browser binaries.
2. **Create Playwright Configuration**:
   - Write `playwright.config.ts` at the project root. Use the configuration recommended by the Explorer:
     - Test directory: `./e2e`
     - Base URL: `http://localhost:5173`
     - Local webServer: `npm run dev` on port 5173
     - Include Chromium, Firefox, and WebKit projects.
     - For Chromium, add launch options for WebGL: `['--use-gl=angle', '--ignore-gpu-blocklist']`.
     - Set expect timeout to 8000ms (to account for GSAP/LERP animations) and allow minor pixel differences for screenshots.
3. **Create `TEST_INFRA.md` at the Project Root**:
   - Explains the E2E test philosophy, feature inventory (9 features), 4-tier test case design, and coverage thresholds.
4. **Implement E2E Test Files under `e2e/`**:
   - Write four separate spec files to cover all 104+ test cases:
     - `e2e/tier1-features.spec.ts`: Feature coverage (5 tests per feature for all 9 features = 45 tests).
     - `e2e/tier2-boundaries.spec.ts`: Boundary and corner cases (5 tests per feature for all 9 features = 45 tests).
     - `e2e/tier3-combinations.spec.ts`: Cross-feature combinations (9 tests).
     - `e2e/tier4-scenarios.spec.ts`: Real-world application scenarios (5 tests).
   - Use the selectors and strategies identified in the Explorer's analysis (`#intro`, `#aetheris`, `#helios`, `#chronos`, `#connect`, `data-testid="terminal-console"`, `data-testid="custom-cursor"`, `canvas`, etc.).
   - Write clean, strongly typed TypeScript tests using Playwright's `test` and `expect`.
   - Ensure the tests are written to assert the *completed* portfolio behavior. They *will* fail on the baseline codebase; this is expected and required.
5. **Run the Test Suite**:
   - Execute the test suite using `npx playwright test` (or a specific project/file to verify compilation).
   - Verify that the test runner compiles and runs the tests successfully, and that they fail as expected on the baseline codebase.
6. **Report**:
   - Write a handoff report documenting the installation, configuration, created files, and test run results (including compilation status and failure logs).

Ensure all code compiles perfectly and there are no TypeScript or linter errors. Do not modify the application source code in `src/`.
