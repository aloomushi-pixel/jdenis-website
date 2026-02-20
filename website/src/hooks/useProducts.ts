import { useState, useEffect, useCallback } from 'react';
import { supabase, type Product as SupabaseProduct } from '../lib/supabase';

// Re-export Supabase Product type for consumers
export type { SupabaseProduct };

/**
 * Lightweight adapter: maps a Supabase product row to the shape
 * expected by the cart store and all UI components.
 */
export interface DisplayProduct {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    distributorPrice?: number;
    promotion?: string;
    image: string;
    category: string;
    description?: string;
    stock?: number;
    benefits?: string[];
    includes?: string[];
    performance?: string;
    specifications?: string[];
    gallery?: string[];
    video?: string;
    relatedCategories?: string[];
    isFeatured?: boolean;
    slug?: string;
}

/** Map a Supabase row → DisplayProduct used by every UI component */
export function toDisplayProduct(p: SupabaseProduct): DisplayProduct {
    return {
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.original_price ?? p.compare_at_price ?? undefined,
        distributorPrice: p.distributor_price ?? undefined,
        promotion: p.promotion ?? undefined,
        image: p.image_url ?? '/placeholder.webp',
        category: p.category,
        description: p.description ?? undefined,
        stock: p.stock ?? undefined,
        benefits: p.benefits ?? undefined,
        includes: p.includes ?? undefined,
        performance: p.performance ?? undefined,
        specifications: p.specifications ?? undefined,
        gallery: p.gallery ?? undefined,
        video: p.video ?? undefined,
        relatedCategories: p.related_categories ?? undefined,
        isFeatured: p.is_featured ?? false,
        slug: p.slug,
    };
}

/**
 * Pure Supabase hook — fetches all active products and provides
 * save helpers for the admin editor.
 */
export function useProducts() {
    const [products, setProducts] = useState<DisplayProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [synced, setSynced] = useState(false);
    const [saveStatus, setSaveStatus] = useState<Record<string, 'saving' | 'saved' | 'error'>>({});

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error: fetchError } = await supabase
                .from('products')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (fetchError) throw fetchError;

            setProducts((data || []).map(toDisplayProduct));
            setSynced(true);
            setError(null);
        } catch (err: any) {
            console.error('useProducts fetch error:', err);
            setError(err.message || 'Error al cargar productos');
            setSynced(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    /**
     * Persist a single field change for a product to Supabase.
     * Maps camelCase field names to snake_case DB columns.
     */
    const saveProduct = useCallback(async (productId: string, field: string, value: unknown): Promise<boolean> => {
        // Map UI field names → Supabase column names
        const fieldMap: Record<string, string> = {
            name: 'name',
            price: 'price',
            originalPrice: 'original_price',
            distributorPrice: 'distributor_price',
            promotion: 'promotion',
            isFeatured: 'is_featured',
            stock: 'stock',
            category: 'category',
            description: 'description',
            image: 'image_url',
            benefits: 'benefits',
            includes: 'includes',
            performance: 'performance',
            specifications: 'specifications',
            gallery: 'gallery',
            video: 'video',
            relatedCategories: 'related_categories',
        };

        const dbField = fieldMap[field];
        if (!dbField) {
            console.warn(`useProducts.saveProduct: unknown field "${field}"`);
            return false;
        }

        setSaveStatus(prev => ({ ...prev, [productId]: 'saving' }));

        try {
            const { error: updateError } = await supabase
                .from('products')
                .update({ [dbField]: value, updated_at: new Date().toISOString() })
                .eq('id', productId);

            if (updateError) throw updateError;

            // Update local state
            setProducts(prev => prev.map(p =>
                p.id === productId ? { ...p, [field]: value } : p
            ));

            setSaveStatus(prev => ({ ...prev, [productId]: 'saved' }));
            setTimeout(() => setSaveStatus(prev => {
                const next = { ...prev };
                delete next[productId];
                return next;
            }), 3000);

            return true;
        } catch (err: any) {
            console.error(`useProducts.saveProduct error (${field}):`, err);
            setSaveStatus(prev => ({ ...prev, [productId]: 'error' }));
            return false;
        }
    }, []);

    return {
        products,
        loading,
        error,
        saveProduct,
        saveStatus,
        synced,
        refetch: fetchProducts,
    };
}
