/**
 * Sistema de Telemetría Tridimensional JDennis (analytics_events)
 * Dimensión A: Visitante Web y Embudo E-Commerce (incluye detección de Bots IA y Core Web Vitals)
 * Dimensión B: Cliente con App Instalada (PWA / Standalone) y Recompra
 * Dimensión C: Operación Interna de Empleados (Cotizador, Pedidos, Tiempos de Tarea y Fricción Operativa)
 */
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export type UserRoleTelemetry = 'visitor' | 'client' | 'employee' | 'admin';
export type AppContextTelemetry = 'web' | 'pwa_standalone' | 'internal_ops';
export type EventCategoryTelemetry =
    | 'navigation'
    | 'ecommerce'
    | 'ux_friction'
    | 'pwa'
    | 'operations'
    | 'performance'
    | 'seo_geo';

export interface TelemetryEventPayload {
    event_name: string;
    event_category: EventCategoryTelemetry;
    path?: string;
    duration_ms?: number;
    scroll_pct?: number;
    element_tag?: string;
    element_id?: string;
    element_text?: string;
    metadata?: Record<string, unknown>;
}

const SESSION_KEY = 'jdennis_telemetry_session_id';
const VISITOR_KEY = 'jdennis_telemetry_visitor_id';
const UTM_KEY = 'jdennis_telemetry_utms';

function generateUuid(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function getSessionId(): string {
    try {
        let sid = sessionStorage.getItem(SESSION_KEY);
        if (!sid) {
            sid = generateUuid();
            sessionStorage.setItem(SESSION_KEY, sid);
        }
        return sid;
    } catch {
        return generateUuid();
    }
}

export function getVisitorId(): string {
    try {
        let vid = localStorage.getItem(VISITOR_KEY);
        if (!vid) {
            vid = generateUuid();
            localStorage.setItem(VISITOR_KEY, vid);
        }
        return vid;
    } catch {
        return generateUuid();
    }
}

export function isPWAStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    return (
        window.matchMedia('(display-mode: standalone)').matches ||
        ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
    );
}

export function detectBot(ua: string): { is_bot: boolean; bot_name: string | null; bot_category: string | null } {
    const lower = ua.toLowerCase();
    const bots: Array<{ pattern: RegExp; name: string; category: string }> = [
        { pattern: /gptbot/i, name: 'GPTBot', category: 'ai_crawler' },
        { pattern: /oai-searchbot/i, name: 'OAI-SearchBot', category: 'ai_search' },
        { pattern: /chatgpt-user/i, name: 'ChatGPT-User', category: 'ai_assistant' },
        { pattern: /claudebot|anthropic-ai/i, name: 'ClaudeBot', category: 'ai_crawler' },
        { pattern: /perplexitybot/i, name: 'PerplexityBot', category: 'ai_search' },
        { pattern: /google-extended/i, name: 'Google-Extended', category: 'ai_crawler' },
        { pattern: /applebot-extended/i, name: 'Applebot-Extended', category: 'ai_crawler' },
        { pattern: /googlebot/i, name: 'Googlebot', category: 'search_engine' },
        { pattern: /bingbot/i, name: 'Bingbot', category: 'search_engine' },
        { pattern: /meta-externalagent|facebookexternalhit/i, name: 'MetaBot', category: 'social_ai' },
        { pattern: /bytespider/i, name: 'Bytespider', category: 'ai_crawler' },
        { pattern: /bot|crawler|spider|headlesschrome/i, name: 'GenericBot', category: 'crawler' },
    ];
    for (const b of bots) {
        if (b.pattern.test(lower)) {
            return { is_bot: true, bot_name: b.name, bot_category: b.category };
        }
    }
    return { is_bot: false, bot_name: null, bot_category: null };
}

export function getDeviceType(): string {
    if (typeof window === 'undefined') return 'desktop';
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
}

export function getUtmParams(): { utm_source: string | null; utm_medium: string | null; utm_campaign: string | null } {
    if (typeof window === 'undefined') return { utm_source: null, utm_medium: null, utm_campaign: null };
    try {
        const params = new URLSearchParams(window.location.search);
        const s = params.get('utm_source');
        const m = params.get('utm_medium');
        const c = params.get('utm_campaign');
        if (s || m || c) {
            const data = { utm_source: s, utm_medium: m, utm_campaign: c };
            sessionStorage.setItem(UTM_KEY, JSON.stringify(data));
            return data;
        }
        const saved = sessionStorage.getItem(UTM_KEY);
        if (saved) return JSON.parse(saved);
    } catch {
        // ignore
    }
    return { utm_source: null, utm_medium: null, utm_campaign: null };
}

