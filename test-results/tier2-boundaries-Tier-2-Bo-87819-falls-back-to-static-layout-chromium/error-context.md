# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier2-boundaries.spec.ts >> Tier 2: Boundary and Corner Cases >> 9. 3D Canvas Boundaries >> low-spec GPU emulation falls back to static layout
- Location: e2e\tier2-boundaries.spec.ts:410:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.right-column canvas')
Expected: visible
Error: strict mode violation: locator('.right-column canvas') resolved to 2 elements:
    1) <canvas width="703" height="720" data-engine="three.js r185"></canvas> aka locator('canvas').first()
    2) <canvas width="703" height="720" data-engine="three.js r185"></canvas> aka locator('canvas').nth(1)

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for locator('.right-column canvas')

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
      - generic [ref=e9]: "SYS: Booting Core Decryptor..."
      - generic [ref=e10]: "SYS: Loading WebGL rendering pipelines..."
      - generic [ref=e11]: "SYS: Initializing CatmullRom spline path..."
      - generic [ref=e12]: $ _
  - main [ref=e13]:
    - generic [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e17]: INIT_STAGE_01
          - generic [ref=e18]: "AUTH: SUCCESS"
        - heading "ENGINEERING INTELLIGENT SYSTEMS." [level=1] [ref=e19]:
          - text: ENGINEERING
          - text: INTELLIGENT
          - text: SYSTEMS.
        - paragraph [ref=e20]: Personal log of an AI Systems Architect and Founder. Focused on multi-agent execution runtimes, GPU-accelerated vector indexing, and planetary-scale predictive networks.
        - generic [ref=e21]: SYS_SCROLL_TO_DECRYPT
      - generic [ref=e23]:
        - generic [ref=e24]:
          - generic [ref=e25]:
            - generic [ref=e26]:
              - generic [ref=e27]: 2025 - Present
              - generic [ref=e29]: Founder & Lead Architect
            - heading "Aetheris AI" [level=2] [ref=e30]
          - generic [ref=e32]: CH_AETHERIS
        - paragraph [ref=e33]: Decentralized Orchestration Layer for Multi-Agent Swarms
        - generic [ref=e34]:
          - generic [ref=e35]:
            - paragraph [ref=e36]: As AI models matured, the bottleneck shifted from raw intelligence to orchestration. I founded Aetheris to solve the coordination problem in complex enterprise workflows. We built a decentralized runtime that allows autonomous agents to dynamically discover, collaborate, and execute tasks.
            - paragraph [ref=e37]: The system utilizes a hierarchical coordinator agent that decomposes user goals into sub-tasks, registers them in a distributed queue, and assigns them to specialized worker agents operating within secure, ephemeral sandboxes.
            - paragraph [ref=e38]: We implemented a real-time evaluator loop that scores agent outputs before they are committed, allowing the swarm to self-correct and backtrack if a path fails. This architecture reduced task failure rates by over 80% compared to traditional linear pipelines.
          - generic [ref=e39]:
            - generic [ref=e40]:
              - generic [ref=e41]: 92.4%
              - generic [ref=e42]: Task Success
              - generic [ref=e43]: Verified goal completion rate
            - generic [ref=e44]:
              - generic [ref=e45]: 380ms
              - generic [ref=e46]: Routing Latency
              - generic [ref=e47]: Average agent routing time
            - generic [ref=e48]:
              - generic [ref=e49]: 12x
              - generic [ref=e50]: Token Efficiency
              - generic [ref=e51]: Reduction in redundant LLM calls
        - generic [ref=e52]:
          - heading "CORE_SCHEMATIC_TECH" [level=4] [ref=e53]
          - generic [ref=e54]:
            - generic [ref=e55]: TypeScript
            - generic [ref=e56]: FastAPI
            - generic [ref=e57]: LangGraph
            - generic [ref=e58]: Qdrant
            - generic [ref=e59]: Docker
            - generic [ref=e60]: Redis
      - generic [ref=e62]:
        - generic [ref=e63]:
          - generic [ref=e64]:
            - generic [ref=e65]:
              - generic [ref=e66]: 2024 - 2025
              - generic [ref=e68]: Core Systems Engineer
            - heading "Helios Engine" [level=2] [ref=e69]
          - generic [ref=e71]: CH_HELIOS
        - paragraph [ref=e72]: Rust-Based Sub-Millisecond Vector Retrieval Index
        - generic [ref=e73]:
          - generic [ref=e74]:
            - paragraph [ref=e75]: Off-the-shelf vector databases struggled with memory consumption and latency at billion-scale retrieval. I joined the Helios team to build a custom, bare-metal indexing engine in Rust.
            - paragraph [ref=e76]: We designed a custom implementation of the HNSW (Hierarchical Navigable Small World) algorithm, optimized for modern CPU cache hierarchies and SIMD vector instructions. We integrated Product Quantization (PQ) directly into the graph traversal to store compressed vectors in memory while keeping the full vectors on NVMe storage.
            - paragraph [ref=e77]: To handle high-throughput ingestion, we built a lock-free lock-step ingestion pipeline that builds index segments concurrently in memory before merging them, ensuring that search latency remained unaffected during heavy write loads.
          - generic [ref=e78]:
            - generic [ref=e79]:
              - generic [ref=e80]: 0.82ms
              - generic [ref=e81]: Query Latency
              - generic [ref=e82]: 99th percentile search time
            - generic [ref=e83]:
              - generic [ref=e84]: 1.2B
              - generic [ref=e85]: Scale
              - generic [ref=e86]: High-dimensional vectors indexed
            - generic [ref=e87]:
              - generic [ref=e88]: 10x
              - generic [ref=e89]: Memory Savings
              - generic [ref=e90]: Achieved via Product Quantization
        - generic [ref=e91]:
          - heading "CORE_SCHEMATIC_TECH" [level=4] [ref=e92]
          - generic [ref=e93]:
            - generic [ref=e94]: Rust
            - generic [ref=e95]: SIMD
            - generic [ref=e96]: gRPC
            - generic [ref=e97]: RocksDB
            - generic [ref=e98]: CUDA
            - generic [ref=e99]: Tokio
      - generic [ref=e101]:
        - generic [ref=e102]:
          - generic [ref=e103]:
            - generic [ref=e104]:
              - generic [ref=e105]: 2023 - 2024
              - generic [ref=e107]: AI Research Scientist
            - heading "Chronos Predict" [level=2] [ref=e108]
          - generic [ref=e110]: CH_CHRONOS
        - paragraph [ref=e111]: Spatio-Temporal GNN for Continental Energy Grids
        - generic [ref=e112]:
          - generic [ref=e113]:
            - paragraph [ref=e114]: Energy grid balancing requires forecasting millions of fluctuating nodes in real-time. At Chronos, we developed a spatio-temporal deep learning network to predict grid load and renewable energy production surges.
            - paragraph [ref=e115]: We combined Graph Neural Networks (GNNs) to model the physical topology of the grid with Temporal Transformers to capture time-series trends (weather patterns, consumer usage cycles) across multiple scales.
            - paragraph [ref=e116]: The inference pipeline was engineered to ingest millions of IoT sensor readings per second via Kafka, run real-time inference in under 50ms, and feed predictions directly into automated grid control loops, preventing localized overloads and blackouts.
          - generic [ref=e117]:
            - generic [ref=e118]:
              - generic [ref=e119]: 94.8%
              - generic [ref=e120]: Prediction Accuracy
              - generic [ref=e121]: Mean absolute percentage error
            - generic [ref=e122]:
              - generic [ref=e123]: 10M/s
              - generic [ref=e124]: Sensor Ingestion
              - generic [ref=e125]: Real-time IoT events processed
            - generic [ref=e126]:
              - generic [ref=e127]: 45ms
              - generic [ref=e128]: Inference Loop
              - generic [ref=e129]: End-to-end forecasting latency
        - generic [ref=e130]:
          - heading "CORE_SCHEMATIC_TECH" [level=4] [ref=e131]
          - generic [ref=e132]:
            - generic [ref=e133]: Python
            - generic [ref=e134]: PyTorch
            - generic [ref=e135]: PyTorch Geometric
            - generic [ref=e136]: Kafka
            - generic [ref=e137]: Kubernetes
            - generic [ref=e138]: Triton
      - generic [ref=e139]:
        - generic [ref=e140]:
          - generic [ref=e141]: STAGE_FIN
          - generic [ref=e142]: "HANDSHAKE: OPEN"
        - heading "SECURE CONNECTION WITH THE ARCHITECT." [level=2] [ref=e143]:
          - text: SECURE CONNECTION
          - text: WITH THE ARCHITECT.
        - paragraph [ref=e144]: Direct pathways are open for technical collaborations, venture advisory, or custom system designs.
        - generic [ref=e145]:
          - generic [ref=e146]:
            - text: "ADDR:"
            - link "hello@example.com" [ref=e147]:
              - /url: mailto:hello@example.com
          - generic [ref=e148]:
            - text: "GITH:"
            - link "github.com/architect" [ref=e149]:
              - /url: https://github.com
          - generic [ref=e150]:
            - text: "LINK:"
            - link "linkedin.com/in/architect" [ref=e151]:
              - /url: https://linkedin.com
  - complementary [ref=e152]:
    - generic [ref=e153]:
      - generic [ref=e154]: "SYS_MODE: INITIALIZING"
      - generic [ref=e155]:
        - generic [ref=e160]:
          - generic [ref=e161]: "SYS_STATUS: OPTIMAL"
          - generic [ref=e162]: "SYS_HZ: 60 FPS"
        - generic [ref=e163]:
          - generic [ref=e164]: "PING: 42ms"
          - generic [ref=e165]: "BUFF_OK: 100%"
        - img [ref=e166]
        - generic [ref=e189]: SYSTEM CORE
        - generic [ref=e193]: WebGL Swarm
        - generic [ref=e197]: Parallax Grid
        - generic [ref=e201]: CAD Reticle
        - generic [ref=e205]: Spline Path
