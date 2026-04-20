const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Capture unhandled errors on the page
    page.on('pageerror', error => {
      console.log('\n--- FATAL JS ERROR ---');
      console.log(error.message);
      console.log('----------------------\n');
    });

    // Capture console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('\n--- CONSOLE ERROR ---');
        console.log(msg.text());
        console.log('----------------------\n');
      }
    });

    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
    
    const content = await page.content();
    console.log('HTML Loaded. Content length:', content.length);
    
    // Check if React root is populated
    const rootHasChildren = await page.$eval('#root', el => el.children.length > 0);
    console.log('Does root have children (React mounted)?', rootHasChildren);

    await browser.close();
  } catch (err) {
    console.error('Test execution failed:', err);
  }
})();
