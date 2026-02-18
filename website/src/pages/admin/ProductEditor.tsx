import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { products, getVariantCount, variantGroups as localVariantGroups } from '../../data/products';
import type { Product } from '../../store/cartStore';
import type { ProductVariantGroup, Promotion } from '../../lib/supabase';
import {
    getProductVariantGroups, createProductVariantGroup,
    updateProductVariantGroup, deleteProductVariantGroup,
    getPromotions,
} from '../../lib/supabase';
import * as XLSX from 'xlsx';

type Tab = 'catalog' | 'variants' | 'promotions';

// ─── Helpers ──────────────────────────────────────────────────
const fmt = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 0 })}`;

function productToRow(p: Product) {
    return {
        ID: p.id, Nombre: p.name, Precio: p.price, 'Categoría': p.category,
        Imagen: p.image, 'Descripción': p.description || '', Stock: p.stock || 0,
        Destacado: p.isFeatured ? 'Sí' : 'No', Beneficios: (p.benefits || []).join(' | '),
        Incluye: (p.includes || []).join(' | '), Especificaciones: (p.specifications || []).join(' | '),
        Performance: p.performance || '', 'Galería': (p.gallery || []).join(' | '),
        'Categorías Relacionadas': (p.relatedCategories || []).join(' | '),
        Variantes: getVariantCount(p.id),
    };
}

// ─── Empty form states ────────────────────────────────────────
const emptyVariantGroup: Omit<ProductVariantGroup, 'id' | 'created_at' | 'updated_at'> = {
    parent_id: '', parent_name: '', attribute_names: [''],
    variants: [], is_active: true,
};

export default function ProductEditor() {
    const [tab, setTab] = useState<Tab>('catalog');

    // ═══ Catalog state ═══
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'category' | 'id'>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [importData, setImportData] = useState<Record<string, string | number>[] | null>(null);
    const [importFileName, setImportFileName] = useState('');
    const [showImportPreview, setShowImportPreview] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ═══ Variants state ═══
    const [variantGroups, setVariantGroups] = useState<ProductVariantGroup[]>([]);
    const [showVarForm, setShowVarForm] = useState(false);
    const [editVar, setEditVar] = useState<ProductVariantGroup | null>(null);
    const [varForm, setVarForm] = useState(emptyVariantGroup);
    const [varLoading, setVarLoading] = useState(false);

    // ═══ Promotions state ═══
    const [promos, setPromos] = useState<Promotion[]>([]);

    const showNotification = (type: 'success' | 'error', msg: string) => {
        setNotification({ type, msg });
        setTimeout(() => setNotification(null), 4000);
    };

    // ─── Load remote data ─────────────────────────────────────
    const loadRemote = async () => {
        setVarLoading(true);
        try {
            const [vg, pr] = await Promise.all([getProductVariantGroups(), getPromotions()]);
            setVariantGroups(vg);
            setPromos(pr);
        } catch (e: unknown) { showNotification('error', (e as Error).message); }
        setVarLoading(false);
    };
    useEffect(() => { loadRemote(); }, []);

    // ─── Catalog logic ────────────────────────────────────────
    const uniqueCategories = useMemo(() => {
        const cats = new Set(products.map(p => p.category));
        return Array.from(cats).sort();
    }, []);

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
        if (categoryFilter !== 'all') result = result.filter(p => p.category === categoryFilter);
        result.sort((a, b) => {
            let cmp = 0;
            if (sortBy === 'name') cmp = a.name.localeCompare(b.name);
            else if (sortBy === 'price') cmp = a.price - b.price;
            else if (sortBy === 'category') cmp = a.category.localeCompare(b.category);
            else cmp = a.id.localeCompare(b.id);
            return sortDir === 'asc' ? cmp : -cmp;
        });
        return result;
    }, [search, categoryFilter, sortBy, sortDir]);

    // ─── Export funcs ─────────────────────────────────────────
    const handleExportExcel = () => {
        const rows = products.map(productToRow);
        const worksheet = XLSX.utils.json_to_sheet(rows);
        worksheet['!cols'] = [
            { wch: 30 }, { wch: 45 }, { wch: 10 }, { wch: 20 }, { wch: 50 },
            { wch: 60 }, { wch: 8 }, { wch: 8 }, { wch: 60 }, { wch: 50 },
            { wch: 50 }, { wch: 30 }, { wch: 50 }, { wch: 30 }, { wch: 10 },
        ];
        const variantRows = localVariantGroups.map(g => ({
            'Producto Padre (ID)': g.parentId, 'Nombre Padre': g.parentName,
            Atributos: g.attributeNames.join(', '),
            'Cantidad de Variantes': g.variants.length,
            'IDs de Variantes': g.variants.map(v => v.productId).join(' | '),
        }));
        const variantSheet = XLSX.utils.json_to_sheet(variantRows);
        variantSheet['!cols'] = [{ wch: 30 }, { wch: 40 }, { wch: 30 }, { wch: 15 }, { wch: 80 }];
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
        XLSX.utils.book_append_sheet(workbook, variantSheet, 'Grupos de Variantes');
        XLSX.writeFile(workbook, `catalogo_jdenis_${new Date().toISOString().split('T')[0]}.xlsx`);
        showNotification('success', `✅ Exportados ${products.length} productos a Excel`);
    };

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
                const jsonData = XLSX.utils.sheet_to_json<Record<string, string | number>>(workbook.Sheets[firstSheet]);
                if (!jsonData.length) { showNotification('error', '⚠️ El archivo no contiene datos'); return; }
                setImportData(jsonData); setShowImportPreview(true);
                showNotification('success', `📋 ${jsonData.length} filas leídas de "${file.name}"`);
            } catch { showNotification('error', '❌ Error al leer el archivo Excel'); }
        };
        reader.readAsArrayBuffer(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleExportJSON = () => {
        const json = JSON.stringify(products, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `products_${new Date().toISOString().split('T')[0]}.json`;
        a.click(); URL.revokeObjectURL(url);
        showNotification('success', `✅ Exportado JSON con ${products.length} productos`);
    };

    // ─── Sort helpers ─────────────────────────────────────────
    const handleSort = (col: 'name' | 'price' | 'category' | 'id') => {
        if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortBy(col); setSortDir('asc'); }
    };
    const SortIcon = ({ col }: { col: string }) => {
        if (sortBy !== col) return <span className="text-gray-300 ml-1">↕</span>;
        return <span className="text-indigo-600 ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>;
    };

    // ─── Variant Handlers ─────────────────────────────────────
    const openNewVar = () => { setEditVar(null); setVarForm(emptyVariantGroup); setShowVarForm(true); };
    const openEditVar = (g: ProductVariantGroup) => {
        setEditVar(g);
        setVarForm({
            parent_id: g.parent_id, parent_name: g.parent_name,
            attribute_names: [...g.attribute_names],
            variants: g.variants.map(v => ({ ...v })),
            is_active: g.is_active,
        });
        setShowVarForm(true);
    };
    const saveVar = async () => {
        try {
            const payload = { ...varForm };
            if (editVar) await updateProductVariantGroup(editVar.id, payload);
            else await createProductVariantGroup(payload);
            setShowVarForm(false); loadRemote();
            showNotification('success', editVar ? '✅ Grupo actualizado' : '✅ Grupo creado');
        } catch (e: unknown) { showNotification('error', (e as Error).message); }
    };
    const toggleVar = async (g: ProductVariantGroup) => {
        await updateProductVariantGroup(g.id, { is_active: !g.is_active }); loadRemote();
    };
    const removeVar = async (id: string) => {
        if (!confirm('¿Eliminar este grupo de variantes?')) return;
        await deleteProductVariantGroup(id); loadRemote();
    };
    const importLocalVariants = async () => {
        if (!confirm(`¿Importar ${localVariantGroups.length} grupos locales a Supabase?`)) return;
        try {
            for (const g of localVariantGroups) {
                await createProductVariantGroup({
                    parent_id: g.parentId, parent_name: g.parentName,
                    attribute_names: g.attributeNames,
                    variants: g.variants.map(v => ({ productId: v.productId, attributes: v.attributes })),
                    is_active: true,
                });
            }
            showNotification('success', `✅ ${localVariantGroups.length} grupos importados`);
            loadRemote();
        } catch (e: unknown) { showNotification('error', (e as Error).message); }
    };

    // ─── Variant form helpers ─────────────────────────────────
    const addAttribute = () => setVarForm({ ...varForm, attribute_names: [...varForm.attribute_names, ''] });
    const removeAttribute = (i: number) => {
        const names = varForm.attribute_names.filter((_, idx) => idx !== i);
        const vars = varForm.variants.map(v => {
            const attrs = { ...v.attributes };
            delete attrs[varForm.attribute_names[i]];
            return { ...v, attributes: attrs };
        });
        setVarForm({ ...varForm, attribute_names: names, variants: vars });
    };
    const updateAttributeName = (i: number, name: string) => {
        const oldName = varForm.attribute_names[i];
        const names = [...varForm.attribute_names]; names[i] = name;
        const vars = varForm.variants.map(v => {
            const attrs = { ...v.attributes };
            if (oldName in attrs) { attrs[name] = attrs[oldName]; delete attrs[oldName]; }
            return { ...v, attributes: attrs };
        });
        setVarForm({ ...varForm, attribute_names: names, variants: vars });
    };
    const addVariantItem = () => {
        const newAttrs: Record<string, string> = {};
        varForm.attribute_names.forEach(n => { newAttrs[n] = ''; });
        setVarForm({ ...varForm, variants: [...varForm.variants, { productId: '', attributes: newAttrs }] });
    };
    const removeVariantItem = (i: number) => {
        setVarForm({ ...varForm, variants: varForm.variants.filter((_, idx) => idx !== i) });
    };
    const selectParentProduct = (productId: string) => {
        const p = products.find(pr => pr.id === productId);
        if (p) setVarForm({ ...varForm, parent_id: p.id, parent_name: p.name });
    };

    // ─── Promo helpers ────────────────────────────────────────
    const getProductPromos = (productId: string, category: string) => {
        return promos.filter(p => {
            if (!p.is_active) return false;
            const now = new Date();
            if (new Date(p.start_date) > now || new Date(p.end_date) < now) return false;
            const hasProductFilter = p.applicable_products && p.applicable_products.length > 0;
            const hasCategoryFilter = p.applicable_categories && p.applicable_categories.length > 0;
            if (!hasProductFilter && !hasCategoryFilter) return true;
            if (hasProductFilter && p.applicable_products.includes(productId)) return true;
            if (hasCategoryFilter && p.applicable_categories.includes(category)) return true;
            return false;
        });
    };

    // ─── Stats ────────────────────────────────────────────────
    const totalProducts = products.length;
    const totalVarGroups = variantGroups.length || localVariantGroups.length;
    const totalVarSKUs = variantGroups.length
        ? variantGroups.reduce((a, g) => a + g.variants.length, 0)
        : localVariantGroups.reduce((a, g) => a + g.variants.length, 0);
    const activePromos = promos.filter(p => p.is_active).length;

    return (
        <div>
            {/* Notification */}
            {notification && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {notification.msg}
                </motion.div>
            )}

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Editor de Catálogo</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {totalProducts} productos · {totalVarGroups} grupos de variantes · {totalVarSKUs} SKUs · {activePromos} promos activas
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
                {([
                    { key: 'catalog' as Tab, label: '📦 Catálogo', count: totalProducts },
                    { key: 'variants' as Tab, label: '🔀 Variantes', count: totalVarGroups },
                    { key: 'promotions' as Tab, label: '🏷️ Promociones', count: activePromos },
                ]).map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.key
                            ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        {t.label}
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-200 text-xs">{t.count}</span>
                    </button>
                ))}
            </div>

            {/* ═══════════════ CATALOG TAB ═══════════════ */}
            {tab === 'catalog' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                        <button onClick={handleExportExcel}
                            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
                            Exportar Excel
                        </button>
                        <label className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm cursor-pointer">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                            Importar Excel
                            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleImportExcel} />
                        </label>
                        <button onClick={handleExportJSON}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors shadow-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>
                            JSON
                        </button>
                    </div>

                    {/* Search & Filter */}
                    <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                            <input type="text" placeholder="Buscar por ID, nombre, descripción..." value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option value="all">Todas las categorías</option>
                            {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <span className="text-sm text-gray-500 self-center whitespace-nowrap">{filteredProducts.length} de {totalProducts}</span>
                    </div>

                    {/* Import Preview */}
                    {showImportPreview && importData && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-lg p-6 mb-4 border-2 border-blue-200">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Vista Previa de Importación</h3>
                                    <p className="text-sm text-gray-500">📁 {importFileName} · {importData.length} filas · {Object.keys(importData[0] || {}).length} columnas</p>
                                </div>
                                <button onClick={() => { setShowImportPreview(false); setImportData(null); }} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">✕</button>
                            </div>
                            <div className="mb-4 flex flex-wrap gap-2">
                                {Object.keys(importData[0] || {}).map(col => (
                                    <span key={col} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">{col}</span>
                                ))}
                            </div>
                            <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-lg">
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50 sticky top-0"><tr>
                                        <th className="px-3 py-2 text-left text-gray-500 font-semibold">#</th>
                                        {Object.keys(importData[0] || {}).map(col => <th key={col} className="px-3 py-2 text-left text-gray-500 font-semibold whitespace-nowrap">{col}</th>)}
                                    </tr></thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {importData.slice(0, 20).map((row, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                                                {Object.values(row).map((val, j) => <td key={j} className="px-3 py-2 text-gray-700 max-w-[200px] truncate">{String(val)}</td>)}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {importData.length > 20 && <p className="text-xs text-gray-400 mt-2 text-center">Mostrando 20 de {importData.length} filas</p>}
                            <div className="mt-4 flex items-center gap-3">
                                <button onClick={() => {
                                    const json = JSON.stringify(importData, null, 2);
                                    const blob = new Blob([json], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a'); a.href = url;
                                    a.download = `imported_products_${new Date().toISOString().split('T')[0]}.json`;
                                    a.click(); URL.revokeObjectURL(url);
                                    showNotification('success', '✅ Datos importados guardados como JSON');
                                }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">💾 Descargar como JSON</button>
                                <button onClick={() => { setShowImportPreview(false); setImportData(null); }}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300">Cerrar</button>
                            </div>
                        </motion.div>
                    )}

                    {/* Products Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead><tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">#</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Imagen</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600" onClick={() => handleSort('id')}>ID <SortIcon col="id" /></th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600 min-w-[200px]" onClick={() => handleSort('name')}>Nombre <SortIcon col="name" /></th>
                                    <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600" onClick={() => handleSort('price')}>Precio <SortIcon col="price" /></th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-indigo-600" onClick={() => handleSort('category')}>Categoría <SortIcon col="category" /></th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Variantes</th>
                                    <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Destacado</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider max-w-[300px]">Descripción</th>
                                </tr></thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredProducts.map((product, index) => {
                                        const vc = getVariantCount(product.id);
                                        return (
                                            <motion.tr key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                transition={{ delay: Math.min(index * 0.01, 0.5) }} className="hover:bg-indigo-50/30 transition-colors">
                                                <td className="px-4 py-3 text-xs text-gray-400">{index + 1}</td>
                                                <td className="px-4 py-3">
                                                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" loading="lazy"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect fill="%23f3f4f6" width="40" height="40"/><text x="50%" y="50%" fill="%239ca3af" font-size="10" text-anchor="middle" dy=".3em">?</text></svg>'; }} />
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-500 font-mono">{product.id}</td>
                                                <td className="px-4 py-3"><p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p></td>
                                                <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">${product.price.toLocaleString()}</td>
                                                <td className="px-4 py-3"><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{product.category}</span></td>
                                                <td className="px-4 py-3 text-center">
                                                    {vc > 1 ? <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">{vc}</span>
                                                        : <span className="text-gray-300 text-xs">—</span>}
                                                </td>
                                                <td className="px-4 py-3 text-center">{product.isFeatured ? <span className="text-amber-500">⭐</span> : <span className="text-gray-300 text-xs">—</span>}</td>
                                                <td className="px-4 py-3 max-w-[300px]"><p className="text-xs text-gray-500 line-clamp-2">{product.description || '—'}</p></td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ═══════════════ VARIANTS TAB ═══════════════ */}
            {tab === 'variants' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <button onClick={openNewVar}
                                className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                Nuevo Grupo
                            </button>
                            {variantGroups.length === 0 && localVariantGroups.length > 0 && (
                                <button onClick={importLocalVariants}
                                    className="px-4 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                                    Importar {localVariantGroups.length} Locales
                                </button>
                            )}
                        </div>
                    </div>

                    {varLoading ? (
                        <div className="flex items-center justify-center h-32">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : variantGroups.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                            <p className="text-gray-500">No hay grupos de variantes en Supabase</p>
                            {localVariantGroups.length > 0 && (
                                <button onClick={importLocalVariants} className="mt-3 text-amber-600 hover:underline text-sm">
                                    Importar {localVariantGroups.length} grupos locales →
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {variantGroups.map(g => (
                                <div key={g.id} className={`bg-white rounded-xl border p-5 transition-all hover:shadow-md ${g.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold text-sm text-gray-800">{g.parent_name}</h3>
                                        <button onClick={() => toggleVar(g)}>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${g.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {g.is_active ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2 font-mono">{g.parent_id}</p>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs text-gray-500">{g.attribute_names.join(' / ')}</span>
                                        <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">{g.variants.length} variantes</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {g.variants.slice(0, 5).map(v => (
                                            <span key={v.productId} className="px-1.5 py-0.5 bg-gray-50 text-gray-600 rounded text-[10px]">
                                                {Object.values(v.attributes).join(' · ')}
                                            </span>
                                        ))}
                                        {g.variants.length > 5 && <span className="px-1.5 py-0.5 text-gray-400 text-[10px]">+{g.variants.length - 5} más</span>}
                                    </div>
                                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                                        <button onClick={() => openEditVar(g)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Editar</button>
                                        <button onClick={() => removeVar(g.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* ═══════════════ PROMOTIONS TAB ═══════════════ */}
            {tab === 'promotions' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">Vista rápida de promociones activas por producto</p>
                        <a href="/admin/pricing" className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                            Gestionar Promociones →
                        </a>
                    </div>

                    {promos.filter(p => p.is_active).length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /></svg>
                            <p className="text-gray-500">No hay promociones activas</p>
                            <a href="/admin/pricing" className="mt-3 text-indigo-600 hover:underline text-sm inline-block">Crear promoción →</a>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Producto</th>
                                        <th className="text-right px-4 py-3 font-medium text-gray-600">Precio</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Categoría</th>
                                        <th className="text-left px-4 py-3 font-medium text-gray-600">Promociones Aplicables</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.filter(p => getProductPromos(p.id, p.category).length > 0).map(p => {
                                        const applicablePromos = getProductPromos(p.id, p.category);
                                        return (
                                            <tr key={p.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover bg-gray-100" />
                                                        <span className="font-medium text-gray-900 text-sm">{p.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right text-gray-700">{fmt(p.price)}</td>
                                                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{p.category}</span></td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {applicablePromos.map(promo => (
                                                            <span key={promo.id} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                                {promo.name}: {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : fmt(promo.discount_value)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {products.filter(p => getProductPromos(p.id, p.category).length > 0).length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm">
                                    Las promociones activas aplican a todos los productos (sin filtro específico)
                                </div>
                            )}
                        </div>
                    )}

                    {/* Active promos summary */}
                    {promos.filter(p => p.is_active).length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-5">
                            <h3 className="text-sm font-bold text-gray-800 mb-3">Resumen de Promociones Activas</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {promos.filter(p => p.is_active).map(p => (
                                    <div key={p.id} className="border border-gray-100 rounded-lg p-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-sm text-gray-900">{p.name}</span>
                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                {p.discount_type === 'percentage' ? `${p.discount_value}%` : fmt(p.discount_value)}
                                            </span>
                                        </div>
                                        {p.code && <p className="text-xs font-mono text-gray-400 mt-1">Código: {p.code}</p>}
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(p.start_date).toLocaleDateString('es-MX')} — {new Date(p.end_date).toLocaleDateString('es-MX')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}

            {/* ═══════════════ VARIANT FORM MODAL ═══════════════ */}
            <AnimatePresence>
                {showVarForm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowVarForm(false)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                {editVar ? 'Editar Grupo de Variantes' : 'Nuevo Grupo de Variantes'}
                            </h3>

                            <div className="space-y-4">
                                {/* Parent product */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Producto Padre *</label>
                                    <select value={varForm.parent_id} onChange={e => selectParentProduct(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="">Seleccionar producto...</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Grupo *</label>
                                    <input type="text" value={varForm.parent_name}
                                        onChange={e => setVarForm({ ...varForm, parent_name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ej: Extensiones Mink J.Denis" />
                                </div>

                                {/* Attribute names */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Atributos</label>
                                    <div className="space-y-2">
                                        {varForm.attribute_names.map((attr, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input type="text" value={attr} onChange={e => updateAttributeName(i, e.target.value)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder={`Ej: Curva, Grosor, Largo...`} />
                                                {varForm.attribute_names.length > 1 && (
                                                    <button onClick={() => removeAttribute(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">✕</button>
                                                )}
                                            </div>
                                        ))}
                                        <button onClick={addAttribute} className="text-xs text-indigo-600 hover:underline">+ Agregar atributo</button>
                                    </div>
                                </div>

                                {/* Variant items */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700">Variantes ({varForm.variants.length})</label>
                                        <button onClick={addVariantItem} className="text-xs text-indigo-600 hover:underline">+ Agregar variante</button>
                                    </div>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {varForm.variants.map((v, i) => (
                                            <div key={i} className="flex gap-2 items-start bg-gray-50 p-2 rounded-lg">
                                                <select value={v.productId}
                                                    onChange={e => {
                                                        const vars = [...varForm.variants]; vars[i] = { ...vars[i], productId: e.target.value };
                                                        setVarForm({ ...varForm, variants: vars });
                                                    }}
                                                    className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500">
                                                    <option value="">Producto...</option>
                                                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                </select>
                                                {varForm.attribute_names.filter(n => n).map(attrName => (
                                                    <input key={attrName} type="text" value={v.attributes[attrName] || ''}
                                                        onChange={e => {
                                                            const vars = [...varForm.variants];
                                                            vars[i] = { ...vars[i], attributes: { ...vars[i].attributes, [attrName]: e.target.value } };
                                                            setVarForm({ ...varForm, variants: vars });
                                                        }}
                                                        className="w-20 px-2 py-1.5 border border-gray-200 rounded text-xs focus:ring-2 focus:ring-indigo-500"
                                                        placeholder={attrName} />
                                                ))}
                                                <button onClick={() => removeVariantItem(i)} className="p-1 text-red-400 hover:text-red-600 flex-shrink-0">✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input type="checkbox" id="var-active" checked={varForm.is_active}
                                        onChange={e => setVarForm({ ...varForm, is_active: e.target.checked })}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                    <label htmlFor="var-active" className="text-sm text-gray-700">Activo</label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button onClick={() => setShowVarForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancelar</button>
                                <button onClick={saveVar}
                                    disabled={!varForm.parent_id || !varForm.parent_name || varForm.attribute_names.filter(n => n).length === 0}
                                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {editVar ? 'Guardar Cambios' : 'Crear Grupo'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
