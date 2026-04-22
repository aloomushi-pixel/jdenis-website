import puppeteer from 'puppeteer';
import * as fs from 'fs';

(async () => {
    try {
        console.log('Launching browser...');
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({ width: 1400, height: 900 });
        
        console.log('Navigating to jdenis.store/login...');
        await page.goto('https://jdenis.store/login', { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        console.log('Logging in...');
        await page.type('input[type="email"]', 'ejecut_qa@jdenis.test');
        await page.type('input[type="password"]', 'JDenisQA2026!');
        await page.click('button[type="submit"]');
        
        console.log('Waiting 3 seconds for login to process...');
        await new Promise(r => setTimeout(r, 6000));
        
        console.log('Navigating to /admin/sales...');
        await page.goto('https://jdenis.store/admin/sales', { waitUntil: 'domcontentloaded', timeout: 30000 });
        
        console.log('Waiting 5 seconds for React to render...');
        await new Promise(r => setTimeout(r, 5000));
        
        const screenshotPath = './quoter_verification.png';
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log('Screenshot saved to ' + screenshotPath);
        
        await browser.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