```

# Test source

```ts
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
  411 |       // Check if fallback elements exist or canvas displays friendly message
  412 |       const canvas = page.locator('.right-column canvas');
> 413 |       await expect(canvas).toBeVisible();
      |                            ^ Error: expect(locator).toBeVisible() failed
  414 |     });
  415 | 
  416 |     test('resizing window updates camera aspect ratio instantly', async ({ page }) => {
  417 |       await page.setViewportSize({ width: 1200, height: 800 });
  418 |       const width1 = await page.locator('.right-column canvas').evaluate((el: any) => el.width);
  419 |       await page.setViewportSize({ width: 800, height: 600 });
  420 |       const width2 = await page.locator('.right-column canvas').evaluate((el: any) => el.width);
  421 |       expect(width1).not.toEqual(width2);
  422 |     });
  423 | 
  424 |     test('out-of-bounds coordinates do not crash shaders', async ({ page }) => {
  425 |       // Move mouse extremely far
  426 |       await page.mouse.move(10000, 10000);
  427 |       const canvas = page.locator('.right-column canvas');
  428 |       await expect(canvas).toBeVisible();
  429 |     });
  430 | 
  431 |     test('rendering remains stable when tab is minimized', async ({ page }) => {
  432 |       await page.evaluate(() => {
  433 |         Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
  434 |         document.dispatchEvent(new Event('visibilitychange'));
  435 |       });
  436 |       // Wait a few frames
  437 |       await page.waitForTimeout(100);
  438 |       await page.evaluate(() => {
  439 |         Object.defineProperty(document, 'visibilityState', { value: 'visible' });
  440 |         document.dispatchEvent(new Event('visibilitychange'));
  441 |       });
  442 |       const canvas = page.locator('.right-column canvas');
  443 |       await expect(canvas).toBeVisible();
  444 |     });
  445 |   });
  446 | });
  447 | 
```