import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { NormalizedVariant } from '../hooks/useVariants';

interface VariantSelectorProps {
    variants: NormalizedVariant[];
    selectedVariantId: string;
    onVariantChange: (variantId: string) => void;
}

export default function VariantSelector({
    variants,
    selectedVariantId,
    onVariantChange,
}: VariantSelectorProps) {
    const attributeNames = useMemo(() => {
        const set = new Set<string>();
        for (const v of variants) {
            Object.keys(v.attributes || {}).forEach(k => set.add(k));
        }
        return Array.from(set);
    }, [variants]);

    const attributeOptions = useMemo(() => {
        return attributeNames.map(attrName => {
            const values: string[] = [];
            for (const v of variants) {
                const val = v.attributes[attrName];
                if (val && !values.includes(val)) {
                    values.push(val);
                }
            }
            return { name: attrName, values };
        });
    }, [variants, attributeNames]);

    const currentVariant = useMemo(
        () => variants.find(v => v.id === selectedVariantId) || variants[0],
        [variants, selectedVariantId]
    );
    const currentAttrs = currentVariant?.attributes || {};

    const handleAttributeChange = (attrName: string, newValue: string) => {
        const desired = { ...currentAttrs, [attrName]: newValue };

        let bestMatch: NormalizedVariant | null = null;
        let bestScore = -1;

        for (const candidate of variants) {
            if (candidate.attributes[attrName] !== newValue) continue;

            let score = 0;
            for (const key of attributeNames) {
                if (desired[key] && candidate.attributes[key] === desired[key]) {
                    score += 10;
                }
            }
            // Prefer in-stock combinations when scores tie
            if (candidate.stock > 0) {
                score += 1;
            }

            if (score > bestScore) {
                bestScore = score;
                bestMatch = candidate;
            }
        }

        if (bestMatch && bestMatch.id !== selectedVariantId) {
            onVariantChange(bestMatch.id);
        }
    };

    if (variants.length <= 1) return null;

    const prices = variants.map(v => v.price).filter(p => p > 0);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const hasPriceRange = prices.length > 0 && minPrice !== maxPrice;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5 space-y-4"
        >
            <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold py-1 px-2.5 rounded-md bg-gold/10 text-forest">
                    {variants.length} opciones disponibles
                </span>
                {hasPriceRange && (
                    <span className="text-xs text-charcoal/50 font-medium">
                        · ${minPrice.toLocaleString('es-MX')} – ${maxPrice.toLocaleString('es-MX')} MXN
                    </span>
                )}
                {currentVariant?.sku && (
                    <span className="text-[11px] font-mono text-charcoal/40 ml-auto">
                        SKU: {currentVariant.sku}
                    </span>
                )}
            </div>

            {attributeOptions.length > 0 ? (
                attributeOptions.map(attr => (
                    <div key={attr.name}>
                        <label className="block text-sm font-medium text-charcoal/70 mb-2">
                            {attr.name}:{' '}
                            <span className="font-semibold text-forest">
                                {currentAttrs[attr.name] || '–'}
                            </span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {attr.values.map(val => {
                                const isSelected = currentAttrs[attr.name] === val;
                                const matchingVariants = variants.filter(
                                    v => v.attributes[attr.name] === val
                                );
                                const anyInStock = matchingVariants.some(v => v.stock > 0);

                                return (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => handleAttributeChange(attr.name, val)}
                                        className={`min-w-[44px] min-h-[44px] px-3.5 py-2 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 border text-center ${
                                            isSelected
                                                ? 'border-forest bg-forest text-white shadow-md scale-[1.02]'
                                                : !anyInStock
                                                  ? 'border-kraft/40 bg-gray-50 text-charcoal/40 line-through hover:border-forest/50'
                                                  : 'border-kraft/60 bg-white text-charcoal/80 hover:border-forest hover:text-forest hover:bg-forest/5'
                                        }`}
                                    >
                                        {val}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))
            ) : (
                <div>
                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                        Opción:{' '}
                        <span className="font-semibold text-forest">
                            {currentVariant?.title || '–'}
                        </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {variants.map(v => {
                            const isSelected = v.id === selectedVariantId;
                            const inStock = v.stock > 0;
                            return (
                                <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => onVariantChange(v.id)}
                                    className={`min-w-[44px] min-h-[44px] px-3.5 py-2 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200 border text-center ${
                                        isSelected
                                            ? 'border-forest bg-forest text-white shadow-md scale-[1.02]'
                                            : !inStock
                                              ? 'border-kraft/40 bg-gray-50 text-charcoal/40 line-through hover:border-forest/50'
                                              : 'border-kraft/60 bg-white text-charcoal/80 hover:border-forest hover:text-forest hover:bg-forest/5'
                                    }`}
                                >
                                    {v.title}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
