import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader, X, Save } from 'lucide-react';
import {
    getAcademyCourses,
    getAcademyEvents,
    createCourse,
    updateCourse,
    deleteCourse,
    createEvent,
    updateEvent,
    deleteEvent,
    type AcademyCourse,
    type AcademyEvent
} from '../../lib/supabase';

type Tab = 'courses' | 'events';

export default function AcademyManager() {
    const [tab, setTab] = useState<Tab>('courses');
    const [courses, setCourses] = useState<AcademyCourse[]>([]);
    const [events, setEvents] = useState<AcademyEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<AcademyCourse | AcademyEvent | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [coursesData, eventsData] = await Promise.all([
                getAcademyCourses(false),
                getAcademyEvents(false)
            ]);
            setCourses(coursesData);
            setEvents(eventsData);
        } catch (error) {
            console.error('Error loading academy data:', error);
            alert('Error cargando datos de la Academia');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, type: 'course' | 'event') => {
        if (!confirm(`¿Estás seguro de eliminar este ${type === 'course' ? 'curso' : 'evento'}?`)) return;

        try {
            if (type === 'course') {
                await deleteCourse(id);
            } else {
                await deleteEvent(id);
            }
            await loadData();
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
            alert(`Error eliminando ${type === 'course' ? 'curso' : 'evento'}`);
        }
    };

    const openForm = (item: AcademyCourse | AcademyEvent | null = null) => {
        setEditing(item);
        setShowForm(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🎓 Gestión de Academia</h1>
                <button
                    onClick={() => openForm(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    <Plus className="w-4 h-4" /> Nuevo {tab === 'courses' ? 'Curso' : 'Evento'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setTab('courses')}
                    className={`pb-3 px-4 font-medium transition-colors ${tab === 'courses'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Cursos ({courses.length})
                </button>
                <button
                    onClick={() => setTab('events')}
                    className={`pb-3 px-4 font-medium transition-colors ${tab === 'events'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Eventos ({events.length})
                </button>
            </div>

            {/* Content */}
            {tab === 'courses' ? (
                <CoursesTable courses={courses} onEdit={openForm} onDelete={(id) => handleDelete(id, 'course')} />
            ) : (
                <EventsTable events={events} onEdit={openForm} onDelete={(id) => handleDelete(id, 'event')} />
            )}

            {/* Form Modal */}
            {showForm && (
                <FormModal
                    type={tab}
                    initialData={editing}
                    onClose={() => { setShowForm(false); setEditing(null); }}
                    onSuccess={() => { setShowForm(false); setEditing(null); loadData(); }}
                />
            )}
        </div>
    );
}

// Courses Table Component
function CoursesTable({ courses, onEdit, onDelete }: {
    courses: AcademyCourse[];
    onEdit: (course: AcademyCourse) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course) => (
                        <tr key={course.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                <div className="text-sm text-gray-500">{course.duration}</div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${course.badge === 'presencial' ? 'bg-emerald-100 text-emerald-700' :
                                    course.badge === 'online' ? 'bg-blue-100 text-blue-700' :
                                        'bg-purple-100 text-purple-700'
                                    }`}>
                                    {course.badge.toUpperCase()}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                {course.price > 0 ? `$${course.price.toLocaleString()}` : 'GRATIS'}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${course.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {course.active ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium">
                                <button onClick={() => onEdit(course)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => onDelete(course.id)} className="text-red-600 hover:text-red-900">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Events Table Component
function EventsTable({ events, onEdit, onDelete }: {
    events: AcademyEvent[];
    onEdit: (event: AcademyEvent) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                <div className="text-sm text-gray-500">{event.location}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{event.date}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${event.type === 'congreso' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {event.type === 'congreso' ? 'PRESENCIAL' : 'EN VIVO'}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${event.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {event.active ? 'Activo' : 'Inactivo'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium">
                                <button onClick={() => onEdit(event)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => onDelete(event.id)} className="text-red-600 hover:text-red-900">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Form Modal Component
function FormModal({ type, initialData, onClose, onSuccess }: {
    type: Tab;
    initialData: AcademyCourse | AcademyEvent | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const isEdit = !!initialData;
    const isCourse = type === 'courses';

    const [saving, setSaving] = useState(false);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [formData, setFormData] = useState<any>(initialData || {
        title: '',
        duration: '',
        price: 0,
        description: '',
        topics: [],
        badge: 'presencial',
        next_date: '',
        link: '',
        dc3: false,
        video: '',
        video_title: '',
        active: true,
        images: [],
        // Events
        date: '',
        location: '',
        type: 'congreso'
    });

    const addImage = () => {
        if (!newImageUrl.trim()) return;
        setFormData({ ...formData, images: [...(formData.images || []), newImageUrl.trim()] });
        setNewImageUrl('');
    };

    const removeImage = (index: number) => {
        const updated = [...(formData.images || [])];
        updated.splice(index, 1);
        setFormData({ ...formData, images: updated });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (isCourse) {
                if (isEdit) {
                    await updateCourse((initialData as AcademyCourse).id, formData);
                } else {
                    await createCourse(formData);
                }
            } else {
                if (isEdit) {
                    await updateEvent((initialData as AcademyEvent).id, formData);
                } else {
                    await createEvent(formData);
                }
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error guardando los datos');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold">
                        {isEdit ? 'Editar' : 'Nuevo'} {isCourse ? 'Curso' : 'Evento'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {isCourse ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duración *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de badge *</label>
                                <select
                                    required
                                    value={formData.badge}
                                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="presencial">Presencial</option>
                                    <option value="online">Online</option>
                                    <option value="replay">Replay</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Próxima fecha *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.next_date}
                                    onChange={(e) => setFormData({ ...formData, next_date: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link de inscripción *</label>
                                <input
                                    type="url"
                                    required
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.dc3}
                                        onChange={(e) => setFormData({ ...formData, dc3: e.target.checked })}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-gray-700">Incluye constancia DC-3</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.active}
                                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-gray-700">Activo</span>
                                </label>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg"
                                >
                                    <option value="congreso">Congreso</option>
                                    <option value="live">En Vivo</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.active}
                                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700">Activo</span>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                        />
                    </div>

                    {/* ====== SECCIÓN DE IMÁGENES ====== */}
                    <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">📸 Imágenes</label>

                        {/* Galería de imágenes existentes */}
                        {formData.images && formData.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                {formData.images.map((img: string, i: number) => (
                                    <div key={i} className="relative group">
                                        <img
                                            src={img}
                                            alt={`Imagen ${i + 1}`}
                                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f3f4f6" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%239ca3af" font-size="12">Error</text></svg>';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                        >
                                            ✕
                                        </button>
                                        <p className="text-[10px] text-gray-400 mt-1 truncate">{img}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Input para agregar nueva imagen */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="URL de la imagen (ej: /images/academy/foto.jpg)"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } }}
                                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button
                                type="button"
                                onClick={addImage}
                                className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Agregar
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Agrega URLs de imágenes. Pueden ser rutas locales (/images/...) o URLs externas.
                        </p>
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
