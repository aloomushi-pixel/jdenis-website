import { useState } from 'react';
import type { VariantGroupWithVariants } from '../../hooks/useVariants';
import type { Product } from '../../store/cartStore';

interface VariantManagerProps {
    groups: VariantGroupWithVariants[];
    products: Product[];
    loading: boolean;
    createGroup: (name: string, attributeNames: string[]) => Promise<unknown>;
    deleteGroup: (id: string) => Promise<void>;
    addVariant: (groupId: string, productId: string, attributes: Record<string, string>) => Promise<unknown>;
    removeVariant: (variantId: string) => Promise<void>;
}

export default function VariantManager({
    groups,
    products,
    loading,
    createGroup,
    deleteGroup,
    addVariant,
    removeVariant
}: VariantManagerProps) {
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupAttrs, setNewGroupAttrs] = useState('');
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
    const [addingVariantTo, setAddingVariantTo] = useState<string | null>(null);

    // Form state for adding variant
    const [selectedProduct, setSelectedProduct] = useState('');
    const [variantAttributes, setVariantAttributes] = useState<Record<string, string>>({});

    // Feedback state
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const showToast = (type: 'success' | 'error', msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 5000);
    };

    const handleCreateGroup = async () => {
        if (!newGroupName.trim() || !newGroupAttrs.trim()) return;
        const attrs = newGroupAttrs.split(',').map(s => s.trim()).filter(Boolean);
        setSaving(true);
        try {
            await createGroup(newGroupName, attrs);
            setNewGroupName('');
            setNewGroupAttrs('');
            showToast('success', `✅ Grupo "${newGroupName}" creado exitosamente`);
        } catch (err: unknown) {
            console.error('Error creating group:', err);
            showToast('error', `❌ Error al crear grupo: ${(err as any).message || 'Error desconocido'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleAddVariant = async (groupId: string, attributeNames: string[]) => {
        if (!selectedProduct) return;

        // Ensure all attributes are filled
        const missing = attributeNames.some(attr => !variantAttributes[attr]);
        if (missing) {
            showToast('error', '⚠️ Por favor complete todos los atributos');
            return;
        }

        setSaving(true);
        try {
            await addVariant(groupId, selectedProduct, variantAttributes);
            setAddingVariantTo(null);
            setSelectedProduct('');
            setVariantAttributes({});
            showToast('success', '✅ Variante agregada exitosamente');
        } catch (err: unknown) {
            console.error('Error adding variant:', err);
            showToast('error', `❌ Error al agregar variante: ${(err as any).message || 'Error desconocido'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteGroup = async (groupId: string, groupName: string) => {
        if (!confirm(`¿Eliminar el grupo "${groupName}" y todas sus variantes?`)) return;
        setSaving(true);
        try {
            await deleteGroup(groupId);
            showToast('success', `🗑️ Grupo "${groupName}" eliminado`);
        } catch (err: unknown) {
            console.error('Error deleting group:', err);
            showToast('error', `❌ Error al eliminar grupo: ${(err as any).message || 'Error desconocido'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveVariant = async (variantId: string) => {
        setSaving(true);
        try {
            await removeVariant(variantId);
            showToast('success', '✅ Variante eliminada');
        } catch (err: unknown) {
            console.error('Error removing variant:', err);
            showToast('error', `❌ Error al eliminar variante: ${(err as any).message || 'Error desconocido'}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-pulse ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                    {toast.msg}
                </div>
            )}

            {/* Create Group Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Crear Nuevo Grupo de Variantes</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Grupo</label>
                        <input
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="ej. Extensiones Mink"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            disabled={saving}
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Atributos (separados por coma)</label>
                        <input
                            value={newGroupAttrs}
                            onChange={(e) => setNewGroupAttrs(e.target.value)}
                            placeholder="ej. Curva, Grosor, Longitud"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            disabled={saving}
                        />
                    </div>
                    <button
                        onClick={handleCreateGroup}
                        disabled={loading || saving || !newGroupName || !newGroupAttrs}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            'Crear Grupo'
                        )}
                    </button>
                </div>
            </div>

            {/* Loading indicator */}
            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600" />
                    <span className="ml-3 text-gray-500">Cargando variantes...</span>
                </div>
            )}

            {/* Empty state */}
            {!loading && groups.length === 0 && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                    <div className="text-4xl mb-3">📦</div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Sin grupos de variantes</h4>
                    <p className="text-sm text-gray-500">
                        Crea un grupo arriba para agrupar productos que son iguales pero difieren en color, tamaño, etc.
                    </p>
                </div>
            )}

            {/* Groups List */}
            <div className="space-y-4">
                {groups.map(group => (
                    <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 flex items-center justify-between bg-gray-50">
                            <div className="flex items-center gap-4 cursor-pointer" onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}>
                                <span className={`transform transition-transform ${expandedGroup === group.id ? 'rotate-90' : ''}`}>▶</span>
                                <div>
                                    <h4 className="font-bold text-gray-900">{group.name}</h4>
                                    <p className="text-xs text-gray-500">
                                        {group.attribute_names.join(', ')} · {group.variants.length} variantes
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeleteGroup(group.id, group.name)}
                                disabled={saving}
                                className="text-red-500 hover:text-red-700 text-sm px-3 py-1 bg-red-50 rounded-lg disabled:opacity-50"
                            >
                                Eliminar
                            </button>
                        </div>

                        {expandedGroup === group.id && (
                            <div className="p-4 border-t border-gray-100">
                                <table className="w-full mb-4">
                                    <thead className="bg-gray-50 text-xs text-gray-500">
                                        <tr>
                                            <th className="px-3 py-2 text-left">SKU / Producto ID</th>
                                            {group.attribute_names.map(attr => (
                                                <th key={attr} className="px-3 py-2 text-left">{attr}</th>
                                            ))}
                                            <th className="px-3 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm divide-y divide-gray-100">
                                        {group.variants.map(variant => (
                                            <tr key={variant.id}>
                                                <td className="px-3 py-2 font-mono text-xs">{variant.product_id}</td>
                                                {group.attribute_names.map(attr => (
                                                    <td key={attr} className="px-3 py-2">{variant.attributes[attr] || '-'}</td>
                                                ))}
                                                <td className="px-3 py-2 text-right">
                                                    <button
                                                        onClick={() => handleRemoveVariant(variant.id)}
                                                        disabled={saving}
                                                        className="text-red-400 hover:text-red-600 disabled:opacity-50"
                                                    >
                                                        ✕
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {group.variants.length === 0 && (
                                            <tr>
                                                <td colSpan={group.attribute_names.length + 2} className="px-3 py-4 text-center text-gray-400 text-sm">
                                                    Sin variantes. Agrega productos a este grupo.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Add Variant Form */}
                                {addingVariantTo === group.id ? (
                                    <div className="bg-indigo-50 p-4 rounded-lg">
                                        <h5 className="font-bold text-sm text-indigo-800 mb-3">Agregar Nueva Variante</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                            <div className="col-span-1 md:col-span-3">
                                                <select
                                                    value={selectedProduct}
                                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                                    className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm"
                                                    disabled={saving}
                                                >
                                                    <option value="">Seleccionar Producto...</option>
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {group.attribute_names.map(attr => (
                                                <div key={attr}>
                                                    <input
                                                        placeholder={attr}
                                                        value={variantAttributes[attr] || ''}
                                                        onChange={(e) => setVariantAttributes(prev => ({ ...prev, [attr]: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm"
                                                        disabled={saving}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAddVariant(group.id, group.attribute_names)}
                                                disabled={saving || !selectedProduct}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {saving ? (
                                                    <>
                                                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    'Guardar'
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setAddingVariantTo(null)}
                                                disabled={saving}
                                                className="px-4 py-2 bg-white text-gray-600 rounded-lg text-sm border border-gray-200"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setAddingVariantTo(group.id)}
                                        disabled={saving}
                                        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50"
                                    >
                                        + Agregar Producto a este Grupo
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
