import type { Product } from '../store/cartStore';

// Productos reales de jdenis.com con imágenes del CDN oficial
// Actualizado: Feb 2026

export const products: Product[] = [
    // ═══════════════════════════════════════════════════════════════════
    // LASH LIFTING
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'kit-lash-lifting-profesional',
        name: 'Kit Lash Lifting Profesional J.Denis',
        price: 850,
        image: '/products/kit-lash-lifting-cdn.png',
        category: 'Lash Lifting',
        description: 'Realza la belleza natural de tus pestañas. Eleva, alisa y engrosa tus pestañas desde la base, logrando un efecto de mayor longitud y curvatura de manera natural. Su fórmula hipoalergénica es segura y suave, proporcionando resultados duraderos.',
        benefits: [
            'Pestañas visiblemente más largas sin extensiones',
            'Curvatura natural y duradera',
            'Seguro para todo tipo de pestañas gracias a su fórmula hipoalergénica',
            'Fácil aplicación con resultados profesionales',
        ],
        includes: [
            'Crema Lash Lifting',
            'Crema Fijadora',
            'Loción Limpiadora',
            'Loción Vitaminada',
            'Pigmento para Pestañas',
            'Reactor para pigmento',
            'Gel Reestructurante',
            '5 Lifting Pads (SS, S, M, L, LL)',
            'Adhesivo para pads',
            'Máscara en Gel Acondicionadora',
            '20 Protectores de Párpados',
            '10 Aplicadores con espátula',
            '4 Microcepillos',
            '4 Cepillos para Pestañas',
            '2 Anillos',
            '10 Contenedores',
        ],
        performance: 'Hasta 35 aplicaciones',
        relatedCategories: ['Lash Lifting', 'Tratamientos'],
        isFeatured: true,
    },
    {
        id: 'blue-lash-lifting',
        name: 'BLUE Lash Lifting',
        price: 500,
        image: '/products/blue-lash-lifting-cdn.png',
        category: 'Lash Lifting',
        description: 'Kit profesional de Lash Lifting BLUE con rendimiento extendido. Incluye pads de silicón reutilizables y geles de alta calidad para un lifting perfecto.',
        benefits: [
            'Rendimiento extendido para mayor rentabilidad',
            'Pads de silicón reutilizables',
            'Geles de alta calidad profesional',
            'Resultados naturales y duraderos',
        ],
        includes: [
            'Gel Ondulante BLUE',
            'Gel Neutralizante BLUE',
            'Gel Reestructurante',
            'Pads de silicón reutilizables (varios tamaños)',
            'Adhesivo para rulos BLUE',
            'Limpiador de Impurezas BLUE',
            'Herramientas de aplicación',
        ],
        performance: 'Hasta 60 aplicaciones',
        relatedCategories: ['Lash Lifting'],
        isFeatured: true,
    },
    {
        id: 'crema-lifting-paso-1',
        name: 'Crema Lash Lifting',
        price: 100,
        image: '/products/crema-lifting-paso1.png',
        category: 'Lash Lifting',
        description: 'Paso inicial (1) para el moldeado químico del vello. Fórmula hipoalergénica con pH controlado que suaviza la estructura del cabello para lograr la nueva forma deseada.',
        specifications: [
            'Paso 1 del sistema Lash Lifting',
            'pH controlado',
            'Fórmula hipoalergénica',
            'Para uso profesional',
        ],
        relatedCategories: ['Lash Lifting'],
    },
    {
        id: 'crema-fijadora-paso-2',
        name: 'Crema Lash Lifting Fijadora',
        price: 100,
        image: '/products/crema-fijadora-paso2.png',
        category: 'Lash Lifting',
        description: 'Paso final (2) con pH controlado para sellar la nueva forma sin dañar la cutícula. Fija el rizo de forma permanente y duradera.',
        specifications: [
            'Paso 2 del sistema Lash Lifting',
            'pH controlado',
            'Sella sin dañar la cutícula',
            'Fijación permanente',
        ],
        relatedCategories: ['Lash Lifting'],
    },
    {
        id: 'adhesivo-pads-lifting',
        name: 'Adhesivo Individual para Pads - Lifting',
        price: 380,
        image: '/products/adhesivo-pads-lifting.png',
        category: 'Lash Lifting',
        description: 'Adhesivo individual especializado para pads de lifting. Fijación precisa y segura para procedimientos profesionales de lash lifting.',
        specifications: [
            'Fijación precisa para pads',
            'Uso profesional',
            'Compatible con todos los pads J.Denis',
        ],
        relatedCategories: ['Lash Lifting'],
    },
    {
        id: 'peine-lash-lifting',
        name: 'Peine para Lash Lifting',
        price: 50,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
        category: 'Lash Lifting',
        description: 'Peine profesional diseñado específicamente para procedimientos de lash lifting. Permite separar y distribuir las pestañas de forma uniforme sobre el pad.',
        specifications: [
            'Diseño ergonómico',
            'Dientes finos de precisión',
            'Ideal para separar pestañas sobre el pad',
        ],
        relatedCategories: ['Lash Lifting', 'Herramientas'],
    },
    {
        id: 'pad-rosas-micro-canales',
        name: 'Pad Rosas con Micro Canales',
        price: 150,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
        category: 'Lash Lifting',
        description: 'Pads de silicón premium con micro canales que facilitan la separación y elevación de las pestañas. Tecnología avanzada para resultados uniformes y profesionales.',
        benefits: [
            'Micro canales para mejor separación de pestañas',
            'Silicón de alta calidad reutilizable',
            'Múltiples tamaños en un paquete',
            'Fácil limpieza y desinfección',
        ],
        relatedCategories: ['Lash Lifting'],
    },
    {
        id: 'pad-nube',
        name: 'Pad Nube',
        price: 150,
        image: '/products/pad-nube-cdn.png',
        category: 'Lash Lifting',
        description: 'Pad ultra suave con forma de nube para lash lifting. Diseño ergonómico que se adapta a la curvatura natural del párpado para resultados perfectos.',
        benefits: [
            'Forma ergonómica tipo nube',
            'Ultra suave para máximo confort',
            'Se adapta a la curvatura del párpado',
        ],
        relatedCategories: ['Lash Lifting'],
    },
    {
        id: 'pad-anime',
        name: 'Pad Anime',
        price: 250,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/anime-05-6e0e314c9e7228afe817410095004166-1024-1024.webp',
        category: 'Lash Lifting',
        description: 'Pad especial estilo Anime para crear un efecto de pestañas ultra abiertas y dramáticas. Ideal para looks artísticos y dramáticos.',
        benefits: [
            'Efecto de pestañas ultra abiertas',
            'Look dramático estilo anime',
            'Silicón de alta calidad',
            'Reutilizable',
        ],
        relatedCategories: ['Lash Lifting'],
    },

    // ═══════════════════════════════════════════════════════════════════
    // BROW HENNA
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'kit-brow-henna',
        name: 'Brow Henna',
        price: 1200,
        image: '/products/brow-henna-cdn.png',
        category: 'Brow Henna',
        description: 'Una alternativa natural para sombrear las cejas. Derivado de la planta de Henna, en 30 minutos deja un efecto de tatuaje en la piel y recubre el vello de las cejas dando una apariencia de mayor abundancia. No contiene amoniaco, plomo, ni peróxido.',
        benefits: [
            'Efecto tatuaje natural en la piel',
            'Sin amoniaco, plomo ni peróxido',
            'Mayor apariencia de abundancia en cejas',
            'Duración de 3 a 10 días según cuidado',
            'Alternativa no invasiva al microblading',
        ],
        includes: [
            'Henna Castaño Obscuro (30 aplicaciones)',
            'Henna Castaño Medio (30 aplicaciones)',
            'Henna Castaño Claro (30 aplicaciones)',
            'Primer exfoliante para cejas',
            'Activador para polvo Henna',
            'Regla de 20 cm',
            'Lápiz para diseño de cejas',
            'Recipiente mezclador',
            '6 Plantillas para cejas',
            '4 Cepillos para cejas',
            '4 Microbrush',
            '3 Perfiladores para delinear',
        ],
        performance: 'Hasta 90 aplicaciones totales (30 por tono)',
        relatedCategories: ['Brow Henna', 'Diseño de Cejas'],
        isFeatured: true,
    },
    {
        id: 'activador-henna',
        name: 'Activador de Henna',
        price: 100,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/activador-henna-2-2398d7caec1193296817558879257390-480-0.webp',
        category: 'Brow Henna',
        description: 'Activador líquido esencial para la preparación del polvo de henna. Contenido de 50 ml. Mezclado con el polvo de henna, permite obtener la consistencia perfecta para la aplicación.',
        specifications: [
            'Contenido: 50 ml',
            'Compatible con todos los polvos Henna J.Denis',
            'Fácil dosificación',
        ],
        relatedCategories: ['Brow Henna'],
    },
    {
        id: 'henna-directa-brown',
        name: 'Henna Directa',
        price: 370,
        image: '/products/henna-directa.png',
        category: 'Brow Henna',
        description: 'Henna de aplicación directa sin mezcla compleja. Disponible en Medium Brown, Dark Brown y Black. Fórmula lista para usar con resultados inmediatos.',
        benefits: [
            'Aplicación directa sin mezclas',
            'Disponible en 3 tonos',
            'Resultados inmediatos',
            'Fácil de usar',
        ],
        relatedCategories: ['Brow Henna'],
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
        description: 'Arco profesional para diseño y medición perfecta de cejas. Herramienta esencial para simetría y proporción en el diseño profesional.',
        specifications: [
            'Material de alta durabilidad',
            'Mediciones precisas',
            'Ideal para diseño simétrico',
        ],
        relatedCategories: ['Diseño de Cejas', 'Herramientas'],
    },
    {
        id: 'lapiz-cera',
        name: 'Lápiz de Cera',
        price: 70,
        image: '/products/lapiz-cera.png',
        category: 'Diseño de Cejas',
        description: 'Lápiz de cera profesional para delinear y diseñar cejas con precisión. Trazo suave y definido que marca el diseño deseado antes del procedimiento.',
        specifications: [
            'Trazo suave y preciso',
            'Ideal para marcar diseño',
            'Fácil de limpiar',
        ],
        relatedCategories: ['Diseño de Cejas'],
    },
    {
        id: 'laminado-cejas',
        name: 'Laminado de Cejas',
        price: 200,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/diseno-021-ca4a861d525c316b2d16669243762302-480-0.webp',
        category: 'Diseño de Cejas',
        description: 'Sistema para moldear y fijar cejas rebeldes. Logra un efecto de cejas perfectamente peinadas y disciplinadas con resultados duraderos.',
        benefits: [
            'Moldea cejas rebeldes',
            'Efecto de cejas perfectamente peinadas',
            'Fijación duradera',
            'Resultados profesionales',
        ],
        includes: [
            'Gel Planchador',
            'Gel Fijador',
            'Gel Reestructurante',
            'Cepillos para cejas',
        ],
        relatedCategories: ['Diseño de Cejas', 'Brow Henna'],
        isFeatured: true,
    },

    // ═══════════════════════════════════════════════════════════════════
    // PIGMENTOS
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'tintura-topica-castano-medio',
        name: 'Tintura Tópica - Castaño Medio',
        price: 100,
        image: '/products/tintura-castano-medio.png',
        category: 'Pigmentos',
        description: 'Tintura tópica profesional tono castaño medio para pestañas y cejas. Color natural y duradero ideal para clientas con tono de cabello medio.',
        specifications: [
            'Tono: Castaño Medio',
            'Para cejas y pestañas',
            'Fórmula profesional',
            'Larga duración',
        ],
        relatedCategories: ['Pigmentos', 'Lash Lifting'],
    },
    {
        id: 'tintura-topica-castano-oscuro',
        name: 'Tintura Tópica - Castaño Oscuro',
        price: 150,
        image: '/products/tintura-castano-oscuro.png',
        category: 'Pigmentos',
        description: 'Tintura tópica profesional tono castaño oscuro para pestañas y cejas. Color intenso y duradero ideal para clientas con tono de cabello oscuro.',
        specifications: [
            'Tono: Castaño Oscuro',
            'Color intenso y duradero',
            'Para cejas y pestañas',
            'Fórmula profesional',
        ],
        relatedCategories: ['Pigmentos', 'Lash Lifting'],
    },
    {
        id: 'pigmento-pestanas',
        name: 'Pigmento para Pestañas',
        price: 200,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/pigmento-pestanas-21-75321496155008e18a16671825880489-480-0.webp',
        category: 'Pigmentos',
        description: 'Pigmento negro puro con keratina para tinturar pestañas. Fórmula enriquecida que colorea y fortalece al mismo tiempo.',
        benefits: [
            'Color negro puro intenso',
            'Enriquecido con keratina',
            'Colorea y fortalece',
            'Resultados profesionales duraderos',
        ],
        includes: [
            'Pigmento negro con keratina',
            'Reactor para pigmento',
            'Protectores de párpados',
        ],
        relatedCategories: ['Pigmentos', 'Lash Lifting'],
    },
    {
        id: 'chocolate-pigmento-cejas',
        name: 'Chocolate Pigmento para Cejas',
        price: 200,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-4_mesa-de-trabajo-111-c242d37fa4b290473b16687990494212-1024-1024.webp',
        category: 'Pigmentos',
        description: 'Pigmento tono chocolate para cejas. Color cálido y natural que se adapta a diversos tonos de piel y cabello. Ideal para un look natural y sofisticado.',
        specifications: [
            'Tono: Chocolate',
            'Color cálido y natural',
            'Para cejas',
            'Compatible con Brow Henna',
        ],
        relatedCategories: ['Pigmentos', 'Brow Henna'],
    },

    // ═══════════════════════════════════════════════════════════════════
    // LASH CURLING - RIZADO
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'jade-rizado-pestanas',
        name: 'JADE Rizado de Pestañas',
        price: 250,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/rizado-jade-11-ac3bb9dfd4f533b09316671818885563-480-0.webp',
        category: 'Lash Curling',
        description: 'Kit completo para rizado permanente de pestañas. Sistema profesional que crea una curvatura natural y duradera en las pestañas naturales.',
        benefits: [
            'Rizado permanente natural',
            'Kit completo listo para usar',
            'Fórmula suave y segura',
            'Resultados profesionales',
        ],
        includes: [
            'Adhesivo para rizado',
            'Gel ondulante',
            'Gel neutralizante',
            'Rulos en diferentes tamaños',
            'Herramientas de aplicación',
        ],
        performance: 'Hasta 30 aplicaciones',
        relatedCategories: ['Lash Curling', 'Lash Lifting'],
        isFeatured: true,
    },
    {
        id: 'rulos-desechables-m',
        name: 'Rulos Desechables Curva Media M',
        price: 50,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-041-c63eba028c157f5cb716669736468826-1024-1024.webp',
        category: 'Lash Curling',
        description: 'Rulos desechables de curva media tamaño M. Ideales para crear una curvatura natural y elegante en pestañas de longitud media.',
        specifications: [
            'Tamaño: M (Curva Media)',
            'Desechables para máxima higiene',
            'Silicón de alta calidad',
        ],
        relatedCategories: ['Lash Curling', 'Lash Lifting'],
    },
    {
        id: 'rulos-desechables-ch',
        name: 'Rulos Desechables Curva Corta CH',
        price: 50,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-071-f0552b059105e2a53d16669736033613-1024-1024.webp',
        category: 'Lash Curling',
        description: 'Rulos desechables de curva corta tamaño CH. Ideales para pestañas cortas o para crear una curvatura más dramática.',
        specifications: [
            'Tamaño: CH (Curva Corta)',
            'Desechables para máxima higiene',
            'Ideal para pestañas cortas',
        ],
        relatedCategories: ['Lash Curling', 'Lash Lifting'],
    },
    {
        id: 'rulos-desechables-g',
        name: 'Rulos Desechables Curva Amplia G',
        price: 50,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1_mesa-de-trabajo-11-f490e5702841a57b1616669735647217-1024-1024.webp',
        category: 'Lash Curling',
        description: 'Rulos desechables de curva amplia tamaño G. Perfectos para pestañas largas o para un lifting más sutil y natural.',
        specifications: [
            'Tamaño: G (Curva Amplia)',
            'Desechables para máxima higiene',
            'Ideal para pestañas largas',
        ],
        relatedCategories: ['Lash Curling', 'Lash Lifting'],
    },
    {
        id: 'rulos-adhesivos-curva-g',
        name: 'Rulos Adhesivos Curva G',
        price: 70,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/53-rulos-adhesivos-031-2ade2563ab84da548d15314940318959-1024-1024.webp',
        category: 'Lash Curling',
        description: 'Rulos con adhesivo integrado curva G. Se adhieren directamente al párpado sin necesidad de adhesivo adicional. Reutilizables.',
        specifications: [
            'Adhesivo integrado',
            'Curva G (Amplia)',
            'Reutilizables',
            'Sin adhesivo adicional',
        ],
        relatedCategories: ['Lash Curling'],
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
        description: 'Línea premium para técnicas de abanicos 2D a 6D. Máxima ligereza y suavidad. Ideal para volumen ruso con acabado profesional impecable.',
        benefits: [
            'Ultra livianas para técnica de abanicos',
            'Compatibles con técnicas 2D a 6D',
            'Máxima suavidad y comodidad',
            'Acabado profesional natural',
        ],
        specifications: [
            'Técnica: Volumen ruso',
            'Tipo: Super Volume',
            'Material: Fibra PBT premium',
        ],
        relatedCategories: ['Extensiones', 'Adhesivos'],
    },
    {
        id: 'pestana-mink-curva-c',
        name: 'Pestañas Mink Curva C',
        price: 280,
        image: '/products/pestana-mink-curva-c.png',
        category: 'Extensiones',
        description: 'Pestañas de visón sintético de alta calidad. Curva C con acabado natural y elegante. Disponible en grosores 0.07, 0.10, 0.12, 0.15mm.',
        specifications: [
            'Curva: C',
            'Grosores: 0.07, 0.10, 0.12, 0.15mm',
            'Material: Mink sintético premium',
            'Acabado natural',
        ],
        relatedCategories: ['Extensiones', 'Adhesivos'],
    },
    {
        id: 'pestana-mink-curva-d',
        name: 'Pestañas Mink Curva D',
        price: 280,
        image: '/products/pestana-mink-curva-d.png',
        category: 'Extensiones',
        description: 'Pestañas de visón sintético de alta calidad. Curva D dramática para un efecto más abierto y llamativo.',
        specifications: [
            'Curva: D (dramática)',
            'Múltiples longitudes disponibles',
            'Material: Mink sintético premium',
            'Efecto abierto y llamativo',
        ],
        relatedCategories: ['Extensiones', 'Adhesivos'],
    },
    {
        id: 'pestana-gold-volumen',
        name: 'Pestañas Volumen Gold',
        price: 360,
        image: '/products/pestana-volumen-gold.png',
        category: 'Extensiones',
        description: 'Línea Gold premium para técnicas de volumen ruso. Ultra livianas con la mejor calidad de fibra para una aplicación perfecta.',
        benefits: [
            'Línea Gold premium',
            'Ultra livianas para volumen ruso',
            'Fibra de la más alta calidad',
            'Aplicación perfecta',
        ],
        relatedCategories: ['Extensiones', 'Adhesivos'],
    },
    {
        id: 'extensiones-grupo-pro',
        name: 'Extensiones en Grupo PRO',
        price: 360,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-21_mesa-de-trabajo-11-285849cb951c114fde15856909430891-1024-1024.webp',
        category: 'Extensiones',
        description: 'Extensiones de pestañas en grupo para aplicación profesional. Pre-formadas para una aplicación rápida y uniforme con efecto natural.',
        benefits: [
            'Pre-formadas para aplicación rápida',
            'Efecto natural y uniforme',
            'Ideal para técnica clásica avanzada',
            'Fibra de alta calidad',
        ],
        relatedCategories: ['Extensiones', 'Adhesivos'],
    },
    {
        id: 'base-pestanas',
        name: 'Base para Pestañas',
        price: 50,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/base-031-a0f3cbfe23723e3c4f16691451059225-1024-1024.webp',
        category: 'Extensiones',
        description: 'Base protectora para pestañas. Prepara las pestañas naturales antes de la aplicación de extensiones, mejorando la adherencia y protegiendo la fibra natural.',
        specifications: [
            'Prepara la pestaña natural',
            'Mejora la adherencia',
            'Protege la fibra natural',
        ],
        relatedCategories: ['Extensiones', 'Adhesivos'],
    },

    // ═══════════════════════════════════════════════════════════════════
    // ADHESIVOS
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'adhesivo-supreme-g4',
        name: 'Adhesivo Supreme G4',
        price: 450,
        image: '/products/adhesivo-supreme-g4.png',
        category: 'Adhesivos',
        description: 'Adhesivo de alta viscosidad y secado rápido (1-2 seg). Ideal para técnica clásica y volumen. Duración de 6 a 8 semanas con cuidado adecuado.',
        benefits: [
            'Secado rápido 1-2 segundos',
            'Alta viscosidad para control perfecto',
            'Duración 6-8 semanas',
            'Hipoalergénico',
        ],
        specifications: [
            'Secado: 1-2 segundos',
            'Duración: 6-8 semanas',
            'Para técnica clásica y volumen',
            'Color: Negro',
        ],
        relatedCategories: ['Adhesivos', 'Extensiones'],
    },
    {
        id: 'adhesivo-volumen',
        name: 'Adhesivo Volumen',
        price: 250,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/vol_mesa-de-trabajo-11-d61661ecf8820a785a16669241686028-480-0.webp',
        category: 'Adhesivos',
        description: 'Adhesivo Supreme para técnica de Volumen. Secado instantáneo, color negro intenso. Ideal para volumen 1 a 1, técnica japonesa, volumen ruso y pestañas dimensionales.',
        benefits: [
            'Tiempo de secado instantáneo',
            'Color negro intenso profesional',
            'Alta resistencia al agua y humedad',
            'Larga duración',
            'Hipoalergénico para ojos sensibles',
            'Textura de consistencia media',
        ],
        includes: [
            'Presentación de 8 ml',
        ],
        specifications: [
            'Ingrediente principal: Ethyl-2-Cyanocrylate (grado médico)',
            'Alcoxi-2-cianoacrilato para flexibilidad',
            'PMMA para control de fijación',
            'Negro de carbón 100% seguro',
        ],
        relatedCategories: ['Adhesivos', 'Extensiones'],
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
        description: 'Tratamiento post-procedimiento para el cuidado y recuperación de pestañas y cejas. Hidrata, fortalece y protege la fibra natural después de cualquier procedimiento.',
        benefits: [
            'Hidrata profundamente',
            'Fortalece las pestañas naturales',
            'Protege después del procedimiento',
            'Uso diario recomendado',
        ],
        relatedCategories: ['Tratamientos', 'Lash Lifting'],
    },
    {
        id: 'mascara-acondicionadora',
        name: 'Máscara Acondicionadora de Pestañas',
        price: 120,
        image: '/products/mascara-acondicionadora.png',
        category: 'Tratamientos',
        description: 'Máscara acondicionadora que fortalece, nutre y alarga las pestañas naturales. Uso diario recomendado para resultados óptimos.',
        benefits: [
            'Fortalece las pestañas',
            'Nutre desde la raíz',
            'Efecto alargador',
            'Uso diario',
        ],
        relatedCategories: ['Tratamientos'],
    },
    {
        id: 'tratamiento-alargador',
        name: 'Tratamiento Alargador para Cejas y Pestañas',
        price: 150,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/vitamina-011-556c65fa50decd1e2a15494016039704-480-0.webp',
        category: 'Tratamientos',
        description: 'Reestructura, fortalece y alarga las pestañas y cejas en tan solo 4 semanas de uso continuo. Fórmula vitaminada para resultados visibles.',
        benefits: [
            'Resultados visibles en 4 semanas',
            'Reestructura la fibra capilar',
            'Fortalece pestañas y cejas',
            'Fórmula vitaminada',
        ],
        performance: 'Resultados visibles en 4 semanas',
        relatedCategories: ['Tratamientos'],
        isFeatured: true,
    },

    // ═══════════════════════════════════════════════════════════════════
    // HERRAMIENTAS
    // ═══════════════════════════════════════════════════════════════════
    {
        id: 'perfilador-doble',
        name: 'Perfilador Doble - Paquete de 3 Pzs',
        price: 150,
        image: '/products/perfilador-doble.png',
        category: 'Herramientas',
        description: 'Perfilador doble de precisión. Paquete de 3 piezas para diseño y definición profesional de cejas. Doble punta para versatilidad.',
        specifications: [
            'Paquete de 3 piezas',
            'Doble punta',
            'Para diseño profesional',
        ],
        relatedCategories: ['Herramientas', 'Diseño de Cejas'],
    },
    {
        id: 'godete-cristal',
        name: 'Godete de Cristal',
        price: 295,
        image: '/products/godete-cristal.png',
        category: 'Herramientas',
        description: 'Godete de cristal profesional para mezclas de pigmentos, tintes y adhesivos. Superficie lisa y fácil de limpiar. Ideal para trabajar con precisión.',
        specifications: [
            'Cristal transparente de alta calidad',
            'Superficie ultra lisa',
            'Fácil limpieza y desinfección',
            'Para mezclas de pigmentos y tintes',
        ],
        relatedCategories: ['Herramientas'],
    },
    {
        id: 'piedra-jade',
        name: 'Piedra de Jade',
        price: 80,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/piedra-jade-011-d010fed6068f57234f15494015022538-1024-1024.webp',
        category: 'Herramientas',
        description: 'Piedra de jade natural para depositar adhesivo durante la aplicación de extensiones de pestañas. Mantiene la temperatura del adhesivo estable.',
        specifications: [
            'Jade natural',
            'Mantiene temperatura estable del adhesivo',
            'Superficie fría y lisa',
            'Tamaño ergonómico',
        ],
        relatedCategories: ['Herramientas', 'Adhesivos'],
    },
    {
        id: 'maniqui-microblading',
        name: 'Maniquí Microblading',
        price: 300,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/h64fbe6378cc249cd88ae27bcf74d9993y1-108b75012dae3f992515856923521717-1024-1024.webp',
        category: 'Herramientas',
        description: 'Maniquí de práctica para perfeccionar la técnica de microblading. Piel realista para entrenar trazos y técnica antes de trabajar con clientes.',
        benefits: [
            'Piel realista para práctica',
            'Ideal para perfeccionar técnica',
            'Reutilizable',
            'Para principiantes y avanzados',
        ],
        relatedCategories: ['Herramientas', 'Microblading'],
    },
    {
        id: 'papel-termico',
        name: 'Papel Térmico',
        price: 35,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/papel-termico-1-cf28baf56f9440056117582324679872-1024-1024.webp',
        category: 'Herramientas',
        description: 'Papel térmico para citas y recibos. Rollo compatible con impresoras térmicas estándar.',
        specifications: [
            'Compatible con impresoras térmicas',
            'Rollo estándar',
        ],
        relatedCategories: ['Herramientas'],
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
        description: 'Lámpara profesional LED de media luna con luz ajustable. Ideal para trabajo de precisión en extensiones de pestañas y procedimientos estéticos.',
        benefits: [
            'Luz LED ajustable en intensidad',
            'Diseño ergonómico media luna',
            'Iluminación sin sombras',
            'Para trabajo de precisión',
        ],
        specifications: [
            'Tipo: LED',
            'Forma: Media Luna',
            'Intensidad ajustable',
            'Bajo consumo energético',
        ],
        relatedCategories: ['Accesorios'],
    },
    {
        id: 'compass-silver-ratio',
        name: 'Compass Silver Ratio',
        price: 1270,
        image: '/products/compass-silver-ratio.png',
        category: 'Accesorios',
        description: 'Compás de proporción áurea para mediciones precisas en micropigmentación y diseño de cejas. Herramienta premium de acero inoxidable.',
        specifications: [
            'Material: Acero inoxidable',
            'Proporción áurea integrada',
            'Para micropigmentación y diseño',
            'Calidad premium',
        ],
        relatedCategories: ['Accesorios', 'Diseño de Cejas'],
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
        description: 'Limpieza profunda de párpados y pestañas. Esencial para la asepsia y retención de extensiones. Espuma suave que no irrita.',
        benefits: [
            'Limpieza profunda sin irritar',
            'Mejora la retención de extensiones',
            'Espuma suave',
            'Para uso diario',
        ],
        relatedCategories: ['Higiene', 'Extensiones'],
    },
    {
        id: 'agua-micelar',
        name: 'Agua Micelar J.Denis',
        price: 75,
        image: '/products/agua-micelar.png',
        category: 'Higiene',
        description: 'Remoción suave de maquillaje sin comprometer la barrera cutánea. Apto para pieles sensibles. Fórmula suave y efectiva.',
        benefits: [
            'Remoción suave de maquillaje',
            'No compromete la barrera cutánea',
            'Apto para pieles sensibles',
            'Sin alcohol',
        ],
        relatedCategories: ['Higiene'],
    },
    {
        id: 'tonificante-desinfectante',
        name: 'Tonificante Desinfectante',
        price: 90,
        image: '/products/tonificante-desinfectante.png',
        category: 'Higiene',
        description: 'Sanitizante de amplio espectro. Bactericida y viricida para piel y herramientas de trabajo. Esencial para la higiene profesional.',
        specifications: [
            'Bactericida y viricida',
            'Para piel y herramientas',
            'Amplio espectro',
            'Uso profesional',
        ],
        relatedCategories: ['Higiene'],
    },
    {
        id: 'limpiador-impurezas',
        name: 'Limpiador de Impurezas - Piel Mixta y Grasa',
        price: 90,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/limpiador-de-impurezas-piel-mixta-y-piel-grasa-0e0ffdaf9bc06584a917561449421922-1024-1024.webp',
        category: 'Higiene',
        description: 'Limpiador especializado para pieles mixtas y grasas. Elimina impurezas y exceso de grasa preparando la piel para procedimientos de cejas y pestañas.',
        benefits: [
            'Especial para piel mixta y grasa',
            'Elimina impurezas profundamente',
            'Prepara la piel para procedimientos',
            'No reseca la piel',
        ],
        relatedCategories: ['Higiene'],
    },

    // ═══════════════════════════════════════════════════════════════════
    // PRODUCTOS ADICIONALES - PÁGINAS 2-10
    // ═══════════════════════════════════════════════════════════════════

    // --- Lash Lifting Extras ---
    { id: 'pad-curva-c', name: 'Pad Curva C', price: 150, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-480-0.webp', category: 'Lash Lifting', description: 'Pad de silicón con curva C para lash lifting. Diseño que proporciona una curvatura dramática y definida.', relatedCategories: ['Lash Lifting'] },
    { id: 'pad-rosa-sin-canales', name: 'Pad Rosa sin Canales', price: 150, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-480-0.webp', category: 'Lash Lifting', description: 'Pad rosa liso sin canales para lash lifting con acabado suave.', relatedCategories: ['Lash Lifting'] },
    { id: 'pad-superior-inferior', name: 'Pad Superior e Inferior', price: 150, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-480-0.webp', category: 'Lash Lifting', description: 'Set de pads para párpado superior e inferior. Cobertura completa para lifting profesional.', relatedCategories: ['Lash Lifting'] },
    { id: 'pad-colors-8p', name: 'Pad Colors 8p', price: 150, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-480-0.webp', category: 'Lash Lifting', description: 'Set de 8 pads de colores para lash lifting. Variedad de tamaños y curvaturas.', relatedCategories: ['Lash Lifting'] },
    { id: 'pad-colors-6p', name: 'Pad Colors 6p', price: 150, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-480-0.webp', category: 'Lash Lifting', description: 'Set de 6 pads de colores para lash lifting.', relatedCategories: ['Lash Lifting'] },
    { id: 'pad-oso', name: 'Pad Oso', price: 250, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-480-0.webp', category: 'Lash Lifting', description: 'Pad con forma de oso para lash lifting. Diseño único que facilita la separación de pestañas.', relatedCategories: ['Lash Lifting'] },
    { id: 'pad-corrector-reversion', name: 'Pad Corrector (Reversión)', price: 300, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-480-0.webp', category: 'Lash Lifting', description: 'Pad especial para corrección y reversión de lifting. Ideal para corregir curvaturas no deseadas.', relatedCategories: ['Lash Lifting'] },
    { id: 'pad-2-en-1', name: 'Pad 2 en 1', price: 150, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-480-0.webp', category: 'Lash Lifting', description: 'Pad versátil 2 en 1 para lash lifting con doble funcionalidad.', relatedCategories: ['Lash Lifting'] },
    { id: 'pad-mariposa', name: 'Pad Mariposa', price: 150, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-480-0.webp', category: 'Lash Lifting', description: 'Pad con forma de mariposa para un lifting con efecto abierto y natural.', relatedCategories: ['Lash Lifting'] },
    { id: 'pad-elevacion-l', name: 'Pad Elevación L', price: 250, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-480-0.webp', category: 'Lash Lifting', description: 'Pad de elevación L para lifting con máxima curvatura y apertura.', relatedCategories: ['Lash Lifting'] },
    { id: 'pad-ld-simetricos', name: 'Pad LD Simétricos', price: 250, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-480-0.webp', category: 'Lash Lifting', description: 'Pads LD simétricos para lifting uniforme y equilibrado.', relatedCategories: ['Lash Lifting'] },
    { id: 'pro-lash-lifting', name: 'PRO Lash Lifting', price: 385, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp', category: 'Lash Lifting', description: 'Kit PRO de lash lifting con fórmula mejorada para resultados profesionales superiores.', relatedCategories: ['Lash Lifting'] },
    { id: 'adhesivo-individual-pads', name: 'Adhesivo Individual para Pads - Lifting', price: 60, image: '/products/adhesivo-pads-lifting.png', category: 'Lash Lifting', description: 'Adhesivo individual para pads de lifting. Fijación precisa y segura.', relatedCategories: ['Lash Lifting'] },
    { id: 'lifting-tool-espatula', name: 'Lifting Tool - Espátula Elevadora', price: 100, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Lash Lifting', description: 'Espátula elevadora profesional para lifting de pestañas.', relatedCategories: ['Lash Lifting', 'Herramientas'] },
    { id: 'lash-tool-2en1', name: 'Lash Tool 2 en 1', price: 50, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Lash Lifting', description: 'Herramienta 2 en 1 para lifting de pestañas.', relatedCategories: ['Lash Lifting', 'Herramientas'] },
    { id: 'reestructurante-lifting', name: 'Reestructurante Lifting', price: 60, image: '/products/crema-lifting-paso1.png', category: 'Lash Lifting', description: 'Reestructurante para uso en procedimientos de lifting de pestañas.', relatedCategories: ['Lash Lifting', 'Tratamientos'] },
    { id: 'locion-limpiadora-lifting', name: 'Loción Limpiadora Lifting', price: 60, image: '/products/crema-lifting-paso1.png', category: 'Lash Lifting', description: 'Loción limpiadora especializada para procedimientos de lifting.', relatedCategories: ['Lash Lifting', 'Higiene'] },
    { id: 'locion-vitaminada', name: 'Loción Vitaminada', price: 60, image: '/products/crema-lifting-paso1.png', category: 'Lash Lifting', description: 'Loción vitaminada nutritiva para tratamiento post-lifting.', relatedCategories: ['Lash Lifting', 'Tratamientos'] },
    { id: 'mini-cepillo-laminado', name: 'Mini Cepillo para Laminado', price: 50, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Lash Lifting', description: 'Mini cepillo especializado para procedimientos de laminado.', relatedCategories: ['Lash Lifting'] },
    { id: 'mini-cepillo-lash-lifting', name: 'Mini Cepillo para Lash Lifting', price: 50, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Lash Lifting', description: 'Mini cepillo para aplicación precisa en lash lifting.', relatedCategories: ['Lash Lifting'] },
    { id: '50-cepillo-mini-laminado', name: '50 Cepillo Mini para Laminado', price: 300, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Lash Lifting', description: 'Pack de 50 mini cepillos para laminado. Uso desechable y profesional.', relatedCategories: ['Lash Lifting'] },
    { id: 'cisteamina-lash-brows', name: 'Cisteamina Lash & Brows', price: 1800, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp', category: 'Lash Lifting', description: 'Fórmula avanzada de cisteamina para lash lifting y laminado de cejas. Tecnología de última generación.', relatedCategories: ['Lash Lifting', 'Diseño de Cejas'] },
    { id: 'laminado-cisteamina-est', name: 'Laminado Cisteamina Estabilizada', price: 1500, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp', category: 'Lash Lifting', description: 'Kit de laminado con cisteamina estabilizada. Resultados duraderos y seguros.', relatedCategories: ['Lash Lifting'] },
    { id: 'shot-hidratante-15', name: '1.5 Shot Hidratante', price: 650, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp', category: 'Tratamientos', description: 'Shot hidratante concentrado para nutrición intensiva de pestañas y cejas.', relatedCategories: ['Tratamientos', 'Lash Lifting'] },

    // --- Lash Curling Extras ---
    { id: 'rulos-adhesivos-m-ch', name: 'Rulos Adhesivos Curva M/CH', price: 70, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/53-rulos-adhesivos-031-2ade2563ab84da548d15314940318959-480-0.webp', category: 'Lash Curling', description: 'Rulos con adhesivo integrado curva M/CH para rizado de pestañas.', relatedCategories: ['Lash Curling'] },

    // --- Extensiones Extras ---
    { id: 'curva-b-010-combo', name: 'Curva B | 0.10 | Mixta', price: 350, image: '/products/pestana-mink-curva-c.png', category: 'Extensiones', description: 'Extensiones curva B grosor 0.10 en presentación mixta.', relatedCategories: ['Extensiones'] },
    { id: 'curva-c-010-combo', name: 'Curva C | 0.10 | Mixta', price: 350, image: '/products/pestana-mink-curva-c.png', category: 'Extensiones', description: 'Extensiones curva C grosor 0.10 en presentación mixta.', relatedCategories: ['Extensiones'] },
    { id: 'curva-l-010-combo', name: 'Curva L | 0.10 | Mixta', price: 350, image: '/products/pestana-mink-curva-c.png', category: 'Extensiones', description: 'Extensiones curva L grosor 0.10 en presentación mixta.', relatedCategories: ['Extensiones'] },
    { id: 'curva-l-015-combo', name: 'Curva L | 0.15 | Mixta', price: 350, image: '/products/pestana-mink-curva-c.png', category: 'Extensiones', description: 'Extensiones curva L grosor 0.15 en presentación mixta.', relatedCategories: ['Extensiones'] },
    { id: 'curva-lc-010-combo', name: 'Curva LC | 0.10 | Mixta', price: 350, image: '/products/pestana-mink-curva-c.png', category: 'Extensiones', description: 'Extensiones curva LC grosor 0.10 en presentación mixta.', relatedCategories: ['Extensiones'] },
    { id: 'curva-lc-015-combo', name: 'Curva LC | 0.15 | Mixta', price: 350, image: '/products/pestana-mink-curva-c.png', category: 'Extensiones', description: 'Extensiones curva LC grosor 0.15 en presentación mixta.', relatedCategories: ['Extensiones'] },
    { id: 'curva-cc-015-combo', name: 'Curva CC | 0.15 | Combo', price: 350, image: '/products/pestana-mink-curva-c.png', category: 'Extensiones', description: 'Extensiones curva CC grosor 0.15 combo de 7 a 15mm.', relatedCategories: ['Extensiones'] },
    { id: 'easy-fan-curva-c', name: 'Easy Fan Curva C | Mixta', price: 380, image: '/products/pestana-mink-curva-c.png', category: 'Extensiones', description: 'Extensiones Easy Fan curva C en presentación mixta. Apertura fácil para abanicos.', relatedCategories: ['Extensiones'] },
    { id: 'easy-fan-curva-d-005', name: 'Easy Fan Curva D | 0.05 | Mixta', price: 380, image: '/products/pestana-mink-curva-d.png', category: 'Extensiones', description: 'Extensiones Easy Fan curva D grosor 0.05 mixta.', relatedCategories: ['Extensiones'] },
    { id: 'easy-fan-curva-d-007', name: 'Easy Fan Curva D | 0.07 | Mixta', price: 380, image: '/products/pestana-mink-curva-d.png', category: 'Extensiones', description: 'Extensiones Easy Fan curva D grosor 0.07 mixta.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-3d-c-007', name: 'Abanicos | 3D | Curva C | 0.07 | Mixta', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos pre-hechos 3D curva C grosor 0.07 mixta.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-2d-b-015-10', name: 'Abanicos | 2D | Curva B | 0.15 | 10mm', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 2D curva B grosor 0.15 largo 10mm.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-2d-b-015-12', name: 'Abanicos | 2D | Curva B | 0.15 | 12mm', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 2D curva B grosor 0.15 largo 12mm.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-2d-c-015-10', name: 'Abanicos | 2D | Curva C | 0.15 | 10mm', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 2D curva C grosor 0.15 largo 10mm.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-2d-j-015-10', name: 'Abanicos | 2D | Curva J | 0.15 | 10mm', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 2D curva J grosor 0.15 largo 10mm.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-2d-j-015-12', name: 'Abanicos | 2D | Curva J | 0.15 | 12mm', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 2D curva J grosor 0.15 largo 12mm.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-4d-b-015-10', name: 'Abanicos | 4D | Curva B | 0.15 | 10mm', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 4D curva B grosor 0.15 largo 10mm.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-4d-b-015-12', name: 'Abanicos | 4D | Curva B | 0.15 | 12mm', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 4D curva B grosor 0.15 largo 12mm.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-4d-c-005', name: 'Abanicos | 4D | Curva C | 0.05 | Mixta', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 4D curva C grosor 0.05 mixta.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-4d-c-007', name: 'Abanicos | 4D | Curva C | 0.07 | Mixta', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 4D curva C grosor 0.07 mixta.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-4d-d-005', name: 'Abanicos | 4D | Curva D | 0.05 | Mixta', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 4D curva D grosor 0.05 mixta.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-4d-d-007', name: 'Abanicos | 4D | Curva D | 0.07 | Mixta', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 4D curva D grosor 0.07 mixta.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-5d-b-015-10', name: 'Abanicos | 5D | Curva B | 0.15 | 10mm', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 5D curva B grosor 0.15 largo 10mm.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-5d-j-015-10', name: 'Abanicos | 5D | Curva J | 0.15 | 10mm', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 5D curva J grosor 0.15 largo 10mm.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-5d-c-005', name: 'Abanicos | 5D | Curva C | 0.05 | Mixta', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 5D curva C grosor 0.05 mixta.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-5d-c-007', name: 'Abanicos | 5D | Curva C | 0.07 | Mixta', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 5D curva C grosor 0.07 mixta.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-5d-d-005', name: 'Abanicos | 5D | Curva D | 0.05 | Mixta', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 5D curva D grosor 0.05 mixta.', relatedCategories: ['Extensiones'] },
    { id: 'abanicos-5d-d-007', name: 'Abanicos | 5D | Curva D | 0.07 | Mixta', price: 350, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Abanicos 5D curva D grosor 0.07 mixta.', relatedCategories: ['Extensiones'] },
    { id: 'pestana-c-colores', name: 'Pestaña (C) en Colores', price: 600, image: '/products/pestana-mink-curva-c.png', category: 'Extensiones', description: 'Extensiones curva C en colores variados para looks creativos.', relatedCategories: ['Extensiones'] },
    { id: 'pestana-d-colores', name: 'Pestaña (D) en Colores', price: 600, image: '/products/pestana-mink-curva-d.png', category: 'Extensiones', description: 'Extensiones curva D en colores variados para looks creativos.', relatedCategories: ['Extensiones'] },
    { id: 'pestana-grupo-racimo', name: 'Pestañas en Grupo o Racimo', price: 32, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Pestañas en grupo o racimo para aplicación rápida y efecto natural.', relatedCategories: ['Extensiones'] },
    { id: 'pestana-grupo-racimo-azul', name: 'Pestañas en Grupo o Racimo Azul', price: 22, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Pestañas en grupo color azul para looks creativos.', relatedCategories: ['Extensiones'] },
    { id: 'pestana-grupo-racimo-cafe', name: 'Pestañas en Grupo o Racimo Café', price: 22, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Pestañas en grupo color café para un look natural.', relatedCategories: ['Extensiones'] },
    { id: 'modelos-de-curvas', name: 'Modelos de Curvas', price: 880, image: '/products/pestana-mink-curva-c.png', category: 'Extensiones', description: 'Set de modelos de curvas para demostración y práctica profesional.', relatedCategories: ['Extensiones'] },
    { id: 'pestana-practica', name: 'Pestaña para Práctica', price: 55, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Pestañas especiales para práctica de técnicas de extensiones.', relatedCategories: ['Extensiones'] },
    { id: 'pestana-individual-negra', name: 'Pestaña Individual (Negra)', price: 25, image: '/products/pestana-super-volume.png', category: 'Extensiones', description: 'Pestañas individuales color negro para aplicación pelo a pelo.', relatedCategories: ['Extensiones'] },

    // --- Pestañas en Tira ---
    { id: 'pestana-americana-tira', name: 'Pestaña Americana de Tira', price: 20, image: '/products/pestana-super-volume.png', category: 'Pestañas en Tira', description: 'Pestaña americana de tira. Disponible en múltiples modelos (001, 005, 012, 015, 020, 038, 042, 046, 503, 505, 507, 600, 606, 747M, 747S, 747XS, 107).', relatedCategories: ['Pestañas en Tira'] },
    { id: 'pestana-europea-tira', name: 'Pestaña Europea de Tira', price: 25, image: '/products/pestana-super-volume.png', category: 'Pestañas en Tira', description: 'Pestaña europea de tira J.Eyelash. Modelos 22-78 disponibles. Fibra suave de alta calidad.', relatedCategories: ['Pestañas en Tira'] },
    { id: 'pestana-decorada-tira', name: 'Pestaña Decorada de Tira', price: 20, image: '/products/pestana-super-volume.png', category: 'Pestañas en Tira', description: 'Pestañas decoradas para looks artísticos y eventos especiales. Múltiples modelos disponibles.', relatedCategories: ['Pestañas en Tira'] },

    // --- Adhesivos Extras ---
    { id: 'adhesivo-balsamo-20gr', name: 'Adhesivo Bálsamo 20 gr', price: 260, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/vol_mesa-de-trabajo-11-d61661ecf8820a785a16669241686028-480-0.webp', category: 'Adhesivos', description: 'Adhesivo bálsamo de 20 gramos. Fórmula suave ideal para pieles sensibles.', relatedCategories: ['Adhesivos', 'Extensiones'] },
    { id: 'adhesivo-balsamo-butter-30gr', name: 'Adhesivo Bálsamo Butter 30 gr', price: 380, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/vol_mesa-de-trabajo-11-d61661ecf8820a785a16669241686028-480-0.webp', category: 'Adhesivos', description: 'Adhesivo bálsamo Butter 30 gramos. Textura cremosa para mejor control.', relatedCategories: ['Adhesivos', 'Extensiones'] },

    // --- Pigmentos Extras ---
    { id: 'tintura-topica-negro', name: 'Tintura Tópica - Negro', price: 350, image: '/products/tintura-castano-oscuro.png', category: 'Pigmentos', description: 'Tintura tópica profesional tono negro para cejas y pestañas. Color intenso y duradero.', relatedCategories: ['Pigmentos'] },
    { id: 'sellador-tintura-topica', name: 'Sellador para Tintura Tópica', price: 350, image: '/products/tintura-castano-oscuro.png', category: 'Pigmentos', description: 'Sellador complementario para tintura tópica. Fija el color y prolonga duración.', relatedCategories: ['Pigmentos'] },
    { id: 'activador-tintura-topica', name: 'Activador para Tintura Tópica', price: 350, image: '/products/tintura-castano-oscuro.png', category: 'Pigmentos', description: 'Activador para tintura tópica. Necesario para la reacción de tinción.', relatedCategories: ['Pigmentos'] },
    { id: 'reestructurante-pigmento', name: 'Reestructurante Pigmento para Cejas y Pestañas', price: 60, image: '/products/tintura-castano-oscuro.png', category: 'Pigmentos', description: 'Reestructurante para uso con pigmentos en cejas y pestañas.', relatedCategories: ['Pigmentos', 'Tratamientos'] },

    // --- Brow Henna Extras ---
    { id: 'henna-directa-2', name: 'Henna Directa', price: 370, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/brow-henna-061-fbdb257619cce9e95d16669249148944-480-0.webp', category: 'Brow Henna', description: 'Henna directa disponible en Castaño Medio y Castaño Obscuro.', relatedCategories: ['Brow Henna'] },
    { id: 'mezclador-henna', name: 'Mezclador de Henna', price: 180, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/brow-henna-061-fbdb257619cce9e95d16669249148944-480-0.webp', category: 'Brow Henna', description: 'Mezclador profesional para preparación de henna.', relatedCategories: ['Brow Henna', 'Herramientas'] },
    { id: 'plantillas-cejas', name: 'Plantillas para Cejas', price: 120, image: '/products/arco-diseno-cejas.png', category: 'Diseño de Cejas', description: 'Set de plantillas para diseño de cejas. Múltiples modelos disponibles.', relatedCategories: ['Diseño de Cejas', 'Brow Henna'] },

    // --- Herramientas Extras ---
    { id: 'cepillos-pestanas-50', name: 'Cepillos para Pestañas con 50 pzas', price: 80, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Pack de 50 cepillos desechables para pestañas.', relatedCategories: ['Herramientas'] },
    { id: 'cepillo-largo-100', name: 'Cepillo Largo para Pestañas 100 piezas', price: 260, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Pack de 100 cepillos largos para pestañas.', relatedCategories: ['Herramientas'] },
    { id: 'cepillo-con-guarda', name: 'Cepillo con Guarda', price: 85, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Cepillo para pestañas con guarda protectora.', relatedCategories: ['Herramientas'] },
    { id: '50-cepillos-pestanas', name: '50 Cepillos para Pestañas', price: 80, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Pack de 50 cepillos para pestañas uso profesional.', relatedCategories: ['Herramientas'] },
    { id: 'contenedor-mini-base', name: 'Contenedor Mini para Base', price: 15, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/base-031-a0f3cbfe23723e3c4f16691451059225-480-0.webp', category: 'Herramientas', description: 'Contenedor mini para depositar base de adhesivo.', relatedCategories: ['Herramientas', 'Extensiones'] },
    { id: 'contenedor-anillo-50', name: 'Contenedor para Anillo con 50 pzas', price: 50, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/base-031-a0f3cbfe23723e3c4f16691451059225-480-0.webp', category: 'Herramientas', description: 'Pack de 50 contenedores para anillo de adhesivo.', relatedCategories: ['Herramientas', 'Extensiones'] },
    { id: 'regla-metalica', name: 'Regla Metálica', price: 420, image: '/products/arco-diseno-cejas.png', category: 'Herramientas', description: 'Regla metálica profesional para mediciones precisas.', relatedCategories: ['Herramientas', 'Diseño de Cejas'] },
    { id: 'espejo-auxiliar-g', name: 'Espejo Auxiliar G', price: 200, image: '/products/arco-diseno-cejas.png', category: 'Herramientas', description: 'Espejo auxiliar tamaño G para verificación de trabajo.', relatedCategories: ['Herramientas'] },
    { id: 'pinza-pestanas-tira', name: 'Pinza para Pestañas de Tira', price: 100, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Pinza especializada para colocación de pestañas en tira.', relatedCategories: ['Herramientas', 'Pestañas en Tira'] },
    { id: 'pinza-depilar', name: 'Pinza para Depilar', price: 150, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Pinza profesional para depilación de cejas.', relatedCategories: ['Herramientas', 'Diseño de Cejas'] },
    { id: 'pinza-punta-larga', name: 'Pinza Punta Larga', price: 150, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Pinza con punta larga para extensiones de pestañas.', relatedCategories: ['Herramientas', 'Extensiones'] },
    { id: 'pinza-abanicos-sin-punta', name: 'Pinza Abanicos sin Punta', price: 100, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Pinza para crear abanicos sin punta. Ideal para técnica de volumen.', relatedCategories: ['Herramientas', 'Extensiones'] },
    { id: 'pinza-punta-m12', name: 'Pinza Punta M-12', price: 150, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Pinza punta M-12 para extensiones de pestañas.', relatedCategories: ['Herramientas', 'Extensiones'] },
    { id: 'pinza-colocar-m18', name: 'Pinza para Colocar M-18', price: 150, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Pinza para colocar extensiones M-18.', relatedCategories: ['Herramientas', 'Extensiones'] },
    { id: 'pinza-ele-m19', name: 'Pinza Ele M-19', price: 140, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Pinza Ele M-19 para técnica de extensiones.', relatedCategories: ['Herramientas', 'Extensiones'] },
    { id: 'pinza-md14-punta', name: 'Pinza MD 14 en Punta', price: 200, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Pinza MD 14 con punta precisa para extensiones.', relatedCategories: ['Herramientas', 'Extensiones'] },
    { id: 'pinza-md14-ele', name: 'Pinza MD 14 en Ele', price: 200, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Pinza MD 14 en forma de Ele.', relatedCategories: ['Herramientas', 'Extensiones'] },
    { id: 'set-6-pinzas-tijera', name: 'Set 6 Pinzas y Tijera', price: 650, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Set completo de 6 pinzas profesionales y tijera para extensiones.', relatedCategories: ['Herramientas', 'Extensiones'] },
    { id: 'set-5-pinceles', name: 'Set 5 Pinceles', price: 350, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Set de 5 pinceles profesionales para diseño de cejas y aplicación.', relatedCategories: ['Herramientas', 'Diseño de Cejas'] },
    { id: 'regla-curva-plastica', name: 'Regla Curva Plástica para Diseño', price: 65, image: '/products/arco-diseno-cejas.png', category: 'Herramientas', description: 'Regla curva plástica para diseño preciso de cejas.', relatedCategories: ['Herramientas', 'Diseño de Cejas'] },
    { id: 'peine-separador', name: 'Peine Separador de Pestañas', price: 80, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Peine separador profesional para pestañas.', relatedCategories: ['Herramientas', 'Extensiones'] },
    { id: 'funda-pinza', name: 'Funda para Pinza', price: 30, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Funda protectora para pinzas de extensiones.', relatedCategories: ['Herramientas'] },
    { id: 'microbrush-100pz', name: 'Microbrush de 100 pz', price: 80, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Pack de 100 microbrush para aplicaciones de precisión.', relatedCategories: ['Herramientas'] },
    { id: '100-microbrush-largo', name: '100 Microbrush Largo', price: 90, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-480-0.webp', category: 'Herramientas', description: 'Pack de 100 microbrush largos para procedimientos profesionales.', relatedCategories: ['Herramientas'] },
    { id: 'repuesto-maniqui-microblading', name: 'Repuesto de Maniquí para Microblading', price: 185, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/h64fbe6378cc249cd88ae27bcf74d9993y1-108b75012dae3f992515856923521717-480-0.webp', category: 'Herramientas', description: 'Repuesto de piel para maniquí de práctica de microblading.', relatedCategories: ['Herramientas', 'Microblading'] },
    { id: 'medidor-humedad', name: 'Medidor de Humedad', price: 250, image: '/products/arco-diseno-cejas.png', category: 'Herramientas', description: 'Medidor de humedad ambiental para control de condiciones óptimas en procedimientos.', relatedCategories: ['Herramientas'] },

    // --- Diseño de Cejas Extras ---
    { id: 'gel-fijador-cejas', name: 'Gel Fijador para Diseño de Cejas', price: 50, image: '/products/arco-diseno-cejas.png', category: 'Diseño de Cejas', description: 'Gel fijador profesional para diseño de cejas. Mantiene la forma del diseño.', relatedCategories: ['Diseño de Cejas'] },
    { id: 'gel-reestructurante-cejas', name: 'Gel Reestructurante para Diseño de Cejas', price: 60, image: '/products/arco-diseno-cejas.png', category: 'Diseño de Cejas', description: 'Gel reestructurante para diseño de cejas. Nutre y da forma.', relatedCategories: ['Diseño de Cejas'] },
    { id: 'stencil-cejas', name: 'Stencil para Cejas', price: 50, image: '/products/arco-diseno-cejas.png', category: 'Diseño de Cejas', description: 'Stencil profesional para diseño rápido y simétrico de cejas.', relatedCategories: ['Diseño de Cejas'] },
    { id: 'delineador-pencil', name: 'Delineador Pencil', price: 40, image: '/products/arco-diseno-cejas.png', category: 'Diseño de Cejas', description: 'Delineador tipo pencil disponible en 4 tonos para diseño de cejas.', relatedCategories: ['Diseño de Cejas'] },

    // --- Higiene Extras ---
    { id: 'limpiador-piel-normal-seca', name: 'Limpiador de Impurezas Piel Normal y Seca', price: 90, image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/limpiador-de-impurezas-piel-mixta-y-piel-grasa-0e0ffdaf9bc06584a917561449421922-480-0.webp', category: 'Higiene', description: 'Limpiador de impurezas para piel normal y seca. Prepara la piel sin resecar.', relatedCategories: ['Higiene'] },
    { id: 'mica-cubre-boca', name: 'Mica Cubre Boca', price: 50, image: '/products/tonificante-desinfectante.png', category: 'Higiene', description: 'Mica transparente cubre boca para protección durante procedimientos.', relatedCategories: ['Higiene'] },
    { id: 'guantes-nitrilo', name: 'Guantes de Nitrilo', price: 390, image: '/products/tonificante-desinfectante.png', category: 'Higiene', description: 'Guantes de nitrilo profesional. Disponible en talla chica, mediana y grande.', relatedCategories: ['Higiene'] },

    // --- Accesorios Extras ---
    { id: 'pulsera-base-medidas', name: 'Pulsera Base con Medidas', price: 100, image: '/products/compass-silver-ratio.png', category: 'Accesorios', description: 'Pulsera con base y medidas para apoyo durante procedimientos de extensiones.', relatedCategories: ['Accesorios', 'Extensiones'] },
    { id: 'fijador-maquillaje', name: 'Fijador de Maquillaje', price: 50, image: '/products/lash-shampoo.png', category: 'Accesorios', description: 'Fijador de maquillaje en spray para prolongar la duración del maquillaje.', relatedCategories: ['Accesorios'] },
    { id: 'cinta-adhesiva-colores', name: 'Cinta Adhesiva (Colores)', price: 50, image: '/products/lash-shampoo.png', category: 'Accesorios', description: 'Cinta adhesiva en colores para protección durante procedimientos.', relatedCategories: ['Accesorios', 'Extensiones'] },
    { id: 'sticker-reutilizable-parpado', name: 'Sticker Reutilizable para Párpado', price: 50, image: '/products/lash-shampoo.png', category: 'Accesorios', description: 'Sticker reutilizable para protección de párpado durante procedimientos.', relatedCategories: ['Accesorios', 'Extensiones'] },
    { id: 'lash-ribbon', name: 'Lash Ribbon', price: 50, image: '/products/lash-shampoo.png', category: 'Accesorios', description: 'Cinta para pestañas lash ribbon para separación y protección.', relatedCategories: ['Accesorios', 'Extensiones'] },
    { id: 'glue-less-powder', name: 'Glue Less Powder', price: 150, image: '/products/lash-shampoo.png', category: 'Accesorios', description: 'Polvo para mejorar la retención del adhesivo. Optimiza el secado.', relatedCategories: ['Accesorios', 'Adhesivos'] },
    { id: 'air-pump', name: 'Air Pump', price: 100, image: '/products/lash-shampoo.png', category: 'Accesorios', description: 'Bomba de aire para secado rápido del adhesivo de extensiones.', relatedCategories: ['Accesorios', 'Extensiones'] },

    // --- Tratamientos Extras ---
    { id: 'tratamiento-capilar-ph4', name: 'Tratamiento Capilar pH 4', price: 75, image: '/products/after-care.png', category: 'Tratamientos', description: 'Tratamiento capilar con pH 4 para nutrición y reestructuración.', relatedCategories: ['Tratamientos'] },
    { id: 'botox-pestanas', name: 'Botox Pestañas', price: 200, image: '/products/after-care.png', category: 'Tratamientos', description: 'Tratamiento botox para pestañas. Nutre, engrosa y fortalece desde la raíz.', relatedCategories: ['Tratamientos', 'Lash Lifting'] },

    // --- Microblading ---
    { id: 'after-care-microblading', name: 'After Care', price: 500, image: '/products/after-care.png', category: 'Microblading', description: 'Tratamiento After Care para post-procedimiento de microblading.', relatedCategories: ['Microblading'] },
];

// Categorías actualizadas con todos los segmentos del catálogo
export const categories = [
    { id: 'all', name: 'Todos', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z' },
    { id: 'lash-lifting', name: 'Lash Lifting', icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'brow-henna', name: 'Brow Henna', icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z' },
    { id: 'cejas', name: 'Diseño de Cejas', icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42' },
    { id: 'pigmentos', name: 'Pigmentos', icon: 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z' },
    { id: 'lash-curling', name: 'Lash Curling', icon: 'M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3' },
    { id: 'extensiones', name: 'Extensiones', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' },
    { id: 'adhesivos', name: 'Adhesivos', icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 5.608a2.25 2.25 0 01-2.024 2.842 47.28 47.28 0 01-6.178.326 47.28 47.28 0 01-6.178-.326 2.25 2.25 0 01-2.024-2.842L5 14.5' },
    { id: 'tratamientos', name: 'Tratamientos', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
    { id: 'herramientas', name: 'Herramientas', icon: 'M11.42 15.17l-5.384 5.384a2.625 2.625 0 01-3.712-3.712l5.384-5.384M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.049.58.025 1.193-.14 1.743' },
    { id: 'accesorios', name: 'Accesorios', icon: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18' },
    { id: 'higiene', name: 'Higiene', icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 5.608a2.25 2.25 0 01-2.024 2.842 47.28 47.28 0 01-6.178.326 47.28 47.28 0 01-6.178-.326 2.25 2.25 0 01-2.024-2.842L5 14.5' },
    { id: 'pestanas-en-tira', name: 'Pestañas en Tira', icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'microblading', name: 'Microblading', icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10' },
];

// Curated bestsellers based on market study — ordered by popularity
const bestsellersIds = [
    'laminado-cejas',           // #1 Kit de Planchado y Diseño de Cejas
    'jade-rizado-pestanas',     // #2 Kit JADE Rizado Permanente de Pestañas
    'chocolate-pigmento-cejas', // #3 Pigmento para Cejas - Chocolate
    'pigmento-pestanas',        // #4 Pigmento para Pestañas (Negro)
    'tratamiento-alargador',    // #5 Gel/Tratamiento Reestructurante y Alargador
    'adhesivo-supreme-g4',      // #6 Adhesivo de Pestañas Supreme G4
];
export const bestsellers = bestsellersIds
    .map(id => products.find(p => p.id === id)!)
    .filter(Boolean);

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

export function getRelatedProducts(product: Product, limit: number = 8): Product[] {
    // First get products from the same category
    const sameCategory = products.filter(
        p => p.category === product.category && p.id !== product.id
    );

    // Then get products from related categories
    const relatedCats = product.relatedCategories || [];
    const fromRelated = products.filter(
        p => relatedCats.includes(p.category) && p.id !== product.id && p.category !== product.category
    );

    // Combine, deduplicate, and limit
    const combined = [...sameCategory, ...fromRelated];
    const uniqueIds = new Set<string>();
    const unique = combined.filter(p => {
        if (uniqueIds.has(p.id)) return false;
        uniqueIds.add(p.id);
        return true;
    });

    return unique.slice(0, limit);
}

// ═══════════════════════════════════════════════════════════════════
// VARIANT GROUPS — Products that are the same model with different attributes
// ═══════════════════════════════════════════════════════════════════

export interface VariantGroup {
    parentId: string;
    parentName: string;
    attributeNames: string[];
    variants: {
        productId: string;
        attributes: Record<string, string>;
    }[];
}

export const variantGroups: VariantGroup[] = [
    // 1. Extensiones Mink (Curva C / D)
    {
        parentId: 'pestana-mink-curva-c',
        parentName: 'Extensiones Mink J.Denis',
        attributeNames: ['Curva'],
        variants: [
            { productId: 'pestana-mink-curva-c', attributes: { Curva: 'C' } },
            { productId: 'pestana-mink-curva-d', attributes: { Curva: 'D' } },
        ],
    },
    // 2. Extensiones Individuales Mixtas
    {
        parentId: 'curva-b-010-combo',
        parentName: 'Extensiones Individuales Mixtas',
        attributeNames: ['Curva', 'Grosor'],
        variants: [
            { productId: 'curva-b-010-combo', attributes: { Curva: 'B', Grosor: '0.10' } },
            { productId: 'curva-c-010-combo', attributes: { Curva: 'C', Grosor: '0.10' } },
            { productId: 'curva-l-010-combo', attributes: { Curva: 'L', Grosor: '0.10' } },
            { productId: 'curva-l-015-combo', attributes: { Curva: 'L', Grosor: '0.15' } },
            { productId: 'curva-lc-010-combo', attributes: { Curva: 'LC', Grosor: '0.10' } },
            { productId: 'curva-lc-015-combo', attributes: { Curva: 'LC', Grosor: '0.15' } },
            { productId: 'curva-cc-015-combo', attributes: { Curva: 'CC', Grosor: '0.15' } },
        ],
    },
    // 3. Extensiones Easy Fan
    {
        parentId: 'easy-fan-curva-c',
        parentName: 'Extensiones Easy Fan J.Denis',
        attributeNames: ['Curva', 'Grosor'],
        variants: [
            { productId: 'easy-fan-curva-c', attributes: { Curva: 'C', Grosor: 'Mixta' } },
            { productId: 'easy-fan-curva-d-005', attributes: { Curva: 'D', Grosor: '0.05' } },
            { productId: 'easy-fan-curva-d-007', attributes: { Curva: 'D', Grosor: '0.07' } },
        ],
    },
    // 4. Abanicos Pre-hechos
    {
        parentId: 'abanicos-3d-c-007',
        parentName: 'Abanicos Pre-hechos J.Denis',
        attributeNames: ['Dimensión', 'Curva', 'Grosor', 'Largo'],
        variants: [
            { productId: 'abanicos-3d-c-007', attributes: { 'Dimensión': '3D', Curva: 'C', Grosor: '0.07', Largo: 'Mixta' } },
            { productId: 'abanicos-2d-b-015-10', attributes: { 'Dimensión': '2D', Curva: 'B', Grosor: '0.15', Largo: '10mm' } },
            { productId: 'abanicos-2d-b-015-12', attributes: { 'Dimensión': '2D', Curva: 'B', Grosor: '0.15', Largo: '12mm' } },
            { productId: 'abanicos-2d-c-015-10', attributes: { 'Dimensión': '2D', Curva: 'C', Grosor: '0.15', Largo: '10mm' } },
            { productId: 'abanicos-2d-j-015-10', attributes: { 'Dimensión': '2D', Curva: 'J', Grosor: '0.15', Largo: '10mm' } },
            { productId: 'abanicos-2d-j-015-12', attributes: { 'Dimensión': '2D', Curva: 'J', Grosor: '0.15', Largo: '12mm' } },
            { productId: 'abanicos-4d-b-015-10', attributes: { 'Dimensión': '4D', Curva: 'B', Grosor: '0.15', Largo: '10mm' } },
            { productId: 'abanicos-4d-b-015-12', attributes: { 'Dimensión': '4D', Curva: 'B', Grosor: '0.15', Largo: '12mm' } },
            { productId: 'abanicos-4d-c-005', attributes: { 'Dimensión': '4D', Curva: 'C', Grosor: '0.05', Largo: 'Mixta' } },
            { productId: 'abanicos-4d-c-007', attributes: { 'Dimensión': '4D', Curva: 'C', Grosor: '0.07', Largo: 'Mixta' } },
            { productId: 'abanicos-4d-d-005', attributes: { 'Dimensión': '4D', Curva: 'D', Grosor: '0.05', Largo: 'Mixta' } },
            { productId: 'abanicos-4d-d-007', attributes: { 'Dimensión': '4D', Curva: 'D', Grosor: '0.07', Largo: 'Mixta' } },
            { productId: 'abanicos-5d-b-015-10', attributes: { 'Dimensión': '5D', Curva: 'B', Grosor: '0.15', Largo: '10mm' } },
            { productId: 'abanicos-5d-j-015-10', attributes: { 'Dimensión': '5D', Curva: 'J', Grosor: '0.15', Largo: '10mm' } },
            { productId: 'abanicos-5d-c-005', attributes: { 'Dimensión': '5D', Curva: 'C', Grosor: '0.05', Largo: 'Mixta' } },
            { productId: 'abanicos-5d-c-007', attributes: { 'Dimensión': '5D', Curva: 'C', Grosor: '0.07', Largo: 'Mixta' } },
            { productId: 'abanicos-5d-d-005', attributes: { 'Dimensión': '5D', Curva: 'D', Grosor: '0.05', Largo: 'Mixta' } },
            { productId: 'abanicos-5d-d-007', attributes: { 'Dimensión': '5D', Curva: 'D', Grosor: '0.07', Largo: 'Mixta' } },
        ],
    },
    // 5. Extensiones en Colores
    {
        parentId: 'pestana-c-colores',
        parentName: 'Extensiones en Colores J.Denis',
        attributeNames: ['Curva'],
        variants: [
            { productId: 'pestana-c-colores', attributes: { Curva: 'C' } },
            { productId: 'pestana-d-colores', attributes: { Curva: 'D' } },
        ],
    },
    // 6. Rulos Desechables
    {
        parentId: 'rulos-desechables-m',
        parentName: 'Rulos Desechables J.Denis',
        attributeNames: ['Tamaño'],
        variants: [
            { productId: 'rulos-desechables-ch', attributes: { 'Tamaño': 'CH (Corta)' } },
            { productId: 'rulos-desechables-m', attributes: { 'Tamaño': 'M (Media)' } },
            { productId: 'rulos-desechables-g', attributes: { 'Tamaño': 'G (Amplia)' } },
        ],
    },
    // 7. Rulos Adhesivos
    {
        parentId: 'rulos-adhesivos-curva-g',
        parentName: 'Rulos Adhesivos J.Denis',
        attributeNames: ['Curva'],
        variants: [
            { productId: 'rulos-adhesivos-curva-g', attributes: { Curva: 'G' } },
            { productId: 'rulos-adhesivos-m-ch', attributes: { Curva: 'M/CH' } },
        ],
    },
    // 8. Tintura Tópica
    {
        parentId: 'tintura-topica-castano-medio',
        parentName: 'Tintura Tópica J.Denis',
        attributeNames: ['Tono'],
        variants: [
            { productId: 'tintura-topica-castano-medio', attributes: { Tono: 'Castaño Medio' } },
            { productId: 'tintura-topica-castano-oscuro', attributes: { Tono: 'Castaño Oscuro' } },
            { productId: 'tintura-topica-negro', attributes: { Tono: 'Negro' } },
        ],
    },
    // 9. Pestañas en Grupo / Racimo
    {
        parentId: 'pestana-grupo-racimo',
        parentName: 'Pestañas en Grupo o Racimo',
        attributeNames: ['Color'],
        variants: [
            { productId: 'pestana-grupo-racimo', attributes: { Color: 'Negro' } },
            { productId: 'pestana-grupo-racimo-azul', attributes: { Color: 'Azul' } },
            { productId: 'pestana-grupo-racimo-cafe', attributes: { Color: 'Café' } },
        ],
    },
    // 10. Crema Lash Lifting (Paso 1 y 2)
    {
        parentId: 'crema-lifting-paso-1',
        parentName: 'Crema Lash Lifting J.Denis',
        attributeNames: ['Paso'],
        variants: [
            { productId: 'crema-lifting-paso-1', attributes: { Paso: '1 – Ondulante' } },
            { productId: 'crema-fijadora-paso-2', attributes: { Paso: '2 – Fijadora' } },
        ],
    },
    // 11. Limpiador de Impurezas
    {
        parentId: 'limpiador-impurezas',
        parentName: 'Limpiador de Impurezas J.Denis',
        attributeNames: ['Tipo de Piel'],
        variants: [
            { productId: 'limpiador-impurezas', attributes: { 'Tipo de Piel': 'Mixta / Grasa' } },
            { productId: 'limpiador-piel-normal-seca', attributes: { 'Tipo de Piel': 'Normal / Seca' } },
        ],
    },
    // 12. Adhesivo Bálsamo
    {
        parentId: 'adhesivo-balsamo-20gr',
        parentName: 'Adhesivo Bálsamo J.Denis',
        attributeNames: ['Presentación'],
        variants: [
            { productId: 'adhesivo-balsamo-20gr', attributes: { 'Presentación': '20 gr' } },
            { productId: 'adhesivo-balsamo-butter-30gr', attributes: { 'Presentación': 'Butter 30 gr' } },
        ],
    },
];

// Index for fast lookups: productId -> VariantGroup
const variantIndex = new Map<string, VariantGroup>();
for (const group of variantGroups) {
    for (const v of group.variants) {
        variantIndex.set(v.productId, group);
    }
}

/**
 * Returns the VariantGroup a product belongs to, or undefined if it's standalone.
 */
export function getVariantGroup(productId: string): VariantGroup | undefined {
    return variantIndex.get(productId);
}

/**
 * Returns a de-duplicated list of products for the shop grid.
 * For each VariantGroup, only the parent (first) product is shown.
 * Sets `name` of the representative to the parentName for cleaner display.
 */
export function getDisplayProducts(): Product[] {
    const hiddenIds = new Set<string>();

    for (const group of variantGroups) {
        // Hide all variant IDs except the parentId
        for (const v of group.variants) {
            if (v.productId !== group.parentId) {
                hiddenIds.add(v.productId);
            }
        }
    }

    return products.filter(p => !hiddenIds.has(p.id));
}

/**
 * Returns the number of variants for a product's group, or 0 if standalone.
 */
export function getVariantCount(productId: string): number {
    const group = variantIndex.get(productId);
    return group ? group.variants.length : 0;
}
