# E2E Testability & Playwright Configuration Analysis

**Executive Summary**: The React + Vite + TypeScript portfolio codebase is highly structured but currently lacks explicit test-oriented selectors (such as `data-testid`). While most sections can be targeted using existing IDs (`#intro`, `#aetheris`, `#helios`, `#chronos`, `#connect`), custom elements like the custom cursor, interactive canvas, and terminal console require specific locator strategies or slight markup enhancements to ensure robust, flake-free E2E testing.

---

## 1. Feature-by-Feature Selector & Targeting Strategy

Here is a detailed breakdown of the 9 requested features, including their current DOM structures, file paths, and recommended Playwright locator strategies.

### 1. Hero / Intro Section
*   **File Path**: `src/components/NarrativeSection.tsx` (Lines 14–79)
*   **Current DOM Structure**:
    ```html
    <section id="intro" style="min-height: 75vh; opacity: 1; ...">
      <div>
        <span class="code-text">INIT_STAGE_01</span>
        <span>AUTH: SUCCESS</span>
      </div>
      <h1>ENGINEERING <br /> INTELLIGENT <br /> SYSTEMS.</h1>
      <p>Personal log of an AI Systems Architect...</p>
      <div>
        <span class="code-text">SYS_SCROLL_TO_DECRYPT</span>
      </div>
    </section>
    ```
*   **Targeting Strategy**:
    *   **Primary Locator**: `page.locator('section#intro')` or `page.locator('#intro')`.
    *   **Text Verification**:
        ```typescript
        const hero = page.locator('#intro');
        await expect(hero.getByRole('heading', { name: 'ENGINEERING INTELLIGENT SYSTEMS.' })).toBeVisible();
        await expect(hero.getByText('INIT_STAGE_01')).toBeVisible();
        ```
    *   **Recommendation**: The existing `id="intro"` is sufficient, but adding `data-testid="hero-section"` ensures resilience against layout changes.

### 2. Aetheris AI Section / Card
*   **File Path**: `src/components/NarrativeSection.tsx` (Lines 82–203, dynamically rendered from `src/data/ventures.ts`)
*   **Current DOM Structure**:
    ```html
    <section id="aetheris" style="...">
      <div class="bento-card [active]">
        <!-- Header -->
        <div>
          <div>
            <span class="code-text">2025 - Present</span>
            <span>Founder & Lead Architect</span>
          </div>
          <h2>Aetheris AI</h2>
        </div>
        <!-- Tagline -->
        <p>Decentralized Orchestration Layer for Multi-Agent Swarms</p>
        <!-- Story & Metrics Grid -->
        <div class="bento-inner-grid">...</div>
        <!-- Tech Stack -->
        <div>
          <h4>CORE_SCHEMATIC_TECH</h4>
          <div>
            <span>TypeScript</span>
            <span>FastAPI</span>
            ...
          </div>
        </div>
      </div>
    </section>
    ```
*   **Targeting Strategy**:
    *   **Section Locator**: `page.locator('section#aetheris')`
    *   **Bento Card Active State**:
        ```typescript
        const aetherisCard = page.locator('#aetheris .bento-card');
        await expect(aetherisCard).toHaveClass(/active/); // Verify it is active when in view
        ```
    *   **Text/Content Verification**:
        ```typescript
        await expect(aetherisCard.getByRole('heading', { name: 'Aetheris AI' })).toBeVisible();
        await expect(aetherisCard.getByText('Decentralized Orchestration Layer')).toBeVisible();
        ```

### 3. Helios Engine Section / Card
*   **File Path**: `src/components/NarrativeSection.tsx` (Lines 82–203, dynamically rendered from `src/data/ventures.ts`)
*   **Current DOM Structure**:
    ```html
    <section id="helios" style="...">
      <div class="bento-card">
        ...
        <h2>Helios Engine</h2>
        <p>Rust-Based Sub-Millisecond Vector Retrieval Index</p>
        ...
      </div>
    </section>
    ```
