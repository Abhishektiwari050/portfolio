# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tier1-features.spec.ts >> Tier 1: Feature Coverage >> 5. Contact Section >> should show linkedin link
- Location: e2e\tier1-features.spec.ts:150:5

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('#connect a[href*="linkedin.com"]')
Expected: "https://linkedin.com/in/architect"
Received: "https://linkedin.com"
Timeout:  8000ms

Call log:
  - Expect "toHaveAttribute" with timeout 8000ms
  - waiting for locator('#connect a[href*="linkedin.com"]')
    18 × locator resolved to <a target="_blank" rel="noreferrer" data-lock="true" href="https://linkedin.com">linkedin.com/in/architect</a>
       - unexpected value "https://linkedin.com"

```

```yaml
- link "linkedin.com/in/architect":
  - /url: https://linkedin.com
```

# Test source

```ts
  52  |       const tagline = page.locator('#aetheris p').first();
  53  |       await expect(tagline).toContainText('Decentralized Orchestration Layer');
  54  |     });
  55  | 
  56  |     test('should show Aetheris tech stack', async ({ page }) => {
  57  |       const techStack = page.locator('#aetheris').getByText('CORE_SCHEMATIC_TECH');
  58  |       await expect(techStack).toBeVisible();
  59  |       const typescriptTech = page.locator('#aetheris').getByText('TypeScript');
  60  |       await expect(typescriptTech).toBeVisible();
  61  |     });
  62  | 
  63  |     test('should show active state class on scroll', async ({ page }) => {
  64  |       const card = page.locator('#aetheris .bento-card');
  65  |       await page.locator('#aetheris').scrollIntoViewIfNeeded();
  66  |       await expect(card).toHaveClass(/active/);
  67  |     });
  68  |   });
  69  | 
  70  |   // 3. Helios Engine Section / Card (5 tests)
  71  |   test.describe('3. Helios Engine Section', () => {
  72  |     test('should render Helios section', async ({ page }) => {
  73  |       const section = page.locator('#helios');
  74  |       await expect(section).toBeVisible();
  75  |     });
  76  | 
  77  |     test('should show Helios heading', async ({ page }) => {
  78  |       const heading = page.locator('#helios h2');
  79  |       await expect(heading).toHaveText('Helios Engine');
  80  |     });
  81  | 
  82  |     test('should show Helios tagline', async ({ page }) => {
  83  |       const tagline = page.locator('#helios p').first();
  84  |       await expect(tagline).toContainText('Rust-Based Sub-Millisecond Vector Retrieval');
  85  |     });
  86  | 
  87  |     test('should show Helios tech stack', async ({ page }) => {
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
> 152 |       await expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/architect');
      |                                  ^ Error: expect(locator).toHaveAttribute(expected) failed
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
  249 |       expect(parseFloat(opacity)).toBeLessThan(1);
  250 |     });
  251 |   });
  252 | 
```