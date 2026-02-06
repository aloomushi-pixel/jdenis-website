import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';

export default function Header() {
    const location = useLocation();
    const { openCart, itemCount } = useCartStore();
    const { isAuthenticated, user, logout } = useAuthStore();
    const count = itemCount();

    const navLinks = [
        { path: '/', label: 'Inicio' },
        { path: '/tienda', label: 'Tienda' },
        { path: '/academia', label: 'Academia' },
        { path: '/blog', label: 'Blog' },
        { path: '/nosotros', label: 'Nosotros' },
    ];

    return (
        <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-charcoal/5">
            <div className="container-luxury">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="font-serif text-2xl text-navy font-bold tracking-tight"
                        >
                            J. DENIS
                        </motion.div>
                        <span className="hidden sm:block text-xs text-charcoal-light uppercase tracking-widest">
                            Desde 1998
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        {/* User */}
                        {isAuthenticated ? (
                            <div className="hidden sm:flex items-center gap-3">
                                <Link to="/mi-cuenta" className="text-sm text-charcoal hover:text-gold transition-colors">
                                    {user?.fullName?.split(' ')[0]}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-xs text-charcoal-light hover:text-gold"
                                >
                                    Salir
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="hidden sm:block text-sm font-medium text-navy hover:text-gold transition-colors"
                            >
                                Iniciar Sesión
                            </Link>
                        )}

                        {/* Cart Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={openCart}
                            className="relative p-2 rounded-lg hover:bg-navy/5 transition-colors"
                        >
                            <svg className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {count > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-white text-xs rounded-full flex items-center justify-center font-medium"
                                >
                                    {count}
                                </motion.span>
                            )}
                        </motion.button>

                        {/* Mobile Menu (simplified) */}
                        <button className="md:hidden p-2">
                            <svg className="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
