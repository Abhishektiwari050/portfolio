# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier2-boundaries.spec.ts >> Tier 2: Boundary and Corner Cases >> 7. Custom Cursor Boundaries >> extreme mouse speeds should not cause reticle lag beyond LERP
- Location: e2e\tier2-boundaries.spec.ts:304:5

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('[data-testid="cursor-coords"]')
Expected pattern: /X:\s*1000\s+Y:\s*1000/
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 8000ms
  - waiting for locator('[data-testid="cursor-coords"]')

```

```yaml
- text: "X:0 Y:0 >_ Agent_Console_Stream Online [10:52:19] SYS: Booting Core Decryptor... [10:52:21] SYS: Loading WebGL rendering pipelines... [10:52:23] SYS: Initializing CatmullRom spline path... [10:52:25] SYS: Calibrating CAD coordinate reticle... [10:52:26] SYS: Parallax grids aligned and active. $ _"
- main:
  - text: "INIT_STAGE_01 AUTH: SUCCESS"
  - heading "ENGINEERING INTELLIGENT SYSTEMS." [level=1]
  - paragraph: Personal log of an AI Systems Architect and Founder. Focused on multi-agent execution runtimes, GPU-accelerated vector indexing, and planetary-scale predictive networks.
  - text: SYS_SCROLL_TO_DECRYPT 2025 - Present Founder & Lead Architect
  - heading "Aetheris AI" [level=2]
  - text: CH_AETHERIS
  - paragraph: Decentralized Orchestration Layer for Multi-Agent Swarms
  - paragraph: As AI models matured, the bottleneck shifted from raw intelligence to orchestration. I founded Aetheris to solve the coordination problem in complex enterprise workflows. We built a decentralized runtime that allows autonomous agents to dynamically discover, collaborate, and execute tasks.
  - paragraph: The system utilizes a hierarchical coordinator agent that decomposes user goals into sub-tasks, registers them in a distributed queue, and assigns them to specialized worker agents operating within secure, ephemeral sandboxes.
  - paragraph: We implemented a real-time evaluator loop that scores agent outputs before they are committed, allowing the swarm to self-correct and backtrack if a path fails. This architecture reduced task failure rates by over 80% compared to traditional linear pipelines.
  - text: 92.4% Task Success Verified goal completion rate 380ms Routing Latency Average agent routing time 12x Token Efficiency Reduction in redundant LLM calls
  - heading "CORE_SCHEMATIC_TECH" [level=4]
  - text: TypeScript FastAPI LangGraph Qdrant Docker Redis 2024 - 2025 Core Systems Engineer
  - heading "Helios Engine" [level=2]
  - text: CH_HELIOS
  - paragraph: Rust-Based Sub-Millisecond Vector Retrieval Index
  - paragraph: Off-the-shelf vector databases struggled with memory consumption and latency at billion-scale retrieval. I joined the Helios team to build a custom, bare-metal indexing engine in Rust.
  - paragraph: We designed a custom implementation of the HNSW (Hierarchical Navigable Small World) algorithm, optimized for modern CPU cache hierarchies and SIMD vector instructions. We integrated Product Quantization (PQ) directly into the graph traversal to store compressed vectors in memory while keeping the full vectors on NVMe storage.
  - paragraph: To handle high-throughput ingestion, we built a lock-free lock-step ingestion pipeline that builds index segments concurrently in memory before merging them, ensuring that search latency remained unaffected during heavy write loads.
  - text: 0.82ms Query Latency 99th percentile search time 1.2B Scale High-dimensional vectors indexed 10x Memory Savings Achieved via Product Quantization
  - heading "CORE_SCHEMATIC_TECH" [level=4]
  - text: Rust SIMD gRPC RocksDB CUDA Tokio 2023 - 2024 AI Research Scientist
  - heading "Chronos Predict" [level=2]
  - text: CH_CHRONOS
  - paragraph: Spatio-Temporal GNN for Continental Energy Grids
  - paragraph: Energy grid balancing requires forecasting millions of fluctuating nodes in real-time. At Chronos, we developed a spatio-temporal deep learning network to predict grid load and renewable energy production surges.
  - paragraph: We combined Graph Neural Networks (GNNs) to model the physical topology of the grid with Temporal Transformers to capture time-series trends (weather patterns, consumer usage cycles) across multiple scales.
  - paragraph: The inference pipeline was engineered to ingest millions of IoT sensor readings per second via Kafka, run real-time inference in under 50ms, and feed predictions directly into automated grid control loops, preventing localized overloads and blackouts.
  - text: 94.8% Prediction Accuracy Mean absolute percentage error 10M/s Sensor Ingestion Real-time IoT events processed 45ms Inference Loop End-to-end forecasting latency
  - heading "CORE_SCHEMATIC_TECH" [level=4]
  - text: "Python PyTorch PyTorch Geometric Kafka Kubernetes Triton STAGE_FIN HANDSHAKE: OPEN"
  - heading "SECURE CONNECTION WITH THE ARCHITECT." [level=2]
  - paragraph: Direct pathways are open for technical collaborations, venture advisory, or custom system designs.
  - text: "ADDR:"
  - link "hello@example.com":
    - /url: mailto:hello@example.com
  - text: "GITH:"
  - link "github.com/architect":
    - /url: https://github.com
  - text: "LINK:"
  - link "linkedin.com/in/architect":
    - /url: https://linkedin.com
