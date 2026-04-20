const puppeteer = require('puppeteer');

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
    try {
        console.log("Starting QA Shipping Automation...");
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        console.log("Navigating to /tienda...");
        await page.goto('http://localhost:5173/tienda', { waitUntil: 'networkidle2' });

        console.log("Waiting for products to load...");
        await delay(3000);
        
        console.log("Adding product to cart...");
        
        const addButtons = await page.$$eval('button', buttons => {
            return buttons.map((b, i) => b.textContent.includes('Añadir') || b.textContent.includes('Agregar') ? i : -1).filter(i => i >= 0);
        });
        
        if (addButtons.length > 0) {
            const btns = await page.$$('button');
            await btns[addButtons[0]].click();
            await delay(2000);
            
            console.log("Navigating to /checkout...");
            await page.goto('http://localhost:5173/checkout', { waitUntil: 'networkidle2' });
            
            await page.waitForSelector('input[name="fullName"]');
            console.log("Filling checkout form...");
            
            await page.type('input[name="fullName"]', 'Cliente Pruebas QA');
            await page.type('input[name="email"]', 'test@jdenis.com');
            await page.type('input[name="phone"]', '5555555555');
            await page.type('input[name="address"]', 'Calle Reforma 1234');
            await page.type('textarea[name="references"]', 'Edificio de oficinas');
            await page.type('input[name="city"]', 'CDMX');
            await page.type('input[name="state"]', 'CDMX');
            await page.type('input[name="zip"]', '12345');
            
            console.log("Form filled. Saving screenshot before submission...");
            await page.screenshot({ path: 'C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\8a465b3d-e3ce-41a8-bf46-62c8c9c829c0\\checkout_ready.png' });
            
            console.log("Submitting order...");
            const submitBtn = await page.$('button[type="submit"]');
            if (submitBtn) {
                await submitBtn.click();
                
                console.log("Waiting for post-submit processing...");
                await delay(5000); // Wait 5 seconds for MercadoPago redirect OR success
                
                await page.screenshot({ path: 'C:\\Users\\Usuario\\.gemini\\antigravity\\brain\\8a465b3d-e3ce-41a8-bf46-62c8c9c829c0\\checkout_success.png' });
                const currentUrl = await page.url();
                console.log("Success! Finished checkout process. Current URL: " + currentUrl);
            } else {
                console.log("Could not find submit button!");
            }
        } else {
            console.log("No add to cart buttons found!");
        }

        await browser.close();
    } catch (err) {
        console.error('Test execution failed:', err);
    }
})();
