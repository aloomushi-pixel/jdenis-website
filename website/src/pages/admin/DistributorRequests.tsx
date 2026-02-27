import { useEffect, useState } from 'react';
import { supabase, supabaseUrl, supabaseAnonKey } from '../../lib/supabase';
import { createClient } from '@supabase/supabase-js';

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

    // Estado para el modal de credenciales
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [newCredentials, setNewCredentials] = useState({ email: '', password: '' });
    const [processingId, setProcessingId] = useState<string | null>(null);

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
        setProcessingId(id);
        setError('');

        try {
            const app = applications.find(a => a.id === id);
            if (!app) throw new Error("Solicitud no encontrada");

            if (newStatus === 'approved') {
                // Generar contraseña aleatoria segura
                const tempPassword = `JD-${Math.random().toString(36).slice(-6)}-${Math.floor(Math.random() * 1000)}`;

                // 1. Crear un cliente Supabase aislado (para no pisar la sesión del Admin actual)
                if (!supabaseUrl || !supabaseAnonKey) {
                    throw new Error("Faltan variables de entorno de Supabase.");
                }

                const isolatedClient = createClient(supabaseUrl, supabaseAnonKey, {
                    auth: {
                        persistSession: false,
                        autoRefreshToken: false,
                        detectSessionInUrl: false
                    }
                });

                // 2. Registrar la cuenta en Auth
                const { data: authData, error: authError } = await isolatedClient.auth.signUp({
                    email: app.email,
                    password: tempPassword,
                    options: {
                        data: {
                            full_name: app.full_name,
                            role: 'DISTRIBUIDOR'
                        }
                    }
                });

                if (authError) {
                    if (authError.message.includes('User already registered')) {
                        throw new Error(`El correo ${app.email} ya está registrado en la plataforma. Dile al usuario que ingrese con su cuenta actual.`);
                    }
                    throw authError;
                }

                if (!authData.user) throw new Error("No se pudo crear la cuenta de usuario.");

                // 3. Forzar rol DISTRIBUIDOR e inserción en public.users vía RPC Admin
                // Utilizamos el cliente 'supabase' principal que SÍ tiene la sesión de Admin activa
                const { error: rpcError } = await supabase.rpc('update_user_role_admin', {
                    target_user_id: authData.user.id,
                    new_role: 'DISTRIBUIDOR'
                });

                if (rpcError) {
                    console.error("Error asignando rol con RPC:", rpcError);
                    // Como el RPC requiere que el usuario exista, intentamos inserción manual nativa
                    const { error: insertError } = await supabase.from('users').insert({
                        id: authData.user.id,
                        email: app.email,
                        first_name: app.full_name.split(' ')[0],
                        last_name: app.full_name.split(' ').slice(1).join(' ') || '',
                        role: 'DISTRIBUIDOR'
                    });
                    if (insertError) {
                        console.error("Insercion manual fallida:", insertError);
                        throw new Error("Se creó la cuenta, pero hubo un error al sincronizar el rol de Distribuidor en la base de datos pública. Intente asignarlo manualmente en el Gestor de Usuarios.");
                    }
                }

                // 4. Mostrar modal con credenciales
                setNewCredentials({ email: app.email, password: tempPassword });
                setShowCredentialsModal(true);
            }

            // 5. Actualizar la tabla de solicitudes a aprobado
            const { error: updateError } = await supabase
                .from('distributor_applications')
                .update({ status: newStatus })
                .eq('id', id);

            if (updateError) throw updateError;

            // Actualizar estado local
            setApplications(applications.map(a =>
                a.id === id ? { ...a, status: newStatus } : a
            ));

        } catch (err: any) {
            console.error('Error updating status:', err);
            setError(err.message || 'Error al actualizar el estado de la solicitud');
        } finally {
            setProcessingId(null);
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
                                                    disabled={processingId === app.id}
                                                    className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors disabled:opacity-50"
                                                >
                                                    {processingId === app.id ? 'Aprobando...' : 'Aprobar'}
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(app.id, 'rejected')}
                                                    disabled={processingId === app.id}
                                                    className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors disabled:opacity-50"
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

            {/* Modal de Credenciales */}
            {showCredentialsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 border-b pb-2 mb-4">
                                ¡Distribuidor Aprobado!
                            </h3>
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 text-sm">
                                Se ha generado automáticamente una cuenta de acceso para este distribuidor.
                                Por favor, **copia estas credenciales** y envíaselas por chat o correo electrónico,
                                ya que el sistema no hace envíos automáticos de momento.
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                        Correo Electrónico
                                    </label>
                                    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-gray-800 font-mono text-sm break-all">
                                        {newCredentials.email}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                        Contraseña Temporal
                                    </label>
                                    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-gray-800 font-mono text-sm break-all flex justify-between items-center">
                                        {newCredentials.password}
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(`Acceso Distribuidor J. Denis:\nEmail: ${newCredentials.email}\nContraseña: ${newCredentials.password}\nPortal: https://jdenis.store/login`);
                                                alert("¡Credenciales copiadas al portapapeles!");
                                            }}
                                            className="text-indigo-600 hover:text-indigo-800 text-xs font-medium px-2 py-1 bg-indigo-50 rounded"
                                        >
                                            Copiar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setShowCredentialsModal(false)}
                                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Entendido, cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
