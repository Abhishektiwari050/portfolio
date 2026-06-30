import { test, expect } from '@playwright/test';

test.describe('Tier 4: Real-World Application Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Full Journey Scroll-Through', async ({ page }) => {
    // 1. Land on page and wait for loading screen to disappear
    const loader = page.locator('[data-testid="preloader"]');
    if (await loader.isVisible()) {
      await expect(loader).toBeHidden({ timeout: 10000 });
    }

    // 2. Verify Hero section is active
    await expect(page.locator('#intro')).toBeVisible();

    // 3. Scroll through all ventures sequentially
    const ventures = ['#aetheris', '#helios', '#chronos', '#connect'];
    for (const id of ventures) {
      const section = page.locator(id);
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800); // Allow GSAP animations to trigger
      await expect(section).toBeVisible();
    }

    // 4. Verify contact section is reached
    const contactHeading = page.locator('#connect h2');
    await expect(contactHeading).toBeVisible();
  });

  test('2. Interactive Venture Exploration', async ({ page }) => {
    // 1. Scroll directly to Helios Engine
    const heliosSection = page.locator('#helios');
    await heliosSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    // 2. Hover over a tech stack item
    const rustTag = heliosSection.getByText('Rust');
    await expect(rustTag).toBeVisible();
    await rustTag.hover();

    // 3. Click an interactive node on the blueprint visualizer
    const blueprintNode = page.locator('[data-testid="blueprint-node"]').first();
    await expect(blueprintNode).toBeVisible();
    await blueprintNode.click();

    // 4. Verify the terminal console prints logs for this node click
    const terminal = page.locator('[data-testid="terminal-console"]');
    await expect(terminal.getByText(/NODE_DETECTION/i).first()).toBeVisible();

    // 5. Scroll to connect and click the GitHub link
    const githubLink = page.locator('#connect a[href*="github.com"]');
    await githubLink.scrollIntoViewIfNeeded();
    await expect(githubLink).toBeVisible();
  });

  test('3. Keyboard-Only Navigation', async ({ page }) => {
    // Navigate using keyboard tab key
    await page.locator('body').click();
    
    // Press Tab multiple times to traverse interactive items
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('Tab');
    }

    // Assert that an active element exists and is focused
    const hasFocus = await page.evaluate(() => document.activeElement !== document.body);
    expect(hasFocus).toBe(true);
  });

  test('4. Interrupted Scroll and Click', async ({ page }) => {
    // Scroll rapidly down to Chronos
    await page.evaluate(() => window.scrollTo(0, 2000));
    
    // Interrupt and click blueprint node immediately
    const blueprintNode = page.locator('[data-testid="blueprint-node"]').first();
    await blueprintNode.click();

    // Verify terminal output
    const terminal = page.locator('[data-testid="terminal-console"]');
    await expect(terminal).toBeVisible();

    // Scroll back to Hero section
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    
    await expect(page.locator('#intro')).toBeVisible();
  });

  test('5. Deep Link / Direct Scroll Navigation', async ({ page }) => {
    // Load page with hash anchor
    await page.goto('/#helios');
    await page.waitForTimeout(1500); // Wait for smooth scroll and LERP

    // Verify Helios is active and scrolled into view
    const card = page.locator('#helios .bento-card');
    await expect(card).toHaveClass(/active/);

    // Verify terminal console has loaded Helios telemetry
    const terminal = page.locator('[data-testid="terminal-console"]');
    await expect(terminal.getByText(/HELIOS:/i).first()).toBeVisible();
  });
});