*   **Targeting Strategy**:
    *   **Section Locator**: `page.locator('section#helios')`
    *   **Active State Verification**:
        ```typescript
        // Scroll to bring it into viewport
        await page.locator('#helios').scrollIntoViewIfNeeded();
        await expect(page.locator('#helios .bento-card')).toHaveClass(/active/);
        ```

### 4. Chronos Predict Section / Card
*   **File Path**: `src/components/NarrativeSection.tsx` (Lines 82–203, dynamically rendered from `src/data/ventures.ts`)
*   **Current DOM Structure**:
    ```html
    <section id="chronos" style="...">
      <div class="bento-card">
        ...
        <h2>Chronos Predict</h2>
        <p>Spatio-Temporal GNN for Continental Energy Grids</p>
        ...
      </div>
    </section>
    ```
*   **Targeting Strategy**:
    *   **Section Locator**: `page.locator('section#chronos')`
    *   **Active State Verification**:
        ```typescript
        await page.locator('#chronos').scrollIntoViewIfNeeded();
        await expect(page.locator('#chronos .bento-card')).toHaveClass(/active/);
        ```

### 5. Contact Section / Form
*   **File Path**: `src/components/NarrativeSection.tsx` (Lines 206–270)
*   **Current DOM Structure**:
    *   *Note: There is currently NO HTML `<form>`, `<input>`, or `<button type="submit">` in the codebase.*
    *   Instead, it is a static contact card with anchor links:
    ```html
    <section id="connect" style="...">
      <h2>SECURE CONNECTION WITH THE ARCHITECT.</h2>
      <p>Direct pathways are open...</p>
      <div style="background: rgba(11, 13, 18, 0.3); ...">
        <div><span>ADDR: </span><a href="mailto:hello@example.com" data-lock="true">hello@example.com</a></div>
        <div><span>GITH: </span><a href="https://github.com" target="_blank" data-lock="true">github.com/architect</a></div>
        <div><span>LINK: </span><a href="https://linkedin.com" target="_blank" data-lock="true">linkedin.com/in/architect</a></div>
      </div>
    </section>
    ```
*   **Targeting Strategy**:
    *   **Section Locator**: `page.locator('section#connect')`
    *   **Links Verification**:
        ```typescript
        const connectSection = page.locator('#connect');
        await expect(connectSection.locator('a[href^="mailto:"]')).toHaveAttribute('href', 'mailto:hello@example.com');
        await expect(connectSection.locator('a[href*="github.com"]')).toHaveAttribute('href', 'https://github.com');
        ```
    *   **Form Recommendations**: If a contact form (inputs + submit button) is added later, use the following:
        *   Form Element: `page.locator('form[data-testid="contact-form"]')`
        *   Inputs: `page.getByLabel('Name')` or `page.locator('input[name="email"]')`
        *   Submit Button: `page.getByRole('button', { name: 'Submit' })` or `page.locator('button[type="submit"]')`

### 6. Terminal Console
*   **File Path**: `src/components/TerminalConsole.tsx` (Lines 53–162)
*   **Current DOM Structure**:
    ```html
    <div style="position: fixed; bottom: 24px; left: 24px; z-index: 100; ...">
      <!-- Title Bar -->
      <div>
        <span>&gt;_ Agent_Console_Stream</span>
        <span>Online</span>
      </div>
      <!-- Log Feed -->
      <div style="display: flex; flex-direction: column; ...">
        <div>[10:45:19] SYS: Booting Core Decryptor...</div>
        <div>[10:45:20] SYS: Loading WebGL rendering pipelines...</div>
        ...
        <div>
          <span>$ </span>
          <span style="animation: blink 1s step-start infinite;">_</span>
        </div>
      </div>
    </div>
    ```
*   **Targeting Strategy**:
    *   **Container Locator**: Currently lacks an ID or class. We can target it using text content:
        ```typescript
        const terminal = page.locator('div').filter({ hasText: 'Agent_Console_Stream' }).first();
        ```
    *   **Log Line Verification**:
        ```typescript
        // Verify that logs are updated when a section changes
        await page.locator('#aetheris').scrollIntoViewIfNeeded();
        await expect(page.locator('div').filter({ hasText: 'AETH: Spawning Agent' }).first()).toBeVisible();
        ```
    *   **Recommendation**: Add `data-testid="terminal-console"` to the outer wrapper `div` and `data-testid="terminal-log-line"` to each mapped log row.

