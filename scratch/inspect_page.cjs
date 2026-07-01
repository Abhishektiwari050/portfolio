const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const { exec } = require('child_process');
  const server = exec('npx vite --port 5173', { cwd: 'C:\\Users\\abhis\\.gemini\\antigravity\\scratch\\portfolio' });
  
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
