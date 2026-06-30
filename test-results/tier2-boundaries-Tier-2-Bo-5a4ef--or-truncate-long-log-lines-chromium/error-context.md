# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier2-boundaries.spec.ts >> Tier 2: Boundary and Corner Cases >> 6. Terminal Console Boundaries >> should wrap or truncate long log lines
- Location: e2e\tier2-boundaries.spec.ts:233:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.evaluate: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-testid="terminal-console"]')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic:
    - generic: X:0 Y:0
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: ">_ Agent_Console_Stream"
      - generic [ref=e7]: Online
    - generic [ref=e8]:
      - generic [ref=e9]: "[10:52:25] SYS: System ready. Scroll to decrypt chronicles."
      - generic [ref=e10]: "[10:52:27] SYS: Booting Core Decryptor..."
      - generic [ref=e11]: "[10:52:29] SYS: Loading WebGL rendering pipelines..."
      - generic [ref=e12]: "[10:52:31] SYS: Initializing CatmullRom spline path..."
      - generic [ref=e13]: "[10:52:33] SYS: Calibrating CAD coordinate reticle..."
      - generic [ref=e14]: $ _
  - main [ref=e15]:
    - generic [ref=e16]:
      - generic [ref=e17]:
        - generic [ref=e18]:
          - generic [ref=e19]: INIT_STAGE_01
          - generic [ref=e20]: "AUTH: SUCCESS"
        - heading "ENGINEERING INTELLIGENT SYSTEMS." [level=1] [ref=e21]:
          - text: ENGINEERING
          - text: INTELLIGENT
          - text: SYSTEMS.
        - paragraph [ref=e22]: Personal log of an AI Systems Architect and Founder. Focused on multi-agent execution runtimes, GPU-accelerated vector indexing, and planetary-scale predictive networks.
        - generic [ref=e23]: SYS_SCROLL_TO_DECRYPT
      - generic [ref=e25]:
        - generic [ref=e26]:
          - generic [ref=e27]:
            - generic [ref=e28]:
              - generic [ref=e29]: 2025 - Present
              - generic [ref=e31]: Founder & Lead Architect
            - heading "Aetheris AI" [level=2] [ref=e32]
          - generic [ref=e34]: CH_AETHERIS
        - paragraph [ref=e35]: Decentralized Orchestration Layer for Multi-Agent Swarms
        - generic [ref=e36]:
          - generic [ref=e37]:
            - paragraph [ref=e38]: As AI models matured, the bottleneck shifted from raw intelligence to orchestration. I founded Aetheris to solve the coordination problem in complex enterprise workflows. We built a decentralized runtime that allows autonomous agents to dynamically discover, collaborate, and execute tasks.
            - paragraph [ref=e39]: The system utilizes a hierarchical coordinator agent that decomposes user goals into sub-tasks, registers them in a distributed queue, and assigns them to specialized worker agents operating within secure, ephemeral sandboxes.
            - paragraph [ref=e40]: We implemented a real-time evaluator loop that scores agent outputs before they are committed, allowing the swarm to self-correct and backtrack if a path fails. This architecture reduced task failure rates by over 80% compared to traditional linear pipelines.
          - generic [ref=e41]:
            - generic [ref=e42]:
              - generic [ref=e43]: 92.4%
              - generic [ref=e44]: Task Success
              - generic [ref=e45]: Verified goal completion rate
            - generic [ref=e46]:
              - generic [ref=e47]: 380ms
              - generic [ref=e48]: Routing Latency
              - generic [ref=e49]: Average agent routing time
            - generic [ref=e50]:
              - generic [ref=e51]: 12x
              - generic [ref=e52]: Token Efficiency
              - generic [ref=e53]: Reduction in redundant LLM calls
        - generic [ref=e54]:
          - heading "CORE_SCHEMATIC_TECH" [level=4] [ref=e55]
          - generic [ref=e56]:
            - generic [ref=e57]: TypeScript
            - generic [ref=e58]: FastAPI
            - generic [ref=e59]: LangGraph
            - generic [ref=e60]: Qdrant
            - generic [ref=e61]: Docker
            - generic [ref=e62]: Redis
      - generic [ref=e64]:
        - generic [ref=e65]:
          - generic [ref=e66]:
            - generic [ref=e67]:
              - generic [ref=e68]: 2024 - 2025
              - generic [ref=e70]: Core Systems Engineer
            - heading "Helios Engine" [level=2] [ref=e71]
          - generic [ref=e73]: CH_HELIOS
        - paragraph [ref=e74]: Rust-Based Sub-Millisecond Vector Retrieval Index
        - generic [ref=e75]:
          - generic [ref=e76]:
            - paragraph [ref=e77]: Off-the-shelf vector databases struggled with memory consumption and latency at billion-scale retrieval. I joined the Helios team to build a custom, bare-metal indexing engine in Rust.
            - paragraph [ref=e78]: We designed a custom implementation of the HNSW (Hierarchical Navigable Small World) algorithm, optimized for modern CPU cache hierarchies and SIMD vector instructions. We integrated Product Quantization (PQ) directly into the graph traversal to store compressed vectors in memory while keeping the full vectors on NVMe storage.
            - paragraph [ref=e79]: To handle high-throughput ingestion, we built a lock-free lock-step ingestion pipeline that builds index segments concurrently in memory before merging them, ensuring that search latency remained unaffected during heavy write loads.
          - generic [ref=e80]:
            - generic [ref=e81]:
              - generic [ref=e82]: 0.82ms
              - generic [ref=e83]: Query Latency
              - generic [ref=e84]: 99th percentile search time
            - generic [ref=e85]:
              - generic [ref=e86]: 1.2B
              - generic [ref=e87]: Scale
              - generic [ref=e88]: High-dimensional vectors indexed
            - generic [ref=e89]:
              - generic [ref=e90]: 10x
              - generic [ref=e91]: Memory Savings
              - generic [ref=e92]: Achieved via Product Quantization
        - generic [ref=e93]:
          - heading "CORE_SCHEMATIC_TECH" [level=4] [ref=e94]
          - generic [ref=e95]:
            - generic [ref=e96]: Rust
            - generic [ref=e97]: SIMD
            - generic [ref=e98]: gRPC
            - generic [ref=e99]: RocksDB
            - generic [ref=e100]: CUDA
            - generic [ref=e101]: Tokio
      - generic [ref=e103]:
        - generic [ref=e104]:
          - generic [ref=e105]:
            - generic [ref=e106]:
              - generic [ref=e107]: 2023 - 2024
              - generic [ref=e109]: AI Research Scientist
            - heading "Chronos Predict" [level=2] [ref=e110]
          - generic [ref=e112]: CH_CHRONOS
        - paragraph [ref=e113]: Spatio-Temporal GNN for Continental Energy Grids
        - generic [ref=e114]:
          - generic [ref=e115]:
            - paragraph [ref=e116]: Energy grid balancing requires forecasting millions of fluctuating nodes in real-time. At Chronos, we developed a spatio-temporal deep learning network to predict grid load and renewable energy production surges.
            - paragraph [ref=e117]: We combined Graph Neural Networks (GNNs) to model the physical topology of the grid with Temporal Transformers to capture time-series trends (weather patterns, consumer usage cycles) across multiple scales.
            - paragraph [ref=e118]: The inference pipeline was engineered to ingest millions of IoT sensor readings per second via Kafka, run real-time inference in under 50ms, and feed predictions directly into automated grid control loops, preventing localized overloads and blackouts.
          - generic [ref=e119]:
            - generic [ref=e120]:
              - generic [ref=e121]: 94.8%
              - generic [ref=e122]: Prediction Accuracy
              - generic [ref=e123]: Mean absolute percentage error
            - generic [ref=e124]:
              - generic [ref=e125]: 10M/s
              - generic [ref=e126]: Sensor Ingestion
              - generic [ref=e127]: Real-time IoT events processed
            - generic [ref=e128]:
              - generic [ref=e129]: 45ms
              - generic [ref=e130]: Inference Loop
              - generic [ref=e131]: End-to-end forecasting latency
        - generic [ref=e132]:
          - heading "CORE_SCHEMATIC_TECH" [level=4] [ref=e133]
          - generic [ref=e134]:
            - generic [ref=e135]: Python
            - generic [ref=e136]: PyTorch
            - generic [ref=e137]: PyTorch Geometric
            - generic [ref=e138]: Kafka
            - generic [ref=e139]: Kubernetes
            - generic [ref=e140]: Triton
      - generic [ref=e141]:
        - generic [ref=e142]:
          - generic [ref=e143]: STAGE_FIN
          - generic [ref=e144]: "HANDSHAKE: OPEN"
        - heading "SECURE CONNECTION WITH THE ARCHITECT." [level=2] [ref=e145]:
          - text: SECURE CONNECTION
          - text: WITH THE ARCHITECT.
        - paragraph [ref=e146]: Direct pathways are open for technical collaborations, venture advisory, or custom system designs.
        - generic [ref=e147]:
          - generic [ref=e148]:
            - text: "ADDR:"
            - link "hello@example.com" [ref=e149]:
              - /url: mailto:hello@example.com
          - generic [ref=e150]:
            - text: "GITH:"
            - link "github.com/architect" [ref=e151]:
              - /url: https://github.com
          - generic [ref=e152]:
            - text: "LINK:"
            - link "linkedin.com/in/architect" [ref=e153]:
              - /url: https://linkedin.com
  - complementary [ref=e154]:
    - generic [ref=e155]:
      - generic [ref=e156]: "SYS_MODE: INITIALIZING"
      - generic [ref=e157]:
        - generic [ref=e162]:
          - generic [ref=e163]: "SYS_STATUS: OPTIMAL"
          - generic [ref=e164]: "SYS_HZ: 58 FPS"
        - generic [ref=e165]:
          - generic [ref=e166]: "PING: 41ms"
          - generic [ref=e167]: "BUFF_OK: 100%"
        - img [ref=e168]
        - generic [ref=e191]: SYSTEM CORE
        - generic [ref=e195]: WebGL Swarm
        - generic [ref=e199]: Parallax Grid
        - generic [ref=e203]: CAD Reticle
        - generic [ref=e207]: Spline Path