### 7. Custom Cursor
*   **File Path**: `src/components/CustomCursor.tsx` (Lines 3–215)
*   **Current DOM Structure**:
    ```html
    <div style="position: fixed; top: 0; left: 0; ... z-index: 9999;">
      <!-- Horizontal Guideline -->
      <div style="position: absolute; top: [position.y]px; width: 100%; ..."></div>
      <!-- Vertical Guideline -->
      <div style="position: absolute; left: [position.x]px; height: 100%; ..."></div>
      <!-- Tether Line (SVG) when hovering a link -->
      <svg>...</svg>
      <!-- Outer Reticle Ring -->
      <div style="position: absolute; left: [cursorPos.x]px; top: [cursorPos.y]px; ..."></div>
      <!-- Center Target Dot -->
      <div style="position: absolute; left: [cursorPos.x]px; top: [cursorPos.y]px; ..."></div>
      <!-- Coordinates Readout -->
      <div style="position: absolute; left: ...">X:120 Y:350</div>
    </div>
    ```
*   **Targeting Strategy**:
    *   *Note: The cursor is hidden on mobile/touch devices (`isMobile` check). Ensure tests run in a desktop viewport.*
    *   **Coordinates Verification**:
        ```typescript
        // Move the mouse to a specific coordinate
        await page.mouse.move(250, 300);
        // Verify coordinates readout updates to match the mouse position
        const coords = page.locator('div').filter({ hasText: /^X:\d+ Y:\d+$/ }).first();
        await expect(coords).toContainText('X:250 Y:300');
        ```
    *   **Tether Line (Lock State)**:
        ```typescript
        // Hover over an interactive element (e.g. mailto link)
        await page.locator('#connect a[href^="mailto:"]').hover();
        // Verify that the tether SVG line is rendered
        await expect(page.locator('svg line')).toBeVisible();
        ```
    *   **Recommendation**: Add `data-testid="custom-cursor"`, `data-testid="cursor-coords"`, and `data-testid="cursor-tether"` to make targeting simple and explicit.

### 8. Smooth Scroll
*   **File Path**: `src/App.tsx` (Lines 62–102)
*   **Current DOM Structure**:
    *   *Note: There is currently NO smooth scroll library (like Lenis or GSAP ScrollTrigger) installed.*
    *   Scrolling is handled natively via the window scroll listener, updating `scrollProgress` and updating section opacities.
*   **Targeting Strategy**:
    *   **Scroll Ingestion & Progress Verification**:
        ```typescript
        // Verify starting state
        const initialMode = page.locator('div').filter({ hasText: 'SYS_MODE: INITIALIZING' }).first();
        await expect(initialMode).toBeVisible();

        // Perform scroll
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
        
        // Verify that system mode has changed (e.g. to one of the venture blueprints)
        const updatedMode = page.locator('div').filter({ hasText: /SYS_MODE:.*BLUEPRINT/ }).first();
        await expect(updatedMode).toBeVisible();
        ```
    *   **Recommendation**: When GSAP or Lenis is integrated, we can target the scroll container (usually `html` or `body`). If GSAP ScrollTrigger is used in development mode, it adds markers like `<div class="gsap-marker-start">`, which can be asserted in E2E tests to verify scroll trigger thresholds.

### 9. 3D Canvas Rendering
*   **File Path**: `src/components/ThreeCanvas.tsx` (Lines 8–283)
*   **Current DOM Structure**:
    ```html
    <aside class="right-column">
      <div style="width: 100%; height: 100%; position: absolute; ...">
        <canvas width="800" height="600" style="width: 800px; height: 600px;"></canvas>
      </div>
      ...
    </aside>
    ```
