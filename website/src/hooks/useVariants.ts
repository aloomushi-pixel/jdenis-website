import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    supabase,
    extractVariantAttributes,
    type CatalogVariantRow,
} from '../lib/supabase';

export interface NormalizedVariant {
    variantId: number;
    id: string;
    productId: string;
    productSlug: string;
    originalSlug: string;
    sku: string | null;
    barcode: string | null;
    title: string;
    attributes: Record<string, string>;
    price: number;
    basePrice: number;
    promoPrice: number | null;
    originalPrice?: number;
    cost: number | null;
    stock: number;
    imageUrl: string | null;
    description: string | null;
    isActive: boolean;
}

export interface VariantGroupDB {
    id: string;
    name: string;
    attribute_names: string[];
    created_at?: string;
}

export interface ProductVariantDB {
    id: string;
    group_id: string;
    product_id: string;
    variant_title?: string;
    price_mxn?: number;
    promo_price_mxn?: number | null;
    stock?: number;
    sku?: string | null;
    image_url?: string | null;
    attributes: Record<string, string>;
    created_at?: string;
}

export interface VariantGroupWithVariants extends VariantGroupDB {
    variants: ProductVariantDB[];
}

function normalizeVariant(row: CatalogVariantRow): NormalizedVariant {
    const base = Number(row.price_mxn ?? 0);
    const promo =
        row.promo_price_mxn != null && Number(row.promo_price_mxn) > 0 && Number(row.promo_price_mxn) < base
            ? Number(row.promo_price_mxn)
            : null;

    return {
        variantId: row.variant_id,
        id: String(row.variant_id),
        productId: String(row.product_id),
        productSlug: row.product_slug,
        originalSlug: row.original_tiendanube_slug,
        sku: row.sku,
        barcode: row.barcode,
        title: row.variant_title,
        attributes: extractVariantAttributes(row),
        price: promo ?? base,
        basePrice: base,
        promoPrice: promo,
        originalPrice: promo != null ? base : undefined,
        cost: row.cost_mxn != null ? Number(row.cost_mxn) : null,
        stock: row.stock ?? 0,
        imageUrl: row.image_url,
        description: row.variant_description,
        isActive: Boolean(row.is_active),
    };
}

const VARIANTS_CACHE_KEY = 'jdennis_variants_cache_v2';
const VARIANTS_CACHE_TTL_MS = 2 * 60 * 1000;

let memoryVariants: NormalizedVariant[] | null = null;
let memoryVariantsAt = 0;
let inFlightVariantsPromise: Promise<NormalizedVariant[]> | null = null;

