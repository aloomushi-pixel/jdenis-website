import { useState, useEffect } from 'react';
import api from '../services/api';

type ResourceCategory = 'MATERIA_PRIMA' | 'EMBALAJE' | 'PRODUCTO_FINAL' | 'VEHICULOS';
type ResourceFormat = 'LITROS' | 'KILOGRAMOS' | 'PIEZA';

interface Resource {
    id: string;
    category: ResourceCategory;
    title: string;
    format: ResourceFormat;
    quantity: number;
    brand?: string;
    imageUrl?: string;
    satCode?: string;
}

const CATEGORIES = [
    { id: 'MATERIA_PRIMA', label: 'Materia Prima', icon: '🧪' },
    { id: 'EMBALAJE', label: 'Embalaje', icon: '📦' },
    { id: 'PRODUCTO_FINAL', label: 'Producto Final', icon: '✨' },
    { id: 'VEHICULOS', label: 'Vehículos', icon: '🚚' },
];

export default function ResourceManager() {
    const [activeTab, setActiveTab] = useState<ResourceCategory>('MATERIA_PRIMA');
    const [resources, setResources] = useState<Resource[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<Partial<Resource>>({
        category: 'MATERIA_PRIMA',
        format: 'KILOGRAMOS',
        quantity: 0,
    });

    useEffect(() => {
        fetchResources();
    }, [activeTab]);

    const fetchResources = async () => {
        try {
            const response = await api.get(`/resources?category=${activeTab}`);
            setResources(response.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/resources', {
                ...formData,
                category: activeTab,
            });
            setShowForm(false);
            setFormData({ category: activeTab, format: 'KILOGRAMOS', quantity: 0 });
            fetchResources();
        } catch (error) {
            console.error('Error creating resource:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este recurso?')) return;
        try {
            await api.delete(`/resources/${id}`);
            fetchResources();
        } catch (error) {
            console.error('Error deleting resource:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Gestor de Recursos</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nuevo Recurso</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id as ResourceCategory)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === cat.id
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span className="mr-2">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Nuevo Recurso - {CATEGORIES.find(c => c.id === activeTab)?.label}</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                            <input
                                type="text"
                                value={formData.id || ''}
                                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                                placeholder="REC-001"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                            <input
                                type="text"
                                value={formData.title || ''}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Formato</label>
                            <select
                                value={formData.format}
                                onChange={(e) => setFormData({ ...formData, format: e.target.value as ResourceFormat })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                                <option value="LITROS">Litros</option>
                                <option value="KILOGRAMOS">Kilogramos</option>
                                <option value="PIEZA">Pieza</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                            <input
                                type="number"
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                            <input
                                type="text"
                                value={formData.brand || ''}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>

                        {activeTab === 'PRODUCTO_FINAL' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código SAT</label>
                                <input
                                    type="text"
                                    value={formData.satCode || ''}
                                    onChange={(e) => setFormData({ ...formData, satCode: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="39101510"
                                />
                            </div>
                        )}

                        <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Crear Recurso
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Resources Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formato</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                            {activeTab === 'PRODUCTO_FINAL' && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código SAT</th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {resources.map((resource) => (
                            <tr key={resource.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-mono text-gray-900">{resource.id}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{resource.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{resource.format}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">{resource.quantity.toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{resource.brand || '-'}</td>
                                {activeTab === 'PRODUCTO_FINAL' && (
                                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{resource.satCode || '-'}</td>
                                )}
                                <td className="px-6 py-4 text-sm">
                                    <button
                                        onClick={() => handleDelete(resource.id)}
                                        className="text-red-600 hover:text-red-900 font-medium"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {resources.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    No hay recursos en esta categoría
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
