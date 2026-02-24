import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type DistributorApplication = {
    id: string;
    created_at: string;
    full_name: string;
    email: string;
    phone: string;
    business_name: string | null;
    city: string;
    state: string;
    has_experience: boolean;
    interests: string[];
    message: string | null;
    status: 'pending' | 'approved' | 'rejected';
};

export default function DistributorRequests() {
    const [applications, setApplications] = useState<DistributorApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    async function fetchApplications() {
        try {
            const { data, error } = await supabase
                .from('distributor_applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setApplications(data || []);
        } catch (err) {
            console.error('Error fetching applications:', err);
            setError('Error al cargar las solicitudes');
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: string, newStatus: 'approved' | 'rejected') {
        try {
            const { error } = await supabase
                .from('distributor_applications')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            // Actualizar estado local
            setApplications(applications.map(app =>
                app.id === id ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Error al actualizar el estado de la solicitud');
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Solicitudes de Distribuidores</h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación / Negocio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intereses</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {applications.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    No hay solicitudes recientes
                                </td>
                            </tr>
                        ) : (
                            applications.map((app) => (
                                <tr key={app.id} className="hover:bg-gray-50 hover:bg-opacity-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(app.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{app.full_name}</div>
                                        {app.has_experience && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                                Con experiencia
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div>{app.email}</div>
                                        <div>{app.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div>{app.city}, {app.state}</div>
                                        <div className="text-gray-900 font-medium">{app.business_name || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div className="flex flex-wrap gap-1">
                                            {app.interests.map(interest => (
                                                <span key={interest} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                        {app.message && (
                                            <div className="mt-2 text-xs text-gray-400 truncate max-w-[200px]" title={app.message}>
                                                "{app.message}"
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {app.status === 'approved' ? 'Aprobada' :
                                                app.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {app.status === 'pending' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => updateStatus(app.id, 'approved')}
                                                    className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors"
                                                >
                                                    Aprobar
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(app.id, 'rejected')}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                                                >
                                                    Rechazar
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
