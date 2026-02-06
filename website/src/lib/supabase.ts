// Supabase Client for J.Denis Website
// Enhanced with E-commerce Manager Skill
import { createClient } from '@supabase/supabase-js';
import type { Database, Tables } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://irdeiiichmanewpnuaml.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZGVpaWljaG1hbmV3cG51YW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxODA3NDgsImV4cCI6MjA4NTc1Njc0OH0.vNzADcACLa_4VLw2iQzINUZcP3Hl7rcBKoKanB4aJ8Y';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Re-export types for convenience
export type Product = Tables<'products'>;
export type ProductCategory = Tables<'product_categories'>;
export type OrderB2B = Tables<'orders_b2b'>;
export type OrderItem = Tables<'order_items'>;
export type Cart = Tables<'carts'>;
export type CartItem = Tables<'cart_items'>;

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

export async function getFeaturedProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(4);

    if (error) throw error;
    return data;
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
