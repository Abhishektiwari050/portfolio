# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier1-features.spec.ts >> Tier 1: Feature Coverage >> 8. Smooth Scroll >> should update section opacities on scroll
- Location: e2e\tier1-features.spec.ts:245:5

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 1
Received:   1
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
      - generic [ref=e12]: "[10:51:24] SYS: Booting Core Decryptor..."
      - generic [ref=e13]: $ _
  - main [ref=e14]:
    - generic [ref=e15]:
      - generic [ref=e16]:
        - generic [ref=e17]:
          - generic [ref=e18]: INIT_STAGE_01
          - generic [ref=e19]: "AUTH: SUCCESS"
        - heading "ENGINEERING INTELLIGENT SYSTEMS." [level=1] [ref=e20]:
          - text: ENGINEERING
          - text: INTELLIGENT
          - text: SYSTEMS.
        - paragraph [ref=e21]: Personal log of an AI Systems Architect and Founder. Focused on multi-agent execution runtimes, GPU-accelerated vector indexing, and planetary-scale predictive networks.
        - generic [ref=e22]: SYS_SCROLL_TO_DECRYPT
      - generic [ref=e24]:
        - generic [ref=e25]:
          - generic [ref=e26]:
            - generic [ref=e27]:
              - generic [ref=e28]: 2025 - Present
              - generic [ref=e30]: Founder & Lead Architect
            - heading "Aetheris AI" [level=2] [ref=e31]
          - generic [ref=e33]: CH_AETHERIS
        - paragraph [ref=e34]: Decentralized Orchestration Layer for Multi-Agent Swarms
        - generic [ref=e35]:
          - generic [ref=e36]:
            - paragraph [ref=e37]: As AI models matured, the bottleneck shifted from raw intelligence to orchestration. I founded Aetheris to solve the coordination problem in complex enterprise workflows. We built a decentralized runtime that allows autonomous agents to dynamically discover, collaborate, and execute tasks.
            - paragraph [ref=e38]: The system utilizes a hierarchical coordinator agent that decomposes user goals into sub-tasks, registers them in a distributed queue, and assigns them to specialized worker agents operating within secure, ephemeral sandboxes.
            - paragraph [ref=e39]: We implemented a real-time evaluator loop that scores agent outputs before they are committed, allowing the swarm to self-correct and backtrack if a path fails. This architecture reduced task failure rates by over 80% compared to traditional linear pipelines.
          - generic [ref=e40]:
            - generic [ref=e41]:
              - generic [ref=e42]: 92.4%
              - generic [ref=e43]: Task Success
              - generic [ref=e44]: Verified goal completion rate
            - generic [ref=e45]:
              - generic [ref=e46]: 380ms
              - generic [ref=e47]: Routing Latency
              - generic [ref=e48]: Average agent routing time
            - generic [ref=e49]:
              - generic [ref=e50]: 12x
              - generic [ref=e51]: Token Efficiency
              - generic [ref=e52]: Reduction in redundant LLM calls
        - generic [ref=e53]:
          - heading "CORE_SCHEMATIC_TECH" [level=4] [ref=e54]
          - generic [ref=e55]:
            - generic [ref=e56]: TypeScript
            - generic [ref=e57]: FastAPI
            - generic [ref=e58]: LangGraph
            - generic [ref=e59]: Qdrant
            - generic [ref=e60]: Docker
            - generic [ref=e61]: Redis
      - generic [ref=e63]:
        - generic [ref=e64]:
          - generic [ref=e65]:
            - generic [ref=e66]:
              - generic [ref=e67]: 2024 - 2025
              - generic [ref=e69]: Core Systems Engineer
            - heading "Helios Engine" [level=2] [ref=e70]
          - generic [ref=e72]: CH_HELIOS
        - paragraph [ref=e73]: Rust-Based Sub-Millisecond Vector Retrieval Index
        - generic [ref=e74]:
          - generic [ref=e75]:
            - paragraph [ref=e76]: Off-the-shelf vector databases struggled with memory consumption and latency at billion-scale retrieval. I joined the Helios team to build a custom, bare-metal indexing engine in Rust.
            - paragraph [ref=e77]: We designed a custom implementation of the HNSW (Hierarchical Navigable Small World) algorithm, optimized for modern CPU cache hierarchies and SIMD vector instructions. We integrated Product Quantization (PQ) directly into the graph traversal to store compressed vectors in memory while keeping the full vectors on NVMe storage.
            - paragraph [ref=e78]: To handle high-throughput ingestion, we built a lock-free lock-step ingestion pipeline that builds index segments concurrently in memory before merging them, ensuring that search latency remained unaffected during heavy write loads.
          - generic [ref=e79]:
            - generic [ref=e80]:
              - generic [ref=e81]: 0.82ms
              - generic [ref=e82]: Query Latency
              - generic [ref=e83]: 99th percentile search time
            - generic [ref=e84]:
              - generic [ref=e85]: 1.2B
              - generic [ref=e86]: Scale
              - generic [ref=e87]: High-dimensional vectors indexed
            - generic [ref=e88]:
              - generic [ref=e89]: 10x
              - generic [ref=e90]: Memory Savings
              - generic [ref=e91]: Achieved via Product Quantization
        - generic [ref=e92]:
          - heading "CORE_SCHEMATIC_TECH" [level=4] [ref=e93]
          - generic [ref=e94]:
            - generic [ref=e95]: Rust
            - generic [ref=e96]: SIMD
            - generic [ref=e97]: gRPC
            - generic [ref=e98]: RocksDB
            - generic [ref=e99]: CUDA
            - generic [ref=e100]: Tokio
      - generic [ref=e102]:
        - generic [ref=e103]:
          - generic [ref=e104]:
            - generic [ref=e105]:
              - generic [ref=e106]: 2023 - 2024
              - generic [ref=e108]: AI Research Scientist
            - heading "Chronos Predict" [level=2] [ref=e109]
          - generic [ref=e111]: CH_CHRONOS
        - paragraph [ref=e112]: Spatio-Temporal GNN for Continental Energy Grids
        - generic [ref=e113]:
          - generic [ref=e114]:
            - paragraph [ref=e115]: Energy grid balancing requires forecasting millions of fluctuating nodes in real-time. At Chronos, we developed a spatio-temporal deep learning network to predict grid load and renewable energy production surges.
            - paragraph [ref=e116]: We combined Graph Neural Networks (GNNs) to model the physical topology of the grid with Temporal Transformers to capture time-series trends (weather patterns, consumer usage cycles) across multiple scales.
            - paragraph [ref=e117]: The inference pipeline was engineered to ingest millions of IoT sensor readings per second via Kafka, run real-time inference in under 50ms, and feed predictions directly into automated grid control loops, preventing localized overloads and blackouts.
          - generic [ref=e118]:
            - generic [ref=e119]:
              - generic [ref=e120]: 94.8%
              - generic [ref=e121]: Prediction Accuracy
              - generic [ref=e122]: Mean absolute percentage error
            - generic [ref=e123]:
              - generic [ref=e124]: 10M/s
              - generic [ref=e125]: Sensor Ingestion
              - generic [ref=e126]: Real-time IoT events processed
            - generic [ref=e127]:
              - generic [ref=e128]: 45ms
              - generic [ref=e129]: Inference Loop
              - generic [ref=e130]: End-to-end forecasting latency
        - generic [ref=e131]:
          - heading "CORE_SCHEMATIC_TECH" [level=4] [ref=e132]
          - generic [ref=e133]:
            - generic [ref=e134]: Python
            - generic [ref=e135]: PyTorch
            - generic [ref=e136]: PyTorch Geometric
            - generic [ref=e137]: Kafka
            - generic [ref=e138]: Kubernetes
            - generic [ref=e139]: Triton
      - generic [ref=e140]:
        - generic [ref=e141]:
          - generic [ref=e142]: STAGE_FIN
          - generic [ref=e143]: "HANDSHAKE: OPEN"
        - heading "SECURE CONNECTION WITH THE ARCHITECT." [level=2] [ref=e144]:
          - text: SECURE CONNECTION
          - text: WITH THE ARCHITECT.
        - paragraph [ref=e145]: Direct pathways are open for technical collaborations, venture advisory, or custom system designs.
        - generic [ref=e146]:
          - generic [ref=e147]:
            - text: "ADDR:"
            - link "hello@example.com" [ref=e148]:
              - /url: mailto:hello@example.com
          - generic [ref=e149]:
            - text: "GITH:"
            - link "github.com/architect" [ref=e150]:
              - /url: https://github.com
          - generic [ref=e151]:
            - text: "LINK:"
            - link "linkedin.com/in/architect" [ref=e152]:
              - /url: https://linkedin.com
  - complementary [ref=e153]:
    - generic [ref=e154]:
      - generic [ref=e155]: "SYS_MODE: INITIALIZING"
      - generic [ref=e156]:
        - generic [ref=e161]:
          - generic [ref=e162]: "SYS_STATUS: OPTIMAL"
          - generic [ref=e163]: "SYS_HZ: 60 FPS"
        - generic [ref=e164]:
          - generic [ref=e165]: "PING: 42ms"
          - generic [ref=e166]: "BUFF_OK: 100%"
        - img [ref=e167]
        - generic [ref=e190]: SYSTEM CORE
        - generic [ref=e194]: WebGL Swarm
        - generic [ref=e198]: Parallax Grid
        - generic [ref=e202]: CAD Reticle
        - generic [ref=e206]: Spline Path