*   **Targeting Strategy**:
    *   **Canvas Locator**: `page.locator('canvas')` or `page.locator('.right-column canvas')`
    *   **WebGL Initialization Test**:
        ```typescript
        const hasWebGL = await page.evaluate(() => {
          const canvas = document.querySelector('canvas');
          if (!canvas) return false;
          return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'));
        });
        expect(hasWebGL).toBe(true);
        ```
    *   **Visual Regression Testing**: Since the canvas renders Three.js particle morphs, verifying individual coordinates of 2000 particles is impractical. The industry standard is visual screenshots:
        ```typescript
        // Screenshot Hero state
        await expect(page.locator('canvas')).toHaveScreenshot('hero-canvas.png');

        // Scroll to Aetheris and screenshot
        await page.locator('#aetheris').scrollIntoViewIfNeeded();
        await page.waitForTimeout(600); // Wait for LERP morph to complete (morphSpeed = 0.08)
        await expect(page.locator('canvas')).toHaveScreenshot('aetheris-canvas.png');
        ```

---

## 2. Summary Table of Selectors

| Feature | Current Selector / Locator | Recommended Test Selector | Verification Method |
| :--- | :--- | :--- | :--- |
| **Hero Section** | `section#intro` | `data-testid="hero-section"` | Check text: `ENGINEERING INTELLIGENT SYSTEMS.` |
| **Aetheris AI** | `section#aetheris` | `data-testid="venture-aetheris"` | Check card class contains `active` |
| **Helios Engine** | `section#helios` | `data-testid="venture-helios"` | Check card class contains `active` |
| **Chronos Predict** | `section#chronos` | `data-testid="venture-chronos"` | Check card class contains `active` |
| **Contact Section** | `section#connect` | `data-testid="connect-section"` | Check mailto/github link attributes |
| **Terminal Console** | `div:has-text("Agent_Console_Stream")` | `data-testid="terminal-console"` | Verify log stream text changes on scroll |
| **Custom Cursor** | `div:has-text("X:")` (coordinate div) | `data-testid="cursor-coords"` | Move mouse and assert coordinates text match |
| **Smooth Scroll** | `window` (native scroll events) | `window` / `html` | Scroll window and check `SYS_MODE` text changes |
| **3D Canvas** | `canvas` | `data-testid="three-canvas"` | WebGL context check & Visual Regression |

---

## 3. Proposed Playwright Configuration

Below is the proposed `playwright.config.ts` designed specifically for this React + Vite + TypeScript application. It configures the local development server, ensures WebGL support in headless browsers, and structures the tests.

```typescript
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E testing configuration for Portfolio
 */
export default defineConfig({
  testDir: './e2e',
  /* Maximum time one test can run for */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * Increased slightly to account for GSAP/LERP animation durations.
     */
    timeout: 8000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05, // Allow minor pixel difference due to WebGL rendering variances
    },
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. */
  reporter: process.env.CI ? 'github' : 'html',
  /* Shared settings for all the projects below. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',
    /* Collect trace when retrying a failed test. */
    trace: 'on-first-retry',
    /* Capture screenshot on failure */
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Enable WebGL in headless Chrome
        launchOptions: {
          args: [
            '--use-gl=angle', // Force ANGLE for consistent GPU rendering in headless environments
            '--ignore-gpu-blocklist',
          ],
        },
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Run local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

---

## 4. Recommended Enhancements for Testability

To make the codebase highly testable and robust, we recommend the following minor code changes:

1.  **Add `data-testid` Attributes**:
    *   `src/components/TerminalConsole.tsx`: Add `data-testid="terminal-console"` to the outer wrapper and `data-testid="terminal-log-line"` to each log.
    *   `src/components/CustomCursor.tsx`: Add `data-testid="custom-cursor"` to the main wrapper, and `data-testid="cursor-coords"` to the coordinate readout.
    *   `src/components/ThreeCanvas.tsx`: Add `data-testid="three-canvas"` to the container.
2.  **Add a Test Mode / Disable Animations Flag**:
    *   WebGL particle morphing and mouse LERPing can introduce slight timing variables.
    *   We can add a URL parameter query check (e.g., `?testMode=true`) in `App.tsx` or components. If `testMode=true` is detected, we can set LERP/morph speeds to `1.0` (instant transitions) to eliminate wait times and make tests run significantly faster and more deterministically.
