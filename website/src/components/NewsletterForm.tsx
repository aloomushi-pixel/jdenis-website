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
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-green-500/10 border border-green-500/20 rounded-lg px-6 py-3 flex items-center justify-between w-full"
            >
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span className="text-white text-sm font-medium">¡Suscripción exitosa! Bienvenido/a.</span>
                </div>
                <button type="button" onClick={() => setStatus('idle')} className="text-green-400 text-xs hover:underline">Nueva suscripción</button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col lg:grid lg:grid-cols-3 gap-3 relative z-20 w-full">
            <div>
                <input 
                    type="text" 
                    placeholder="Tu nombre (Opcional)" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#d4a832]/50 transition-all font-sans"
                />
            </div>
            <div>
                <input 
                    type="email" 
                    required
                    placeholder="Tu correo electrónico" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-[#d4a832]/50 transition-all font-sans"
                />
            </div>
            <div className="relative">
                <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-r from-[#d4a832] to-[#eedd99] hover:from-[#e3b844] hover:to-[#fbeeaa] text-[#0a1f5c] font-bold py-2.5 px-6 rounded-lg text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 h-full"
                >
                    {status === 'loading' ? (
                        <span className="w-4 h-4 border-2 border-[#0a1f5c]/30 border-t-[#0a1f5c] rounded-full animate-spin block"></span>
                    ) : (
                        <>Suscribirme</>
                    )}
                </button>
                {status === 'error' && (
                    <p className="text-red-400 text-xs font-medium absolute -bottom-5 left-0">{message}</p>
                )}
            </div>
        </form>
    );
}
