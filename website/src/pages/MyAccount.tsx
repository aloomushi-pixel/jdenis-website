import { useEffect, useState } from 'react';
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
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState('orders');
    const showSuccess = searchParams.get('pedido') === 'exito';

    useEffect(() => {
        // Simular carga de pedidos
        setOrders([
            { id: 'ORD-2024-001', date: '2024-01-15', status: 'Entregado', total: 1850, items: 3 },
            { id: 'ORD-2024-002', date: '2024-01-20', status: 'En camino', total: 950, items: 2 },
        ]);
    }, []);

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
                    </main>
                </div>
            </div>
        </div>
    );
}
