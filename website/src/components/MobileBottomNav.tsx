import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function MobileBottomNav() {
    const location = useLocation();
    const { openCart, itemCount } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const count = itemCount();

    const isActive = (path: string) =>
        location.pathname === path ? 'active' : '';

    return (
        <nav className="mobile-bottom-nav md:hidden" aria-label="Navegación móvil">
            {/* Inicio */}
            <Link to="/" className={isActive('/')}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Inicio</span>
            </Link>

            {/* Tienda */}
            <Link to="/tienda" className={isActive('/tienda')}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Tienda</span>
            </Link>

            {/* Carrito */}
            <button onClick={openCart} className="relative">
                <div className="relative">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {count > 0 && (
                        <span
                            className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                            style={{ background: '#C9A227', color: '#0E1738' }}
                        >
                            {count}
                        </span>
                    )}
                </div>
                <span>Carrito</span>
            </button>

            {/* Academia */}
            <Link to="/academia" className={isActive('/academia')}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                <span>Academia</span>
            </Link>

            {/* Cuenta */}
            <Link to={isAuthenticated ? '/mi-cuenta' : '/login'} className={isActive('/mi-cuenta') || isActive('/login')}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Cuenta</span>
            </Link>
        </nav>
    );
}