- complementary:
  - text: "SYS_MODE: INITIALIZING SYS_STATUS: OPTIMAL SYS_HZ: 62 FPS PING: 45ms BUFF_OK: 100%"
  - img
  - text: SYSTEM CORE WebGL Swarm Parallax Grid CAD Reticle Spline Path
```

# Test source

```ts
  210 |       await emailLink.focus();
  211 |       // Should not crash the page when Enter is pressed
  212 |       await page.keyboard.press('Enter');
  213 |       await expect(emailLink).toBeVisible();
  214 |     });
  215 | 
  216 |     test('rapid hover and unhover of contact links does not crash cursor', async ({ page }) => {
  217 |       const emailLink = page.locator('#connect a[href^="mailto:"]');
  218 |       await emailLink.scrollIntoViewIfNeeded();
  219 |       const box = await emailLink.boundingBox();
  220 |       if (box) {
  221 |         for (let i = 0; i < 5; i++) {
  222 |           await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  223 |           await page.mouse.move(box.x - 100, box.y - 100);
  224 |         }
  225 |       }
  226 |       const cursor = page.locator('[data-testid="custom-cursor"]');
  227 |       await expect(cursor).toBeVisible();
  228 |     });
  229 |   });
  230 | 
  231 |   // 6. Terminal Console (5 tests)
  232 |   test.describe('6. Terminal Console Boundaries', () => {
  233 |     test('should wrap or truncate long log lines', async ({ page }) => {
  234 |       const consoleWrapper = page.locator('[data-testid="terminal-console"]');
  235 |       const isScrollableX = await consoleWrapper.evaluate((el) => el.scrollWidth > el.clientWidth + 5);
  236 |       // Terminal should wrap text rather than scroll horizontally
  237 |       expect(isScrollableX).toBe(false);
  238 |     });
  239 | 
  240 |     test('log buffer should be capped at max lines', async ({ page }) => {
  241 |       // Trigger multiple logs by scrolling
  242 |       await page.evaluate(() => {
  243 |         window.scrollTo(0, 500);
  244 |         window.scrollTo(0, 1000);
  245 |         window.scrollTo(0, 1500);
  246 |       });
  247 |       const logLines = page.locator('[data-testid="terminal-console"] [data-testid="terminal-log-line"]');
  248 |       const count = await logLines.count();
  249 |       expect(count).toBeLessThanOrEqual(50); // Capped at 50 or similar max log lines
  250 |     });
  251 | 
  252 |     test('high frequency log updates should not degrade performance', async ({ page }) => {
  253 |       // Simulate fast scroll triggering logs
  254 |       await page.evaluate(async () => {
  255 |         for (let i = 0; i < 20; i++) {
  256 |           window.scrollTo(0, i * 100);
  257 |           await new Promise((r) => setTimeout(r, 10));
  258 |         }
  259 |       });
  260 |       const terminal = page.locator('[data-testid="terminal-console"]');
  261 |       await expect(terminal).toBeVisible();
  262 |     });
  263 | 
  264 |     test('resizing window recalculates terminal layout', async ({ page }) => {
  265 |       await page.setViewportSize({ width: 800, height: 600 });
  266 |       const terminal = page.locator('[data-testid="terminal-console"]');
  267 |       await expect(terminal).toBeVisible();
  268 |       await page.setViewportSize({ width: 1440, height: 900 });
  269 |       await expect(terminal).toBeVisible();
  270 |     });
  271 | 
  272 |     test('collapsing terminal preserves log history', async ({ page }) => {
  273 |       const toggleBtn = page.locator('[data-testid="terminal-toggle"]');
  274 |       if (await toggleBtn.isVisible()) {
  275 |         await toggleBtn.click(); // Collapse
  276 |         await toggleBtn.click(); // Expand
  277 |         const bootLog = page.locator('[data-testid="terminal-console"]').getByText('SYS: Booting Core Decryptor');
  278 |         await expect(bootLog).toBeVisible();
  279 |       }
  280 |     });
  281 |   });
  282 | 
  283 |   // 7. Custom Cursor (5 tests)
  284 |   test.describe('7. Custom Cursor Boundaries', () => {
  285 |     test('moving mouse outside window should hide cursor', async ({ page }) => {
  286 |       const cursor = page.locator('[data-testid="custom-cursor"]');
  287 |       // Move mouse out of viewport (negative coordinates)
  288 |       await page.mouse.move(-10, -10);
  289 |       const opacity = await cursor.evaluate((el) => window.getComputedStyle(el).opacity);
  290 |       expect(parseFloat(opacity)).toBe(0);
  291 |     });
  292 | 
  293 |     test('touch devices should hide custom cursor', async ({ page }) => {
  294 |       // Emulate mobile device or touch support
  295 |       const hasTouch = await page.evaluate(() => {
  296 |         return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  297 |       });
  298 |       if (hasTouch) {
  299 |         const cursor = page.locator('[data-testid="custom-cursor"]');
  300 |         await expect(cursor).toBeHidden();
  301 |       }
  302 |     });
  303 | 
  304 |     test('extreme mouse speeds should not cause reticle lag beyond LERP', async ({ page }) => {
  305 |       await page.mouse.move(0, 0);
  306 |       await page.mouse.move(1000, 1000);
  307 |       const coords = page.locator('[data-testid="cursor-coords"]');
  308 |       // Wait for LERP to catch up
  309 |       await page.waitForTimeout(200);
> 310 |       await expect(coords).toHaveText(/X:\s*1000\s+Y:\s*1000/);
      |                            ^ Error: expect(locator).toHaveText(expected) failed
  311 |     });
  312 | 
  313 |     test('cursor should not block pointer events', async ({ page }) => {
  314 |       const cursor = page.locator('[data-testid="custom-cursor"]');
  315 |       const pointerEvents = await cursor.evaluate((el) => window.getComputedStyle(el).pointerEvents);
  316 |       expect(pointerEvents).toBe('none');
  317 |     });
  318 | 
  319 |     test('cursor handles dragging events gracefully', async ({ page }) => {
  320 |       await page.mouse.move(100, 100);
  321 |       await page.mouse.down();
  322 |       await page.mouse.move(300, 300);
  323 |       await page.mouse.up();
  324 |       const cursor = page.locator('[data-testid="custom-cursor"]');
  325 |       await expect(cursor).toBeVisible();
  326 |     });
  327 |   });
  328 | 
  329 |   // 8. Smooth Scroll (5 tests)
  330 |   test.describe('8. Smooth Scroll Boundaries', () => {
  331 |     test('scrolling past bottom boundary is handled gracefully', async ({ page }) => {
  332 |       await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight + 500));
  333 |       const scrollY = await page.evaluate(() => window.scrollY);
  334 |       const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  335 |       expect(scrollY).toBeLessThanOrEqual(maxScroll + 10);
  336 |     });
  337 | 
  338 |     test('high frequency trackpad scroll does not cause jitter', async ({ page }) => {
  339 |       await page.evaluate(() => {
  340 |         let y = 0;
  341 |         const interval = setInterval(() => {
  342 |           y += 50;
  343 |           window.scrollTo(0, y);
  344 |           if (y > 1000) clearInterval(interval);
  345 |         }, 5);
  346 |       });
  347 |       await page.waitForTimeout(200);
  348 |       const scrollY = await page.evaluate(() => window.scrollY);
  349 |       expect(scrollY).toBeGreaterThan(0);
  350 |     });
  351 | 
  352 |     test('keyboard scrolling coordinates with scroll progress', async ({ page }) => {
  353 |       await page.locator('body').click();
  354 |       await page.keyboard.press('PageDown');
  355 |       await page.waitForTimeout(500); // Wait for smooth scroll
  356 |       const scrollY = await page.evaluate(() => window.scrollY);
  357 |       expect(scrollY).toBeGreaterThan(0);
  358 |     });
  359 | 
  360 |     test('scroll animations pause when tab is backgrounded', async ({ page }) => {
  361 |       // In Playwright, we can simulate tab visibility change
  362 |       await page.evaluate(() => {
  363 |         Object.defineProperty(document, 'hidden', { value: true, writable: true });
  364 |         document.dispatchEvent(new Event('visibilitychange'));
  365 |       });
  366 |       // Perform scroll
  367 |       await page.evaluate(() => window.scrollTo(0, 200));
  368 |       // Restore
  369 |       await page.evaluate(() => {
  370 |         Object.defineProperty(document, 'hidden', { value: false });
  371 |         document.dispatchEvent(new Event('visibilitychange'));
  372 |       });
  373 |       const scrollY = await page.evaluate(() => window.scrollY);
  374 |       expect(scrollY).toBe(200);
  375 |     });
  376 | 
  377 |     test('dynamic height changes recalculate scroll boundaries', async ({ page }) => {
  378 |       const initialHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  379 |       await page.evaluate(() => {
  380 |         const extra = document.createElement('div');
  381 |         extra.style.height = '1000px';
  382 |         extra.setAttribute('id', 'temp-extra-height');
  383 |         document.body.appendChild(extra);
  384 |       });
  385 |       const newHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  386 |       expect(newHeight).toBeGreaterThan(initialHeight);
  387 |       // Cleanup
  388 |       await page.evaluate(() => document.getElementById('temp-extra-height')?.remove());
  389 |     });
  390 |   });
  391 | 
  392 |   // 9. 3D Canvas (5 tests)
  393 |   test.describe('9. 3D Canvas Boundaries', () => {
  394 |     test('should handle context loss and recovery', async ({ page }) => {
  395 |       const glLost = await page.evaluate(() => {
  396 |         const canvas = document.querySelector('.right-column canvas') as HTMLCanvasElement;
  397 |         const gl = canvas?.getContext('webgl') || canvas?.getContext('webgl2');
  398 |         if (!gl) return false;
  399 |         const ext = gl.getExtension('WEBGL_lose_context');
  400 |         if (ext) {
  401 |           ext.loseContext();
  402 |           return true;
  403 |         }
  404 |         return false;
  405 |       });
  406 |       // Should lose context successfully, and application should not crash
  407 |       expect(glLost).toBe(true);
  408 |     });
  409 | 
  410 |     test('low-spec GPU emulation falls back to static layout', async ({ page }) => {
```