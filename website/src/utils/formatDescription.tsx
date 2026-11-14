import React from 'react';

function decodeHtmlEntities(input: string): string {
    return input
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>');
}

function normalizeTextForCompare(input: string): string {
    return input
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

export function cleanPlainText(raw?: string | null): string {
    if (!raw) return '';
    return decodeHtmlEntities(raw)
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|li|h[1-6]|div)>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/(^|\s)\*+/g, '$1')
        .replace(/\s*\(Cod\.\s*[^)]+\)/gi, '')
        .replace(/—\s*Características detalladas:\s*/gi, '')
        .replace(/\s*\|\s*/g, ' · ')
        .replace(/[ \t]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function isRedundantHeaderLine(line: string, productName: string): boolean {
    const clean = line.replace(/[.!:]+$/, '').trim();
    if (!clean) return true;
    const normLine = normalizeTextForCompare(clean);
    const normName = normalizeTextForCompare(productName);
    if (!normLine || normLine === 'descripcion') return true;
    if (normLine === normName) return true;
    // Short title echo or badge line without sentence structure
    if (clean.length < 44 && !/[.,;:]/.test(clean)) {
        if (normName.includes(normLine) || normLine.includes(normName)) return true;
        if (/^(6\.?ª?\s*generaci[oó]n|cisteamina estabilizada|lamination kit|uso profesional|presentaci[oó]n individual)$/i.test(clean)) {
            return true;
        }
    }
    return false;
}

/**
 * Clean, human-friendly 1–2 sentence excerpt for ProductCard in /tienda.
 */
export function getCardExcerpt(productName: string, description?: string | null, maxLen = 135): string {
    const cleaned = cleanPlainText(description);
    if (!cleaned) return '';

    const lines = cleaned
        .split(/\n+/)
        .map(l => l.replace(/^•\s*/, '').trim())
        .filter(Boolean);

    // Prefer the first substantive descriptive sentence (> 42 chars and not just repeating the product name)
    const substantive = lines.filter(l => !isRedundantHeaderLine(l, productName));
    const candidatePool = substantive.length > 0 ? substantive : lines;
    const best = candidatePool.find(l => l.length >= 45) || candidatePool.join(' ');

    if (best.length <= maxLen) return best;
    const sliced = best.slice(0, maxLen);
    const lastSpace = sliced.lastIndexOf(' ');
    return `${(lastSpace > 60 ? sliced.slice(0, lastSpace) : sliced).replace(/[,;:\s]+$/, '')}…`;
}

/**
 * Concise 1–2 paragraph executive summary for the Hero section of ProductDetail
 * (above the Add-to-Cart button), keeping the page scannable and attractive.
 */
export function getHeroSummary(
    productName: string,
    description?: string | null
): { paragraphs: string[]; hasMore: boolean } {
    const cleaned = cleanPlainText(description);
    if (!cleaned) {
        return {
            paragraphs: [
                'Producto cosmético profesional de alta calidad diseñado para especialistas en belleza y uso personal. Fórmulas desarrolladas en México por J. Denis con más de 25 años de experiencia.',
            ],
            hasMore: false,
        };
    }

    const rawLines = cleaned
        .split(/\n+/)
        .map(l => l.trim())
        .filter(Boolean);

    const meaningful = rawLines.filter((l, idx) => !(idx < 3 && isRedundantHeaderLine(l, productName)));
    const lines = meaningful.length > 0 ? meaningful : rawLines;

    const selected: string[] = [];
    let totalChars = 0;

    for (const line of lines) {
        // Stop before section headers or bullet lists once we already have a clear intro paragraph
        if (selected.length >= 1 && (/^•/.test(line) || /:$/.test(line) || line.length < 36)) {
            break;
        }
        selected.push(line.replace(/^•\s*/, ''));
        totalChars += line.length;
        if (selected.length >= 2 || totalChars >= 280) {
            break;
        }
    }

    if (selected.length === 0 && lines.length > 0) {
        selected.push(lines[0]);
    }

    // Clamp overly long single-paragraph summaries cleanly at a sentence boundary
    if (selected.length === 1 && selected[0].length > 420) {
        const sentences = selected[0].match(/[^.!?]+[.!?]+/g);
        if (sentences && sentences.length > 1) {
            let acc = '';
            for (const s of sentences) {
                if ((acc + s).length > 380 && acc.length > 100) break;
                acc += s;
            }
            selected[0] = acc.trim();
        } else {
            const cut = selected[0].slice(0, 360);
            selected[0] = `${cut.slice(0, cut.lastIndexOf(' '))}…`;
        }
    }

    const hasMore = cleaned.length > selected.join(' ').length + 60;
    return { paragraphs: selected, hasMore };
}

/**
 * Checks whether a variant_description adds useful variant-specific info
 * rather than just echoing generic pipe specs or the full parent description.
 */
export function getCleanVariantNote(
    variantDesc?: string | null,
    parentDesc?: string | null
): string | null {
    if (!variantDesc) return null;
    const cleanVar = cleanPlainText(variantDesc);
    if (!cleanVar || cleanVar.length < 12) return null;
    const cleanParent = cleanPlainText(parentDesc);
    if (cleanParent && normalizeTextForCompare(cleanParent).startsWith(normalizeTextForCompare(cleanVar.slice(0, 60)))) {
        return null;
    }
    if (cleanVar.length > 220) {
        const cut = cleanVar.slice(0, 210);
        return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
    }
    return cleanVar;
}

function renderInlineFormatting(text: string): React.ReactNode {
    // Safely render <strong> and <em> segments without dangerouslySetInnerHTML
    const normalized = decodeHtmlEntities(
        text
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/<b\b[^>]*>([\s\S]*?)<\/b>/gi, '<strong>$1</strong>')
            .replace(/<i\b[^>]*>([\s\S]*?)<\/i>/gi, '<em>$1</em>')
    );

    const tokens = normalized.split(/(<strong>[\s\S]*?<\/strong>|<em>[\s\S]*?<\/em>)/gi).filter(Boolean);
    return tokens.map((tok, i) => {
        const strongMatch = tok.match(/^<strong>([\s\S]*?)<\/strong>$/i);
        if (strongMatch) {
            const inner = strongMatch[1].replace(/<[^>]+>/g, '').trim();
            return <strong key={i} className="font-semibold text-forest">{inner}</strong>;
        }
        const emMatch = tok.match(/^<em>([\s\S]*?)<\/em>$/i);
        if (emMatch) {
            const inner = emMatch[1].replace(/<[^>]+>/g, '').trim();
            return <em key={i} className="italic text-charcoal/75">{inner}</em>;
        }
        return <React.Fragment key={i}>{tok.replace(/<[^>]+>/g, '')}</React.Fragment>;
    });
}

