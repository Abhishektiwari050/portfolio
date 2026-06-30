# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier1-features.spec.ts >> Tier 1: Feature Coverage >> 9. 3D Canvas Rendering >> should render correct particle density
- Location: e2e\tier1-features.spec.ts:285:5

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 50000
Received:    0
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
  190 | 
  191 |     test('should follow mouse movement', async ({ page }) => {
  192 |       const cursor = page.locator('[data-testid="custom-cursor"]');
  193 |       await page.mouse.move(200, 250);
  194 |       // Reticle position check (inline styles)
  195 |       const style = await cursor.getAttribute('style');
  196 |       expect(style).toContain('transform');
  197 |     });
  198 | 
  199 |     test('should show coordinates readout', async ({ page }) => {
  200 |       const coords = page.locator('[data-testid="cursor-coords"]');
  201 |       await expect(coords).toBeVisible();
  202 |     });
  203 | 
  204 |     test('should update coordinates on move', async ({ page }) => {
  205 |       const coords = page.locator('[data-testid="cursor-coords"]');
  206 |       await page.mouse.move(320, 480);
  207 |       await expect(coords).toHaveText(/X:\s*320\s+Y:\s*480/);
  208 |     });
  209 | 
  210 |     test('should trigger hover state over links', async ({ page }) => {
  211 |       const cursor = page.locator('[data-testid="custom-cursor"]');
  212 |       const emailLink = page.locator('#connect a[href^="mailto:"]');
  213 |       await emailLink.scrollIntoViewIfNeeded();
  214 |       await emailLink.hover();
  215 |       await expect(cursor).toHaveClass(/hovering/);
  216 |     });
  217 |   });
  218 | 
  219 |   // 8. Smooth Scroll (5 tests)
  220 |   test.describe('8. Smooth Scroll', () => {
  221 |     test('should render scroll progress indicator', async ({ page }) => {
  222 |       const indicator = page.locator('[data-testid="scroll-progress-bar"]');
  223 |       await expect(indicator).toBeVisible();
  224 |     });
  225 | 
  226 |     test('should have scrollable page height', async ({ page }) => {
  227 |       const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  228 |       const clientHeight = await page.evaluate(() => document.documentElement.clientHeight);
  229 |       expect(scrollHeight).toBeGreaterThan(clientHeight);
  230 |     });
  231 | 
  232 |     test('should register scroll events', async ({ page }) => {
  233 |       await page.evaluate(() => window.scrollTo(0, 100));
  234 |       const scrollY = await page.evaluate(() => window.scrollY);
  235 |       expect(scrollY).toBeGreaterThan(0);
  236 |     });
  237 | 
  238 |     test('should update scroll progress on scroll', async ({ page }) => {
  239 |       const indicator = page.locator('[data-testid="scroll-progress-bar"]');
  240 |       await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
  241 |       const style = await indicator.getAttribute('style');
  242 |       expect(style).toContain('transform'); // e.g. scaleX or translate
  243 |     });
  244 | 
  245 |     test('should update section opacities on scroll', async ({ page }) => {
  246 |       const intro = page.locator('#intro');
  247 |       await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
  248 |       const opacity = await intro.evaluate((el) => window.getComputedStyle(el).opacity);
  249 |       expect(parseFloat(opacity)).toBeLessThan(1);
  250 |     });
  251 |   });
  252 | 
  253 |   // 9. 3D Canvas Rendering (5 tests)
  254 |   test.describe('9. 3D Canvas Rendering', () => {
  255 |     test('should render canvas in right column', async ({ page }) => {
  256 |       const canvas = page.locator('.right-column canvas');
  257 |       await expect(canvas).toBeVisible();
  258 |     });
  259 | 
  260 |     test('should initialize WebGL context', async ({ page }) => {
  261 |       const hasWebGL = await page.evaluate(() => {
  262 |         const canvas = document.querySelector('.right-column canvas') as HTMLCanvasElement;
  263 |         if (!canvas) return false;
  264 |         return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'));
  265 |       });
  266 |       expect(hasWebGL).toBe(true);
  267 |     });
  268 | 
  269 |     test('should match canvas dimensions to container', async ({ page }) => {
  270 |       const canvas = page.locator('.right-column canvas');
  271 |       const boundingBox = await canvas.boundingBox();
  272 |       expect(boundingBox).not.toBeNull();
  273 |       expect(boundingBox!.width).toBeGreaterThan(0);
  274 |       expect(boundingBox!.height).toBeGreaterThan(0);
  275 |     });
  276 | 
  277 |     test('should compile shaders without error', async ({ page }) => {
  278 |       // Evaluate window errors or WebGL errors
  279 |       const hasErrors = await page.evaluate(() => {
  280 |         return (window as any).__webglShaderError || false;
  281 |       });
  282 |       expect(hasErrors).toBe(false);
  283 |     });
  284 | 
  285 |     test('should render correct particle density', async ({ page }) => {
  286 |       const particleCount = await page.evaluate(() => {
  287 |         return (window as any).__threeParticleCount || 0;
  288 |       });
  289 |       // Spec says 50,000+ particles
> 290 |       expect(particleCount).toBeGreaterThanOrEqual(50000);
      |                             ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  291 |     });
  292 |   });
  293 | });
  294 | 
```