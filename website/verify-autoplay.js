const { chromium } = require('playwright');

(async () => {
    console.log("Starting browser to check reels autoplay...");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Disable animations so we don't have to wait for scroll transitions
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });

    // Scroll to the Reels section
    console.log("Scrolling to Reels section...");
    const reelsHeading = page.getByText('Reels y TikToks');
    await reelsHeading.scrollIntoViewIfNeeded();

    // Wait for videos to load
    await page.waitForTimeout(2000);

    // Check if any video is playing
    const videos = await page.locator('video.reel-video').all();
    console.log(`Found ${videos.length} videos in the DOM.`);

    for (let i = 0; i < videos.length; i++) {
        const isPaused = await videos[i].evaluate('node => node.paused');
        const currentTime = await videos[i].evaluate('node => node.currentTime');
        const src = await videos[i].evaluate('node => node.src');
        console.log(`Video ${i + 1} (${src}): Paused = ${isPaused}, CurrentTime = ${currentTime}`);
    }

    await browser.close();
})();