export function resolveUserRoleAndContext(pathname: string): {
    user_id: string | null;
    user_role: UserRoleTelemetry;
    app_context: AppContextTelemetry;
    raw_role: string | null;
} {
    const authState = useAuthStore.getState();
    const user = authState.user;
    const rawRole = (user?.role || '').toUpperCase();

    let user_role: UserRoleTelemetry = 'visitor';
    if (user) {
        if (rawRole === 'ADMIN') user_role = 'admin';
        else if (['EJECUTIVO', 'FABRICA', 'ALMACEN_MATERIA_PRIMA', 'ALMACEN_PRODUCTO_FINAL', 'TRANSPORTISTA'].includes(rawRole)) {
            user_role = 'employee';
        } else {
            user_role = 'client';
        }
    }

    let app_context: AppContextTelemetry = 'web';
    if (pathname.startsWith('/admin') || user_role === 'employee' || (user_role === 'admin' && pathname.startsWith('/admin'))) {
        app_context = 'internal_ops';
    } else if (isPWAStandalone()) {
        app_context = 'pwa_standalone';
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validUserId = user?.id && uuidRegex.test(user.id) ? user.id : null;

    return {
        user_id: validUserId,
        user_role,
        app_context,
        raw_role: rawRole || null,
    };
}

// Non-blocking batch queue
let eventQueue: Record<string, unknown>[] = [];
let flushTimeout: ReturnType<typeof setTimeout> | null = null;

async function flushQueue() {
    if (eventQueue.length === 0) return;
    const batch = [...eventQueue];
    eventQueue = [];
    flushTimeout = null;

    try {
        await supabase.from('analytics_events').insert(batch);
    } catch {
        // Silent fail — telemetry must never break user experience
    }
}

export function trackEvent(payload: TelemetryEventPayload): void;
export function trackEvent(
    event_name: string,
    event_category: EventCategoryTelemetry,
    metadata?: Record<string, unknown>,
    duration_ms?: number
): void;
export function trackEvent(
    arg1: TelemetryEventPayload | string,
    arg2?: EventCategoryTelemetry,
    arg3?: Record<string, unknown>,
    arg4?: number
): void {
    if (typeof window === 'undefined') return;

    const payload: TelemetryEventPayload =
        typeof arg1 === 'string'
            ? {
                  event_name: arg1,
                  event_category: arg2 || 'navigation',
                  metadata: arg3,
                  duration_ms: arg4,
              }
            : arg1;

    try {
        const pathname = payload.path || window.location.pathname + window.location.search;
        const { user_id, user_role, app_context, raw_role } = resolveUserRoleAndContext(window.location.pathname);
        const utms = getUtmParams();
        const botInfo = detectBot(navigator.userAgent || '');

        const record = {
            session_id: getSessionId(),
            visitor_id: getVisitorId(),
            user_id,
            user_role,
            app_context,
            event_name: payload.event_name,
            event_category: payload.event_category,
            path: pathname,
            referrer: document.referrer || null,
            utm_source: utms.utm_source,
            utm_medium: utms.utm_medium,
            utm_campaign: utms.utm_campaign,
            device_type: getDeviceType(),
            viewport_w: window.innerWidth || 0,
            viewport_h: window.innerHeight || 0,
            is_pwa: isPWAStandalone(),
            is_bot: botInfo.is_bot,
            bot_name: botInfo.bot_name,
            bot_category: botInfo.bot_category,
            duration_ms: payload.duration_ms != null ? Math.round(payload.duration_ms) : null,
            scroll_depth: payload.scroll_pct != null ? Math.round(payload.scroll_pct) : null,
            scroll_pct: payload.scroll_pct != null ? Math.round(payload.scroll_pct) : null,
            element_tag: payload.element_tag ? payload.element_tag.slice(0, 64) : null,
            element_id: payload.element_id ? payload.element_id.slice(0, 120) : null,
            element_text: payload.element_text ? payload.element_text.slice(0, 200) : null,
            metadata: {
                ...(payload.metadata || {}),
                ...(raw_role ? { erp_role: raw_role } : {}),
            },
        };

        eventQueue.push(record);

        const immediateEvents = [
            'purchase_complete',
            'payment_error',
            'payment_attempt',
            'checkout_start',
            'quote_flow_saved',
            'quote_save_error',
            'order_flow_saved',
            'pwa_installed',
            'page_leave',
        ];

        if (immediateEvents.includes(payload.event_name) || eventQueue.length >= 10) {
            flushQueue();
        } else if (!flushTimeout) {
            flushTimeout = setTimeout(flushQueue, 2000);
        }
    } catch {
        // Silent fail
    }
}

export async function withOperationalTelemetry<T>(
    operationName: string,
    fn: () => Promise<T>,
    extraMeta?: Record<string, unknown>
): Promise<T> {
    const start = performance.now();
    try {
        const result = await fn();
        const elapsed = Math.round(performance.now() - start);
        if (elapsed > 1500) {
            trackEvent({
                event_name: 'api_latency_or_error',
                event_category: 'operations',
                duration_ms: elapsed,
                metadata: {
                    operation: operationName,
                    status: 'slow_ok',
                    latency_ms: elapsed,
                    ...extraMeta,
                },
            });
        }
        return result;
    } catch (err: unknown) {
        const elapsed = Math.round(performance.now() - start);
        const errorMsg = err instanceof Error ? err.message : String(err);
        trackEvent({
            event_name: 'api_latency_or_error',
            event_category: 'operations',
            duration_ms: elapsed,
            metadata: {
                operation: operationName,
                status: 'error',
                error_message: errorMsg,
                latency_ms: elapsed,
                ...extraMeta,
            },
        });
        throw err;
    }
}

let cwvInitialized = false;
export function initCoreWebVitalsTelemetry(): void {
    if (typeof window === 'undefined' || cwvInitialized || !('PerformanceObserver' in window)) return;
    cwvInitialized = true;

    // 1. TTFB
    try {
        const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navEntries && navEntries.length > 0) {
            const ttfb = Math.round(navEntries[0].responseStart - navEntries[0].requestStart);
            if (ttfb >= 0 && ttfb < 60000) {
                trackEvent({
                    event_name: 'cwv_metric',
                    event_category: 'performance',
                    duration_ms: ttfb,
                    metadata: { metric: 'TTFB', value: ttfb, rating: ttfb < 800 ? 'good' : ttfb < 1800 ? 'needs-improvement' : 'poor' },
                });
            }
        }
    } catch {
        // ignore
    }

    // 2. LCP
    try {
        let lcpValue = 0;
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            if (lastEntry) {
                lcpValue = Math.round(lastEntry.startTime);
            }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

        const reportLcp = () => {
            if (lcpValue > 0) {
                trackEvent({
                    event_name: 'cwv_metric',
                    event_category: 'performance',
                    duration_ms: lcpValue,
                    metadata: {
                        metric: 'LCP',
                        value: lcpValue,
                        rating: lcpValue <= 2500 ? 'good' : lcpValue <= 4000 ? 'needs-improvement' : 'poor',
                    },
                });
                lcpValue = 0;
                lcpObserver.disconnect();
            }
        };
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') reportLcp();
        }, { once: true });
        setTimeout(reportLcp, 6000);
    } catch {
        // ignore
    }

    // 3. CLS
    try {
        let clsValue = 0;
        let clsReported = false;
        const clsObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries() as unknown as Array<{ hadRecentInput?: boolean; value?: number }>) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value || 0;
                }
            }
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });

        const reportCls = () => {
            if (clsReported) return;
            clsReported = true;
            const roundedCls = Number(clsValue.toFixed(4));
            trackEvent({
                event_name: 'cwv_metric',
                event_category: 'performance',
                metadata: {
                    metric: 'CLS',
                    value: roundedCls,
                    rating: roundedCls <= 0.1 ? 'good' : roundedCls <= 0.25 ? 'needs-improvement' : 'poor',
                },
            });
            clsObserver.disconnect();
        };
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') reportCls();
        }, { once: true });
        setTimeout(reportCls, 8000);
    } catch {
        // ignore
    }

    // 4. INP / Event Timing
    try {
        let maxInp = 0;
        let inpReported = false;
        const inpObserver = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries() as unknown as Array<{ duration: number }>) {
                if (entry.duration > maxInp) {
                    maxInp = Math.round(entry.duration);
                }
            }
        });
        inpObserver.observe({ type: 'event', buffered: true } as PerformanceObserverInit);

        const reportInp = () => {
            if (inpReported || maxInp === 0) return;
            inpReported = true;
            trackEvent({
                event_name: 'cwv_metric',
                event_category: 'performance',
                duration_ms: maxInp,
                metadata: {
                    metric: 'INP',
                    value: maxInp,
                    rating: maxInp <= 200 ? 'good' : maxInp <= 500 ? 'needs-improvement' : 'poor',
                },
            });
            inpObserver.disconnect();
        };
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') reportInp();
        });
    } catch {
        // ignore
    }
}
