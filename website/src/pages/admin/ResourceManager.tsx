import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
    createResource,
    deleteResource,
    getResourceCategories, getResources,
    updateResource,
    type Resource, type ResourceCategory
} from '../../lib/erp';

export default function ResourceManager() {
    const [categories, setCategories] = useState<ResourceCategory[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Resource | null>(null);
    const [form, setForm] = useState({ custom_id: '', title: '', format: 'PIEZA', quantity: 0, min_quantity: 0, brand: '', unit_cost: 0, description: '', category_id: '' });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            const cats = await getResourceCategories();
            setCategories(cats);
            if (cats.length > 0) setActiveCategory(cats[0].slug);
        })();
    }, []);

    useEffect(() => {
        if (!activeCategory) return;
        setLoading(true);
        getResources(activeCategory).then(setResources).finally(() => setLoading(false));
    }, [activeCategory]);

    const activeCat = categories.find(c => c.slug === activeCategory);

    const openCreate = () => {
        setEditing(null);
        setForm({ custom_id: '', title: '', format: 'PIEZA', quantity: 0, min_quantity: 0, brand: '', unit_cost: 0, description: '', category_id: activeCat?.id || '' });
        setShowModal(true);
    };

    const openEdit = (r: Resource) => {
        setEditing(r);
        setForm({
            custom_id: r.custom_id || '', title: r.title, format: r.format,
            quantity: r.quantity, min_quantity: r.min_quantity, brand: r.brand || '',
            unit_cost: r.unit_cost, description: r.description || '', category_id: r.category_id,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editing) {
                await updateResource(editing.id, form);
            } else {
                await createResource({ ...form, category_id: activeCat?.id || form.category_id });
            }
            setShowModal(false);
            const data = await getResources(activeCategory);
            setResources(data);
        } catch (e) {
            console.error('Error saving resource:', e);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este recurso?')) return;
        await deleteResource(id);
        setResources(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">📦 Gestor de Recursos</h1>
                <button onClick={openCreate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                    + Nuevo Recurso
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button
                        key={cat.slug}
                        onClick={() => setActiveCategory(cat.slug)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat.slug
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {cat.icon} {cat.name}
                    </button>
                ))}
            </div>

            {/* Resource Table */}
            {loading ? (
                <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div></div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-3 font-semibold text-gray-600">ID</th>
                                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Título</th>
                                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Formato</th>
                                    <th className="text-right px-6 py-3 font-semibold text-gray-600">Cantidad</th>
                                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Marca</th>
                                    <th className="text-right px-6 py-3 font-semibold text-gray-600">Costo Unit.</th>
                                    <th className="text-center px-6 py-3 font-semibold text-gray-600">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {resources.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{r.custom_id || r.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4 font-medium text-gray-800">{r.title}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">{r.format}</span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-semibold ${r.quantity <= r.min_quantity ? 'text-red-600' : 'text-gray-800'}`}>
                                            {r.quantity}
                                            {r.quantity <= r.min_quantity && <span className="ml-1 text-xs">⚠️</span>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{r.brand || '—'}</td>
                                        <td className="px-6 py-4 text-right text-gray-700">${r.unit_cost.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => openEdit(r)} className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">✏️ Editar</button>
                                                <button onClick={() => handleDelete(r.id)} className="px-3 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors">🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {resources.length === 0 && (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No hay recursos en esta categoría</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500 border-t border-gray-100">
                        {resources.length} recurso(s) | Valor total: ${resources.reduce((s, r) => s + r.quantity * r.unit_cost, 0).toLocaleString()}
                    </div>
                </motion.div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">{editing ? '✏️ Editar Recurso' : '➕ Nuevo Recurso'}</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">ID Personalizado</label>
                                <input value={form.custom_id} onChange={e => setForm(f => ({ ...f, custom_id: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="ABC-001" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Formato</label>
                                <select value={form.format} onChange={e => setForm(f => ({ ...f, format: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm bg-white">
                                    <option value="L">Litros (L)</option>
                                    <option value="KG">Kilogramos (KG)</option>
                                    <option value="PIEZA">Pieza</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Título *</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Nombre del recurso" required />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Cantidad</label>
                                <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Stock Mínimo</label>
                                <input type="number" value={form.min_quantity} onChange={e => setForm(f => ({ ...f, min_quantity: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Marca</label>
                                <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Costo Unitario</label>
                                <input type="number" value={form.unit_cost} onChange={e => setForm(f => ({ ...f, unit_cost: Number(e.target.value) }))} className="w-full px-3 py-2 border rounded-lg text-sm" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
                                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" rows={2} />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                            <button onClick={handleSave} disabled={saving || !form.title} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                                {saving ? 'Guardando...' : editing ? 'Guardar Cambios' : 'Crear Recurso'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
