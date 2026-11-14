// Supabase Client for J.Denis Website
// Enhanced with E-commerce Manager Skill
import { createClient } from '@supabase/supabase-js';

// Proyecto J DENIS (zdciwzeokkrwcxvsgusc) — proyecto activo de producción (PRO)
export const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || 'https://zdciwzeokkrwcxvsgusc.supabase.co';
export const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkY2l3emVva2tyd2N4dnNndXNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NTM3NTksImV4cCI6MjA4ODIyOTc1OX0.qbXG0M2Zsjz-rOXY0CgAV2RfLledS67nqBw_dnvzkbg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Raw row from public.products (Catalog v2)
export interface CatalogProductRow {
    product_id: number;
    slug: string;
    name: string;
    brand: string;
    category: string;
    raw_categories: string | null;
    description: string;
    description_html: string;
    image_url: string | null;
    gallery_images: string[] | null;
    has_variants: boolean;
    variant_attributes: string | null;
    variants_count: number;
    base_price_mxn: number;
    promo_price_mxn: number | null;
    distributor_price_mxn: number | null;
    promotion_label: string | null;
    total_stock: number;
    is_active: boolean;
    is_featured: boolean;
    sort_order: number;
    free_shipping: boolean;
    tags: string | null;
    seo_title: string | null;
    seo_description: string | null;
    benefits: string[] | null;
    includes: string[] | null;
    performance: string | null;
    specifications: string[] | null;
    video: string | null;
    related_categories: string[] | null;
    jdenis_store_status: string | null;
    source_url: string | null;
    audit_notes: string | null;
    created_at: string | null;
    updated_at: string | null;
}

// Raw row from public.product_variants (Catalog v2)
export interface CatalogVariantRow {
    variant_id: number;
    product_id: number;
    product_slug: string;
    original_tiendanube_slug: string;
    sku: string | null;
    barcode: string | null;
    variant_title: string;
    option_1_name: string | null;
    option_1_value: string | null;
    option_2_name: string | null;
    option_2_value: string | null;
    option_3_name: string | null;
    option_3_value: string | null;
    price_mxn: number;
    promo_price_mxn: number | null;
    cost_mxn: number | null;
    stock: number;
    weight_kg: number;
    height_cm: number;
    width_cm: number;
    depth_cm: number;
    image_url: string | null;
    variant_description: string | null;
    is_active: boolean;
    source_url: string | null;
    created_at: string | null;
    updated_at: string | null;
}

// Normalized Product entity used across storefront & admin
export interface Product {
    id: string;
    product_id: number;
    slug: string;
    name: string;
    brand?: string;
    description: string | null;
    description_html?: string | null;
    price: number;
    base_price_mxn: number;
    promo_price_mxn: number | null;
    compare_at_price: number | null;
    image_url: string | null;
    category: string;
    raw_categories?: string | null;
    sku: string | null;
    stock: number | null;
    total_stock: number;
    has_variants: boolean;
    variant_attributes: string | null;
    variants_count: number;
    free_shipping?: boolean;
    tags?: string | null;
    seo_title?: string | null;
    seo_description?: string | null;
    is_active: boolean | null;
    is_featured: boolean | null;
    sort_order: number | null;
    created_at: string | null;
    updated_at: string | null;
    // Rich-content columns
    benefits: string[] | null;
    includes: string[] | null;
    performance: string | null;
    specifications: string[] | null;
    gallery: string[] | null;
    video: string | null;
    related_categories: string[] | null;
    original_price: number | null;
    distributor_price: number | null;
    promotion: string | null;
}

export function normalizeProductRow(row: CatalogProductRow): Product {
    const base = Number(row.base_price_mxn ?? 0);
    const promo =
        row.promo_price_mxn != null && Number(row.promo_price_mxn) > 0 && Number(row.promo_price_mxn) < base
            ? Number(row.promo_price_mxn)
            : null;
    const effectivePrice = promo ?? base;
    const originalPrice = promo != null ? base : null;
    const distPrice =
        row.distributor_price_mxn != null && Number(row.distributor_price_mxn) > 0
            ? Number(row.distributor_price_mxn)
            : null;

    return {
        id: String(row.product_id),
        product_id: row.product_id,
        slug: row.slug,
        name: row.name,
        brand: row.brand,
        description: row.description,
        description_html: row.description_html,
        price: effectivePrice,
        base_price_mxn: base,
        promo_price_mxn: promo,
        compare_at_price: originalPrice,
        original_price: originalPrice,
        distributor_price: distPrice,
        promotion: row.promotion_label,
        image_url: row.image_url,
        category: row.category,
        raw_categories: row.raw_categories,
        sku: `JD-${String(row.product_id).padStart(3, '0')}`,
        stock: row.total_stock ?? 0,
        total_stock: row.total_stock ?? 0,
        has_variants: Boolean(row.has_variants),
        variant_attributes: row.variant_attributes,
        variants_count: row.variants_count ?? 1,
        free_shipping: Boolean(row.free_shipping),
        tags: row.tags,
        seo_title: row.seo_title,
        seo_description: row.seo_description,
        is_active: row.is_active,
        is_featured: row.is_featured,
        sort_order: row.sort_order,
        created_at: row.created_at,
        updated_at: row.updated_at,
        benefits: safeParseArray(row.benefits),
        includes: safeParseArray(row.includes),
        performance: row.performance,
        specifications: safeParseArray(row.specifications),
        gallery: safeParseArray(row.gallery_images),
        video: row.video,
        related_categories: safeParseArray(row.related_categories),
    };
}

export function extractVariantAttributes(v: CatalogVariantRow): Record<string, string> {
    const attrs: Record<string, string> = {};
    if (v.option_1_name && v.option_1_value) attrs[v.option_1_name] = v.option_1_value;
    if (v.option_2_name && v.option_2_value) attrs[v.option_2_name] = v.option_2_value;
    if (v.option_3_name && v.option_3_value) attrs[v.option_3_name] = v.option_3_value;
    if (Object.keys(attrs).length === 0 && v.variant_title) {
        attrs['Opción'] = v.variant_title;
    }
    return attrs;
}

export interface ProductCategory {
    id: string;
    slug: string;
    name: string;
    icon: string | null;
    description: string | null;
    sort_order: number | null;
    is_active: boolean | null;
    created_at: string | null;
}

export interface OrderB2B {
    id: string;
    order_number: string;
    user_id: string;
    status: string;
    subtotal: number;
    tax: number | null;
    shipping: number | null;
    total: number;
    shipping_address: Record<string, unknown> | null;
    billing_address: Record<string, unknown> | null;
    payment_method: string | null;
    payment_reference: string | null;
    notes: string | null;
    tracking_number: string | null;
    shipped_at: string | null;
    queued_for_date: string | null;
    packed_items: Record<string, boolean> | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total: number;
}

