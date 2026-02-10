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
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
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
    },
    {
        id: 'blue-lash-lifting',
        name: 'BLUE Lash Lifting',
        price: 500,
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/blue_mesa-de-trabajo-11-9092542207219bc30316691308859785-480-0.webp',
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
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2019-02-09-a-las-20-04-021-39c0aa667e05a80ed715497643400355-1024-1024.webp',
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
        image: 'https://acdn-us.mitiendanube.com/stores/694/809/products/brow-henna-061-fbdb257619cce9e95d16669249148944-480-0.webp',
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
];

// Categorías actualizadas con todos los segmentos del catálogo
export const categories = [
    { id: 'all', name: 'Todos', icon: '✨' },
    { id: 'lash-lifting', name: 'Lash Lifting', icon: '👁️' },
    { id: 'brow-henna', name: 'Brow Henna', icon: '✏️' },
    { id: 'cejas', name: 'Diseño de Cejas', icon: '🖌️' },
    { id: 'pigmentos', name: 'Pigmentos', icon: '🎨' },
    { id: 'lash-curling', name: 'Lash Curling', icon: '🌀' },
    { id: 'extensiones', name: 'Extensiones', icon: '💫' },
    { id: 'adhesivos', name: 'Adhesivos', icon: '🧪' },
    { id: 'tratamientos', name: 'Tratamientos', icon: '💎' },
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
