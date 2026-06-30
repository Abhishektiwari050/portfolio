# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier1-features.spec.ts >> Tier 1: Feature Coverage >> 7. Custom Cursor >> should render custom cursor
- Location: e2e\tier1-features.spec.ts:186:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="custom-cursor"]')
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for locator('[data-testid="custom-cursor"]')

```

```yaml
- text: "X:0 Y:0 >_ Agent_Console_Stream Online SYS: Initializing CatmullRom spline path... [10:50:48] SYS: Booting Core Decryptor... [10:50:50] SYS: Loading WebGL rendering pipelines... [10:50:52] SYS: Initializing CatmullRom spline path... [10:50:54] SYS: Calibrating CAD coordinate reticle... $ _"
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
  - text: "SYS_MODE: INITIALIZING SYS_STATUS: OPTIMAL SYS_HZ: 61 FPS PING: 39ms BUFF_OK: 100%"
  - img
  - text: SYSTEM CORE WebGL Swarm Parallax Grid CAD Reticle Spline Path
```

# Test source

```ts
  88  |       const rustTech = page.locator('#helios').getByText('Rust');
  89  |       await expect(rustTech).toBeVisible();
  90  |     });
  91  | 
  92  |     test('should show active state class on scroll', async ({ page }) => {
  93  |       const card = page.locator('#helios .bento-card');
  94  |       await page.locator('#helios').scrollIntoViewIfNeeded();
  95  |       await expect(card).toHaveClass(/active/);
  96  |     });
  97  |   });
  98  | 
  99  |   // 4. Chronos Predict Section / Card (5 tests)
  100 |   test.describe('4. Chronos Predict Section', () => {
  101 |     test('should render Chronos section', async ({ page }) => {
  102 |       const section = page.locator('#chronos');
  103 |       await expect(section).toBeVisible();
  104 |     });
  105 | 
  106 |     test('should show Chronos heading', async ({ page }) => {
  107 |       const heading = page.locator('#chronos h2');
  108 |       await expect(heading).toHaveText('Chronos Predict');
  109 |     });
  110 | 
  111 |     test('should show Chronos tagline', async ({ page }) => {
  112 |       const tagline = page.locator('#chronos p').first();
  113 |       await expect(tagline).toContainText('Spatio-Temporal GNN');
  114 |     });
  115 | 
  116 |     test('should show Chronos tech stack', async ({ page }) => {
  117 |       const pythonTech = page.locator('#chronos').getByText('Python');
  118 |       await expect(pythonTech).toBeVisible();
  119 |     });
  120 | 
  121 |     test('should show active state class on scroll', async ({ page }) => {
  122 |       const card = page.locator('#chronos .bento-card');
  123 |       await page.locator('#chronos').scrollIntoViewIfNeeded();
  124 |       await expect(card).toHaveClass(/active/);
  125 |     });
  126 |   });
  127 | 
  128 |   // 5. Contact Section / Form (5 tests)
  129 |   test.describe('5. Contact Section', () => {
  130 |     test('should render contact section', async ({ page }) => {
  131 |       const section = page.locator('#connect');
  132 |       await expect(section).toBeVisible();
  133 |     });
  134 | 
  135 |     test('should show contact heading', async ({ page }) => {
  136 |       const heading = page.locator('#connect h2');
  137 |       await expect(heading).toContainText('SECURE CONNECTION');
  138 |     });
  139 | 
  140 |     test('should show mailto link', async ({ page }) => {
  141 |       const emailLink = page.locator('#connect a[href^="mailto:"]');
  142 |       await expect(emailLink).toHaveAttribute('href', 'mailto:hello@example.com');
  143 |     });
  144 | 
  145 |     test('should show github link', async ({ page }) => {
  146 |       const githubLink = page.locator('#connect a[href*="github.com"]');
  147 |       await expect(githubLink).toHaveAttribute('href', 'https://github.com');
  148 |     });
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
> 188 |       await expect(cursor).toBeVisible();
      |                            ^ Error: expect(locator).toBeVisible() failed
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
```