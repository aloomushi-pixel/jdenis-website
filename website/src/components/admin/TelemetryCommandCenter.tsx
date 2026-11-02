import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Activity,
    ShoppingBag,
    Search,
    Smartphone,
    Briefcase,
    Sparkles,
    RefreshCw,
    Copy,
    Check,
    AlertTriangle,
    CheckCircle2,
    Clock,
    TrendingUp,
    Bot,
    Zap,
    ShieldCheck,
    MousePointerClick
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AnalyticsEventRow {
    id: string;
    created_at: string;
    session_id: string;
    visitor_id: string | null;
    user_id: string | null;
    user_role: string | null;
    app_context: string | null;
    event_name: string;
    event_category: string;
    path: string;
    referrer: string | null;
    utm_source: string | null;
    device_type: string | null;
    is_pwa: boolean | null;
    is_bot: boolean | null;
    bot_name: string | null;
    duration_ms: number | null;
    scroll_depth: number | null;
    metadata: Record<string, unknown> | null;
}

interface VersionInfo {
    commitSha: string;
    shortSha?: string;
    commitMessage: string;
    builtAt: string;
    environment: string;
}

interface AgentChangelogEntry {
    cycleId: string;
    timestamp: string;
    commitSha: string;
    deployVerified: boolean;
    dimension: 'web_seo' | 'ecommerce_pwa' | 'internal_ops' | 'full_stack';
    finding: string;
    actionTaken: string;
    filesModified: string[];
    expectedImpact: string;
}

interface AutonomousEvolutionLogRow {
    id: string;
    project_name: string;
    version_tag: string;
    cycle_number: number;
    status: 'IMPLEMENTED' | 'POSTPONED' | 'ACTION_REQUIRED' | 'TEST_SYNC';
    short_summary: string | null;
    telemetry_findings: string | null;
    changes_applied: unknown;
    postponed_reason: string | null;
    human_action_required: string | null;
    commit_hash: string | null;
    deployment_uuid: string | null;
    next_timer_seconds: number | null;
    email_sent: boolean | null;
    created_at: string;
}

type DateRangeKey = '1d' | '7d' | '30d' | '90d';
type CommandTab = 'executive' | 'funnel' | 'seo_geo' | 'pwa' | 'operations' | 'ai_digest';

