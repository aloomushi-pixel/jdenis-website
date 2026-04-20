const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg-static');
const sharp = require('sharp');
const { execSync } = require('child_process');

const desktopFolder = path.join('C:\\Users\\info\\Desktop', 'Evidencias_QA_JDenis');

async function convertAll() {
    try {
        const files = fs.readdirSync(desktopFolder);
        const webpFiles = files.filter(f => f.endsWith('.webp'));

        if (webpFiles.length === 0) {
            console.log('No .webp files found to convert.');
            return;
        } else {
            console.log(`Found ${webpFiles.length} files to convert...`);
        }

        for (const file of webpFiles) {
            const inputPath = path.join(desktopFolder, file);
            const tempGifPath = path.join(desktopFolder, file.replace('.webp', '.temp.gif'));
            const outputFilename = file.replace('.webp', '.mp4');
            const outputPath = path.join(desktopFolder, outputFilename);

            console.log(`Converting ${file} to GIF...`);
            await sharp(inputPath, { animated: true, limitInputPixels: false })
                  .toFormat('gif')
                  .toFile(tempGifPath);

            console.log(`Encoding GIF to MP4 using ffmpeg...`);
            // ffmpeg command to convert gif to mp4. 
            execSync(`"${ffmpeg}" -i "${tempGifPath}" -c:v libx264 -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" "${outputPath}" -y`, { stdio: 'inherit' });
            
            console.log(`Success! Clean up...`);
            try { fs.unlinkSync(inputPath); } catch (e) {}
            try { fs.unlinkSync(tempGifPath); } catch (e) {}
        }
        
        console.log('All WebP videos have been converted to MP4.');
    } catch (error) {
        console.error('Error during conversion:', error.message);
    }
}

convertAll();
