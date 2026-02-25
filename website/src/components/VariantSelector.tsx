import { motion } from 'framer-motion';
import { useMemo } from 'react';
import type { DisplayProduct } from '../hooks/useProducts';

// Local VariantGroup type (previously from data/products)
export interface VariantGroup {
    parentId: string;
    parentName: string;
    attributeNames: string[];
    variants: { productId: string; attributes: Record<string, string> }[];
}

interface VariantSelectorProps {
    group: VariantGroup;
    currentProductId: string;
    onVariantChange: (productId: string) => void;
    allProducts?: DisplayProduct[];
}

export default function VariantSelector({ group, currentProductId, onVariantChange, allProducts = [] }: VariantSelectorProps) {
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
        .map(v => {
            const found = allProducts.find(p => p.id === v.productId);
            return found?.price || 0;
        })
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
                <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold py-1 px-2 rounded-md bg-gold/10 text-forest"
                    style={{ color: 'var(--color-forest, #17204D)' }}>
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
                                    className={`px-4 mt-2 sm:mt-0 py-2.5 sm:py-2 text-sm font-medium rounded-lg transition-all duration-200 border text-center ${isSelected
                                        ? 'border-gold bg-gold text-forest shadow-md scale-[1.02]'
                                        : !isAvailable
                                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed hidden'
                                            : 'border-gold/30 bg-white text-forest hover:border-gold hover:bg-gold/5'
                                        }`}
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
