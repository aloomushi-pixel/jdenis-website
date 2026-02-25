import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export default function ResetPassword() {
    const navigate = useNavigate();
    const { updatePassword } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [recoveryReady, setRecoveryReady] = useState(false);

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
            setError('No se pudo actualizar la contraseña. Intenta de nuevo o solicita un nuevo enlace.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="font-serif text-3xl text-navy font-bold">
                        J. DENIS
                    </Link>
                    <p className="text-charcoal-light mt-2">
                        Restablecer contraseña
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-luxury">
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-4"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-green-700 font-medium mb-2">
                                ¡Contraseña actualizada exitosamente!
                            </p>
                            <p className="text-sm text-charcoal-light mb-4">
                                Redirigiendo al inicio de sesión...
                            </p>
                            <Link to="/login" className="text-gold font-medium hover:underline">
                                Ir a Iniciar Sesión
                            </Link>
                        </motion.div>
                    ) : !recoveryReady ? (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <p className="text-charcoal font-medium mb-2">
                                Verificando enlace de recuperación...
                            </p>
                            <p className="text-sm text-charcoal-light mb-4">
                                Si no fuiste redirigido desde un correo de recuperación, solicita un nuevo enlace.
                            </p>
                            <Link to="/login" className="text-gold font-medium hover:underline">
                                Solicitar nuevo enlace
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="label">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    minLength={6}
                                    className="input"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="label">Confirmar Nueva Contraseña</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                    minLength={6}
                                    className="input"
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full disabled:opacity-50"
                            >
                                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
