import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
    const navigate = useNavigate();
    const { updatePassword } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [recoveryReady, setRecoveryReady] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        // Listen for PASSWORD_RECOVERY event from Supabase
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event) => {
                if (event === 'PASSWORD_RECOVERY') {
                    setRecoveryReady(true);
                }
            }
        );

        // Also check if user already has a valid session (e.g. from hash fragment)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setRecoveryReady(true);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            await updatePassword(formData.password);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            console.error('Password update error:', err);
            setError('No se pudo actualizar la contraseña. El enlace puede haber expirado.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-navy flex items-center justify-center py-12 px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-gold/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[100px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <h1 className="font-serif text-4xl text-gold font-bold tracking-wider">
                            J. DENIS
                        </h1>
                    </Link>
                    <p className="text-cream/70 mt-3 font-light text-lg">
                        Plataforma Exclusiva
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="mb-8 text-center">
                        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20">
                            <Lock className="w-7 h-7 text-gold" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-white mb-2">Restablecer Contraseña</h2>
                        <p className="text-cream/60 text-sm">Crea una nueva contraseña segura para tu cuenta</p>
                    </div>

                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                                <ShieldCheck className="w-10 h-10 text-green-400" />
                            </div>
                            <h3 className="text-xl text-white font-medium mb-3">
                                ¡Contraseña Actualizada!
                            </h3>
                            <p className="text-sm text-cream/70 mb-6">
                                Tu contraseña ha sido cambiada exitosamente. Serás redirigido al inicio de sesión en unos segundos...
                            </p>
                            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3 }}
                                    className="h-full bg-gold"
                                />
                            </div>
                        </motion.div>
                    ) : !recoveryReady ? (
                        <div className="text-center py-6">
                            <div className="animate-spin w-10 h-10 border-2 border-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-white font-medium mb-2">
                                Verificando enlace seguro...
                            </p>
                            <p className="text-xs text-cream/50 mb-6 px-4">
                                Estamos comprobando la validez de tu solicitud. Si esto toma demasiado tiempo, el enlace podría haber expirado.
                            </p>
                            <Link to="/login" className="text-gold text-sm font-medium hover:text-white transition-colors">
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-cream/80 mb-2">Nueva Contraseña</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        minLength={6}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/50 hover:text-gold transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-cream/80 mb-2">Confirmar Contraseña</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        minLength={6}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                                        placeholder="Repite tu nueva contraseña"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/50 hover:text-gold transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gold hover:bg-gold-light text-navy font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(205,168,111,0.3)] hover:shadow-[0_0_30px_rgba(205,168,111,0.5)] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-navy/30 border-t-navy rounded-full animate-spin"></div>
                                ) : (
                                    'Guardar Nueva Contraseña'
                                )}
                            </button>
                        </form>
                    )}
                </div>
                
                <div className="mt-8 text-center text-cream/40 text-sm">
                    <p>&copy; 2026 J. Denis. Todos los derechos reservados.</p>
                </div>
            </motion.div>
        </div>
    );
}
