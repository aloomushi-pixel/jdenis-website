import { motion } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { getUsers, updateUserRole, type ERPUser, type UserRole } from '../../lib/erp';

const ROLES: { value: UserRole; label: string; color: string }[] = [
    { value: 'ADMIN', label: 'Administrador', color: 'bg-red-100 text-red-700' },
    { value: 'EJECUTIVO', label: 'Ejecutivo', color: 'bg-purple-100 text-purple-700' },
    { value: 'FABRICA', label: 'Fábrica', color: 'bg-amber-100 text-amber-700' },
    { value: 'ALMACEN_MATERIA_PRIMA', label: 'Almacén MP', color: 'bg-blue-100 text-blue-700' },
    { value: 'ALMACEN_PRODUCTO_FINAL', label: 'Almacén PF', color: 'bg-cyan-100 text-cyan-700' },
    { value: 'TRANSPORTISTA', label: 'Transportista', color: 'bg-green-100 text-green-700' },
    { value: 'CLIENTE', label: 'Cliente', color: 'bg-gray-100 text-gray-700' },
    { value: 'DISTRIBUIDOR', label: 'Distribuidor', color: 'bg-gold/20 text-gold-dark' },
];

export default function UserManager() {
    const [users, setUsers] = useState<ERPUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<UserRole | ''>('');
    const [search, setSearch] = useState('');
    const [saving, setSaving] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUsers(filter || undefined);
            setUsers(data);
        } catch (e) {
            console.error('Error loading users:', e);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        setSaving(userId);
        try {
            await updateUserRole(userId, newRole);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        } catch (e) {
            console.error('Error changing role:', e);
        } finally {
            setSaving(null);
        }
    };

    const filtered = users.filter(u => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (u.email?.toLowerCase().includes(s) || u.fullName?.toLowerCase().includes(s));
    });

    const getRoleBadge = (role: UserRole) => {
        const r = ROLES.find(x => x.value === role);
        return r ? `${r.color}` : 'bg-gray-100 text-gray-600';
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> Gestor de Usuarios</h1>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                    />
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value as UserRole | '')}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-300 outline-none"
                    >
                        <option value="">Todos los Roles</option>
                        {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Usuario</th>
                                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Email</th>
                                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Rol</th>
                                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Cambiar Rol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                                    {(user.fullName?.[0] || user.email?.[0] || '?').toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-800">{user.fullName || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                                                {ROLES.find(r => r.value === user.role)?.label || user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={e => handleRoleChange(user.id, e.target.value as UserRole)}
                                                disabled={saving === user.id}
                                                className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white disabled:opacity-50"
                                            >
                                                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No se encontraron usuarios</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-100">
                        {filtered.length} usuario(s) encontrado(s)
                    </div>
                </motion.div>
            )}
        </div>
    );
}
