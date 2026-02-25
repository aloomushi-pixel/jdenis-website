import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

type FormMode = 'login' | 'register' | 'forgot';

export default function Login() {
    const navigate = useNavigate();
    const { login, register, resetPassword } = useAuthStore();
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
