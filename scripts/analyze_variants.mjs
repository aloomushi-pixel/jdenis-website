import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '../website/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function extractAttributes(name) {
    let baseName = name;
    let attrMap = {};

    // First handle special cases like "Curva B | 0.05 | GOLD Combo 8-15mm" which lacks a base name
    if (name.startsWith('Curva ') && name.includes('|')) {
        baseName = 'Extensiones de Pestañas'; // Generic base name for these missing ones
        // proceed to pipes logic
    }

    if (name.startsWith('Pestaña Curva') || name.startsWith('Easy Fan Curva')) {
        const parts = name.split('|');
        baseName = parts[0].replace(/Curva.*/, '').trim() || 'Extensiones de Pestañas';
        // push it through the pipe logic for the rest
    }

    // Pattern 1: Pipes -> "Abanicos | 2D | Curva B | 0.15 | 10 mm"
    if (name.includes(' | ') || name.includes('|')) {
        const parts = name.split('|').map(p => p.trim());
        if (parts.length >= 2) {

            let tempBase = baseName === name ? '' : baseName;

            for (const p of parts) {
                if (p.toLowerCase().includes('curva') && !p.toLowerCase().includes('pestaña') && !p.toLowerCase().includes('easy fan')) {
                    attrMap['Curva'] = p.replace(/curva/i, '').trim();
                } else if (p.match(/^[0-9.]+\s*mm$/i) || p.toLowerCase() === 'mixta' || p.toLowerCase().includes('combo') || p.toLowerCase().includes('mix')) {
                    attrMap['Longitud'] = p;
                } else if (p.match(/^[0-9.]+$/)) {
                    attrMap['Grosor'] = p;
                } else if (p.toLowerCase().includes('2d') || p.toLowerCase().includes('3d') || p.toLowerCase().includes('4d') || p.toLowerCase().includes('5d')) {
                    tempBase += tempBase ? ` ${p}` : p;
                } else if (tempBase === '') {
                    tempBase = p;
                }
            }

            baseName = tempBase.trim() || 'Extensiones de Pestañas';

            if (Object.keys(attrMap).length > 0) {
                return { baseName, attributes: attrMap };
            }
        }
    }

    // Pattern 2: Dashes -> "Adhesivo - Transparente" or "Tinte - Negro"
    if (name.includes(' - ')) {
        const parts = name.split(' - ');
        if (parts.length === 2 && !parts[1].includes(' ')) {
            return { baseName: parts[0].trim(), attributes: { 'Color/Tipo': parts[1].trim() } };
        }
    }

    // Pattern 3: Size at the end -> "Adhesivo Bálsamo 20 gr" or "Agua Micelar 120 ml"
    const sizeRegex = /(.+?)\s+(\d+\s*(?:ml|gr|pzas|piezas|g))$/i;
    const matchSize = name.match(sizeRegex);
    if (matchSize) {
        return { baseName: matchSize[1].trim(), attributes: { 'Tamaño': matchSize[2].trim() } };
    }

    // Pattern 4: Color prefix -> "Brown Gray Pigmento para Cejas"
    const pigmentRegex = /(.+?)\s+(Pigmento.*)/i;
    const matchPigment = name.match(pigmentRegex);
    if (matchPigment) {
        return { baseName: matchPigment[2].trim(), attributes: { 'Color': matchPigment[1].trim() } };
    }

    // Pattern 5: Henna "Henna para Cejas Rubio Oscuro"
    if (name.toLowerCase().startsWith('henna para cejas')) {
        const color = name.substring('Henna para cejas'.length).trim();
        if (color) {
            return { baseName: 'Henna para Cejas', attributes: { 'Color': color } };
        }
    }

    return { baseName: name, attributes: null };
}

async function analyzeProducts() {
    console.log('Fetching all products...');
    const { data: products, error } = await supabase.from('products').select('id, name').order('name');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    const variantGroupsMap = new Map();
    const ungrouped = [];

    for (const p of products) {
        const { baseName, attributes } = extractAttributes(p.name);

        if (attributes && Object.keys(attributes).length > 0) {
            // Capitalize first letter of baseName to keep groups clean
            const cleanBase = baseName.charAt(0).toUpperCase() + baseName.slice(1);
            const key = cleanBase.toLowerCase();

            if (!variantGroupsMap.has(key)) {
                variantGroupsMap.set(key, {
                    baseName: cleanBase,
                    variants: []
                });
            }

            variantGroupsMap.get(key).variants.push({
                product_id: p.id,
                name: p.name,
                attributes
            });
        } else {
            ungrouped.push(p);
        }
    }

    // Filter valid groups
    const validGroups = Array.from(variantGroupsMap.values()).filter(g => g.variants.length > 1);

    const validGroupsMap = validGroups.reduce((acc, curr) => {
        acc[curr.baseName] = curr;
        return acc;
    }, {});

    // Items that ended up alone get put back in ungrouped
    for (const group of Array.from(variantGroupsMap.values())) {
        if (group.variants.length === 1) {
            ungrouped.push(group.variants[0]);
        }
    }

    const report = {
        totalProductsOriginal: products.length,
        totalProposedGroups: validGroups.length,
        totalProductsGrouped: validGroups.reduce((acc, g) => acc + g.variants.length, 0),
        totalUngrouped: ungrouped.length,
        groups: validGroupsMap,
        ungroupedPreview: ungrouped.slice(0, 15)
    };

    const outPath = 'proposed_variants.json';
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf-8');

    console.log(`\nAnalysis complete.`);
    console.log(`- Proposed ${validGroups.length} variant groups covering ${report.totalProductsGrouped} products.`);
    console.log(`- Left ${report.totalUngrouped} products ungrouped.`);
    console.log(`- Saved results to ${outPath}\n`);
}

analyzeProducts();
