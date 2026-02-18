import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Product } from '../../lib/supabase';
import { supabase, updateProductStock } from '../../lib/supabase';

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingStock, setEditingStock] = useState<string | null>(null);
    const [stockValue, setStockValue] = useState<number>(0);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Fetch ALL products (including inactive) for admin
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStockSave = async (productId: string) => {
        setSaving(true);
        try {
            await updateProductStock(productId, stockValue);
            await fetchProducts();
            setEditingStock(null);
        } catch (error) {
            console.error('Error updating stock:', error);
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async (product: Product) => {
        try {
            const { error } = await supabase
                .from('products')
                .update({ is_active: !product.is_active })
                .eq('id', product.id);

            if (error) throw error;
            await fetchProducts();
        } catch (error) {
            console.error('Error toggling product:', error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                    />
                    <span className="text-sm text-gray-500">{filteredProducts.length} productos</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product, index) => (
                                <motion.tr
                                    key={product.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {product.image_url && (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="w-10 h-10 rounded-lg object-cover"
                                                />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                                                <p className="text-xs text-gray-400">{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.sku || '—'}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                        ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {editingStock === product.id ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <input
                                                    type="number"
                                                    value={stockValue}
                                                    onChange={(e) => setStockValue(Number(e.target.value))}
                                                    className="w-20 px-2 py-1 border border-indigo-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    min={0}
                                                />
                                                <button
                                                    onClick={() => handleStockSave(product.id)}
                                                    disabled={saving}
                                                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => setEditingStock(null)}
                                                    className="text-red-500 hover:text-red-700 text-sm"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditingStock(product.id);
                                                    setStockValue(product.stock || 0);
                                                }}
                                                className={`font-medium text-sm px-3 py-1 rounded ${(product.stock || 0) < 10
                                                    ? 'bg-red-50 text-red-600'
                                                    : 'bg-green-50 text-green-600'
                                                    } hover:opacity-80 transition-opacity`}
                                            >
                                                {product.stock ?? 0}
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.is_active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {product.is_active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => toggleActive(product)}
                                            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            {product.is_active ? 'Desactivar' : 'Activar'}
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
