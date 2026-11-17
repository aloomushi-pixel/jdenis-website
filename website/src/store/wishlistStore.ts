import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { trackEvent } from '../utils/telemetry';

interface WishlistState {
    favoriteIds: string[];
    recentlyViewedIds: string[];
    toggleFavorite: (productId: string, productName?: string) => boolean;
    isFavorite: (productId: string) => boolean;
    recordRecentlyViewed: (productId: string) => void;
    clearFavorites: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            favoriteIds: [],
            recentlyViewedIds: [],

            toggleFavorite: (productId: string, productName?: string) => {
                const cleanId = String(productId);
                const exists = get().favoriteIds.includes(cleanId);
                const next = exists
                    ? get().favoriteIds.filter((id) => id !== cleanId)
                    : [cleanId, ...get().favoriteIds].slice(0, 60);

                set({ favoriteIds: next });
                trackEvent(exists ? 'wishlist_remove' : 'wishlist_add', 'ecommerce', {
                    product_id: cleanId,
                    product_name: productName || null,
                    total_favorites: next.length,
                });
                return !exists;
            },

            isFavorite: (productId: string) => {
                return get().favoriteIds.includes(String(productId));
            },

            recordRecentlyViewed: (productId: string) => {
                const cleanId = String(productId);
                if (!cleanId) return;
                const prev = get().recentlyViewedIds.filter((id) => id !== cleanId);
                set({ recentlyViewedIds: [cleanId, ...prev].slice(0, 10) });
            },

            clearFavorites: () => set({ favoriteIds: [] }),
        }),
        {
            name: 'jdenis-customer-loyalty',
        }
    )
);
