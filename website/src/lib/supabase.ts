// Supabase Client for J.Denis Website
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://irdeiiichmanewpnuaml.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZGVpaWljaG1hbmV3cG51YW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxODA3NDgsImV4cCI6MjA4NTc1Njc0OH0.vNzADcACLa_4VLw2iQzINUZcP3Hl7rcBKoKanB4aJ8Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
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
    stock: number;
    is_active: boolean;
    is_featured: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface ProductCategory {
    id: string;
    slug: string;
    name: string;
    icon: string | null;
    description: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

export interface CartItem {
    id: string;
    cart_id: string;
    product_id: string;
    quantity: number;
    added_at: string;
    product?: Product;
}

export interface OrderB2B {
    id: string;
    order_number: string;
    user_id: string;
    status: string;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    shipping_address: Record<string, unknown> | null;
    billing_address: Record<string, unknown> | null;
    payment_method: string | null;
    payment_reference: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

// API Functions
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
    return data as Product[];
}

export async function getProductBySlug(slug: string) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error) throw error;
    return data as Product;
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
    return data as Product[];
}

export async function getCategories() {
    const { data, error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (error) throw error;
    return data as ProductCategory[];
}
