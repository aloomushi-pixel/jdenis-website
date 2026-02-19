import { useMemo } from 'react';
import { useCartStore } from '../store/cartStore';

/**
 * ═══════════════════════════════════════════════════════════
 *  CONFIGURACIÓN DE PROMOCIONES DEL CARRITO
 *  ─────────────────────────────────────────────────────────
 *  Modifica estos valores para cambiar las reglas de negocio.
 *  No se necesita tocar ningún otro archivo.
 * ═══════════════════════════════════════════════════════════
 */
export const PROMO_CONFIG = {
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
    progressLabel: (remaining: number) =>
        `Agrega $${remaining.toLocaleString()} MXN más para desbloquear Envío Gratis 🚚`,
};

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
 * Se recalcula automáticamente cuando cambia el estado del carrito.
 */
export function useCartPromotion(): CartPromotion {
    const items = useCartStore((s) => s.items);
    const total = useCartStore((s) => s.total);
    const itemCount = useCartStore((s) => s.itemCount);

    return useMemo(() => {
        const subtotal = total();
        const count = itemCount();
        const config = PROMO_CONFIG;

        // --- Evaluar condiciones ---
        const meetsAmount = config.minAmount > 0 && subtotal >= config.minAmount;
        const meetsItems = config.minItems > 0 && count >= config.minItems;

        let isActive = false;
        const enabledConditions: boolean[] = [];

        if (config.minAmount > 0) enabledConditions.push(meetsAmount);
        if (config.minItems > 0) enabledConditions.push(meetsItems);

        if (enabledConditions.length === 0) {
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
                progressText = config.progressLabel(remaining);
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
    }, [items, total, itemCount]);
}
