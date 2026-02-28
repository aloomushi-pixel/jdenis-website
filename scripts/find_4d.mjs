import fs from 'fs';
import https from 'https';

const url = 'https://www.jdenis.com/search/?q=Abanicos+4D';

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        fs.writeFileSync('C:/Users/Usuario/OneDrive/Documentos/J. DENIS/jdenis-website/scripts/temp_search_body.html', data);
        console.log('Saved HTML to scripts/temp_search_body.html');

        // Let's also parse out any links just in case
        const matches = data.match(/href="(https:\/\/www\.jdenis\.com\/productos\/[^"]+)"/ig);
        if (matches) {
            const unique = Array.from(new Set(matches));
            console.log('Found product links:', unique.filter(l => l.includes('4d')));
        }
    });

}).on("error", (err) => {
    console.log("Error: " + err.message);
});
