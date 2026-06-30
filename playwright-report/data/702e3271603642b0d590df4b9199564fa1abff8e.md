# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier2-boundaries.spec.ts >> Tier 2: Boundary and Corner Cases >> 1. Hero / Intro Section Boundaries >> fallback font should be applied on loading failure
- Location: e2e\tier2-boundaries.spec.ts:44:5

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "monospace"
Received string:    "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
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
      - generic [ref=e12]: "[10:51:56] SYS: Booting Core Decryptor..."
      - generic [ref=e13]: "[10:51:58] SYS: Loading WebGL rendering pipelines..."
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
          - generic [ref=e164]: "SYS_HZ: 61 FPS"
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
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Tier 2: Boundary and Corner Cases', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |   });
  7   | 
  8   |   // 1. Hero / Intro Section (5 tests)
  9   |   test.describe('1. Hero / Intro Section Boundaries', () => {
  10  |     test('viewport resize should not break layout', async ({ page }) => {
  11  |       await page.setViewportSize({ width: 1920, height: 1080 });
  12  |       await expect(page.locator('#intro')).toBeVisible();
  13  |       await page.setViewportSize({ width: 1024, height: 768 });
  14  |       await expect(page.locator('#intro')).toBeVisible();
  15  |     });
  16  | 
  17  |     test('very small viewports should adapt gracefully', async ({ page }) => {
  18  |       await page.setViewportSize({ width: 375, height: 667 }); // Mobile viewport
  19  |       const intro = page.locator('#intro');
  20  |       await expect(intro).toBeVisible();
  21  |       // On mobile, certain elements like code-text might be hidden or styled differently
  22  |       const initStage = page.locator('#intro').getByText('INIT_STAGE_01');
  23  |       await expect(initStage).toBeVisible();
  24  |     });
  25  | 
  26  |     test('rapid scrolling on load should not freeze intro', async ({ page }) => {
  27  |       await page.evaluate(() => {
  28  |         window.scrollTo(0, 500);
  29  |         window.scrollTo(0, 0);
  30  |         window.scrollTo(0, 1000);
  31  |       });
  32  |       const intro = page.locator('#intro');
  33  |       await expect(intro).toBeVisible();
  34  |     });
  35  | 
  36  |     test('reloading at scrolled position should restore state', async ({ page }) => {
  37  |       await page.evaluate(() => window.scrollTo(0, 800));
  38  |       await page.reload();
  39  |       const scrollY = await page.evaluate(() => window.scrollY);
  40  |       // Wait to see if position is maintained or reset
  41  |       expect(scrollY).toBeGreaterThanOrEqual(0);
  42  |     });
  43  | 
  44  |     test('fallback font should be applied on loading failure', async ({ page }) => {
  45  |       const fontFamily = await page.locator('#intro h1').evaluate((el) => window.getComputedStyle(el).fontFamily);
> 46  |       expect(fontFamily).toContain('monospace'); // fallback should be monospace as per theme
      |                          ^ Error: expect(received).toContain(expected) // indexOf
  47  |     });
  48  |   });
  49  | 
  50  |   // 2. Aetheris AI Section (5 tests)
  51  |   test.describe('2. Aetheris AI Boundaries', () => {
  52  |     test('rapid scrolling past should not freeze card state', async ({ page }) => {
  53  |       await page.evaluate(() => {
  54  |         for (let i = 0; i < 10; i++) {
  55  |           window.scrollTo(0, i * 200);
  56  |         }
  57  |       });
  58  |       const card = page.locator('#aetheris .bento-card');
  59  |       await expect(card).toBeVisible();
  60  |     });
  61  | 
  62  |     test('ultrawide viewport should keep card aligned', async ({ page }) => {
  63  |       await page.setViewportSize({ width: 2560, height: 1440 });
  64  |       const card = page.locator('#aetheris .bento-card');
  65  |       const box = await card.boundingBox();
  66  |       expect(box).not.toBeNull();
  67  |       expect(box!.width).toBeGreaterThan(0);
  68  |     });
  69  | 
  70  |     test('text overflow should not break bento card bounds', async ({ page }) => {
  71  |       const card = page.locator('#aetheris .bento-card');
  72  |       const isOverflowing = await card.evaluate((el) => el.scrollHeight > el.clientHeight + 10);
  73  |       expect(isOverflowing).toBe(false);
  74  |     });
  75  | 
  76  |     test('hovering card boundary exactly should not flicker hover', async ({ page }) => {
  77  |       const card = page.locator('#aetheris .bento-card');
  78  |       const box = await card.boundingBox();
  79  |       if (box) {
  80  |         await page.mouse.move(box.x, box.y);
  81  |         await page.mouse.move(box.x - 1, box.y - 1);
  82  |         await page.mouse.move(box.x, box.y);
  83  |       }
  84  |       await expect(card).toBeVisible();
  85  |     });
  86  | 
  87  |     test('should handle empty tech stack gracefully', async ({ page }) => {
  88  |       const techElements = page.locator('#aetheris').locator('span');
  89  |       const count = await techElements.count();
  90  |       expect(count).toBeGreaterThan(0);
  91  |     });
  92  |   });
  93  | 
  94  |   // 3. Helios Engine Section (5 tests)
  95  |   test.describe('3. Helios Engine Boundaries', () => {
  96  |     test('rapid scrolling past should not freeze card state', async ({ page }) => {
  97  |       await page.evaluate(() => {
  98  |         window.scrollTo(0, 1500);
  99  |         window.scrollTo(0, 50);
  100 |       });
  101 |       const card = page.locator('#helios .bento-card');
  102 |       await expect(card).toBeVisible();
  103 |     });
  104 | 
  105 |     test('ultrawide viewport should keep card aligned', async ({ page }) => {
  106 |       await page.setViewportSize({ width: 2560, height: 1440 });
  107 |       const card = page.locator('#helios .bento-card');
  108 |       const box = await card.boundingBox();
  109 |       expect(box).not.toBeNull();
  110 |     });
  111 | 
  112 |     test('text overflow should not break bento card bounds', async ({ page }) => {
  113 |       const card = page.locator('#helios .bento-card');
  114 |       const isOverflowing = await card.evaluate((el) => el.scrollHeight > el.clientHeight + 10);
  115 |       expect(isOverflowing).toBe(false);
  116 |     });
  117 | 
  118 |     test('hovering card boundary exactly should not flicker hover', async ({ page }) => {
  119 |       const card = page.locator('#helios .bento-card');
  120 |       const box = await card.boundingBox();
  121 |       if (box) {
  122 |         await page.mouse.move(box.x, box.y);
  123 |         await page.mouse.move(box.x + 1, box.y + 1);
  124 |       }
  125 |       await expect(card).toBeVisible();
  126 |     });
  127 | 
  128 |     test('should handle empty tech stack gracefully', async ({ page }) => {
  129 |       const techElements = page.locator('#helios').locator('span');
  130 |       const count = await techElements.count();
  131 |       expect(count).toBeGreaterThan(0);
  132 |     });
  133 |   });
  134 | 
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
```