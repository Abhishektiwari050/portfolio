import { test, expect } from '@playwright/test';

test.describe('Anatomy Page E2E Tests', () => {
  const consoleErrors: string[] = [];
  const pageErrors: Error[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors.length = 0;
    pageErrors.length = 0;

    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.text().toLowerCase().includes('error')) {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', (err) => {
      pageErrors.push(err);
    });
  });

  test('should load anatomy page successfully and verify layout details', async ({ page }) => {
    // Navigate to the anatomy page
    await page.goto('/anatomy.html');

    // Verify page loads successfully and the title is correct
    await expect(page).toHaveTitle('01 / Brutal Architecture');

    // Assert no Draco decompression errors, THREE.TDSLoader parser errors, or WebGL context/render errors
    const errorCheckRegex = /draco|tdsloader|tds|3ds|webgl|context|render|compile|shader/i;

    for (const msg of consoleErrors) {
      expect(msg).not.toMatch(errorCheckRegex);
    }
    for (const err of pageErrors) {
      expect(err.message).not.toMatch(errorCheckRegex);
    }

    // Verify left panel background color is solid yellow: #d7ff00 or rgb(215, 255, 0)
    // Target the first child of the main layout grid
    const leftPanel = page.locator('.grid > div').nth(0);
    await expect(leftPanel).toBeVisible();
    const leftBgColor = await leftPanel.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(leftBgColor).toBe('rgb(215, 255, 0)');

    // Verify right panel background color is off-white: #f5f5f7 or rgb(245, 245, 247)
    // Target the second child of the main layout grid
    const rightPanel = page.locator('.grid > div').nth(1);
    await expect(rightPanel).toBeVisible();
    const rightBgColor = await rightPanel.evaluate((el) => window.getComputedStyle(el).backgroundColor);
    expect(rightBgColor).toBe('rgb(245, 245, 247)');

    // Verify Three.js Canvas is rendered and visible
    const canvasContainer = page.locator('.three-container');
    await expect(canvasContainer).toBeVisible();
    const canvas = canvasContainer.locator('canvas');
    await expect(canvas).toBeVisible();

    // Verify brutalist heading "BRUTAL" and "ARCHITECTURE" is rendered with Bebas Neue font
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('BRUTAL');
    await expect(heading).toContainText('ARCHITECTURE');
    const headingFontFamily = await heading.evaluate((el) => window.getComputedStyle(el).fontFamily);
    expect(headingFontFamily).toContain('Bebas Neue');

    // Verify coordinate readout contains "51.5074° N" and "0.1278° W"
    const coordLat = page.getByText('51.5074° N');
    const coordLon = page.getByText('0.1278° W');
    await expect(coordLat).toBeVisible();
    await expect(coordLon).toBeVisible();

    // Verify vertical labels "STRUCTURE.", "BONES.", "FUNCTION." are present
    const labelStructure = page.getByText('STRUCTURE.');
    const labelBones = page.getByText('BONES.');
    const labelFunction = page.getByText('FUNCTION.');
    await expect(labelStructure).toBeVisible();
    await expect(labelBones).toBeVisible();
    await expect(labelFunction).toBeVisible();

    // Verify concrete block graphic is present (div with bg-[#ababab]) and contains the yellow SVG triangle
    const concreteBlock = page.locator('div.bg-\\[\\#ababab\\]');
    await expect(concreteBlock).toBeVisible();
    const svgTriangle = concreteBlock.locator('svg polygon');
    await expect(svgTriangle).toBeVisible();
    const triangleColor = await svgTriangle.evaluate((el) => window.getComputedStyle(el).color);
    expect(triangleColor).toBe('rgb(215, 255, 0)');

    // Verify navigation links are present and "// ANATOMY" is marked as active
    const introLink = page.locator('span', { hasText: '// INTRO' });
    const workLink = page.locator('span', { hasText: '// WORK' });
    const activeLink = page.locator('span', { hasText: '// ANATOMY' });
    const contactLink = page.locator('span', { hasText: '// CONTACT' });
    const architectLink = page.locator('a', { hasText: '[ ARCHITECT ]' });

    await expect(introLink).toBeVisible();
    await expect(introLink).toHaveClass(/opacity-35/);

    await expect(workLink).toBeVisible();
    await expect(workLink).toHaveClass(/opacity-35/);

    await expect(activeLink).toBeVisible();
    await expect(activeLink).toHaveClass(/text-black/);
    await expect(activeLink).toHaveClass(/font-medium/);

    await expect(contactLink).toBeVisible();
    await expect(contactLink).toHaveClass(/opacity-35/);

    await expect(architectLink).toBeVisible();
    await expect(architectLink).toHaveAttribute('href', '/index.html');
  });
});
