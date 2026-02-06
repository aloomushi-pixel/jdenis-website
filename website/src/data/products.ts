import type { Product } from '../store/cartStore';

// Productos reales de jdenis.com con imágenes locales actualizadas


export const products: Product[] = [
    // ═══════════════════════════════════════════════════════════════════
    // LASH LIFTING
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'kit-lash-lifting-profesional',
        name: 'Kit Lash Lifting Profesional J.Denis',
        price: 850,
        image: '/products/lash-lifting-kit.png',
        category: 'Lash Lifting',
        description: 'Sistema completo para levantar, alisar y engrosar pestañas naturales. Incluye: Cremas (Lifting, Fijadora), Lociones (Limpiadora, Vitaminada), Pigmento, Reactor, Gel Reestructurante, Adhesivo y Herramientas. Rinde hasta 35 aplicaciones.',
    },
    {
        id: 'tintura-topica-castano-medio',
        name: 'Tintura Tópica - Castaño Medio',
        price: 100,
        image: '/products/tintura-castano-medio.png',
        category: 'Lash Lifting',
        description: 'Tintura tópica profesional tono castaño medio para pestañas y cejas. Fórmula profesional de larga duración.',
    },
    {
        id: 'adhesivo-pads-lifting',
        name: 'Adhesivo Individual para Pads - Lifting',
        price: 380,
        image: '/products/adhesivo-pads-lifting.png',
        category: 'Lash Lifting',
        description: 'Adhesivo individual especializado para pads de lifting. Fijación precisa y segura para procedimientos profesionales.',
    },
    {
        id: 'tintura-topica-castano-oscuro',
        name: 'Tintura Tópica - Castaño Oscuro',
        price: 150,
        image: '/products/tintura-castano-oscuro.png',
        category: 'Lash Lifting',
        description: 'Tintura tópica profesional tono castaño oscuro para pestañas y cejas. Color intenso y duradero.',
    },
    {
        id: 'crema-lifting-paso-1',
        name: 'Crema Lash Lifting',
        price: 100,
        image: '/products/crema-lifting-paso1.png',
        category: 'Lash Lifting',
        description: 'Paso inicial (1) para el moldeado químico del vello. Fórmula hipoalergénica con pH controlado.',
    },
    {
        id: 'crema-fijadora-paso-2',
        name: 'Crema Lash Lifting Fijadora',
        price: 100,
        image: '/products/crema-fijadora-paso2.png',
        category: 'Lash Lifting',
        description: 'Paso final (2) con pH controlado para sellar la nueva forma sin dañar la cutícula.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // BROW HENNA
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'kit-brow-henna',
        name: 'Brow Henna',
        price: 1200,
        image: '/products/brow-henna-kit.png',
        category: 'Brow Henna',
        description: 'Sistema completo para sombreado temporal con efecto tatuaje en la piel y color en el vello. Incluye múltiples tonos profesionales.',
    },
    {
        id: 'henna-directa-brown',
        name: 'Henna Directa',
        price: 370,
        image: '/products/henna-directa.png',
        category: 'Brow Henna',
        description: 'Aplicación sin mezcla compleja. Colores disponibles: Medium Brown, Dark Brown, Black.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // DISEÑO DE CEJAS
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'arco-diseno-cejas',
        name: 'Arco para Diseño de Cejas',
        price: 200,
        image: '/products/arco-diseno-cejas.png',
        category: 'Diseño de Cejas',
        description: 'Arco profesional para diseño y medición perfecta de cejas. Herramienta esencial para simetría y proporción.',
    },
    {
        id: 'lapiz-cera',
        name: 'Lápiz de Cera',
        price: 70,
        image: '/products/lapiz-cera.png',
        category: 'Diseño de Cejas',
        description: 'Lápiz de cera profesional para delinear y diseñar cejas con precisión. Trazo suave y definido.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // TRATAMIENTOS Y CUIDADO
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'after-care',
        name: 'After Care',
        price: 600,
        image: '/products/after-care.png',
        category: 'Tratamientos',
        description: 'Tratamiento post-procedimiento para el cuidado y recuperación de pestañas y cejas. Hidrata y fortalece.',
    },
    {
        id: 'mascara-acondicionadora',
        name: 'Máscara Acondicionadora de Pestañas',
        price: 120,
        image: '/products/mascara-acondicionadora.png',
        category: 'Tratamientos',
        description: 'Máscara acondicionadora que fortalece, nutre y alarga las pestañas naturales. Uso diario recomendado.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // EXTENSIONES DE PESTAÑAS
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'pestana-super-volume',
        name: 'Pestaña Super Volume',
        price: 380,
        image: '/products/pestana-super-volume.png',
        category: 'Extensiones',
        description: 'Línea premium para técnicas de abanicos 2D a 6D. Máxima ligereza y suavidad. Ideal para volumen ruso.',
    },
    {
        id: 'pestana-mink-curva-c',
        name: 'Pestañas Mink Curva C',
        price: 280,
        image: '/products/pestana-mink-curva-c.png',
        category: 'Extensiones',
        description: 'Pestañas de visón sintético de alta calidad. Curva C, disponible en grosores 0.07, 0.10, 0.12, 0.15mm.',
    },
    {
        id: 'pestana-mink-curva-d',
        name: 'Pestañas Mink Curva D',
        price: 280,
        image: '/products/pestana-mink-curva-d.png',
        category: 'Extensiones',
        description: 'Pestañas de visón sintético. Curva D dramática, disponible en múltiples longitudes.',
    },
    {
        id: 'pestana-gold-volumen',
        name: 'Pestañas Volumen Gold',
        price: 360,
        image: '/products/pestana-volumen-gold.png',
        category: 'Extensiones',
        description: 'Línea Gold premium para técnicas de volumen ruso. Ultra livianas para aplicación perfecta.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // ADHESIVOS Y HERRAMIENTAS
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'adhesivo-supreme-g4',
        name: 'Adhesivo Supreme G4',
        price: 450,
        image: '/products/adhesivo-supreme-g4.png',
        category: 'Adhesivos',
        description: 'Adhesivo de alta viscosidad y secado rápido (1-2 seg). Ideal para técnica clásica y volumen. Duración 6-8 semanas.',
    },
    {
        id: 'perfilador-doble',
        name: 'Perfilador Doble - Paquete de 3 Pzs',
        price: 150,
        image: '/products/perfilador-doble.png',
        category: 'Herramientas',
        description: 'Perfilador doble de precisión. Paquete de 3 piezas para diseño y definición profesional de cejas.',
    },
    {
        id: 'godete-cristal',
        name: 'Godete de Cristal',
        price: 295,
        image: '/products/godete-cristal.png',
        category: 'Herramientas',
        description: 'Godete de cristal profesional para mezclas de pigmentos, tintes y adhesivos. Superficie lisa y fácil de limpiar.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // ACCESORIOS PROFESIONALES
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'lampara-media-luna',
        name: 'Lámpara Media Luna LED',
        price: 2600,
        image: '/products/lampara-media-luna.png',
        category: 'Accesorios',
        description: 'Lámpara profesional LED de media luna con luz ajustable. Ideal para trabajo de precisión en extensiones.',
    },
    {
        id: 'compass-silver-ratio',
        name: 'Compass Silver Ratio',
        price: 1270,
        image: '/products/compass-silver-ratio.png',
        category: 'Accesorios',
        description: 'Compás de proporción áurea para mediciones precisas en micropigmentación y diseño de cejas.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // HIGIENE Y CUIDADO
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'lash-shampoo',
        name: 'Lash Shampoo Espuma',
        price: 100,
        image: '/products/lash-shampoo.png',
        category: 'Higiene',
        description: 'Limpieza profunda de párpados y pestañas. Esencial para la asepsia y retención de extensiones.',
    },
    {
        id: 'agua-micelar',
        name: 'Agua Micelar J.Denis',
        price: 75,
        image: '/products/agua-micelar.png',
        category: 'Higiene',
        description: 'Remoción suave de maquillaje sin comprometer la barrera cutánea. Apto para pieles sensibles.',
    },
    {
        id: 'tonificante-desinfectante',
        name: 'Tonificante Desinfectante',
        price: 90,
        image: '/products/tonificante-desinfectante.png',
        category: 'Higiene',
        description: 'Sanitizante de amplio espectro. Bactericida y viricida para piel y herramientas de trabajo.',
    },
];

// Categorías actualizadas según el sitio real
export const categories = [
    { id: 'all', name: 'Todos', icon: '✨' },
    { id: 'lash-lifting', name: 'Lash Lifting', icon: '👁️' },
    { id: 'brow-henna', name: 'Brow Henna', icon: '✏️' },
    { id: 'cejas', name: 'Diseño de Cejas', icon: '🖌️' },
    { id: 'extensiones', name: 'Extensiones', icon: '💫' },
    { id: 'tratamientos', name: 'Tratamientos', icon: '💎' },
    { id: 'adhesivos', name: 'Adhesivos', icon: '🧪' },
    { id: 'herramientas', name: 'Herramientas', icon: '🔧' },
    { id: 'accesorios', name: 'Accesorios', icon: '💡' },
    { id: 'higiene', name: 'Higiene', icon: '💧' },
];

export const bestsellers = products.slice(0, 4);

export function getProductById(id: string): Product | undefined {
    return products.find(p => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
    if (category === 'all') return products;
    return products.filter(p =>
        p.category.toLowerCase().replace(/\s+/g, '-').includes(category.toLowerCase()) ||
        p.category.toLowerCase().includes(category.toLowerCase())
    );
}
