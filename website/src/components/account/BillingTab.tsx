import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { FileText, Save, Info } from 'lucide-react';

interface BillingData {
    rfc: string;
    business_name: string;
    postal_code: string;
    tax_regime: string;
    cfdi_use: string;
    email_facturacion: string;
}

export default function BillingTab({ userId }: { userId: string | undefined }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [data, setData] = useState<BillingData>({
        rfc: '',
        business_name: '',
        postal_code: '',
        tax_regime: '',
        cfdi_use: '',
        email_facturacion: ''
    });

    useEffect(() => {
        if (!userId) return;
        const loadData = async () => {
            const { data: userData, error } = await supabase
                .from('users')
                .select('rfc, business_name, postal_code, tax_regime, cfdi_use, email_facturacion')
                .eq('id', userId)
                .single();
            
            if (userData && !error) {
                setData({
                    rfc: userData.rfc || '',
                    business_name: userData.business_name || '',
                    postal_code: userData.postal_code || '',
                    tax_regime: userData.tax_regime || '',
                    cfdi_use: userData.cfdi_use || '',
                    email_facturacion: userData.email_facturacion || ''
                });
            }
            setLoading(false);
        };
        loadData();
    }, [userId]);

    const handleSave = async () => {
        if (!userId) return;
        setSaving(true);
        setMessage('');

        // Basic validation
        if (data.rfc && data.rfc.length < 12) {
            setMessage('❌ El RFC debe tener al menos 12 caracteres.');
            setSaving(false);
            return;
        }

        const { error } = await supabase
            .from('users')
            .update({
                rfc: data.rfc,
                business_name: data.business_name,
                postal_code: data.postal_code,
                tax_regime: data.tax_regime,
                cfdi_use: data.cfdi_use,
                email_facturacion: data.email_facturacion
            })
            .eq('id', userId);

        if (error) {
            console.error('Error guardando datos fiscales:', error);
            setMessage('❌ Ocurrió un error al guardar tus datos fiscales.');
        } else {
            setMessage('✅ Datos fiscales actualizados correctamente.');
        }
        setSaving(false);
        setTimeout(() => setMessage(''), 3000);
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-luxury text-center">
                <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full mx-auto"></div>
                <p className="text-charcoal-light mt-3 text-sm">Cargando datos fiscales...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-luxury">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold/10 text-gold rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                </div>
                <h2 className="font-sans text-xl text-navy">Datos Fiscales</h2>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start mb-6 text-sm text-blue-800">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                    Mantén actualizados tus datos fiscales. Estos datos se utilizarán automáticamente al solicitar una factura para tus pedidos pagados.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
                <div>
                    <label className="block text-sm font-medium text-navy/80 mb-2">RFC *</label>
                    <input 
                        type="text" 
                        value={data.rfc} 
                        onChange={(e) => setData({ ...data, rfc: e.target.value.toUpperCase() })}
                        placeholder="AAAA000000000"
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all uppercase" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-navy/80 mb-2">Razón Social *</label>
                    <input 
                        type="text" 
                        value={data.business_name} 
                        onChange={(e) => setData({ ...data, business_name: e.target.value })}
                        placeholder="Ej. Mi Empresa S.A. de C.V."
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-navy/80 mb-2">Código Postal Fiscal *</label>
                    <input 
                        type="text" 
                        maxLength={5}
                        value={data.postal_code} 
                        onChange={(e) => setData({ ...data, postal_code: e.target.value.replace(/[^0-9]/g, '') })}
                        placeholder="00000"
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-navy/80 mb-2">Régimen Fiscal *</label>
                    <select 
                        value={data.tax_regime} 
                        onChange={(e) => setData({ ...data, tax_regime: e.target.value })}
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all bg-white" 
                    >
                        <option value="">Selecciona tu Régimen</option>
                        <option value="601">601 - General de Ley Personas Morales</option>
                        <option value="603">603 - Personas Morales con Fines no Lucrativos</option>
                        <option value="605">605 - Sueldos y Salarios e Ingresos Asimilados a Salarios</option>
                        <option value="606">606 - Arrendamiento</option>
                        <option value="608">608 - Demás ingresos</option>
                        <option value="611">611 - Ingresos por Dividendos (socios y accionistas)</option>
                        <option value="612">612 - Personas Físicas con Actividades Empresariales y Profesionales</option>
                        <option value="614">614 - Ingresos por intereses</option>
                        <option value="615">615 - Régimen de los ingresos por obtención de premios</option>
                        <option value="616">616 - Sin obligaciones fiscales</option>
                        <option value="621">621 - Incorporación Fiscal</option>
                        <option value="622">622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras</option>
                        <option value="625">625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas</option>
                        <option value="626">626 - Régimen Simplificado de Confianza (RESICO)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-navy/80 mb-2">Uso de CFDI *</label>
                    <select 
                        value={data.cfdi_use} 
                        onChange={(e) => setData({ ...data, cfdi_use: e.target.value })}
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all bg-white" 
                    >
                        <option value="">Selecciona el Uso</option>
                        <option value="G01">G01 - Adquisición de mercancías</option>
                        <option value="G03">G03 - Gastos en general</option>
                        <option value="I08">I08 - Otra maquinaria y equipo</option>
                        <option value="S01">S01 - Sin efectos fiscales</option>
                        <option value="CP01">CP01 - Pagos</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-navy/80 mb-2">Email para envío de Factura *</label>
                    <input 
                        type="email" 
                        value={data.email_facturacion} 
                        onChange={(e) => setData({ ...data, email_facturacion: e.target.value })}
                        placeholder="tu@email.com"
                        className="w-full px-4 py-3 border border-charcoal/20 rounded-xl focus:ring-2 focus:ring-gold focus:border-gold outline-none transition-all" 
                    />
                </div>
            </div>

            {message && (
                <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 text-sm font-medium ${message.startsWith('✅') ? 'text-emerald-600' : 'text-red-500'}`}
                >
                    {message}
                </motion.p>
            )}

            <div className="mt-8 pt-6 border-t border-charcoal/10 flex justify-end">
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="btn btn-primary flex items-center gap-2 px-8"
                >
                    {saving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <Save className="w-5 h-5" />
                    )}
                    {saving ? 'Guardando...' : 'Guardar Datos Fiscales'}
                </button>
            </div>
        </div>
    );
}
