import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function Header() {
    const location = useLocation();
    const { openCart, itemCount } = useCartStore();
    const { isAuthenticated, user, logout } = useAuthStore();
    const count = itemCount();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { path: '/', label: 'Inicio' },
        { path: '/tienda', label: 'Tienda' },
        { path: '/academia', label: 'Academia' },
        { path: '/blog', label: 'Blog' },
        { path: '/nosotros', label: 'Nosotros' },
    ];

    return (
        <>
            <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-forest shadow-botanical py-3 border-b border-gold/20'
                : 'bg-forest py-5'
                }`}>
                <div className="container-luxury">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="font-serif text-2xl text-cream tracking-wide"
                            >
                                J. Denis
                            </motion.div>
                            <span className="hidden sm:inline text-cream/50 text-xs tracking-[0.2em] uppercase">
                                Desde 1998
                            </span>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm tracking-wider transition-colors ${location.pathname === link.path
                                        ? 'text-gold'
                                        : 'text-cream/70 hover:text-gold'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-6">
                            {/* User */}
                            {isAuthenticated ? (
                                <div className="hidden sm:flex items-center gap-4">
                                    {['ADMIN', 'EJECUTIVO', 'FABRICA', 'ALMACEN_MATERIA_PRIMA', 'ALMACEN_PRODUCTO_FINAL', 'TRANSPORTISTA'].includes(user?.role || '') ? (
                                        <Link
                                            to="/admin"
                                            className="text-xs tracking-wider uppercase text-gold hover:text-white transition-colors"
                                        >
                                            {user?.role === 'ADMIN' ? 'Admin' :
                                                user?.role === 'EJECUTIVO' ? 'Ejecutivo' :
                                                    user?.role === 'FABRICA' ? 'Fábrica' :
                                                        user?.role === 'ALMACEN_MATERIA_PRIMA' ? 'Almacén MP' :
                                                            user?.role === 'ALMACEN_PRODUCTO_FINAL' ? 'Almacén PF' :
                                                                user?.role === 'TRANSPORTISTA' ? 'Transportista' : 'Panel'}
                                        </Link>
                                    ) : (
                                        <Link
                                            to="/mi-cuenta"
                                            className="text-xs tracking-wider uppercase text-gold hover:text-white transition-colors"
                                        >
                                            {user?.role === 'DISTRIBUIDOR' ? 'Distribuidor' : 'Cliente'}
                                        </Link>
                                    )}
                                    <Link
                                        to={['ADMIN', 'EJECUTIVO', 'FABRICA', 'ALMACEN_MATERIA_PRIMA', 'ALMACEN_PRODUCTO_FINAL', 'TRANSPORTISTA'].includes(user?.role || '') ? '/admin' : '/mi-cuenta'}
                                        className="text-xs tracking-wider uppercase text-cream/70 hover:text-gold transition-colors"
                                    >
                                        {user?.fullName?.split(' ')[0]}
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="text-xs text-cream/50 hover:text-gold transition-colors"
                                    >
                                        Salir
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="hidden sm:block text-xs tracking-wider uppercase text-cream/70 hover:text-gold transition-colors"
                                >
                                    Acceso
                                </Link>
                            )}

                            {/* Cart Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={openCart}
                                className="relative p-2 text-cream/70 hover:text-gold transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {count > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-forest text-xs rounded-full flex items-center justify-center font-semibold"
                                    >
                                        {count}
                                    </motion.span>
                                )}
                            </motion.button>

                            {/* Mobile Menu Toggle */}
                            <button
                                className="md:hidden p-2 text-cream/70"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <motion.div
                initial={false}
                animate={{
                    opacity: mobileMenuOpen ? 1 : 0,
                    y: mobileMenuOpen ? 0 : -20
                }}
                className={`fixed inset-0 z-40 bg-forest/98 backdrop-blur-lg md:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                style={{ paddingTop: '100px' }}
            >
                <nav className="container-luxury flex flex-col items-center gap-8 py-12">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-lg font-serif tracking-wider ${location.pathname === link.path
                                ? 'text-gold'
                                : 'text-cream/70 hover:text-gold'
                                } transition-colors`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="w-16 h-px bg-gold/30 my-4" />
                    {isAuthenticated ? (
                        <>
                            {['ADMIN', 'EJECUTIVO', 'FABRICA', 'ALMACEN_MATERIA_PRIMA', 'ALMACEN_PRODUCTO_FINAL', 'TRANSPORTISTA'].includes(user?.role || '') && (
                                <Link
                                    to="/admin"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gold hover:text-white"
                                >
                                    Panel Interno
                                </Link>
                            )}
                            {['CLIENTE', 'DISTRIBUIDOR'].includes(user?.role || '') && (
                                <Link
                                    to="/mi-cuenta"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-gold hover:text-white"
                                >
                                    Dashboard
                                </Link>
                            )}
                            <div className="text-cream/70">
                                {user?.fullName?.split(' ')[0]}
                            </div>
                            <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-cream/50">
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="btn btn-outline-light"
                        >
                            Acceso
                        </Link>
                    )}
                </nav>
            </motion.div>
        </>
    );
}
