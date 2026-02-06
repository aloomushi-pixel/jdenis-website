// Auto-generated TypeScript types from Supabase schema
// Generated via Supabase MCP on 2026-02-05

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            products: {
                Row: {
                    id: string
                    slug: string
                    name: string
                    description: string | null
                    price: number
                    compare_at_price: number | null
                    image_url: string | null
                    category: string
                    sku: string | null
                    stock: number | null
                    is_active: boolean | null
                    is_featured: boolean | null
                    sort_order: number | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    slug: string
                    name: string
                    description?: string | null
                    price?: number
                    compare_at_price?: number | null
                    image_url?: string | null
                    category: string
                    sku?: string | null
                    stock?: number | null
                    is_active?: boolean | null
                    is_featured?: boolean | null
                    sort_order?: number | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    slug?: string
                    name?: string
                    description?: string | null
                    price?: number
                    compare_at_price?: number | null
                    image_url?: string | null
                    category?: string
                    sku?: string | null
                    stock?: number | null
                    is_active?: boolean | null
                    is_featured?: boolean | null
                    sort_order?: number | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            product_categories: {
                Row: {
                    id: string
                    slug: string
                    name: string
                    icon: string | null
                    description: string | null
                    sort_order: number | null
                    is_active: boolean | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    slug: string
                    name: string
                    icon?: string | null
                    description?: string | null
                    sort_order?: number | null
                    is_active?: boolean | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    slug?: string
                    name?: string
                    icon?: string | null
                    description?: string | null
                    sort_order?: number | null
                    is_active?: boolean | null
                    created_at?: string | null
                }
            }
            orders_b2b: {
                Row: {
                    id: string
                    order_number: string
                    user_id: string
                    status: string
                    subtotal: number
                    tax: number | null
                    shipping: number | null
                    total: number
                    shipping_address: Json | null
                    billing_address: Json | null
                    payment_method: string | null
                    payment_reference: string | null
                    notes: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    order_number: string
                    user_id: string
                    status?: string
                    subtotal: number
                    tax?: number | null
                    shipping?: number | null
                    total: number
                    shipping_address?: Json | null
                    billing_address?: Json | null
                    payment_method?: string | null
                    payment_reference?: string | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    order_number?: string
                    user_id?: string
                    status?: string
                    subtotal?: number
                    tax?: number | null
                    shipping?: number | null
                    total?: number
                    shipping_address?: Json | null
                    billing_address?: Json | null
                    payment_method?: string | null
                    payment_reference?: string | null
                    notes?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            order_items: {
                Row: {
                    id: string
                    order_id: string
                    product_id: string
                    product_name: string
                    quantity: number
                    unit_price: number
                    total: number
                }
                Insert: {
                    id?: string
                    order_id: string
                    product_id: string
                    product_name: string
                    quantity: number
                    unit_price: number
                    total: number
                }
                Update: {
                    id?: string
                    order_id?: string
                    product_id?: string
                    product_name?: string
                    quantity?: number
                    unit_price?: number
                    total?: number
                }
            }
            carts: {
                Row: {
                    id: string
                    user_id: string | null
                    session_id: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    session_id?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    session_id?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
            }
            cart_items: {
                Row: {
                    id: string
                    cart_id: string
                    product_id: string
                    quantity: number
                    added_at: string | null
                }
                Insert: {
                    id?: string
                    cart_id: string
                    product_id: string
                    quantity?: number
                    added_at?: string | null
                }
                Update: {
                    id?: string
                    cart_id?: string
                    product_id?: string
                    quantity?: number
                    added_at?: string | null
                }
            }
        }
    }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
