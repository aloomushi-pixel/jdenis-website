// Supabase Client for J.Denis Website
// Enhanced with E-commerce Manager Skill
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for e-commerce entities
export interface Product {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    price: number;
    compare_at_price: number | null;
    image_url: string | null;
    category: string;
    sku: string | null;
    stock: number | null;
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

export async function getProducts(category?: string) {
    let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (category && category !== 'all') {
        query = query.ilike('category', `%${category}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

export async function getProductBySlug(slug: string) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) throw error;
    return data;
}

export async function getProductById(id: string) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw error;
    return data;
}

export async function getFeaturedProducts(limit: number = 12) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(limit);

    if (error) throw error;
    return data;
}

/**
 * Returns a de-duplicated list of products for the shop grid.
 * For each variant group, only the parent (first) product is shown.
 */
export async function getDisplayProducts(category?: string): Promise<Product[]> {
    // 1. Get all active products
    let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (category && category !== 'all') {
        query = query.ilike('category', `%${category}%`);
    }

    const { data: products, error: productsError } = await query;
    if (productsError) throw productsError;
    if (!products || products.length === 0) return [];

    // 2. Get variant groups + their variants to identify hidden products
    const { data: variantGroups, error: vgError } = await supabase
        .from('variant_groups')
        .select('id, name');
    if (vgError) throw vgError;

    const { data: variants, error: pvError } = await supabase
        .from('product_variants')
        .select('group_id, product_id');
    if (pvError) throw pvError;

    // 3. Build set of hidden product IDs (non-parent variants)
    const hiddenIds = new Set<string>();
    if (variantGroups && variants) {
        for (const group of variantGroups) {
            const groupVariants = variants.filter(v => v.group_id === group.id);
            if (groupVariants.length > 0) {
                // First variant's product_id is the parent — hide all others
                const parentId = groupVariants[0].product_id;
                for (const v of groupVariants) {
                    if (v.product_id !== parentId) {
                        hiddenIds.add(v.product_id);
                    }
                }
            }
        }
    }

    return products.filter(p => !hiddenIds.has(p.id));
}

/**
 * Returns the variant group a product belongs to, with all variants and their products.
 */
export async function getVariantGroupForProduct(productId: string): Promise<{
    group: { id: string; name: string; attribute_names: string[] };
    variants: { product_id: string; attributes: Record<string, string> }[];
} | null> {
    // Find variant entry for this product
    const { data: variantEntry, error: veError } = await supabase
        .from('product_variants')
        .select('group_id')
        .eq('product_id', productId)
        .limit(1)
        .maybeSingle();

    if (veError) throw veError;
    if (!variantEntry) return null;

    // Fetch the group
    const { data: group, error: gError } = await supabase
        .from('variant_groups')
        .select('*')
        .eq('id', variantEntry.group_id)
        .single();

    if (gError) throw gError;

    // Fetch all variants for the group
    const { data: variants, error: vError } = await supabase
        .from('product_variants')
        .select('product_id, attributes')
        .eq('group_id', variantEntry.group_id);

    if (vError) throw vError;

    return {
        group: { id: group.id, name: group.name, attribute_names: group.attribute_names },
        variants: variants || [],
    };
}

/**
 * Returns related products by matching any of the given categories.
 */
export async function getRelatedProducts(currentProductId: string, categories: string[], limit: number = 4): Promise<Product[]> {
    if (!categories || categories.length === 0) return [];

    // Use OR filter for related_categories overlap
    let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .neq('id', currentProductId)
        .limit(limit);

    // Filter to same top-level category for simplicity
    if (categories.length > 0) {
        query = query.ilike('category', `%${categories[0]}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}

/**
 * Returns all variant groups with their variants.
 */
export async function getAllVariantGroups(): Promise<{
    id: string;
    name: string;
    attribute_names: string[];
    variants: { product_id: string; attributes: Record<string, string> }[];
}[]> {
    const { data: groups, error: gError } = await supabase
        .from('variant_groups')
        .select('*');
    if (gError) throw gError;

    const { data: variants, error: vError } = await supabase
        .from('product_variants')
        .select('group_id, product_id, attributes');
    if (vError) throw vError;

    return (groups || []).map(g => ({
        id: g.id,
        name: g.name,
        attribute_names: g.attribute_names,
        variants: (variants || []).filter(v => v.group_id === g.id),
    }));
}

/**
 * Returns the count of variants for a product's group, or 0 if standalone.
 */
export async function getVariantCountForProduct(productId: string): Promise<number> {
    const group = await getVariantGroupForProduct(productId);
    return group ? group.variants.length : 0;
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
    const cats = new Set((data || []).map(p => p.category));
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
        .select('id, name, slug, stock, sku')
        .lt('stock', threshold)
        .eq('is_active', true)
        .order('stock', { ascending: true });

    if (error) throw error;
    return data;
}

export async function updateProductStock(productId: string, newStock: number) {
    const { data, error } = await supabase
        .from('products')
        .update({ stock: newStock, updated_at: new Date().toISOString() })
        .eq('id', productId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function decrementStock(productId: string, quantity: number) {
    // First get current stock
    const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();

    if (fetchError) throw fetchError;

    const currentStock = product?.stock || 0;
    const newStock = Math.max(0, currentStock - quantity);

    const { data, error } = await supabase
        .from('products')
        .update({ stock: newStock, updated_at: new Date().toISOString() })
        .eq('id', productId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getInventoryValue() {
    const { data, error } = await supabase
        .from('products')
        .select('price, stock')
        .eq('is_active', true);

    if (error) throw error;

    const totalValue = data?.reduce((sum, product) => {
        return sum + (product.price * (product.stock || 0));
    }, 0) || 0;

    return { totalValue, productCount: data?.length || 0 };
}

// =============================================
// ORDER FUNCTIONS (E-commerce Manager Skill)
// =============================================

export async function getOrders(status?: string) {
    let query = supabase
        .from('orders_b2b')
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
        .from('orders_b2b')
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
        .from('orders_b2b')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function createOrder(orderData: Omit<OrderB2B, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
        .from('orders_b2b')
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
        .from('orders_b2b')
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
    created_at: string;
    updated_at: string;
}

export async function getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
    let query = supabase.from('blog_posts').select('*').order('published_at', { ascending: false, nullsFirst: false });
    if (publishedOnly) query = query.eq('published', true);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as BlogPost[];
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
    if (error) throw error;
    return data as BlogPost;
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
    return (data || []) as BlogPost[];
}

export async function getNewsPost(slug: string): Promise<BlogPost> {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('post_type', 'news').single();
    if (error) throw error;
    return data as BlogPost;
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
    shipping_cost?: number;
}

export interface MercadoPagoCheckoutResponse {
    checkout_url: string;
    preference_id: string;
    order_id: string;
}

export async function createMercadoPagoCheckout(
    data: MercadoPagoCheckoutRequest
): Promise<MercadoPagoCheckoutResponse> {
    const response = await supabase.functions.invoke('mercadopago-checkout', {
        body: data,
    });

    if (response.error) {
        throw new Error(response.error.message || 'Error creating checkout');
    }

    return response.data as MercadoPagoCheckoutResponse;
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
    const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .order('parent_name', { ascending: true });
    if (error) throw error;
    return (data || []) as ProductVariantGroup[];
}

export async function createProductVariantGroup(
    groupData: Omit<ProductVariantGroup, 'id' | 'created_at' | 'updated_at'>
): Promise<ProductVariantGroup> {
    const { data, error } = await supabase.from('product_variants').insert([groupData]).select().single();
    if (error) throw error;
    return data as ProductVariantGroup;
}

export async function updateProductVariantGroup(
    id: string, updates: Partial<ProductVariantGroup>
): Promise<ProductVariantGroup> {
    const { data, error } = await supabase
        .from('product_variants')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id).select().single();
    if (error) throw error;
    return data as ProductVariantGroup;
}

export async function deleteProductVariantGroup(id: string) {
    const { error } = await supabase.from('product_variants').delete().eq('id', id);
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

/**
 * Fetches all product overrides from Supabase.
 * These are merged with local products.ts data to provide the final product list.
 */
export async function getAllProductOverrides(): Promise<ProductOverride[]> {
    const { data, error } = await supabase
        .from('products')
        .select('slug, name, price, compare_at_price, is_featured, stock, category, is_active')
        .order('name', { ascending: true });

    if (error) throw error;
    return (data || []) as ProductOverride[];
}

/**
 * Updates a product's editable fields in Supabase by slug.
 * Used by ProductEditor to persist changes.
 */
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
    const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('slug', slug)
        .select('slug, name, price, compare_at_price, is_featured, stock, category, is_active')
        .single();

    if (error) throw error;
    return data as ProductOverride;
}

// =============================================
// WAREHOUSE QUEUE FUNCTIONS (Almacén PF)
// =============================================

export async function getShippingQueue(date: string) {
    const { data, error } = await supabase
        .from('orders_b2b')
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
        .from('orders_b2b')
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
        .from('orders_b2b')
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
        .from('orders_b2b')
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
        .from('orders_b2b')
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
