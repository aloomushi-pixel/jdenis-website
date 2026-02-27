async function testFetch() {
    // 100-microbrush-largo is just an example of a known TiendaNube slug
    const url = 'https://www.jdenis.com/productos/100-microbrush-largo/';
    console.log(`Fetching ${url}...`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(`Failed to fetch: ${response.status}`);
            return;
        }

        const html = await response.text();

        // Find og:image
        const ogMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
        if (ogMatch && ogMatch[1]) {
            let imgUrl = ogMatch[1];
            // Tiendanube OG images often have HTTP instead of HTTPS, let's fix that if so
            if (imgUrl.startsWith('http://')) {
                imgUrl = imgUrl.replace('http://', 'https://');
            }
            console.log(`Found OG Image: ${imgUrl}`);
        } else {
            console.log('No og:image found');
        }

    } catch (e) {
        console.error(e);
    }
}

testFetch();