export default function TelemetryCommandCenter() {
    const [activeTab, setActiveTab] = useState<CommandTab>('executive');
    const [dateRange, setDateRange] = useState<DateRangeKey>('7d');
    const [events, setEvents] = useState<AnalyticsEventRow[]>([]);
    const [ordersCount, setOrdersCount] = useState(0);
    const [ordersRevenue, setOrdersRevenue] = useState(0);
    const [quotesCount, setQuotesCount] = useState(0);
    const [quotesTotal, setQuotesTotal] = useState(0);
    const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
    const [changelog, setChangelog] = useState<AgentChangelogEntry[]>([]);
    const [evolutionLogs, setEvolutionLogs] = useState<AutonomousEvolutionLogRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedDigest, setCopiedDigest] = useState(false);

    const fetchTelemetryData = useCallback(async () => {
        setLoading(true);
        try {
            const daysMap: Record<DateRangeKey, number> = { '1d': 1, '7d': 7, '30d': 30, '90d': 90 };
            const days = daysMap[dateRange];
            const sinceIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

            const [eventsRes, webOrdersRes, quotesRes, versionRes, changelogRes, evoLogsRes] = await Promise.allSettled([
                supabase
                    .from('analytics_events')
                    .select('*')
                    .gte('created_at', sinceIso)
                    .order('created_at', { ascending: false })
                    .limit(3500),
                supabase
                    .from('website_orders')
                    .select('id, total, status, payment_status, created_at')
                    .gte('created_at', sinceIso),
                supabase
                    .from('quotations')
                    .select('id, total_amount, status, created_at')
                    .gte('created_at', sinceIso),
                fetch(`/__version.json?t=${Date.now()}`, { cache: 'no-store' }).then(r => r.ok ? r.json() : null),
                fetch(`/jdennis_agent_changelog.json?t=${Date.now()}`, { cache: 'no-store' }).then(r => r.ok ? r.json() : []),
                supabase
                    .from('autonomous_evolution_logs')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(20),
            ]);

            if (eventsRes.status === 'fulfilled' && eventsRes.value.data) {
                setEvents(eventsRes.value.data as AnalyticsEventRow[]);
            }
            if (webOrdersRes.status === 'fulfilled' && webOrdersRes.value.data) {
                const ords = webOrdersRes.value.data;
                setOrdersCount(ords.length);
                setOrdersRevenue(ords.reduce((acc, o) => acc + (Number(o.total) || 0), 0));
            }
            if (quotesRes.status === 'fulfilled' && quotesRes.value.data) {
                const qts = quotesRes.value.data;
                setQuotesCount(qts.length);
                setQuotesTotal(qts.reduce((acc, q) => acc + (Number(q.total_amount) || 0), 0));
            }
            if (versionRes.status === 'fulfilled' && versionRes.value) {
                setVersionInfo(versionRes.value as VersionInfo);
            }
            if (changelogRes.status === 'fulfilled' && Array.isArray(changelogRes.value)) {
                setChangelog(changelogRes.value as AgentChangelogEntry[]);
            }
            if (evoLogsRes.status === 'fulfilled' && evoLogsRes.value.data) {
                setEvolutionLogs(evoLogsRes.value.data as AutonomousEvolutionLogRow[]);
            }
        } catch (err) {
            console.error('Error loading telemetry command center:', err);
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchTelemetryData();
    }, [fetchTelemetryData]);

    // ─── Derived 3D Analytics ────────────────────────────────────────────────
    const analytics = useMemo(() => {
        const humanEvents = events.filter(e => !e.is_bot);
        const botEvents = events.filter(e => e.is_bot || e.event_name === 'ai_or_search_bot_crawl');

        const uniqueVisitors = new Set(humanEvents.map(e => e.visitor_id || e.session_id)).size;
        const uniqueSessions = new Set(humanEvents.map(e => e.session_id)).size;
        const pwaSessions = new Set(humanEvents.filter(e => e.app_context === 'pwa_standalone' || e.is_pwa).map(e => e.session_id)).size;
        const webSessions = Math.max(0, uniqueSessions - pwaSessions);

        // Funnel counts (unique sessions per stage)
        const shopOrHomeSessions = new Set(
            humanEvents
                .filter(e => e.event_name === 'page_view' && (e.path === '/' || e.path.startsWith('/tienda') || e.path.startsWith('/producto')))
                .map(e => e.session_id)
        ).size || Math.max(1, uniqueSessions);

        const productViewEvents = humanEvents.filter(e => e.event_name === 'product_view');
        const productViewSessions = new Set(productViewEvents.map(e => e.session_id)).size;

        const addToCartEvents = humanEvents.filter(e => e.event_name === 'add_to_cart');
        const addToCartSessions = new Set(addToCartEvents.map(e => e.session_id)).size;

        const checkoutStartEvents = humanEvents.filter(e => e.event_name === 'checkout_start');
        const checkoutStartSessions = new Set(checkoutStartEvents.map(e => e.session_id)).size;

        const paymentAttemptEvents = humanEvents.filter(e => e.event_name === 'payment_attempt');
        const paymentAttemptSessions = new Set(paymentAttemptEvents.map(e => e.session_id)).size;

        const purchaseOrLeadEvents = humanEvents.filter(e =>
            e.event_name === 'purchase_complete' ||
            e.event_name === 'whatsapp_click' ||
            e.event_name === 'wholesale_inquiry'
        );
        const purchaseOrLeadSessions = new Set(purchaseOrLeadEvents.map(e => e.session_id)).size + ordersCount;

        const conversionRate = shopOrHomeSessions > 0
            ? Math.min(100, Number(((purchaseOrLeadSessions / shopOrHomeSessions) * 100).toFixed(2)))
            : 0;

        // Top Products Viewed vs Added to Cart
        const productStatsMap = new Map<string, { id: string; name: string; category: string; views: number; adds: number }>();
        productViewEvents.forEach(e => {
            const meta = e.metadata || {};
            const id = String(meta.id || e.path.replace('/producto/', '') || 'unknown');
            const name = String(meta.name || id);
            const category = String(meta.category || 'General');
            const curr = productStatsMap.get(id) || { id, name, category, views: 0, adds: 0 };
            curr.views += 1;
            productStatsMap.set(id, curr);
        });
        addToCartEvents.forEach(e => {
            const meta = e.metadata || {};
            const id = String(meta.id || 'unknown');
            const name = String(meta.name || id);
            const category = String(meta.category || 'General');
            const curr = productStatsMap.get(id) || { id, name, category, views: 0, adds: 0 };
            curr.adds += 1;
            productStatsMap.set(id, curr);
        });
        const topProducts = Array.from(productStatsMap.values())
            .sort((a, b) => (b.views + b.adds * 2) - (a.views + a.adds * 2))
            .slice(0, 10);

        // UX Friction Events
        const frictionEvents = humanEvents.filter(e =>
            e.event_name === 'rage_click' ||
            e.event_name === 'dead_click' ||
            e.event_name === 'form_abandon' ||
            e.event_name === 'payment_error'
        );

        // Search Intelligence
        const searchEvents = humanEvents.filter(e => e.event_name === 'product_search');
        const searchTermsMap = new Map<string, { query: string; count: number; zeroResultsCount: number; avgResults: number }>();
        searchEvents.forEach(e => {
            const meta = e.metadata || {};
            const q = String(meta.query || '').trim().toLowerCase();
            if (!q) return;
            const resCount = Number(meta.results_count ?? 0);
            const existing = searchTermsMap.get(q) || { query: q, count: 0, zeroResultsCount: 0, avgResults: 0 };
            existing.avgResults = Math.round(((existing.avgResults * existing.count) + resCount) / (existing.count + 1));
            existing.count += 1;
            if (resCount === 0) existing.zeroResultsCount += 1;
            searchTermsMap.set(q, existing);
        });
        const topSearches = Array.from(searchTermsMap.values()).sort((a, b) => b.count - a.count).slice(0, 12);
        const zeroResultSearches = Array.from(searchTermsMap.values())
            .filter(s => s.zeroResultsCount > 0)
            .sort((a, b) => b.zeroResultsCount - a.zeroResultsCount);

        // Core Web Vitals
        const cwvEvents = humanEvents.filter(e => e.event_name === 'cwv_metric');
        const cwvByMetric: Record<string, number[]> = { LCP: [], CLS: [], INP: [], TTFB: [] };
        cwvEvents.forEach(e => {
            const m = String(e.metadata?.metric || '');
            const v = Number(e.metadata?.value ?? e.duration_ms ?? 0);
            if (cwvByMetric[m] && !isNaN(v)) cwvByMetric[m].push(v);
        });
        const avgMetric = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : null;
        const avgLcp = avgMetric(cwvByMetric.LCP);
        const avgCls = avgMetric(cwvByMetric.CLS);
        const avgInp = avgMetric(cwvByMetric.INP);
        const avgTtfb = avgMetric(cwvByMetric.TTFB);

        // Bots breakdown
        const botCounts: Record<string, number> = {};
        botEvents.forEach(e => {
            const name = e.bot_name || String(e.metadata?.bot_name || 'Bot');
            botCounts[name] = (botCounts[name] || 0) + 1;
        });

        // PWA comparison
        const pwaPrompts = humanEvents.filter(e => e.event_name === 'pwa_prompt_shown').length;
        const pwaInstalls = humanEvents.filter(e => e.event_name === 'pwa_installed').length;
        const pwaStarts = humanEvents.filter(e => e.event_name === 'pwa_session_start').length;

        const pwaEvents = humanEvents.filter(e => e.app_context === 'pwa_standalone' || e.is_pwa);
        const webOnlyEvents = humanEvents.filter(e => e.app_context === 'web' && !e.is_pwa);

        const pwaLeaveDurations = pwaEvents.filter(e => e.event_name === 'page_leave' && e.duration_ms).map(e => Number(e.duration_ms));
        const webLeaveDurations = webOnlyEvents.filter(e => e.event_name === 'page_leave' && e.duration_ms).map(e => Number(e.duration_ms));
        const avgPwaDurationSec = pwaLeaveDurations.length > 0
            ? Math.round(pwaLeaveDurations.reduce((a, b) => a + b, 0) / pwaLeaveDurations.length / 1000)
            : 0;
        const avgWebDurationSec = webLeaveDurations.length > 0
            ? Math.round(webLeaveDurations.reduce((a, b) => a + b, 0) / webLeaveDurations.length / 1000)
            : 0;

        // Dimension 3: Internal Operations (Employees & Quoter)
        const quoteSavedEvents = humanEvents.filter(e => e.event_name === 'quote_flow_saved');
        const quoteErrorEvents = humanEvents.filter(e => e.event_name === 'quote_save_error');
        const orderSavedEvents = humanEvents.filter(e => e.event_name === 'order_flow_saved');
        const apiLatencyEvents = humanEvents.filter(e => e.event_name === 'api_latency_or_error');
        const internalRageClicks = humanEvents.filter(e => e.app_context === 'internal_ops' && e.event_name === 'rage_click');

        const avgQuoteDurationSec = quoteSavedEvents.length > 0
            ? Math.round(quoteSavedEvents.reduce((a, e) => a + (Number(e.duration_ms || e.metadata?.duration_ms || 0)), 0) / quoteSavedEvents.length / 1000)
            : 0;
        const avgQuoteClicks = quoteSavedEvents.length > 0
            ? Math.round(quoteSavedEvents.reduce((a, e) => a + (Number(e.metadata?.clicks_count || 0)), 0) / quoteSavedEvents.length)
            : 0;

        // Global Health Score (0-100)
        let healthScore = 88;
        if (avgLcp && avgLcp > 3000) healthScore -= 8;
        if (avgCls && avgCls > 0.1) healthScore -= 8;
        if (quoteErrorEvents.length > 0) healthScore -= Math.min(15, quoteErrorEvents.length * 5);
        if (apiLatencyEvents.length > 3) healthScore -= 6;
        if (frictionEvents.length > 10) healthScore -= 5;
        healthScore = Math.max(40, Math.min(100, healthScore));

        return {
            uniqueVisitors,
            uniqueSessions,
            pwaSessions,
            webSessions,
            shopOrHomeSessions,
            productViewSessions,
            addToCartSessions,
            checkoutStartSessions,
            paymentAttemptSessions,
            purchaseOrLeadSessions,
            conversionRate,
            topProducts,
            frictionEvents,
            topSearches,
            zeroResultSearches,
            avgLcp,
            avgCls,
            avgInp,
            avgTtfb,
            botCounts,
            pwaPrompts,
            pwaInstalls,
            pwaStarts,
            avgPwaDurationSec,
            avgWebDurationSec,
            quoteSavedEvents,
            quoteErrorEvents,
            orderSavedEvents,
            apiLatencyEvents,
            internalRageClicks,
            avgQuoteDurationSec,
            avgQuoteClicks,
            healthScore,
        };
    }, [events, ordersCount]);

    // ─── AI Optimization Prompt Digest Generator ────────────────────────────
    const aiPromptDigest = useMemo(() => {
        const zeroSearchesList = analytics.zeroResultSearches.length > 0
            ? analytics.zeroResultSearches.map(s => `- "${s.query}" (${s.zeroResultsCount} búsquedas sin resultados)`).join('\n')
            : '- Ninguna búsqueda con 0 resultados registrada en el periodo.';

        const frictionList = analytics.frictionEvents.length > 0
            ? analytics.frictionEvents.slice(0, 8).map(f => `- [${f.event_name}] en \`${f.path}\` (${JSON.stringify(f.metadata || {})})`).join('\n')
            : '- 0 eventos críticos de fricción UX detectados en el periodo.';

        const opsIssuesList = (analytics.quoteErrorEvents.length + analytics.apiLatencyEvents.length) > 0
            ? [
                ...analytics.quoteErrorEvents.slice(0, 5).map(e => `- [quote_save_error] en \`${e.path}\`: ${JSON.stringify(e.metadata)}`),
                ...analytics.apiLatencyEvents.slice(0, 5).map(e => `- [api_latency_or_error] (${e.duration_ms}ms) en \`${e.path}\`: ${JSON.stringify(e.metadata)}`)
            ].join('\n')
            : '- 0 errores de guardado en Cotizador B2B ni cuellos de botella de API (>1500ms).';

        return `# 📊 J. DENNIS — AI OPTIMIZATION PROMPT DIGEST (${dateRange.toUpperCase()})
Generado: ${new Date().toISOString()}
Versión Desplegada (Dokploy): \`${versionInfo?.commitSha || 'local'}\` (${versionInfo?.builtAt || 'N/A'})
Score Global de Salud Tridimensional: **${analytics.healthScore}/100**

## 1. Dimensión A: Embudo E-Commerce & Core Web Vitals
- **Visitantes Únicos:** ${analytics.uniqueVisitors} | **Sesiones Totales:** ${analytics.uniqueSessions}
- **Embudo:** Visitas Tienda (${analytics.shopOrHomeSessions}) → Vistas Producto (${analytics.productViewSessions}) → Carrito (${analytics.addToCartSessions}) → Checkout (${analytics.checkoutStartSessions}) → Intento Pago (${analytics.paymentAttemptSessions}) → Compra/Lead (${analytics.purchaseOrLeadSessions})
- **Tasa de Conversión Global:** ${analytics.conversionRate}%
- **Pedidos Web (B2C):** ${ordersCount} ($${ordersRevenue.toLocaleString('es-MX')} MXN)
- **Core Web Vitals Promedio:** LCP=${analytics.avgLcp ? `${Math.round(analytics.avgLcp)}ms` : 'N/A'} | CLS=${analytics.avgCls !== null ? analytics.avgCls.toFixed(3) : '0.000'} | INP=${analytics.avgInp ? `${Math.round(analytics.avgInp)}ms` : 'N/A'} | TTFB=${analytics.avgTtfb ? `${Math.round(analytics.avgTtfb)}ms` : 'N/A'}

### Fricción UX Detectada (Rage Clicks / Dead Clicks / Abandonos):
${frictionList}

## 2. Inteligencia SEO Genérico, Buscador Interno & GEO
### Búsquedas con 0 Resultados (Oportunidades de Sinónimos / Catálogo):
${zeroSearchesList}

### Bots de IA y Buscadores Detectados (GEO):
${Object.entries(analytics.botCounts).length > 0 ? Object.entries(analytics.botCounts).map(([b, c]) => `- ${b}: ${c} rastreos`).join('\n') : '- Esperando rastreos de bots en el rango seleccionado.'}

## 3. Dimensión B: Experiencia App Instalada (PWA Clientes)
- **Sesiones PWA Standalone:** ${analytics.pwaSessions} vs **Sesiones Web:** ${analytics.webSessions}
- **Prompts Mostrados:** ${analytics.pwaPrompts} | **Instalaciones:** ${analytics.pwaInstalls}
- **Tiempo Activo Promedio:** PWA ${analytics.avgPwaDurationSec}s vs Web ${analytics.avgWebDurationSec}s

## 4. Dimensión C: Operación Interna de Empleados (Cotizador B2B & ERP)
- **Cotizaciones B2B en BD:** ${quotesCount} ($${quotesTotal.toLocaleString('es-MX')} MXN)
- **Flujos de Cotización Completados (Telemetría):** ${analytics.quoteSavedEvents.length} (Tiempo promedio: ${analytics.avgQuoteDurationSec}s, Clics promedio: ${analytics.avgQuoteClicks})
- **Errores o Latencia Operativa:**
${opsIssuesList}

---
## 🎯 INSTRUCCIÓN PARA EL AGENTE AUTÓNOMO ANTIGRAVITY
Analiza este Digest de Telemetría Real de J. Denis y ejecuta mejoras directas en el código siguiendo orden estricto de prioridad:
1. **Prioridad 1 (Fricción Operativa / Errores de Compra):** Corregir cualquier \`quote_save_error\`, \`payment_error\` o \`api_latency_or_error\`.
2. **Prioridad 2 (Conversión E-Commerce y PWA):** Reducir la caída en el paso con mayor abandono del embudo y resolver cualquier \`rage_click\` o \`dead_click\`.
3. **Prioridad 3 (Expansión SEO Genérico & Sinónimos):** Mapear las búsquedas con 0 resultados en \`website/src/utils/seoData.ts\` y enriquecer metadatos/bloques semánticos B2C + B2B.`;
    }, [analytics, dateRange, ordersCount, ordersRevenue, quotesCount, quotesTotal, versionInfo]);

    const handleCopyDigest = async () => {
        try {
            await navigator.clipboard.writeText(aiPromptDigest);
            setCopiedDigest(true);
            setTimeout(() => setCopiedDigest(false), 2500);
        } catch (e) {
            console.error(e);
        }
    };

    const tabs: Array<{ id: CommandTab; label: string; icon: React.ReactNode }> = [
        { id: 'executive', label: '1. Resumen & Salud Global', icon: <Activity className="w-4 h-4" /> },
        { id: 'funnel', label: '2. Embudo E-Commerce', icon: <ShoppingBag className="w-4 h-4" /> },
        { id: 'seo_geo', label: '3. SEO Genérico & GEO IA', icon: <Search className="w-4 h-4" /> },
        { id: 'pwa', label: '4. App Instalada (PWA)', icon: <Smartphone className="w-4 h-4" /> },
        { id: 'operations', label: '5. Operación & Cotizador', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'ai_digest', label: '6. AI Prompt Digest', icon: <Sparkles className="w-4 h-4" /> },
    ];

    return (
        <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Command Center Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                Telemetría 3D en Vivo
                            </span>
                            {versionInfo && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/10 text-indigo-200">
                                    Dokploy SHA: {versionInfo.shortSha || versionInfo.commitSha?.slice(0, 7)}
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                            Monitor E-Commerce, SEO Genérico & Operación Interna
                        </h2>
                        <p className="text-xs md:text-sm text-slate-300 mt-0.5">
                            Centro de mando tridimensional: Tienda Pública B2C/B2B · Clientes con App PWA · Eficiencia del Cotizador de Empleados
                        </p>
                    </div>

                    {/* Date Range & Refresh Controls */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="inline-flex rounded-xl bg-white/10 p-1 border border-white/10">
                            {(['1d', '7d', '30d', '90d'] as DateRangeKey[]).map((rk) => (
                                <button
                                    key={rk}
                                    onClick={() => setDateRange(rk)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                        dateRange === rk
                                            ? 'bg-amber-400 text-slate-900 shadow-sm'
                                            : 'text-slate-200 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {rk === '1d' ? 'Hoy' : rk}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={fetchTelemetryData}
                            disabled={loading}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white border border-white/15 transition-colors"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-1.5 mt-6 overflow-x-auto pb-1 scrollbar-hide">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                activeTab === t.id
                                    ? 'bg-white text-slate-900 shadow-md'
                                    : 'bg-white/5 text-slate-300 hover:bg-white/15 hover:text-white'
                            }`}
                        >
                            {t.icon}
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Body */}
            <div className="p-6">
                {/* ─── TAB 1: EXECUTIVE SUMMARY & GLOBAL HEALTH ─── */}
                {activeTab === 'executive' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                                        Salud Global 3D
                                    </span>
                                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-3xl font-extrabold text-emerald-950">{analytics.healthScore}</span>
                                    <span className="text-xs font-semibold text-emerald-700">/ 100 pts</span>
                                </div>
                                <p className="text-[11px] text-emerald-800/80 mt-1">
                                    Web CWV + Conversión + Cotizador ERP
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Tráfico & Sesiones
                                    </span>
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-3xl font-extrabold text-slate-900">{analytics.uniqueSessions}</span>
                                    <span className="text-xs text-slate-500">({analytics.uniqueVisitors} únicos)</span>
                                </div>
                                <p className="text-[11px] text-slate-500 mt-1">
                                    Web: {analytics.webSessions} · App PWA: {analytics.pwaSessions}
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                                        Conversión & Pedidos Web
                                    </span>
                                    <ShoppingBag className="w-5 h-5 text-amber-600" />
                                </div>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-3xl font-extrabold text-slate-900">{analytics.conversionRate}%</span>
                                    <span className="text-xs font-semibold text-amber-800">{ordersCount} órdenes</span>
                                </div>
                                <p className="text-[11px] text-amber-900/80 mt-1">
                                    Ingresos Web: ${ordersRevenue.toLocaleString('es-MX')} MXN
                                </p>
                            </div>

                            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                                        Cotizaciones B2B (ERP)
                                    </span>
                                    <Briefcase className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="mt-2 flex items-baseline gap-2">
                                    <span className="text-3xl font-extrabold text-slate-900">{quotesCount}</span>
                                    <span className="text-xs font-semibold text-indigo-700">cotizaciones</span>
                                </div>
                                <p className="text-[11px] text-indigo-900/80 mt-1">
                                    Monto Cotizado: ${quotesTotal.toLocaleString('es-MX')} MXN
                                </p>
                            </div>
                        </div>

                        {/* Core Web Vitals & Dokploy Sensor Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200 bg-white">
                                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-500" />
                                    Core Web Vitals en Tiempo Real (Clientes & Empleados)
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-[11px] text-slate-500 font-semibold">LCP (Carga Hero)</span>
                                        <p className="text-lg font-bold text-slate-900 mt-0.5">
                                            {analytics.avgLcp ? `${Math.round(analytics.avgLcp)} ms` : 'Óptimo (<2.5s)'}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-[11px] text-slate-500 font-semibold">CLS (Estabilidad)</span>
                                        <p className="text-lg font-bold text-emerald-700 mt-0.5">
                                            {analytics.avgCls !== null ? analytics.avgCls.toFixed(3) : '0.000'}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-[11px] text-slate-500 font-semibold">INP (Interacción)</span>
                                        <p className="text-lg font-bold text-slate-900 mt-0.5">
                                            {analytics.avgInp ? `${Math.round(analytics.avgInp)} ms` : '< 200 ms'}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-[11px] text-slate-500 font-semibold">TTFB (Servidor)</span>
                                        <p className="text-lg font-bold text-slate-900 mt-0.5">
                                            {analytics.avgTtfb ? `${Math.round(analytics.avgTtfb)} ms` : '< 300 ms'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50">
                                <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    Sensor de Autodeploy Dokploy (`/__version.json`)
                                </h3>
                                {versionInfo ? (
                                    <div className="space-y-1.5 text-xs text-slate-600">
                                        <p><strong>Commit SHA:</strong> <code className="px-1.5 py-0.5 bg-white rounded border">{versionInfo.shortSha || versionInfo.commitSha.slice(0, 8)}</code></p>
                                        <p className="truncate"><strong>Mensaje:</strong> {versionInfo.commitMessage}</p>
                                        <p><strong>Build Timestamp:</strong> {new Date(versionInfo.builtAt).toLocaleString('es-MX')}</p>
                                        <p><strong>Entorno:</strong> <span className="text-emerald-700 font-semibold uppercase">{versionInfo.environment}</span></p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500">Verificando `/__version.json`...</p>
                                )}
                            </div>
                        </div>

                        {/* Compact Block: 🤖 Control de Versiones IA (Estándar Maestro v2.0) */}
                        <div className="p-5 rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/60 via-white to-indigo-50/40">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-indigo-600" />
                                    🤖 Control de Versiones IA (`autonomous_evolution_logs`)
                                </h3>
                                <button
                                    onClick={() => setActiveTab('ai_digest')}
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
                                >
                                    Ver historial completo ({evolutionLogs.length}) →
                                </button>
                            </div>
                            {evolutionLogs.length === 0 ? (
                                <p className="text-xs text-slate-500">Sincronizando controlador de versiones IA...</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {evolutionLogs.slice(0, 2).map((log) => (
                                        <div key={log.id} className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1 shadow-sm">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900">{log.version_tag}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                        log.status === 'IMPLEMENTED'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : log.status === 'ACTION_REQUIRED'
                                                            ? 'bg-amber-100 text-amber-800'
                                                            : 'bg-indigo-100 text-indigo-800'
                                                    }`}>
                                                        {log.status}
                                                    </span>
                                                </div>
                                                <span className="text-[11px] text-slate-400 font-mono">
                                                    Ciclo #{log.cycle_number} · ✉️ {log.email_sent ? 'OK' : 'Pendiente'}
                                                </span>
                                            </div>
                                            <p className="text-slate-700 line-clamp-2">{log.short_summary}</p>
                                            {log.human_action_required && (
                                                <p className="text-[11px] text-amber-800 font-semibold">
                                                    🙋‍♂️ {log.human_action_required}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── TAB 2: E-COMMERCE FUNNEL & STAR PRODUCTS ─── */}
                {activeTab === 'funnel' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-base font-bold text-slate-800 mb-3">
                                Embudo de Conversión E-Commerce (Paso a Paso)
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                                {[
                                    { label: '1. Visitas Tienda', count: analytics.shopOrHomeSessions, base: analytics.shopOrHomeSessions },
                                    { label: '2. Vista Producto', count: analytics.productViewSessions, base: analytics.shopOrHomeSessions },
                                    { label: '3. Add to Cart', count: analytics.addToCartSessions, base: analytics.productViewSessions || analytics.shopOrHomeSessions },
                                    { label: '4. Inicio Checkout', count: analytics.checkoutStartSessions, base: analytics.addToCartSessions || 1 },
                                    { label: '5. Intento Pago', count: analytics.paymentAttemptSessions, base: analytics.checkoutStartSessions || 1 },
                                    { label: '6. Compra / Lead', count: analytics.purchaseOrLeadSessions, base: analytics.shopOrHomeSessions || 1 },
                                ].map((step, i) => {
                                    const pct = step.base > 0 ? Math.min(100, Math.round((step.count / step.base) * 100)) : 0;
                                    return (
                                        <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                                            <span className="text-[11px] font-semibold text-slate-500 block">{step.label}</span>
                                            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{step.count}</span>
                                            <span className="inline-block mt-1 text-[11px] font-semibold text-indigo-600">
                                                {pct}% avance
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Products */}
                            <div className="border border-slate-200 rounded-2xl p-5">
                                <h4 className="text-sm font-bold text-slate-800 mb-3">
                                    Productos Más Vistos vs. Agregados al Carrito
                                </h4>
                                {analytics.topProducts.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-6 text-center">
                                        Aún no hay suficientes eventos `product_view` / `add_to_cart` en este rango.
                                    </p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead>
                                                <tr className="border-b border-slate-200 text-slate-500">
                                                    <th className="py-2">Producto</th>
                                                    <th className="py-2 text-right">Vistas</th>
                                                    <th className="py-2 text-right">Al Carrito</th>
                                                    <th className="py-2 text-right">% Conv.</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {analytics.topProducts.map((p) => {
                                                    const rate = p.views > 0 ? Math.round((p.adds / p.views) * 100) : (p.adds > 0 ? 100 : 0);
                                                    return (
                                                        <tr key={p.id}>
                                                            <td className="py-2.5 font-medium text-slate-800 truncate max-w-[200px]">
                                                                {p.name}
                                                                <span className="block text-[10px] text-slate-400">{p.category}</span>
                                                            </td>
                                                            <td className="py-2.5 text-right font-semibold">{p.views}</td>
                                                            <td className="py-2.5 text-right font-semibold text-emerald-700">{p.adds}</td>
                                                            <td className="py-2.5 text-right font-bold text-indigo-600">{rate}%</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* UX Friction */}
                            <div className="border border-slate-200 rounded-2xl p-5">
                                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <MousePointerClick className="w-4 h-4 text-rose-500" />
                                    Auditoría de Fricción UX (Rage Clicks, Dead Clicks, Abandonos)
                                </h4>
                                {analytics.frictionEvents.length === 0 ? (
                                    <div className="p-6 text-center bg-emerald-50/50 rounded-xl border border-emerald-100">
                                        <p className="text-xs font-semibold text-emerald-800">
                                            ✓ 0 eventos de fricción detectados en el periodo seleccionado.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {analytics.frictionEvents.slice(0, 10).map((f) => (
                                            <div key={f.id} className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-xs">
                                                <div className="flex justify-between font-semibold text-rose-900">
                                                    <span>{f.event_name.toUpperCase()}</span>
                                                    <span className="font-mono">{f.path}</span>
                                                </div>
                                                <p className="text-[11px] text-rose-700 mt-1 truncate">
                                                    {JSON.stringify(f.metadata)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── TAB 3: GENERIC SEO, INTERNAL SEARCH & GEO AI BOTS ─── */}
                {activeTab === 'seo_geo' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Internal Searches */}
                            <div className="border border-slate-200 rounded-2xl p-5">
                                <h4 className="text-sm font-bold text-slate-800 mb-3">
                                    Top Búsquedas en Tienda (`product_search`)
                                </h4>
                                {analytics.topSearches.length === 0 ? (
                                    <p className="text-xs text-slate-400 py-6 text-center">
                                        Las búsquedas de clientes en el buscador global y catálogo aparecerán aquí en tiempo real.
                                    </p>
                                ) : (
                                    <div className="space-y-2">
                                        {analytics.topSearches.map((s) => (
                                            <div key={s.query} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                                                <span className="font-semibold text-slate-800">"{s.query}"</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-slate-500">{s.count} búsquedas</span>
                                                    <span className={`px-2 py-0.5 rounded-full font-semibold ${s.avgResults > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                                        ~{s.avgResults} resultados
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Zero-Result Searches & GEO AI Bots */}
                            <div className="space-y-4">
                                <div className="border border-amber-200 bg-amber-50/40 rounded-2xl p-5">
                                    <h4 className="text-sm font-bold text-amber-950 mb-2 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                                        Detector de Búsquedas Sin Resultados (Oportunidades SEO/Sinónimos)
                                    </h4>
                                    {analytics.zeroResultSearches.length === 0 ? (
                                        <p className="text-xs text-emerald-700 font-medium">
                                            ✓ Todas las búsquedas recientes devolvieron productos gracias al motor de sinónimos (`seoData.ts`).
                                        </p>
                                    ) : (
                                        <ul className="space-y-1.5 text-xs">
                                            {analytics.zeroResultSearches.map((z) => (
                                                <li key={z.query} className="flex justify-between text-amber-900 font-medium">
                                                    <span>"{z.query}"</span>
                                                    <span className="text-rose-600 font-bold">{z.zeroResultsCount} veces (0 resultados)</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="border border-slate-200 rounded-2xl p-5">
                                    <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                                        <Bot className="w-4 h-4 text-indigo-600" />
                                        Monitor GEO: Rastreo de Motores de IA y Buscadores
                                    </h4>
                                    <p className="text-xs text-slate-500 mb-3">
                                        Archivos activos: <a href="/llms.txt" target="_blank" rel="noreferrer" className="text-indigo-600 underline">/llms.txt</a> · <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="text-indigo-600 underline">/sitemap.xml</a> · <a href="/robots.txt" target="_blank" rel="noreferrer" className="text-indigo-600 underline">/robots.txt</a>
                                    </p>
                                    {Object.keys(analytics.botCounts).length === 0 ? (
                                        <p className="text-xs text-slate-400">
                                            Sin rastreos de bots con JS en este rango (los crawlers estáticos leen `/llms.txt` y `/sitemap.xml` directamente).
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2">
                                            {Object.entries(analytics.botCounts).map(([bot, count]) => (
                                                <div key={bot} className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 flex justify-between text-xs">
                                                    <span className="font-semibold text-indigo-950">{bot}</span>
                                                    <span className="font-bold text-indigo-600">{count} hits</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── TAB 4: INSTALLED APP EXPERIENCE (PWA) ─── */}
                {activeTab === 'pwa' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                                <span className="text-xs text-slate-500 font-semibold">Banners PWA Mostrados</span>
                                <p className="text-3xl font-extrabold text-slate-900 mt-1">{analytics.pwaPrompts}</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200">
                                <span className="text-xs text-indigo-800 font-semibold">Instalaciones Confirmadas</span>
                                <p className="text-3xl font-extrabold text-indigo-950 mt-1">{analytics.pwaInstalls}</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                                <span className="text-xs text-emerald-800 font-semibold">Sesiones en Modo App (`pwa_standalone`)</span>
                                <p className="text-3xl font-extrabold text-emerald-950 mt-1">{analytics.pwaSessions}</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl border border-slate-200">
                            <h4 className="text-sm font-bold text-slate-800 mb-3">
                                Comparativa de Retención: Navegador Web vs. App Instalada (PWA)
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                    <p className="font-bold text-slate-700 mb-1">🌐 Navegador Web (`app_context = 'web'`)</p>
                                    <p className="text-slate-600">Sesiones: <strong>{analytics.webSessions}</strong></p>
                                    <p className="text-slate-600">Tiempo Activo Promedio por Página: <strong>{analytics.avgWebDurationSec}s</strong></p>
                                </div>
                                <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
                                    <p className="font-bold text-indigo-950 mb-1">📲 App Instalada (`app_context = 'pwa_standalone'`)</p>
                                    <p className="text-indigo-900">Sesiones Standalone: <strong>{analytics.pwaSessions}</strong> ({analytics.pwaStarts} arranques)</p>
                                    <p className="text-indigo-900">Tiempo Activo Promedio por Página: <strong>{analytics.avgPwaDurationSec}s</strong></p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── TAB 5: INTERNAL OPERATIONS & QUOTER EFFICIENCY ─── */}
                {activeTab === 'operations' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-indigo-600" /> Tiempo Promedio Cotización
                                </span>
                                <p className="text-3xl font-extrabold text-slate-900 mt-1">
                                    {analytics.avgQuoteDurationSec > 0 ? `${analytics.avgQuoteDurationSec}s` : 'N/A'}
                                </p>
                                <span className="text-[11px] text-slate-500">
                                    Clics promedio por cotización: {analytics.avgQuoteClicks}
                                </span>
                            </div>

                            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                                <span className="text-xs font-semibold text-emerald-800">Cotizaciones Guardadas (Flujo)</span>
                                <p className="text-3xl font-extrabold text-emerald-950 mt-1">
                                    {analytics.quoteSavedEvents.length}
                                </p>
                                <span className="text-[11px] text-emerald-700">
                                    Total en BD ({dateRange}): {quotesCount}
                                </span>
                            </div>

                            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200">
                                <span className="text-xs font-semibold text-rose-800">Errores al Guardar Cotización</span>
                                <p className="text-3xl font-extrabold text-rose-950 mt-1">
                                    {analytics.quoteErrorEvents.length}
                                </p>
                                <span className="text-[11px] text-rose-700">
                                    Meta operativa: 0 errores
                                </span>
                            </div>

                            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
                                <span className="text-xs font-semibold text-amber-900">Alertas de Latencia API (&gt;1.5s)</span>
                                <p className="text-3xl font-extrabold text-amber-950 mt-1">
                                    {analytics.apiLatencyEvents.length}
                                </p>
                                <span className="text-[11px] text-amber-800">
                                    Rage clicks internos: {analytics.internalRageClicks.length}
                                </span>
                            </div>
                        </div>

                        <div className="border border-slate-200 rounded-2xl p-5">
                            <h4 className="text-sm font-bold text-slate-800 mb-3">
                                Registro Reciente de Telemetría Operativa (`internal_ops`)
                            </h4>
                            {analytics.quoteSavedEvents.length === 0 && analytics.quoteErrorEvents.length === 0 && analytics.apiLatencyEvents.length === 0 ? (
                                <p className="text-xs text-slate-400 py-4 text-center">
                                    Sin eventos de fricción operativa registrados en este rango. Todas las tablas ERP (`quotations`, `quotation_items`, `sales_orders`) tienen DEFAULT UUID y políticas RLS activas.
                                </p>
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {[...analytics.quoteErrorEvents, ...analytics.apiLatencyEvents, ...analytics.quoteSavedEvents].slice(0, 12).map((ev) => (
                                        <div key={ev.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                                            <div>
                                                <span className={`font-bold mr-2 ${ev.event_name.includes('error') ? 'text-rose-600' : 'text-indigo-700'}`}>
                                                    [{ev.event_name}]
                                                </span>
                                                <span className="text-slate-600">{JSON.stringify(ev.metadata)}</span>
                                            </div>
                                            <span className="text-slate-400 whitespace-nowrap ml-3">
                                                {ev.duration_ms ? `${ev.duration_ms}ms` : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── TAB 6: AI PROMPT DIGEST & AUTONOMOUS CHANGELOG ─── */}
                {activeTab === 'ai_digest' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/70 p-4 rounded-2xl border border-indigo-200">
                            <div>
                                <h3 className="text-sm font-bold text-indigo-950">
                                    Generador de AI Optimization Prompt Digest (1-Clic)
                                </h3>
                                <p className="text-xs text-indigo-800">
                                    Compila las métricas en vivo de las 3 dimensiones (Web/SEO, App PWA, Cotizador Interno) en un prompt estructurado para mejora continua.
                                </p>
                            </div>
                            <button
                                onClick={handleCopyDigest}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all shrink-0"
                            >
                                {copiedDigest ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {copiedDigest ? '¡Prompt Copiado al Portapapeles!' : 'Generar & Copiar AI Optimization Prompt'}
                            </button>
                        </div>

                        <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto max-h-80 leading-relaxed">
                            {aiPromptDigest}
                        </pre>

                        {/* Autonomous Evolution Logs (Estándar Maestro v2.0) */}
                        <div className="border border-indigo-200 bg-indigo-50/30 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-indigo-600" />
                                    🤖 Control de Versiones IA (`public.autonomous_evolution_logs`)
                                </h4>
                                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                                    Estándar Maestro v2.0 · Resend Activo
                                </span>
                            </div>
                            {evolutionLogs.length === 0 ? (
                                <p className="text-xs text-slate-400">Sin registros aún en `autonomous_evolution_logs`.</p>
                            ) : (
                                <div className="space-y-3">
                                    {evolutionLogs.map((log) => {
                                        const badgeColor =
                                            log.status === 'IMPLEMENTED'
                                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                                : log.status === 'ACTION_REQUIRED'
                                                ? 'bg-amber-100 text-amber-800 border-amber-200'
                                                : log.status === 'TEST_SYNC'
                                                ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                                                : 'bg-slate-100 text-slate-700 border-slate-200';
                                        return (
                                            <div key={log.id} className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-1.5 shadow-sm">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-extrabold text-slate-900">{log.version_tag}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                                                            {log.status}
                                                        </span>
                                                        <span className="text-slate-500">Ciclo #{log.cycle_number}</span>
                                                    </div>
                                                    <span className="text-slate-500 font-mono text-[11px]">
                                                        {new Date(log.created_at).toLocaleString('es-MX')} · SHA: {log.commit_hash ? log.commit_hash.slice(0, 7) : 'N/A'} · ✉️ {log.email_sent ? 'Enviado' : 'Pendiente'}
                                                    </span>
                                                </div>
                                                {log.short_summary && (
                                                    <p className="text-slate-800 font-medium">{log.short_summary}</p>
                                                )}
                                                {log.telemetry_findings && (
                                                    <p className="text-slate-600"><strong>Telemetría:</strong> {log.telemetry_findings}</p>
                                                )}
                                                {log.postponed_reason && (
                                                    <p className="text-slate-500 italic"><strong>Razón Pospuesto:</strong> {log.postponed_reason}</p>
                                                )}
                                                {log.human_action_required && (
                                                    <p className="text-amber-800 font-semibold bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                        🙋‍♂️ <strong>Acción Requerida del Humano:</strong> {log.human_action_required}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Autonomous Agent Changelog */}
                        <div className="border border-slate-200 rounded-2xl p-5">
                            <h4 className="text-sm font-bold text-slate-800 mb-3">
                                Bitácora del Agente Autónomo (`jdennis_agent_changelog.json`)
                            </h4>
                            {changelog.length === 0 ? (
                                <p className="text-xs text-slate-400">Cargando historial de ciclos autónomos...</p>
                            ) : (
                                <div className="space-y-3">
                                    {changelog.map((entry) => (
                                        <div key={entry.cycleId} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <span className="font-bold text-slate-900">
                                                    Ciclo #{entry.cycleId} · <span className="text-indigo-600 uppercase">{entry.dimension}</span>
                                                </span>
                                                <span className="text-slate-500 font-mono">
                                                    {new Date(entry.timestamp).toLocaleString('es-MX')} · SHA: {entry.commitSha}
                                                </span>
                                            </div>
                                            <p className="text-slate-700"><strong>Hallazgo:</strong> {entry.finding}</p>
                                            <p className="text-slate-700"><strong>Acción Ejecutada:</strong> {entry.actionTaken}</p>
                                            <p className="text-emerald-700 font-medium"><strong>Impacto Esperado:</strong> {entry.expectedImpact}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
