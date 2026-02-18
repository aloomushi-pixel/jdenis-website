import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { VariantGroup } from '../data/products';
import { getProductById } from '../data/products';

interface VariantSelectorProps {
    group: VariantGroup;
    currentProductId: string;
    onVariantChange: (productId: string) => void;
}

export default function VariantSelector({ group, currentProductId, onVariantChange }: VariantSelectorProps) {
    // Get unique values for each attribute
    const attributeOptions = useMemo(() => {
        const result: { name: string; values: { value: string; productIds: string[] }[] }[] = [];

        for (const attrName of group.attributeNames) {
            const valueMap = new Map<string, string[]>();

            for (const variant of group.variants) {
                const val = variant.attributes[attrName];
                if (val) {
                    const existing = valueMap.get(val) || [];
                    existing.push(variant.productId);
                    valueMap.set(val, existing);
                }
            }

            result.push({
                name: attrName,
                values: Array.from(valueMap.entries()).map(([value, productIds]) => ({
                    value,
                    productIds,
                })),
            });
        }

        return result;
    }, [group]);

    // Get current variant's attributes
    const currentVariant = group.variants.find(v => v.productId === currentProductId);
    const currentAttrs = currentVariant?.attributes || {};

    // Find the best matching product when an attribute changes
    const handleAttributeChange = (attrName: string, newValue: string) => {
        // Build desired attributes
        const desired = { ...currentAttrs, [attrName]: newValue };

        // Find the variant that best matches all desired attributes
        let bestMatch: string | null = null;
        let bestScore = -1;

        for (const variant of group.variants) {
            let score = 0;
            let matches = true;

            for (const key of group.attributeNames) {
                if (desired[key] && variant.attributes[key] === desired[key]) {
                    score++;
                } else if (key === attrName) {
                    // The changed attribute MUST match
                    matches = false;
                    break;
                }
            }

            if (matches && variant.attributes[attrName] === newValue && score > bestScore) {
                bestScore = score;
                bestMatch = variant.productId;
            }
        }

        if (bestMatch && bestMatch !== currentProductId) {
            onVariantChange(bestMatch);
        }
    };

    // Get price range for the group
    const prices = group.variants
        .map(v => getProductById(v.productId)?.price || 0)
        .filter(p => p > 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const hasPriceRange = minPrice !== maxPrice;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-5 space-y-4"
        >
            {/* Variant group label */}
            <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.15em] font-medium"
                    style={{ color: '#1C50EF' }}>
                    {group.variants.length} opciones disponibles
                </span>
                {hasPriceRange && (
                    <span className="text-xs text-charcoal/40">
                        · ${minPrice.toLocaleString()} – ${maxPrice.toLocaleString()}
                    </span>
                )}
            </div>

            {/* Attribute selectors */}
            {attributeOptions.map(attr => (
                <div key={attr.name}>
                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                        {attr.name}: <span className="font-semibold text-forest">{currentAttrs[attr.name] || '–'}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {attr.values.map(opt => {
                            const isSelected = currentAttrs[attr.name] === opt.value;
                            // Check if this option is available given current other selections
                            const isAvailable = group.variants.some(v => {
                                if (v.attributes[attr.name] !== opt.value) return false;
                                // Check compatibility with other selected attributes
                                for (const otherAttr of group.attributeNames) {
                                    if (otherAttr === attr.name) continue;
                                    if (currentAttrs[otherAttr] && v.attributes[otherAttr] !== currentAttrs[otherAttr]) {
                                        // Not a perfect match, but still available as it can shift other attrs
                                    }
                                }
                                return true;
                            });

                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => handleAttributeChange(attr.name, opt.value)}
                                    disabled={!isAvailable}
                                    className={`
                                        px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200
                                        ${isSelected
                                            ? 'border-[#1C50EF] bg-[#1C50EF] text-white shadow-md scale-[1.02]'
                                            : isAvailable
                                                ? 'border-[#1C50EF30] bg-white text-forest hover:border-[#1C50EF] hover:bg-[#1C50EF08]'
                                                : 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    {opt.value}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </motion.div>
    );
}
