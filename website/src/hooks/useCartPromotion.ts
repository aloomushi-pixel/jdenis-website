import { useMemo, useEffect, useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { getActiveCartPromoConfig } from '../lib/supabase';

export const PROMO_CONFIG_DEFAULTS = {
    minAmount: 2000,
    minItems: 0,
    mode: 'OR' as 'OR' | 'AND',
    discountPercent: 0,
    freeShipping: true,
    standardShippingCost: 200,
    activationMessage:
        '¡Excelente! Tu compra supera los $2,000 MXN y acabamos de activar Envío Gratis en tu carrito 🎉',
    deactivationMessage:
        'El envío gratis se ha retirado porque tu carrito ya no alcanza los $2,000 MXN.',
    progressLabel: 'Agrega $${remaining} MXN más para desbloquear Envío Gratis 🚚',
};

export const PROMO_CONFIG = PROMO_CONFIG_DEFAULTS;

interface ResolvedConfig {
    minAmount: number;
    minItems: number;
    mode: 'OR' | 'AND';
    discountPercent: number;
    freeShipping: boolean;
    standardShippingCost: number;
    activationMessage: string;
    deactivationMessage: string;
    progressLabel: string;
}

let _cachedConfig: ResolvedConfig | null = null;
let _fetchPromise: Promise<void> | null = null;

function mapDbToConfig(db: Awaited<ReturnType<typeof getActiveCartPromoConfig>>): ResolvedConfig {
    if (!db) return { ...PROMO_CONFIG_DEFAULTS };
    return {
        minAmount: Number(db.min_amount) || 0,
        minItems: Number(db.min_items) || 0,
        mode: (db.eval_mode === 'AND' ? 'AND' : 'OR'),
        discountPercent: Number(db.discount_percent) || 0,
        freeShipping: Boolean(db.free_shipping),
        standardShippingCost: Number(db.standard_shipping_cost) || 200,
        activationMessage: db.activation_message || PROMO_CONFIG_DEFAULTS.activationMessage,
        deactivationMessage: db.deactivation_message || PROMO_CONFIG_DEFAULTS.deactivationMessage,
        progressLabel: db.progress_label || PROMO_CONFIG_DEFAULTS.progressLabel,
    };
}

function fetchConfigOnce() {
    if (_fetchPromise) return _fetchPromise;
    _fetchPromise = getActiveCartPromoConfig()
        .then((db) => { _cachedConfig = mapDbToConfig(db); })
        .catch(() => { _cachedConfig = { ...PROMO_CONFIG_DEFAULTS }; });
    return _fetchPromise;
}

fetchConfigOnce();

export interface CartPromotion {
    isActive: boolean;
    discountPercent: number;
    discountAmount: number;
    shippingCost: number;
    subtotal: number;
    subtotalWithDiscount: number;
    grandTotal: number;
    itemCount: number;
    promoMessage: string;
    progressText: string | null;
    progressPercent: number;
    isFreeShipping: boolean;
}

export function useCartPromotion(): CartPromotion {
    const items = useCartStore((s) => s.items);
    const userRole = useAuthStore((s) => s.user?.role);

    const [config, setConfig] = useState<ResolvedConfig>(_cachedConfig || { ...PROMO_CONFIG_DEFAULTS });

    useEffect(() => {
        let isMounted = true;
        if (_cachedConfig) {
            setTimeout(() => { if (isMounted) setConfig(_cachedConfig as ResolvedConfig); }, 0);
        } else {
            fetchConfigOnce().then(() => {
                if (isMounted && _cachedConfig) setConfig(_cachedConfig);
            });
        }
        return () => { isMounted = false; };
    }, []);

    return useMemo(() => {
        const subtotal = items.reduce((sum, item) => {
            const isDistributor = userRole === 'DISTRIBUIDOR';
            const activePrice = isDistributor && item.distributorPrice ? item.distributorPrice : item.price;
            return sum + activePrice * item.quantity;
        }, 0);
        const count = items.reduce((sum, item) => sum + item.quantity, 0);

        const meetsAmount = config.minAmount > 0 && subtotal >= config.minAmount;
        const meetsItems = config.minItems > 0 && count >= config.minItems;

        let isActive = false;
        const enabledConditions: boolean[] = [];

        if (config.minAmount > 0) enabledConditions.push(meetsAmount);
        if (config.minItems > 0) enabledConditions.push(meetsItems);

        if (userRole === 'DISTRIBUIDOR') {
            isActive = false;
        } else if (enabledConditions.length === 0) {
            isActive = false;
        } else if (config.mode === 'AND') {
            isActive = enabledConditions.every(Boolean);
        } else {
            isActive = enabledConditions.some(Boolean);
        }

        const discountPercent = isActive ? config.discountPercent : 0;
        const discountAmount = subtotal * (discountPercent / 100);
        const subtotalWithDiscount = subtotal - discountAmount;
        const isFreeShipping = isActive && config.freeShipping;
        const shippingCost = isFreeShipping ? 0 : config.standardShippingCost;
        const grandTotal = subtotalWithDiscount + shippingCost;

        let progressText: string | null = null;
        let progressPercent = 0;

        if (!isActive && config.minAmount > 0) {
            const remaining = config.minAmount - subtotal;
            if (remaining > 0 && subtotal > 0) {
                progressText = config.progressLabel.replace(
                    '${remaining}',
                    remaining.toLocaleString('es-MX'),
                );
                progressPercent = Math.min((subtotal / config.minAmount) * 100, 99);
            }
        } else if (isActive) {
            progressPercent = 100;
        }

        const promoMessage = isActive
            ? config.activationMessage
            : config.deactivationMessage;

        return {
            isActive,
            discountPercent,
            discountAmount,
            shippingCost,
            subtotal,
            subtotalWithDiscount,
            grandTotal,
            itemCount: count,
            promoMessage,
            progressText,
            progressPercent,
            isFreeShipping,
        };
    }, [items, config, userRole]);
}
