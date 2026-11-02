import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Coupon } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { upsertAbandonedCart } from '../lib/supabase';
import { trackEvent } from '../utils/telemetry';

let syncTimeout: ReturnType<typeof setTimeout> | null = null;
const syncCartToSupabase = (items: CartItem[]) => {
    const user = useAuthStore.getState().user;
    if (user?.email) {
        if (syncTimeout) clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => {
            upsertAbandonedCart(user.email, user.name, items).catch(console.error);
        }, 600);
    }
};

export interface Product {
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

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    itemCount: () => number;
    appliedCoupon: Coupon | null;
    applyCoupon: (coupon: Coupon) => void;
    removeCoupon: () => void;
    total: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            appliedCoupon: null,

            addItem: (product: Product) => {
                trackEvent('add_to_cart', 'ecommerce', {
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    qty: 1,
                });
                set((state) => {
                    const existingItem = state.items.find(item => item.id === product.id);
                    if (existingItem) {
                        const newItems = state.items.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        );
                        syncCartToSupabase(newItems);
                        return { items: newItems };
                    }
                    const newItems = [...state.items, { ...product, quantity: 1 }];
                    syncCartToSupabase(newItems);
                    return { items: newItems };
                });
            },

            removeItem: (productId: string) => {
                const target = get().items.find(item => item.id === productId);
                if (target) {
                    trackEvent('remove_from_cart', 'ecommerce', {
                        id: target.id,
                        name: target.name,
                        category: target.category,
                        price: target.price,
                        qty: target.quantity,
                    });
                }
                set((state) => {
                    const newItems = state.items.filter(item => item.id !== productId);
                    syncCartToSupabase(newItems);
                    return { items: newItems };
                });
            },

            updateQuantity: (productId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set((state) => {
                    const newItems = state.items.map(item =>
                        item.id === productId ? { ...item, quantity } : item
                    );
                    syncCartToSupabase(newItems);
                    return { items: newItems };
                });
            },

            clearCart: () => {
                syncCartToSupabase([]);
                set({ items: [], appliedCoupon: null });
            },
            toggleCart: () => {
                const nextOpen = !get().isOpen;
                if (nextOpen) {
                    trackEvent('cart_view', 'ecommerce', {
                        items_count: get().itemCount(),
                        cart_total: get().total(),
                    });
                }
                set({ isOpen: nextOpen });
            },
            openCart: () => {
                if (!get().isOpen) {
                    trackEvent('cart_view', 'ecommerce', {
                        items_count: get().itemCount(),
                        cart_total: get().total(),
                    });
                }
                set({ isOpen: true });
            },
            closeCart: () => set({ isOpen: false }),

            applyCoupon: (coupon: Coupon) => set({ appliedCoupon: coupon }),
            removeCoupon: () => set({ appliedCoupon: null }),

            total: () => {
                const state = get();
                const user = useAuthStore.getState().user;
                return state.items.reduce((sum, item) => {
                    const isDistributor = user?.role === 'DISTRIBUIDOR';
                    const activePrice = isDistributor && item.distributorPrice ? item.distributorPrice : item.price;
                    return sum + activePrice * item.quantity;
                }, 0);
            },

            itemCount: () => {
                const state = get();
                return state.items.reduce((sum, item) => sum + item.quantity, 0);
            },
        }),
        { name: 'jdenis-cart' }
    )
);
