import { motion } from 'framer-motion';
import { useState, useMemo, useRef, useCallback, Fragment } from 'react';
import type { Product } from '../../store/cartStore';
import * as XLSX from 'xlsx';
import { useProducts } from '../../hooks/useProducts';
import { useVariants } from '../../hooks/useVariants';
import VariantManager from './VariantManager';

// ═══════════════════════════════════════════
// Excel row <-> Product mapping
// ═══════════════════════════════════════════
function productToRow(p: Product) {
    return {
        ID: p.id,
        Nombre: p.name,
        'Precio Cliente': p.price,
        'Precio Original': p.originalPrice ?? '',
        'Precio Distribuidor': p.distributorPrice ?? '',
        'Promoción': p.promotion ?? '',
        'Categoría': p.category,
        Imagen: p.image,
        'Descripción': p.description || '',
        Stock: p.stock || 0,
        Destacado: p.isFeatured ? 'Sí' : 'No',
        Beneficios: (p.benefits || []).join(' | '),
        Incluye: (p.includes || []).join(' | '),
        Especificaciones: (p.specifications || []).join(' | '),
        Performance: p.performance || '',
        'Galería': (p.gallery || []).join(' | '),
        'Categorías Relacionadas': (p.relatedCategories || []).join(' | '),
        Variantes: 0, // Will be calculated from DB groups
    };
}

