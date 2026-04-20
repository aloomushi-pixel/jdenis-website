const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.error('PAGE ERROR:', error));
    page.on('requestfailed', request => {
        console.error('REQUEST FAILED:', request.url(), request.failure().errorText);
    });

    try {
        await page.goto('http://localhost:5174/iniciar-sesion', { waitUntil: 'networkidle0', timeout: 30000 });
        console.log('Page loaded successfully');
    } catch (e) {
        console.error('Navigation error:', e);
    }
    
    // Wait an additional 3 seconds
    await new Promise(r => setTimeout(r, 3000));
    await browser.close();
})();
