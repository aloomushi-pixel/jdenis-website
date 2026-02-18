import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Plus, Trash2, Loader, ExternalLink } from 'lucide-react';
import { getReels, createReel, deleteReel, type SocialReel } from '../../lib/supabase';

const PLATFORM_OPTIONS = [
    { value: 'youtube', label: 'YouTube Shorts', icon: '▶️' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵' },
    { value: 'instagram', label: 'Instagram Reels', icon: '📸' },
] as const;

export default function ReelsManager() {
    const [reels, setReels] = useState<SocialReel[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [platform, setPlatform] = useState<'youtube' | 'tiktok' | 'instagram'>('instagram');

    async function loadReels() {
        setLoading(true);
        try {
            const data = await getReels(false);
            setReels(data);
        } catch (err) {
            console.error('Error loading reels:', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { loadReels(); }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            await createReel({
                title,
                url,
                platform,
                thumbnail_url: null,
                sort_order: reels.length + 1,
                active: true,
            });
            setTitle('');
            setUrl('');
            setPlatform('instagram');
            setShowForm(false);
            await loadReels();
        } catch (err) {
            console.error('Error creating reel:', err);
            alert('Error al guardar el reel');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Eliminar este reel?')) return;
        try {
            await deleteReel(id);
            await loadReels();
        } catch (err) {
            console.error('Error deleting reel:', err);
        }
    }

    const getPlatformInfo = (p: string) => PLATFORM_OPTIONS.find(o => o.value === p) || PLATFORM_OPTIONS[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">🎬 Gestión de Reels</h1>
                    <p className="text-gray-500 text-sm mt-1">Administra los reels, TikToks e Instagram Reels que aparecen en la homepage</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                    <Plus size={18} />
                    Agregar Reel
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSubmit}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4"
                >
                    <h3 className="text-lg font-semibold text-gray-900">Nuevo Reel</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Ej: Tutorial Lash Lifting"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL del Video</label>
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                placeholder="https://..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label>
                            <select
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value as 'youtube' | 'tiktok' | 'instagram')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            >
                                {PLATFORM_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.icon} {opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
                        >
                            {saving ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                        >
                            Cancelar
                        </button>
                    </div>
                </motion.form>
            )}

            {/* Reels Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader size={32} className="animate-spin text-indigo-600" />
                    </div>
                ) : reels.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-lg">No hay reels aún</p>
                        <p className="text-sm mt-1">Agrega tu primer reel con el botón de arriba</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Orden</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plataforma</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">URL</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {reels.map((reel) => {
                                const pInfo = getPlatformInfo(reel.platform);
                                return (
                                    <tr key={reel.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{reel.sort_order}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{reel.title}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                                {pInfo.icon} {pInfo.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={reel.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                                            >
                                                <ExternalLink size={14} />
                                                Abrir
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(reel.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                                            >
                                                <Trash2 size={14} />
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </motion.div>
    );
}
