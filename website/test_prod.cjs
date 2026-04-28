const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('CONSOLE:', msg.text()));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText));
    page.on('response', response => {
      if (!response.ok()) console.log('RESPONSE NOT OK:', response.url(), response.status());
    });
    
    console.log('Navigating to jdenis.store...');
    await page.goto('https://jdenis.store/', { waitUntil: 'networkidle2', timeout: 30000 });
    
    console.log('Page loaded successfully. Waiting 3 seconds for async requests...');
    await new Promise(r => setTimeout(r, 3000));
    
    await browser.close();
    console.log('Test completed.');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
})();