```

# Test source

```ts
  149 | 
  150 |     test('should show linkedin link', async ({ page }) => {
  151 |       const linkedinLink = page.locator('#connect a[href*="linkedin.com"]');
  152 |       await expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/architect');
  153 |     });
  154 |   });
  155 | 
  156 |   // 6. Terminal Console (5 tests)
  157 |   test.describe('6. Terminal Console', () => {
  158 |     test('should render terminal console', async ({ page }) => {
  159 |       const consoleWrapper = page.locator('[data-testid="terminal-console"]');
  160 |       await expect(consoleWrapper).toBeVisible();
  161 |     });
  162 | 
  163 |     test('should show terminal title', async ({ page }) => {
  164 |       const title = page.locator('[data-testid="terminal-console"]').getByText('Agent_Console_Stream');
  165 |       await expect(title).toBeVisible();
  166 |     });
  167 | 
  168 |     test('should show terminal status online', async ({ page }) => {
  169 |       const status = page.locator('[data-testid="terminal-console"]').getByText('Online');
  170 |       await expect(status).toBeVisible();
  171 |     });
  172 | 
  173 |     test('should show boot logs', async ({ page }) => {
  174 |       const bootLog = page.locator('[data-testid="terminal-console"]').getByText('SYS: Booting Core Decryptor');
  175 |       await expect(bootLog).toBeVisible();
  176 |     });
  177 | 
  178 |     test('should show terminal prompt', async ({ page }) => {
  179 |       const prompt = page.locator('[data-testid="terminal-console"]').getByText('$');
  180 |       await expect(prompt).toBeVisible();
  181 |     });
  182 |   });
  183 | 
  184 |   // 7. Custom Cursor (5 tests)
  185 |   test.describe('7. Custom Cursor', () => {
  186 |     test('should render custom cursor', async ({ page }) => {
  187 |       const cursor = page.locator('[data-testid="custom-cursor"]');
  188 |       await expect(cursor).toBeVisible();
  189 |     });
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
> 249 |       expect(parseFloat(opacity)).toBeLessThan(1);
      |                                   ^ Error: expect(received).toBeLessThan(expected)
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
  290 |       expect(particleCount).toBeGreaterThanOrEqual(50000);
  291 |     });
  292 |   });
  293 | });
  294 | 
```