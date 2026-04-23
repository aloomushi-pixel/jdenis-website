import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';

const v2SupabaseUrl = 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const v2SupabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';
const v2Supabase = createClient(v2SupabaseUrl, v2SupabaseKey);

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        
        try {
            const { error } = await v2Supabase
                .from('newsletter_subscribers')
                .insert([{ email: email.toLowerCase().trim(), name: name.trim(), source: 'website' }]);
                
            if (error) {
                if (error.code === '23505') {
                    setStatus('error');
                    setMessage('Este correo ya está suscrito.');
                } else {
                    setStatus('error');
                    setMessage('Ocurrió un error. Intenta nuevamente.');
                }
            } else {
                setStatus('success');
                setMessage('¡Suscripción exitosa! Bienvenido/a.');
                setEmail('');
                setName('');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Error de red. Intenta nuevamente.');
        }
    };

    if (status === 'success') {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center h-full flex flex-col justify-center items-center"
            >
                <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="text-white text-lg font-bold mb-2">¡Gracias por unirte!</h4>
                <p className="text-white/70 text-sm">Pronto recibirás nuestras novedades y descuentos exclusivos.</p>
                <button type="button" onClick={() => setStatus('idle')} className="mt-4 text-green-400 text-sm hover:underline font-medium">Suscribir otro correo</button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative z-20">
            <div>
                <input 
                    type="text" 
                    placeholder="Tu nombre (Opcional)" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4a832]/50 transition-all font-sans"
                />
            </div>
            <div>
                <input 
                    type="email" 
                    required
                    placeholder="ingresa-tu@correo.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#d4a832]/50 transition-all font-sans"
                />
            </div>
            <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full bg-gradient-to-r from-[#d4a832] to-[#eedd99] hover:from-[#e3b844] hover:to-[#fbeeaa] text-[#0a1f5c] font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70"
            >
                {status === 'loading' ? (
                    <span className="w-5 h-5 border-2 border-[#0a1f5c]/30 border-t-[#0a1f5c] rounded-full animate-spin block"></span>
                ) : (
                    <>Suscribirme <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></>
                )}
            </button>
            {status === 'error' && (
                <p className="text-red-400 text-sm text-center font-medium mt-1">{message}</p>
            )}
        </form>
    );
}
