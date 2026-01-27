import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-navy text-white">
            {/* Main Footer */}
            <div className="container-luxury py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <h3 className="font-serif text-2xl text-white font-bold mb-4">J. DENIS</h3>
                        <p className="text-white/70 text-sm leading-relaxed mb-6">
                            25 años de innovación técnica y patentes mexicanas para la mirada.
                            Elevamos la belleza profesional a una ciencia.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://facebook.com/JDenisMexico" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                            </a>
                            <a href="https://youtube.com/@JDenismexico" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            <a href="https://wa.me/525527271067" target="_blank" rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Tienda */}
                    <div>
                        <h4 className="font-medium text-white mb-4">Tienda</h4>
                        <ul className="space-y-3">
                            <li><Link to="/tienda?cat=lifting" className="text-white/70 hover:text-gold transition-colors text-sm">Lash Lifting & Rizado</Link></li>
                            <li><Link to="/tienda?cat=cejas" className="text-white/70 hover:text-gold transition-colors text-sm">Cejas & Henna</Link></li>
                            <li><Link to="/tienda?cat=extensiones" className="text-white/70 hover:text-gold transition-colors text-sm">Extensiones</Link></li>
                            <li><Link to="/tienda?cat=herramientas" className="text-white/70 hover:text-gold transition-colors text-sm">Herramientas</Link></li>
                            <li><Link to="/tienda?cat=cuidado" className="text-white/70 hover:text-gold transition-colors text-sm">Cuidado e Higiene</Link></li>
                        </ul>
                    </div>

                    {/* Academia */}
                    <div>
                        <h4 className="font-medium text-white mb-4">Academia</h4>
                        <ul className="space-y-3">
                            <li><Link to="/academia" className="text-white/70 hover:text-gold transition-colors text-sm">Cursos Presenciales</Link></li>
                            <li><Link to="/academia" className="text-white/70 hover:text-gold transition-colors text-sm">Certificaciones</Link></li>
                            <li><Link to="/academia" className="text-white/70 hover:text-gold transition-colors text-sm">Seminarios Online</Link></li>
                            <li><a href="https://youtube.com/@JDenismexico" className="text-white/70 hover:text-gold transition-colors text-sm">Tutoriales YouTube</a></li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h4 className="font-medium text-white mb-4">Contacto</h4>
                        <ul className="space-y-3 text-sm text-white/70">
                            <li className="flex items-start gap-2">
                                <svg className="w-5 h-5 mt-0.5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Av. Montevideo #136, Lindavista, CDMX</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>55 5781 3476</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>contacto@jdenis.com.mx</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container-luxury py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/50 text-sm">
                        © {new Date().getFullYear()} J. Denis. Todos los derechos reservados.
                    </p>
                    <p className="text-white/50 text-sm">
                        Hecho con ❤️ en México 🇲🇽
                    </p>
                </div>
            </div>
        </footer>
    );
}
