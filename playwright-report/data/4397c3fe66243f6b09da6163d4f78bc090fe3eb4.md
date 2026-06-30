# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier3-combinations.spec.ts >> Tier 3: Cross-Feature Combinations >> 7. Resize, Scroll, & Canvas
- Location: e2e\tier3-combinations.spec.ts:80:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.right-column canvas')
Expected: visible
Error: strict mode violation: locator('.right-column canvas') resolved to 2 elements:
    1) <canvas width="703" height="720" data-engine="three.js r185"></canvas> aka locator('canvas').first()
    2) <canvas width="1024" height="421" data-engine="three.js r185"></canvas> aka locator('canvas').nth(1)

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
      - generic [ref=e9]: "CHRONOS: Subscribing to IoT sensor streams (Kafka)..."
      - generic [ref=e10]: "CHRONOS: Ingesting 10.4M telemetry events/sec..."
      - generic [ref=e11]: "CHRONOS: Extracting grid topology via Spatio-Temporal GNN..."
      - generic [ref=e12]: "[10:52:57] CHRONOS: Subscribing to IoT sensor streams (Kafka)..."
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
            - link "hello@example.com" [ref=e148] [cursor=pointer]:
              - /url: mailto:hello@example.com
          - generic [ref=e149]:
            - text: "GITH:"
            - link "github.com/architect" [ref=e150] [cursor=pointer]:
              - /url: https://github.com
          - generic [ref=e151]:
            - text: "LINK:"
            - link "linkedin.com/in/architect" [ref=e152] [cursor=pointer]:
              - /url: https://linkedin.com
  - complementary [ref=e153]:
    - generic [ref=e154]:
      - generic [ref=e155]: "SYS_MODE: CHRONOS_BLUEPRINT"
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
        - generic:
          - generic: IoT Sensors Stream
        - generic:
          - generic: Kafka Event Hub
        - generic:
          - generic: Spatio GNN Core
        - generic:
          - generic: Temporal Transformer
        - generic:
          - generic: Triton Inference Server
        - generic:
          - generic: Grid Control API
        - generic:
          - generic: Time-Series DB (Timescale)
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Tier 3: Cross-Feature Combinations', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |   });
  7   | 
  8   |   test('1. Scroll & Canvas Shape Morph', async ({ page }) => {
  9   |     // Check initial canvas morph state
  10  |     const initialShape = await page.evaluate(() => (window as any).__threeCurrentShape || 'intro');
  11  |     
  12  |     // Scroll to Aetheris AI section
  13  |     await page.locator('#aetheris').scrollIntoViewIfNeeded();
  14  |     await page.waitForTimeout(1000); // Wait for transition LERP
  15  | 
  16  |     const updatedShape = await page.evaluate(() => (window as any).__threeCurrentShape);
  17  |     expect(updatedShape).not.toEqual(initialShape);
  18  |   });
  19  | 
  20  |   test('2. Scroll & Terminal Logs', async ({ page }) => {
  21  |     const terminal = page.locator('[data-testid="terminal-console"]');
  22  |     await expect(terminal).toBeVisible();
  23  | 
  24  |     // Scroll to Helios section
  25  |     await page.locator('#helios').scrollIntoViewIfNeeded();
  26  |     await page.waitForTimeout(1000);
  27  | 
  28  |     // Verify Helios telemetry logs are present
  29  |     const heliosLogs = terminal.getByText('HELIOS:');
  30  |     await expect(heliosLogs.first()).toBeVisible();
  31  |   });
  32  | 
  33  |   test('3. Cursor Hover & Terminal Log', async ({ page }) => {
  34  |     const cardHeader = page.locator('#aetheris h2');
  35  |     await cardHeader.scrollIntoViewIfNeeded();
  36  |     await cardHeader.hover();
  37  | 
  38  |     const terminal = page.locator('[data-testid="terminal-console"]');
  39  |     // Hovering card header should print focus log
  40  |     await expect(terminal.getByText(/FOCUS: Aetheris/i).first()).toBeVisible();
  41  |   });
  42  | 
  43  |   test('4. Canvas Node Click & Terminal Stream', async ({ page }) => {
  44  |     const blueprintNode = page.locator('[data-testid="blueprint-node"]').first();
  45  |     await blueprintNode.scrollIntoViewIfNeeded();
  46  |     await blueprintNode.click();
  47  | 
  48  |     // Verify node details are streamed to Terminal
  49  |     const terminal = page.locator('[data-testid="terminal-console"]');
  50  |     await expect(terminal.getByText(/NODE_DETECTION/i).first()).toBeVisible();
  51  |   });
  52  | 
  53  |   test('5. Scroll & Cursor Lock', async ({ page }) => {
  54  |     const emailLink = page.locator('#connect a[href^="mailto:"]');
  55  |     await emailLink.scrollIntoViewIfNeeded();
  56  |     await emailLink.hover();
  57  | 
  58  |     const cursor = page.locator('[data-testid="custom-cursor"]');
  59  |     await expect(cursor).toHaveClass(/locked/);
  60  | 
  61  |     // Scroll away
  62  |     await page.evaluate(() => window.scrollTo(0, 0));
  63  |     await page.waitForTimeout(500);
  64  | 
  65  |     // Lock state should be broken since the hovered link is no longer under the cursor/viewport
  66  |     await expect(cursor).not.toHaveClass(/locked/);
  67  |   });
  68  | 
  69  |   test('6. Theme Change & WebGL Colors', async ({ page }) => {
  70  |     // If a theme toggle button is present
  71  |     const themeToggle = page.locator('[data-testid="theme-toggle"]');
  72  |     if (await themeToggle.isVisible()) {
  73  |       const initialColor = await page.evaluate(() => (window as any).__threeParticleColor || '');
  74  |       await themeToggle.click();
  75  |       const updatedColor = await page.evaluate(() => (window as any).__threeParticleColor);
  76  |       expect(updatedColor).not.toEqual(initialColor);
  77  |     }
  78  |   });
  79  | 
  80  |   test('7. Resize, Scroll, & Canvas', async ({ page }) => {
  81  |     await page.locator('#helios').scrollIntoViewIfNeeded();
  82  |     const initialScrollY = await page.evaluate(() => window.scrollY);
  83  | 
  84  |     // Resize viewport
  85  |     await page.setViewportSize({ width: 1024, height: 768 });
  86  |     await page.waitForTimeout(500);
  87  | 
  88  |     const canvas = page.locator('.right-column canvas');
> 89  |     await expect(canvas).toBeVisible();
      |                          ^ Error: expect(locator).toBeVisible() failed
  90  |     
  91  |     // Scroll position should adjust or remain valid
  92  |     const currentScrollY = await page.evaluate(() => window.scrollY);
  93  |     expect(currentScrollY).toBeGreaterThan(0);
  94  |   });
  95  | 
  96  |   test('8. Cursor Hover & Canvas Ripple', async ({ page }) => {
  97  |     const emailLink = page.locator('#connect a[href^="mailto:"]');
  98  |     await emailLink.scrollIntoViewIfNeeded();
  99  |     await emailLink.hover();
  100 | 
  101 |     const rippleCount = await page.evaluate(() => (window as any).__threeRippleCount || 0);
  102 |     // Hovering interactive elements should trigger ripples
  103 |     expect(rippleCount).toBeGreaterThan(0);
  104 |   });
  105 | 
  106 |   test('9. Contact Link Focus & Terminal', async ({ page }) => {
  107 |     const emailLink = page.locator('#connect a[href^="mailto:"]');
  108 |     await emailLink.scrollIntoViewIfNeeded();
  109 |     await emailLink.focus();
  110 | 
  111 |     const terminal = page.locator('[data-testid="terminal-console"]');
  112 |     await expect(terminal.getByText(/LINK_FOCUS: hello@example.com/i).first()).toBeVisible();
  113 |   });
  114 | });
  115 | 
```