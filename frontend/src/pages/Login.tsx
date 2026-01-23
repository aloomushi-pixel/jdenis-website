import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            login(token, user);

            // Navigate based on role
            switch (user.role) {
                case 'ADMIN':
                    navigate('/admin/dashboard');
                    break;
                case 'FACTORY_MANAGER':
                    navigate('/factory/dashboard');
                    break;
                case 'WAREHOUSE_MANAGER':
                    navigate('/warehouse/dashboard');
                    break;
                case 'TRANSPORTER':
                    navigate('/operator/deliveries');
                    break;
                default:
                    navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-900">
            <div className="card max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary-800 mb-2">J DENIS</h1>
                    <p className="text-gray-600">Sistema de Gestión Empresarial</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="label">Correo Electrónico</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            required
                            placeholder="usuario@jdenis.com"
                        />
                    </div>

                    <div>
                        <label className="label">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full text-lg py-3"
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold mb-2">Usuarios de prueba:</p>
                    <div className="text-xs text-gray-600 space-y-1">
                        <p>• Admin: admin@jdenis.com / admin123</p>
                        <p>• Fábrica: fabrica@jdenis.com / factory123</p>
                        <p>• Almacén: almacen@jdenis.com / warehouse123</p>
                        <p>• Transporte: transporte@jdenis.com / transport123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