interface ParsedBlock {
    type: 'heading' | 'paragraph' | 'list' | 'image';
    text?: string;
    items?: string[];
    src?: string;
}

function parseEditorialBlocks(productName: string, html?: string | null, plain?: string | null): ParsedBlock[] {
    const blocks: ParsedBlock[] = [];

    if (html && /<(p|ul|ol|h[1-6])\b/i.test(html)) {
        const regex = /<(h[1-6]|p|ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi;
        let match: RegExpExecArray | null;
        let idx = 0;

        while ((match = regex.exec(html)) !== null) {
            const tag = match[1].toLowerCase();
            const inner = match[2].trim();
            if (!inner) continue;

            if (tag === 'ul' || tag === 'ol') {
                const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
                    .map(m => m[1].replace(/\s+/g, ' ').trim())
                    .filter(Boolean);
                if (items.length > 0) {
                    blocks.push({ type: 'list', items });
                    idx++;
                }
                continue;
            }

            const imgMatch = inner.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
            const stripped = decodeHtmlEntities(inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

            if (!stripped && imgMatch && imgMatch[1].startsWith('https://')) {
                blocks.push({ type: 'image', src: imgMatch[1] });
                continue;
            }

            if (!stripped) continue;
            if (idx === 0 && normalizeTextForCompare(stripped) === normalizeTextForCompare(productName)) {
                continue;
            }

            if (tag.startsWith('h')) {
                blocks.push({ type: 'heading', text: stripped.replace(/:$/, '') });
            } else {
                // Auto-split paragraphs with inline "• " bullets
                if (stripped.includes('•') && stripped.startsWith('•')) {
                    const items = stripped.split(/\s*•\s*/).map(s => s.trim()).filter(Boolean);
                    blocks.push({ type: 'list', items });
                } else {
                    blocks.push({ type: 'paragraph', text: inner });
                }
            }
            idx++;
        }
    }

    if (blocks.length === 0 && plain) {
        const cleaned = cleanPlainText(plain);
        const lines = cleaned.split(/\n+/).map(l => l.trim()).filter(Boolean);
        let listBuffer: string[] = [];

        const flushList = () => {
            if (listBuffer.length > 0) {
                blocks.push({ type: 'list', items: [...listBuffer] });
                listBuffer = [];
            }
        };

        lines.forEach((line, idx) => {
            if (idx === 0 && normalizeTextForCompare(line) === normalizeTextForCompare(productName)) return;
            if (line.startsWith('•')) {
                listBuffer.push(line.replace(/^•\s*/, '').trim());
            } else {
                flushList();
                if (line.endsWith(':') && line.length <= 70) {
                    blocks.push({ type: 'heading', text: line.replace(/:$/, '') });
                } else {
                    blocks.push({ type: 'paragraph', text: line });
                }
            }
        });
        flushList();
    }

    return blocks;
}

export function FormattedProductDescription({
    productName,
    html,
    plain,
}: {
    productName: string;
    html?: string | null;
    plain?: string | null;
}) {
    const blocks = parseEditorialBlocks(productName, html, plain);
    if (blocks.length === 0) return null;

    return (
        <div className="space-y-4">
            {blocks.map((block, idx) => {
                if (block.type === 'heading') {
                    return (
                        <h3
                            key={idx}
                            className="font-serif text-base sm:text-lg text-forest pt-3 pb-1 border-l-4 border-gold pl-3"
                        >
                            {block.text}
                        </h3>
                    );
                }
                if (block.type === 'list' && block.items) {
                    return (
                        <ul key={idx} className="grid sm:grid-cols-2 gap-2.5 my-2">
                            {block.items.map((item, liIdx) => (
                                <li
                                    key={liIdx}
                                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-cream/60 border border-kraft/15 text-sm text-charcoal/85 leading-relaxed"
                                >
                                    <span className="text-gold font-bold mt-0.5 flex-shrink-0">✓</span>
                                    <span>{renderInlineFormatting(item)}</span>
                                </li>
                            ))}
                        </ul>
                    );
                }
                if (block.type === 'image' && block.src) {
                    return (
                        <div key={idx} className="my-4 rounded-2xl overflow-hidden border border-kraft/20 bg-white p-3 shadow-sm">
                            <img
                                src={block.src}
                                alt={`Ficha técnica de ${productName}`}
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                                className="max-w-full h-auto mx-auto rounded-xl"
                            />
                        </div>
                    );
                }
                return (
                    <p key={idx} className="text-sm sm:text-base text-charcoal/85 leading-relaxed">
                        {renderInlineFormatting(block.text || '')}
                    </p>
                );
            })}
        </div>
    );
}
