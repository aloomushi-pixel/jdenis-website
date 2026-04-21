import { useMemo, useEffect, useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { getActiveCartPromoConfig } from '../lib/supabase';

/**
 * ═══════════════════════════════════════════════════════════
 *  CONFIGURACIÓN DE PROMOCIONES DEL CARRITO
 *  ─────────────────────────────────────────────────────────
 *  Estos valores son los FALLBACK por defecto.
 *  La configuración real se carga desde Supabase (tabla cart_promo_config)
 *  y se puede editar desde /admin/cart-promos.
 * ═══════════════════════════════════════════════════════════
 */
export const PROMO_CONFIG_DEFAULTS = {
    /** Monto mínimo en MXN para activar la promoción (0 = deshabilitado) */
    minAmount: 2000,

    /** Cantidad mínima de artículos para activar la promoción (0 = deshabilitado) */
    minItems: 0,

    /**
     * Modo de evaluación:
     *  - 'OR'  → se activa si cumple CUALQUIER condición habilitada
     *  - 'AND' → se activa solo si cumple TODAS las condiciones habilitadas
     */
    mode: 'OR' as 'OR' | 'AND',

    /** Porcentaje de descuento sobre el subtotal (0 = sin descuento) */
    discountPercent: 0,

    /** Si es true, el envío se vuelve gratis cuando la promoción está activa */
    freeShipping: true,

    /** Costo de envío estándar en MXN (cuando NO hay promo) */
    standardShippingCost: 200,

    /** Mensaje que se muestra cuando la promo se ACTIVA */
    activationMessage:
        '¡Excelente! Tu compra supera los $2,000 MXN y acabamos de activar Envío Gratis en tu carrito 🎉',

    /** Mensaje que se muestra cuando la promo se DESACTIVA */
    deactivationMessage:
        'El envío gratis se ha retirado porque tu carrito ya no alcanza los $2,000 MXN.',

    /** Texto corto para mostrar el progreso */
    progressLabel: 'Agrega $${remaining} MXN más para desbloquear Envío Gratis 🚚',
};

/** Keep backward compat — alias for code that still references PROMO_CONFIG */
export const PROMO_CONFIG = PROMO_CONFIG_DEFAULTS;

// ─── Internal: resolved config shape ──────────────────────
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

// ─── Module-level cache (shared across all hook consumers) ─
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

// Kick off fetch immediately on module load (non-blocking)
fetchConfigOnce();

// ─── Public interface ─────────────────────────────────────

export interface CartPromotion {
    /** Si la promoción está activa en este momento */
    isActive: boolean;
    /** Porcentaje de descuento aplicado (0 si no aplica) */
    discountPercent: number;
    /** Monto del descuento en MXN */
    discountAmount: number;
    /** Costo de envío (0 si envío gratis) */
    shippingCost: number;
    /** Subtotal del carrito SIN descuento */
    subtotal: number;
    /** Subtotal CON descuento aplicado */
    subtotalWithDiscount: number;
    /** Total final (subtotal con descuento + envío) */
    grandTotal: number;
    /** Cantidad total de artículos */
    itemCount: number;
    /** Mensaje de promoción actual */
    promoMessage: string;
    /** Texto de progreso (cuánto falta) */
    progressText: string | null;
    /** Progreso como porcentaje 0-100 */
    progressPercent: number;
    /** Si el envío es gratis */
    isFreeShipping: boolean;
}

/**
 * Hook reactivo que evalúa las reglas de promoción del carrito.
 * Carga la configuración desde Supabase (con fallback a valores por defecto).
 * Se recalcula automáticamente cuando cambia el estado del carrito.
 */
export function useCartPromotion(): CartPromotion {
    const items = useCartStore((s) => s.items);
    const userRole = useAuthStore((s) => s.user?.role);

    // Trigger re-render when async config arrives
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

        // --- Evaluar condiciones ---
        const meetsAmount = config.minAmount > 0 && subtotal >= config.minAmount;
        const meetsItems = config.minItems > 0 && count >= config.minItems;

        let isActive = false;
        const enabledConditions: boolean[] = [];

        if (config.minAmount > 0) enabledConditions.push(meetsAmount);
        if (config.minItems > 0) enabledConditions.push(meetsItems);

        if (userRole === 'DISTRIBUIDOR') {
            isActive = false; // Distribuidores no aplican para promociones
        } else if (enabledConditions.length === 0) {
            isActive = false;
        } else if (config.mode === 'AND') {
            isActive = enabledConditions.every(Boolean);
        } else {
            isActive = enabledConditions.some(Boolean);
        }

        // --- Calcular beneficios ---
        const discountPercent = isActive ? config.discountPercent : 0;
        const discountAmount = subtotal * (discountPercent / 100);
        const subtotalWithDiscount = subtotal - discountAmount;
        const isFreeShipping = isActive && config.freeShipping;
        const shippingCost = isFreeShipping ? 0 : config.standardShippingCost;
        const grandTotal = subtotalWithDiscount + shippingCost;

        // --- Progreso ---
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

        // --- Mensaje ---
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
    }, [items, config]);
}