```

# Test source

```ts
  135 |   // 4. Chronos Predict Section (5 tests)
  136 |   test.describe('4. Chronos Predict Boundaries', () => {
  137 |     test('rapid scrolling past should not freeze card state', async ({ page }) => {
  138 |       await page.evaluate(() => {
  139 |         window.scrollTo(0, 2500);
  140 |         window.scrollTo(0, 0);
  141 |       });
  142 |       const card = page.locator('#chronos .bento-card');
  143 |       await expect(card).toBeVisible();
  144 |     });
  145 | 
  146 |     test('ultrawide viewport should keep card aligned', async ({ page }) => {
  147 |       await page.setViewportSize({ width: 2560, height: 1440 });
  148 |       const card = page.locator('#chronos .bento-card');
  149 |       const box = await card.boundingBox();
  150 |       expect(box).not.toBeNull();
  151 |     });
  152 | 
  153 |     test('text overflow should not break bento card bounds', async ({ page }) => {
  154 |       const card = page.locator('#chronos .bento-card');
  155 |       const isOverflowing = await card.evaluate((el) => el.scrollHeight > el.clientHeight + 10);
  156 |       expect(isOverflowing).toBe(false);
  157 |     });
  158 | 
  159 |     test('hovering card boundary exactly should not flicker hover', async ({ page }) => {
  160 |       const card = page.locator('#chronos .bento-card');
  161 |       const box = await card.boundingBox();
  162 |       if (box) {
  163 |         await page.mouse.move(box.x, box.y);
  164 |       }
  165 |       await expect(card).toBeVisible();
  166 |     });
  167 | 
  168 |     test('should handle empty tech stack gracefully', async ({ page }) => {
  169 |       const techElements = page.locator('#chronos').locator('span');
  170 |       const count = await techElements.count();
  171 |       expect(count).toBeGreaterThan(0);
  172 |     });
  173 |   });
  174 | 
  175 |   // 5. Contact Section / Form (5 tests)
  176 |   test.describe('5. Contact Section Boundaries', () => {
  177 |     test('copying contact links should work', async ({ page, context }) => {
  178 |       await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  179 |       const emailLink = page.locator('#connect a[href^="mailto:"]');
  180 |       await emailLink.scrollIntoViewIfNeeded();
  181 |       // Right click or click to copy, or verify copy behavior if clipboard-copy is implemented
  182 |       await expect(emailLink).toBeVisible();
  183 |     });
  184 | 
  185 |     test('right clicking links should not break cursor lock state', async ({ page }) => {
  186 |       const emailLink = page.locator('#connect a[href^="mailto:"]');
  187 |       await emailLink.scrollIntoViewIfNeeded();
  188 |       await emailLink.click({ button: 'right' });
  189 |       const cursor = page.locator('[data-testid="custom-cursor"]');
  190 |       await expect(cursor).toBeVisible();
  191 |     });
  192 | 
  193 |     test('keyboard navigation can focus contact links', async ({ page }) => {
  194 |       await page.keyboard.press('Tab');
  195 |       // Tab until a link in connect is focused
  196 |       let focusedHref = '';
  197 |       for (let i = 0; i < 20; i++) {
  198 |         await page.keyboard.press('Tab');
  199 |         focusedHref = await page.evaluate(() => (document.activeElement as any)?.href || '');
  200 |         if (focusedHref.includes('mailto') || focusedHref.includes('github') || focusedHref.includes('linkedin')) {
  201 |           break;
  202 |         }
  203 |       }
  204 |       expect(focusedHref).not.toBe('');
  205 |     });
  206 | 
  207 |     test('pressing Enter on focused links should trigger action', async ({ page }) => {
  208 |       const emailLink = page.locator('#connect a[href^="mailto:"]');
  209 |       await emailLink.scrollIntoViewIfNeeded();
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
> 235 |       const isScrollableX = await consoleWrapper.evaluate((el) => el.scrollWidth > el.clientWidth + 5);
      |                                                  ^ Error: locator.evaluate: Test timeout of 30000ms exceeded.
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
  310 |       await expect(coords).toHaveText(/X:\s*1000\s+Y:\s*1000/);
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
```