function getInitialCachedVariants(): NormalizedVariant[] | null {
    if (memoryVariants && memoryVariants.length > 0) return memoryVariants;
    if (typeof window === 'undefined') return null;
    try {
        const raw = sessionStorage.getItem(VARIANTS_CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as { ts: number; data: NormalizedVariant[] };
        if (parsed && Array.isArray(parsed.data) && parsed.data.length > 0) {
            memoryVariants = parsed.data;
            memoryVariantsAt = parsed.ts || 0;
            return parsed.data;
        }
    } catch {
        // ignore
    }
    return null;
}

function updateCachedVariants(rows: NormalizedVariant[]) {
    memoryVariants = rows;
    memoryVariantsAt = Date.now();
    if (typeof window !== 'undefined') {
        try {
            sessionStorage.setItem(VARIANTS_CACHE_KEY, JSON.stringify({ ts: memoryVariantsAt, data: rows }));
        } catch {
            // ignore
        }
    }
}

export function invalidateVariantsCache() {
    memoryVariants = null;
    memoryVariantsAt = 0;
    if (typeof window !== 'undefined') {
        try {
            sessionStorage.removeItem(VARIANTS_CACHE_KEY);
        } catch {
            // ignore
        }
    }
}

export function useVariants() {
    const initial = getInitialCachedVariants();
    const [variants, setVariants] = useState<NormalizedVariant[]>(() => initial || []);
    const [loading, setLoading] = useState<boolean>(() => !initial);
    const [error, setError] = useState<string | null>(null);

    const fetchGroups = useCallback(async (forceRefresh = false) => {
        const cached = getInitialCachedVariants();
        const isFresh = cached && Date.now() - memoryVariantsAt < VARIANTS_CACHE_TTL_MS;

        if (cached && !forceRefresh) {
            setVariants(cached);
            setLoading(false);
            if (isFresh) return;
        } else if (!cached) {
            setLoading(true);
        }

        try {
            if (!inFlightVariantsPromise || forceRefresh) {
                inFlightVariantsPromise = Promise.resolve(
                    supabase
                        .from('product_variants')
                        .select('*')
                        .eq('is_active', true)
                        .order('product_id', { ascending: true })
                        .order('variant_id', { ascending: true })
                )
                    .then(({ data, error: variantsError }) => {
                        if (variantsError) throw variantsError;
                        const mapped = ((data || []) as CatalogVariantRow[]).map(normalizeVariant);
                        updateCachedVariants(mapped);
                        return mapped;
                    })
                    .finally(() => {
                        inFlightVariantsPromise = null;
                    });
            }

            const mapped = await inFlightVariantsPromise;
            setVariants(mapped);
            setError(null);
        } catch (err: unknown) {
            console.error('Error fetching variants:', err);
            setError((err as { message?: string }).message || 'Error al cargar variantes');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    const variantsByProduct = useMemo(() => {
        const map = new Map<string, NormalizedVariant[]>();
        for (const v of variants) {
            const existing = map.get(v.productId) || [];
            existing.push(v);
            map.set(v.productId, existing);
        }
        return map;
    }, [variants]);

    const getVariantsForProduct = useCallback(
        (productId: string | number): NormalizedVariant[] => {
            return variantsByProduct.get(String(productId)) || [];
        },
        [variantsByProduct]
    );

    const findVariantBySlug = useCallback(
        (slug: string): NormalizedVariant | undefined => {
            const clean = (slug || '').toLowerCase().trim();
            if (!clean) return undefined;
            return variants.find(
                v => v.originalSlug?.toLowerCase() === clean || v.productSlug?.toLowerCase() === clean
            );
        },
        [variants]
    );

    // Build groups representation for Admin VariantManager compatibility
    const groups: VariantGroupWithVariants[] = useMemo(() => {
        const list: VariantGroupWithVariants[] = [];
        for (const [prodId, prodVars] of variantsByProduct.entries()) {
            if (prodVars.length <= 1) continue;
            const attrSet = new Set<string>();
            for (const pv of prodVars) {
                Object.keys(pv.attributes).forEach(k => attrSet.add(k));
            }
            list.push({
                id: prodId,
                name: prodVars[0].productSlug,
                attribute_names: attrSet.size > 0 ? Array.from(attrSet) : ['Opción'],
                variants: prodVars.map(pv => ({
                    id: pv.id,
                    group_id: prodId,
                    product_id: pv.id,
                    variant_title: pv.title,
                    price_mxn: pv.basePrice,
                    promo_price_mxn: pv.promoPrice,
                    stock: pv.stock,
                    sku: pv.sku,
                    image_url: pv.imageUrl,
                    attributes: pv.attributes,
                })),
            });
        }
        return list;
    }, [variantsByProduct]);

    const createGroup = async (name: string, attributeNames: string[]) => {
        // In Catalog v2, groups correspond directly to parent products
        const numId = Number(name);
        if (Number.isFinite(numId)) {
            await supabase
                .from('products')
                .update({ has_variants: true, variant_attributes: attributeNames.join(' / ') })
                .eq('product_id', numId);
            invalidateVariantsCache();
            await fetchGroups(true);
        }
        return { id: name, name, attribute_names: attributeNames };
    };

    const deleteGroup = async (id: string) => {
        const numId = Number(id);
        if (!Number.isFinite(numId)) return;
        const { error } = await supabase
            .from('products')
            .update({ has_variants: false })
            .eq('product_id', numId);
        if (error) throw error;
        invalidateVariantsCache();
        await fetchGroups(true);
    };

    const addVariant = async (
        groupId: string,
        _productIdOrTitle: string,
        attributes: Record<string, string>,
        extra?: { price?: number; stock?: number; sku?: string; imageUrl?: string }
    ) => {
        const parentId = Number(groupId);
        if (!Number.isFinite(parentId)) throw new Error('ID de producto padre inválido');

        const { data: parent, error: pErr } = await supabase
            .from('products')
            .select('product_id, slug, base_price_mxn')
            .eq('product_id', parentId)
            .single();
        if (pErr || !parent) throw pErr || new Error('Producto padre no encontrado');

        const entries = Object.entries(attributes);
        const title = entries.map(([, v]) => v).join(' / ') || _productIdOrTitle || 'Variante';

        const { data, error } = await supabase
            .from('product_variants')
            .insert([{
                product_id: parent.product_id,
                product_slug: parent.slug,
                original_tiendanube_slug: parent.slug,
                variant_title: title,
                option_1_name: entries[0]?.[0] || null,
                option_1_value: entries[0]?.[1] || null,
                option_2_name: entries[1]?.[0] || null,
                option_2_value: entries[1]?.[1] || null,
                option_3_name: entries[2]?.[0] || null,
                option_3_value: entries[2]?.[1] || null,
                price_mxn: extra?.price ?? parent.base_price_mxn ?? 0,
                stock: extra?.stock ?? 0,
                sku: extra?.sku || null,
                image_url: extra?.imageUrl || null,
                is_active: true,
            }])
            .select()
            .single();

        if (error) throw error;
        invalidateVariantsCache();
        await fetchGroups(true);
        return data;
    };

    const removeVariant = async (variantId: string) => {
        const numId = Number(variantId);
        if (!Number.isFinite(numId)) return;
        const { error } = await supabase
            .from('product_variants')
            .update({ is_active: false })
            .eq('variant_id', numId);
        if (error) throw error;
        invalidateVariantsCache();
        await fetchGroups(true);
    };

    return {
        variants,
        variantsByProduct,
        getVariantsForProduct,
        findVariantBySlug,
        groups,
        loading,
        error,
        fetchGroups,
        createGroup,
        deleteGroup,
        addVariant,
        removeVariant,
    };
}
