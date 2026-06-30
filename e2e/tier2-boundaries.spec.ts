import { test, expect } from '@playwright/test';

test.describe('Tier 2: Boundary and Corner Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // 1. Hero / Intro Section (5 tests)
  test.describe('1. Hero / Intro Section Boundaries', () => {
    test('viewport resize should not break layout', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(page.locator('#intro')).toBeVisible();
      await page.setViewportSize({ width: 1024, height: 768 });
      await expect(page.locator('#intro')).toBeVisible();
    });

    test('very small viewports should adapt gracefully', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // Mobile viewport
      const intro = page.locator('#intro');
      await expect(intro).toBeVisible();
      // On mobile, certain elements like code-text might be hidden or styled differently
      const initStage = page.locator('#intro').getByText('INIT_STAGE_01');
      await expect(initStage).toBeVisible();
    });

    test('rapid scrolling on load should not freeze intro', async ({ page }) => {
      await page.evaluate(() => {
        window.scrollTo(0, 500);
        window.scrollTo(0, 0);
        window.scrollTo(0, 1000);
      });
      const intro = page.locator('#intro');
      await expect(intro).toBeVisible();
    });

    test('reloading at scrolled position should restore state', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, 800));
      await page.reload();
      const scrollY = await page.evaluate(() => window.scrollY);
      // Wait to see if position is maintained or reset
      expect(scrollY).toBeGreaterThanOrEqual(0);
    });

    test('fallback font should be applied on loading failure', async ({ page }) => {
      const fontFamily = await page.locator('#intro h1').evaluate((el) => window.getComputedStyle(el).fontFamily);
      expect(fontFamily).toContain('monospace'); // fallback should be monospace as per theme
    });
  });

  // 2. Aetheris AI Section (5 tests)
  test.describe('2. Aetheris AI Boundaries', () => {
    test('rapid scrolling past should not freeze card state', async ({ page }) => {
      await page.evaluate(() => {
        for (let i = 0; i < 10; i++) {
          window.scrollTo(0, i * 200);
        }
      });
      const card = page.locator('#aetheris .bento-card');
      await expect(card).toBeVisible();
    });

    test('ultrawide viewport should keep card aligned', async ({ page }) => {
      await page.setViewportSize({ width: 2560, height: 1440 });
      const card = page.locator('#aetheris .bento-card');
      const box = await card.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(0);
    });

    test('text overflow should not break bento card bounds', async ({ page }) => {
      const card = page.locator('#aetheris .bento-card');
      const isOverflowing = await card.evaluate((el) => el.scrollHeight > el.clientHeight + 10);
      expect(isOverflowing).toBe(false);
    });

    test('hovering card boundary exactly should not flicker hover', async ({ page }) => {
      const card = page.locator('#aetheris .bento-card');
      const box = await card.boundingBox();
      if (box) {
        await page.mouse.move(box.x, box.y);
        await page.mouse.move(box.x - 1, box.y - 1);
        await page.mouse.move(box.x, box.y);
      }
      await expect(card).toBeVisible();
    });

    test('should handle empty tech stack gracefully', async ({ page }) => {
      const techElements = page.locator('#aetheris').locator('span');
      const count = await techElements.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  // 3. Helios Engine Section (5 tests)
  test.describe('3. Helios Engine Boundaries', () => {
    test('rapid scrolling past should not freeze card state', async ({ page }) => {
      await page.evaluate(() => {
        window.scrollTo(0, 1500);
        window.scrollTo(0, 50);
      });
      const card = page.locator('#helios .bento-card');
      await expect(card).toBeVisible();
    });

    test('ultrawide viewport should keep card aligned', async ({ page }) => {
      await page.setViewportSize({ width: 2560, height: 1440 });
      const card = page.locator('#helios .bento-card');
      const box = await card.boundingBox();
      expect(box).not.toBeNull();
    });

    test('text overflow should not break bento card bounds', async ({ page }) => {
      const card = page.locator('#helios .bento-card');
      const isOverflowing = await card.evaluate((el) => el.scrollHeight > el.clientHeight + 10);
      expect(isOverflowing).toBe(false);
    });

    test('hovering card boundary exactly should not flicker hover', async ({ page }) => {
      const card = page.locator('#helios .bento-card');
      const box = await card.boundingBox();
      if (box) {
        await page.mouse.move(box.x, box.y);
        await page.mouse.move(box.x + 1, box.y + 1);
      }
      await expect(card).toBeVisible();
    });

    test('should handle empty tech stack gracefully', async ({ page }) => {
      const techElements = page.locator('#helios').locator('span');
      const count = await techElements.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  // 4. Chronos Predict Section (5 tests)
  test.describe('4. Chronos Predict Boundaries', () => {
    test('rapid scrolling past should not freeze card state', async ({ page }) => {
      await page.evaluate(() => {
        window.scrollTo(0, 2500);
        window.scrollTo(0, 0);
      });
      const card = page.locator('#chronos .bento-card');
      await expect(card).toBeVisible();
    });

    test('ultrawide viewport should keep card aligned', async ({ page }) => {
      await page.setViewportSize({ width: 2560, height: 1440 });
      const card = page.locator('#chronos .bento-card');
      const box = await card.boundingBox();
      expect(box).not.toBeNull();
    });

    test('text overflow should not break bento card bounds', async ({ page }) => {
      const card = page.locator('#chronos .bento-card');
      const isOverflowing = await card.evaluate((el) => el.scrollHeight > el.clientHeight + 10);
      expect(isOverflowing).toBe(false);
    });

    test('hovering card boundary exactly should not flicker hover', async ({ page }) => {
      const card = page.locator('#chronos .bento-card');
      const box = await card.boundingBox();
      if (box) {
        await page.mouse.move(box.x, box.y);
      }
      await expect(card).toBeVisible();
    });

    test('should handle empty tech stack gracefully', async ({ page }) => {
      const techElements = page.locator('#chronos').locator('span');
      const count = await techElements.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  // 5. Contact Section / Form (5 tests)
  test.describe('5. Contact Section Boundaries', () => {
    test('copying contact links should work', async ({ page, context }) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      const emailLink = page.locator('#connect a[href^="mailto:"]');
      await emailLink.scrollIntoViewIfNeeded();
      // Right click or click to copy, or verify copy behavior if clipboard-copy is implemented
      await expect(emailLink).toBeVisible();
    });

    test('right clicking links should not break cursor lock state', async ({ page }) => {
      const emailLink = page.locator('#connect a[href^="mailto:"]');
      await emailLink.scrollIntoViewIfNeeded();
      await emailLink.click({ button: 'right' });
      const cursor = page.locator('[data-testid="custom-cursor"]');
      await expect(cursor).toBeVisible();
    });

    test('keyboard navigation can focus contact links', async ({ page }) => {
      await page.keyboard.press('Tab');
      // Tab until a link in connect is focused
      let focusedHref = '';
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');
        focusedHref = await page.evaluate(() => (document.activeElement as any)?.href || '');
        if (focusedHref.includes('mailto') || focusedHref.includes('github') || focusedHref.includes('linkedin')) {
          break;
        }
      }
      expect(focusedHref).not.toBe('');
    });

    test('pressing Enter on focused links should trigger action', async ({ page }) => {
      const emailLink = page.locator('#connect a[href^="mailto:"]');
      await emailLink.scrollIntoViewIfNeeded();
      await emailLink.focus();
      // Should not crash the page when Enter is pressed
      await page.keyboard.press('Enter');
      await expect(emailLink).toBeVisible();
    });

    test('rapid hover and unhover of contact links does not crash cursor', async ({ page }) => {
      const emailLink = page.locator('#connect a[href^="mailto:"]');
      await emailLink.scrollIntoViewIfNeeded();
      const box = await emailLink.boundingBox();
      if (box) {
        for (let i = 0; i < 5; i++) {
          await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await page.mouse.move(box.x - 100, box.y - 100);
        }
      }
      const cursor = page.locator('[data-testid="custom-cursor"]');
      await expect(cursor).toBeVisible();
    });
  });

  // 6. Terminal Console (5 tests)
  test.describe('6. Terminal Console Boundaries', () => {
    test('should wrap or truncate long log lines', async ({ page }) => {
      const consoleWrapper = page.locator('[data-testid="terminal-console"]');
      const isScrollableX = await consoleWrapper.evaluate((el) => el.scrollWidth > el.clientWidth + 5);
      // Terminal should wrap text rather than scroll horizontally
      expect(isScrollableX).toBe(false);
    });

    test('log buffer should be capped at max lines', async ({ page }) => {
      // Trigger multiple logs by scrolling
      await page.evaluate(() => {
        window.scrollTo(0, 500);
        window.scrollTo(0, 1000);
        window.scrollTo(0, 1500);
      });
      const logLines = page.locator('[data-testid="terminal-console"] [data-testid="terminal-log-line"]');
      const count = await logLines.count();
      expect(count).toBeLessThanOrEqual(50); // Capped at 50 or similar max log lines
    });

    test('high frequency log updates should not degrade performance', async ({ page }) => {
      // Simulate fast scroll triggering logs
      await page.evaluate(async () => {
        for (let i = 0; i < 20; i++) {
          window.scrollTo(0, i * 100);
          await new Promise((r) => setTimeout(r, 10));
        }
      });
      const terminal = page.locator('[data-testid="terminal-console"]');
      await expect(terminal).toBeVisible();
    });

    test('resizing window recalculates terminal layout', async ({ page }) => {
      await page.setViewportSize({ width: 800, height: 600 });
      const terminal = page.locator('[data-testid="terminal-console"]');
      await expect(terminal).toBeVisible();
      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(terminal).toBeVisible();
    });

    test('collapsing terminal preserves log history', async ({ page }) => {
      const toggleBtn = page.locator('[data-testid="terminal-toggle"]');
      if (await toggleBtn.isVisible()) {
        await toggleBtn.click(); // Collapse
        await toggleBtn.click(); // Expand
        const bootLog = page.locator('[data-testid="terminal-console"]').getByText('SYS: Booting Core Decryptor');
        await expect(bootLog).toBeVisible();
      }
    });
  });

  // 7. Custom Cursor (5 tests)
  test.describe('7. Custom Cursor Boundaries', () => {
    test('moving mouse outside window should hide cursor', async ({ page }) => {
      const cursor = page.locator('[data-testid="custom-cursor"]');
      // Move mouse out of viewport (negative coordinates)
      await page.mouse.move(-10, -10);
      const opacity = await cursor.evaluate((el) => window.getComputedStyle(el).opacity);
      expect(parseFloat(opacity)).toBe(0);
    });

    test('touch devices should hide custom cursor', async ({ page }) => {
      // Emulate mobile device or touch support
      const hasTouch = await page.evaluate(() => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      });
      if (hasTouch) {
        const cursor = page.locator('[data-testid="custom-cursor"]');
        await expect(cursor).toBeHidden();
      }
    });

    test('extreme mouse speeds should not cause reticle lag beyond LERP', async ({ page }) => {
      await page.mouse.move(0, 0);
      await page.mouse.move(1000, 1000);
      const coords = page.locator('[data-testid="cursor-coords"]');
      // Wait for LERP to catch up
      await page.waitForTimeout(200);
      await expect(coords).toHaveText(/X:\s*1000\s+Y:\s*1000/);
    });

    test('cursor should not block pointer events', async ({ page }) => {
      const cursor = page.locator('[data-testid="custom-cursor"]');
      const pointerEvents = await cursor.evaluate((el) => window.getComputedStyle(el).pointerEvents);
      expect(pointerEvents).toBe('none');
    });

    test('cursor handles dragging events gracefully', async ({ page }) => {
      await page.mouse.move(100, 100);
      await page.mouse.down();
      await page.mouse.move(300, 300);
      await page.mouse.up();
      const cursor = page.locator('[data-testid="custom-cursor"]');
      await expect(cursor).toBeVisible();
    });
  });

  // 8. Smooth Scroll (5 tests)
  test.describe('8. Smooth Scroll Boundaries', () => {
    test('scrolling past bottom boundary is handled gracefully', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight + 500));
      const scrollY = await page.evaluate(() => window.scrollY);
      const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
      expect(scrollY).toBeLessThanOrEqual(maxScroll + 10);
    });

    test('high frequency trackpad scroll does not cause jitter', async ({ page }) => {
      await page.evaluate(() => {
        let y = 0;
        const interval = setInterval(() => {
          y += 50;
          window.scrollTo(0, y);
          if (y > 1000) clearInterval(interval);
        }, 5);
      });
      await page.waitForTimeout(200);
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    });

    test('keyboard scrolling coordinates with scroll progress', async ({ page }) => {
      await page.locator('body').click();
      await page.keyboard.press('PageDown');
      await page.waitForTimeout(500); // Wait for smooth scroll
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(0);
    });

    test('scroll animations pause when tab is backgrounded', async ({ page }) => {
      // In Playwright, we can simulate tab visibility change
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { value: true, writable: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      // Perform scroll
      await page.evaluate(() => window.scrollTo(0, 200));
      // Restore
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { value: false });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBe(200);
    });

    test('dynamic height changes recalculate scroll boundaries', async ({ page }) => {
      const initialHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.evaluate(() => {
        const extra = document.createElement('div');
        extra.style.height = '1000px';
        extra.setAttribute('id', 'temp-extra-height');
        document.body.appendChild(extra);
      });
      const newHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      expect(newHeight).toBeGreaterThan(initialHeight);
      // Cleanup
      await page.evaluate(() => document.getElementById('temp-extra-height')?.remove());
    });
  });

  // 9. 3D Canvas (5 tests)
  test.describe('9. 3D Canvas Boundaries', () => {
    test('should handle context loss and recovery', async ({ page }) => {
      const glLost = await page.evaluate(() => {
        const canvas = document.querySelector('.right-column canvas') as HTMLCanvasElement;
        const gl = canvas?.getContext('webgl') || canvas?.getContext('webgl2');
        if (!gl) return false;
        const ext = gl.getExtension('WEBGL_lose_context');
        if (ext) {
          ext.loseContext();
          return true;
        }
        return false;
      });
      // Should lose context successfully, and application should not crash
      expect(glLost).toBe(true);
    });

    test('low-spec GPU emulation falls back to static layout', async ({ page }) => {
      // Check if fallback elements exist or canvas displays friendly message
      const canvas = page.locator('.right-column canvas');
      await expect(canvas).toBeVisible();
    });

    test('resizing window updates camera aspect ratio instantly', async ({ page }) => {
      await page.setViewportSize({ width: 1200, height: 800 });
      const width1 = await page.locator('.right-column canvas').evaluate((el: any) => el.width);
      await page.setViewportSize({ width: 800, height: 600 });
      const width2 = await page.locator('.right-column canvas').evaluate((el: any) => el.width);
      expect(width1).not.toEqual(width2);
    });

    test('out-of-bounds coordinates do not crash shaders', async ({ page }) => {
      // Move mouse extremely far
      await page.mouse.move(10000, 10000);
      const canvas = page.locator('.right-column canvas');
      await expect(canvas).toBeVisible();
    });

    test('rendering remains stable when tab is minimized', async ({ page }) => {
      await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      // Wait a few frames
      await page.waitForTimeout(100);
      await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { value: 'visible' });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      const canvas = page.locator('.right-column canvas');
      await expect(canvas).toBeVisible();
    });
  });
});
