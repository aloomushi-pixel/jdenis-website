import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader, X, Save, Eye, EyeOff, Newspaper } from 'lucide-react';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, getNewsPosts, createNewsPost, updateNewsPost, deleteNewsPost, type BlogPost } from '../../lib/supabase';

type TabType = 'blog' | 'noticias';

export default function BlogManager() {
    const [activeTab, setActiveTab] = useState<TabType>('blog');
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [newsPosts, setNewsPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<BlogPost | null>(null);

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        try {
            setLoading(true);
            const [blogData, newsData] = await Promise.all([
                getBlogPosts(false),
                getNewsPosts(false),
            ]);
            setPosts(blogData);
            setNewsPosts(newsData);
        } catch (error) {
            console.error('Error loading posts:', error);
            alert('Error cargando posts');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBlog = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este post? Esta acción no se puede deshacer.')) return;
        try {
            await deleteBlogPost(id);
            await loadAll();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Error eliminando post');
        }
    };

    const handleDeleteNews = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta noticia? Esta acción no se puede deshacer.')) return;
        try {
            await deleteNewsPost(id);
            await loadAll();
        } catch (error) {
            console.error('Error deleting news:', error);
            alert('Error eliminando noticia');
        }
    };

    const openForm = (post: BlogPost | null = null) => {
        setEditing(post);
        setShowForm(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    const currentItems = activeTab === 'blog' ? posts : newsPosts;
    const handleDelete = activeTab === 'blog' ? handleDeleteBlog : handleDeleteNews;

    return (
        <div>
            {/* Tab Bar */}
            <div className="flex items-center gap-6 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('blog')}
                    className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'blog'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Edit2 className="w-4 h-4" />
                    📝 Blog
                </button>
                <button
                    onClick={() => setActiveTab('noticias')}
                    className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'noticias'
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Newspaper className="w-4 h-4" />
                    📰 Noticias
                </button>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {activeTab === 'blog' ? '📝 Gestión de Blog' : '📰 Gestión de Noticias'}
                </h1>
                <button
                    onClick={() => openForm(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Plus className="w-4 h-4" />
                    {activeTab === 'blog' ? 'Nuevo Post' : 'Nueva Noticia'}
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                            {activeTab === 'noticias' && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Etiqueta</th>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {activeTab === 'blog' ? 'Autor' : 'Imagen'}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-md">
                                        {activeTab === 'blog' ? post.subtitle : post.excerpt}
                                    </div>
                                </td>
                                {activeTab === 'noticias' && (
                                    <td className="px-6 py-4">
                                        {post.tag && (
                                            <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-700 font-medium">
                                                {post.tag}
                                            </span>
                                        )}
                                    </td>
                                )}
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {activeTab === 'blog' ? post.author : (
                                        post.featured_image ? (
                                            <img src={post.featured_image} alt="" className="w-12 h-12 object-cover rounded" />
                                        ) : <span className="text-gray-400">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {post.published ? 'Publicado' : 'Borrador'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    <button onClick={() => openForm(post)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {currentItems.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        {activeTab === 'blog'
                            ? 'No hay posts aún. ¡Crea el primero!'
                            : 'No hay noticias aún. ¡Crea la primera!'}
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {showForm && (
                <PostFormModal
                    initialData={editing}
                    postType={activeTab === 'blog' ? 'article' : 'news'}
                    onClose={() => { setShowForm(false); setEditing(null); }}
                    onSuccess={() => { setShowForm(false); setEditing(null); loadAll(); }}
                />
            )}
        </div>
    );
}

// Post Form Modal Component — works for both blog and news
function PostFormModal({ initialData, postType, onClose, onSuccess }: {
    initialData: BlogPost | null;
    postType: 'article' | 'news';
    onClose: () => void;
    onSuccess: () => void;
}) {
    const isEdit = !!initialData;
    const isNews = postType === 'news';
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [formData, setFormData] = useState({
        slug: initialData?.slug || '',
        title: initialData?.title || '',
        subtitle: initialData?.subtitle || '',
        author: initialData?.author || 'J. Denis',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        featured_image: initialData?.featured_image || '',
        categories: initialData?.categories || [],
        tags: initialData?.tags || [],
        tag: initialData?.tag || '',
        published: initialData?.published || false,
        published_at: initialData?.published_at || null,
    });

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
    };

    const handleTitleChange = (newTitle: string) => {
        setFormData(prev => ({
            ...prev,
            title: newTitle,
            slug: isEdit ? prev.slug : generateSlug(newTitle)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const postData = {
                ...formData,
                published_at: formData.published ? (formData.published_at || new Date().toISOString()) : null
            };

            if (isEdit) {
                if (isNews) {
                    await updateNewsPost(initialData!.id, postData);
                } else {
                    await updateBlogPost(initialData!.id, postData);
                }
            } else {
                if (isNews) {
                    await createNewsPost(postData as any);
                } else {
                    await createBlogPost(postData as any);
                }
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Error guardando el post');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold">
                        {isEdit ? 'Editar' : 'Nueva'} {isNews ? 'Noticia' : 'Post'}
                    </h2>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setShowPreview(!showPreview)}
                            className="flex items-center gap-2 px-3 py-1 border rounded-lg hover:bg-gray-50"
                        >
                            {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showPreview ? 'Editor' : 'Preview'}
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* News-specific: Tag + Image */}
                    {isNews ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta (tag)</label>
                                <input
                                    type="text"
                                    value={formData.tag || ''}
                                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Ej: Nuevo Producto, Nuevo Lanzamiento"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen destacada (URL)</label>
                                <input
                                    type="text"
                                    value={formData.featured_image || ''}
                                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                                <input
                                    type="text"
                                    value={formData.subtitle || ''}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Autor *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Imagen destacada (URL)</label>
                                    <input
                                        type="text"
                                        value={formData.featured_image || ''}
                                        onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Image preview */}
                    {formData.featured_image && (
                        <div className="border rounded-lg p-2 bg-gray-50">
                            <img src={formData.featured_image} alt="Preview" className="max-h-40 object-contain mx-auto rounded" />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Resumen (excerpt)</label>
                        <textarea
                            rows={2}
                            value={formData.excerpt || ''}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder={isNews ? 'Breve descripción de la novedad' : 'Breve descripción para el listado de posts'}
                        />
                    </div>

                    {!showPreview ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contenido (Markdown) *</label>
                            <textarea
                                required
                                rows={15}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                                placeholder="# Tu contenido en Markdown aquí..."
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                            <div className="border rounded-lg p-4 prose prose-sm max-w-none bg-gray-50">
                                <pre className="whitespace-pre-wrap text-sm">{formData.content}</pre>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.published}
                                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                className="rounded"
                            />
                            <span className="text-sm text-gray-700 font-medium">
                                Publicar ahora
                            </span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Guardar
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
