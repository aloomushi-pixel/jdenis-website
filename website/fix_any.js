import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('dist')) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(file);
        }
    });
    return results;
}

const allFiles = walk(path.join(process.cwd(), 'src'));

for (const f of allFiles) {
    let content = fs.readFileSync(f, 'utf8');
    let changed = false;

    // Replace `: any` with `: unknown`
    if (content.match(/:\s*any\b/)) {
        content = content.replace(/:\s*any\b/g, ': unknown');
        changed = true;
    }
    // Replace `<any>` with `<unknown>`
    if (content.match(/<\s*any\s*>/)) {
        content = content.replace(/<\s*any\s*>/g, '<unknown>');
        changed = true;
    }
    // Replace ` as any` with ` as unknown`
    if (content.match(/\s+as\s+any\b/)) {
        content = content.replace(/\s+as\s+any\b/g, ' as unknown');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(f, content);
        console.log(`Replaced any with unknown in ${f}`);
    }
}
