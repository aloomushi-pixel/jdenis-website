import React, { useEffect, useState } from 'react';
import { supabase, supabaseUrl, supabaseAnonKey } from '../../lib/supabase';
import { createClient } from '@supabase/supabase-js';
import { ChevronDown, ChevronUp, FileText, Image as ImageIcon, MapPin, Building2, User, Briefcase } from 'lucide-react';

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
    
    // New fields
    nationality: string | null;
    establishment_type: string | null;
    manager_name: string | null;
    street: string | null;
    exterior_number: string | null;
    interior_number: string | null;
    between_streets: string | null;
    neighborhood: string | null;
    zip_code: string | null;
    business_phone: string | null;
    whatsapp: string | null;
    address_references: string | null;
    working_hours: string | null;
    municipality: string | null;
    social_media: string | null;
    how_did_you_hear: string[] | null;
    share_data_consent: boolean | null;
    photos_urls: string[] | null;
    id_card_url: string | null;
};

export default function DistributorRequests() {
    const [applications, setApplications] = useState<DistributorApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

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

                const { error: rpcError } = await supabase.rpc('update_user_role_admin', {
                    target_user_id: authData.user.id,
                    new_role: 'DISTRIBUIDOR'
                });

                if (rpcError) {
                    console.error("Error asignando rol con RPC:", rpcError);
                    const { error: insertError } = await supabase.from('users').insert({
                        id: authData.user.id,
                        email: app.email,
                        full_name: app.full_name,
                        role: 'DISTRIBUIDOR'
                    });
                    if (insertError) {
                        console.error("Insercion manual fallida:", insertError);
                        throw new Error("Se creó la cuenta, pero hubo un error al sincronizar el rol de Distribuidor en la base de datos pública. Intente asignarlo manualmente en el Gestor de Usuarios.");
                    }
                }

                setNewCredentials({ email: app.email, password: tempPassword });
                setShowCredentialsModal(true);
            }

            const { error: updateError } = await supabase
                .from('distributor_applications')
                .update({ status: newStatus })
                .eq('id', id);

            if (updateError) throw updateError;

            setApplications(applications.map(a =>
                a.id === id ? { ...a, status: newStatus } : a
            ));

        } catch (err: unknown) {
            console.error('Error updating status:', err);
            setError(err instanceof Error ? err.message : 'Error al actualizar el estado de la solicitud');
        } finally {
            setProcessingId(null);
        }
    }

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

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
                            <th className="w-10"></th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solicitante</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negocio</th>
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
                                <React.Fragment key={app.id}>
                                    <tr className={`hover:bg-gray-50 transition-colors ${expandedId === app.id ? 'bg-indigo-50/30' : ''}`}>
                                        <td className="px-4 py-4 whitespace-nowrap text-center">
                                            <button 
                                                onClick={() => toggleExpand(app.id)}
                                                className="text-gray-400 hover:text-indigo-600 focus:outline-none"
                                            >
                                                {expandedId === app.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 cursor-pointer" onClick={() => toggleExpand(app.id)}>
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 cursor-pointer" onClick={() => toggleExpand(app.id)}>
                                            <div className="text-sm font-medium text-gray-900">{app.full_name}</div>
                                            <div className="text-xs text-gray-500">{app.nationality || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 cursor-pointer" onClick={() => toggleExpand(app.id)}>
                                            <div>{app.email}</div>
                                            <div>{app.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 cursor-pointer" onClick={() => toggleExpand(app.id)}>
                                            <div className="font-medium text-gray-900">{app.business_name || '-'}</div>
                                            <div className="text-xs">{app.city}, {app.state}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {app.status === 'approved' ? 'Aprobada' : app.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {app.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateStatus(app.id, 'approved'); }}
                                                        disabled={processingId === app.id}
                                                        className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors disabled:opacity-50"
                                                    >
                                                        {processingId === app.id ? '...' : 'Aprobar'}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateStatus(app.id, 'rejected'); }}
                                                        disabled={processingId === app.id}
                                                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors disabled:opacity-50"
                                                    >
                                                        Rechazar
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                    
                                    {/* Expanded Details Row */}
                                    {expandedId === app.id && (
                                        <tr>
                                            <td colSpan={7} className="px-8 py-6 bg-gray-50 border-b border-gray-200">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                                    
                                                    {/* Client Info */}
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                                                            <User className="w-4 h-4 text-indigo-500" /> Información del Cliente
                                                        </h4>
                                                        <ul className="text-sm space-y-2 text-gray-600">
                                                            <li><span className="font-medium text-gray-800">Nombre:</span> {app.full_name}</li>
                                                            <li><span className="font-medium text-gray-800">Nacionalidad:</span> {app.nationality || 'No especificada'}</li>
                                                            <li><span className="font-medium text-gray-800">Email:</span> {app.email}</li>
                                                            <li><span className="font-medium text-gray-800">Móvil:</span> {app.phone}</li>
                                                            <li><span className="font-medium text-gray-800">Redes Sociales:</span> {app.social_media || 'Ninguna'}</li>
                                                        </ul>
                                                    </div>

                                                    {/* Business Info */}
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                                                            <Building2 className="w-4 h-4 text-indigo-500" /> Datos del Negocio
                                                        </h4>
                                                        <ul className="text-sm space-y-2 text-gray-600">
                                                            <li><span className="font-medium text-gray-800">Nombre:</span> {app.business_name}</li>
                                                            <li><span className="font-medium text-gray-800">Tipo:</span> {app.establishment_type || 'No especificado'}</li>
                                                            <li><span className="font-medium text-gray-800">Encargado Pedidos:</span> {app.manager_name || 'No especificado'}</li>
                                                            <li><span className="font-medium text-gray-800">Teléfono Local:</span> {app.business_phone || 'No especificado'}</li>
                                                            <li><span className="font-medium text-gray-800">WhatsApp Negocio:</span> {app.whatsapp || 'No especificado'}</li>
                                                            <li><span className="font-medium text-gray-800">Horarios:</span> {app.working_hours || 'No especificado'}</li>
                                                        </ul>
                                                    </div>

                                                    {/* Address Info */}
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                                                            <MapPin className="w-4 h-4 text-indigo-500" /> Dirección Completa
                                                        </h4>
                                                        <ul className="text-sm space-y-2 text-gray-600">
                                                            <li><span className="font-medium text-gray-800">Calle y Núm:</span> {app.street} {app.exterior_number} {app.interior_number ? `Int. ${app.interior_number}` : ''}</li>
                                                            <li><span className="font-medium text-gray-800">Colonia y C.P.:</span> {app.neighborhood}, CP {app.zip_code}</li>
                                                            <li><span className="font-medium text-gray-800">Entre Calles:</span> {app.between_streets || 'No especificado'}</li>
                                                            <li><span className="font-medium text-gray-800">Referencias:</span> {app.address_references || 'No especificado'}</li>
                                                            <li><span className="font-medium text-gray-800">Ciudad/Municipio:</span> {app.city}, {app.municipality}</li>
                                                            <li><span className="font-medium text-gray-800">Estado:</span> {app.state}</li>
                                                        </ul>
                                                    </div>

                                                    {/* Additional Info */}
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                                                            <Briefcase className="w-4 h-4 text-indigo-500" /> Preferencias y Encuesta
                                                        </h4>
                                                        <ul className="text-sm space-y-2 text-gray-600">
                                                            <li><span className="font-medium text-gray-800">Experiencia en Belleza:</span> {app.has_experience ? 'Sí' : 'No'}</li>
                                                            <li><span className="font-medium text-gray-800">Se enteró por:</span> {app.how_did_you_hear?.join(', ') || 'No especificado'}</li>
                                                            <li><span className="font-medium text-gray-800">Intereses:</span> {app.interests?.join(', ') || 'No especificado'}</li>
                                                            <li><span className="font-medium text-gray-800">Acepta compartir info:</span> {app.share_data_consent ? 'Sí' : 'No'}</li>
                                                            <li><span className="font-medium text-gray-800">Observaciones:</span> {app.message || 'Ninguna'}</li>
                                                        </ul>
                                                    </div>

                                                    {/* Documents Validation */}
                                                    <div className="space-y-4 lg:col-span-2">
                                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2 border-b pb-2">
                                                            <FileText className="w-4 h-4 text-indigo-500" /> Archivos y Documentos
                                                        </h4>
                                                        
                                                        <div className="flex flex-col gap-4">
                                                            <div>
                                                                <span className="block text-sm font-medium text-gray-800 mb-2">Identificación Oficial:</span>
                                                                {app.id_card_url ? (
                                                                    <a href={app.id_card_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-indigo-600 hover:bg-gray-50 hover:text-indigo-800">
                                                                        <FileText className="w-4 h-4" /> Ver Documento ID
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-sm text-red-500 bg-red-50 px-2 py-1 rounded">No se adjuntó identificación (Formato anterior)</span>
                                                                )}
                                                            </div>
                                                            
                                                            <div>
                                                                <span className="block text-sm font-medium text-gray-800 mb-2">Fotos del Establecimiento:</span>
                                                                {app.photos_urls && app.photos_urls.length > 0 ? (
                                                                    <div className="flex flex-wrap gap-3">
                                                                        {app.photos_urls.map((photo, i) => (
                                                                            <a key={i} href={photo} target="_blank" rel="noopener noreferrer" className="block relative w-20 h-20 rounded border border-gray-200 overflow-hidden hover:opacity-80 transition-opacity" title={`Ver foto ${i+1}`}>
                                                                                <img src={photo} alt={`Establecimiento ${i+1}`} className="object-cover w-full h-full" />
                                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20">
                                                                                    <ImageIcon className="w-4 h-4 text-white opacity-0 hover:opacity-100" />
                                                                                </div>
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-sm text-red-500 bg-red-50 px-2 py-1 rounded">No se adjuntaron fotos (Formato anterior)</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
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
                                Por favor, **copia estas credenciales** y envíaselas por chat o correo electrónico.
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
