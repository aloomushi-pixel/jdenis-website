import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUsersPaginated, adminUpdateUser, type ERPUser, type UserRole } from '../../lib/erp';
import { supabase } from '../../lib/supabase';

const ROLES: { value: UserRole; label: string; color: string; badge: string }[] = [
    { value: 'ADMIN', label: 'Administrador', color: 'text-red-700', badge: 'bg-red-100 text-red-700 border-red-200' },
    { value: 'EJECUTIVO', label: 'Ejecutivo', color: 'text-purple-700', badge: 'bg-purple-100 text-purple-700 border-purple-200' },
    { value: 'FABRICA', label: 'Fábrica', color: 'text-amber-700', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
    { value: 'ALMACEN_MATERIA_PRIMA', label: 'Almacén MP', color: 'text-blue-700', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'ALMACEN_PRODUCTO_FINAL', label: 'Almacén PF', color: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
    { value: 'TRANSPORTISTA', label: 'Transportista', color: 'text-green-700', badge: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'CLIENTE', label: 'Cliente', color: 'text-gray-700', badge: 'bg-gray-100 text-gray-700 border-gray-200' },
    { value: 'DISTRIBUIDOR', label: 'Distribuidor', color: 'text-gold-dark', badge: 'bg-gold/20 text-gold-dark border-gold/30' },
];

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function UserManager() {
    const [users, setUsers] = useState<ERPUser[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    // Filters & Pagination
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [filterRole, setFilterRole] = useState<UserRole | ''>('');
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', fullName: '', role: 'CLIENTE' as UserRole });
    const [inviting, setInviting] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const { data, count } = await getUsersPaginated(page, pageSize, filterRole, debouncedSearch);
            setUsers(data);
            setTotalUsers(count);
        } catch (e) {
            console.error('Error loading users:', e);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, filterRole, debouncedSearch]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Reset to page 1 on filter change
    useEffect(() => {
        setPage(1);
    }, [filterRole, debouncedSearch]);

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        setSaving(userId);
        try {
            await adminUpdateUser(userId, { role: newRole });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (e: any) {
            console.error('Error changing role:', e);
            alert(e.message || 'Error al cambiar rol');
        } finally {
            setSaving(null);
        }
    };

    const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
        if (!confirm(`¿Estás seguro de que deseas ${currentStatus ? 'suspender' : 'reactivar'} a este usuario?`)) return;
        setSaving(userId);
        try {
            const newStatus = !currentStatus;
            await adminUpdateUser(userId, { is_active: newStatus });
            
            // Invoke edge function to sign out / ban
            await supabase.functions.invoke('admin-manage-users', {
                body: {
                    action: 'ban_user',
                    payload: { target_user_id: userId, is_banned: !newStatus }
                }
            });

            setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: newStatus } : u));
        } catch (e: any) {
            console.error('Error changing status:', e);
            alert(e.message || 'Error al cambiar el estado');
        } finally {
            setSaving(null);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviting(true);
        try {
            const { data: result, error } = await supabase.functions.invoke('admin-manage-users', {
                body: {
                    action: 'invite_user',
                    payload: inviteData
                }
            });

            if (error) throw new Error(error.message || 'Error al invitar usuario');
            if (result?.error) throw new Error(result.error);

            alert('Usuario invitado correctamente. Se le ha enviado un correo.');
            setIsModalOpen(false);
            setInviteData({ email: '', fullName: '', role: 'CLIENTE' });
            fetchUsers();
        } catch (e: any) {
            console.error(e);
            alert(e.message || 'Error enviando invitación');
        } finally {
            setInviting(false);
        }
    };

    const totalPages = Math.ceil(totalUsers / pageSize);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestor de Usuarios</h1>
                    <p className="text-sm text-gray-500 mt-1">Administra el acceso, roles y estados de todo el personal y clientes.</p>
                </div>
                
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none w-full sm:w-64"
                        />
                    </div>
                    <select
                        value={filterRole}
                        onChange={e => setFilterRole(e.target.value as UserRole | '')}
                        className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer"
                    >
                        <option value="">Todos los roles</option>
                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Invitar Usuario
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="flex flex-col items-center gap-3">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                            <span className="text-sm font-medium text-indigo-600 animate-pulse">Cargando usuarios...</span>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha Registro</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence>
                                {users.map((user) => (
                                    <motion.tr 
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border ${user.is_active !== false ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                    {(user.fullName?.[0] || user.email?.[0] || '?').toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className={`font-semibold ${user.is_active !== false ? 'text-gray-900' : 'text-gray-500'}`}>
                                                        {user.fullName || 'Usuario Sin Nombre'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <select
                                                value={user.role}
                                                onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                                                disabled={saving === user.id || user.is_active === false}
                                                className={`px-3 py-1.5 border rounded-lg text-xs font-semibold uppercase tracking-wide cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:ring-2 focus:ring-indigo-500 ${ROLES.find(r => r.value === user.role)?.badge || 'bg-gray-100 text-gray-700'}`}
                                            >
                                                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-6 py-5">
                                            {user.is_active !== false ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Activo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Suspendido
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-500">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => handleToggleStatus(user.id, user.is_active !== false)}
                                                disabled={saving === user.id}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm border disabled:opacity-50 ${
                                                    user.is_active !== false 
                                                        ? 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50' 
                                                        : 'bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                                                }`}
                                            >
                                                {saving === user.id ? 'Guardando...' : (user.is_active !== false ? 'Suspender' : 'Reactivar')}
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {!loading && users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900">No hay usuarios</h3>
                                            <p className="text-gray-500 mt-1 max-w-sm">No se encontraron usuarios que coincidan con los filtros de búsqueda.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalUsers > 0 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Mostrando <span className="font-semibold text-gray-900">{(page - 1) * pageSize + 1}</span> a <span className="font-semibold text-gray-900">{Math.min(page * pageSize, totalUsers)}</span> de <span className="font-semibold text-gray-900">{totalUsers}</span> usuarios
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                                className="px-3 py-1.5 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages || loading}
                                className="px-3 py-1.5 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">Invitar Nuevo Usuario</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <form onSubmit={handleInvite} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={inviteData.fullName}
                                        onChange={e => setInviteData({ ...inviteData, fullName: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        required
                                        value={inviteData.email}
                                        onChange={e => setInviteData({ ...inviteData, email: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                        placeholder="correo@empresa.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol Asignado</label>
                                    <select
                                        value={inviteData.role}
                                        onChange={e => setInviteData({ ...inviteData, role: e.target.value as UserRole })}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                    >
                                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                    </select>
                                </div>
                                
                                <div className="pt-2 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={inviting}
                                        className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-70 flex justify-center items-center"
                                    >
                                        {inviting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : 'Enviar Invitación'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
