import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initCoreWebVitalsTelemetry, isPWAStandalone, trackEvent } from '../utils/telemetry';

interface ClickPoint {
    x: number;
    y: number;
    t: number;
}

export default function TelemetryProvider() {
    const location = useLocation();
    const activeTimeRef = useRef<number>(0);
    const hiddenTimeRef = useRef<number>(0);
    const lastActiveStartRef = useRef<number>(0);
    const lastHiddenStartRef = useRef<number | null>(null);
    const maxScrollRef = useRef<number>(0);
    const maxScrollPxRef = useRef<number>(0);
    const scrollReturnReportedRef = useRef<boolean>(false);
    const scrollMilestonesRef = useRef<Set<number>>(new Set());
    const currentPathRef = useRef<string>(location.pathname + location.search);
    const clicksRef = useRef<ClickPoint[]>([]);
    const lastModifiedFieldRef = useRef<{ formId: string; fieldName: string; path: string } | null>(null);
    const formSubmittedRef = useRef<boolean>(false);
    const reportedJsErrorsRef = useRef<Set<string>>(new Set());
    const reportedTouchTargetsRef = useRef<Set<string>>(new Set());
    const auditedSeoPathsRef = useRef<Set<string>>(new Set());

    // 1. Initialize Core Web Vitals, Silent JS Exception Monitors & PWA session tracking on mount
    useEffect(() => {
        initCoreWebVitalsTelemetry();

        const handleError = (ev: ErrorEvent) => {
            const msg = String(ev.message || 'Unknown JS Error').slice(0, 180);
            if (/ResizeObserver loop|Script error\.?$/i.test(msg)) return;
            if (reportedJsErrorsRef.current.has(msg) || reportedJsErrorsRef.current.size >= 8) return;
            reportedJsErrorsRef.current.add(msg);
            trackEvent({
                event_name: 'js_exception',
                event_category: 'ux_friction',
                metadata: {
                    message: msg,
                    filename: ev.filename ? ev.filename.slice(-120) : null,
                    lineno: ev.lineno || null,
                    colno: ev.colno || null,
                },
            });
        };

        const handleRejection = (ev: PromiseRejectionEvent) => {
            const rawReason = ev.reason instanceof Error ? ev.reason.message : String(ev.reason || 'Unhandled Rejection');
            const msg = rawReason.slice(0, 180);
            if (/AbortError|Failed to fetch|NetworkError/i.test(msg)) return;
            if (reportedJsErrorsRef.current.has(msg) || reportedJsErrorsRef.current.size >= 8) return;
            reportedJsErrorsRef.current.add(msg);
            trackEvent({
                event_name: 'unhandled_rejection',
                event_category: 'ux_friction',
                metadata: { message: msg },
            });
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);

        if (isPWAStandalone()) {
            const pwaSessionTracked = sessionStorage.getItem('jdennis_pwa_session_tracked');
            if (!pwaSessionTracked) {
                sessionStorage.setItem('jdennis_pwa_session_tracked', '1');
                trackEvent({
                    event_name: 'pwa_session_start',
                    event_category: 'pwa',
                    metadata: {
                        display_mode: 'standalone',
                        user_agent: navigator.userAgent,
                    },
                });
            }
        }

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);

    // 2. Track page_view and page_leave (active time + max scroll) on route change
    useEffect(() => {
        const newFullPath = location.pathname + location.search;
        const prevPath = currentPathRef.current;

        // If leaving previous page, emit page_leave + check form_abandon
        if (prevPath && prevPath !== newFullPath) {
            if (document.visibilityState === 'visible') {
                activeTimeRef.current += Date.now() - lastActiveStartRef.current;
            } else if (lastHiddenStartRef.current) {
                hiddenTimeRef.current += Date.now() - lastHiddenStartRef.current;
            }
            if (activeTimeRef.current > 200) {
                trackEvent({
                    event_name: 'page_leave',
                    event_category: 'navigation',
                    path: prevPath,
                    duration_ms: activeTimeRef.current,
                    scroll_pct: maxScrollRef.current,
                    metadata: {
                        next_path: newFullPath,
                        active_time_ms: activeTimeRef.current,
                        hidden_time_ms: hiddenTimeRef.current,
                    },
                });
            }

            if (lastModifiedFieldRef.current && !formSubmittedRef.current) {
                trackEvent({
                    event_name: 'form_abandon',
                    event_category: 'ux_friction',
                    path: lastModifiedFieldRef.current.path,
                    element_id: lastModifiedFieldRef.current.formId,
                    metadata: {
                        last_field: lastModifiedFieldRef.current.fieldName,
                        abandoned_on_route_change_to: newFullPath,
                    },
                });
            }
        }

        // Reset counters for new page
        currentPathRef.current = newFullPath;
        activeTimeRef.current = 0;
        hiddenTimeRef.current = 0;
        lastActiveStartRef.current = Date.now();
        lastHiddenStartRef.current = null;
        maxScrollRef.current = 0;
        maxScrollPxRef.current = 0;
        scrollReturnReportedRef.current = false;
        scrollMilestonesRef.current.clear();
        lastModifiedFieldRef.current = null;
        formSubmittedRef.current = false;

        // Emit page_view after 120ms so child route usePageMeta updates document.title first
        const timer = setTimeout(() => {
            trackEvent({
                event_name: 'page_view',
                event_category: 'navigation',
                path: newFullPath,
                metadata: {
                    title: document.title,
                },
            });

            // Silent SEO & Hydration Parity Monitor (Prompt Maestro v4.0) on public routes
            if (
                !location.pathname.startsWith('/admin') &&
                !location.pathname.startsWith('/mi-cuenta') &&
                !auditedSeoPathsRef.current.has(location.pathname)
            ) {
                auditedSeoPathsRef.current.add(location.pathname);
                const titleLen = (document.title || '').length;
                const descEl = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
                const descLen = (descEl?.content || '').length;
                const rootEl = document.getElementById('root');
                const rootEmpty = !rootEl || rootEl.children.length === 0;
                if (titleLen > 64 || descLen > 165 || rootEmpty) {
                    trackEvent({
                        event_name: 'seo_hydration_audit',
                        event_category: 'seo_geo',
                        path: newFullPath,
                        metadata: {
                            title_len: titleLen,
                            desc_len: descLen,
                            root_empty: rootEmpty,
                            title_sample: (document.title || '').slice(0, 80),
                        },
                    });
                }
            }
        }, 280);

        return () => clearTimeout(timer);
    }, [location.pathname, location.search]);

    // 3. Visibility change & pagehide for accurate active + hidden duration
    useEffect(() => {
        const handleVisibilityChange = () => {
            const now = Date.now();
            if (document.visibilityState === 'hidden') {
                activeTimeRef.current += now - lastActiveStartRef.current;
                lastHiddenStartRef.current = now;
            } else {
                if (lastHiddenStartRef.current) {
                    hiddenTimeRef.current += now - lastHiddenStartRef.current;
                    lastHiddenStartRef.current = null;
                }
                lastActiveStartRef.current = now;
            }
        };

        const handlePageHide = () => {
            const now = Date.now();
            if (document.visibilityState === 'visible') {
                activeTimeRef.current += now - lastActiveStartRef.current;
            } else if (lastHiddenStartRef.current) {
                hiddenTimeRef.current += now - lastHiddenStartRef.current;
            }
            if (activeTimeRef.current > 200) {
                trackEvent({
                    event_name: 'page_leave',
                    event_category: 'navigation',
                    path: currentPathRef.current,
                    duration_ms: activeTimeRef.current,
                    scroll_pct: maxScrollRef.current,
                    metadata: {
                        active_time_ms: activeTimeRef.current,
                        hidden_time_ms: hiddenTimeRef.current,
                    },
                });
            }
            if (lastModifiedFieldRef.current && !formSubmittedRef.current) {
                trackEvent({
                    event_name: 'form_abandon',
                    event_category: 'ux_friction',
                    path: lastModifiedFieldRef.current.path,
                    element_id: lastModifiedFieldRef.current.formId,
                    metadata: {
                        last_field: lastModifiedFieldRef.current.fieldName,
                        abandoned_on_unload: true,
                    },
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pagehide', handlePageHide);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pagehide', handlePageHide);
        };
    }, []);

    // 4. Scroll Depth Tracking (25%, 50%, 75%, 90%, 100%) + scroll_return_prices
    useEffect(() => {
        let ticking = false;
        const milestones = [25, 50, 75, 90, 100];

        const handleScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const docHeight = Math.max(
                    document.body.scrollHeight,
                    document.documentElement.scrollHeight
                ) - window.innerHeight;

                if (docHeight > 100) {
                    const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100));
                    if (pct > maxScrollRef.current) {
                        maxScrollRef.current = pct;
                    }
                    if (scrollTop > maxScrollPxRef.current) {
                        maxScrollPxRef.current = scrollTop;
                    } else if (
                        !scrollReturnReportedRef.current &&
                        maxScrollRef.current >= 45 &&
                        maxScrollPxRef.current - scrollTop >= 220 &&
                        (window.location.pathname.startsWith('/tienda') ||
                            window.location.pathname.startsWith('/producto') ||
                            window.location.pathname === '/')
                    ) {
                        scrollReturnReportedRef.current = true;
                        trackEvent({
                            event_name: 'scroll_return_prices',
                            event_category: 'ecommerce',
                            scroll_pct: pct,
                            metadata: {
                                peak_scroll_pct: maxScrollRef.current,
                                returned_to_pct: pct,
                            },
                        });
                    }
                    for (const m of milestones) {
                        if (pct >= m && !scrollMilestonesRef.current.has(m)) {
                            scrollMilestonesRef.current.add(m);
                            trackEvent({
                                event_name: 'scroll_depth',
                                event_category: 'navigation',
                                scroll_pct: m,
                                metadata: { milestone: m },
                            });
                        }
                    }
                }
                ticking = false;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 5. Global Click Listener: Rage Clicks, Dead Clicks, WhatsApp Clicks
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const now = Date.now();
            const x = e.clientX;
            const y = e.clientY;

            // Extract readable element metadata
            const interactiveEl = target.closest('button, a, input, select, [role="button"]') as HTMLElement | null;
            const el = interactiveEl || target;
            const tag = el.tagName.toLowerCase();
            const id = el.id || el.getAttribute('name') || undefined;
            const text = (el.textContent || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 100);

            // A) Detect WhatsApp or Wholesale links
            const anchor = target.closest('a') as HTMLAnchorElement | null;
            if (anchor && anchor.href) {
                if (anchor.href.includes('wa.me') || anchor.href.includes('whatsapp.com')) {
                    trackEvent({
                        event_name: 'whatsapp_click',
                        event_category: 'ecommerce',
                        element_tag: 'a',
                        element_text: text || 'WhatsApp',
                        metadata: { href: anchor.href },
                    });
                } else if (anchor.href.includes('/registro-distribuidor')) {
                    trackEvent({
                        event_name: 'wholesale_inquiry',
                        event_category: 'ecommerce',
                        element_tag: 'a',
                        element_text: text || 'Registro Distribuidor',
                        metadata: { href: anchor.href },
                    });
                }
            }

            // A2) Mobile Touch Ergonomics Monitor (< 44x44 px check on mobile buttons, v4.0)
            if (window.innerWidth < 768 && interactiveEl && interactiveEl.tagName.toLowerCase() === 'button') {
                const rect = interactiveEl.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0 && (rect.width < 38 || rect.height < 38)) {
                    const key = `${window.location.pathname}::${id || text.slice(0, 30)}`;
                    if (!reportedTouchTargetsRef.current.has(key) && reportedTouchTargetsRef.current.size < 10) {
                        reportedTouchTargetsRef.current.add(key);
                        trackEvent({
                            event_name: 'touch_target_violation',
                            event_category: 'ux_friction',
                            element_tag: 'button',
                            element_id: id,
                            element_text: text,
                            metadata: {
                                width_px: Math.round(rect.width),
                                height_px: Math.round(rect.height),
                                standard_min_px: 44,
                            },
                        });
                    }
                }
            }

            // B) Rage Click Detection: 3+ clicks in < 800ms within 40px radius (skip intentional quantity steppers)
            if (el.closest('[data-qty-stepper="true"]')) {
                return;
            }
            const recentClicks = clicksRef.current.filter((c) => now - c.t < 800);
            recentClicks.push({ x, y, t: now });
            clicksRef.current = recentClicks;

            const nearbyClicks = recentClicks.filter(
                (c) => Math.hypot(c.x - x, c.y - y) <= 40
            );

            if (nearbyClicks.length >= 3) {
                clicksRef.current = []; // reset to avoid duplicate firing
                const isInternal = window.location.pathname.startsWith('/admin');
                trackEvent({
                    event_name: 'rage_click',
                    event_category: isInternal ? 'operations' : 'ux_friction',
                    element_tag: tag,
                    element_id: id,
                    element_text: text,
                    metadata: {
                        clicks_count: nearbyClicks.length,
                        x,
                        y,
                        is_internal_ops: isInternal,
                    },
                });
                return;
            }

            // C) Dead Click Detection: element looks interactive (cursor-pointer or badge/card title) but has no link/button/input ancestor and no click handler effect
            if (!interactiveEl && !target.closest('label, summary, details, video, audio')) {
                const computed = window.getComputedStyle(target);
                const classStr = typeof target.className === 'string' ? target.className : '';
                if (
                    computed.cursor === 'pointer' &&
                    !classStr.includes('backdrop') &&
                    !classStr.includes('overlay') &&
                    text.length > 0 &&
                    text.length < 60
                ) {
                    const urlBefore = window.location.href;
                    setTimeout(() => {
                        if (window.location.href === urlBefore) {
                            trackEvent({
                                event_name: 'dead_click',
                                event_category: 'ux_friction',
                                element_tag: tag,
                                element_id: id,
                                element_text: text,
                                metadata: { cursor: computed.cursor },
                            });
                        }
                    }, 350);
                }
            }
        };

        // Form abandon tracking helpers
        const handleFocusIn = (e: FocusEvent) => {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            const tag = target.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || tag === 'select') {
                const form = target.closest('form');
                if (form) {
                    const fieldName =
                        target.getAttribute('name') ||
                        target.getAttribute('placeholder') ||
                        target.id ||
                        tag;
                    // Ignore global search bar
                    if (/busca/i.test(fieldName)) return;
                    lastModifiedFieldRef.current = {
                        formId: form.id || form.getAttribute('name') || 'form',
                        fieldName,
                        path: window.location.pathname,
                    };
                }
            }
        };

        const handleSubmit = () => {
            formSubmittedRef.current = true;
            lastModifiedFieldRef.current = null;
        };

        const handleCopy = () => {
            try {
                const selected = (window.getSelection()?.toString() || '').trim();
                if (!selected || selected.length < 2) return;
                const snippet = selected.replace(/\s+/g, ' ').slice(0, 120);
                const hasPrice = /\$\s*\d+|\d+\.\d{2}|mxn/i.test(snippet);
                trackEvent({
                    event_name: 'text_copy',
                    event_category: 'ecommerce',
                    element_text: snippet,
                    metadata: {
                        copied_length: selected.length,
                        has_price: hasPrice,
                    },
                });
            } catch {
                // ignore
            }
        };

        document.addEventListener('click', handleClick, { passive: true });
        document.addEventListener('focusin', handleFocusIn, { passive: true });
        document.addEventListener('submit', handleSubmit, { passive: true });
        document.addEventListener('copy', handleCopy, { passive: true });

        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('submit', handleSubmit);
            document.removeEventListener('copy', handleCopy);
        };
    }, []);

    return null;
}
