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
            <div className="min-h-screen bg-cream flex items-center justify-center">
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
        <div className="min-h-screen bg-cream py-12">
            <div className="container-luxury">
                {/* Success Message */}
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8 text-center"
                    >
                        <p className="text-green-700 font-medium">
                            ✅ ¡Pedido realizado con éxito! Te enviaremos confirmación por email.
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
                                    { id: 'orders', label: 'Mis Pedidos', icon: '📦' },
                                    { id: 'profile', label: 'Mi Perfil', icon: '👤' },
                                    { id: 'addresses', label: 'Direcciones', icon: '📍' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${activeTab === item.id
                                                ? 'bg-gold text-white'
                                                : 'hover:bg-blush text-charcoal'
                                            }`}
                                    >
                                        <span>{item.icon}</span>
                                        {item.label}
                                    </button>
                                ))}
                            </nav>

                            <hr className="my-6 border-charcoal/10" />

                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            >
                                🚪 Cerrar Sesión
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
                                                        🔄 Repetir Pedido
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
