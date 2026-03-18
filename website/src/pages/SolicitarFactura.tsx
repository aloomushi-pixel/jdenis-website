import React, { useState } from 'react';
import { Building2, FileText, MapPin, Mail, Hash, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SolicitarFactura() {
  const [formData, setFormData] = useState({
    businessName: '',
    rfc: '',
    postalCode: '',
    taxRegime: '',
    cfdiUse: '',
    email: '',
    ticketNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('invoice_requests')
        .insert([
          {
            business_name: formData.businessName,
            rfc: formData.rfc,
            postal_code: formData.postalCode,
            tax_regime: formData.taxRegime,
            cfdi_use: formData.cfdiUse,
            email: formData.email,
            ticket_number: formData.ticketNumber,
            status: 'Pendiente'
          }
        ]);

      if (insertError) {
        throw new Error(insertError.message || 'Error al enviar la solicitud');
      }

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">¡Solicitud Enviada!</h2>
          <p className="text-gray-600">
            Hemos recibido tus datos correctamente. Estaremos enviando tu factura al correo proporcionado a la brevedad posible.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setFormData({
                businessName: '',
                rfc: '',
                postalCode: '',
                taxRegime: '',
                cfdiUse: '',
                email: '',
                ticketNumber: '',
              });
            }}
            className="mt-6 w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Solicitar otra factura
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          <div className="bg-black px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 10px 10px" }}></div>
            <h1 className="relative z-10 text-3xl font-bold text-white tracking-tight">Portal de Autofacturación</h1>
            <p className="relative z-10 mt-2 text-gray-300">Completa tus datos fiscales para recibir tu comprobante</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-10 space-y-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block">Número de Ticket o Pedido</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="ticketNumber"
                    required
                    value={formData.ticketNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-shadow sm:text-sm bg-gray-50 focus:bg-white"
                    placeholder="Ej. TCK-987654"
                  />
                </div>
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block">Razón Social o Nombre</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="businessName"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-shadow sm:text-sm bg-gray-50 focus:bg-white"
                    placeholder="Empresa S.A. de C.V."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">RFC</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="rfc"
                    required
                    value={formData.rfc}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-shadow sm:text-sm bg-gray-50 focus:bg-white uppercase"
                    placeholder="XAXX010101000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Código Postal</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    maxLength={5}
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-shadow sm:text-sm bg-gray-50 focus:bg-white"
                    placeholder="12345"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Régimen Fiscal</label>
                <select
                  name="taxRegime"
                  required
                  value={formData.taxRegime}
                  onChange={handleChange}
                  className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-shadow sm:text-sm bg-gray-50 focus:bg-white"
                >
                  <option value="">Selecciona un régimen...</option>
                  <option value="601">601 - General de Ley Personas Morales</option>
                  <option value="612">612 - Personas Físicas con Actividades Empresariales y Profesionales</option>
                  <option value="626">626 - Régimen Simplificado de Confianza</option>
                  <option value="616">616 - Sin obligaciones fiscales</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Uso de CFDI</label>
                <select
                  name="cfdiUse"
                  required
                  value={formData.cfdiUse}
                  onChange={handleChange}
                  className="block w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-shadow sm:text-sm bg-gray-50 focus:bg-white"
                >
                  <option value="">Selecciona un uso...</option>
                  <option value="G01">G01 - Adquisición de mercancias</option>
                  <option value="G03">G03 - Gastos en general</option>
                  <option value="P01">P01 - Por definir</option>
                  <option value="S01">S01 - Sin efectos fiscales</option>
                </select>
              </div>

              <div className="space-y-2 col-span-1 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block">Correo Electrónico (Para envío)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-shadow sm:text-sm bg-gray-50 focus:bg-white"
                    placeholder="contacto@empresa.com"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Procesando...' : 'Solicitar Factura'}
              </button>
            </div>
          </form>
        </div>
        <p className="text-center text-sm text-gray-500 mt-6 font-medium">
          Tus datos están seguros y se utilizan exclusivamente para propósitos fiscales.
        </p>
      </div>
    </div>
  );
}
