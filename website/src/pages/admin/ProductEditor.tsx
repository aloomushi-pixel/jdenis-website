import { motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import { products, getVariantCount, variantGroups } from '../../data/products';
import type { Product } from '../../store/cartStore';
import * as XLSX from 'xlsx';

// Flatten product data for Excel export
function productToRow(p: Product) {
    return {
        ID: p.id,
        Nombre: p.name,
        Precio: p.price,
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
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showNotification = (type: 'success' | 'error', msg: string) => {
        setNotification({ type, msg });
        setTimeout(() => setNotification(null), 4000);
    };

    // Unique categories
    const uniqueCategories = useMemo(() => {
        const cats = new Set(products.map(p => p.category));
        return Array.from(cats).sort();
    }, []);

    // Filtered and sorted products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(p =>
                p.id.toLowerCase().includes(q) ||
                p.name.toLowerCase().includes(q) ||
                (p.description || '').toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
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
    }, [search, categoryFilter, sortBy, sortDir]);

    // ═══════════════════════════════════════════
    // EXPORT TO EXCEL
    // ═══════════════════════════════════════════
    const handleExportExcel = () => {
        const rows = products.map(productToRow);
        const worksheet = XLSX.utils.json_to_sheet(rows);

        // Set column widths
        worksheet['!cols'] = [
            { wch: 30 }, // ID
            { wch: 45 }, // Nombre
            { wch: 10 }, // Precio
            { wch: 20 }, // Categoría
            { wch: 50 }, // Imagen
            { wch: 60 }, // Descripción
            { wch: 8 },  // Stock
            { wch: 8 },  // Destacado
            { wch: 60 }, // Beneficios
            { wch: 50 }, // Incluye
            { wch: 50 }, // Especificaciones
            { wch: 30 }, // Performance
            { wch: 50 }, // Galería
            { wch: 30 }, // Categorías Relacionadas
            { wch: 10 }, // Variantes
        ];

        // Also add variant groups as separate sheet
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

        // Reset input so the same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ═══════════════════════════════════════════
    // EXPORT TO JSON (downloadable products.ts data)
    // ═══════════════════════════════════════════
    const handleExportJSON = () => {
        const json = JSON.stringify(products, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('success', `✅ Exportado JSON con ${products.length} productos`);
    };

    // Sort handler
    const handleSort = (col: 'name' | 'price' | 'category' | 'id') => {
        if (sortBy === col) {
            setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(col);
            setSortDir('asc');
        }
    };

    const SortIcon = ({ col }: { col: string }) => {
        if (sortBy !== col) return <span className="text-gray-300 ml-1">↕</span>;
        return <span className="text-indigo-600 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
    };

    // Stats
    const totalProducts = products.length;
    const totalVariantGroups = variantGroups.length;
    const totalVariantSKUs = variantGroups.reduce((acc, g) => acc + g.variants.length, 0);

    return (
        <div>
            {/* Notification Toast */}
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
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
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
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
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                    <input
                        type="text"
                        placeholder="Buscar por ID, nombre, descripción..."
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
                        >
                            ✕
                        </button>
                    </div>

                    {/* Column mapping preview */}
                    <div className="mb-4 flex flex-wrap gap-2">
                        {Object.keys(importData[0] || {}).map(col => (
                            <span key={col} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                {col}
                            </span>
                        ))}
                    </div>

                    {/* Preview table */}
                    <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-lg">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-3 py-2 text-left text-gray-500 font-semibold">#</th>
                                    {Object.keys(importData[0] || {}).map(col => (
                                        <th key={col} className="px-3 py-2 text-left text-gray-500 font-semibold whitespace-nowrap">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {importData.slice(0, 20).map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                                        {Object.values(row).map((val, j) => (
                                            <td key={j} className="px-3 py-2 text-gray-700 max-w-[200px] truncate">
                                                {String(val)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {importData.length > 20 && (
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            Mostrando 20 de {importData.length} filas
                        </p>
                    )}

                    <div className="mt-4 flex items-center gap-3">
                        <button
                            onClick={() => {
                                // Export imported data as JSON for developer use
                                const json = JSON.stringify(importData, null, 2);
                                const blob = new Blob([json], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `imported_products_${new Date().toISOString().split('T')[0]}.json`;
                                a.click();
                                URL.revokeObjectURL(url);
                                showNotification('success', '✅ Datos importados guardados como JSON');
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
                        >
                            💾 Descargar como JSON
                        </button>
                        <button
                            onClick={() => { setShowImportPreview(false); setImportData(null); }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                        >
                            Cerrar
                        </button>
                        <p className="text-xs text-gray-400 ml-auto">
                            Descarga el JSON y reemplaza los datos en products.ts
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">
                                    #
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Imagen
                                </th>
                                <th
                                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600"
                                    onClick={() => handleSort('id')}
                                >
                                    ID <SortIcon col="id" />
                                </th>
                                <th
                                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 min-w-[200px]"
                                    onClick={() => handleSort('name')}
                                >
                                    Nombre <SortIcon col="name" />
                                </th>
                                <th
                                    className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600"
                                    onClick={() => handleSort('price')}
                                >
                                    Precio <SortIcon col="price" />
                                </th>
                                <th
                                    className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600"
                                    onClick={() => handleSort('category')}
                                >
                                    Categoría <SortIcon col="category" />
                                </th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Variantes
                                </th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Destacado
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider max-w-[300px]">
                                    Descripción
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((product, index) => {
                                const vc = getVariantCount(product.id);
                                return (
                                    <motion.tr
                                        key={product.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: Math.min(index * 0.01, 0.5) }}
                                        className="hover:bg-indigo-50/30 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-xs text-gray-400">{index + 1}</td>
                                        <td className="px-4 py-3">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                                loading="lazy"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect fill="%23f3f4f6" width="40" height="40"/><text x="50%" y="50%" fill="%239ca3af" font-size="10" text-anchor="middle" dy=".3em">?</text></svg>';
                                                }}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{product.id}</td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                                            ${product.price.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {vc > 1 ? (
                                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                                    {vc}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {product.isFeatured ? (
                                                <span className="text-amber-500">⭐</span>
                                            ) : (
                                                <span className="text-gray-300 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 max-w-[300px]">
                                            <p className="text-xs text-gray-500 line-clamp-2">
                                                {product.description || '—'}
                                            </p>
                                        </td>
                                    </motion.tr>
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
                                <span className="text-xs text-gray-500">
                                    {g.attributeNames.join(' / ')}
                                </span>
                                <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                    {g.variants.length} variantes
                                </span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {g.variants.slice(0, 6).map(v => (
                                    <span key={v.productId} className="px-1.5 py-0.5 bg-gray-50 text-gray-600 rounded text-[10px]">
                                        {Object.values(v.attributes).join(' · ')}
                                    </span>
                                ))}
                                {g.variants.length > 6 && (
                                    <span className="px-1.5 py-0.5 text-gray-400 text-[10px]">
                                        +{g.variants.length - 6} más
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
