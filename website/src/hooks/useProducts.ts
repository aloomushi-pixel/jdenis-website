import { useState, useEffect, useCallback } from 'react';
import {
    supabase,
    normalizeProductRow,
    type CatalogProductRow,
    type Product as SupabaseProduct,
} from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

// Re-export Supabase Product type for consumers
export type { SupabaseProduct };

/**
 * Adapter: maps a normalized Supabase product row to the shape
 * expected by the cart store and all UI components.
 */
export interface DisplayProduct {
    id: string;
    productId?: number;
    name: string;
    brand?: string;
    price: number;
    originalPrice?: number;
    distributorPrice?: number;
    promotion?: string;
    image: string;
    category: string;
    description?: string;
    descriptionHtml?: string;
    stock?: number;
    hasVariants?: boolean;
    variantsCount?: number;
    variantAttributes?: string;
    freeShipping?: boolean;
    tags?: string;
    seoTitle?: string;
    seoDescription?: string;
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

/** Map a normalized Supabase Product → DisplayProduct used by every UI component */
export function toDisplayProduct(p: SupabaseProduct, userRole: string | undefined = undefined): DisplayProduct {
    const normalizedRole = (userRole || '').toUpperCase();
    const isDistributor = normalizedRole === 'DISTRIBUIDOR';

    // In Catalog v2, base_price_mxn is regular retail and promo_price_mxn is public sale price
    let finalPrice = p.price;
    let finalOriginalPrice = p.original_price ?? p.compare_at_price ?? undefined;
    let finalPromotion = p.promotion ?? undefined;

    if (isDistributor && p.distributor_price != null && p.distributor_price > 0) {
        finalPrice = p.distributor_price;
        finalOriginalPrice = p.base_price_mxn || p.price;
        finalPromotion = 'Precio Distribuidor';
    }

    return {
        id: p.id,
        productId: p.product_id,
        name: p.name,
        brand: p.brand || 'J. Denis',
        price: finalPrice,
        originalPrice: finalOriginalPrice,
        distributorPrice: p.distributor_price ?? undefined,
        promotion: finalPromotion,
        image: p.image_url || '/placeholder.webp',
        category: p.category,
        description: p.description ?? undefined,
        descriptionHtml: p.description_html ?? undefined,
        stock: p.stock ?? p.total_stock ?? 0,
        hasVariants: p.has_variants,
        variantsCount: p.variants_count ?? 1,
        variantAttributes: p.variant_attributes ?? undefined,
        freeShipping: p.free_shipping ?? false,
        tags: p.tags ?? undefined,
        seoTitle: p.seo_title ?? undefined,
        seoDescription: p.seo_description ?? undefined,
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

const PRODUCTS_CACHE_KEY = 'jdennis_products_raw_cache_v3';
const PRODUCTS_CACHE_TTL_MS = 60 * 1000;

if (typeof window !== 'undefined') {
    try {
        sessionStorage.removeItem('jdennis_products_raw_cache_v2');
    } catch {
        // ignore
    }
}

let memoryRawProducts: SupabaseProduct[] | null = null;
let memoryFetchedAt = 0;
let inFlightProductsPromise: Promise<SupabaseProduct[]> | null = null;

function getInitialCachedProducts(): SupabaseProduct[] | null {
    if (memoryRawProducts && memoryRawProducts.length > 0) return memoryRawProducts;
    if (typeof window === 'undefined') return null;
    try {
        const raw = sessionStorage.getItem(PRODUCTS_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { ts: number; data: SupabaseProduct[] };
        if (parsed && Array.isArray(parsed.data) && parsed.data.length > 0) {
            memoryRawProducts = parsed.data;
            memoryFetchedAt = parsed.ts || 0;
            return parsed.data;
        }
    } catch {
        // ignore storage errors
    }
    return null;
}

function updateCachedProducts(rows: SupabaseProduct[]) {
    memoryRawProducts = rows;
    memoryFetchedAt = Date.now();
    if (typeof window !== 'undefined') {
        try {
            sessionStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify({ ts: memoryFetchedAt, data: rows }));
        } catch {
            // ignore quota errors
        }
    }
}

export function invalidateProductsCache() {
    memoryRawProducts = null;
    memoryFetchedAt = 0;
    if (typeof window !== 'undefined') {
        try {
            sessionStorage.removeItem(PRODUCTS_CACHE_KEY);
        } catch {
            // ignore
        }
    }
}

/**
 * Pure Supabase hook — fetches all active parent products (Catalog v2)
 * with shared in-memory/sessionStorage cache + admin CRUD helpers.
 */
export function useProducts() {
    const userRole = useAuthStore(state => state.user?.role);

    const initialRaw = getInitialCachedProducts();
    const [products, setProducts] = useState<DisplayProduct[]>(() =>
        initialRaw ? initialRaw.map(p => toDisplayProduct(p, userRole)) : []
    );
    const [loading, setLoading] = useState<boolean>(() => !initialRaw);
    const [error, setError] = useState<string | null>(null);
    const [synced, setSynced] = useState<boolean>(() => Boolean(initialRaw));
    const [saveStatus, setSaveStatus] = useState<Record<string, 'saving' | 'saved' | 'error'>>({});

    const fetchProducts = useCallback(async (forceRefresh = false) => {
        const cached = getInitialCachedProducts();
        const isFresh = cached && Date.now() - memoryFetchedAt < PRODUCTS_CACHE_TTL_MS;

        if (cached && !forceRefresh) {
            setProducts(cached.map(p => toDisplayProduct(p, userRole)));
            setLoading(false);
            setSynced(true);
            if (isFresh) {
                return;
            }
        } else if (!cached) {
            setLoading(true);
        }

        try {
            if (!inFlightProductsPromise || forceRefresh) {
                inFlightProductsPromise = Promise.resolve(
                    supabase
                        .from('products')
                        .select('*')
                        .eq('is_active', true)
                        .order('sort_order', { ascending: true })
                        .order('product_id', { ascending: true })
                )
                    .then(({ data, error: fetchError }) => {
                        if (fetchError) throw fetchError;
                        const rows = ((data || []) as CatalogProductRow[]).map(normalizeProductRow);
                        updateCachedProducts(rows);
                        return rows;
                    })
                    .finally(() => {
                        inFlightProductsPromise = null;
                    });
            }

            const rows = await inFlightProductsPromise;
            setProducts(rows.map(p => toDisplayProduct(p, userRole)));
            setSynced(true);
            setError(null);
        } catch (err: unknown) {
            console.error('useProducts fetch error:', err);
            setError((err as { message?: string }).message || 'Error al cargar productos');
            if (!cached) setSynced(false);
        } finally {
            setLoading(false);
        }
    }, [userRole]);

    useEffect(() => {
        fetchProducts();
        const onCachePurged = () => {
            fetchProducts(true);
        };
        window.addEventListener('jdenis:catalog-cache-purged', onCachePurged);
        return () => window.removeEventListener('jdenis:catalog-cache-purged', onCachePurged);
    }, [fetchProducts]);

    /**
     * Persist a single field change for a product to Supabase (Catalog v2 columns).
     */
    const saveProduct = useCallback(async (productId: string, field: string, value: unknown): Promise<boolean> => {
        const numId = Number(productId);
        if (!Number.isFinite(numId)) return false;

        const fieldMap: Record<string, string> = {
            name: 'name',
            price: 'base_price_mxn',
            originalPrice: 'base_price_mxn',
            distributorPrice: 'distributor_price_mxn',
            promotion: 'promotion_label',
            isFeatured: 'is_featured',
            stock: 'total_stock',
            category: 'category',
            description: 'description',
            image: 'image_url',
            benefits: 'benefits',
            includes: 'includes',
            performance: 'performance',
            specifications: 'specifications',
            gallery: 'gallery_images',
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
            const payload: Record<string, unknown> = { [dbField]: value, updated_at: new Date().toISOString() };
            if (field === 'price') {
                // When setting direct price in inline editor, clear conflicting promo if >= new base
                payload.promo_price_mxn = null;
            }

            const { error: updateError } = await supabase
                .from('products')
                .update(payload)
                .eq('product_id', numId);

            if (updateError) throw updateError;

            invalidateProductsCache();
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
        const numId = Number(productId);
        if (!Number.isFinite(numId)) return false;

        setSaveStatus(prev => ({ ...prev, [productId]: 'saving' }));

        try {
            const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };

            if (updates.name !== undefined) dbUpdates.name = updates.name;
            if (updates.originalPrice != null && updates.price != null && updates.price < updates.originalPrice) {
                dbUpdates.base_price_mxn = updates.originalPrice;
                dbUpdates.promo_price_mxn = updates.price;
            } else if (updates.price !== undefined) {
                dbUpdates.base_price_mxn = updates.price;
                dbUpdates.promo_price_mxn = null;
            }
            if (updates.distributorPrice !== undefined) dbUpdates.distributor_price_mxn = updates.distributorPrice || null;
            if (updates.promotion !== undefined) dbUpdates.promotion_label = updates.promotion || null;
            if (updates.image !== undefined) dbUpdates.image_url = updates.image;
            if (updates.category !== undefined) dbUpdates.category = updates.category;
            if (updates.description !== undefined) {
                dbUpdates.description = updates.description;
                dbUpdates.description_html = `<p>${updates.description}</p>`;
            }
            if (updates.stock !== undefined) dbUpdates.total_stock = updates.stock;
            if (updates.benefits !== undefined) dbUpdates.benefits = updates.benefits;
            if (updates.includes !== undefined) dbUpdates.includes = updates.includes;
            if (updates.performance !== undefined) dbUpdates.performance = updates.performance;
            if (updates.specifications !== undefined) dbUpdates.specifications = updates.specifications;
            if (updates.gallery !== undefined) dbUpdates.gallery_images = updates.gallery;
            if (updates.video !== undefined) dbUpdates.video = updates.video;
            if (updates.relatedCategories !== undefined) dbUpdates.related_categories = updates.relatedCategories;
            if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;
            if (updates.slug !== undefined) dbUpdates.slug = updates.slug;

            const { error: updateError } = await supabase
                .from('products')
                .update(dbUpdates)
                .eq('product_id', numId);

            if (updateError) throw updateError;

            invalidateProductsCache();
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
     * Create a new parent product + default variant in Catalog v2.
     */
    const createProduct = useCallback(async (newProduct: Omit<DisplayProduct, 'id'>): Promise<boolean> => {
        try {
            const baseSlug = (newProduct.slug || newProduct.name)
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            const slug = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;

            const hasSale = newProduct.originalPrice != null && newProduct.price < newProduct.originalPrice;
            const basePrice = hasSale ? newProduct.originalPrice! : newProduct.price;
            const promoPrice = hasSale ? newProduct.price : null;

            const dbInsert = {
                slug,
                name: newProduct.name,
                brand: 'J. Denis',
                category: newProduct.category,
                description: newProduct.description || newProduct.name,
                description_html: `<p>${newProduct.description || newProduct.name}</p>`,
                image_url: newProduct.image || null,
                gallery_images: newProduct.gallery || (newProduct.image ? [newProduct.image] : []),
                has_variants: false,
                variants_count: 1,
                base_price_mxn: basePrice,
                promo_price_mxn: promoPrice,
                distributor_price_mxn: newProduct.distributorPrice || null,
                promotion_label: newProduct.promotion || null,
                total_stock: newProduct.stock ?? 0,
                benefits: newProduct.benefits || [],
                includes: newProduct.includes || [],
                performance: newProduct.performance || null,
                specifications: newProduct.specifications || [],
                video: newProduct.video || null,
                related_categories: newProduct.relatedCategories || [],
                is_featured: newProduct.isFeatured ?? false,
                is_active: true,
            };

            const { data: created, error: insertError } = await supabase
                .from('products')
                .insert([dbInsert])
                .select('product_id, slug, name')
                .single();

            if (insertError) throw insertError;

            if (created) {
                await supabase.from('product_variants').insert([{
                    product_id: created.product_id,
                    product_slug: created.slug,
                    original_tiendanube_slug: created.slug,
                    variant_title: 'Única',
                    price_mxn: basePrice,
                    promo_price_mxn: promoPrice,
                    stock: newProduct.stock ?? 0,
                    image_url: newProduct.image || null,
                    is_active: true,
                }]);
            }

            invalidateProductsCache();
            await fetchProducts(true);
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
        const numId = Number(productId);
        if (!Number.isFinite(numId)) return false;
        try {
            setSaveStatus(prev => ({ ...prev, [productId]: 'saving' }));
            const { error: deleteError } = await supabase
                .from('products')
                .update({ is_active: false })
                .eq('product_id', numId);

            if (deleteError) throw deleteError;

            invalidateProductsCache();
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
