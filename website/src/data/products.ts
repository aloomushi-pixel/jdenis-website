import type { Product } from '../store/cartStore';

// Productos reales de jdenis.com con precios e imágenes del CDN oficial
// Fuente: https://www.jdenis.com/productos/
const CDN_BASE = 'https://acdn-us.mitiendanube.com/stores/694/809/products';

export const products: Product[] = [
    // ═══════════════════════════════════════════════════════════════════
    // LASH LIFTING
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'kit-lash-lifting-profesional',
        name: 'Kit Lash Lifting Profesional J.Denis',
        price: 850,
        image: `${CDN_BASE}/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-640-0.webp`,
        category: 'Lash Lifting',
        description: 'Sistema completo para levantar, alisar y engrosar pestañas naturales. Incluye: Cremas (Lifting, Fijadora), Lociones (Limpiadora, Vitaminada), Pigmento, Reactor, Gel Reestructurante, Adhesivo y Herramientas. Rinde hasta 35 aplicaciones.',
    },
    {
        id: 'activador-henna',
        name: 'Activador de Henna',
        price: 100,
        image: `${CDN_BASE}/activador-henna-2-2398d7caec1193296817558879257390-640-0.webp`,
        category: 'Lash Lifting',
        description: 'Activador especializado para henna de cejas y pestañas. Fórmula profesional.',
    },
    {
        id: 'adhesivo-balsamo-butter',
        name: 'Adhesivo Bálsamo Butter',
        price: 380,
        image: `${CDN_BASE}/butter-lift-balm-mantequilla-1-996e59c4a72214a20617552156276002-640-0.webp`,
        category: 'Lash Lifting',
        description: 'Textura de bálsamo enriquecida con aceite de argán, jojoba y aguacate. Libre de látex. Ideal para pieles sensibles.',
    },
    {
        id: 'pad-nube',
        name: 'Pad Nube',
        price: 150,
        image: `${CDN_BASE}/captura-de-pantalla-2019-02-09-a-las-20-04-021-39c0aa667e05a80ed715497643400355-640-0.webp`,
        category: 'Lash Lifting',
        description: 'Pad de silicón suave tipo nube para aplicación de lifting. Diseño ergonómico para mejor adaptación.',
    },
    {
        id: 'crema-lifting-paso-1',
        name: 'Crema Lifting Paso 1',
        price: 100,
        image: `${CDN_BASE}/captura-de-pantalla-2022-10-27-a-las-21-56-201-ae6d1dfdb4f3f6dab816669266379730-640-0.webp`,
        category: 'Lash Lifting',
        description: 'Paso inicial (1) para el moldeado químico del vello. Fórmula hipoalergénica con pH controlado.',
    },
    {
        id: 'crema-fijadora-paso-2',
        name: 'Crema Fijadora Paso 2',
        price: 100,
        image: `${CDN_BASE}/captura-de-pantalla-2022-10-27-a-las-21-57-291-db2b8c7fa9c7e22e6816669266380116-640-0.webp`,
        category: 'Lash Lifting',
        description: 'Paso final (2) con pH controlado para sellar la nueva forma sin dañar la cutícula.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // BROW HENNA
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'kit-brow-henna',
        name: 'Kit Brow Henna Completo',
        price: 1200,
        image: `${CDN_BASE}/brow-henna-061-fbdb257619cce9e95d16669249148944-640-0.webp`,
        category: 'Brow Henna',
        description: 'Sistema completo para sombreado temporal con efecto tatuaje en la piel y color en el vello. Incluye múltiples tonos profesionales.',
    },
    {
        id: 'henna-directa-brown',
        name: 'Henna Directa Medium Brown',
        price: 370,
        image: `${CDN_BASE}/brow-henna-021-ffbce5f8edae14d6d416669249149128-640-0.webp`,
        category: 'Brow Henna',
        description: 'Aplicación sin mezcla compleja. Colores disponibles: Medium Brown, Dark Brown, Black.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // DISEÑO DE CEJAS
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'laminado-cejas-kit',
        name: 'Kit Laminado de Cejas',
        price: 200,
        image: `${CDN_BASE}/diseno-021-ca4a861d525c316b2d16669243762302-640-0.webp`,
        category: 'Diseño de Cejas',
        description: 'Incluye geles de planchado, fijador y reestructurante. Rinde para 30 servicios profesionales.',
    },
    {
        id: 'brow-fixative-soap',
        name: 'Brow Fixative Soap',
        price: 70,
        image: `${CDN_BASE}/diseno-031-85cd6ee09f1dd247bb16669243762541-640-0.webp`,
        category: 'Diseño de Cejas',
        description: 'Jabón fijador orgánico para crear cejas laminadas y extender la duración del peinado.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // LASH BOTOX Y TRATAMIENTOS
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'lash-botox',
        name: 'Botox para Cejas y Pestañas',
        price: 600,
        image: `${CDN_BASE}/captura-de-pantalla-2022-10-30-a-las-19-57-071-04021a75d3be481cba16671814910615-640-0.webp`,
        category: 'Tratamientos',
        description: 'Tratamiento reconstructor post-lifting. Hidrata y rejuvenece las pestañas después del proceso químico.',
    },
    {
        id: 'vitamina-alargadora',
        name: 'Vitamina Alargadora',
        price: 120,
        image: `${CDN_BASE}/1-57c7e4cea6296a4c7217097893970405-640-0.webp`,
        category: 'Tratamientos',
        description: 'Tratamiento de 30ml que fortalece y alarga las pestañas naturales en un periodo de 4 semanas.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // EXTENSIONES DE PESTAÑAS
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'pestana-super-volume',
        name: 'Pestaña Super Volume',
        price: 380,
        image: `${CDN_BASE}/pestana-flat-6-67059c90c476666e3217112091825676-640-0.webp`,
        category: 'Extensiones',
        description: 'Línea premium para técnicas de abanicos 2D a 6D. Máxima ligereza y suavidad. Ideal para volumen ruso.',
    },
    {
        id: 'pestana-mink-curva-c',
        name: 'Pestañas Mink Curva C',
        price: 280,
        image: `${CDN_BASE}/mink-02-8cac10d429ef2b8b6716761605549107-640-0.webp`,
        category: 'Extensiones',
        description: 'Pestañas de visón sintético de alta calidad. Curva C, disponible en grosores 0.07, 0.10, 0.12, 0.15mm.',
    },
    {
        id: 'pestana-mink-curva-d',
        name: 'Pestañas Mink Curva D',
        price: 280,
        image: `${CDN_BASE}/mink-pink-011-b2f6c386e8e7c88c3816761605549309-640-0.webp`,
        category: 'Extensiones',
        description: 'Pestañas de visón sintético. Curva D dramática, disponible en múltiples longitudes.',
    },
    {
        id: 'pestana-gold-volumen',
        name: 'Pestañas Volumen Gold',
        price: 360,
        image: `${CDN_BASE}/gold-011-a2c7a3cc3a1553ded816761605549508-640-0.webp`,
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
        image: `${CDN_BASE}/adhesivo-011-b5c7a3cc3b1553ded816761605549609-640-0.webp`,
        category: 'Adhesivos',
        description: 'Adhesivo de alta viscosidad y secado rápido (1-2 seg). Ideal para técnica clásica y volumen. Duración 6-8 semanas.',
    },
    {
        id: 'pinza-volumen-tva4',
        name: 'Pinza Volumen Cod: TVA4',
        price: 150,
        image: `${CDN_BASE}/71-4b79e53f083c62955116034934226539-640-0.webp`,
        category: 'Herramientas',
        description: 'Pinza modelo Ele de acero inoxidable de alta precisión. Agarre perfecto para técnica de abanico.',
    },
    {
        id: 'pinzas-unicornio-pro',
        name: 'Pinzas Unicornio Pro',
        price: 295,
        image: `${CDN_BASE}/pinza-unicornio-011-45c7a3cc3c1553ded816761605549710-640-0.webp`,
        category: 'Herramientas',
        description: 'Pinzas de punta curva con acabado iridiscente. Acero inoxidable premium para máxima precisión.',
    },

    // ═══════════════════════════════════════════════════════════════════
    // ACCESORIOS PROFESIONALES
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'lampara-media-luna',
        name: 'Lámpara Media Luna LED',
        price: 2600,
        image: `${CDN_BASE}/led-02-011-81a2bfd1118ab4719116813240087351-640-0.webp`,
        category: 'Accesorios',
        description: 'Lámpara profesional LED de media luna con luz ajustable. Ideal para trabajo de precisión en extensiones.',
    },
    {
        id: 'compass-silver-ratio',
        name: 'Compass Silver Ratio',
        price: 1270,
        image: `${CDN_BASE}/compass-silver-011-65c7a3cc3d1553ded816761605549811-640-0.webp`,
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
        image: `${CDN_BASE}/shampoo-lash-011-75c7a3cc3e1553ded816761605549912-640-0.webp`,
        category: 'Higiene',
        description: 'Limpieza profunda de párpados y pestañas. Esencial para la asepsia y retención de extensiones.',
    },
    {
        id: 'agua-micelar',
        name: 'Agua Micelar J.Denis',
        price: 75,
        image: `${CDN_BASE}/agua-micelar-011-85c7a3cc3f1553ded816761605550013-640-0.webp`,
        category: 'Higiene',
        description: 'Remoción suave de maquillaje sin comprometer la barrera cutánea. Apto para pieles sensibles.',
    },
    {
        id: 'tonificante-desinfectante',
        name: 'Tonificante Desinfectante',
        price: 90,
        image: `${CDN_BASE}/tonificante-011-95c7a3cc3g1553ded816761605550114-640-0.webp`,
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
