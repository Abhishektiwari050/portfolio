import { test, expect } from '@playwright/test';

test.describe('Tier 1: Feature Coverage', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the home page before each test
    await page.goto('/');
  });

  // 1. Hero / Intro Section (5 tests)
  test.describe('1. Hero / Intro Section', () => {
    test('should render hero section', async ({ page }) => {
      const intro = page.locator('#intro');
      await expect(intro).toBeVisible();
    });

    test('should show heading', async ({ page }) => {
      const heading = page.locator('#intro h1');
      await expect(heading).toContainText('ENGINEERING');
      await expect(heading).toContainText('INTELLIGENT');
      await expect(heading).toContainText('SYSTEMS.');
    });

    test('should show AUTH SUCCESS status', async ({ page }) => {
      const authStatus = page.locator('#intro').getByText('AUTH: SUCCESS');
      await expect(authStatus).toBeVisible();
    });

    test('should show INIT_STAGE_01', async ({ page }) => {
      const initStage = page.locator('#intro').getByText('INIT_STAGE_01');
      await expect(initStage).toBeVisible();
    });

    test('should show scroll prompt', async ({ page }) => {
      const prompt = page.locator('#intro').getByText('SYS_SCROLL_TO_DECRYPT');
      await expect(prompt).toBeVisible();
    });
  });

  // 2. Aetheris AI Section / Card (5 tests)
  test.describe('2. Aetheris AI Section', () => {
    test('should render Aetheris AI section', async ({ page }) => {
      const section = page.locator('#aetheris');
      await expect(section).toBeVisible();
    });

    test('should show Aetheris heading', async ({ page }) => {
      const heading = page.locator('#aetheris h2');
      await expect(heading).toHaveText('Aetheris AI');
    });

    test('should show Aetheris tagline', async ({ page }) => {
      const tagline = page.locator('#aetheris p').first();
      await expect(tagline).toContainText('Decentralized Orchestration Layer');
    });

    test('should show Aetheris tech stack', async ({ page }) => {
      const techStack = page.locator('#aetheris').getByText('CORE_SCHEMATIC_TECH');
      await expect(techStack).toBeVisible();
      const typescriptTech = page.locator('#aetheris').getByText('TypeScript');
      await expect(typescriptTech).toBeVisible();
    });

    test('should show active state class on scroll', async ({ page }) => {
      const card = page.locator('#aetheris .bento-card');
      await page.locator('#aetheris').scrollIntoViewIfNeeded();
      await expect(card).toHaveClass(/active/);
    });
  });

  // 3. Helios Engine Section / Card (5 tests)
  test.describe('3. Helios Engine Section', () => {
    test('should render Helios section', async ({ page }) => {
      const section = page.locator('#helios');
      await expect(section).toBeVisible();
    });

    test('should show Helios heading', async ({ page }) => {
      const heading = page.locator('#helios h2');
      await expect(heading).toHaveText('Helios Engine');
    });

    test('should show Helios tagline', async ({ page }) => {
      const tagline = page.locator('#helios p').first();
      await expect(tagline).toContainText('Rust-Based Sub-Millisecond Vector Retrieval');
    });

    test('should show Helios tech stack', async ({ page }) => {
      const rustTech = page.locator('#helios').getByText('Rust');
      await expect(rustTech).toBeVisible();
    });

    test('should show active state class on scroll', async ({ page }) => {
      const card = page.locator('#helios .bento-card');
      await page.locator('#helios').scrollIntoViewIfNeeded();
      await expect(card).toHaveClass(/active/);
    });
  });

  // 4. Chronos Predict Section / Card (5 tests)
  test.describe('4. Chronos Predict Section', () => {
    test('should render Chronos section', async ({ page }) => {
      const section = page.locator('#chronos');
      await expect(section).toBeVisible();
    });

    test('should show Chronos heading', async ({ page }) => {
      const heading = page.locator('#chronos h2');
      await expect(heading).toHaveText('Chronos Predict');
    });

    test('should show Chronos tagline', async ({ page }) => {
      const tagline = page.locator('#chronos p').first();
      await expect(tagline).toContainText('Spatio-Temporal GNN');
    });

    test('should show Chronos tech stack', async ({ page }) => {
      const pythonTech = page.locator('#chronos').getByText('Python');
      await expect(pythonTech).toBeVisible();
    });

    test('should show active state class on scroll', async ({ page }) => {
      const card = page.locator('#chronos .bento-card');
      await page.locator('#chronos').scrollIntoViewIfNeeded();
      await expect(card).toHaveClass(/active/);
    });
  });

  // 5. Contact Section / Form (5 tests)
  test.describe('5. Contact Section', () => {
    test('should render contact section', async ({ page }) => {
      const section = page.locator('#connect');
      await expect(section).toBeVisible();
    });

    test('should show contact heading', async ({ page }) => {
      const heading = page.locator('#connect h2');
      await expect(heading).toContainText('SECURE CONNECTION');
    });

    test('should show mailto link', async ({ page }) => {
      const emailLink = page.locator('#connect a[href^="mailto:"]');
      await expect(emailLink).toHaveAttribute('href', 'mailto:hello@example.com');
    });

    test('should show github link', async ({ page }) => {
      const githubLink = page.locator('#connect a[href*="github.com"]');
      await expect(githubLink).toHaveAttribute('href', 'https://github.com');
    });

    test('should show linkedin link', async ({ page }) => {
      const linkedinLink = page.locator('#connect a[href*="linkedin.com"]');
      await expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/architect');
    });
  });

  // 6. Terminal Console (5 tests)
  test.describe('6. Terminal Console', () => {
    test('should render terminal console', async ({ page }) => {
      const consoleWrapper = page.locator('[data-testid="terminal-console"]');
      await expect(consoleWrapper).toBeVisible();
    });

    test('should show terminal title', async ({ page }) => {
      const title = page.locator('[data-testid="terminal-console"]').getByText('Agent_Console_Stream');
      await expect(title).toBeVisible();
    });

    test('should show terminal status online', async ({ page }) => {
      const status = page.locator('[data-testid="terminal-console"]').getByText('Online');
      await expect(status).toBeVisible();
    });

    test('should show boot logs', async ({ page }) => {
      const bootLog = page.locator('[data-testid="terminal-console"]').getByText('SYS: Booting Core Decryptor');
      await expect(bootLog).toBeVisible();
    });

    test('should show terminal prompt', async ({ page }) => {
      const prompt = page.locator('[data-testid="terminal-console"]').getByText('$');
      await expect(prompt).toBeVisible();
    });
  });

  // 7. Custom Cursor (5 tests)
  test.describe('7. Custom Cursor', () => {
    test('should render custom cursor', async ({ page }) => {
      const cursor = page.locator('[data-testid="custom-cursor"]');
      await expect(cursor).toBeVisible();
    });

    test('should follow mouse movement', async ({ page }) => {
      const cursor = page.locator('[data-testid="custom-cursor"]');
      await page.mouse.move(200, 250);
      // Reticle position check (inline styles)
      const style = await cursor.getAttribute('style');
      expect(style).toContain('transform');
    });

    test('should show coordinates readout', async ({ page }) => {
      const coords = page.locator('[data-testid="cursor-coords"]');
      await expect(coords).toBeVisible();
    });

    test('should update coordinates on move', async ({ page }) => {
      const coords = page.locator('[data-testid="cursor-coords"]');
      await page.mouse.move(320, 480);
      await expect(coords).toHaveText(/X:\s*320\s+Y:\s*480/);
    });

    test('should trigger hover state over links', async ({ page }) => {
      const cursor = page.locator('[data-testid="custom-cursor"]');
      const emailLink = page.locator('#connect a[href^="mailto:"]');
      await emailLink.scrollIntoViewIfNeeded();
      await emailLink.hover();
      await expect(cursor).toHaveClass(/hovering/);
    });
  });

  // 8. Smooth Scroll (5 tests)
  test.describe('8. Smooth Scroll', () => {
    test('should render scroll progress indicator', async ({ page }) => {
      const indicator = page.locator('[data-testid="scroll-progress-bar"]');
      await expect(indicator).toBeVisible();
    });

    test('should have scrollable page height', async ({ page }) => {
      const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      const clientHeight = await page.evaluate(() => document.documentElement.clientHeight);
      expect(scrollHeight).toBeGreaterThan(clientHeight);
    });

    test('should register scroll events', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, 100));
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    });

    test('should update scroll progress on scroll', async ({ page }) => {
      const indicator = page.locator('[data-testid="scroll-progress-bar"]');
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
      const style = await indicator.getAttribute('style');
      expect(style).toContain('transform'); // e.g. scaleX or translate
    });

    test('should update section opacities on scroll', async ({ page }) => {
      const intro = page.locator('#intro');
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
      const opacity = await intro.evaluate((el) => window.getComputedStyle(el).opacity);
      expect(parseFloat(opacity)).toBeLessThan(1);
    });
  });

  // 9. 3D Canvas Rendering (5 tests)
  test.describe('9. 3D Canvas Rendering', () => {
    test('should render canvas in right column', async ({ page }) => {
      const canvas = page.locator('.right-column canvas');
      await expect(canvas).toBeVisible();
    });

    test('should initialize WebGL context', async ({ page }) => {
      const hasWebGL = await page.evaluate(() => {
        const canvas = document.querySelector('.right-column canvas') as HTMLCanvasElement;
        if (!canvas) return false;
        return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'));
      });
      expect(hasWebGL).toBe(true);
    });

    test('should match canvas dimensions to container', async ({ page }) => {
      const canvas = page.locator('.right-column canvas');
      const boundingBox = await canvas.boundingBox();
      expect(boundingBox).not.toBeNull();
      expect(boundingBox!.width).toBeGreaterThan(0);
      expect(boundingBox!.height).toBeGreaterThan(0);
    });

    test('should compile shaders without error', async ({ page }) => {
      // Evaluate window errors or WebGL errors
      const hasErrors = await page.evaluate(() => {
        return (window as any).__webglShaderError || false;
      });
      expect(hasErrors).toBe(false);
    });

    test('should render correct particle density', async ({ page }) => {
      const particleCount = await page.evaluate(() => {
        return (window as any).__threeParticleCount || 0;
      });
      // Spec says 50,000+ particles
      expect(particleCount).toBeGreaterThanOrEqual(50000);
    });
  });
});
