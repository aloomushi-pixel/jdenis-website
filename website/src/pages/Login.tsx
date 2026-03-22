import { motion, AnimatePresence } from 'framer-motion';
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
    const [showPassword, setShowPassword] = useState(false);

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

    const buttonLabel: Record<FormMode, string> = {
        login: 'Iniciar Sesión',
        register: 'Crear Cuenta',
        forgot: 'Enviar enlace',
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo centrado */}
                <div className="flex justify-center mb-10">
                    <Link to="/">
                        <img src="/logo-new.jpeg" alt="J. Denis" className="h-20 w-auto object-contain" />
                    </Link>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.25 }}
                    >
                        {successMsg ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <div
                                    className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center"
                                    style={{ background: 'rgba(10,24,71,0.08)' }}
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="#0a1847" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-gray-700 font-medium mb-5 text-sm leading-relaxed">{successMsg}</p>
                                <button
                                    onClick={() => { setMode('login'); setSuccessMsg(''); }}
                                    className="text-sm font-medium underline underline-offset-4"
                                    style={{ color: '#0a1847' }}
                                >
                                    Volver a Iniciar Sesión
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {mode === 'register' && (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Nombre Completo</label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                            placeholder="María González"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                        placeholder="tu@email.com"
                                    />
                                </div>

                                {mode !== 'forgot' && (
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Contraseña</label>
                                            {mode === 'login' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setMode('forgot')}
                                                    className="text-xs font-medium hover:underline transition-colors"
                                                    style={{ color: '#0a1847' }}
                                                >
                                                    ¿Olvidaste tu contraseña?
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all pr-11"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {mode === 'register' && (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Confirmar Contraseña</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                )}

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-xs text-center bg-red-50 rounded-lg py-2 px-3"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 rounded-xl text-sm font-semibold tracking-wider uppercase text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                                    style={{ background: 'linear-gradient(135deg, #0a1847 0%, #1a3580 100%)', boxShadow: '0 4px 20px rgba(10,24,71,0.3)' }}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Procesando...
                                        </span>
                                    ) : buttonLabel[mode]}
                                </button>
                            </form>
                        )}

                        {/* Footer links */}
                        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                            {mode === 'forgot' ? (
                                <p className="text-sm text-gray-400">
                                    ¿Recordaste tu contraseña?{' '}
                                    <button
                                        onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); }}
                                        className="font-semibold hover:underline transition-colors"
                                        style={{ color: '#0a1847' }}
                                    >
                                        Inicia Sesión
                                    </button>
                                </p>
                            ) : (
                                <p className="text-sm text-gray-400">
                                    {mode === 'register' ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
                                    <button
                                        onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }}
                                        className="font-semibold hover:underline transition-colors"
                                        style={{ color: '#0a1847' }}
                                    >
                                        {mode === 'register' ? 'Inicia Sesión' : 'Regístrate'}
                                    </button>
                                </p>
                            )}
                            <p className="text-xs text-gray-300 mt-4">
                                Al registrarte aceptas nuestros{' '}
                                <Link to="/terminos" className="hover:underline" style={{ color: '#0a1847' }}>
                                    Términos y Condiciones
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
