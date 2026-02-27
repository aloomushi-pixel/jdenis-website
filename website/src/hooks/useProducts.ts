import { useState, useEffect, useCallback } from 'react';
import { supabase, type Product as SupabaseProduct } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

// Re-export Supabase Product type for consumers
export type { SupabaseProduct };

// Generate random ID fallback if crypto is unavailable or incomplete
function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

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
export function toDisplayProduct(p: SupabaseProduct, userRole: string | undefined = undefined): DisplayProduct {
    const normalizedRole = (userRole || '').toUpperCase();
    const isDistributor = normalizedRole === 'DISTRIBUIDOR';
    const isClient = normalizedRole === 'CLIENTE';
    const isAdmin = normalizedRole === 'ADMIN';
    const hasAccessToPromos = isClient || isAdmin || isDistributor;

    const publicPrice = p.original_price ?? p.compare_at_price ?? p.price;

    let finalPrice = p.price;
    let finalOriginalPrice = p.original_price ?? p.compare_at_price ?? undefined;
    let finalPromotion = p.promotion ?? undefined;

    if (isAdmin) {
        // Admins see raw data
        finalPrice = p.price;
        finalOriginalPrice = p.original_price ?? p.compare_at_price ?? undefined;
        finalPromotion = p.promotion ?? undefined;
    } else if (isDistributor && p.distributor_price != null && p.distributor_price > 0) {
        // Distributors get distributor price as active price, strike out normal retail
        finalPrice = p.distributor_price;
        finalOriginalPrice = p.price;
        finalPromotion = 'Precio Distribuidor';
    } else if (hasAccessToPromos) {
        // Regular clients see configured promos
        finalPrice = p.price;
        finalOriginalPrice = p.original_price ?? p.compare_at_price ?? undefined;
        finalPromotion = p.promotion ?? undefined;
    } else {
        // Public sees disabled promos
        finalPrice = publicPrice;
        finalOriginalPrice = undefined;
        finalPromotion = undefined;
    }

    return {
        id: p.id,
        name: p.name,
        price: finalPrice,
        originalPrice: finalOriginalPrice,
        distributorPrice: p.distributor_price ?? undefined,
        promotion: finalPromotion,
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
    const userRole = useAuthStore(state => state.user?.role);

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

            setProducts((data || []).map(p => toDisplayProduct(p, userRole)));
            setSynced(true);
            setError(null);
        } catch (err: unknown) {
            console.error('useProducts fetch error:', err);
            setError((err as any).message || 'Error al cargar productos');
            setSynced(false);
        } finally {
            setLoading(false);
        }
    }, [userRole]);

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
        } catch (err: unknown) {
            console.error(`useProducts.saveProduct error (${field}):`, err);
            setSaveStatus(prev => ({ ...prev, [productId]: 'error' }));
            return false;
        }
    }, []);

    /**
     * Update multiple fields at once (Submit form edit)
     */
    const updateProduct = useCallback(async (productId: string, updates: Partial<DisplayProduct>): Promise<boolean> => {
        setSaveStatus(prev => ({ ...prev, [productId]: 'saving' }));

        try {
            const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };

            // Map keys
            if (updates.name !== undefined) dbUpdates.name = updates.name;
            if (updates.price !== undefined) dbUpdates.price = updates.price;
            if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
            if (updates.distributorPrice !== undefined) dbUpdates.distributor_price = updates.distributorPrice;
            if (updates.promotion !== undefined) dbUpdates.promotion = updates.promotion;
            if (updates.image !== undefined) dbUpdates.image_url = updates.image;
            if (updates.category !== undefined) dbUpdates.category = updates.category;
            if (updates.description !== undefined) dbUpdates.description = updates.description;
            if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
            if (updates.benefits !== undefined) dbUpdates.benefits = updates.benefits;
            if (updates.includes !== undefined) dbUpdates.includes = updates.includes;
            if (updates.performance !== undefined) dbUpdates.performance = updates.performance;
            if (updates.specifications !== undefined) dbUpdates.specifications = updates.specifications;
            if (updates.gallery !== undefined) dbUpdates.gallery = updates.gallery;
            if (updates.video !== undefined) dbUpdates.video = updates.video;
            if (updates.relatedCategories !== undefined) dbUpdates.related_categories = updates.relatedCategories;
            if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;
            if (updates.slug !== undefined) dbUpdates.slug = updates.slug;

            const { error: updateError } = await supabase
                .from('products')
                .update(dbUpdates)
                .eq('id', productId);

            if (updateError) throw updateError;

            // Update local state
            setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
            setSaveStatus(prev => ({ ...prev, [productId]: 'saved' }));
            setTimeout(() => setSaveStatus(prev => {
                const next = { ...prev };
                delete next[productId];
                return next;
            }), 3000);

            return true;
        } catch (err) {
            console.error('useProducts.updateProduct error:', err);
            setSaveStatus(prev => ({ ...prev, [productId]: 'error' }));
            return false;
        }
    }, []);

    /**
     * Create a new product.
     */
    const createProduct = useCallback(async (newProduct: Omit<DisplayProduct, 'id'>): Promise<boolean> => {
        try {
            const id = generateId();
            const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            const dbInsert = {
                id,
                name: newProduct.name,
                price: newProduct.price,
                original_price: newProduct.originalPrice,
                distributor_price: newProduct.distributorPrice,
                promotion: newProduct.promotion,
                image_url: newProduct.image,
                category: newProduct.category,
                description: newProduct.description,
                stock: newProduct.stock,
                benefits: newProduct.benefits,
                includes: newProduct.includes,
                performance: newProduct.performance,
                specifications: newProduct.specifications,
                gallery: newProduct.gallery,
                video: newProduct.video,
                related_categories: newProduct.relatedCategories,
                is_featured: newProduct.isFeatured ?? false,
                slug,
                is_active: true
            };

            const { error: insertError } = await supabase
                .from('products')
                .insert([dbInsert]);

            if (insertError) throw insertError;

            // Refetch or add directly
            await fetchProducts();
            return true;
        } catch (err) {
            console.error('useProducts.createProduct error:', err);
            return false;
        }
    }, [fetchProducts]);

    /**
     * Soft delete a product
     */
    const deleteProduct = useCallback(async (productId: string): Promise<boolean> => {
        try {
            setSaveStatus(prev => ({ ...prev, [productId]: 'saving' }));
            const { error: deleteError } = await supabase
                .from('products')
                .update({ is_active: false })
                .eq('id', productId);

            if (deleteError) throw deleteError;

            // Update local state by removing it
            setProducts(prev => prev.filter(p => p.id !== productId));
            return true;
        } catch (err) {
            console.error('useProducts.deleteProduct error:', err);
            setSaveStatus(prev => ({ ...prev, [productId]: 'error' }));
            return false;
        }
    }, []);

    return {
        products,
        loading,
        error,
        saveProduct,
        updateProduct,
        createProduct,
        deleteProduct,
        saveStatus,
        synced,
        refetch: fetchProducts,
    };
}
