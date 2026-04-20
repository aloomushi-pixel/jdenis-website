const XLSX = require('xlsx');
const fs = require('fs');

const wb = XLSX.readFile('C:\\Users\\info\\Downloads\\Clientes News Letter.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

const records = [];
const seenEmails = new Set();

function esc(s) {
    if (!s) return null;
    return s.toString().trim().replace(/'/g, "''");
}

for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    const rawEmail = (row[1] || '').toString().toLowerCase().trim();
    if (!rawEmail || seenEmails.has(rawEmail)) continue;
    seenEmails.add(rawEmail);
    
    const email = esc(rawEmail);
    const name = esc(row[0]);
    const phone = esc(row[2]);
    const city = esc(row[8]);
    const state = esc(row[10]);
    const country = esc(row[12]) || 'México';
    const totalSpent = parseFloat(row[13]) || 0;
    const purchaseCount = parseInt(row[14]) || 0;
    
    const wrap = (v) => v ? "'" + v + "'" : 'NULL';
    
    records.push(
        '(' + [
            "'" + email + "'",
            wrap(name),
            wrap(phone),
            wrap(city),
            wrap(state),
            "'" + country + "'",
            "'import'",
            totalSpent,
            purchaseCount,
            'true',
            'now()',
            'now()'
        ].join(',') + ')'
    );
}

console.log('Total unique records:', records.length);

// Write SQL batches
const BATCH = 200;
const batches = [];
for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);
    const sql = 'INSERT INTO public.newsletter_subscribers (email, name, phone, city, state, country, source, total_spent, purchase_count, is_active, subscribed_at, created_at) VALUES\n' + batch.join(',\n') + '\nON CONFLICT (email) DO NOTHING;';
    batches.push(sql);
}

console.log('Total batches:', batches.length);
fs.writeFileSync('newsletter_batches.json', JSON.stringify(batches));
console.log('Saved to newsletter_batches.json');
