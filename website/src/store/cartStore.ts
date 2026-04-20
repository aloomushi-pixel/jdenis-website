import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Coupon } from '../lib/supabase';
import { useAuthStore } from './authStore';

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
                set((state) => {
                    const existingItem = state.items.find(item => item.id === product.id);
                    if (existingItem) {
                        return {
                            items: state.items.map(item =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                        };
                    }
                    return { items: [...state.items, { ...product, quantity: 1 }] };
                });
            },

            removeItem: (productId: string) => {
                set((state) => ({
                    items: state.items.filter(item => item.id !== productId),
                }));
            },

            updateQuantity: (productId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(productId);
                    return;
                }
                set((state) => ({
                    items: state.items.map(item =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                }));
            },

            clearCart: () => set({ items: [], appliedCoupon: null }),
            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            applyCoupon: (coupon: Coupon) => set({ appliedCoupon: coupon }),
            removeCoupon: () => set({ appliedCoupon: null }),

            total: () => {
                const state = get();
                const user = useAuthStore.getState().user;
                return state.items.reduce((sum, item) => {
                    const isWholesale = user?.role === 'DISTRIBUIDOR' && item.quantity >= 12;
                    const activePrice = isWholesale && item.distributorPrice ? item.distributorPrice : item.price;
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
