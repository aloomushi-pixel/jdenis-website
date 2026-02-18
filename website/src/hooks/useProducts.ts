import { useState, useEffect, useCallback, useRef } from 'react';
import { products as localProducts, getDisplayProducts } from '../data/products';
import { getAllProductOverrides, updateProductCatalog, type ProductOverride } from '../lib/supabase';
import type { Product } from '../store/cartStore';

/**
 * useProducts — Hybrid merge layer
 * 
 * Base: products.ts (images, descriptions, benefits, includes, etc.)
 * Overrides: Supabase products table (price, originalPrice, isFeatured, stock, name, category)
 * 
 * Edits flow: Editor → Supabase → Shop (on next load)
 */

interface UseProductsReturn {
    /** Merged products (local base + Supabase overrides) */
    products: Product[];
    /** Display products (variants filtered out) */
    displayProducts: Product[];
    /** Loading state for initial Supabase fetch */
    loading: boolean;
    /** Error from Supabase fetch (products still available from local fallback) */
    error: string | null;
    /** Save a single product field to Supabase. Returns true on success. */
    saveProduct: (productId: string, field: string, value: string | number | boolean | undefined) => Promise<boolean>;
    /** Map of productId → save status ('saving' | 'saved' | 'error') */
    saveStatus: Record<string, 'saving' | 'saved' | 'error'>;
    /** Whether Supabase overrides have been loaded */
    synced: boolean;
}

// Map local field names → Supabase column names
const fieldToColumn: Record<string, string> = {
    name: 'name',
    price: 'price',
    originalPrice: 'compare_at_price',
    isFeatured: 'is_featured',
    stock: 'stock',
    category: 'category',
};

function mergeProducts(locals: Product[], overrides: ProductOverride[]): Product[] {
    // Index overrides by slug (id in local = slug in Supabase)
    const overrideMap = new Map<string, ProductOverride>();
    for (const o of overrides) {
        overrideMap.set(o.slug, o);
    }

    return locals.map(local => {
        const override = overrideMap.get(local.id);
        if (!override) return local;

        return {
            ...local,
            name: override.name || local.name,
            price: Number(override.price) || local.price,
            originalPrice: override.compare_at_price ? Number(override.compare_at_price) : local.originalPrice,
            isFeatured: override.is_featured ?? local.isFeatured,
            stock: override.stock ?? local.stock,
            category: override.category || local.category,
        };
    });
}

export function useProducts(): UseProductsReturn {
    const [overrides, setOverrides] = useState<ProductOverride[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<Record<string, 'saving' | 'saved' | 'error'>>({});
    const [synced, setSynced] = useState(false);
    const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

    // Fetch overrides from Supabase on mount
    useEffect(() => {
        let cancelled = false;

        async function fetchOverrides() {
            try {
                const data = await getAllProductOverrides();
                if (!cancelled) {
                    setOverrides(data);
                    setSynced(true);
                }
            } catch (err) {
                if (!cancelled) {
                    console.warn('[useProducts] Supabase fetch failed, using local data:', err);
                    setError(err instanceof Error ? err.message : 'Error loading from Supabase');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchOverrides();
        return () => { cancelled = true; };
    }, []);

    // Merge local + overrides
    const products = mergeProducts(localProducts, overrides);

    // Display products (variant-filtered) — reuse local logic but with merged data
    const displayProducts = (() => {
        const merged = mergeProducts(getDisplayProducts(), overrides);
        return merged;
    })();

    // Save a single field to Supabase
    const saveProduct = useCallback(async (productId: string, field: string, value: string | number | boolean | undefined): Promise<boolean> => {
        const column = fieldToColumn[field];
        if (!column) {
            console.warn(`[useProducts] Unknown field for Supabase sync: ${field}`);
            return false;
        }

        // Clear any existing "saved" timer for this product
        if (saveTimers.current[productId]) {
            clearTimeout(saveTimers.current[productId]);
        }

        setSaveStatus(prev => ({ ...prev, [productId]: 'saving' }));

        try {
            const updates: Record<string, unknown> = { [column]: value ?? null };
            const updated = await updateProductCatalog(productId, updates as Parameters<typeof updateProductCatalog>[1]);

            // Update local overrides cache
            setOverrides(prev => {
                const idx = prev.findIndex(o => o.slug === productId);
                if (idx >= 0) {
                    const newOverrides = [...prev];
                    newOverrides[idx] = updated;
                    return newOverrides;
                }
                return [...prev, updated];
            });

            setSaveStatus(prev => ({ ...prev, [productId]: 'saved' }));

            // Auto-clear "saved" status after 3 seconds
            saveTimers.current[productId] = setTimeout(() => {
                setSaveStatus(prev => {
                    const next = { ...prev };
                    delete next[productId];
                    return next;
                });
            }, 3000);

            return true;
        } catch (err) {
            console.error(`[useProducts] Failed to save ${field} for ${productId}:`, err);
            setSaveStatus(prev => ({ ...prev, [productId]: 'error' }));

            // Auto-clear error after 5 seconds
            saveTimers.current[productId] = setTimeout(() => {
                setSaveStatus(prev => {
                    const next = { ...prev };
                    delete next[productId];
                    return next;
                });
            }, 5000);

            return false;
        }
    }, []);

    return {
        products,
        displayProducts,
        loading,
        error,
        saveProduct,
        saveStatus,
        synced,
    };
}
