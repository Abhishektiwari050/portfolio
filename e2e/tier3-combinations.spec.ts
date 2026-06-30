import { test, expect } from '@playwright/test';

test.describe('Tier 3: Cross-Feature Combinations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1. Scroll & Canvas Shape Morph', async ({ page }) => {
    // Check initial canvas morph state
    const initialShape = await page.evaluate(() => (window as any).__threeCurrentShape || 'intro');
    
    // Scroll to Aetheris AI section
    await page.locator('#aetheris').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // Wait for transition LERP

    const updatedShape = await page.evaluate(() => (window as any).__threeCurrentShape);
    expect(updatedShape).not.toEqual(initialShape);
  });

  test('2. Scroll & Terminal Logs', async ({ page }) => {
    const terminal = page.locator('[data-testid="terminal-console"]');
    await expect(terminal).toBeVisible();

    // Scroll to Helios section
    await page.locator('#helios').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Verify Helios telemetry logs are present
    const heliosLogs = terminal.getByText('HELIOS:');
    await expect(heliosLogs.first()).toBeVisible();
  });

  test('3. Cursor Hover & Terminal Log', async ({ page }) => {
    const cardHeader = page.locator('#aetheris h2');
    await cardHeader.scrollIntoViewIfNeeded();
    await cardHeader.hover();

    const terminal = page.locator('[data-testid="terminal-console"]');
    // Hovering card header should print focus log
    await expect(terminal.getByText(/FOCUS: Aetheris/i).first()).toBeVisible();
  });

  test('4. Canvas Node Click & Terminal Stream', async ({ page }) => {
    const blueprintNode = page.locator('[data-testid="blueprint-node"]').first();
    await blueprintNode.scrollIntoViewIfNeeded();
    await blueprintNode.click();

    // Verify node details are streamed to Terminal
    const terminal = page.locator('[data-testid="terminal-console"]');
    await expect(terminal.getByText(/NODE_DETECTION/i).first()).toBeVisible();
  });

  test('5. Scroll & Cursor Lock', async ({ page }) => {
    const emailLink = page.locator('#connect a[href^="mailto:"]');
    await emailLink.scrollIntoViewIfNeeded();
    await emailLink.hover();

    const cursor = page.locator('[data-testid="custom-cursor"]');
    await expect(cursor).toHaveClass(/locked/);

    // Scroll away
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Lock state should be broken since the hovered link is no longer under the cursor/viewport
    await expect(cursor).not.toHaveClass(/locked/);
  });

  test('6. Theme Change & WebGL Colors', async ({ page }) => {
    // If a theme toggle button is present
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.isVisible()) {
      const initialColor = await page.evaluate(() => (window as any).__threeParticleColor || '');
      await themeToggle.click();
      const updatedColor = await page.evaluate(() => (window as any).__threeParticleColor);
      expect(updatedColor).not.toEqual(initialColor);
    }
  });

  test('7. Resize, Scroll, & Canvas', async ({ page }) => {
    await page.locator('#helios').scrollIntoViewIfNeeded();
    const initialScrollY = await page.evaluate(() => window.scrollY);

    // Resize viewport
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.waitForTimeout(500);

    const canvas = page.locator('.right-column canvas');
    await expect(canvas).toBeVisible();
    
    // Scroll position should adjust or remain valid
    const currentScrollY = await page.evaluate(() => window.scrollY);
    expect(currentScrollY).toBeGreaterThan(0);
  });

  test('8. Cursor Hover & Canvas Ripple', async ({ page }) => {
    const emailLink = page.locator('#connect a[href^="mailto:"]');
    await emailLink.scrollIntoViewIfNeeded();
    await emailLink.hover();

    const rippleCount = await page.evaluate(() => (window as any).__threeRippleCount || 0);
    // Hovering interactive elements should trigger ripples
    expect(rippleCount).toBeGreaterThan(0);
  });

  test('9. Contact Link Focus & Terminal', async ({ page }) => {
    const emailLink = page.locator('#connect a[href^="mailto:"]');
    await emailLink.scrollIntoViewIfNeeded();
    await emailLink.focus();

    const terminal = page.locator('[data-testid="terminal-console"]');
    await expect(terminal.getByText(/LINK_FOCUS: hello@example.com/i).first()).toBeVisible();
  });
});
