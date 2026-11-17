import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useSearchStore } from '../store/searchStore';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartPromotion } from '../hooks/useCartPromotion';

export default function Header() {
    const location = useLocation();
    const { openCart, itemCount } = useCartStore();
    const { isAuthenticated, user, logout } = useAuthStore();
    const favoriteCount = useWishlistStore((s) => s.favoriteIds.length);
    const promotion = useCartPromotion();
    const count = itemCount();
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { openSearch } = useSearchStore();

    useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 50);

            if (location.pathname === '/tienda') {
                setHidden(currentScrollY > 100);
            } else {
                setHidden(currentScrollY > lastScrollY && currentScrollY > 150);
            }
            lastScrollY = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    const [prevPath, setPrevPath] = useState(location.pathname);
    if (prevPath !== location.pathname) {
        setPrevPath(location.pathname);
        if (mobileMenuOpen) setMobileMenuOpen(false);
    }

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const navLinks = [
        { path: '/', label: 'Inicio' },
        { path: '/tienda', label: 'Tienda' },
        { path: '/academia', label: 'Academia' },
        { path: '/blog', label: 'Blog' },
        { path: '/nosotros', label: 'Nosotros' },
    ];

    const isStaff = ['ADMIN', 'EJECUTIVO', 'FABRICA', 'ALMACEN_MATERIA_PRIMA', 'ALMACEN_PRODUCTO_FINAL', 'TRANSPORTISTA'].includes(user?.role || '');

    return (
        <>
            <header className={`fixed top-0 w-full z-[60] transition-all duration-300 ${hidden && !mobileMenuOpen ? '-translate-y-full' : 'translate-y-0'} bg-[#001641] ${scrolled
                ? 'shadow-botanical border-b border-gold/20'
                : ''
                }`}>
                {/* Dynamic Trust & Free Shipping Top Bar */}
                {!scrolled && (
                    <div className="bg-[#08112e] border-b border-gold/15 text-cream/90 text-[11px] sm:text-xs py-1.5 px-4 text-center">
                        {count > 0 && user?.role !== 'DISTRIBUIDOR' ? (
                            <button
                                type="button"
                                onClick={openCart}
                                className="inline-flex items-center justify-center gap-2 hover:text-gold transition-colors font-medium"
                            >
                                {promotion.isFreeShipping ? (
                                    <span>🎉 ¡Felicidades! Tu pedido ya incluye <strong className="text-gold">ENVÍO GRATIS asegurado</strong> a todo México</span>
                                ) : (
                                    <span>🚚 {promotion.progressText || 'Envío Gratis en compras desde $2,000 MXN'} · <span className="underline text-gold">Ver carrito</span></span>
                                )}
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
                                <span>✨ <strong className="text-gold">Fabricante Oficial</strong> desde 1998</span>
                                <span className="hidden sm:inline text-gold/40">•</span>
                                <span>🚚 Envío Asegurado <strong className="text-gold">GRATIS desde $2,000 MXN</strong></span>
                                <span className="hidden md:inline text-gold/40">•</span>
                                <Link to="/solicitar-factura" className="hidden md:inline hover:text-gold transition-colors">
                                    🧾 Facturación CFDI 4.0
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                <div className={`container-luxury transition-all duration-300 ${scrolled ? 'py-2.5' : 'py-3.5'}`}>
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            <motion.img
                                whileHover={{ scale: 1.02 }}
                                src="/logo-new.jpeg"
                                alt="J. Denis Logo"
                                className="h-10 sm:h-12 w-auto object-contain"
                            />
                            <span className="hidden sm:inline text-cream/80 text-xs tracking-[0.2em] uppercase">
                                Desde 1998
                            </span>
                        </Link>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-sm tracking-wider transition-colors font-medium ${location.pathname === link.path
                                        ? 'text-white font-semibold'
                                        : 'text-cream hover:text-white'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 sm:gap-3">
                            {/* User */}
                            {isAuthenticated ? (
                                <div className="hidden sm:flex items-center gap-3 mr-1">
                                    {isStaff ? (
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
                                            {user?.role === 'DISTRIBUIDOR' ? 'Distribuidor' : 'Mi Cuenta'}
                                        </Link>
                                    )}
                                    <Link
                                        to={isStaff ? '/admin' : '/mi-cuenta'}
                                        className="text-xs tracking-wider uppercase text-cream hover:text-gold transition-colors"
                                    >
                                        {user?.fullName?.split(' ')[0]}
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={logout}
                                        aria-label="Cerrar sesión"
                                        className="text-xs text-cream hover:text-gold transition-colors"
                                    >
                                        Salir
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="hidden sm:block text-xs tracking-wider uppercase text-cream hover:text-gold transition-colors mr-1"
                                >
                                    Acceso
                                </Link>
                            )}

                            {/* Search Button */}
                            <button
                                onClick={openSearch}
                                aria-label="Buscar productos"
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-cream hover:text-gold transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </button>

                            {/* Favorites / Wishlist Link */}
                            <Link
                                to="/tienda?favs=1"
                                aria-label="Ver mis productos favoritos"
                                title="Mis Favoritos"
                                className="relative min-w-[44px] min-h-[44px] flex items-center justify-center text-cream hover:text-gold transition-colors"
                            >
                                <svg className="w-5 h-5" fill={favoriteCount > 0 ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                                {favoriteCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                        {favoriteCount}
                                    </span>
                                )}
                            </Link>

                            {/* Cart Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={openCart}
                                aria-label="Abrir carrito de compras"
                                className="relative min-w-[44px] min-h-[44px] flex items-center justify-center text-cream hover:text-gold transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                {count > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-white text-xs rounded-full flex items-center justify-center font-semibold"
                                    >
                                        {count}
                                    </motion.span>
                                )}
                            </motion.button>

                            {/* Mobile Menu Toggle */}
                            <button
                                className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-cream/70"
                                aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                                aria-expanded={mobileMenuOpen}
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className={`fixed inset-0 z-[55] backdrop-blur-xl md:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
                    }`}
                style={{ paddingTop: '100px', background: 'rgba(0, 22, 65, 0.98)' }}
            >
                <nav className="container-luxury flex flex-col items-center gap-7 py-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`text-lg font-serif tracking-wider ${location.pathname === link.path
                                ? 'text-white font-semibold'
                                : 'text-cream/90 hover:text-white'
                                } transition-colors`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        to="/tienda?favs=1"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-base font-serif tracking-wider text-gold hover:text-white transition-colors"
                    >
                        ❤️ Mis Favoritos {favoriteCount > 0 ? `(${favoriteCount})` : ''}
                    </Link>
                    <div className="w-16 h-px bg-gold/30 my-2" />
                    {isAuthenticated ? (
                        <>
                            {isStaff && (
                                <Link
                                    to="/admin"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-cream hover:text-white"
                                >
                                    Panel Interno
                                </Link>
                            )}
                            {['CLIENTE', 'DISTRIBUIDOR'].includes(user?.role || '') && (
                                <Link
                                    to="/mi-cuenta"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-cream hover:text-white"
                                >
                                    Mi Cuenta y Pedidos
                                </Link>
                            )}
                            <div className="text-cream">
                                {user?.fullName?.split(' ')[0]}
                            </div>
                            <button
                                type="button"
                                onClick={() => { logout(); setMobileMenuOpen(false); }}
                                aria-label="Cerrar sesión"
                                className="text-cream hover:text-white min-h-[44px]"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="btn btn-outline-light"
                        >
                            Acceso / Registro
                        </Link>
                    )}
                </nav>
            </motion.div>
        </>
    );
}
