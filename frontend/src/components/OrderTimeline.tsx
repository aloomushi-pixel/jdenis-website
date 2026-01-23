import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

interface TimelineEntry {
    status: string;
    timestamp: string;
    user: string;
    userId: string;
    notes: string;
}

interface TimelineData {
    orderNumber: string;
    timeline: TimelineEntry[];
}

const STATUS_ICONS: Record<string, string> = {
    COTIZADO: '📋',
    PENDIENTE: '⏳',
    EN_PRODUCCION: '🏭',
    EN_EMBALAJE: '📦',
    EN_TRANSITO: '🚚',
    ENTREGADO: '✅',
    CANCELADO: '❌',
};

const STATUS_COLORS: Record<string, string> = {
    COTIZADO: 'bg-blue-100 border-blue-300 text-blue-800',
    PENDIENTE: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    EN_PRODUCCION: 'bg-purple-100 border-purple-300 text-purple-800',
    EN_EMBALAJE: 'bg-orange-100 border-orange-300 text-orange-800',
    EN_TRANSITO: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    ENTREGADO: 'bg-green-100 border-green-300 text-green-800',
    CANCELADO: 'bg-red-100 border-red-300 text-red-800',
};

export default function OrderTimeline() {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<TimelineData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchTimeline();
        }
    }, [id]);

    const fetchTimeline = async () => {
        try {
            const response = await api.get(`/orders/${id}/timeline`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching timeline:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Cargando timeline...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center p-8 text-gray-500">
                No se encontró el pedido
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Timeline del Pedido</h1>
                <p className="text-gray-600">Pedido: <span className="font-mono font-bold text-indigo-600">{data.orderNumber}</span></p>
                <p className="text-sm text-gray-500 mt-2">
                    Sistema de tracking blockchain - Histórico inmutable
                </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Historial de Estados</h2>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

                    {/* Timeline Entries */}
                    <div className="space-y-8">
                        {data.timeline.map((entry, index) => (
                            <div key={index} className="relative pl-16">
                                {/* Icon Circle */}
                                <div className={`absolute left-0 w-12 h-12 rounded-full border-4 ${STATUS_COLORS[entry.status]} flex items-center justify-center text-2xl bg-white`}>
                                    {STATUS_ICONS[entry.status]}
                                </div>

                                {/* Content Card */}
                                <div className={`border-2 ${STATUS_COLORS[entry.status]} rounded-lg p-4`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {entry.status.replace(/_/g, ' ')}
                                        </h3>
                                        <span className="text-xs text-gray-500 font-mono">
                                            {new Date(entry.timestamp).toLocaleString()}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-sm font-medium text-gray-700">{entry.user}</span>
                                        </div>

                                        {entry.notes && (
                                            <div className="mt-2 bg-white bg-opacity-50 rounded p-2">
                                                <p className="text-sm text-gray-700 italic">"{entry.notes}"</p>
                                            </div>
                                        )}

                                        {/* Blockchain Hash visual */}
                                        <div className="mt-3 flex items-center space-x-2 text-xs text-gray-400">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            <span className="font-mono">
                                                Block #{index + 1} | Hash: {entry.userId.substring(0, 12)}...
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Connector Line to Next */}
                                {index < data.timeline.length - 1 && (
                                    <div className="absolute left-6 top-14 w-0.5 h-8 bg-gray-200" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Blockchain Info */}
                <div className="mt-8 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-indigo-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                            <h4 className="font-bold text-indigo-900 mb-1">Sistema Blockchain</h4>
                            <p className="text-sm text-indigo-700">
                                Este pedido cuenta con {data.timeline.length} registro(s) inmutables en blockchain.
                                Cada cambio de estado queda registrado permanentemente con su timestamp, usuario y notas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
