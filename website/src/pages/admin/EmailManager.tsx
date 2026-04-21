import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dispatchEmailCampaign, getProductLaunchTemplate, getCustomerSupportTemplate, fetchCampaignHistory, type EmailCampaign } from '../../lib/email';
import { getUsers, type ERPUser } from '../../lib/erp';

export default function EmailManager() {
    const [activeTab, setActiveTab] = useState<'newsletter' | 'contact' | 'history'>('newsletter');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Newsletter State
    const [nlSubject, setNlSubject] = useState('¡Nuevo Lanzamiento en J. Denis!');
    const [nlTitle, setNlTitle] = useState('Kit Lifting Plus');
    const [nlHeadline, setNlHeadline] = useState('Eleva tus cejas y pestañas de manera profesional.');
    const [nlBody, setNlBody] = useState('Descubre nuestro nuevo sistema con tecnología avanzada para proteger el vello mientras consigues resultados espectaculares que duran hasta 8 semanas.');
    const [nlImageUrl, setNlImageUrl] = useState('https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80&w=800');
    const [nlButtonText, setNlButtonText] = useState('Comprar Ahora');
    const [nlButtonUrl, setNlButtonUrl] = useState('https://jdenis.com/shop');

    // Contact State
    const [customerUsers, setCustomerUsers] = useState<ERPUser[]>([]);
    const [contactTarget, setContactTarget] = useState('');
    const [contactSubject, setContactSubject] = useState('Respuesta de Soporte J. Denis');
    const [contactName, setContactName] = useState('Cliente');
    const [contactBody, setContactBody] = useState('Gracias por comunicarte con nosotros. Estamos revisando tu caso y tu pedido se encuentra actualmente en ruta.');

    // History State
    const [history, setHistory] = useState<EmailCampaign[]>([]);

    useEffect(() => {
        if (activeTab === 'contact' && customerUsers.length === 0) {
            getUsers('CLIENTE').then(setCustomerUsers).catch(console.error);
        } else if (activeTab === 'history') {
            fetchCampaignHistory().then(setHistory).catch(console.error);
        }
    }, [activeTab]);

    const handleSendNewsletter = async () => {
        if (!confirm('¿Estás seguro de enviar esta campaña a TODOS los suscriptores (miles de correos)?')) return;
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            const html = getProductLaunchTemplate(nlTitle, nlHeadline, nlBody, nlImageUrl, nlButtonText, nlButtonUrl);
            const res = await dispatchEmailCampaign(nlSubject, html, 'all_subscribers');
            setSuccessMessage(res.message || 'Campaña despachada masivamente de forma exitosa.');
        } catch (err: any) {
            setErrorMessage(err.message || 'Error enviando el newsletter.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendContact = async () => {
        if (!contactTarget) return setErrorMessage('Selecciona o ingresa un correo destinatario.');
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            const html = getCustomerSupportTemplate(contactName, contactBody);
            const res = await dispatchEmailCampaign(contactSubject, html, 'single_customer', contactTarget);
            setSuccessMessage(res.message || 'Correo 1-a-1 enviado exitosamente.');
        } catch (err: any) {
            setErrorMessage(err.message || 'Error enviando el correo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    Marketing & Correos
                </h1>
                <p className="text-gray-500 text-sm mt-1">Conecta con tus clientes a través de plantillas premium (Preparado para Resend API).</p>
            </div>

            {/* Notificaciones */}
            {successMessage && (
                <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    {errorMessage}
                </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-1 border-b border-gray-200 mb-6">
                {([
                    { id: 'newsletter', label: 'Campaña Masiva' },
                    { id: 'contact', label: 'Contacto 1-a-1' },
                    { id: 'history', label: 'Historial de Envíos' },
                ] as const).map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Panel de Edición */}
                <div className="space-y-6">
                    {activeTab === 'newsletter' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Configurar Newsletter</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Asunto del Correo</label>
                                    <input type="text" value={nlSubject} onChange={e => setNlSubject(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Título de Cabecera</label>
                                        <input type="text" value={nlTitle} onChange={e => setNlTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Encabezado H2</label>
                                        <input type="text" value={nlHeadline} onChange={e => setNlHeadline(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL de Imagen Principal</label>
                                    <input type="text" value={nlImageUrl} onChange={e => setNlImageUrl(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm" placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cuerpo del Correo</label>
                                    <textarea value={nlBody} onChange={e => setNlBody(e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm resize-none"></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Texto del Botón</label>
                                        <input type="text" value={nlButtonText} onChange={e => setNlButtonText(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Enlace del Botón</label>
                                        <input type="text" value={nlButtonUrl} onChange={e => setNlButtonUrl(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm" placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <button
                                        onClick={handleSendNewsletter}
                                        disabled={loading}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>}
                                        Enviar a todos los suscriptores
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'contact' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Resolución / Contacto Individual</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Destinatario (Email)</label>
                                    <input
                                        type="email"
                                        list="customersList"
                                        value={contactTarget}
                                        onChange={e => setContactTarget(e.target.value)}
                                        placeholder="correo@cliente.com"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm"
                                    />
                                    <datalist id="customersList">
                                        {customerUsers.map(u => <option key={u.id} value={u.email}>{u.fullName}</option>)}
                                    </datalist>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Cliente (Para saludar)</label>
                                        <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                                        <input type="text" value={contactSubject} onChange={e => setContactSubject(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje de Respuesta / Seguimiento</label>
                                    <textarea value={contactBody} onChange={e => setContactBody(e.target.value)} rows={6} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all text-sm resize-none"></textarea>
                                </div>
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <button
                                        onClick={handleSendContact}
                                        disabled={loading}
                                        className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>}
                                        Enviar a Cliente
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'history' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Asunto</th>
                                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Destino</th>
                                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Estado</th>
                                        <th className="text-left px-6 py-3 font-semibold text-gray-600">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {history.map(c => (
                                        <tr key={c.id}>
                                            <td className="px-6 py-4 font-medium text-gray-800">{c.subject}</td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {c.recipient_type === 'all_subscribers' ? (
                                                    <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM9 10.5a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg> Broadccast</span>
                                                ) : (
                                                    <span className="text-teal-600 break-all">{c.target_email || 'Cliente Oculto'}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status.includes('simulated') ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{new Date(c.created_at).toLocaleString('es-MX')}</td>
                                        </tr>
                                    ))}
                                    {history.length === 0 && (
                                        <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No se encontraron historiales.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </div>

                {/* Panel de Preview */}
                {(activeTab === 'newsletter' || activeTab === 'contact') && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block relative">
                        <div className="sticky top-6">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                Previsualización del HTML
                            </h2>
                            <div className="bg-gray-200 rounded-3xl p-3 shadow-inner border border-gray-300 relative overflow-hidden" style={{ minHeight: '600px' }}>
                                {/* Mockup Header */}
                                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-300 flex items-center px-4 gap-1 z-10 rounded-t-2xl">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                                </div>
                                {/* Iframe Sandbox Container */}
                                <div className="bg-white w-full h-[calc(100%-24px)] rounded-xl mt-6 overflow-y-auto overflow-x-hidden p-0 shadow-lg">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: activeTab === 'newsletter'
                                                ? getProductLaunchTemplate(nlTitle, nlHeadline, nlBody, nlImageUrl, nlButtonText, nlButtonUrl)
                                                : getCustomerSupportTemplate(contactName, contactBody)
                                        }}
                                        className="w-full transform origin-top"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
