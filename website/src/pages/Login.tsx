import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export default function Login() {
    const navigate = useNavigate();
    const { login, register } = useAuthStore();
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        confirmPassword: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isRegister) {
                if (formData.password !== formData.confirmPassword) {
                    setError('Las contraseñas no coinciden');
                    setLoading(false);
                    return;
                }
                const success = await register({
                    email: formData.email,
                    password: formData.password,
                    fullName: formData.fullName,
                });
                if (success) {
                    navigate('/mi-cuenta');
                } else {
                    setError('Error al crear cuenta. Intenta de nuevo.');
                }
            } else {
                const success = await login(formData.email, formData.password);
                if (success) {
                    navigate('/mi-cuenta');
                } else {
                    setError('Email o contraseña incorrectos');
                }
            }
        } catch {
            setError('Error de conexión. Intenta más tarde.');
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
                        {isRegister ? 'Crea tu cuenta profesional' : 'Accede a tu cuenta'}
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-luxury">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isRegister && (
                            <div>
                                <label className="label">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    required={isRegister}
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
                        </div>

                        {isRegister && (
                            <div>
                                <label className="label">Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required={isRegister}
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
                            {loading ? 'Procesando...' : isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-charcoal/10 text-center">
                        <p className="text-sm text-charcoal-light">
                            {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="text-gold font-medium hover:underline"
                            >
                                {isRegister ? 'Inicia Sesión' : 'Regístrate'}
                            </button>
                        </p>
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
