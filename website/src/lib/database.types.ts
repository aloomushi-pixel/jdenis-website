// TypeScript types matching normalized Supabase schema (Catalog v2)

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
                    product_id: number
                    slug: string
                    name: string
                    brand: string
                    category: string
                    raw_categories: string | null
                    description: string
                    description_html: string
                    image_url: string | null
                    gallery_images: string[]
                    has_variants: boolean
                    variant_attributes: string | null
                    variants_count: number
                    base_price_mxn: number
                    promo_price_mxn: number | null
                    distributor_price_mxn: number | null
                    promotion_label: string | null
                    total_stock: number
                    is_active: boolean
                    is_featured: boolean
                    sort_order: number
                    free_shipping: boolean
                    tags: string | null
                    seo_title: string | null
                    seo_description: string | null
                    benefits: string[]
                    includes: string[]
                    performance: string | null
                    specifications: string[]
                    video: string | null
                    related_categories: string[]
                    jdenis_store_status: string | null
                    source_url: string | null
                    audit_notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    product_id?: number
                    slug: string
                    name: string
                    brand?: string
                    category: string
                    raw_categories?: string | null
                    description?: string
                    description_html?: string
                    image_url?: string | null
                    gallery_images?: string[]
                    has_variants?: boolean
                    variant_attributes?: string | null
                    variants_count?: number
                    base_price_mxn?: number
                    promo_price_mxn?: number | null
                    distributor_price_mxn?: number | null
                    promotion_label?: string | null
                    total_stock?: number
                    is_active?: boolean
                    is_featured?: boolean
                    sort_order?: number
                    free_shipping?: boolean
                    tags?: string | null
                    seo_title?: string | null
                    seo_description?: string | null
                    benefits?: string[]
                    includes?: string[]
                    performance?: string | null
                    specifications?: string[]
                    video?: string | null
                    related_categories?: string[]
                    jdenis_store_status?: string | null
                    source_url?: string | null
                    audit_notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['products']['Insert']>
            }
            product_variants: {
                Row: {
                    variant_id: number
                    product_id: number
                    product_slug: string
                    original_tiendanube_slug: string
                    sku: string | null
                    barcode: string | null
                    variant_title: string
                    option_1_name: string | null
                    option_1_value: string | null
                    option_2_name: string | null
                    option_2_value: string | null
                    option_3_name: string | null
                    option_3_value: string | null
                    price_mxn: number
                    promo_price_mxn: number | null
                    cost_mxn: number | null
                    stock: number
                    weight_kg: number
                    height_cm: number
                    width_cm: number
                    depth_cm: number
                    image_url: string | null
                    variant_description: string | null
                    is_active: boolean
                    source_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    variant_id?: number
                    product_id: number
                    product_slug: string
                    original_tiendanube_slug?: string
                    sku?: string | null
                    barcode?: string | null
                    variant_title: string
                    option_1_name?: string | null
                    option_1_value?: string | null
                    option_2_name?: string | null
                    option_2_value?: string | null
                    option_3_name?: string | null
                    option_3_value?: string | null
                    price_mxn?: number
                    promo_price_mxn?: number | null
                    cost_mxn?: number | null
                    stock?: number
                    weight_kg?: number
                    height_cm?: number
                    width_cm?: number
                    depth_cm?: number
                    image_url?: string | null
                    variant_description?: string | null
                    is_active?: boolean
                    source_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: Partial<Database['public']['Tables']['product_variants']['Insert']>
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
                Update: Partial<Database['public']['Tables']['product_categories']['Insert']>
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
                Update: Partial<Database['public']['Tables']['orders_b2b']['Insert']>
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
                Update: Partial<Database['public']['Tables']['order_items']['Insert']>
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
                Update: Partial<Database['public']['Tables']['carts']['Insert']>
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
                Update: Partial<Database['public']['Tables']['cart_items']['Insert']>
            }
        }
    }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
