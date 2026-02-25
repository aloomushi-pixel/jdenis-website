import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

interface Order {
    id: string;
    date: string;
    status: string;
    total: number;
    items: number;
}

export default function MyAccount() {
    const { user, logout, isAuthenticated } = useAuthStore();
    const [searchParams] = useSearchParams();
    const [orders] = useState<Order[]>([
        { id: 'ORD-2024-001', date: '2024-01-15', status: 'Entregado', total: 1850, items: 3 },
        { id: 'ORD-2024-002', date: '2024-01-20', status: 'En camino', total: 950, items: 2 },
    ]);
    const [activeTab, setActiveTab] = useState('orders');
    const [investmentAmount, setInvestmentAmount] = useState<number>(5000);
    const showSuccess = searchParams.get('pedido') === 'exito';

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-cream pt-32 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="section-title mb-4">Acceso Requerido</h2>
                    <Link to="/login" className="btn btn-primary">
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        'Entregado': 'badge-success',
        'En camino': 'badge-gold',
        'Procesando': 'badge-navy',
    };

    return (
        <div className="min-h-screen bg-cream pt-32 pb-12">
            <div className="container-luxury">
                {/* Success Message */}
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-center"
                    >
                        <p className="text-green-700 font-medium">
                            <svg className="w-5 h-5 inline mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> ¡Pedido realizado con éxito! Te enviaremos confirmación por email.
                        </p>
                    </motion.div>
                )}

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-luxury">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl text-gold font-serif">
                                        {user?.fullName?.[0] || 'U'}
                                    </span>
                                </div>
                                <h3 className="font-serif text-lg text-navy">{user?.fullName}</h3>
                                <p className="text-sm text-charcoal-light">{user?.email}</p>
                            </div>

                            <nav className="space-y-2">
                                {[
                                    { id: 'orders', label: 'Mis Pedidos', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" /></svg> },
                                    { id: 'profile', label: 'Mi Perfil', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg> },
                                    { id: 'addresses', label: 'Direcciones', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg> },
                                    ...(user?.role === 'DISTRIBUIDOR' ? [
                                        { id: 'solicitud', label: 'Status Proveedor', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                                        { id: 'calculadora', label: 'Calculadora Inversión', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg> },
                                    ] : [])
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${activeTab === item.id
                                            ? 'bg-gold text-white'
                                            : 'hover:bg-blush text-charcoal'
                                            }`}
                                    >
                                        <span className="w-5 h-5">{item.icon}</span>
                                        {item.label}
                                    </button>
                                ))}
                            </nav>

                            {['ADMIN', 'EJECUTIVO', 'FABRICA', 'ALMACEN_MATERIA_PRIMA', 'ALMACEN_PRODUCTO_FINAL', 'TRANSPORTISTA'].includes(user?.role || '') && (
                                <Link
                                    to="/admin"
                                    className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 hover:bg-forest bg-forest/5 text-forest hover:text-cream mt-2 font-medium"
                                >
                                    <span className="w-5 h-5"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg></span>
                                    Panel Administrativo
                                </Link>
                            )}

                            <hr className="my-6 border-charcoal/10" />

                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <svg className="w-5 h-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg> Cerrar Sesión
                            </button>
                        </div>
                    </aside>

                    {/* Content */}
                    <main className="lg:col-span-3">
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-2xl p-6 shadow-luxury">
                                <h2 className="font-serif text-xl text-navy mb-6">Historial de Pedidos</h2>

                                {orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <p className="text-charcoal-light mb-4">Aún no tienes pedidos</p>
                                        <Link to="/tienda" className="btn btn-primary">
                                            Ir a la Tienda
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="border border-charcoal/10 rounded-xl p-4 hover:border-gold/30 transition-colors"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-4">
                                                    <div>
                                                        <p className="font-medium text-navy">{order.id}</p>
                                                        <p className="text-sm text-charcoal-light">
                                                            {new Date(order.date).toLocaleDateString('es-MX', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-gold font-semibold">
                                                            ${order.total.toLocaleString()} MXN
                                                        </p>
                                                        <p className="text-sm text-charcoal-light">
                                                            {order.items} productos
                                                        </p>
                                                    </div>
                                                    <span className={`badge ${statusColors[order.status] || 'badge-navy'}`}>
                                                        {order.status}
                                                    </span>
                                                    <button className="btn btn-ghost text-sm">
                                                        <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg> Repetir Pedido
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-2xl p-6 shadow-luxury">
                                <h2 className="font-serif text-xl text-navy mb-6">Mi Perfil</h2>
                                <form className="space-y-4 max-w-md">
                                    <div>
                                        <label className="label">Nombre Completo</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.fullName}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Email</label>
                                        <input
                                            type="email"
                                            defaultValue={user?.email}
                                            className="input"
                                            disabled
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        Guardar Cambios
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="bg-white rounded-2xl p-6 shadow-luxury">
                                <h2 className="font-serif text-xl text-navy mb-6">Mis Direcciones</h2>
                                <p className="text-charcoal-light">
                                    Próximamente podrás guardar múltiples direcciones de envío.
                                </p>
                            </div>
                        )}

                        {activeTab === 'solicitud' && user?.role === 'DISTRIBUIDOR' && (
                            <div className="bg-white rounded-2xl p-6 shadow-luxury">
                                <h2 className="font-serif text-xl text-navy mb-6">Estado de tu Solicitud de Proveedor</h2>
                                <div className="border border-green-200 bg-green-50 p-6 rounded-xl relative overflow-hidden">
                                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-200/50 rounded-full blur-xl"></div>
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
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

                        {activeTab === 'calculadora' && user?.role === 'DISTRIBUIDOR' && (
                            <div className="bg-white rounded-2xl p-6 shadow-luxury">
                                <h2 className="font-serif text-xl text-navy mb-2">Calculadora de Ganancias</h2>
                                <p className="text-charcoal-light mb-6">Calcula cuánto puedes ganar al invertir como distribuidor aplicando tus precios preferenciales.</p>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="bg-cream/50 p-6 rounded-xl border border-gold/20">
                                        <label className="block text-sm font-medium text-navy mb-2">Monto de Inversión (MXN)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-light text-lg">$</span>
                                            <input
                                                type="number"
                                                min={1000}
                                                step={500}
                                                value={investmentAmount}
                                                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                                className="w-full bg-white border border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold rounded-lg py-3 pl-8 pr-4 outline-none transition-all font-medium text-lg text-navy"
                                            />
                                        </div>
                                        <input
                                            type="range"
                                            min="1000"
                                            max="50000"
                                            step="500"
                                            value={investmentAmount}
                                            onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                            className="w-full mt-6 accent-gold"
                                        />
                                        <div className="flex justify-between text-xs text-charcoal-light mt-2">
                                            <span>$1,000</span>
                                            <span>$50,000+</span>
                                        </div>
                                    </div>

                                    <div className="bg-forest text-cream p-6 rounded-xl relative overflow-hidden flex flex-col justify-center">
                                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gold/20 rounded-full blur-3xl"></div>

                                        <div className="relative z-10 text-center">
                                            <p className="text-cream/70 text-sm font-medium uppercase tracking-wider mb-1">Tus Ganancias Estimadas</p>
                                            <div className="text-4xl font-serif text-gold mb-4">
                                                +${(investmentAmount * 0.45).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-left border-t border-cream/10 pt-4 mt-2">
                                                <div>
                                                    <p className="text-xs text-cream/50">Valor Mercado</p>
                                                    <p className="font-medium">${(investmentAmount * 1.45).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-cream/50">Margen Promedio</p>
                                                    <p className="font-medium text-gold">45%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 p-4 bg-blue-50 text-blue-800 text-sm rounded-lg flex items-start gap-3">
                                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                                    <p>Esta es una estimación basada en el descuento de mayoreo estándar. Los márgenes reales pueden variar dependiendo del producto exacto y volumen final de compra.</p>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
