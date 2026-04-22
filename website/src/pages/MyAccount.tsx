import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Quoter from '../components/crm/Quoter';
import KanbanLogistics from '../components/crm/KanbanLogistics';
import CRMDirectory from '../components/crm/CRMDirectory';
import AnalyticsDashboard from '../components/crm/AnalyticsDashboard';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import {
    getClientOrders,
    getAvailableCoupons,
    getActivePromotions,
    getTransportistaDeliveries,
    getWarehouseStats,
    getProductionStats,
    getRecentOrdersCount,
    getLowStockCount,
    getPendingDistributorCount,
    getVehicleStats,
    type ClientOrder,
    type Coupon,
    type ActivePromotion,
    supabase
} from '../lib/supabase';
import {
    getQuotations,
    updateQuotationStatus,
    getQuotationItems,
    type Quotation
} from '../lib/erp';

// ─── Saved Address (localStorage) ───
interface SavedAddress {
    id: string;
    label: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    references: string;
    isDefault: boolean;
}

const ADDRESSES_KEY = 'jdenis-saved-addresses';
function loadAddresses(): SavedAddress[] {
    try { return JSON.parse(localStorage.getItem(ADDRESSES_KEY) || '[]'); } catch { return []; }
}
function saveAddresses(addresses: SavedAddress[]) {
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
}

// ─── Tab definitions ───
const clientTabs = [
    { id: 'orders', label: 'Mis Pedidos', icon: '📦' },
    { id: 'quotations', label: 'Cotizaciones', icon: '📝' },
    { id: 'payments', label: 'Mis Pagos', icon: '💳' },
    { id: 'promos', label: 'Mis Promociones', icon: '🎁' },
    { id: 'addresses', label: 'Direcciones', icon: '📍' },
    { id: 'profile', label: 'Mi Perfil', icon: '👤' },
];

const distributorTabs = [
    { id: 'solicitud', label: 'Status Proveedor', icon: '✅' },
    { id: 'calculadora', label: 'Calculadora', icon: '📈' },
];

const adminTabs = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'quicklinks', label: 'Módulos', icon: '⚡' },
    { id: 'profile', label: 'Mi Perfil', icon: '👤' },
];
const ejecutivoTabs = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'crm', label: 'CRM & Clientes', icon: '👥' },
    { id: 'quoter', label: 'Cotizador B2B', icon: '🧮' },
    { id: 'kanban', label: 'Logística', icon: '🚛' },
    { id: 'analytics', label: 'Analítica', icon: '📊' },
    { id: 'quicklinks', label: 'Módulos', icon: '⚡' },
    { id: 'profile', label: 'Mi Perfil', icon: '👤' },
];
const fabricaTabs = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'quicklinks', label: 'Módulos', icon: '⚡' },
    { id: 'profile', label: 'Mi Perfil', icon: '👤' },
];
const almacenTabs = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'quicklinks', label: 'Módulos', icon: '⚡' },
    { id: 'profile', label: 'Mi Perfil', icon: '👤' },
];
const transportistaTabs = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'deliveries', label: 'Mis Entregas', icon: '🚛' },
    { id: 'profile', label: 'Mi Perfil', icon: '👤' },
];

const ROLE_LABELS: Record<string, string> = {
    ADMIN: 'Administrador', EJECUTIVO: 'Ejecutivo', FABRICA: 'Fábrica',
    ALMACEN_MATERIA_PRIMA: 'Almacén MP', ALMACEN_PRODUCTO_FINAL: 'Almacén PF',
    TRANSPORTISTA: 'Transportista', DISTRIBUIDOR: 'Distribuidor', CLIENTE: 'Cliente',
};

type QuickLink = { label: string; path: string; icon: string; desc: string };
const adminLinks: QuickLink[] = [
    { label: 'Usuarios', path: '/admin/users', icon: '👥', desc: 'Gestionar cuentas' },
    { label: 'Catálogo', path: '/admin/catalog', icon: '📦', desc: 'Editar productos' },
    { label: 'Pedidos B2B', path: '/admin/orders', icon: '📋', desc: 'Órdenes B2B' },
    { label: 'Ventas', path: '/admin/sales', icon: '💰', desc: 'Ventas y cotizaciones' },
    { label: 'Academia', path: '/admin/academy', icon: '🎓', desc: 'Cursos y eventos' },
    { label: 'Blog', path: '/admin/blog', icon: '✏️', desc: 'Artículos y noticias' },
    { label: 'Cupones', path: '/admin/coupons', icon: '🏷️', desc: 'Descuentos' },
    { label: 'Reseñas', path: '/admin/reviews', icon: '⭐', desc: 'Moderar reseñas' },
    { label: 'Distribuidores', path: '/admin/distributors', icon: '🤝', desc: 'Solicitudes' },
    { label: 'Facturación', path: '/admin/facturacion', icon: '🧾', desc: 'CFDI y facturas' },
    { label: 'Reels', path: '/admin/reels', icon: '🎬', desc: 'Videos sociales' },
    { label: 'Promos Carrito', path: '/admin/cart-promos', icon: '🛒', desc: 'Banners' },
];
const ejecutivoLinks: QuickLink[] = [
    { label: 'Ventas', path: '/admin/sales', icon: '💰', desc: 'Ventas y cotizaciones' },
    { label: 'Pedidos B2B', path: '/admin/orders', icon: '📋', desc: 'Órdenes B2B' },
    { label: 'Catálogo', path: '/admin/catalog', icon: '📦', desc: 'Editar productos' },
    { label: 'Distribuidores', path: '/admin/distributors', icon: '🤝', desc: 'Solicitudes' },
    { label: 'Academia', path: '/admin/academy', icon: '🎓', desc: 'Cursos' },
    { label: 'Blog', path: '/admin/blog', icon: '✏️', desc: 'Artículos' },
    { label: 'Cupones', path: '/admin/coupons', icon: '🏷️', desc: 'Descuentos' },
    { label: 'Facturación', path: '/admin/facturacion', icon: '🧾', desc: 'CFDI' },
];
const fabricaLinks: QuickLink[] = [
    { label: 'Embalaje', path: '/admin/packaging', icon: '📦', desc: 'Registros de embalaje' },
    { label: 'Cola de Envíos', path: '/admin/warehouse-queue', icon: '🚛', desc: 'Despachos' },
    { label: 'Pedidos B2B', path: '/admin/orders', icon: '📋', desc: 'Órdenes' },
];
const almacenLinks: QuickLink[] = [
    { label: 'Embalaje', path: '/admin/packaging', icon: '📦', desc: 'Registros' },
    { label: 'Cola de Envíos', path: '/admin/warehouse-queue', icon: '🚛', desc: 'Despachos' },
];

