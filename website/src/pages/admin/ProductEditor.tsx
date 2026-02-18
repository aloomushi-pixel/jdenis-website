import { motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { products, getVariantCount, variantGroups } from '../../data/products';
import type { Product } from '../../store/cartStore';
import * as XLSX from 'xlsx';

// ═══════════════════════════════════════════
// Excel row <-> Product mapping
// ═══════════════════════════════════════════
function productToRow(p: Product) {
    return {
        ID: p.id,
        Nombre: p.name,
        'Precio Cliente': p.price,
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
        Variantes: getVariantCount(p.id),
    };
}

export default function ProductEditor() {
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
    // Editable state: product overrides stored in memory
    // ═══════════════════════════════════════════
    const [edits, setEdits] = useState<Record<string, Partial<Product>>>({});
    const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
    const [editValue, setEditValue] = useState('');
    const editInputRef = useRef<HTMLInputElement>(null);
    const [hasChanges, setHasChanges] = useState(false);

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

    // Save edit
    const saveEdit = () => {
        if (!editingCell) return;
        const { id, field } = editingCell;

        let value: string | number | undefined = editValue;
        if (['price', 'distributorPrice', 'stock'].includes(field)) {
            value = editValue === '' ? undefined : Number(editValue);
        }

        setEdits(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
        setEditingCell(null);
        setHasChanges(true);
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

    // Unique categories
    const uniqueCategories = useMemo(() => {
        const cats = new Set(products.map(p => p.category));
        return Array.from(cats).sort();
    }, []);

    // Apply edits to products for display
    const getProduct = (p: Product): Product => {
        const override = edits[p.id];
        if (!override) return p;
        return { ...p, ...override };
    };

    // Filtered and sorted products
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
    }, [search, categoryFilter, sortBy, sortDir, edits]);

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

        const variantRows = variantGroups.map(g => ({
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
        showNotification('success', `✅ Exportado JSON con ${products.length} productos (incluye ediciones)`);
    };

    // Sort
    const handleSort = (col: 'name' | 'price' | 'category' | 'id') => {
        if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortBy(col); setSortDir('asc'); }
    };

    const SortIcon = ({ col }: { col: string }) => {
        if (sortBy !== col) return <span className="text-gray-300 ml-1">↕</span>;
        return <span className="text-indigo-600 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
    };

    // Stats
    const totalProducts = products.length;
    const totalVariantGroups = variantGroups.length;
    const totalVariantSKUs = variantGroups.reduce((acc, g) => acc + g.variants.length, 0);
    const editedCount = Object.keys(edits).length;

    // ═══════════════════════════════════════════
    // Editable cell component
    // ═══════════════════════════════════════════
    const EditableCell = ({ product, field, type = 'text', className = '' }: {
        product: Product;
        field: keyof Product;
        type?: 'text' | 'number' | 'currency';
        className?: string;
    }) => {
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
            ? `$${Number(value).toLocaleString()}`
            : (value ?? '—');

        return (
            <button
                onClick={() => startEdit(product.id, field as string, value as string | number)}
                className={`text-left w-full px-2 py-1 rounded hover:bg-indigo-50 transition-colors cursor-pointer group ${isEdited ? 'bg-amber-50 border border-amber-200' : ''
                    } ${className}`}
                title="Click para editar"
            >
                <span className={`${!value && value !== 0 ? 'text-gray-300' : ''}`}>
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

    return (
        <div>
            {/* Notification Toast */}
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${notification.type === 'success' ? 'bg-green-600'
                        : notification.type === 'info' ? 'bg-blue-600'
                            : 'bg-red-600'
                        }`}
                >
                    {notification.msg}
                </motion.div>
            )}

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Editor de Catálogo</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {totalProducts} productos · {totalVariantGroups} grupos de variantes · {totalVariantSKUs} SKUs agrupados
                        {editedCount > 0 && (
                            <span className="ml-2 text-amber-600 font-medium">
                                · {editedCount} productos editados
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Unsaved changes indicator */}
                    {hasChanges && (
                        <span className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium flex items-center gap-1">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                            Cambios sin exportar
                        </span>
                    )}

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
            </div>

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
                                    ID <SortIcon col="id" />
                                </th>
                                <th
                                    className="text-left px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 min-w-[180px]"
                                    onClick={() => handleSort('name')}
                                >
                                    Nombre <SortIcon col="name" />
                                </th>
                                <th
                                    className="text-right px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 min-w-[100px]"
                                    onClick={() => handleSort('price')}
                                >
                                    <span className="text-blue-700">💰 P. Cliente</span> <SortIcon col="price" />
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
                                    Categoría <SortIcon col="category" />
                                </th>
                                <th className="text-center px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">V</th>
                                <th className="text-center px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">⭐</th>
                                <th className="text-left px-3 py-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider max-w-[200px]">Descripción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((product, index) => {
                                const vc = getVariantCount(product.id);
                                const isEdited = !!edits[product.id];
                                return (
                                    <tr
                                        key={product.id}
                                        className={`hover:bg-indigo-50/30 transition-colors ${isEdited ? 'bg-amber-50/40' : ''}`}
                                    >
                                        <td className="px-3 py-2 text-xs text-gray-400">{index + 1}</td>
                                        <td className="px-3 py-2">
                                            <img
                                                src={product.image}
                                                alt=""
                                                className="w-8 h-8 rounded object-cover bg-gray-100"
                                                loading="lazy"
                                                onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect fill="%23f3f4f6" width="32" height="32"/><text x="50%25" y="50%25" fill="%239ca3af" font-size="8" text-anchor="middle" dy=".3em">?</text></svg>'; }}
                                            />
                                        </td>
                                        <td className="px-3 py-2 text-[11px] text-gray-500 font-mono">{product.id}</td>
                                        <td className="px-3 py-2 min-w-[180px]">
                                            <EditableCell product={product} field="name" className="text-sm font-medium text-gray-900" />
                                        </td>
                                        <td className="px-3 py-2 text-right min-w-[100px]">
                                            <EditableCell product={product} field="price" type="currency" className="text-sm font-semibold text-blue-800" />
                                        </td>
                                        <td className="px-3 py-2 text-right min-w-[110px]">
                                            <EditableCell product={product} field="distributorPrice" type="currency" className="text-sm font-semibold text-purple-800" />
                                        </td>
                                        <td className="px-3 py-2 min-w-[130px]">
                                            <EditableCell product={product} field="promotion" className="text-xs text-green-700" />
                                        </td>
                                        <td className="px-3 py-2">
                                            <EditableCell product={product} field="category" className="text-xs text-gray-600" />
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            {vc > 1 ? (
                                                <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-medium">{vc}</span>
                                            ) : (
                                                <span className="text-gray-300 text-[10px]">—</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 text-center">
                                            {product.isFeatured ? <span className="text-amber-500 text-xs">⭐</span> : <span className="text-gray-300 text-[10px]">—</span>}
                                        </td>
                                        <td className="px-3 py-2 max-w-[200px]">
                                            <EditableCell product={product} field="description" className="text-[11px] text-gray-500 line-clamp-1" />
                                        </td>
                                    </tr>
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
                    {variantGroups.map((g) => (
                        <div key={g.parentId} className="border border-gray-100 rounded-lg p-4 hover:border-indigo-200 transition-colors">
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