export default function ProductEditor() {
    const [activeTab, setActiveTab] = useState<'catalog' | 'variants'>('catalog');
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'category' | 'id'>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [importData, setImportData] = useState<Record<string, string | number>[] | null>(null);
    const [importFileName, setImportFileName] = useState('');
    const [showImportPreview, setShowImportPreview] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ═══════════════════════════════════════════
    // Supabase integration via useProducts hook
    // ═══════════════════════════════════════════
    const { products, loading: supabaseLoading, error: supabaseError, saveProduct, saveStatus, synced, createProduct, updateProduct, deleteProduct } = useProducts();
    const { groups: rawDbGroups, loading: variantsLoading, createGroup, deleteGroup, addVariant, removeVariant } = useVariants();

    // Map DB variant groups (snake_case) to camelCase for rendering
    interface MappedVariantGroup {
        parentId: string;
        parentName: string;
        attributeNames: string[];
        variants: { productId: string; attributes: Record<string, string> }[];
    }
    const dbVariantGroups: MappedVariantGroup[] = useMemo(() =>
        rawDbGroups.map(g => ({
            parentId: g.id,
            parentName: g.name,
            attributeNames: g.attribute_names,
            variants: g.variants.map(v => ({
                productId: v.product_id,
                attributes: v.attributes
            }))
        })),
        [rawDbGroups]
    );

    // ═══════════════════════════════════════════
    // Editable state: product overrides stored in memory
    // ═══════════════════════════════════════════
    const [edits, setEdits] = useState<Record<string, Partial<Product>>>({});
    const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
    const [editValue, setEditValue] = useState('');
    const editInputRef = useRef<HTMLInputElement>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [expandedVariantGroup, setExpandedVariantGroup] = useState<string | null>(null);
    const [imageEditorId, setImageEditorId] = useState<string | null>(null);
    const [newGalleryUrl, setNewGalleryUrl] = useState('');

    // Full CRUD Editor State
    const [fullEditingId, setFullEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<Partial<Product>>({});

    const showNotification = (type: 'success' | 'error' | 'info', msg: string) => {
        setNotification({ type, msg });
        setTimeout(() => setNotification(null), 4000);
    };

    // Get the effective value of a product field (edited or original)
    const getVal = (product: Product, field: keyof Product) => {
        const override = edits[product.id];
        if (override && field in override) return override[field];
        return product[field];
    };

    // Start editing a cell
    const startEdit = (id: string, field: string, currentValue: string | number | undefined) => {
        setEditingCell({ id, field });
        setEditValue(String(currentValue ?? ''));
        setTimeout(() => editInputRef.current?.focus(), 50);
    };

    // Save edit — persists to Supabase for synced fields
    const saveEdit = () => {
        if (!editingCell) return;
        const { id, field } = editingCell;

        let value: string | number | undefined = editValue;
        if (['price', 'originalPrice', 'distributorPrice', 'stock'].includes(field)) {
            value = editValue === '' ? undefined : Number(editValue);
        }

        setEdits(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
        setEditingCell(null);
        setHasChanges(true);

        // Auto-save to Supabase for supported fields
        const supabaseFields = ['name', 'price', 'originalPrice', 'isFeatured', 'stock', 'category'];
        if (supabaseFields.includes(field)) {
            saveProduct(id, field, value).then(ok => {
                if (ok) showNotification('success', `✅ "${field}" guardado en tienda`);
                else showNotification('error', `❌ Error al guardar "${field}"`);
            });
        }
    };

    // Toggle featured — persists to Supabase
    const toggleFeatured = (product: Product) => {
        const current = getVal(product, 'isFeatured') as boolean | undefined;
        const newValue = !current;
        setEdits(prev => ({
            ...prev,
            [product.id]: { ...prev[product.id], isFeatured: newValue },
        }));
        setHasChanges(true);

        // Auto-save to Supabase
        saveProduct(product.id, 'isFeatured', newValue).then(ok => {
            if (ok) showNotification('success', `✅ Destacado ${newValue ? 'activado' : 'desactivado'} `);
            else showNotification('error', '❌ Error al guardar destacado');
        });
    };

    // Cancel edit
    const cancelEdit = () => {
        setEditingCell(null);
        setEditValue('');
    };

    // Key handler for edit input
    const handleEditKey = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') saveEdit();
        if (e.key === 'Escape') cancelEdit();
    };

    // ═══════════════════════════════════════════
    // FULL CRUD HANDLERS
    // ═══════════════════════════════════════════
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Eliminar irreversiblemente "${name}"?`)) return;
        const ok = await deleteProduct(id);
        if (ok) showNotification('success', `✅ Producto eliminado: ${name}`);
        else showNotification('error', `❌ Error al eliminar producto`);
    };

    const openFullEditor = (p?: Product) => {
        if (p) {
            setFullEditingId(p.id);
            setIsCreating(false);
            setFormData({ ...p });
        } else {
            setFullEditingId(null);
            setIsCreating(true);
            setFormData({ name: '', price: 0, category: 'General', isFeatured: false, stock: 10, promotion: '', description: '', image: '' });
        }
        setImageEditorId(null);
        setExpandedVariantGroup(null);
    };

    const closeFullEditor = () => {
        setFullEditingId(null);
        setIsCreating(false);
        setFormData({});
    };

    const saveFullEditor = async () => {
        if (!formData.name || formData.price === undefined || !formData.category) {
            showNotification('error', '⚠️ Nombre, precio y categoría son obligatorios');
            return;
        }

        if (isCreating) {
            const ok = await createProduct(formData as any);
            if (ok) {
                showNotification('success', '✅ Producto creado');
                closeFullEditor();
            } else showNotification('error', '❌ Error al crear producto');
        } else if (fullEditingId) {
            const ok = await updateProduct(fullEditingId, formData);
            if (ok) {
                showNotification('success', '✅ Producto actualizado');
                closeFullEditor();
            } else showNotification('error', '❌ Error al actualizar producto');
        }
    };

    // Unique categories
    const uniqueCategories = useMemo(() => {
        const cats = new Set(products.map(p => p.category));
        return Array.from(cats).sort();
    }, [products]);

    // Apply edits to products for display
    const getProduct = useCallback((p: Product): Product => {
        const override = edits[p.id];
        if (!override) return p;
        return { ...p, ...override };
    }, [edits]);

    const filteredProducts = useMemo(() => {
        let result = products.map(getProduct);

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(p =>
                p.id.toLowerCase().includes(q) ||
                p.name.toLowerCase().includes(q) ||
                (p.description || '').toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q) ||
                (p.promotion || '').toLowerCase().includes(q)
            );
        }

        if (categoryFilter !== 'all') {
            result = result.filter(p => p.category === categoryFilter);
        }

        result.sort((a, b) => {
            let cmp = 0;
            if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
            else if (sortBy === 'price') cmp = a.price - b.price;
            else if (sortBy === 'category') cmp = a.category.localeCompare(b.category);
            else if (sortBy === 'id') cmp = a.id.localeCompare(b.id);
            return sortDir === 'asc' ? cmp : -cmp;
        });

        return result;
    }, [search, categoryFilter, sortBy, sortDir, products, getProduct]);

    // ═══════════════════════════════════════════
    // EXPORT TO EXCEL
    // ═══════════════════════════════════════════
    const handleExportExcel = () => {
        const rows = products.map(p => productToRow(getProduct(p)));
        const worksheet = XLSX.utils.json_to_sheet(rows);
        worksheet['!cols'] = [
            { wch: 30 }, { wch: 45 }, { wch: 14 }, { wch: 18 }, { wch: 20 },
            { wch: 20 }, { wch: 50 }, { wch: 60 }, { wch: 8 }, { wch: 8 },
            { wch: 60 }, { wch: 50 }, { wch: 50 }, { wch: 30 }, { wch: 50 },
            { wch: 30 }, { wch: 10 },
        ];

        const variantRows = dbVariantGroups.map(g => ({
            'Producto Padre (ID)': g.parentId,
            'Nombre Padre': g.parentName,
            Atributos: g.attributeNames.join(', '),
            'Cantidad de Variantes': g.variants.length,
            'IDs de Variantes': g.variants.map(v => v.productId).join(' | '),
        }));
        const variantSheet = XLSX.utils.json_to_sheet(variantRows);
        variantSheet['!cols'] = [
            { wch: 30 }, { wch: 40 }, { wch: 30 }, { wch: 15 }, { wch: 80 },
        ];

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
        XLSX.utils.book_append_sheet(workbook, variantSheet, 'Grupos de Variantes');

        const now = new Date().toISOString().split('T')[0];
        XLSX.writeFile(workbook, `catalogo_jdenis_${now}.xlsx`);
        showNotification('success', `✅ Exportados ${products.length} productos a Excel`);
    };

    // ═══════════════════════════════════════════
    // IMPORT FROM EXCEL
    // ═══════════════════════════════════════════
    const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImportFileName(file.name);
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheet];
                const jsonData = XLSX.utils.sheet_to_json<Record<string, string | number>>(worksheet);
                if (jsonData.length === 0) {
                    showNotification('error', '⚠️ El archivo no contiene datos');
                    return;
                }
                setImportData(jsonData);
                setShowImportPreview(true);
                showNotification('success', `📋 ${jsonData.length} filas leídas de "${file.name}"`);
            } catch (err) {
                showNotification('error', '❌ Error al leer el archivo Excel');
                console.error(err);
            }
        };
        reader.readAsArrayBuffer(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // Apply imported data as edits
    const applyImport = () => {
        if (!importData) return;
        const newEdits: Record<string, Partial<Product>> = { ...edits };
        let applied = 0;

        for (const row of importData) {
            const id = String(row['ID'] || row['id'] || '').trim();
            if (!id) continue;
            const existing = products.find(p => p.id === id);
            if (!existing) continue;

            const patch: Partial<Product> = {};
            if (row['Nombre'] !== undefined) patch.name = String(row['Nombre']);
            if (row['Precio Cliente'] !== undefined) patch.price = Number(row['Precio Cliente']);
            if (row['Precio Original'] !== undefined && row['Precio Original'] !== '') {
                patch.originalPrice = Number(row['Precio Original']);
            }
            if (row['Precio Distribuidor'] !== undefined && row['Precio Distribuidor'] !== '') {
                patch.distributorPrice = Number(row['Precio Distribuidor']);
            }
            if (row['Promoción'] !== undefined) patch.promotion = String(row['Promoción']);
            if (row['Categoría'] !== undefined) patch.category = String(row['Categoría']);
            if (row['Descripción'] !== undefined) patch.description = String(row['Descripción']);
            if (row['Stock'] !== undefined) patch.stock = Number(row['Stock']);

            if (Object.keys(patch).length > 0) {
                newEdits[id] = { ...newEdits[id], ...patch };
                applied++;
            }
        }

        setEdits(newEdits);
        setHasChanges(true);
        setShowImportPreview(false);
        setImportData(null);
        showNotification('success', `✅ ${applied} productos actualizados desde Excel`);
    };

    // ═══════════════════════════════════════════
    // EXPORT (with edits applied)
    // ═══════════════════════════════════════════
    const handleExportJSON = () => {
        const edited = products.map(getProduct);
        const json = JSON.stringify(edited, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('success', `✅ Exportado JSON con ${products.length} productos(incluye ediciones)`);
    };

    // Sort
    const handleSort = (col: 'name' | 'price' | 'category' | 'id') => {
        if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortBy(col); setSortDir('asc'); }
    };

    const renderSortIcon = (col: string) => {
        if (sortBy !== col) return <span className="text-gray-300 ml-1">↕</span>;
        return <span className="text-indigo-600 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
    };

    // Stats
    const totalProducts = products.length;
    const totalVariantGroups = dbVariantGroups.length;
    const editedCount = Object.keys(edits).length;

    // ═══════════════════════════════════════════
    // Editable cell component
    // ═══════════════════════════════════════════
    const renderEditableCell = (
        product: Product,
        field: keyof Product,
        type: 'text' | 'number' | 'currency' = 'text',
        className = ''
    ) => {
        const isEditing = editingCell?.id === product.id && editingCell?.field === field;
        const value = getVal(product, field);
        const isEdited = edits[product.id] && field in (edits[product.id] || {});

        if (isEditing) {
            return (
                <input
                    ref={editInputRef}
                    type={type === 'currency' || type === 'number' ? 'number' : 'text'}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleEditKey}
                    onBlur={saveEdit}
                    className="w-full px-2 py-1 border-2 border-indigo-400 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    step={type === 'currency' ? '0.01' : undefined}
                    min={type === 'currency' || type === 'number' ? 0 : undefined}
                />
            );
        }

        const displayVal = type === 'currency' && value != null && value !== ''
            ? `$${Number(value).toLocaleString()} `
            : (value ?? '—');

        return (
            <button
                onClick={() => startEdit(product.id, field as string, value as string | number)}
                className={`text-left w-full px-2 py-1 rounded hover:bg-indigo-50 transition-colors cursor-pointer group ${isEdited ? 'bg-amber-50 border border-amber-200' : ''
                    } ${className} `}
                title="Click para editar"
            >
                <span className={`${!value && value !== 0 ? 'text-gray-300' : ''} `}>
                    {String(displayVal)}
                </span>
                {!isEdited && (
                    <svg className="w-3 h-3 text-gray-300 group-hover:text-indigo-400 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" />
                    </svg>
                )}
            </button>
        );
    };

    const renderFullEditorForm = () => (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white border-x-4 border-indigo-500 p-6 shadow-md m-4 rounded-lg flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b pb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {isCreating ? '✨ Nuevo Producto' : `✏️ Editar Producto: ${formData.id}`}
                </h3>
                <button onClick={closeFullEditor} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">✕</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-4">
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Nombre *</label><input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Categoría *</label><input type="text" value={formData.category || ''} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Precio Cliente *</label><input type="number" step="0.01" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Precio Original</label><input type="number" step="0.01" value={formData.originalPrice || ''} onChange={e => setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined })} className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" /></div>

                <div><label className="block text-xs font-bold text-gray-700 mb-1">Precio Distribuidor</label><input type="number" step="0.01" value={formData.distributorPrice || ''} onChange={e => setFormData({ ...formData, distributorPrice: e.target.value ? Number(e.target.value) : undefined })} className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Stock</label><input type="number" value={formData.stock || 0} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">Promoción (Texto)</label><input type="text" value={formData.promotion || ''} onChange={e => setFormData({ ...formData, promotion: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" /></div>
                <div><label className="block text-xs font-bold text-gray-700 mb-1">URL Imagen</label><input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow font-mono text-xs" /></div>

                <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-700 mb-1">Descripción</label><textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" rows={2} /></div>
                <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-700 mb-1">Performance (Beneficios, etc)</label><textarea value={formData.performance || ''} onChange={e => setFormData({ ...formData, performance: e.target.value })} className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" rows={2} /></div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="checkbox" checked={!!formData.isFeatured} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" />
                    Marcar como Destacado (✨)
                </label>
            </div>
            <div className="mt-6 flex gap-3 justify-end border-t pt-4">
                <button onClick={closeFullEditor} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">Cancelar</button>
                <button onClick={saveFullEditor} className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-sm transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Guardar Cambios
                </button>
            </div>
        </motion.div>
    );

    return (
        <div>
            {/* Notification Toast */}
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`fixed top - 4 right - 4 z - 50 px - 6 py - 3 rounded - xl shadow - lg text - white text - sm font - medium ${notification.type === 'success' ? 'bg-green-600'
                        : notification.type === 'info' ? 'bg-blue-600'
                            : 'bg-red-600'
                        } `}
                >
                    {notification.msg}
                </motion.div>
            )}

            {/* Header & Tabs */}
            <div className="flex flex-col mb-6 gap-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Editor de Catálogo</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {totalProducts} productos · {dbVariantGroups.length} grupos de variantes (DB)
                            {editedCount > 0 && (
                                <span className="ml-2 text-amber-600 font-medium">
                                    · {editedCount} productos editados
                                </span>
                            )}
                            {synced && (
                                <span className="ml-2 text-green-600 font-medium">
                                    · ☁️ Sincronizado
                                </span>
                            )}
                            {(supabaseLoading || variantsLoading) && (
                                <span className="ml-2 text-blue-600 font-medium animate-pulse">
                                    · ⏳ Cargando...
                                </span>
                            )}
                            {supabaseError && (
                                <span className="ml-2 text-red-500 font-medium">
                                    · ⚠️ Error Supabase
                                </span>
                            )}
                        </p>
                    </div>
                    {/* Tab Switcher */}
                    <div className="flex p-1 bg-gray-100 rounded-lg self-start lg:self-center">
                        <button
                            onClick={() => setActiveTab('catalog')}
                            className={`px - 4 py - 2 rounded - md text - sm font - medium transition - all ${activeTab === 'catalog' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                } `}
                        >
                            Catálogo
                        </button>
                        <button
                            onClick={() => setActiveTab('variants')}
                            className={`px - 4 py - 2 rounded - md text - sm font - medium transition - all ${activeTab === 'variants' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                } `}
                        >
                            Variantes
                        </button>
                    </div>
                </div>

                {/* Catalog Controls (Only show if catalog tab active) */}
                {activeTab === 'catalog' && (
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        {/* Unsaved changes indicator */}
                        {hasChanges && (
                            <span className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium flex items-center gap-1">
                                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                                Cambios sin exportar
                            </span>
                        )}

                        {/* Add Product */}
                        <button
                            onClick={() => openFullEditor()}
                            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            Agregar Producto
                        </button>

                        {/* Export Excel */}
                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            Exportar Excel
                        </button>

                        {/* Import Excel */}
                        <label className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                            Importar Excel
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                className="hidden"
                                onChange={handleImportExcel}
                            />
                        </label>

                        {/* Export JSON */}
                        <button
                            onClick={handleExportJSON}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
                            JSON
                        </button>

                        {/* Reset edits */}
                        {hasChanges && (
                            <button
                                onClick={() => { setEdits({}); setHasChanges(false); showNotification('info', '🔄 Ediciones descartadas'); }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                            >
                                ↺ Descartar
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Catalog Content */}
            {activeTab === 'catalog' && (
                <>
                    {/* Info banner */}
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mb-4 flex items-center gap-3 text-sm text-indigo-700">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                        <span>Haz <b>click</b> en cualquier celda para editar. Las celdas editadas se resaltan en <span className="bg-amber-100 px-1 rounded">amarillo</span>. Exporta a Excel o JSON para guardar los cambios.</span>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                            <input
                                type="text"
                                placeholder="Buscar por ID, nombre, descripción, promoción..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Todas las categorías</option>
                            {uniqueCategories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-500 self-center whitespace-nowrap">
                            {filteredProducts.length} de {totalProducts}
                        </span>
                    </div>

                    {/* Import Preview Modal */}
                    {showImportPreview && importData && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-lg p-6 mb-4 border-2 border-blue-200"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Vista Previa de Importación</h3>
                                    <p className="text-sm text-gray-500">
                                        📁 {importFileName} · {importData.length} filas · {Object.keys(importData[0] || {}).length} columnas
                                    </p>
                                </div>
                                <button
                                    onClick={() => { setShowImportPreview(false); setImportData(null); }}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                                >✕</button>
                            </div>
                            <div className="mb-4 flex flex-wrap gap-2">
                                {Object.keys(importData[0] || {}).map(col => (
                                    <span key={col} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">{col}</span>
                                ))}
                            </div>
                            <div className="overflow-x-auto max-h-80 overflow-y-auto border rounded-lg">
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-gray-500 font-semibold">#</th>
                                            {Object.keys(importData[0] || {}).map(col => (
                                                <th key={col} className="px-3 py-2 text-left text-gray-500 font-semibold whitespace-nowrap">{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {importData.slice(0, 15).map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                                                {Object.values(row).map((val, j) => (
                                                    <td key={j} className="px-3 py-2 text-gray-700 max-w-[200px] truncate">{String(val)}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {importData.length > 15 && (
                                <p className="text-xs text-gray-400 mt-2 text-center">Mostrando 15 de {importData.length} filas</p>
                            )}
                            <div className="mt-4 flex items-center gap-3">
                                <button
                                    onClick={applyImport}
                                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
                                >
                                    ✅ Aplicar Cambios ({importData.length} filas)
                                </button>
                                <button
                                    onClick={() => {
                                        const json = JSON.stringify(importData, null, 2);
                                        const blob = new Blob([json], { type: 'application/json' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url; a.download = `imported_${new Date().toISOString().split('T')[0]}.json`;
                                        a.click(); URL.revokeObjectURL(url);
                                        showNotification('success', '✅ Guardado como JSON');
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                                >💾 Solo JSON</button>
                                <button
                                    onClick={() => { setShowImportPreview(false); setImportData(null); }}
                                    className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm hover:bg-gray-200"
                                >Cancelar</button>
                            </div>
                        </motion.div>
                    )}

                    {/* Products Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="text-left px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-8">#</th>
                                        <th className="text-left px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider w-12">Img</th>
                                        <th
                                            className="text-left px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600"
                                            onClick={() => handleSort('id')}
                                        >
                                            ID {renderSortIcon('id')}
                                        </th>
                                        <th
                                            className="text-left px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 min-w-[180px]"
                                            onClick={() => handleSort('name')}
                                        >
                                            Nombre {renderSortIcon('name')}
                                        </th>
                                        <th
                                            className="text-right px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 min-w-[100px]"
                                            onClick={() => handleSort('price')}
                                        >
                                            <span className="text-blue-700">💰 P. Cliente</span> {renderSortIcon('price')}
                                        </th>
                                        <th className="text-right px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider min-w-[100px]">
                                            <span className="text-red-600">🔥 P. Original</span>
                                        </th>
                                        <th className="text-right px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider min-w-[110px]">
                                            <span className="text-purple-700">🏷️ P. Distribuidor</span>
                                        </th>
                                        <th className="text-left px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider min-w-[130px]">
                                            <span className="text-green-700">🎁 Promoción</span>
                                        </th>
                                        <th
                                            className="text-left px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600"
                                            onClick={() => handleSort('category')}
                                        >
                                            Categoría {renderSortIcon('category')}
                                        </th>
                                        <th className="text-center px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">V</th>
                                        <th className="text-center px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">⭐</th>
                                        <th className="text-left px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider max-w-[200px]">Descripción</th>
                                        <th className="text-center px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {/* Create Form Row */}
                                    {isCreating && (
                                        <tr>
                                            <td colSpan={13} className="p-0 bg-gray-50/50">
                                                {renderFullEditorForm()}
                                            </td>
                                        </tr>
                                    )}
                                    {filteredProducts.map((product, index) => {
                                        const vc = dbVariantGroups.find(g => g.variants.some(v => v.productId === product.id))?.variants.length || 0;
                                        const isEdited = !!edits[product.id];
                                        const rowSaveStatus = saveStatus[product.id];
                                        return (
                                            <Fragment key={product.id}>
                                                <tr
                                                    className={`hover: bg - indigo - 50 / 30 transition - colors ${isEdited ? 'bg-amber-50/40' : ''} ${rowSaveStatus === 'saving' ? 'opacity-70' : ''} `}
                                                >
                                                    <td className="px-3 py-2 text-xs text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            {index + 1}
                                                            {rowSaveStatus === 'saving' && <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" title="Guardando..." />}
                                                            {rowSaveStatus === 'saved' && <span className="text-green-500" title="Guardado">✓</span>}
                                                            {rowSaveStatus === 'error' && <span className="text-red-500" title="Error al guardar">✗</span>}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        <button
                                                            onClick={() => setImageEditorId(imageEditorId === product.id ? null : product.id)}
                                                            className={`relative group w - 9 h - 9 rounded cursor - pointer overflow - hidden border - 2 transition - colors ${imageEditorId === product.id ? 'border-indigo-500 shadow-md' : 'border-transparent hover:border-indigo-300'
                                                                } ${edits[product.id] && ('image' in (edits[product.id] || {}) || 'gallery' in (edits[product.id] || {})) ? 'ring-2 ring-amber-300' : ''} `}
                                                            title="Click para editar imagen y galería"
                                                        >
                                                            <img
                                                                src={String(getVal(product, 'image'))}
                                                                alt=""
                                                                className="w-full h-full object-cover bg-gray-100"
                                                                loading="lazy"
                                                                onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect fill="%23f3f4f6" width="32" height="32"/><text x="50%25" y="50%25" fill="%239ca3af" font-size="8" text-anchor="middle" dy=".3em">?</text></svg>'; }}
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                                <svg className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                                                            </div>
                                                        </button>
                                                    </td>
                                                    <td className="px-3 py-2 text-[11px] text-gray-500 font-mono">{product.id}</td>
                                                    <td className="px-3 py-2 min-w-[180px]">
                                                        {renderEditableCell(product, 'name', 'text', 'text-sm font-medium text-gray-900')}
                                                    </td>
                                                    <td className="px-3 py-2 text-right min-w-[100px]">
                                                        {renderEditableCell(product, 'price', 'currency', 'text-sm font-semibold text-blue-800')}
                                                    </td>
                                                    <td className="px-3 py-2 text-right min-w-[100px]">
                                                        {renderEditableCell(product, 'originalPrice', 'currency', `text - sm font - semibold ${getVal(product, 'originalPrice') ? 'text-red-600' : 'text-gray-300'} `)}
                                                    </td>
                                                    <td className="px-3 py-2 text-right min-w-[110px]">
                                                        {renderEditableCell(product, 'distributorPrice', 'currency', 'text-sm font-semibold text-purple-800')}
                                                    </td>
                                                    <td className="px-3 py-2 min-w-[130px]">
                                                        {renderEditableCell(product, 'promotion', 'text', 'text-xs text-green-700')}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {renderEditableCell(product, 'category', 'text', 'text-xs text-gray-600')}
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        {vc > 1 ? (
                                                            <button
                                                                onClick={() => setExpandedVariantGroup(expandedVariantGroup === product.id ? null : product.id)}
                                                                className={`px - 1.5 py - 0.5 rounded - full text - [10px] font - medium transition - colors cursor - pointer ${expandedVariantGroup === product.id
                                                                    ? 'bg-indigo-600 text-white'
                                                                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                                                    } `}
                                                                title="Click para ver/editar variantes"
                                                            >{vc}</button>
                                                        ) : (
                                                            <span className="text-gray-300 text-[10px]">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-center">
                                                        <button
                                                            onClick={() => toggleFeatured(product)}
                                                            className={`w - 7 h - 7 rounded - lg flex items - center justify - center transition - all cursor - pointer ${getVal(product, 'isFeatured')
                                                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-500 shadow-sm'
                                                                : 'bg-gray-50 hover:bg-gray-100 text-gray-300'
                                                                } ${edits[product.id] && 'isFeatured' in (edits[product.id] || {}) ? 'ring-2 ring-amber-300' : ''} `}
                                                            title={getVal(product, 'isFeatured') ? 'Quitar de destacados' : 'Marcar como destacado'}
                                                        >
                                                            {getVal(product, 'isFeatured') ? '⭐' : '☆'}
                                                        </button>
                                                    </td>
                                                    <td className="px-3 py-2 max-w-[200px]">
                                                        {renderEditableCell(product, 'description', 'text', 'text-[11px] text-gray-500 line-clamp-1')}
                                                    </td>
                                                    <td className="px-3 py-2 text-center whitespace-nowrap">
                                                        <button onClick={() => openFullEditor(product)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-1.5 rounded mx-0.5 transition-colors" title="Editar">✏️</button>
                                                        <button onClick={() => handleDelete(product.id, product.name)} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1.5 rounded mx-0.5 transition-colors" title="Eliminar">🗑️</button>
                                                    </td>
                                                </tr>
                                                {/* Full Editor Inline */}
                                                {
                                                    fullEditingId === product.id && (
                                                        <tr>
                                                            <td colSpan={13} className="p-0 bg-indigo-50/30">
                                                                {renderFullEditorForm()}
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                                {/* Inline Image Editor — appears right below this product */}
                                                {
                                                    imageEditorId === product.id && (() => {
                                                        const editedProduct = getProduct(product);
                                                        const currentImage = String(getVal(editedProduct, 'image') || '');
                                                        const currentGallery = (edits[product.id]?.gallery ?? product.gallery ?? []) as string[];

                                                        const updateImage = (url: string) => {
                                                            setEdits(prev => ({
                                                                ...prev,
                                                                [product.id]: { ...prev[product.id], image: url },
                                                            }));
                                                            setHasChanges(true);
                                                        };

                                                        const addGalleryImage = () => {
                                                            if (!newGalleryUrl.trim()) return;
                                                            const updated = [...currentGallery, newGalleryUrl.trim()];
                                                            setEdits(prev => ({
                                                                ...prev,
                                                                [product.id]: { ...prev[product.id], gallery: updated },
                                                            }));
                                                            setHasChanges(true);
                                                            setNewGalleryUrl('');
                                                        };

                                                        const removeGalleryImage = (idx: number) => {
                                                            const updated = currentGallery.filter((_, i) => i !== idx);
                                                            setEdits(prev => ({
                                                                ...prev,
                                                                [product.id]: { ...prev[product.id], gallery: updated },
                                                            }));
                                                            setHasChanges(true);
                                                        };

                                                        return (
                                                            <tr>
                                                                <td colSpan={12} className="p-0">
                                                                    <motion.div
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        className="bg-gradient-to-r from-indigo-50 to-blue-50 border-x-4 border-indigo-300 p-5"
                                                                    >
                                                                        <div className="flex items-center justify-between mb-4">
                                                                            <div>
                                                                                <h3 className="text-lg font-bold text-gray-800">
                                                                                    📷 Imágenes — {editedProduct.name}
                                                                                </h3>
                                                                                <p className="text-xs text-gray-500 mt-0.5">ID: {product.id}</p>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => setImageEditorId(null)}
                                                                                className="p-2 hover:bg-white/60 rounded-lg text-gray-500 transition-colors"
                                                                            >✕</button>
                                                                        </div>

                                                                        {/* Main Image */}
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                            <div>
                                                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen Principal</label>
                                                                                <div className="flex gap-2 mb-3">
                                                                                    <input
                                                                                        type="text"
                                                                                        value={editingCell?.id === product.id && editingCell?.field === 'image' ? editValue : currentImage}
                                                                                        onFocus={() => {
                                                                                            setEditingCell({ id: product.id, field: 'image' });
                                                                                            setEditValue(currentImage);
                                                                                        }}
                                                                                        onChange={(e) => setEditValue(e.target.value)}
                                                                                        onBlur={() => {
                                                                                            if (editValue !== currentImage) {
                                                                                                updateImage(editValue);
                                                                                            }
                                                                                            setEditingCell(null);
                                                                                        }}
                                                                                        onKeyDown={(e) => {
                                                                                            if (e.key === 'Enter') {
                                                                                                updateImage(editValue);
                                                                                                setEditingCell(null);
                                                                                            }
                                                                                        }}
                                                                                        placeholder="URL de la imagen principal..."
                                                                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs bg-white"
                                                                                    />
                                                                                </div>
                                                                                <div className="w-40 h-40 rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                                                                                    <img
                                                                                        src={currentImage}
                                                                                        alt="Vista previa"
                                                                                        className="w-full h-full object-contain"
                                                                                        onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"><rect fill="%23f3f4f6" width="160" height="160" rx="12"/><text x="50%25" y="50%25" fill="%239ca3af" font-size="12" text-anchor="middle" dy=".3em">Sin imagen</text></svg>'; }}
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            {/* Gallery */}
                                                                            <div>
                                                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                                    Galería ({currentGallery.length} imágenes)
                                                                                </label>
                                                                                <div className="flex gap-2 mb-3">
                                                                                    <input
                                                                                        type="text"
                                                                                        value={newGalleryUrl}
                                                                                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                                                                                        onKeyDown={(e) => { if (e.key === 'Enter') addGalleryImage(); }}
                                                                                        placeholder="Pegar URL de imagen para agregar..."
                                                                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs bg-white"
                                                                                    />
                                                                                    <button
                                                                                        onClick={addGalleryImage}
                                                                                        disabled={!newGalleryUrl.trim()}
                                                                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                                                    >+ Agregar</button>
                                                                                </div>

                                                                                {currentGallery.length === 0 ? (
                                                                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm bg-white/50">
                                                                                        Sin imágenes en la galería. Pega una URL arriba para agregar.
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                                                                                        {currentGallery.map((url, idx) => (
                                                                                            <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-white">
                                                                                                <img
                                                                                                    src={url}
                                                                                                    alt={`Galería ${idx + 1} `}
                                                                                                    className="w-full h-full object-cover"
                                                                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect fill="%23fef2f2" width="80" height="80"/><text x="50%25" y="50%25" fill="%23ef4444" font-size="10" text-anchor="middle" dy=".3em">Error</text></svg>'; }}
                                                                                                />
                                                                                                <button
                                                                                                    onClick={() => removeGalleryImage(idx)}
                                                                                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                                                                    title="Eliminar imagen"
                                                                                                >✕</button>
                                                                                                <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/50 text-white text-[9px] rounded">
                                                                                                    {idx + 1}
                                                                                                </span>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {/* Video Section */}
                                                                        <div className="mt-6 pt-5 border-t border-indigo-200/60">
                                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                                🎬 Video de uso del producto
                                                                            </label>
                                                                            {(() => {
                                                                                const currentVideo = String(edits[product.id]?.video ?? product.video ?? '');
                                                                                const updateVideo = (url: string) => {
                                                                                    setEdits(prev => ({
                                                                                        ...prev,
                                                                                        [product.id]: { ...prev[product.id], video: url || undefined },
                                                                                    }));
                                                                                    setHasChanges(true);
                                                                                };
                                                                                return (
                                                                                    <div className="space-y-3">
                                                                                        <div className="flex gap-2">
                                                                                            <input
                                                                                                type="text"
                                                                                                value={editingCell?.id === product.id && editingCell?.field === 'video' ? editValue : currentVideo}
                                                                                                onFocus={() => {
                                                                                                    setEditingCell({ id: product.id, field: 'video' });
                                                                                                    setEditValue(currentVideo);
                                                                                                }}
                                                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                                                onBlur={() => {
                                                                                                    if (editValue !== currentVideo) {
                                                                                                        updateVideo(editValue);
                                                                                                    }
                                                                                                    setEditingCell(null);
                                                                                                }}
                                                                                                onKeyDown={(e) => {
                                                                                                    if (e.key === 'Enter') {
                                                                                                        updateVideo(editValue);
                                                                                                        setEditingCell(null);
                                                                                                    }
                                                                                                }}
                                                                                                placeholder="URL del video (YouTube, Vimeo, MP4, etc.)..."
                                                                                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs bg-white"
                                                                                            />
                                                                                            {currentVideo && (
                                                                                                <button
                                                                                                    onClick={() => updateVideo('')}
                                                                                                    className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                                                                                                    title="Eliminar video"
                                                                                                >🗑️</button>
                                                                                            )}
                                                                                        </div>
                                                                                        {currentVideo ? (
                                                                                            <div className="rounded-xl overflow-hidden border border-gray-200 bg-black shadow-sm">
                                                                                                {currentVideo.includes('youtube.com') || currentVideo.includes('youtu.be') ? (
                                                                                                    <iframe
                                                                                                        src={currentVideo.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                                                                                                        className="w-full aspect-video"
                                                                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                                        allowFullScreen
                                                                                                        title="Video preview"
                                                                                                    />
                                                                                                ) : currentVideo.includes('vimeo.com') ? (
                                                                                                    <iframe
                                                                                                        src={currentVideo.replace('vimeo.com/', 'player.vimeo.com/video/')}
                                                                                                        className="w-full aspect-video"
                                                                                                        allow="autoplay; fullscreen; picture-in-picture"
                                                                                                        allowFullScreen
                                                                                                        title="Video preview"
                                                                                                    />
                                                                                                ) : (
                                                                                                    <video
                                                                                                        src={currentVideo}
                                                                                                        controls
                                                                                                        className="w-full aspect-video"
                                                                                                        preload="metadata"
                                                                                                    >
                                                                                                        Tu navegador no soporta video HTML5.
                                                                                                    </video>
                                                                                                )}
                                                                                            </div>
                                                                                        ) : (
                                                                                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm bg-white/50">
                                                                                                <div className="text-3xl mb-2">🎥</div>
                                                                                                Sin video. Pega una URL de YouTube, Vimeo o MP4 arriba.
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })()}
                                                                        </div>

                                                                    </motion.div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })()
                                                }
                                                {/* Inline Variant Detail — appears right below this product */}
                                                {
                                                    expandedVariantGroup === product.id && (() => {
                                                        const group = dbVariantGroups.find(g => g.variants.some(v => v.productId === product.id));
                                                        if (!group) return null;
                                                        return (
                                                            <tr>
                                                                <td colSpan={12} className="p-0">
                                                                    <motion.div
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        className="bg-indigo-50 border-x-4 border-indigo-300 p-5"
                                                                    >
                                                                        <div className="flex items-center justify-between mb-4">
                                                                            <div>
                                                                                <h3 className="text-lg font-bold text-gray-800">{group.parentName}</h3>
                                                                                <p className="text-sm text-gray-500">
                                                                                    Atributos: <span className="font-medium text-indigo-700">{group.attributeNames.join(' / ')}</span>
                                                                                    &nbsp;·&nbsp;{group.variants.length} variantes
                                                                                </p>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => setExpandedVariantGroup(null)}
                                                                                className="p-2 hover:bg-indigo-100 rounded-lg text-gray-500 transition-colors"
                                                                            >✕</button>
                                                                        </div>
                                                                        <div className="overflow-x-auto">
                                                                            <table className="w-full text-sm">
                                                                                <thead>
                                                                                    <tr className="border-b border-indigo-200">
                                                                                        <th className="text-left px-3 py-2 text-xs font-semibold text-indigo-600">ID</th>
                                                                                        <th className="text-left px-3 py-2 text-xs font-semibold text-indigo-600">Nombre</th>
                                                                                        {group.attributeNames.map(attr => (
                                                                                            <th key={attr} className="text-left px-3 py-2 text-xs font-semibold text-indigo-600">{attr}</th>
                                                                                        ))}
                                                                                        <th className="text-right px-3 py-2 text-xs font-semibold text-indigo-600">P. Cliente</th>
                                                                                        <th className="text-right px-3 py-2 text-xs font-semibold text-indigo-600">P. Distribuidor</th>
                                                                                        <th className="text-left px-3 py-2 text-xs font-semibold text-indigo-600">Promoción</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody className="divide-y divide-indigo-100">
                                                                                    {group.variants.map(v => {
                                                                                        const vProduct = products.find(p => p.id === v.productId);
                                                                                        if (!vProduct) return null;
                                                                                        const editedVProduct = getProduct(vProduct);
                                                                                        return (
                                                                                            <tr key={v.productId} className="hover:bg-indigo-100/50">
                                                                                                <td className="px-3 py-2 text-xs font-mono text-gray-500">{v.productId}</td>
                                                                                                <td className="px-3 py-2">
                                                                                                    {renderEditableCell(editedVProduct, 'name', 'text', 'text-sm text-gray-900')}
                                                                                                </td>
                                                                                                {group.attributeNames.map(attr => (
                                                                                                    <td key={attr} className="px-3 py-2">
                                                                                                        <span className="px-2 py-0.5 bg-white border border-indigo-200 rounded text-xs">
                                                                                                            {v.attributes[attr] || '—'}
                                                                                                        </span>
                                                                                                    </td>
                                                                                                ))}
                                                                                                <td className="px-3 py-2 text-right">
                                                                                                    {renderEditableCell(editedVProduct, 'price', 'currency', 'text-sm font-semibold text-blue-800')}
                                                                                                </td>
                                                                                                <td className="px-3 py-2 text-right">
                                                                                                    {renderEditableCell(editedVProduct, 'distributorPrice', 'currency', 'text-sm font-semibold text-purple-800')}
                                                                                                </td>
                                                                                                <td className="px-3 py-2">
                                                                                                    {renderEditableCell(editedVProduct, 'promotion', 'text', 'text-xs text-green-700')}
                                                                                                </td>
                                                                                            </tr>
                                                                                        );
                                                                                    })}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </motion.div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })()
                                                }
                                            </Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Variant Groups Summary */}
                    <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Grupos de Variantes ({totalVariantGroups})</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {dbVariantGroups.map((g) => (
                                <button
                                    key={g.parentId}
                                    onClick={() => {
                                        setExpandedVariantGroup(expandedVariantGroup === g.parentId ? null : g.parentId);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`border rounded - lg p - 4 text - left transition - colors cursor - pointer ${expandedVariantGroup === g.parentId
                                        ? 'border-indigo-400 bg-indigo-50 shadow-md'
                                        : 'border-gray-100 hover:border-indigo-200'
                                        } `}
                                >
                                    <h3 className="font-semibold text-sm text-gray-800">{g.parentName}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-500">{g.attributeNames.join(' / ')}</span>
                                        <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">{g.variants.length} variantes</span>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {g.variants.slice(0, 6).map(v => (
                                            <span key={v.productId} className="px-1.5 py-0.5 bg-gray-50 text-gray-600 rounded text-[10px]">
                                                {Object.values(v.attributes).join(' · ')}
                                            </span>
                                        ))}
                                        {g.variants.length > 6 && (
                                            <span className="px-1.5 py-0.5 text-gray-400 text-[10px]">+{g.variants.length - 6} más</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                </>
            )}

            {/* Variants Tab */}
            {activeTab === 'variants' && (
                <VariantManager
                    groups={rawDbGroups}
                    products={products}
                    loading={variantsLoading}
                    createGroup={createGroup}
                    deleteGroup={deleteGroup}
                    addVariant={addVariant}
                    removeVariant={removeVariant}
                />
            )}
        </div >
    );
}