export interface Cart {
    id: string;
    user_id: string | null;
    session_id: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface CartItem {
    id: string;
    cart_id: string;
    product_id: string;
    quantity: number;
    added_at: string | null;
}

// =============================================
// PRODUCT FUNCTIONS
// =============================================

export async function getProducts(category?: string): Promise<Product[]> {
    let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('product_id', { ascending: true });

    if (category && category !== 'all') {
        query = query.ilike('category', `%${category}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return ((data || []) as CatalogProductRow[]).map(normalizeProductRow);
}

export async function getProductBySlug(slug: string): Promise<Product> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) throw error;
    return normalizeProductRow(data as CatalogProductRow);
}

export async function getProductById(id: string | number): Promise<Product> {
    const numId = Number(id);
    const col = Number.isFinite(numId) && String(numId) === String(id).trim() ? 'product_id' : 'slug';
    const val = col === 'product_id' ? numId : String(id);
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq(col, val)
        .single();

    if (error) throw error;
    return normalizeProductRow(data as CatalogProductRow);
}

export async function getFeaturedProducts(limit: number = 12): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(limit);

    if (error) throw error;
    const featured = ((data || []) as CatalogProductRow[]).map(normalizeProductRow);
    if (featured.length >= limit) return featured;

    const existingIds = new Set(featured.map(p => p.product_id));
    const { data: fallbackData } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .gt('total_stock', 0)
        .not('image_url', 'is', null)
        .order('sort_order', { ascending: true })
        .order('product_id', { ascending: true })
        .limit(limit * 2);

    const extras = ((fallbackData || []) as CatalogProductRow[])
        .filter(r => !existingIds.has(r.product_id))
        .map(normalizeProductRow)
        .slice(0, limit - featured.length);

    return [...featured, ...extras];
}

/**
 * Returns active parent products for the shop grid (already normalized 1 row = 1 parent product).
 */
export async function getDisplayProducts(category?: string): Promise<Product[]> {
    return getProducts(category);
}

/**
 * Returns all active variants for a given parent product_id.
 */
export async function getCatalogVariantsForProduct(productId: number | string): Promise<CatalogVariantRow[]> {
    const numId = Number(productId);
    if (!Number.isFinite(numId)) return [];
    const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', numId)
        .eq('is_active', true)
        .order('variant_id', { ascending: true });
    if (error) throw error;
    return (data || []) as CatalogVariantRow[];
}

/**
 * Returns the variant group structure for a parent product.
 */
export async function getVariantGroupForProduct(productId: string): Promise<{
    group: { id: string; name: string; attribute_names: string[] };
    variants: { product_id: string; attributes: Record<string, string> }[];
} | null> {
    const numId = Number(productId);
    if (!Number.isFinite(numId)) return null;

    const { data: parent, error: pError } = await supabase
        .from('products')
        .select('product_id, name, has_variants, variant_attributes')
        .eq('product_id', numId)
        .maybeSingle();

    if (pError) throw pError;
    if (!parent) return null;

    const variants = await getCatalogVariantsForProduct(numId);
    if (variants.length <= 1 && !parent.has_variants) return null;

    const attrSet = new Set<string>();
    for (const v of variants) {
        if (v.option_1_name) attrSet.add(v.option_1_name);
        if (v.option_2_name) attrSet.add(v.option_2_name);
        if (v.option_3_name) attrSet.add(v.option_3_name);
    }
    const attributeNames = attrSet.size > 0
        ? Array.from(attrSet)
        : (parent.variant_attributes ? parent.variant_attributes.split('/').map((s: string) => s.trim()).filter(Boolean) : ['Opción']);

    return {
        group: { id: String(parent.product_id), name: parent.name, attribute_names: attributeNames },
        variants: variants.map(v => ({
            product_id: String(v.variant_id),
            attributes: extractVariantAttributes(v),
        })),
    };
}

/**
 * Returns related products by matching any of the given categories.
 */
export async function getRelatedProducts(currentProductId: string, categories: string[], limit: number = 4): Promise<Product[]> {
    if (!categories || categories.length === 0) return [];

    let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(limit);

    const numId = Number(currentProductId);
    if (Number.isFinite(numId)) {
        query = query.neq('product_id', numId);
    }

    if (categories.length > 0) {
        query = query.ilike('category', `%${categories[0]}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return ((data || []) as CatalogProductRow[]).map(normalizeProductRow);
}

/**
 * Returns all variant groups built from parent products + product_variants.
 */
export async function getAllVariantGroups(): Promise<{
    id: string;
    name: string;
    attribute_names: string[];
    variants: { product_id: string; attributes: Record<string, string> }[];
}[]> {
    const { data: parents, error: pError } = await supabase
        .from('products')
        .select('product_id, name, has_variants, variant_attributes')
        .eq('has_variants', true)
        .order('product_id', { ascending: true });
    if (pError) throw pError;

    const { data: variants, error: vError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('is_active', true)
        .order('variant_id', { ascending: true });
    if (vError) throw vError;

    const typedVars = (variants || []) as CatalogVariantRow[];
    return (parents || []).map((g: any) => {
        const gVars = typedVars.filter(v => v.product_id === g.product_id);
        const attrSet = new Set<string>();
        for (const v of gVars) {
            if (v.option_1_name) attrSet.add(v.option_1_name);
            if (v.option_2_name) attrSet.add(v.option_2_name);
            if (v.option_3_name) attrSet.add(v.option_3_name);
        }
        return {
            id: String(g.product_id),
            name: g.name,
            attribute_names: attrSet.size > 0 ? Array.from(attrSet) : ['Opción'],
            variants: gVars.map(v => ({
                product_id: String(v.variant_id),
                attributes: extractVariantAttributes(v),
            })),
        };
    });
}

/**
 * Returns the count of variants for a product, or 0 if standalone.
 */
export async function getVariantCountForProduct(productId: string): Promise<number> {
    const variants = await getCatalogVariantsForProduct(productId);
    return variants.length > 1 ? variants.length : 0;
}

/**
 * Returns unique categories from active products.
 */
export async function getUniqueCategories(): Promise<string[]> {
    const { data, error } = await supabase
        .from('products')
        .select('category')
        .eq('is_active', true);

    if (error) throw error;
    const cats = new Set((data || []).map((p: any) => p.category));
    return Array.from(cats).sort();
}

// =============================================
// CATEGORY FUNCTIONS
// =============================================

export async function getCategories() {
    const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (error) throw error;
    return data;
}

export async function getCategoryBySlug(slug: string) {
    const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) throw error;
    return data;
}

// =============================================
// INVENTORY FUNCTIONS (E-commerce Manager Skill)
// =============================================

export async function getLowStockProducts(threshold: number = 10) {
    const { data, error } = await supabase
        .from('products')
        .select('product_id, name, slug, total_stock')
        .lt('total_stock', threshold)
        .eq('is_active', true)
        .order('total_stock', { ascending: true });

    if (error) throw error;
    return (data || []).map((r: any) => ({
        id: String(r.product_id),
        name: r.name,
        slug: r.slug,
        stock: r.total_stock,
        sku: `JD-${String(r.product_id).padStart(3, '0')}`,
    }));
}

export async function updateProductStock(productId: string | number, newStock: number) {
    const numId = Number(productId);
    const { data, error } = await supabase
        .from('products')
        .update({ total_stock: newStock, updated_at: new Date().toISOString() })
        .eq('product_id', numId)
        .select()
        .single();

    if (error) throw error;
    return normalizeProductRow(data as CatalogProductRow);
}

export async function decrementStock(productId: string | number, quantity: number) {
    const strId = String(productId);
    // Support variant compound IDs like "12-v45" as well as parent product IDs
    if (strId.includes('-v')) {
        const [pIdStr, vIdStr] = strId.split('-v');
        const vId = Number(vIdStr);
        const pId = Number(pIdStr);
        if (Number.isFinite(vId)) {
            const { data: vRow } = await supabase.from('product_variants').select('stock').eq('variant_id', vId).maybeSingle();
            if (vRow) {
                await supabase
                    .from('product_variants')
                    .update({ stock: Math.max(0, (vRow.stock || 0) - quantity), updated_at: new Date().toISOString() })
                    .eq('variant_id', vId);
            }
        }
        if (Number.isFinite(pId)) {
            const { data: pRow } = await supabase.from('products').select('total_stock').eq('product_id', pId).maybeSingle();
            if (pRow) {
                const { data } = await supabase
                    .from('products')
                    .update({ total_stock: Math.max(0, (pRow.total_stock || 0) - quantity), updated_at: new Date().toISOString() })
                    .eq('product_id', pId)
                    .select()
                    .single();
                return data ? normalizeProductRow(data as CatalogProductRow) : null;
            }
        }
    }

    const numId = Number(productId);
    const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('total_stock')
        .eq('product_id', numId)
        .single();

    if (fetchError) throw fetchError;

    const currentStock = product?.total_stock || 0;
    const newStock = Math.max(0, currentStock - quantity);

    const { data, error } = await supabase
        .from('products')
        .update({ total_stock: newStock, updated_at: new Date().toISOString() })
        .eq('product_id', numId)
        .select()
        .single();

    if (error) throw error;
    return normalizeProductRow(data as CatalogProductRow);
}

export async function getInventoryValue() {
    const { data, error } = await supabase
        .from('products')
        .select('base_price_mxn, promo_price_mxn, total_stock')
        .eq('is_active', true);

    if (error) throw error;

    const totalValue = data?.reduce((sum, p: any) => {
        const price = p.promo_price_mxn != null && p.promo_price_mxn > 0 && p.promo_price_mxn < p.base_price_mxn
            ? Number(p.promo_price_mxn)
            : Number(p.base_price_mxn || 0);
        return sum + (price * (p.total_stock || 0));
    }, 0) || 0;

    return { totalValue, productCount: data?.length || 0 };
}

// =============================================
// ORDER FUNCTIONS (E-commerce Manager Skill)
// =============================================

export async function getOrders(status?: string) {
    let query = supabase
        .from('website_orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function getPendingOrders() {
    return getOrders('pending');
}

export async function getOrderById(orderId: string) {
    const { data, error } = await supabase
        .from('website_orders')
        .select('*')
        .eq('id', orderId)
        .single();

    if (error) throw error;
    return data;
}

export async function getOrderItems(orderId: string) {
    const { data, error } = await supabase
        .from('order_items')
        .select(`
            *,
            products:product_id (
                id,
                name,
                slug,
                image_url
            )
        `)
        .eq('order_id', orderId);

    if (error) throw error;
    return data;
}

export async function updateOrderStatus(orderId: string, status: string) {
    const { data, error } = await supabase
        .from('website_orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function createOrder(orderData: Omit<OrderB2B, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
        .from('website_orders')
        .insert(orderData)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// =============================================
// ANALYTICS FUNCTIONS (E-commerce Manager Skill)
// =============================================

export interface SalesMetrics {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
}

export async function getSalesMetrics(): Promise<SalesMetrics> {
    const { data, error } = await supabase
        .from('website_orders')
        .select('total');

    if (error) throw error;

    const totalOrders = data?.length || 0;
    const totalRevenue = data?.reduce((sum, order) => sum + order.total, 0) || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return { totalOrders, totalRevenue, averageOrderValue };
}

export async function getTopSellingProducts(limit: number = 5) {
    // Get order items with quantities
    const { data, error } = await supabase
        .from('order_items')
        .select(`
            product_id,
            product_name,
            quantity,
            total
        `);

    if (error) throw error;

    // Aggregate by product
    const productSales = data?.reduce((acc, item) => {
        const key = item.product_id;
        if (!acc[key]) {
            acc[key] = {
                product_id: item.product_id,
                product_name: item.product_name,
                units_sold: 0,
                revenue: 0
            };
        }
        acc[key].units_sold += item.quantity;
        acc[key].revenue += item.total;
        return acc;
    }, {} as Record<string, { product_id: string; product_name: string; units_sold: number; revenue: number }>);

    // Sort and return top N
    return Object.values(productSales || {})
        .sort((a, b) => b.units_sold - a.units_sold)
        .slice(0, limit);
}

// =============================================
// CART FUNCTIONS
// =============================================

export async function getOrCreateCart(userId?: string, sessionId?: string) {
    // Try to find existing cart
    let query = supabase.from('carts').select('*');

    if (userId) {
        query = query.eq('user_id', userId);
    } else if (sessionId) {
        query = query.eq('session_id', sessionId);
    } else {
        throw new Error('Either userId or sessionId is required');
    }

    const { data: existingCart, error: fetchError } = await query.maybeSingle();

    if (fetchError) throw fetchError;
    if (existingCart) return existingCart;

    // Create new cart
    const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: userId, session_id: sessionId })
        .select()
        .single();

    if (createError) throw createError;
    return newCart;
}

export async function getCartItems(cartId: string) {
    const { data, error } = await supabase
        .from('cart_items')
        .select(`
            *,
            products:product_id (
                id,
                name,
                slug,
                price,
                image_url,
                stock
            )
        `)
        .eq('cart_id', cartId);

    if (error) throw error;
    return data;
}

export async function addToCart(cartId: string, productId: string, quantity: number = 1) {
    // Check if item already exists in cart
    const { data: existing, error: checkError } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cartId)
        .eq('product_id', productId)
        .maybeSingle();

    if (checkError) throw checkError;

    if (existing) {
        // Update quantity
        const { data, error } = await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.id)
            .select()
            .single();

        if (error) throw error;
        return data;
    } else {
        // Insert new item
        const { data, error } = await supabase
            .from('cart_items')
            .insert({ cart_id: cartId, product_id: productId, quantity })
            .select()
            .single();

        if (error) throw error;
        return data;
    }
}

export async function updateCartItemQuantity(cartItemId: string, quantity: number) {
    if (quantity <= 0) {
        return removeFromCart(cartItemId);
    }

    const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function removeFromCart(cartItemId: string) {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

    if (error) throw error;
    return true;
}

export async function clearCart(cartId: string) {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId);

    if (error) throw error;
    return true;
}

// =============================================
// WEBSITE ORDERS FUNCTIONS
// =============================================

export interface WebsiteOrderItem {
    product_id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

export interface WebsiteOrder {
    id: string;
    user_id: string | null;
    user_email: string | null;
    total: number;
    subtotal?: number | null;
    shipping_cost?: number | null;
    discount?: number | null;
    coupon_code?: string | null;
    items: string | WebsiteOrderItem[];
    created_at: string;
    updated_at?: string | null;
    status: string;
    order_number?: string | null;
    merchant_order_id?: string | null;
    payment_id?: string | null;
    payment_status?: string | null;
    payment_method?: string | null;
    tracking_number?: string | null;
    shipped_at?: string | null;
    queued_for_date?: string | null;
    packed_items?: Record<string, boolean> | null;
    buyer_info?: {
        email?: string;
        phone?: string;
        fullName?: string;
        userId?: string;
    } | null;
    shipping_address?: {
        address?: string;
        references?: string;
        city?: string;
        state?: string;
        zip?: string;
    } | null;
    notes?: string;
}

export async function createWebsiteOrder(userId: string, userEmail: string, items: WebsiteOrderItem[], total: number) {
    const { data, error } = await supabase
        .from('website_orders')
        .insert({
            user_id: userId,
            user_email: userEmail,
            items: JSON.stringify(items),
            total,
            status: 'completed',
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getWebsiteOrders(status?: string): Promise<WebsiteOrder[]> {
    let query = supabase
        .from('website_orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (status) {
        query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as WebsiteOrder[];
}

export async function updateWebsiteOrderStatus(orderId: string, status: string): Promise<WebsiteOrder> {
    const { data, error } = await supabase
        .from('website_orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

    if (error) throw error;
    return data as WebsiteOrder;
}

export async function hasUserPurchasedProduct(userId: string, productId: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('website_orders')
        .select('id, items')
        .eq('user_id', userId);

    if (error || !data) return false;

    return data.some((order: { items: string | WebsiteOrderItem[] }) => {
        const items: WebsiteOrderItem[] = typeof order.items === 'string'
            ? JSON.parse(order.items)
            : order.items;
        return items.some(item => item.product_id === productId);
    });
}

// =============================================
// PRODUCT REVIEWS FUNCTIONS
// =============================================

export interface ProductReview {
    id: string;
    product_id: string;
    user_id: string;
    user_name: string;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
}

export async function getApprovedReviews(productId: string): Promise<ProductReview[]> {
    const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as ProductReview[];
}

export async function submitReview(
    productId: string,
    userId: string,
    userName: string,
    rating: number,
    comment: string
): Promise<ProductReview> {
    const { data, error } = await supabase
        .from('product_reviews')
        .insert({
            product_id: productId,
            user_id: userId,
            user_name: userName,
            rating,
            comment,
            status: 'pending',
        })
        .select()
        .single();

    if (error) throw error;
    return data as ProductReview;
}

export async function getAllReviews(statusFilter?: string): Promise<ProductReview[]> {
    let query = supabase
        .from('product_reviews')
        .select('*')
        .order('created_at', { ascending: false });

    if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as ProductReview[];
}

export async function moderateReview(reviewId: string, status: 'approved' | 'rejected') {
    const { data, error } = await supabase
        .from('product_reviews')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', reviewId)
        .select()
        .single();

    if (error) throw error;
    return data;
}


// =============================================
// ACADEMY STORAGE (Image Upload)
// =============================================

export async function uploadAcademyImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `courses/${fileName}`;

    const { error } = await supabase.storage
        .from('academy-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data } = supabase.storage
        .from('academy-images')
        .getPublicUrl(filePath);

    return data.publicUrl;
}

// =============================================
// ACADEMY COURSES FUNCTIONS
// =============================================

export interface AcademyCourse {
    id: string;
    title: string;
    duration: string;
    price: number;
    description: string;
    topics: string[];
    badge: 'presencial' | 'online' | 'replay';
    next_date: string;
    link: string;
    dc3: boolean;
    video: string | null;
    video_title: string | null;
    active: boolean;
    images: string[];
    created_at: string;
    updated_at: string;
}

export async function getAcademyCourses(activeOnly = true): Promise<AcademyCourse[]> {
    let query = supabase.from('academy_courses').select('*').order('created_at', { ascending: false });
    if (activeOnly) query = query.eq('active', true);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as AcademyCourse[];
}

export async function createCourse(courseData: Omit<AcademyCourse, 'id' | 'created_at' | 'updated_at'>): Promise<AcademyCourse> {
    const { data, error } = await supabase.from('academy_courses').insert([courseData]).select().single();
    if (error) throw error;
    return data as AcademyCourse;
}

export async function updateCourse(id: string, updates: Partial<AcademyCourse>): Promise<AcademyCourse> {
    const { data, error } = await supabase.from('academy_courses').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data as AcademyCourse;
}

export async function deleteCourse(id: string) {
    const { error } = await supabase.from('academy_courses').update({ active: false, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
}

// =============================================
// ACADEMY EVENTS FUNCTIONS
// =============================================

export interface AcademyEvent {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
    type: 'congreso' | 'live';
    active: boolean;
    images: string[];
    created_at: string;
    updated_at: string;
}

export async function getAcademyEvents(activeOnly = true): Promise<AcademyEvent[]> {
    let query = supabase.from('academy_events').select('*').order('created_at', { ascending: false });
    if (activeOnly) query = query.eq('active', true);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as AcademyEvent[];
}

export async function createEvent(eventData: Omit<AcademyEvent, 'id' | 'created_at' | 'updated_at'>): Promise<AcademyEvent> {
    const { data, error } = await supabase.from('academy_events').insert([eventData]).select().single();
    if (error) throw error;
    return data as AcademyEvent;
}

export async function updateEvent(id: string, updates: Partial<AcademyEvent>): Promise<AcademyEvent> {
    const { data, error } = await supabase.from('academy_events').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data as AcademyEvent;
}

export async function deleteEvent(id: string) {
    const { error } = await supabase.from('academy_events').update({ active: false, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
}

// =============================================
// BLOG POSTS FUNCTIONS
// =============================================

export async function uploadBlogImage(file: File): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

    return data.publicUrl;
}

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    subtitle: string | null;
    author: string;
    content: string;
    excerpt: string | null;
    featured_image: string | null;
    categories: string[] | null;
    tags: string[] | null;
    published: boolean;
    published_at: string | null;
    post_type: 'article' | 'news';
    tag: string | null;
    is_featured?: boolean;
    created_at: string;
    updated_at: string;
}

export function safeParseArray(val: any) {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
        try { const parsed = JSON.parse(val); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
    }
    return [];
}

export async function getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
    let query = supabase.from('blog_posts').select('*').order('published_at', { ascending: false, nullsFirst: false });
    if (publishedOnly) query = query.eq('published', true);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(post => ({
        ...post,
        categories: safeParseArray(post.categories),
        tags: safeParseArray(post.tags)
    })) as BlogPost[];
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
    if (error) throw error;
    return {
        ...data,
        categories: safeParseArray(data.categories),
        tags: safeParseArray(data.tags)
    } as BlogPost;
}

export async function createBlogPost(postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    const { data, error } = await supabase.from('blog_posts').insert([postData]).select().single();
    if (error) throw error;
    return data as BlogPost;
}

export async function updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await supabase.from('blog_posts').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data as BlogPost;
}

export async function deleteBlogPost(id: string) {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
}

// =============================================
// NEWS POSTS FUNCTIONS
// =============================================

export async function getNewsPosts(publishedOnly = true): Promise<BlogPost[]> {
    let query = supabase.from('blog_posts').select('*').eq('post_type', 'news').order('published_at', { ascending: false, nullsFirst: false });
    if (publishedOnly) query = query.eq('published', true);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(post => ({
        ...post,
        categories: safeParseArray(post.categories),
        tags: safeParseArray(post.tags)
    })) as BlogPost[];
}

export async function getNewsPost(slug: string): Promise<BlogPost> {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('post_type', 'news').single();
    if (error) throw error;
    return {
        ...data,
        categories: safeParseArray(data.categories),
        tags: safeParseArray(data.tags)
    } as BlogPost;
}

export async function createNewsPost(postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'post_type'>): Promise<BlogPost> {
    const { data, error } = await supabase.from('blog_posts').insert([{ ...postData, post_type: 'news' }]).select().single();
    if (error) throw error;
    return data as BlogPost;
}

export async function updateNewsPost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await supabase.from('blog_posts').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data as BlogPost;
}

export async function deleteNewsPost(id: string) {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
}

// =============================================
// SOCIAL REELS FUNCTIONS
// =============================================

export interface SocialReel {
    id: string;
    title: string;
    url: string;
    video_url: string | null;
    platform: 'youtube' | 'tiktok' | 'instagram';
    thumbnail_url: string | null;
    sort_order: number;
    active: boolean;
    created_at: string;
    updated_at: string;
}

export async function getReels(activeOnly = true): Promise<SocialReel[]> {
    let query = supabase.from('social_reels').select('*').order('sort_order', { ascending: true });
    if (activeOnly) query = query.eq('active', true);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as SocialReel[];
}

export async function createReel(reelData: Omit<SocialReel, 'id' | 'created_at' | 'updated_at'>): Promise<SocialReel> {
    const { data, error } = await supabase.from('social_reels').insert([reelData]).select().single();
    if (error) throw error;
    return data as SocialReel;
}

export async function uploadReelVideo(file: File): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

    const { error } = await supabase.storage
        .from('reels')
        .upload(fileName, file, { upsert: true });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
        .from('reels')
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
}

export async function updateReel(id: string, updates: Partial<SocialReel>): Promise<SocialReel> {
    const { data, error } = await supabase.from('social_reels').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data as SocialReel;
}

export async function deleteReel(id: string) {
    const { error } = await supabase.from('social_reels').delete().eq('id', id);
    if (error) throw error;
}

// =============================================
// PROMOTIONS FUNCTIONS
// =============================================

export interface Promotion {
    id: string;
    name: string;
    description: string | null;
    discount_type: 'percentage' | 'fixed_amount';
    discount_value: number;
    min_purchase: number;
    applicable_products: string[];
    applicable_categories: string[];
    start_date: string;
    end_date: string;
    is_active: boolean;
    code: string | null;
    max_uses: number | null;
    current_uses: number;
    created_at: string;
    updated_at: string;
}

export async function getPromotions(): Promise<Promotion[]> {
    const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Promotion[];
}

export async function createPromotion(promoData: Omit<Promotion, 'id' | 'created_at' | 'updated_at' | 'current_uses'>): Promise<Promotion> {
    const { data, error } = await supabase.from('promotions').insert([promoData]).select().single();
    if (error) throw error;
    return data as Promotion;
}

export async function updatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion> {
    const { data, error } = await supabase.from('promotions').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data as Promotion;
}

export async function deletePromotion(id: string) {
    const { error } = await supabase.from('promotions').delete().eq('id', id);
    if (error) throw error;
}

// =============================================
// DISTRIBUTOR PRICES FUNCTIONS
// =============================================

export interface DistributorPrice {
    id: string;
    product_id: string;
    product_name: string;
    regular_price: number;
    distributor_price: number;
    min_quantity: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export async function getDistributorPrices(): Promise<DistributorPrice[]> {
    const { data, error } = await supabase
        .from('distributor_prices')
        .select('*')
        .order('product_name', { ascending: true });
    if (error) throw error;
    return (data || []) as DistributorPrice[];
}

export async function createDistributorPrice(priceData: Omit<DistributorPrice, 'id' | 'created_at' | 'updated_at'>): Promise<DistributorPrice> {
    const { data, error } = await supabase.from('distributor_prices').insert([priceData]).select().single();
    if (error) throw error;
    return data as DistributorPrice;
}

export async function updateDistributorPrice(id: string, updates: Partial<DistributorPrice>): Promise<DistributorPrice> {
    const { data, error } = await supabase.from('distributor_prices').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single();
    if (error) throw error;
    return data as DistributorPrice;
}

export async function deleteDistributorPrice(id: string) {
    const { error } = await supabase.from('distributor_prices').delete().eq('id', id);
    if (error) throw error;
}

// =============================================
// MERCADO PAGO FUNCTIONS
// =============================================

export interface MercadoPagoCheckoutRequest {
    items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
        image?: string;
    }>;
    buyer: {
        userId?: string;
        fullName: string;
        email: string;
        phone: string;
    };
    shipping: {
        address: string;
        references?: string;
        city: string;
        state: string;
        zip: string;
    };
    total: number;
    subtotal?: number;
    discount?: number;
    shipping_cost?: number;
    coupon_code?: string | null;
    notes?: string;
    payment_method?: 'mercadopago' | 'transferencia' | 'efectivo';
}

export interface MercadoPagoCheckoutResponse {
    checkout_url: string;
    preference_id: string;
    order_id: string;
    order_number?: string;
    mode?: 'mercadopago' | 'direct_order';
}

export async function createMercadoPagoCheckout(
    data: MercadoPagoCheckoutRequest
): Promise<MercadoPagoCheckoutResponse> {
    // 1. Primary server-side checkout pipeline via PostgreSQL SECURITY DEFINER RPC
    const { data: rpcResult, error: rpcError } = await supabase.rpc('process_website_checkout', {
        payload: data,
    });

    if (!rpcError && rpcResult) {
        const res = rpcResult as Record<string, unknown>;
        const resolvedUrl =
            (typeof res.checkout_url === 'string' && res.checkout_url.trim()) ||
            (typeof res.init_point === 'string' && res.init_point.trim()) ||
            '';

        if (resolvedUrl && resolvedUrl !== 'undefined') {
            return {
                checkout_url: resolvedUrl,
                preference_id: String(res.preference_id || res.order_number || ''),
                order_id: String(res.order_id || ''),
                order_number: typeof res.order_number === 'string' ? res.order_number : undefined,
                mode: (res.mode as 'mercadopago' | 'direct_order') || 'direct_order',
            };
        }
    }

    // 2. Direct table insert fallback so the order is never lost
    const now = new Date();
    const yymmdd = now.toISOString().slice(2, 10).replace(/-/g, '');
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    const fallbackOrderNumber = `JD-${yymmdd}-${rand}`;
    const paymentMethod = data.payment_method || 'mercadopago';

    const { data: insertedOrder, error: insertError } = await supabase
        .from('website_orders')
        .insert({
            user_id: data.buyer.userId || null,
            user_email: data.buyer.email.trim().toLowerCase(),
            items: data.items,
            subtotal: data.subtotal ?? data.total,
            shipping_cost: data.shipping_cost ?? 0,
            discount: data.discount ?? 0,
            coupon_code: data.coupon_code || null,
            total: data.total,
            status: 'pending',
            payment_status: 'pending',
            payment_method: paymentMethod,
            merchant_order_id: fallbackOrderNumber,
            order_number: fallbackOrderNumber,
            shipping_address: data.shipping,
            buyer_info: data.buyer,
            notes: data.notes || null,
        })
        .select('id, order_number, merchant_order_id')
        .single();

    if (insertError || !insertedOrder) {
        throw new Error(
            rpcError?.message || insertError?.message || 'No se pudo registrar tu pedido. Intenta nuevamente.'
        );
    }

    const orderNum = insertedOrder.order_number || insertedOrder.merchant_order_id || fallbackOrderNumber;
    return {
        checkout_url: `/pago-resultado?status=order_created&order_id=${encodeURIComponent(insertedOrder.id)}&external_reference=${encodeURIComponent(orderNum)}&method=${encodeURIComponent(paymentMethod)}`,
        preference_id: orderNum,
        order_id: insertedOrder.id,
        order_number: orderNum,
        mode: 'direct_order',
    };
}

export async function getWebsiteOrderSummary(orderId: string): Promise<WebsiteOrder | null> {
    if (!orderId) return null;
    const { data, error } = await supabase.rpc('get_website_order_summary', {
        p_order_id: orderId,
    });
    if (!error && data) {
        return data as WebsiteOrder;
    }
    const { data: fallback } = await supabase
        .from('website_orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();
    return (fallback as WebsiteOrder) || null;
}

export async function sendTransactionalEmail(payload: Record<string, unknown>) {
    const { data, error } = await supabase.rpc('send_transactional_email', { payload });
    if (error) {
        console.warn('send_transactional_email RPC warning:', error.message);
    }
    return data;
}

// =============================================
// PRODUCT VARIANT GROUPS FUNCTIONS
// =============================================

export interface ProductVariantGroup {
    id: string;
    parent_id: string;
    parent_name: string;
    attribute_names: string[];
    variants: { productId: string; attributes: Record<string, string> }[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export async function getProductVariantGroups(): Promise<ProductVariantGroup[]> {
    const groups = await getAllVariantGroups();
    return groups.map(g => ({
        id: g.id,
        parent_id: g.id,
        parent_name: g.name,
        attribute_names: g.attribute_names,
        variants: g.variants.map(v => ({ productId: v.product_id, attributes: v.attributes })),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }));
}

export async function createProductVariantGroup(
    groupData: Omit<ProductVariantGroup, 'id' | 'created_at' | 'updated_at'>
): Promise<ProductVariantGroup> {
    return {
        ...groupData,
        id: groupData.parent_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
}

export async function updateProductVariantGroup(
    id: string, updates: Partial<ProductVariantGroup>
): Promise<ProductVariantGroup> {
    return {
        id,
        parent_id: id,
        parent_name: updates.parent_name || '',
        attribute_names: updates.attribute_names || [],
        variants: updates.variants || [],
        is_active: updates.is_active ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
}

export async function deleteProductVariantGroup(id: string) {
    const numId = Number(id);
    if (!Number.isFinite(numId)) return;
    const { error } = await supabase.from('product_variants').delete().eq('product_id', numId);
    if (error) throw error;
}

// =============================================
// CART PROMO CONFIG FUNCTIONS
// =============================================

export interface CartPromoConfig {
    id: string;
    name: string;
    is_active: boolean;
    min_amount: number;
    min_items: number;
    eval_mode: 'OR' | 'AND';
    discount_percent: number;
    free_shipping: boolean;
    standard_shipping_cost: number;
    activation_message: string;
    deactivation_message: string;
    progress_label: string;
    created_at: string;
    updated_at: string;
}

/** Fetch all promo configs (admin list) */
export async function getCartPromoConfigs(): Promise<CartPromoConfig[]> {
    const { data, error } = await supabase
        .from('cart_promo_config')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as CartPromoConfig[];
}

/** Fetch only the first active config (used by the storefront hook) */
export async function getActiveCartPromoConfig(): Promise<CartPromoConfig | null> {
    const { data, error } = await supabase
        .from('cart_promo_config')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();
    if (error) throw error;
    return data as CartPromoConfig | null;
}

export async function createCartPromoConfig(
    cfg: Omit<CartPromoConfig, 'id' | 'created_at' | 'updated_at'>
): Promise<CartPromoConfig> {
    const { data, error } = await supabase.from('cart_promo_config').insert([cfg]).select().single();
    if (error) throw error;
    return data as CartPromoConfig;
}

export async function updateCartPromoConfig(
    id: string, updates: Partial<CartPromoConfig>
): Promise<CartPromoConfig> {
    const { data, error } = await supabase
        .from('cart_promo_config')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id).select().single();
    if (error) throw error;
    return data as CartPromoConfig;
}

export async function deleteCartPromoConfig(id: string) {
    const { error } = await supabase.from('cart_promo_config').delete().eq('id', id);
    if (error) throw error;
}

// =============================================
// PRODUCT CATALOG OVERRIDES (Editor → Store Sync)
// =============================================

export interface ProductOverride {
    slug: string;
    name: string;
    price: number;
    compare_at_price: number | null;
    is_featured: boolean | null;
    stock: number | null;
    category: string;
    is_active: boolean | null;
}

export async function getAllProductOverrides(): Promise<ProductOverride[]> {
    const { data, error } = await supabase
        .from('products')
        .select('slug, name, base_price_mxn, promo_price_mxn, is_featured, total_stock, category, is_active')
        .order('name', { ascending: true });

    if (error) throw error;
    return (data || []).map((r: any) => ({
        slug: r.slug,
        name: r.name,
        price: r.promo_price_mxn != null && r.promo_price_mxn > 0 && r.promo_price_mxn < r.base_price_mxn
            ? Number(r.promo_price_mxn)
            : Number(r.base_price_mxn),
        compare_at_price: r.promo_price_mxn != null && r.promo_price_mxn > 0 && r.promo_price_mxn < r.base_price_mxn
            ? Number(r.base_price_mxn)
            : null,
        is_featured: r.is_featured,
        stock: r.total_stock,
        category: r.category,
        is_active: r.is_active,
    }));
}

export async function updateProductCatalog(
    slug: string,
    updates: Partial<{
        name: string;
        price: number;
        compare_at_price: number | null;
        is_featured: boolean;
        stock: number;
        category: string;
    }>
): Promise<ProductOverride> {
    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.is_featured !== undefined) dbUpdates.is_featured = updates.is_featured;
    if (updates.stock !== undefined) dbUpdates.total_stock = updates.stock;
    if (updates.compare_at_price != null && updates.price != null && updates.price < updates.compare_at_price) {
        dbUpdates.base_price_mxn = updates.compare_at_price;
        dbUpdates.promo_price_mxn = updates.price;
    } else if (updates.price !== undefined) {
        dbUpdates.base_price_mxn = updates.price;
        dbUpdates.promo_price_mxn = null;
    }

    const { data, error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('slug', slug)
        .select('slug, name, base_price_mxn, promo_price_mxn, is_featured, total_stock, category, is_active')
        .single();

    if (error) throw error;
    const r = data as any;
    return {
        slug: r.slug,
        name: r.name,
        price: r.promo_price_mxn != null && r.promo_price_mxn > 0 && r.promo_price_mxn < r.base_price_mxn
            ? Number(r.promo_price_mxn)
            : Number(r.base_price_mxn),
        compare_at_price: r.promo_price_mxn != null && r.promo_price_mxn > 0 && r.promo_price_mxn < r.base_price_mxn
            ? Number(r.base_price_mxn)
            : null,
        is_featured: r.is_featured,
        stock: r.total_stock,
        category: r.category,
        is_active: r.is_active,
    };
}

// =============================================
// WAREHOUSE QUEUE FUNCTIONS (Almacén PF)
// =============================================

export async function getShippingQueue(date: string) {
    const { data, error } = await supabase
        .from('website_orders')
        .select(`
            *,
            order_items:order_items(id, product_id, product_name, quantity, unit_price, total)
        `)
        .eq('queued_for_date', date)
        .in('status', ['confirmed', 'processing', 'pending'])
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data as (OrderB2B & { order_items: OrderItem[] })[];
}

export async function getCompletedShipments(date: string) {
    const { data, error } = await supabase
        .from('website_orders')
        .select(`
            *,
            order_items:order_items(id, product_id, product_name, quantity, unit_price, total)
        `)
        .eq('queued_for_date', date)
        .eq('status', 'shipped')
        .order('shipped_at', { ascending: false });

    if (error) throw error;
    return data as (OrderB2B & { order_items: OrderItem[] })[];
}

export async function updatePackedItems(orderId: string, packedItems: Record<string, boolean>) {
    const allPacked = Object.values(packedItems).every(Boolean);
    const newStatus = allPacked ? 'processing' : 'confirmed';

    const { data, error } = await supabase
        .from('website_orders')
        .update({
            packed_items: packedItems,
            status: newStatus,
            updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateOrderTracking(orderId: string, trackingNumber: string) {
    const { data, error } = await supabase
        .from('website_orders')
        .update({
            tracking_number: trackingNumber,
            status: 'shipped',
            shipped_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function queueOrderForShipping(orderId: string, date: string) {
    const { data, error } = await supabase
        .from('website_orders')
        .update({
            queued_for_date: date,
            updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Helper to toggle featured status for any blog post or news
export async function toggleFeatureBlogPost(id: string, is_featured: boolean): Promise<void> {
    const { error } = await supabase
        .from('blog_posts')
        .update({ is_featured })
        .eq('id', id);

    if (error) throw error;
}

// =============================================
// COUPON FUNCTIONS
// =============================================

export interface CouponVisualDesign {
    backgroundColor: string;
    textColor: string;
    theme?: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface Coupon {
    id: string;
    code: string;
    discount_type: 'percentage' | 'fixed_amount';
    discount_value: number;
    min_purchase: number;
    expiration_date: string | null;
    is_active: boolean;
    visual_design: CouponVisualDesign;
    usage_count: number;
    max_uses: number | null;
    created_at: string;
    updated_at: string;
}

export type CouponValidationResult =
    | { valid: true; coupon: Coupon; discountAmount: number }
    | { valid: false; error: string };

/** Validates a coupon code against cart total. Returns discount amount if valid. */
export async function validateCoupon(
    code: string,
    cartTotal: number
): Promise<CouponValidationResult> {
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.trim().toUpperCase())
        .eq('is_active', true)
        .maybeSingle();

    if (error) return { valid: false, error: 'Error al validar el cupón' };
    if (!data) return { valid: false, error: 'Código no válido' };

    const coupon = data as Coupon;

    // Check expiry
    if (coupon.expiration_date && new Date(coupon.expiration_date) < new Date()) {
        return { valid: false, error: 'Cupón expirado' };
    }

    // Check max uses
    if (coupon.max_uses !== null && coupon.usage_count >= coupon.max_uses) {
        return { valid: false, error: 'Cupón agotado' };
    }

    // Check minimum purchase
    if (cartTotal < coupon.min_purchase) {
        return {
            valid: false,
            error: `Mínimo de compra no alcanzado: $${coupon.min_purchase.toLocaleString('es-MX')} MXN`,
        };
    }

    // Calculate discount
    const discountAmount =
        coupon.discount_type === 'percentage'
            ? Math.round((cartTotal * coupon.discount_value) / 100 * 100) / 100
            : Math.min(coupon.discount_value, cartTotal);

    return { valid: true, coupon, discountAmount };
}

/** Admin: fetch all coupons ordered by creation date */
export async function getCoupons(): Promise<Coupon[]> {
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Coupon[];
}

/** Admin: create a new coupon */
export async function createCoupon(
    payload: Omit<Coupon, 'id' | 'created_at' | 'updated_at' | 'usage_count'>
): Promise<Coupon> {
    const normalized = { ...payload, code: payload.code.trim().toUpperCase() };
    const { data, error } = await supabase
        .from('coupons')
        .insert(normalized)
        .select()
        .single();

    if (error) throw error;
    return data as Coupon;
}

/** Admin: update an existing coupon */
export async function updateCoupon(
    id: string,
    payload: Partial<Omit<Coupon, 'id' | 'created_at' | 'updated_at' | 'usage_count'>>
): Promise<Coupon> {
    const normalized = payload.code
        ? { ...payload, code: payload.code.trim().toUpperCase() }
        : payload;

    const { data, error } = await supabase
        .from('coupons')
        .update(normalized)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Coupon;
}

/** Admin: soft-delete a coupon (sets is_active to false) */
export async function deleteCoupon(id: string): Promise<void> {
    const { error } = await supabase
        .from('coupons')
        .update({ is_active: false })
        .eq('id', id);

    if (error) throw error;
}

/** Increments usage_count after a successful order with a coupon */
export async function incrementCouponUsage(couponId: string): Promise<void> {
    const { error } = await supabase.rpc('increment', {
        table_name: 'coupons',
        column_name: 'usage_count',
        row_id: couponId,
    });
    // Fallback: if RPC not available, do a read-then-write
    if (error) {
        const { data } = await supabase
            .from('coupons')
            .select('usage_count')
            .eq('id', couponId)
            .single();
        if (data) {
            await supabase
                .from('coupons')
                .update({ usage_count: (data.usage_count || 0) + 1 })
                .eq('id', couponId);
        }
    }
}

// ═══════════════════════════════════════════════════════
// Client Dashboard Functions
// ═══════════════════════════════════════════════════════

export interface ClientOrder {
    id: string;
    user_id: string | null;
    user_email: string | null;
    items: any[];
    total: number;
    status: string;
    created_at: string;
    payment_id: string | null;
    payment_status: string | null;
    payment_method: string | null;
    merchant_order_id: string | null;
    shipping_address: any | null;
    buyer_info: any | null;
}

/** Fetch all orders for a client (by user_id or email) */
export async function getClientOrders(userId?: string, email?: string): Promise<ClientOrder[]> {
    if (!userId && !email) return [];

    let query = supabase
        .from('website_orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (userId && email) {
        query = query.or(`user_id.eq.${userId},user_email.eq.${email}`);
    } else if (userId) {
        query = query.eq('user_id', userId);
    } else if (email) {
        query = query.eq('user_email', email);
    }

    const { data, error } = await query;
    if (error) { console.error('Error fetching client orders:', error); return []; }
    return (data || []) as ClientOrder[];
}

/** Fetch available coupons (active, not expired, with uses remaining) */
export async function getAvailableCoupons(): Promise<Coupon[]> {
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) { console.error('Error fetching coupons:', error); return []; }

    const now = new Date();
    return (Array.isArray(data) ? data : []).filter((c: Coupon) => {
        if (c.expiration_date && new Date(c.expiration_date) < now) return false;
        if (c.max_uses && c.usage_count >= c.max_uses) return false;
        return true;
    }) as Coupon[];
}

export interface ActivePromotion {
    id: string;
    name: string;
    description: string | null;
    discount_type: string;
    discount_value: number;
    min_purchase: number;
    start_date: string;
    end_date: string;
    code: string | null;
}

/** Fetch active promotions */
export async function getActivePromotions(): Promise<ActivePromotion[]> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('created_at', { ascending: false });

    if (error) { console.error('Error fetching promotions:', error); return []; }
    return (data || []) as ActivePromotion[];
}

// ── ERP Role Dashboard Functions ──

/** Fetch deliveries assigned to a specific driver */
export async function getTransportistaDeliveries(userId: string) {
    const { data, error } = await supabase
        .from('deliveries')
        .select('*')
        .eq('driver_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);
    if (error) { console.error('Error fetching deliveries:', error); return []; }
    return data || [];
}

/** Get counts for warehouse queue summary */
export async function getWarehouseStats() {
    const { data: pending } = await supabase
        .from('sales_orders')
        .select('id', { count: 'exact' })
        .in('status', ['PENDING', 'PROCESSING']);

    const { data: dispatched } = await supabase
        .from('sales_orders')
        .select('id', { count: 'exact' })
        .eq('status', 'DISPATCHED');

    return {
        pendingOrders: pending?.length || 0,
        dispatchedOrders: dispatched?.length || 0,
    };
}

/** Get production batch summary */
export async function getProductionStats() {
    const { data: inProgress } = await supabase
        .from('production_batches')
        .select('id', { count: 'exact' })
        .eq('status', 'IN_PROGRESS');

    const { data: completed } = await supabase
        .from('production_batches')
        .select('id', { count: 'exact' })
        .eq('status', 'COMPLETED');

    return {
        inProgress: inProgress?.length || 0,
        completed: completed?.length || 0,
    };
}

/** Get recent website orders count */
export async function getRecentOrdersCount() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const { data } = await supabase
        .from('website_orders')
        .select('id', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString());
    return data?.length || 0;
}

/** Get low stock products count */
export async function getLowStockCount() {
    const { data } = await supabase
        .from('products')
        .select('product_id', { count: 'exact' })
        .lt('total_stock', 10)
        .eq('is_active', true);
    return data?.length || 0;
}

/** Get distributor applications count */
export async function getPendingDistributorCount() {
    const { data } = await supabase
        .from('distributor_applications')
        .select('id', { count: 'exact' })
        .eq('status', 'pending');
    return data?.length || 0;
}

/** Get vehicle status summary */
export async function getVehicleStats() {
    const { data } = await supabase
        .from('vehicles')
        .select('status');
    const vehicles = data || [];
    return {
        total: vehicles.length,
        available: vehicles.filter((v: any) => v.status === 'AVAILABLE').length,
        inUse: vehicles.filter((v: any) => v.status === 'IN_USE').length,
        maintenance: vehicles.filter((v: any) => v.status === 'MAINTENANCE').length,
    };
}

// =============================================
// ABANDONED CARTS
// =============================================

export async function upsertAbandonedCart(
    email: string,
    name: string | undefined,
    cartState: any
): Promise<void> {
    try {
        const { error } = await supabase
            .from('abandoned_carts')
            .upsert(
                {
                    email,
                    name: name || '',
                    cart_state: cartState,
                    status: 'active',
                    last_updated: new Date().toISOString()
                },
                { onConflict: 'email' } // requires unique constraint on email
            );
        if (error) {
            console.error('Error upserting abandoned cart:', error);
        }
    } catch (err) {
        console.error('Failed to sync abandoned cart:', err);
    }
}

export async function markCartConverted(email: string): Promise<void> {
    try {
        const { error } = await supabase
            .from('abandoned_carts')
            .update({ status: 'converted', last_updated: new Date().toISOString() })
            .eq('email', email);
        if (error) {
            console.error('Error marking cart as converted:', error);
        }
    } catch (err) {
        console.error('Failed to mark cart converted:', err);
    }
}
