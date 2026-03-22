import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

type FormMode = 'login' | 'register' | 'forgot';

export default function Login() {
    const navigate = useNavigate();
    const { login, register, resetPassword, loginWithOAuth } = useAuthStore();
    const [oauthLoading, setOauthLoading] = useState(false);
    const [mode, setMode] = useState<FormMode>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        confirmPassword: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccessMsg('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (mode === 'forgot') {
                await resetPassword(formData.email);
                setSuccessMsg('¡Listo! Revisa tu bandeja de entrada (y spam) para restablecer tu contraseña.');
            } else if (mode === 'register') {
                if (formData.password !== formData.confirmPassword) {
                    setError('Las contraseñas no coinciden');
                    setLoading(false);
                    return;
                }
                await register(formData.email, formData.password, formData.fullName);
                navigate('/mi-cuenta');
            } else {
                await login(formData.email, formData.password);
                navigate('/mi-cuenta');
            }
        } catch (err) {
            console.error(err);
            if (mode === 'forgot') {
                setError('No se pudo enviar el correo. Verifica tu email e intenta de nuevo.');
            } else {
                setError('Error de autenticación. Verifica tus credenciales.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setOauthLoading(true);
        setError('');
        try {
            await loginWithOAuth('google');
            // Supabase redirects to jdenis.store/mi-cuenta automatically
        } catch {
            setError('No se pudo iniciar sesión con Google. Intenta de nuevo.');
            setOauthLoading(false);
        }
    };

    const subtitle = {
        login: 'Accede a tu cuenta',
        register: 'Crea tu cuenta profesional',
        forgot: 'Recupera tu contraseña',
    };

    const buttonLabel = {
        login: 'Iniciar Sesión',
        register: 'Crear Cuenta',
        forgot: 'Enviar enlace de recuperación',
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
                        {subtitle[mode]}
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-luxury">
                    {successMsg ? (
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
                            <p className="text-green-700 font-medium mb-4">{successMsg}</p>
                            <button
                                onClick={() => { setMode('login'); setSuccessMsg(''); }}
                                className="text-gold font-medium hover:underline"
                            >
                                Volver a Iniciar Sesión
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {mode === 'register' && (
                                <div>
                                    <label className="label">Nombre Completo</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                        className="input"
                                        placeholder="María González"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="input"
                                    placeholder="tu@email.com"
                                />
                            </div>

                            {mode !== 'forgot' && (
                                <div>
                                    <label className="label">Contraseña</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        className="input"
                                        placeholder="••••••••"
                                    />
                                    {mode === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => setMode('forgot')}
                                            className="text-xs text-gold hover:underline mt-1 float-right"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </button>
                                    )}
                                </div>
                            )}

                            {mode === 'register' && (
                                <div>
                                    <label className="label">Confirmar Contraseña</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                        className="input"
                                        placeholder="••••••••"
                                    />
                                </div>
                            )}

                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}

                        <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full disabled:opacity-50"
                            >
                                {loading ? 'Procesando...' : buttonLabel[mode]}
                            </button>

                            {/* Google OAuth — pendiente configuración Google Cloud Console */}
                            {false && mode !== 'forgot' && (
                                <>
                                    <div className="relative flex items-center gap-3 my-1">
                                        <div className="flex-1 h-px bg-charcoal/10" />
                                        <span className="text-xs text-charcoal-light">o continúa con</span>
                                        <div className="flex-1 h-px bg-charcoal/10" />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleGoogle}
                                        disabled={oauthLoading}
                                        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-charcoal/20 rounded-lg bg-white hover:bg-gray-50 transition-all duration-200 text-sm font-medium text-charcoal shadow-sm disabled:opacity-60"
                                    >
                                        {oauthLoading ? (
                                            <span className="w-5 h-5 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                                        ) : (
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                            </svg>
                                        )}
                                        {oauthLoading ? 'Redirigiendo...' : 'Continuar con Google'}
                                    </button>
                                </>
                            )}
                        </form>
                    )}

                    <div className="mt-6 pt-6 border-t border-charcoal/10 text-center space-y-2">
                        {mode === 'forgot' ? (
                            <p className="text-sm text-charcoal-light">
                                ¿Recordaste tu contraseña?{' '}
                                <button
                                    onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                                    className="text-gold font-medium hover:underline"
                                >
                                    Inicia Sesión
                                </button>
                            </p>
                        ) : (
                            <p className="text-sm text-charcoal-light">
                                {mode === 'register' ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
                                <button
                                    onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }}
                                    className="text-gold font-medium hover:underline"
                                >
                                    {mode === 'register' ? 'Inicia Sesión' : 'Regístrate'}
                                </button>
                            </p>
                        )}
                    </div>
                </div>

                <p className="text-center text-sm text-charcoal-light mt-6">
                    Al registrarte aceptas nuestros{' '}
                    <Link to="/terminos" className="text-gold hover:underline">
                        Términos y Condiciones
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
