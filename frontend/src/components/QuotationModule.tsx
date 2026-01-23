import { useState, useEffect } from 'react';
import api from '../services/api';

interface QuotationItem {
    resourceId: string;
    quantity: number;
    unitPrice: number;
}

interface Customer {
    id: string;
    name: string;
}

export default function QuotationModule() {
    const [quotations, setQuotations] = useState<any[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        customerId: '',
        items: [{ resourceId: '', quantity: 0, unitPrice: 0 }] as QuotationItem[],
        validUntil: '',
        notes: '',
    });

    useEffect(() => {
        fetchQuotations();
        fetchCustomers();
    }, []);

    const fetchQuotations = async () => {
        try {
            const response = await api.get('/quotations');
            setQuotations(response.data);
        } catch (error) {
            console.error('Error fetching quotations:', error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/sales/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/quotations', formData);
            setShowForm(false);
            setFormData({
                customerId: '',
                items: [{ resourceId: '', quantity: 0, unitPrice: 0 }],
                validUntil: '',
                notes: '',
            });
            fetchQuotations();
        } catch (error) {
            console.error('Error creating quotation:', error);
        }
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { resourceId: '', quantity: 0, unitPrice: 0 }],
        });
    };

    const removeItem = (index: number) => {
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index),
        });
    };

    const updateItem = (index: number, field: keyof QuotationItem, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });
    };

    const convertToOrder = async (quotationId: string) => {
        if (!confirm('¿Convertir esta cotización en pedido?')) return;
        try {
            const deliveryDate = prompt('Fecha de entrega (YYYY-MM-DD):');
            await api.put(`/quotations/${quotationId}/convert`, { deliveryDate });
            alert('Cotización convertida a pedido exitosamente');
            fetchQuotations();
        } catch (error) {
            console.error('Error converting quotation:', error);
            alert('Error al convertir cotización');
        }
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            DRAFT: 'bg-gray-100 text-gray-800',
            SENT: 'bg-blue-100 text-blue-800',
            ACCEPTED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800',
            CONVERTED: 'bg-purple-100 text-purple-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Cotizaciones</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nueva Cotización</span>
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Nueva Cotización</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                                <select
                                    value={formData.customerId}
                                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Seleccionar cliente</option>
                                    {customers.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Válida Hasta</label>
                                <input
                                    type="date"
                                    value={formData.validUntil}
                                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">Items</label>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    + Agregar Item
                                </button>
                            </div>
                            <div className="space-y-2">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            placeholder="ID Recurso"
                                            value={item.resourceId}
                                            onChange={(e) => updateItem(index, 'resourceId', e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Cantidad"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                            className="w-32 px-4 py-2 border border-gray-300 rounded-lg"
                                            required
                                            min="0"
                                            step="0.01"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Precio"
                                            value={item.unitPrice}
                                            onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value))}
                                            className="w-32 px-4 py-2 border border-gray-300 rounded-lg"
                                            required
                                            min="0"
                                            step="0.01"
                                        />
                                        {formData.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Crear Cotización
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {quotations.map((quotation) => (
                            <tr key={quotation.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-mono font-bold text-gray-900">
                                    {quotation.quotationNumber}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{quotation.customer.name}</td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                    ${quotation.totalAmount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quotation.status)}`}>
                                        {quotation.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(quotation.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {quotation.status !== 'CONVERTED' && (
                                        <button
                                            onClick={() => convertToOrder(quotation.id)}
                                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                                        >
                                            Convertir a Pedido
                                        </button>
                                    )}
                                    {quotation.status === 'CONVERTED' && (
                                        <span className="text-gray-400">Convertido</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
