const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.setViewport({ width: 1280, height: 800 });
    
    // Capture unhandled errors on the page
    page.on('pageerror', error => {
      console.log('\n--- FATAL JS ERROR ---');
      console.log(error.message);
      console.log('----------------------\n');
    });

    console.log("Navigating to http://localhost:5173/");
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    
    await page.screenshot({ path: 'C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\8a465b3d-e3ce-41a8-bf46-62c8c9c829c0\\debug_screenshot.png' });
    console.log('Screenshot saved to debug_screenshot.png');
    
    await browser.close();
  } catch (err) {
    console.error('Test execution failed:', err);
  }
})();
