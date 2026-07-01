const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Start the local dev server is not needed if we run it manually or let playwright config do it, 
  // but since we want to inspect, let's just run dev server in background or go to the running one if it is up?
  // Wait, we don't have a running dev server right now. We can start vite on port 5173 using child_process or just navigate to the build output.
  // Actually, we can use vite preview on the build output! Let's start the preview or dev server in our script, or just run a simple http-server on dist.
  // Wait, let's start the vite dev server in the script.
  const { exec } = require('child_process');
  const server = exec('npx vite --port 5173', { cwd: 'C:\\Users\\abhis\\\.gemini\\antigravity\\scratch\\portfolio' });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  try {
    await page.goto('http://localhost:5173/anatomy.html');
    await page.waitForSelector('svg polygon', { timeout: 5000 });
    
    const svgHTML = await page.locator('div.bg-\\[\\#ababab\\]').innerHTML();
    console.log('SVG Inner HTML:');
    console.log(svgHTML);
    
    const svgColor = await page.evaluate(() => {
      const svg = document.querySelector('div.bg-\\[\\#ababab\\] svg');
      const polygon = document.querySelector('div.bg-\\[\\#ababab\\] svg polygon');
      return {
        svgColor: window.getComputedStyle(svg).color,
        svgFill: window.getComputedStyle(svg).fill,
        polygonColor: window.getComputedStyle(polygon).color,
        polygonFill: window.getComputedStyle(polygon).fill,
      };
    });
    console.log('Computed Styles:', svgColor);
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
    server.kill();
  }
})();
