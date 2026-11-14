import { useState } from 'react';
import type { VariantGroupWithVariants } from '../../hooks/useVariants';
import type { Product } from '../../store/cartStore';

interface VariantManagerProps {
    groups: VariantGroupWithVariants[];
    products: Product[];
    loading: boolean;
    createGroup: (name: string, attributeNames: string[]) => Promise<unknown>;
    deleteGroup: (id: string) => Promise<void>;
    addVariant: (
        groupId: string,
        productIdOrTitle: string,
        attributes: Record<string, string>,
        extra?: { price?: number; stock?: number; sku?: string; imageUrl?: string }
    ) => Promise<unknown>;
    removeVariant: (variantId: string) => Promise<void>;
}

export default function VariantManager({
    groups,
    products,
    loading,
    createGroup,
    deleteGroup,
    addVariant,
    removeVariant,
}: VariantManagerProps) {
    const [selectedParentId, setSelectedParentId] = useState('');
    const [newGroupAttrs, setNewGroupAttrs] = useState('');
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
    const [addingVariantTo, setAddingVariantTo] = useState<string | null>(null);

    // Form state for adding a child variant
    const [variantAttributes, setVariantAttributes] = useState<Record<string, string>>({});
    const [variantPrice, setVariantPrice] = useState<string>('');
    const [variantStock, setVariantStock] = useState<string>('10');
    const [variantSku, setVariantSku] = useState<string>('');

    // Feedback state
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

    const showToast = (type: 'success' | 'error', msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 5000);
    };

    const handleCreateGroup = async () => {
        if (!selectedParentId || !newGroupAttrs.trim()) return;
        const attrs = newGroupAttrs.split(',').map(s => s.trim()).filter(Boolean);
        const parentName = products.find(p => p.id === selectedParentId)?.name || selectedParentId;
        setSaving(true);
        try {
            await createGroup(selectedParentId, attrs);
            setSelectedParentId('');
            setNewGroupAttrs('');
            showToast('success', `✅ Variantes habilitadas para "${parentName}"`);
        } catch (err: unknown) {
            console.error('Error creating group:', err);
            showToast('error', `❌ Error: ${(err as { message?: string }).message || 'Error desconocido'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleAddVariant = async (groupId: string, attributeNames: string[]) => {
        const missing = attributeNames.some(attr => !variantAttributes[attr]?.trim());
        if (missing) {
            showToast('error', '⚠️ Por favor complete todos los atributos');
            return;
        }

        const title = attributeNames.map(a => variantAttributes[a].trim()).join(' / ');
        setSaving(true);
        try {
            await addVariant(groupId, title, variantAttributes, {
                price: variantPrice ? Number(variantPrice) : undefined,
                stock: variantStock ? Number(variantStock) : 0,
                sku: variantSku.trim() || undefined,
            });
            setAddingVariantTo(null);
            setVariantAttributes({});
            setVariantPrice('');
            setVariantStock('10');
            setVariantSku('');
            showToast('success', '✅ Variante agregada exitosamente');
        } catch (err: unknown) {
            console.error('Error adding variant:', err);
            showToast('error', `❌ Error al agregar variante: ${(err as { message?: string }).message || 'Error desconocido'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteGroup = async (groupId: string, groupName: string) => {
        if (!confirm(`¿Desactivar agrupación de variantes para "${groupName}"?`)) return;
        setSaving(true);
        try {
            await deleteGroup(groupId);
            showToast('success', `🗑️ Agrupación desactivada para "${groupName}"`);
        } catch (err: unknown) {
            console.error('Error deleting group:', err);
            showToast('error', `❌ Error: ${(err as { message?: string }).message || 'Error desconocido'}`);
        } finally {
            setSaving(false);
        }
    };

    const handleRemoveVariant = async (variantId: string) => {
        if (!confirm('¿Desactivar esta variante del catálogo?')) return;
        setSaving(true);
        try {
            await removeVariant(variantId);
            showToast('success', '✅ Variante desactivada');
        } catch (err: unknown) {
            console.error('Error removing variant:', err);
            showToast('error', `❌ Error al desactivar variante: ${(err as { message?: string }).message || 'Error desconocido'}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-md text-white text-xs font-medium ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {toast.msg}
                </div>
            )}

            {/* Enable Multi-Variants on Parent Product */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Habilitar Variantes en Producto Padre</h3>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Producto Padre</label>
                        <select
                            value={selectedParentId}
                            onChange={(e) => setSelectedParentId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                            disabled={saving}
                        >
                            <option value="">Seleccionar producto...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>
                                    #{p.id} — {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Atributos (separados por coma)</label>
                        <input
                            value={newGroupAttrs}
                            onChange={(e) => setNewGroupAttrs(e.target.value)}
                            placeholder="ej. Curva, Grosor, Largo"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                            disabled={saving}
                        />
                    </div>
                    <button
                        onClick={handleCreateGroup}
                        disabled={loading || saving || !selectedParentId || !newGroupAttrs}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 text-sm whitespace-nowrap"
                    >
                        {saving ? 'Guardando...' : 'Habilitar Variantes'}
                    </button>
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600" />
                    <span className="ml-3 text-gray-500">Cargando variantes...</span>
                </div>
            )}

            {!loading && groups.length === 0 && (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                    <h4 className="text-lg font-semibold text-gray-700 mb-1">Sin productos con múltiples variantes</h4>
                    <p className="text-sm text-gray-500">
                        Selecciona un producto arriba para agregarle opciones de tono, curva, grosor o presentación.
                    </p>
                </div>
            )}

            {/* Parent Products with Variants */}
            <div className="space-y-4">
                {groups.map(group => {
                    const parentProd = products.find(p => p.id === group.id);
                    const displayTitle = parentProd ? `${parentProd.name} (#${group.id})` : group.name;

                    return (
                        <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 flex items-center justify-between bg-gray-50">
                                <div
                                    className="flex items-center gap-4 cursor-pointer"
                                    onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                                >
                                    <span className={`transform transition-transform ${expandedGroup === group.id ? 'rotate-90' : ''}`}>▶</span>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{displayTitle}</h4>
                                        <p className="text-xs text-gray-500">
                                            {group.attribute_names.join(', ')} · {group.variants.length} variantes activas
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteGroup(group.id, displayTitle)}
                                    disabled={saving}
                                    className="text-red-500 hover:text-red-700 text-xs px-3 py-1.5 bg-red-50 rounded-lg disabled:opacity-50"
                                >
                                    Desagrupar
                                </button>
                            </div>

                            {expandedGroup === group.id && (
                                <div className="p-4 border-t border-gray-100">
                                    <div className="overflow-x-auto mb-4">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 text-xs text-gray-500">
                                                <tr>
                                                    <th className="px-3 py-2 text-left">ID Var</th>
                                                    <th className="px-3 py-2 text-left">SKU</th>
                                                    <th className="px-3 py-2 text-left">Variante</th>
                                                    {group.attribute_names.map(attr => (
                                                        <th key={attr} className="px-3 py-2 text-left">{attr}</th>
                                                    ))}
                                                    <th className="px-3 py-2 text-right">Precio</th>
                                                    <th className="px-3 py-2 text-center">Stock</th>
                                                    <th className="px-3 py-2"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm divide-y divide-gray-100">
                                                {group.variants.map(variant => (
                                                    <tr key={variant.id}>
                                                        <td className="px-3 py-2 font-mono text-xs text-gray-500">#{variant.id}</td>
                                                        <td className="px-3 py-2 font-mono text-xs text-gray-600">{variant.sku || '—'}</td>
                                                        <td className="px-3 py-2 font-medium text-gray-800">{variant.variant_title || '—'}</td>
                                                        {group.attribute_names.map(attr => (
                                                            <td key={attr} className="px-3 py-2">{variant.attributes[attr] || '—'}</td>
                                                        ))}
                                                        <td className="px-3 py-2 text-right font-semibold text-blue-800">
                                                            ${(variant.promo_price_mxn ?? variant.price_mxn ?? 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="px-3 py-2 text-center">{variant.stock ?? 0}</td>
                                                        <td className="px-3 py-2 text-right">
                                                            <button
                                                                onClick={() => handleRemoveVariant(variant.id)}
                                                                disabled={saving}
                                                                className="text-red-400 hover:text-red-600 disabled:opacity-50"
                                                                title="Desactivar variante"
                                                            >
                                                                ✕
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {addingVariantTo === group.id ? (
                                        <div className="bg-indigo-50 p-4 rounded-lg">
                                            <h5 className="font-bold text-sm text-indigo-800 mb-3">Agregar Nueva Variante</h5>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                                {group.attribute_names.map(attr => (
                                                    <div key={attr}>
                                                        <label className="block text-xs font-semibold text-indigo-700 mb-1">{attr} *</label>
                                                        <input
                                                            placeholder={`Valor de ${attr}`}
                                                            value={variantAttributes[attr] || ''}
                                                            onChange={(e) => setVariantAttributes(prev => ({ ...prev, [attr]: e.target.value }))}
                                                            className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm bg-white"
                                                            disabled={saving}
                                                        />
                                                    </div>
                                                ))}
                                                <div>
                                                    <label className="block text-xs font-semibold text-indigo-700 mb-1">Precio MXN (opcional)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder={parentProd ? String(parentProd.price) : '0.00'}
                                                        value={variantPrice}
                                                        onChange={(e) => setVariantPrice(e.target.value)}
                                                        className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm bg-white"
                                                        disabled={saving}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-indigo-700 mb-1">Stock</label>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        value={variantStock}
                                                        onChange={(e) => setVariantStock(e.target.value)}
                                                        className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm bg-white"
                                                        disabled={saving}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-indigo-700 mb-1">SKU (opcional)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="ej. JD-VAR-01"
                                                        value={variantSku}
                                                        onChange={(e) => setVariantSku(e.target.value)}
                                                        className="w-full px-3 py-2 border border-indigo-200 rounded-lg text-sm bg-white"
                                                        disabled={saving}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAddVariant(group.id, group.attribute_names)}
                                                    disabled={saving}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-50"
                                                >
                                                    {saving ? 'Guardando...' : 'Guardar Variante'}
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
                                            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-50 text-sm"
                                        >
                                            + Agregar Nueva Variante a este Producto
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