// ─── Helpers ───
function statusLabel(s: string) {
    const map: Record<string, string> = {
        pending: 'Procesando', processing: 'Procesando', shipped: 'En camino',
        delivered: 'Entregado', completed: 'Completado', cancelled: 'Cancelado',
    };
    return map[s] || 'Procesando';
}
function statusColor(s: string) {
    const map: Record<string, string> = {
        pending: 'bg-blue-100 text-blue-700', processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-amber-100 text-amber-700', delivered: 'bg-emerald-100 text-emerald-700',
        completed: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700',
    };
    return map[s] || 'bg-blue-100 text-blue-700';
}
function paymentStatusLabel(s: string | null) {
    const map: Record<string, string> = {
        approved: 'Aprobado', pending: 'Pendiente', in_process: 'En proceso',
        rejected: 'Rechazado', cancelled: 'Cancelado',
    };
    return map[s || ''] || 'Pendiente';
}
function paymentStatusIcon(s: string | null) {
    const map: Record<string, string> = {
        approved: '✅', pending: '⏳', in_process: '⏳', rejected: '❌', cancelled: '🚫',
    };
    return map[s || ''] || '⏳';
}
function paymentStatusColor(s: string | null) {
    const map: Record<string, string> = {
        approved: 'text-emerald-600', pending: 'text-amber-600',
        in_process: 'text-amber-600', rejected: 'text-red-600', cancelled: 'text-red-500',
    };
    return map[s || ''] || 'text-amber-600';
}
function fmtDate(d: string) {
    return new Date(d).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
}
function fmtMoney(n: number) {
    return '$' + n.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// ═══════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════
export default function MyAccount() {
    const { user, logout, isAuthenticated } = useAuthStore();
    const { addItem } = useCartStore();
    const [searchParams] = useSearchParams();
    const isERP = ['ADMIN','EJECUTIVO','FABRICA','ALMACEN_MATERIA_PRIMA','ALMACEN_PRODUCTO_FINAL','TRANSPORTISTA'].includes(user?.role || '');
    const [activeTab, setActiveTab] = useState(isERP ? 'home' : 'orders');

    // Data states
    const [orders, setOrders] = useState<ClientOrder[]>([]);
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [promotions, setPromotions] = useState<ActivePromotion[]>([]);
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [expandedQuotation, setExpandedQuotation] = useState<string | null>(null);
    const [quotationItemsCache, setQuotationItemsCache] = useState<Record<string, any[]>>({});

    // Profile
    const [profileName, setProfileName] = useState('');
    const [profilePhone, setProfilePhone] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileMsg, setProfileMsg] = useState('');

    // Addresses
    const [addresses, setAddresses] = useState<SavedAddress[]>([]);
    const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
    const [showAddressForm, setShowAddressForm] = useState(false);

    // Distributor calculator
    const [investmentAmount, setInvestmentAmount] = useState(5000);

    // Coupon copy feedback
    const [copiedCode, setCopiedCode] = useState('');

    // ERP role stats
    const [erpStats, setErpStats] = useState<any>({});
    const [deliveries, setDeliveries] = useState<any[]>([]);

    const showSuccess = searchParams.get('pedido') === 'exito';

    // ─── Load data ───
    const loadData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const role = user.role || 'CLIENTE';
            if (role === 'CLIENTE' || role === 'DISTRIBUIDOR') {
                const [ordersData, couponsData, promosData, quotesData] = await Promise.all([
                    getClientOrders(user.id, user.email),
                    getAvailableCoupons(),
                    getActivePromotions(),
                    getQuotations({ customerId: user.id }),
                ]);
                setOrders(ordersData);
                setCoupons(couponsData);
                setPromotions(promosData);
                // Clientes solo ven cotizaciones que no son borradores
                setQuotations(quotesData.filter(q => q.status !== 'DRAFT'));
            } else if (role === 'TRANSPORTISTA') {
                const [del, veh] = await Promise.all([
                    getTransportistaDeliveries(user.id),
                    getVehicleStats(),
                ]);
                setDeliveries(del);
                setErpStats((p: any) => ({ ...p, vehicles: veh }));
            } else if (role === 'ADMIN') {
                const [rc, ls, dc, wh, pr] = await Promise.all([
                    getRecentOrdersCount(), getLowStockCount(), getPendingDistributorCount(),
                    getWarehouseStats(), getProductionStats(),
                ]);
                setErpStats({ recentOrders: rc, lowStock: ls, pendingDist: dc, warehouse: wh, production: pr });
            } else if (role === 'EJECUTIVO') {
                const [rc, ls, dc] = await Promise.all([
                    getRecentOrdersCount(), getLowStockCount(), getPendingDistributorCount(),
                ]);
                setErpStats({ recentOrders: rc, lowStock: ls, pendingDist: dc });
            } else if (role === 'FABRICA') {
                const [pr, wh] = await Promise.all([getProductionStats(), getWarehouseStats()]);
                setErpStats({ production: pr, warehouse: wh });
            } else {
                const wh = await getWarehouseStats();
                setErpStats({ warehouse: wh });
            }
        } catch (e) {
            console.error('Error loading dashboard data:', e);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
            setProfileName(user?.fullName || '');
            setAddresses(loadAddresses());
        }
    }, [isAuthenticated, loadData, user]);

    // ─── Not authenticated ───
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-cream pt-32 flex items-center justify-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center bg-white rounded-3xl shadow-luxury p-12 max-w-md mx-4">
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                    </div>
                    <h2 className="font-serif text-2xl text-navy mb-2">Acceso Requerido</h2>
                    <p className="text-charcoal-light mb-6">Inicia sesión para acceder a tu cuenta</p>
                    <Link to="/login" className="btn btn-primary w-full">Iniciar Sesión</Link>
                </motion.div>
            </div>
        );
    }

    // ─── Handlers ───
    const handleRepeatOrder = (order: ClientOrder) => {
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        if (Array.isArray(items)) {
            items.forEach((item: any) => {
                addItem({ id: item.id, name: item.name, price: item.price, image: item.image || '', category: '' });
            });
        }
    };

    const handleCopyCoupon = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(''), 2000);
    };

    const handleLoadQuotationItems = async (qId: string) => {
        if (expandedQuotation === qId) {
            setExpandedQuotation(null);
            return;
        }
        setExpandedQuotation(qId);
        if (!quotationItemsCache[qId]) {
            try {
                const items = await getQuotationItems(qId);
                setQuotationItemsCache(prev => ({ ...prev, [qId]: items }));
            } catch (error) {
                console.error("Error loading quotation items", error);
            }
        }
    };

    const handleUpdateQuotationStatus = async (qId: string, newStatus: string) => {
        try {
            await updateQuotationStatus(qId, newStatus as any);
            setQuotations(prev => prev.map(q => q.id === qId ? { ...q, status: newStatus as any } : q));
        } catch (e) {
            console.error("Error updating quote", e);
        }
    };

    const handleSaveProfile = async () => {
        if (changingPassword) {
            if (newPassword.length < 6) { setProfileMsg('La contraseña debe tener al menos 6 caracteres'); return; }
            if (newPassword !== confirmPassword) { setProfileMsg('Las contraseñas no coinciden'); return; }
            try {
                const { error } = await supabase.auth.updateUser({ password: newPassword });
                if (error) throw error;
                setProfileMsg('✅ Contraseña actualizada correctamente');
                setChangingPassword(false);
                setNewPassword('');
                setConfirmPassword('');
            } catch { setProfileMsg('Error al actualizar la contraseña'); }
        } else {
            setProfileMsg('✅ Perfil guardado');
        }
        setTimeout(() => setProfileMsg(''), 3000);
    };

    const handleSaveAddress = (addr: SavedAddress) => {
        let updated: SavedAddress[];
        if (addresses.find(a => a.id === addr.id)) {
            updated = addresses.map(a => a.id === addr.id ? addr : (addr.isDefault ? { ...a, isDefault: false } : a));
        } else {
            if (addr.isDefault) {
                updated = [...addresses.map(a => ({ ...a, isDefault: false })), addr];
            } else {
                updated = [...addresses, addr];
            }
        }
        setAddresses(updated);
        saveAddresses(updated);
        setShowAddressForm(false);
        setEditingAddress(null);
    };

    const handleDeleteAddress = (id: string) => {
        const updated = addresses.filter(a => a.id !== id);
        setAddresses(updated);
        saveAddresses(updated);
    };

    const getTabsForRole = () => {
        const r = user?.role || 'CLIENTE';
        if (r === 'ADMIN') return adminTabs;
        if (r === 'EJECUTIVO') return ejecutivoTabs;
        if (r === 'FABRICA') return fabricaTabs;
        if (r === 'ALMACEN_MATERIA_PRIMA' || r === 'ALMACEN_PRODUCTO_FINAL') return almacenTabs;
        if (r === 'TRANSPORTISTA') return transportistaTabs;
        if (r === 'DISTRIBUIDOR') return [...clientTabs, ...distributorTabs];
        return clientTabs;
    };
    const allTabs = getTabsForRole();

    const getLinksForRole = (): QuickLink[] => {
        const r = user?.role || '';
        if (r === 'ADMIN') return adminLinks;
        if (r === 'EJECUTIVO') return ejecutivoLinks;
        if (r === 'FABRICA') return fabricaLinks;
        if (r === 'ALMACEN_MATERIA_PRIMA' || r === 'ALMACEN_PRODUCTO_FINAL') return almacenLinks;
        return [];
    };

    const orderItems = (order: ClientOrder) => {
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        return Array.isArray(items) ? items : [];
    };

    const totalItems = (order: ClientOrder) => {
        return orderItems(order).reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
    };

    // ─── Stats ───
    const completedOrders = orders.filter(o => o.payment_status === 'approved' || o.status === 'completed' || o.status === 'delivered');
    const totalSpent = completedOrders.reduce((sum, o) => sum + Number(o.total), 0);

    return (
        <div className="min-h-screen bg-cream pt-28 pb-12">
            <div className="container-luxury">
                {/* Success Banner */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8 flex items-center gap-3">
                            <span className="text-2xl">🎉</span>
                            <div>
                                <p className="font-semibold text-emerald-800">¡Pedido realizado con éxito!</p>
                                <p className="text-sm text-emerald-700">Te enviaremos confirmación por email.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid lg:grid-cols-[280px_1fr] gap-8">
                    {/* ────── SIDEBAR ────── */}
                    <aside>
                        <div className="bg-white rounded-2xl shadow-luxury overflow-hidden sticky top-24">
                            {/* User header */}
                            <div className="bg-gradient-to-br from-navy to-navy/90 p-6 text-center">
                                <div className="w-18 h-18 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-gold/40" style={{ width: 72, height: 72 }}>
                                    {user?.avatar_url ? (
                                        <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        <span className="text-2xl text-gold font-serif font-bold">
                                            {user?.fullName?.[0]?.toUpperCase() || 'U'}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-serif text-lg text-cream truncate">{user?.fullName}</h3>
                                <p className="text-sm text-cream/60 truncate">{user?.email}</p>
                                <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-medium bg-gold/20 text-gold border border-gold/30">
                                    {ROLE_LABELS[user?.role || ''] || user?.role}
                                </span>
                            </div>

                            {/* Nav */}
                            <nav className="p-3 space-y-1">
                                {allTabs.map((tab) => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-sm font-medium ${activeTab === tab.id
                                            ? 'bg-gold/10 text-gold border border-gold/20'
                                            : 'hover:bg-blush text-charcoal hover:text-navy'
                                            }`}>
                                        <span className="text-base">{tab.icon}</span>
                                        {tab.label}
                                        {tab.id === 'orders' && orders.length > 0 && (
                                            <span className="ml-auto bg-navy/10 text-navy text-xs px-2 py-0.5 rounded-full">{orders.length}</span>
                                        )}
                                    </button>
                                ))}

                                {['ADMIN', 'EJECUTIVO', 'FABRICA', 'ALMACEN_MATERIA_PRIMA', 'ALMACEN_PRODUCTO_FINAL', 'TRANSPORTISTA'].includes(user?.role || '') && (
                                    <Link to="/admin"
                                        className="w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 text-sm font-medium bg-forest/5 text-forest hover:bg-forest hover:text-cream mt-1">
                                        <span className="text-base">🛡️</span>
                                        Panel Administrativo
                                    </Link>
                                )}
                            </nav>

                            <div className="px-3 pb-3">
                                <hr className="my-2 border-charcoal/10" />
                                <button onClick={logout}
                                    className="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors flex items-center gap-3 text-sm">
                                    <span className="text-base">🚪</span>
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* ────── MOBILE TABS ────── */}
                    <div className="lg:hidden -mt-4 mb-4 overflow-x-auto scrollbar-hide">
                        <div className="flex gap-2 pb-2">
                            {allTabs.map((tab) => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-gold text-white shadow-md'
                                        : 'bg-white text-charcoal hover:bg-blush'
                                        }`}>
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ────── CONTENT ────── */}
                    <main className="min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div key={activeTab}
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.2 }}>

                                {/* ══════ TAB: MIS PEDIDOS ══════ */}
                                {activeTab === 'orders' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h2 className="font-serif text-xl text-navy">Mis Pedidos</h2>
                                            {orders.length > 0 && (
                                                <span className="text-sm text-charcoal-light">{orders.length} pedido{orders.length !== 1 ? 's' : ''}</span>
                                            )}
                                        </div>

                                        {loading ? (
                                            <div className="bg-white rounded-2xl p-12 shadow-luxury text-center">
                                                <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto"></div>
                                                <p className="text-charcoal-light mt-3 text-sm">Cargando pedidos...</p>
                                            </div>
                                        ) : orders.length === 0 ? (
                                            <div className="bg-white rounded-2xl p-12 shadow-luxury text-center">
                                                <div className="text-5xl mb-4">📦</div>
                                                <h3 className="font-serif text-lg text-navy mb-2">Aún no tienes pedidos</h3>
                                                <p className="text-charcoal-light mb-6 text-sm">Explora nuestra tienda y encuentra los mejores productos para ti</p>
                                                <Link to="/tienda" className="btn btn-primary">Ir a la Tienda</Link>
                                            </div>
                                        ) : (
                                            orders.map((order) => {
                                                const items = orderItems(order);
                                                const firstItem = items[0];
                                                const isExpanded = expandedOrder === order.id;
                                                const shortId = order.id.slice(0, 8).toUpperCase();

                                                return (
                                                    <motion.div key={order.id} layout
                                                        className="bg-white rounded-2xl shadow-luxury overflow-hidden border border-charcoal/5 hover:border-gold/20 transition-colors">
                                                        {/* Order header */}
                                                        <div className="p-5 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                                                            <div className="flex items-center gap-4">
                                                                {firstItem?.image && (
                                                                    <img src={firstItem.image} alt="" className="w-14 h-14 rounded-xl object-cover bg-blush flex-shrink-0" />
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <span className="font-mono font-bold text-navy text-sm">#{shortId}</span>
                                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                                                                            {statusLabel(order.status)}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-charcoal-light mt-1">{fmtDate(order.created_at)} · {totalItems(order)} productos</p>
                                                                </div>
                                                                <div className="text-right flex-shrink-0">
                                                                    <p className="font-bold text-gold text-lg">{fmtMoney(Number(order.total))}</p>
                                                                    <p className="text-xs text-charcoal-light">MXN</p>
                                                                </div>
                                                                <svg className={`w-5 h-5 text-charcoal-light transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                                </svg>
                                                            </div>
                                                        </div>

                                                        {/* Expanded details */}
                                                        <AnimatePresence>
                                                            {isExpanded && (
                                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                                                                    className="overflow-hidden">
                                                                    <div className="px-5 pb-5 border-t border-charcoal/5 pt-4">
                                                                        {/* Products */}
                                                                        <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-3">Productos</p>
                                                                        <div className="space-y-3 mb-5">
                                                                            {items.map((item: any, idx: number) => (
                                                                                <div key={idx} className="flex items-center gap-3">
                                                                                    {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-blush" />}
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <p className="text-sm text-navy truncate">{item.name}</p>
                                                                                        <p className="text-xs text-charcoal-light">Cant: {item.quantity || 1}</p>
                                                                                    </div>
                                                                                    <p className="text-sm font-medium text-navy">{fmtMoney(item.price * (item.quantity || 1))}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>

                                                                        {/* Payment + Shipping */}
                                                                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                                                            <div className="bg-cream/60 rounded-xl p-3">
                                                                                <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-2">Pago</p>
                                                                                <p className="flex items-center gap-1">
                                                                                    <span>{paymentStatusIcon(order.payment_status)}</span>
                                                                                    <span className={`font-medium ${paymentStatusColor(order.payment_status)}`}>
                                                                                        {paymentStatusLabel(order.payment_status)}
                                                                                    </span>
                                                                                </p>
                                                                                {order.payment_method && (
                                                                                    <p className="text-xs text-charcoal-light mt-1">Método: {order.payment_method}</p>
                                                                                )}
                                                                                {order.payment_id && (
                                                                                    <p className="text-xs text-charcoal-light mt-1 font-mono">ID: {order.payment_id}</p>
                                                                                )}
                                                                            </div>
                                                                            {order.shipping_address && (
                                                                                <div className="bg-cream/60 rounded-xl p-3">
                                                                                    <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-2">Envío</p>
                                                                                    <p className="text-charcoal text-xs leading-relaxed">
                                                                                        {order.shipping_address.address && <>{order.shipping_address.address}<br /></>}
                                                                                        {order.shipping_address.city && <>{order.shipping_address.city}, </>}
                                                                                        {order.shipping_address.state && <>{order.shipping_address.state} </>}
                                                                                        {order.shipping_address.zip && <>CP {order.shipping_address.zip}</>}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        {/* Actions */}
                                                                        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-charcoal/5">
                                                                            <button onClick={() => handleRepeatOrder(order)}
                                                                                className="btn btn-ghost text-sm flex items-center gap-1.5 py-2">
                                                                                🔄 Repetir Pedido
                                                                            </button>
                                                                            <Link to="/solicitar-factura" className="btn btn-ghost text-sm flex items-center gap-1.5 py-2">
                                                                                🧾 Solicitar Factura
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}

                                {/* ══════ TAB: COTIZACIONES ══════ */}
                                {activeTab === 'quotations' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h2 className="font-serif text-xl text-navy">Mis Cotizaciones</h2>
                                            {quotations.length > 0 && (
                                                <span className="text-sm text-charcoal-light">{quotations.length} cotizacione(s)</span>
                                            )}
                                        </div>

                                        {loading ? (
                                            <div className="bg-white rounded-2xl p-12 shadow-luxury text-center">
                                                <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto"></div>
                                                <p className="text-charcoal-light mt-3 text-sm">Cargando cotizaciones...</p>
                                            </div>
                                        ) : quotations.length === 0 ? (
                                            <div className="bg-white rounded-2xl p-12 shadow-luxury text-center">
                                                <div className="text-5xl mb-4">📝</div>
                                                <h3 className="font-serif text-lg text-navy mb-2">Sin cotizaciones pendientes</h3>
                                                <p className="text-charcoal-light mb-6 text-sm">Comunícate con un asesor para solicitar un presupuesto especial</p>
                                            </div>
                                        ) : (
                                            quotations.map((quote) => {
                                                const isExpanded = expandedQuotation === quote.id;
                                                const shortId = quote.id.slice(0, 8).toUpperCase();
                                                const items = quotationItemsCache[quote.id] || [];

                                                const statusMap: Record<string, { label: string, color: string }> = {
                                                    'SENT': { label: 'Pendiente', color: 'bg-blue-100 text-blue-700' },
                                                    'ACCEPTED': { label: 'Aceptada', color: 'bg-emerald-100 text-emerald-700' },
                                                    'REJECTED': { label: 'Rechazada', color: 'bg-red-100 text-red-700' },
                                                    'CONVERTED': { label: 'Convertida a Orden', color: 'bg-purple-100 text-purple-700' },
                                                };
                                                const currentStatusInfo = statusMap[quote.status] || { label: quote.status, color: 'bg-gray-100 text-gray-700' };

                                                return (
                                                    <motion.div key={quote.id} layout
                                                        className="bg-white rounded-2xl shadow-luxury overflow-hidden border border-charcoal/5 hover:border-gold/20 transition-colors">
                                                        <div className="p-5 cursor-pointer" onClick={() => handleLoadQuotationItems(quote.id)}>
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0 text-2xl">
                                                                    📄
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <span className="font-mono font-bold text-navy text-sm">#{shortId}</span>
                                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${currentStatusInfo.color}`}>
                                                                            {currentStatusInfo.label}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-xs text-charcoal-light mt-1">{fmtDate(quote.created_at)}</p>
                                                                </div>
                                                                <div className="text-right flex-shrink-0">
                                                                    <p className="font-bold text-navy text-lg">{fmtMoney(Number(quote.total_amount))}</p>
                                                                    <p className="text-xs text-charcoal-light">MXN</p>
                                                                </div>
                                                                <svg className={`w-5 h-5 text-charcoal-light transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                                                </svg>
                                                            </div>
                                                        </div>

                                                        <AnimatePresence>
                                                            {isExpanded && (
                                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                                                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                                                                    className="overflow-hidden">
                                                                    <div className="px-5 pb-5 border-t border-charcoal/5 pt-4">
                                                                        <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-3">Detalle del Presupuesto</p>
                                                                        {items.length === 0 ? (
                                                                            <div className="py-2 flex justify-center"><div className="animate-spin w-5 h-5 border-2 border-gold border-t-transparent rounded-full"></div></div>
                                                                        ) : (
                                                                            <div className="space-y-3 mb-5">
                                                                                {items.map((item: any, idx: number) => {
                                                                                    // Get name from joined products table if available
                                                                                    const prodName = item.products?.name || item.resource_id;
                                                                                    const imgUrl = item.products?.images?.[0] || '';
                                                                                    
                                                                                    return (
                                                                                        <div key={idx} className="flex items-center gap-3">
                                                                                            {imgUrl ? 
                                                                                                <img src={imgUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-blush" /> :
                                                                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-xs text-slate-400 border border-slate-200">IMG</div>
                                                                                            }
                                                                                            <div className="flex-1 min-w-0">
                                                                                                <p className="text-sm text-navy truncate">{prodName}</p>
                                                                                                <p className="text-xs text-charcoal-light">Cant: {item.quantity}</p>
                                                                                            </div>
                                                                                            <p className="text-sm font-medium text-navy">{fmtMoney(item.unit_price * item.quantity)}</p>
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        )}

                                                                        {quote.notes && (
                                                                            <div className="bg-cream/60 rounded-xl p-3 mb-4">
                                                                                <p className="text-xs font-semibold text-navy/60 uppercase tracking-wider mb-1">Notas del Asesor</p>
                                                                                <p className="text-sm text-charcoal">{quote.notes}</p>
                                                                            </div>
                                                                        )}

                                                                        {quote.status === 'SENT' && (
                                                                            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-charcoal/5">
                                                                                <button onClick={() => handleUpdateQuotationStatus(quote.id, 'ACCEPTED')}
                                                                                    className="btn btn-primary text-sm flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 border-emerald-600">
                                                                                    ✅ Aceptar Presupuesto
                                                                                </button>
                                                                                <button onClick={() => handleUpdateQuotationStatus(quote.id, 'REJECTED')}
                                                                                    className="btn btn-ghost text-sm flex-1 py-2 text-red-600 hover:bg-red-50 hover:text-red-700">
                                                                                    ❌ Rechazar
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                        {quote.status === 'ACCEPTED' && (
                                                                            <div className="mt-4 pt-4 border-t border-charcoal/5 text-center">
                                                                                <p className="text-sm font-medium text-emerald-700 mb-3">¡Presupuesto Aceptado! Un asesor se contactará contigo para procesar la orden.</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}

                                {/* ══════ TAB: MIS PAGOS ══════ */}
                                {activeTab === 'payments' && (
                                    <div className="space-y-4">
                                        <h2 className="font-serif text-xl text-navy mb-2">Mis Pagos</h2>

                                        {/* Summary cards */}
                                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                            <div className="bg-white rounded-2xl p-5 shadow-luxury border border-charcoal/5">
                                                <p className="text-xs text-charcoal-light uppercase tracking-wider mb-1">Total Gastado</p>
                                                <p className="text-2xl font-bold text-gold">{fmtMoney(totalSpent)}</p>
                                                <p className="text-xs text-charcoal-light">MXN</p>
                                            </div>
                                            <div className="bg-white rounded-2xl p-5 shadow-luxury border border-charcoal/5">
                                                <p className="text-xs text-charcoal-light uppercase tracking-wider mb-1">Compras Completadas</p>
                                                <p className="text-2xl font-bold text-navy">{completedOrders.length}</p>
                                                <p className="text-xs text-charcoal-light">pedidos exitosos</p>
                                            </div>
                                        </div>

                                        {loading ? (
                                            <div className="bg-white rounded-2xl p-12 shadow-luxury text-center">
                                                <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto"></div>
                                            </div>
                                        ) : orders.length === 0 ? (
                                            <div className="bg-white rounded-2xl p-12 shadow-luxury text-center">
                                                <div className="text-5xl mb-4">💳</div>
                                                <h3 className="font-serif text-lg text-navy mb-2">Sin historial de pagos</h3>
                                                <p className="text-charcoal-light text-sm">Tus pagos aparecerán aquí cuando realices tu primera compra</p>
                                            </div>
                                        ) : (
                                            <div className="bg-white rounded-2xl shadow-luxury overflow-hidden">
                                                <div className="divide-y divide-charcoal/5">
                                                    {orders.map((order) => (
                                                        <div key={order.id} className="p-4 flex items-center gap-4 hover:bg-cream/40 transition-colors">
                                                            <div className={`text-2xl`}>
                                                                {paymentStatusIcon(order.payment_status)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-mono text-sm font-bold text-navy">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                                    <span className={`text-xs font-medium ${paymentStatusColor(order.payment_status)}`}>
                                                                        {paymentStatusLabel(order.payment_status)}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-charcoal-light mt-0.5">
                                                                    {fmtDate(order.created_at)}
                                                                    {order.payment_method && <> · {order.payment_method}</>}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-navy">{fmtMoney(Number(order.total))}</p>
                                                                {order.payment_id && (
                                                                    <p className="text-xs text-charcoal-light font-mono truncate max-w-[120px]">
                                                                        {order.payment_id}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ══════ TAB: MIS PROMOCIONES ══════ */}
                                {activeTab === 'promos' && (
                                    <div className="space-y-6">
                                        <h2 className="font-serif text-xl text-navy">Mis Promociones</h2>

                                        {/* Coupons */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-navy/60 uppercase tracking-wider mb-3">🏷️ Cupones Disponibles</h3>
                                            {coupons.length === 0 ? (
                                                <div className="bg-white rounded-2xl p-8 shadow-luxury text-center">
                                                    <div className="text-4xl mb-3">🎫</div>
                                                    <p className="text-charcoal-light text-sm">No hay cupones disponibles en este momento</p>
                                                </div>
                                            ) : (
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    {coupons.map((coupon) => (
                                                        <motion.div key={coupon.id} whileHover={{ scale: 1.02 }}
                                                            className="relative overflow-hidden rounded-2xl shadow-luxury border border-charcoal/5"
                                                            style={{
                                                                background: coupon.visual_design?.backgroundColor || 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                                                                color: coupon.visual_design?.textColor || '#ffffff',
                                                            }}>
                                                            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20"
                                                                style={{ background: coupon.visual_design?.textColor || '#D4AF37' }}></div>
                                                            <div className="p-5 relative z-10">
                                                                <div className="text-3xl font-bold font-serif mb-1">
                                                                    {coupon.discount_type === 'percentage'
                                                                        ? `${coupon.discount_value}% OFF`
                                                                        : `${fmtMoney(coupon.discount_value)} OFF`}
                                                                </div>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <span className="font-mono text-sm px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm">
                                                                        {coupon.code}
                                                                    </span>
                                                                    <button onClick={() => handleCopyCoupon(coupon.code)}
                                                                        className="text-xs underline opacity-80 hover:opacity-100 transition-opacity">
                                                                        {copiedCode === coupon.code ? '✓ Copiado' : 'Copiar'}
                                                                    </button>
                                                                </div>
                                                                <div className="text-xs opacity-70 space-y-0.5">
                                                                    {coupon.min_purchase > 0 && <p>Compra mínima: {fmtMoney(coupon.min_purchase)}</p>}
                                                                    {coupon.expiration_date && <p>Expira: {fmtDate(coupon.expiration_date)}</p>}
                                                                    {coupon.max_uses && <p>Usos restantes: {coupon.max_uses - coupon.usage_count}</p>}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Active Promotions */}
                                        <div>
                                            <h3 className="text-sm font-semibold text-navy/60 uppercase tracking-wider mb-3">🎉 Promociones Activas</h3>
                                            {promotions.length === 0 ? (
                                                <div className="bg-white rounded-2xl p-8 shadow-luxury text-center">
                                                    <div className="text-4xl mb-3">🛍️</div>
                                                    <p className="text-charcoal-light text-sm">No hay promociones activas en este momento</p>
                                                    <Link to="/tienda" className="btn btn-ghost text-sm mt-3 inline-block">Ver Tienda</Link>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {promotions.map((promo) => (
                                                        <div key={promo.id} className="bg-gradient-to-r from-gold/10 to-gold/5 rounded-2xl p-5 border border-gold/20">
                                                            <div className="flex items-start justify-between">
                                                                <div>
                                                                    <h4 className="font-serif text-lg text-navy">{promo.name}</h4>
                                                                    {promo.description && <p className="text-sm text-charcoal-light mt-1">{promo.description}</p>}
                                                                </div>
                                                                <span className="bg-gold text-white text-sm font-bold px-3 py-1 rounded-full flex-shrink-0">
                                                                    {promo.discount_type === 'percentage'
                                                                        ? `${promo.discount_value}%`
                                                                        : fmtMoney(promo.discount_value)}
                                                                </span>
                                                            </div>
                                                            <div className="mt-3 flex flex-wrap gap-3 text-xs text-charcoal-light">
                                                                {promo.min_purchase > 0 && <span>Min: {fmtMoney(promo.min_purchase)}</span>}
                                                                <span>Válida hasta: {fmtDate(promo.end_date)}</span>
                                                                {promo.code && <span className="font-mono bg-white px-2 py-0.5 rounded">Código: {promo.code}</span>}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ══════ TAB: MIS DIRECCIONES ══════ */}
                                {activeTab === 'addresses' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h2 className="font-serif text-xl text-navy">Mis Direcciones</h2>
                                            <button onClick={() => { setEditingAddress(null); setShowAddressForm(true); }}
                                                className="btn btn-primary text-sm py-2 px-4">+ Nueva Dirección</button>
                                        </div>

                                        {addresses.length === 0 && !showAddressForm ? (
                                            <div className="bg-white rounded-2xl p-12 shadow-luxury text-center">
                                                <div className="text-5xl mb-4">📍</div>
                                                <h3 className="font-serif text-lg text-navy mb-2">Sin direcciones guardadas</h3>
                                                <p className="text-charcoal-light text-sm mb-6">Guarda tus direcciones para un checkout más rápido</p>
                                                <button onClick={() => setShowAddressForm(true)} className="btn btn-primary">Agregar Dirección</button>
                                            </div>
                                        ) : (
                                            <>
                                                {addresses.map((addr) => (
                                                    <div key={addr.id} className="bg-white rounded-2xl p-5 shadow-luxury border border-charcoal/5 flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <span className="text-lg">📍</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="font-medium text-navy">{addr.label}</h4>
                                                                {addr.isDefault && (
                                                                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">Predeterminada</span>
                                                                )}
                                                            </div>
                                                            <p className="text-sm text-charcoal-light mt-1 leading-relaxed">
                                                                {addr.address}, {addr.city}, {addr.state} CP {addr.zip}
                                                            </p>
                                                            {addr.references && (
                                                                <p className="text-xs text-charcoal-light/70 mt-1">Ref: {addr.references}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2 flex-shrink-0">
                                                            <button onClick={() => { setEditingAddress(addr); setShowAddressForm(true); }}
                                                                className="text-sm text-gold hover:underline">Editar</button>
                                                            <button onClick={() => handleDeleteAddress(addr.id)}
                                                                className="text-sm text-red-400 hover:underline">Eliminar</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}

                                        {/* Address form */}
                                        <AnimatePresence>
                                            {showAddressForm && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                                    <AddressForm
                                                        address={editingAddress}
                                                        onSave={handleSaveAddress}
                                                        onCancel={() => { setShowAddressForm(false); setEditingAddress(null); }}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* ══════ TAB: MI PERFIL ══════ */}
                                {activeTab === 'profile' && (
                                    <div className="bg-white rounded-2xl p-6 shadow-luxury">
                                        <h2 className="font-serif text-xl text-navy mb-6">Mi Perfil</h2>
                                        <div className="space-y-5 max-w-lg">
                                            <div>
                                                <label className="block text-sm font-medium text-navy/80 mb-2">Nombre Completo</label>
                                                <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)}
                                                    className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-navy/80 mb-2">Email</label>
                                                <input type="email" value={user?.email || ''} disabled
                                                    className="w-full px-4 py-3 border border-charcoal/10 rounded-xl bg-charcoal/5 text-charcoal-light" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-navy/80 mb-2">Teléfono</label>
                                                <input type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)}
                                                    placeholder="55 1234 5678"
                                                    className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all" />
                                            </div>

                                            {/* Password change */}
                                            <div className="pt-4 border-t border-charcoal/10">
                                                <button onClick={() => setChangingPassword(!changingPassword)}
                                                    className="text-sm text-gold hover:underline flex items-center gap-1">
                                                    🔒 {changingPassword ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
                                                </button>
                                                <AnimatePresence>
                                                    {changingPassword && (
                                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }} className="space-y-3 mt-4 overflow-hidden">
                                                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                                                placeholder="Nueva contraseña"
                                                                className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none" />
                                                            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                                                placeholder="Confirmar contraseña"
                                                                className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none" />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {profileMsg && (
                                                <p className={`text-sm ${profileMsg.startsWith('✅') ? 'text-emerald-600' : 'text-red-500'}`}>{profileMsg}</p>
                                            )}

                                            <button onClick={handleSaveProfile} className="btn btn-primary">Guardar Cambios</button>
                                        </div>
                                    </div>
                                )}

                                {/* ══════ TAB: STATUS PROVEEDOR ══════ */}
                                {activeTab === 'solicitud' && user?.role === 'DISTRIBUIDOR' && (
                                    <div className="bg-white rounded-2xl p-6 shadow-luxury">
                                        <h2 className="font-serif text-xl text-navy mb-6">Estado de tu Solicitud de Proveedor</h2>
                                        <div className="border border-green-200 bg-green-50 p-6 rounded-xl relative overflow-hidden">
                                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-200/50 rounded-full blur-xl"></div>
                                            <div className="flex items-start gap-4 relative z-10">
                                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-2xl">✅</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-serif text-lg text-green-800 font-semibold">¡Aprobado! (Activo)</h3>
                                                    <p className="text-green-700 mt-1">Actualmente disfrutas de los beneficios de cuenta <b>DISTRIBUIDOR</b> activo. Eres elegible para comprar de mayoreo con descuentos exclusivos.</p>
                                                    <div className="mt-4 pt-4 border-t border-green-200/50">
                                                        <p className="text-sm font-medium text-green-800">Próxima renovación: <span className="font-normal text-green-700">Automática</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ══════ TAB: CALCULADORA ══════ */}
                                {activeTab === 'calculadora' && user?.role === 'DISTRIBUIDOR' && (
                                    <div className="bg-white rounded-2xl p-6 shadow-luxury">
                                        <h2 className="font-serif text-xl text-navy mb-2">Calculadora de Ganancias</h2>
                                        <p className="text-charcoal-light mb-6 text-sm">Calcula cuánto puedes ganar al invertir como distribuidor.</p>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="bg-cream/50 p-6 rounded-xl border border-gold/20">
                                                <label className="block text-sm font-medium text-navy mb-2">Monto de Inversión (MXN)</label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light text-lg">$</span>
                                                    <input type="number" min={1000} step={500} value={investmentAmount}
                                                        onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                                        className="w-full bg-white border border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold rounded-lg py-3 pl-8 pr-4 outline-none font-medium text-lg text-navy" />
                                                </div>
                                                <input type="range" min="1000" max="50000" step="500" value={investmentAmount}
                                                    onChange={(e) => setInvestmentAmount(Number(e.target.value))} className="w-full mt-6 accent-gold" />
                                                <div className="flex justify-between text-xs text-charcoal-light mt-2">
                                                    <span>$1,000</span><span>$50,000+</span>
                                                </div>
                                            </div>
                                            <div className="bg-forest text-cream p-6 rounded-xl relative overflow-hidden flex flex-col justify-center">
                                                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gold/20 rounded-full blur-3xl"></div>
                                                <div className="relative z-10 text-center">
                                                    <p className="text-cream/70 text-sm font-medium uppercase tracking-wider mb-1">Tus Ganancias Estimadas</p>
                                                    <div className="text-4xl font-serif text-gold mb-4">
                                                        +{fmtMoney(investmentAmount * 0.45)}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-left border-t border-cream/10 pt-4 mt-2">
                                                        <div>
                                                            <p className="text-xs text-cream/50">Valor Mercado</p>
                                                            <p className="font-medium">{fmtMoney(investmentAmount * 1.45)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-cream/50">Margen Promedio</p>
                                                            <p className="font-medium text-gold">45%</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-6 p-4 bg-surface text-forest text-sm rounded-lg flex items-start gap-3">
                                            <span className="text-lg">ℹ️</span>
                                            <p>Esta es una estimación basada en el descuento de mayoreo estándar. Los márgenes reales pueden variar.</p>
                                        </div>
                                    </div>
                                )}

                                {/* ══════ ERP: HOME DASHBOARD ══════ */}
                                {activeTab === 'home' && isERP && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h2 className="font-serif text-xl text-navy">
                                                Panel de {ROLE_LABELS[user?.role || ''] || user?.role}
                                            </h2>
                                            <Link to="/admin" className="btn btn-primary text-sm py-2 px-4 flex items-center gap-2">
                                                🛡️ Ir al Panel Completo
                                            </Link>
                                        </div>

                                        {loading ? (
                                            <div className="bg-white rounded-2xl p-12 shadow-luxury text-center">
                                                <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto"></div>
                                            </div>
                                        ) : (
                                            <>
                                                {/* ADMIN stats */}
                                                {user?.role === 'ADMIN' && (
                                                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                        <StatCard icon="📦" label="Pedidos (30 días)" value={erpStats.recentOrders || 0} color="bg-blue-50 text-blue-600" />
                                                        <StatCard icon="⚠️" label="Productos Stock Bajo" value={erpStats.lowStock || 0} color="bg-amber-50 text-amber-600" />
                                                        <StatCard icon="🤝" label="Solicitudes Dist." value={erpStats.pendingDist || 0} color="bg-purple-50 text-purple-600" />
                                                        <StatCard icon="🏭" label="Producción Activa" value={erpStats.production?.inProgress || 0} color="bg-emerald-50 text-emerald-600" />
                                                    </div>
                                                )}
                                                {/* EJECUTIVO stats */}
                                                {user?.role === 'EJECUTIVO' && (
                                                    <div className="grid sm:grid-cols-3 gap-4">
                                                        <StatCard icon="📦" label="Pedidos (30 días)" value={erpStats.recentOrders || 0} color="bg-blue-50 text-blue-600" />
                                                        <StatCard icon="⚠️" label="Stock Bajo" value={erpStats.lowStock || 0} color="bg-amber-50 text-amber-600" />
                                                        <StatCard icon="🤝" label="Solicitudes Dist." value={erpStats.pendingDist || 0} color="bg-purple-50 text-purple-600" />
                                                    </div>
                                                )}
                                                {/* FABRICA stats */}
                                                {user?.role === 'FABRICA' && (
                                                    <div className="grid sm:grid-cols-3 gap-4">
                                                        <StatCard icon="🏭" label="Producción Activa" value={erpStats.production?.inProgress || 0} color="bg-blue-50 text-blue-600" />
                                                        <StatCard icon="✅" label="Completadas" value={erpStats.production?.completed || 0} color="bg-emerald-50 text-emerald-600" />
                                                        <StatCard icon="📤" label="Pendientes Envío" value={erpStats.warehouse?.pendingOrders || 0} color="bg-amber-50 text-amber-600" />
                                                    </div>
                                                )}
                                                {/* ALMACEN stats */}
                                                {(user?.role === 'ALMACEN_MATERIA_PRIMA' || user?.role === 'ALMACEN_PRODUCTO_FINAL') && (
                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                        <StatCard icon="📤" label="Pendientes Despacho" value={erpStats.warehouse?.pendingOrders || 0} color="bg-amber-50 text-amber-600" />
                                                        <StatCard icon="🚛" label="Despachados" value={erpStats.warehouse?.dispatchedOrders || 0} color="bg-emerald-50 text-emerald-600" />
                                                    </div>
                                                )}
                                                {/* TRANSPORTISTA stats */}
                                                {user?.role === 'TRANSPORTISTA' && (
                                                    <div className="grid sm:grid-cols-3 gap-4">
                                                        <StatCard icon="🚛" label="Entregas Asignadas" value={deliveries.length} color="bg-blue-50 text-blue-600" />
                                                        <StatCard icon="✅" label="Vehículos Disponibles" value={erpStats.vehicles?.available || 0} color="bg-emerald-50 text-emerald-600" />
                                                        <StatCard icon="🔧" label="En Mantenimiento" value={erpStats.vehicles?.maintenance || 0} color="bg-amber-50 text-amber-600" />
                                                    </div>
                                                )}

                                                {/* Quick access for all ERP */}
                                                <div className="bg-white rounded-2xl p-6 shadow-luxury">
                                                    <h3 className="font-serif text-lg text-navy mb-4">Acceso Rápido</h3>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                        {getLinksForRole().slice(0, 4).map((link) => (
                                                            <Link key={link.path} to={link.path}
                                                                className="flex flex-col items-center p-4 bg-cream/50 hover:bg-gold/10 rounded-xl transition-colors group border border-charcoal/5 hover:border-gold/20">
                                                                <span className="text-2xl mb-2">{link.icon}</span>
                                                                <span className="text-sm font-medium text-navy group-hover:text-gold">{link.label}</span>
                                                                <span className="text-xs text-charcoal-light mt-0.5">{link.desc}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* ══════ ERP: CRM MODULES ══════ */}
                                {activeTab === 'crm' && (
                                    <CRMDirectory />
                                )}
                                {activeTab === 'quoter' && (
                                    <Quoter />
                                )}
                                {activeTab === 'kanban' && (
                                    <KanbanLogistics />
                                )}
                                {activeTab === 'analytics' && (
                                    <AnalyticsDashboard />
                                )}

                                {/* ══════ ERP: MÓDULOS (QUICKLINKS) ══════ */}
                                {activeTab === 'quicklinks' && isERP && (
                                    <div className="space-y-4">
                                        <h2 className="font-serif text-xl text-navy mb-2">Módulos del Sistema</h2>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {getLinksForRole().map((link) => (
                                                <Link key={link.path} to={link.path}
                                                    className="bg-white rounded-2xl p-5 shadow-luxury border border-charcoal/5 hover:border-gold/20 hover:shadow-md transition-all group flex flex-col items-center text-center">
                                                    <span className="text-3xl mb-3">{link.icon}</span>
                                                    <span className="font-medium text-navy group-hover:text-gold text-sm">{link.label}</span>
                                                    <span className="text-xs text-charcoal-light mt-1">{link.desc}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ══════ TRANSPORTISTA: MIS ENTREGAS ══════ */}
                                {activeTab === 'deliveries' && user?.role === 'TRANSPORTISTA' && (
                                    <div className="space-y-4">
                                        <h2 className="font-serif text-xl text-navy mb-2">Mis Entregas</h2>
                                        {deliveries.length === 0 ? (
                                            <div className="bg-white rounded-2xl p-12 shadow-luxury text-center">
                                                <div className="text-5xl mb-4">🚛</div>
                                                <h3 className="font-serif text-lg text-navy mb-2">Sin entregas asignadas</h3>
                                                <p className="text-charcoal-light text-sm">Las entregas asignadas aparecerán aquí</p>
                                            </div>
                                        ) : (
                                            <div className="bg-white rounded-2xl shadow-luxury overflow-hidden">
                                                <div className="divide-y divide-charcoal/5">
                                                    {deliveries.map((d: any) => (
                                                        <div key={d.id} className="p-4 flex items-center gap-4 hover:bg-cream/40 transition-colors">
                                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                                <span className="text-lg">{d.status === 'COMPLETED' ? '✅' : d.status === 'IN_TRANSIT' ? '🚛' : '📋'}</span>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-mono text-sm font-bold text-navy">#{d.id?.slice(0, 8).toUpperCase()}</p>
                                                                <p className="text-xs text-charcoal-light">
                                                                    {d.status === 'ASSIGNED' && 'Asignada'}
                                                                    {d.status === 'IN_TRANSIT' && 'En Tránsito'}
                                                                    {d.status === 'COMPLETED' && 'Completada'}
                                                                    {d.status === 'CANCELLED' && 'Cancelada'}
                                                                    {d.created_at && ` · ${fmtDate(d.created_at)}`}
                                                                </p>
                                                            </div>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                d.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                                                d.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700' :
                                                                d.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                                'bg-amber-100 text-amber-700'
                                                            }`}>
                                                                {d.status === 'ASSIGNED' ? 'Asignada' : d.status === 'IN_TRANSIT' ? 'En Tránsito' : d.status === 'COMPLETED' ? 'Completada' : 'Cancelada'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════
// Address Form Sub-component
// ═══════════════════════════════════════════════════════
function AddressForm({ address, onSave, onCancel }: {
    address: SavedAddress | null;
    onSave: (addr: SavedAddress) => void;
    onCancel: () => void;
}) {
    const [form, setForm] = useState<SavedAddress>(address || {
        id: crypto.randomUUID(),
        label: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        references: '',
        isDefault: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-luxury border border-gold/20">
            <h3 className="font-serif text-lg text-navy mb-4">{address ? 'Editar Dirección' : 'Nueva Dirección'}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-navy/80 mb-1">Etiqueta</label>
                    <input type="text" name="label" value={form.label} onChange={handleChange} placeholder="Ej: Casa, Oficina, Local"
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none" />
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-navy/80 mb-1">Dirección Completa</label>
                    <input type="text" name="address" value={form.address} onChange={handleChange}
                        placeholder="Calle, número, colonia"
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-navy/80 mb-1">Ciudad</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange}
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-navy/80 mb-1">Estado</label>
                    <input type="text" name="state" value={form.state} onChange={handleChange}
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-navy/80 mb-1">Código Postal</label>
                    <input type="text" name="zip" value={form.zip} onChange={handleChange}
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-navy/80 mb-1 flex items-center gap-2">
                        <input type="checkbox" checked={form.isDefault}
                            onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                            className="accent-gold w-4 h-4" />
                        Dirección predeterminada
                    </label>
                </div>
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-navy/80 mb-1">Referencias</label>
                    <textarea name="references" value={form.references} onChange={handleChange}
                        placeholder="Entre calles, fachada, etc." rows={2}
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none resize-none" />
                </div>
            </div>
            <div className="flex gap-3 mt-5">
                <button onClick={() => onSave(form)} className="btn btn-primary">Guardar</button>
                <button onClick={onCancel} className="btn btn-ghost">Cancelar</button>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════
// Stat Card Sub-component (ERP dashboards)
// ═══════════════════════════════════════════════════════
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number | string; color: string }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-luxury border border-charcoal/5">
            <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
                    <span className="text-xl">{icon}</span>
                </div>
                <div>
                    <p className="text-2xl font-bold text-navy">{value}</p>
                    <p className="text-xs text-charcoal-light">{label}</p>
                </div>
            </div>
        </motion.div>
    );
}
