export interface CategorySEOInfo {
    category: string;
    h1Title: string;
    metaTitle: string;
    metaDescription: string;
    genericKeywords: string[];
    b2cSummary: string;
    b2bWholesalePitch: string;
    keyBenefits: string[];
    usageTips: string;
    faqs: Array<{ question: string; answer: string }>;
}

/**
 * Diccionario de sinónimos genéricos de cosmetiquería femenina y búsquedas B2B en México.
 * Permite que búsquedas coloquiales o no-marca ("rubor para cejas", "sombra para cejas",
 * "maquillaje de cejas", "gel fijador", "rimel", "pegamento", "mayoreo", etc.)
 * encuentren los productos técnicos y profesionales de J. Denis.
 */
export const GENERIC_SYNONYM_MAP: Record<string, string[]> = {
    'rubor para cejas': ['brow henna', 'henna', 'pigmento', 'sombra', 'ceja', 'maquillaje', 'tinte', 'diseño de cejas'],
    'rubor': ['brow henna', 'henna', 'pigmento', 'sombra', 'ceja', 'color'],
    'sombra para cejas': ['brow henna', 'henna', 'pigmento', 'ceja', 'diseño de cejas'],
    'sombra': ['brow henna', 'henna', 'pigmento', 'ceja'],
    'maquillaje de cejas': ['brow henna', 'henna', 'pigmento', 'planchado', 'laminado', 'gel', 'diseño de cejas'],
    'maquillaje': ['brow henna', 'henna', 'pigmento', 'pestañas', 'ceja', 'rimel', 'tratamientos'],
    'pigmento para cejas': ['pigmentos', 'brow henna', 'henna', 'tinte', 'microblading', 'ceja'],
    'tinte para cejas': ['pigmentos', 'brow henna', 'henna', 'ceja'],
    'tinte': ['pigmentos', 'brow henna', 'henna', 'color'],
    'gel fijador de cejas': ['planchado', 'laminado', 'brow lamination', 'fijador', 'gel', 'ceja', 'tratamientos'],
    'gel fijador': ['planchado', 'laminado', 'fijador', 'gel', 'ceja', 'tratamientos'],
    'fijador de cejas': ['planchado', 'laminado', 'fijador', 'gel', 'ceja'],
    'jabon para cejas': ['planchado', 'laminado', 'ceja', 'diseño de cejas', 'fijador'],
    'laminado de cejas': ['planchado', 'brow', 'laminado', 'cisteamina', 'ceja', 'diseño de cejas'],
    'planchado de cejas': ['planchado', 'ceja', 'diseño de cejas', 'fijador', 'reestructurante'],
    'rimel': ['rímel', 'mascara', 'máscara', 'tratamientos', 'cepillo', 'pestañas'],
    'mascara de pestanas': ['rímel', 'mascara', 'tratamientos', 'pestañas'],
    'pegamento': ['adhesivos', 'adhesivo', 'glue', 'bonder', 'extensiones', 'pestañas en tira'],
    'pegamento para pestanas': ['adhesivos', 'adhesivo', 'extensiones', 'pestañas en tira', 'lifting'],
    'delineador': ['pigmentos', 'henna', 'microblading', 'diseño de cejas', 'herramientas'],
    'desmaquillante': ['shampoo', 'espuma', 'limpiador', 'higiene', 'removedor'],
    'limpiador': ['shampoo', 'espuma', 'higiene', 'primer', 'microcepillo'],
    'suero': ['tratamientos', 'hidratante', 'botox', 'queratina', 'reestructurante', 'crecimiento'],
    'serum': ['tratamientos', 'hidratante', 'botox', 'queratina', 'reestructurante'],
    'activador de henna': ['activador', 'brow henna', 'henna', 'organico', 'cejas', 'pigmento'],
    'activador organico para cejas': ['activador', 'brow henna', 'henna', 'cejas', 'tintura'],
    'activador de henna para cejas': ['activador', 'brow henna', 'henna', 'cejas'],
    'gel ondulante para pestanas': ['jade', 'rizado', 'lash lifting', 'ondulante', 'pestañas', 'lifting'],
    'gel ondulante': ['jade', 'rizado', 'lash lifting', 'ondulante', 'pestañas'],
    'curva lc pestanas': ['extensiones', 'curva lc', 'lc', 'pestañas', 'blister', 'fibras'],
    'curva lc': ['extensiones', 'curva lc', 'pestañas', 'blister'],
    'castano medio': ['castaño medio', 'chocolate', 'tintura', 'pigmento', 'brow henna', 'cejas'],
    'godete cristal': ['godete', 'cristal', 'herramientas', 'mezclador', 'henna', 'pigmentos'],
    'godete': ['godete', 'cristal', 'anillo', 'herramientas'],
    'botox para pestanas y cejas': ['botox', 'hidratante', 'shot', 'tratamientos', 'queratina', 'cejas', 'pestañas'],
    'botox': ['botox', 'hidratante', 'reestructurante', 'tratamientos', 'lash lifting'],
    'adhesivo para pestanas de grupo': ['adhesivos', 'adhesivo', 'grupo', 'punto', 'tira', 'pestañas'],
    'cisteamina': ['lash lifting', 'blue lash lifting', 'laminado', 'gel ondulante', 'reestructurante', 'jade', 'lifting'],
    'cist': ['lash lifting', 'blue lash lifting', 'laminado', 'gel ondulante', 'reestructurante', 'jade'],
    'lash lifting cisteamina': ['lash lifting', 'blue lash lifting', 'kit lash lifting', 'laminado', 'gel ondulante', 'reestructurante'],
    'lifting coreano': ['lash lifting', 'blue lash lifting', 'laminado', 'gel ondulante', 'reestructurante', 'pad'],
    'coreano': ['lash lifting', 'blue lash lifting', 'laminado', 'pad anime', 'pad nube', 'gel ondulante'],
    'lash & brow': ['laminado', 'brow fixative', 'j.eyebrow', 'lash lifting', 'brow henna', 'gel', 'tratamientos'],
    'lash & brown': ['laminado', 'brow fixative', 'j.eyebrow', 'brown', 'pigmentos', 'brow henna', 'lash lifting'],
    'lash & brol': ['laminado', 'brow fixative', 'j.eyebrow', 'lash lifting', 'brow henna'],
    'lash and brow': ['laminado', 'brow fixative', 'j.eyebrow', 'lash lifting', 'brow henna'],
    'mayoreo': ['kit', 'profesional', 'paquete', 'distribuidor', 'salon', 'estudio'],
    'fabricante': ['j. denis', 'profesional', 'kit', 'cisteamina', 'henna', 'pigmentos'],
};

export function normalizeSearchText(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

export function expandSearchTerms(rawQuery: string): string[] {
    const normalized = normalizeSearchText(rawQuery);
    if (!normalized) return [];

    const expanded = new Set<string>([normalized]);
    const words = normalized.split(/\s+/).filter(w => w.length >= 2);
    words.forEach(w => expanded.add(w));

    for (const [phrase, synonyms] of Object.entries(GENERIC_SYNONYM_MAP)) {
        const normPhrase = normalizeSearchText(phrase);
        if (normalized.includes(normPhrase) || normPhrase.includes(normalized)) {
            synonyms.forEach(s => expanded.add(normalizeSearchText(s)));
        }
    }

    for (const word of words) {
        if (GENERIC_SYNONYM_MAP[word]) {
            GENERIC_SYNONYM_MAP[word].forEach(s => expanded.add(normalizeSearchText(s)));
        }
    }

    return Array.from(expanded);
}

export function matchesProductSearch(
    product: {
        name: string;
        category: string;
        description?: string;
        benefits?: string[];
        specifications?: string[];
    },
    rawQuery: string
): { matches: boolean; score: number } {
    const normQuery = normalizeSearchText(rawQuery);
    if (!normQuery) return { matches: true, score: 1 };

    const haystackName = normalizeSearchText(product.name || '');
    const haystackCategory = normalizeSearchText(product.category || '');
    const haystackDesc = normalizeSearchText(product.description || '');
    const haystackBenefits = normalizeSearchText((product.benefits || []).join(' '));

    // Direct match gets highest priority
    if (haystackName.includes(normQuery)) return { matches: true, score: 100 };
    if (haystackCategory.includes(normQuery)) return { matches: true, score: 85 };
    if (haystackDesc.includes(normQuery) || haystackBenefits.includes(normQuery)) {
        return { matches: true, score: 70 };
    }

    // Multi-word direct match
    const queryWords = normQuery.split(/\s+/).filter(w => w.length >= 3);
    if (queryWords.length > 1) {
        const allMatch = queryWords.every(
            w => haystackName.includes(w) || haystackCategory.includes(w) || haystackDesc.includes(w)
        );
        if (allMatch) return { matches: true, score: 65 };
    }

    // Synonym expansion match
    const expandedTerms = expandSearchTerms(rawQuery);
    let maxScore = 0;
    for (const term of expandedTerms) {
        if (term === normQuery) continue;
        if (haystackName.includes(term)) maxScore = Math.max(maxScore, 50);
        else if (haystackCategory.includes(term)) maxScore = Math.max(maxScore, 45);
        else if (haystackDesc.includes(term) || haystackBenefits.includes(term)) maxScore = Math.max(maxScore, 30);
    }

    return { matches: maxScore > 0, score: maxScore };
}

export const CATEGORY_SEO_DATA: Record<string, CategorySEOInfo> = {
    'Todos': {
        category: 'Todos',
        h1Title: 'Catálogo de Cosméticos para Cejas y Pestañas Directo de Fábrica',
        metaTitle: 'Cosméticos para Cejas y Pestañas Profesional y Mayoreo | J. Denis Fabricante México',
        metaDescription: 'Fabricante mexicano líder en cosméticos para cejas y pestañas: rubor y pigmento para cejas, brow henna, gel fijador y laminado, lash lifting con cisteamina, adhesivos y venta al mayoreo con envíos a todo México.',
        genericKeywords: [
            'cosméticos por mayoreo directo de fábrica México',
            'rubor para cejas',
            'pigmento para cejas profesional',
            'gel fijador y laminado de cejas mayoreo',
            'insumos para pestañas y cejas fabricante',
            'lash lifting cisteamina México'
        ],
        b2cSummary: 'Fórmulas hipoalergénicas y de grado profesional desarrolladas en laboratorios mexicanos desde 1998. Diseñadas para lograr cejas definidas con efecto polvo/sombra (rubor para cejas), laminado nutritivo de larga duración y rizado/lifting de pestañas sin maltrato.',
        b2bWholesalePitch: 'Compra directo de fábrica sin intermediarios. Precios especiales de mayoreo y distribuidor para estéticas, estudios de belleza, academias y comercializadoras de cosméticos en los 32 estados de México.',
        keyBenefits: [
            'Fabricante nacional mexicano con más de 25 años de innovación cosmética (pioneros desde 1998).',
            'Fórmulas con Cisteamina y activos veganos libres de daño estructural.',
            'Alto rendimiento por envase (30 a 60 aplicaciones por kit profesional).',
            'Precios de mayoreo directo de fábrica y asesoría técnica certificada STPS.'
        ],
        usageTips: 'Selecciona la línea según tu servicio o rutina diaria: Brow Henna y Pigmentos para efecto maquillaje/rubor de cejas de larga duración; Diseño de Cejas para laminado y fijación; Lash Lifting y Extensiones para mirada de alto impacto.',
        faqs: [
            {
                question: '¿Qué producto recomiendan si busco un rubor para cejas o sombra de larga duración?',
                answer: 'Nuestra línea de Brow Henna y Pigmentos para Cejas J. Denis ofrece un acabado empolvado natural tipo rubor o sombra para cejas con fijación en piel de hasta 10 días y en vello de hasta 4 semanas, sin tonos rojizos indeseados.'
            },
            {
                question: '¿Cómo puedo comprar cosméticos J. Denis por mayoreo directo de fábrica?',
                answer: 'Puedes registrarte como Distribuidor o Mayorista en nuestra plataforma o cotizar directamente desde el catálogo. Ofrecemos escalas de descuento para estudios de belleza, academias y distribuidoras en todo México.'
            },
            {
                question: '¿Realizan envíos a toda la República Mexicana?',
                answer: 'Sí, enviamos desde nuestra planta y centro de distribución en Ciudad de México a todos los estados del país con guía rastreable y envío gratis en pedidos minoristas mayores a $2,000 MXN.'
            }
        ]
    },
    'Brow Henna': {
        category: 'Brow Henna',
        h1Title: 'Brow Henna, Rubor y Sombra para Cejas de Larga Duración',
        metaTitle: 'Rubor para Cejas, Sombra y Brow Henna Profesional Mayoreo | J. Denis México',
        metaDescription: 'Logra el efecto rubor para cejas (sombra empolvada natural) con Brow Henna J. Denis. Pigmentos minerales y veganos de larga duración directo de fábrica en México. Venta individual y mayoreo.',
        genericKeywords: [
            'rubor para cejas',
            'sombra para cejas larga duración',
            'henna para cejas mayoreo México',
            'maquillaje semipermanente de cejas',
            'tinte y pigmento natural para cejas'
        ],
        b2cSummary: '¿Buscas el efecto de rubor para cejas o sombra empolvada que rellena huecos sin verse artificial? La Henna para Cejas J. Denis deposita color uniforme en piel y vello con extractos botánicos que fortalecen el folículo.',
        b2bWholesalePitch: 'Alta rentabilidad para tu estudio o negocio de cosméticos: cada frasco rinde hasta 50 aplicaciones de diseño y sombreado de cejas. Precios de fabricante para distribuidoras y academias.',
        keyBenefits: [
            'Acabado efecto polvo / rubor para cejas natural y modulable.',
            'Tonos diseñados específicamente para fototipos latinos (Rubio, Castaño Claro, Medio, Oscuro, Pelirrojo y Negro).',
            'Duración de hasta 2 semanas en piel y 4–6 semanas en vello.',
            'Fórmula libre de plomo y amoníaco.'
        ],
        usageTips: 'Limpia la zona con Shampoo Facial J. Denis, mezcla la henna con activador hasta obtener consistencia de salsa ligera y aplica en capas desde la cola hacia el inicio de la ceja para lograr un degradado ombre o rubor suave.',
        faqs: [
            {
                question: '¿Cuál es la diferencia entre el rubor/sombra tradicional de cejas y Brow Henna J. Denis?',
                answer: 'Mientras un rubor o sombra cosmética convencional se borra con el sudor el mismo día, Brow Henna J. Denis deja un sombreado suave estilo maquillaje empolvado que permanece intacto en la piel de 7 a 14 días y nutre el vello.'
            },
            {
                question: '¿Venden kits de Brow Henna al mayoreo para negocios?',
                answer: 'Sí, contamos con sets completos de tonos y venta por volumen directo de fábrica con márgenes preferenciales para distribuidoras y salones.'
            }
        ]
    },
    'Diseño de Cejas': {
        category: 'Diseño de Cejas',
        h1Title: 'Diseño, Planchado y Gel Fijador de Cejas Profesional',
        metaTitle: 'Gel Fijador de Cejas, Laminado y Planchado de Cejas Mayoreo | J. Denis',
        metaDescription: 'Pioneros del Planchado y Laminado de Cejas en México. Gel fijador de cejas, cremas reestructurantes, mapeo y diseño profesional directo de fábrica. Venta al menudeo y mayoreo.',
        genericKeywords: [
            'gel fijador de cejas mayoreo',
            'planchado de cejas original México',
            'laminado de cejas profesional',
            'fijador de cejas rebeldes',
            'insumos para diseño de cejas fabricante'
        ],
        b2cSummary: 'Domina las cejas rebeldes, dales volumen inmediato y mantén un peinado orgánico todo el día. Desde geles fijadores nutritivos hasta el sistema original de Planchado y Laminado de Cejas creado por J. Denis en México.',
        b2bWholesalePitch: 'El servicio más rentable y solicitado en salones mexicanos. Abastece tu estética o tienda de cosméticos con el fabricante original del planchado de cejas en México.',
        keyBenefits: [
            'Alineación inmediata del vello rebelde sin dejar residuos blancos.',
            'Activos acondicionadores que evitan el quiebre de la ceja.',
            'Herramientas de visagismo y mapeo milimétrico incluidas en la línea.',
            'Disponible en presentaciones individuales, kits de estudio y mayoreo.'
        ],
        usageTips: 'Peina el vello en dirección ascendente, aplica el paso direccionador según el grosor del vello, neutraliza para fijar la nueva estructura y finaliza con gel reestructurante hidratante.',
        faqs: [
            {
                question: '¿El planchado o laminado de cejas maltrata el vello?',
                answer: 'No. Nuestras fórmulas están balanceadas con agentes humectantes y queratina hidrolizada para moldear la fibra capilar cuidando la piel y el folículo.'
            }
        ]
    },
    'Pigmentos': {
        category: 'Pigmentos',
        h1Title: 'Pigmentos para Cejas, Pestañas y Delineado Profesional',
        metaTitle: 'Pigmento para Cejas y Pestañas Profesional Mayoreo | Fabricante J. Denis',
        metaDescription: 'Pigmentos de alta fijación para cejas y pestañas. Colores estables, cobertura de canas y efecto maquillaje duradero directo de fábrica en México.',
        genericKeywords: [
            'pigmento para cejas',
            'tinte para cejas y pestañas profesional',
            'pigmentos cosméticos fabricante México',
            'coloración de cejas mayoreo'
        ],
        b2cSummary: 'Pigmentos de grado cosmético con micropartículas de color puro para teñir cejas y pestañas con máxima precisión, cubriendo vello claro o canas y aportando profundidad a la mirada.',
        b2bWholesalePitch: 'Estabilidad cromática garantizada para profesionales de la belleza y micropigmentadoras. Precios de mayoreo directo de laboratorio mexicano.',
        keyBenefits: [
            'Pigmentación intensa en solo 10 a 15 minutos de pose.',
            'No vira a tonos verdes ni rojizos con el paso de las semanas.',
            'Compatible con servicios de Lash Lifting y Laminado de Cejas.'
        ],
        usageTips: 'Combina en proporción 1:1 con el activador en crema o líquido J. Denis en un godete de cristal hasta lograr una pasta homogénea.',
        faqs: [
            {
                question: '¿Se puede aplicar el pigmento el mismo día del Lash Lifting o Planchado de Cejas?',
                answer: 'Sí, nuestros pigmentos están formulados para aplicarse como paso de coloración inmediatamente después de neutralizar el lifting o laminado.'
            }
        ]
    },
    'Lash Lifting': {
        category: 'Lash Lifting',
        h1Title: 'Lash Lifting con Cisteamina y Rizado de Pestañas Profesional',
        metaTitle: 'Kit Lash Lifting Cisteamina y Rizado de Pestañas Mayoreo | J. Denis México',
        metaDescription: 'Kits y sobres de Lash Lifting Evolución con Cisteamina directo de fábrica. Eleva y curva las pestañas naturales sin dañarlas. Venta individual y mayoreo en México.',
        genericKeywords: [
            'lash lifting cisteamina',
            'kit de lash lifting profesional mayoreo',
            'rizado permanente de pestañas fabricante',
            'insumos lash lifting México'
        ],
        b2cSummary: 'Tecnología Evolución con Cisteamina: logra un levantamiento y curvatura espectacular de la pestaña natural desde la raíz, nutriendo e hidratando la fibra sin olor agresivo ni sobreprocesamiento.',
        b2bWholesalePitch: 'Monodosis herméticas que conservan el 100% de la potencia activa sin desperdicio de producto. Ideal para estudios de alto flujo y distribuidoras de insumos de belleza.',
        keyBenefits: [
            'Fórmula suave basada en Cisteamina libre de ácido tioglicólico agresivo.',
            'Efecto de alargamiento visual durante 6 a 8 semanas.',
            'Sobres monodosis higiénicos que garantizan frescura en cada clienta.'
        ],
        usageTips: 'Elige el pad de silicón adecuado al largo de la pestaña natural, adhiere con precisión paralela y respeta los tiempos de pose recomendados según el grosor del vello.',
        faqs: [
            {
                question: '¿Qué ventaja tiene el Lash Lifting con Cisteamina de J. Denis?',
                answer: 'La Cisteamina actúa de forma gentil sobre los puentes disulfuro de la pestaña, reduciendo drásticamente el riesgo de quemar o rizar en exceso las puntas.'
            }
        ]
    },
    'Adhesivos': {
        category: 'Adhesivos',
        h1Title: 'Adhesivos y Pegamentos Profesionales para Pestañas y Lifting',
        metaTitle: 'Pegamento y Adhesivo para Pestañas y Lash Lifting Mayoreo | J. Denis',
        metaDescription: 'Adhesivos quirúrgicos e hipoalergénicos de secado rápido para extensiones de pestañas, pestañas en tira y lash lifting. Fabricante nacional con venta al mayoreo.',
        genericKeywords: [
            'pegamento para pestañas profesional',
            'adhesivo lash lifting mayoreo',
            'pegamento hipoalergénico extensiones de pestañas',
            'adhesivo cosmético fabricante México'
        ],
        b2cSummary: 'Retención superior, baja emisión de vapores y fijación segura en cualquier humedad y clima de México.',
        b2bWholesalePitch: 'Lotes frescos producidos continuamente para garantizar viscosidad óptima y máxima retención en cabina.',
        keyBenefits: [
            'Fórmulas de baja irritación y secado controlado.',
            'Adhesivos hidrosolubles para lifting y de cianoacrilato médico para extensiones.'
        ],
        usageTips: 'Agita vigorosamente antes de dispensar cada gota y conserva en lugar fresco lejos de la luz solar directa.',
        faqs: []
    },
    'Tratamientos': {
        category: 'Tratamientos',
        h1Title: 'Sueros, Rímel con Queratina y Tratamientos para Cejas y Pestañas',
        metaTitle: 'Suero Crecimiento, Rímel Queratina y Tratamientos Cejas y Pestañas | J. Denis',
        metaDescription: 'Sueros reestructurantes, rímel de queratina, botox capilar y geles hidratantes para fortalecer y engrosar cejas y pestañas. Venta minorista y mayoreo de fábrica.',
        genericKeywords: [
            'suero para cejas y pestañas',
            'rimel con queratina mayoreo',
            'tratamiento fortalecedor de pestañas',
            'cosméticos de cuidado pos-lifting'
        ],
        b2cSummary: 'Cuidado diario en casa y sellado profesional en cabina: nutre con queratina, biotina, pantenol y activos botánicos para pestañas y cejas más gruesas, brillantes y resistentes.',
        b2bWholesalePitch: 'El producto perfecto de reventa en mostrador para que cada clienta de tu salón lleve a casa después de su servicio de cejas o pestañas.',
        keyBenefits: [
            'Aumenta el grosor y brillo natural desde la primera semana de uso.',
            'Excelente producto de venta cruzada en estéticas y mostradores de cosméticos.'
        ],
        usageTips: 'Aplica diariamente por la mañana y noche sobre cejas y pestañas limpias desde la raíz hasta las puntas.',
        faqs: []
    }
};

export function getCategorySEO(category: string): CategorySEOInfo {
    if (CATEGORY_SEO_DATA[category]) {
        return CATEGORY_SEO_DATA[category];
    }
    return {
        category,
        h1Title: `${category} Profesional para Cejas y Pestañas | Directo de Fábrica`,
        metaTitle: `${category} Profesional y Mayoreo | J. Denis Cosméticos México`,
        metaDescription: `Compra ${category} de grado profesional directo de fábrica en México. Calidad garantizada J. Denis para consumidoras, lashistas, estéticas y mayoristas con envío a todo el país.`,
        genericKeywords: [
            `${category.toLowerCase()} profesional`,
            `${category.toLowerCase()} mayoreo México`,
            `insumos de ${category.toLowerCase()} fabricante`,
            'cosméticos para cejas y pestañas J. Denis'
        ],
        b2cSummary: `Línea especializada de ${category} desarrollada por J. Denis con estándares de calidad clínica y cosmética para resultados impecables desde la primera aplicación.`,
        b2bWholesalePitch: `Precios directos de fabricante en ${category} para distribuidoras, academias y salones de belleza en todo México.`,
        keyBenefits: [
            'Calidad profesional respaldada por más de 25 años de fabricación en México.',
            'Disponibilidad inmediata y envíos seguros a toda la República Mexicana.',
            'Escalas de precio mayorista para negocios y distribuidores autorizados.'
        ],
        usageTips: `Utiliza los productos de la línea ${category} siguiendo el protocolo técnico J. Denis para maximizar el rendimiento y la satisfacción de cada aplicación.`,
        faqs: [
            {
                question: `¿Puedo comprar ${category} al mayoreo directo de fábrica?`,
                answer: `Sí, en J. Denis somos fabricantes nacionales y ofrecemos precios de distribuidor y mayoreo en toda la categoría de ${category} con envíos a todo México.`
            }
        ]
    };
}

export interface ProductGscSeoOverride {
    metaTitle: string;
    metaDescription: string;
    extraFaqs: Array<{ question: string; answer: string }>;
}

/**
 * Overrides de Alto CTR basados en datos reales de Google Search Console (sc-domain:jdenis.store)
 * para las páginas de producto con mayor volumen de impresiones en Página 1 de Google México.
 */
export const GSC_PRODUCT_SEO_OVERRIDES: Record<string, ProductGscSeoOverride> = {
    'laminado-cejas': {
        metaTitle: 'Kit Laminado de Cejas J. Denis con Cisteamina (30 Aplicaciones) | Tienda Oficial',
        metaDescription: 'Kit profesional de Laminado y Planchado de Cejas J. Denis con Cisteamina. Rinde hasta 30 servicios, alinea el vello rebelde y nutre sin maltratar. Compra individual o mayoreo directo de fábrica en México.',
        extraFaqs: [
            {
                question: '¿Cuántas aplicaciones rinde el Kit de Laminado de Cejas J. Denis?',
                answer: 'El Kit de Laminado de Cejas J. Denis rinde hasta 30 aplicaciones profesionales e incluye paso direccionador con cisteamina, fijador neutralizante y reestructurante nutritivo.',
            },
            {
                question: '¿Qué diferencia tiene el Laminado de Cejas J. Denis frente al planchado tradicional?',
                answer: 'Su fórmula avanzada con Cisteamina moldea y lamina la ceja con un acabado orgánico y brillante sin olor agresivo ni daño en la fibra capilar.',
            },
        ],
    },
    'jade-rizado-pestanas': {
        metaTitle: 'Gel Ondulante y Kit Jade para Rizado de Pestañas Profesional | J. Denis México',
        metaDescription: 'Kit Jade y Gel Ondulante para Rizado Permanente de Pestañas J. Denis. Curvatura definida, segura y de larga duración (6 a 8 semanas). Venta al menudeo y mayoreo directo de fábrica.',
        extraFaqs: [
            {
                question: '¿Cómo funciona el gel ondulante para pestañas de la línea Jade J. Denis?',
                answer: 'El gel ondulante Jade J. Denis suaviza temporalmente la estructura de la pestaña natural para darle una curvatura uniforme sobre el rulo o pad, fijándose luego con el gel neutralizante.',
            },
        ],
    },
    'chocolate-pigmento-cejas': {
        metaTitle: 'Pigmento para Cejas Chocolate / Castaño Medio de Larga Duración | J. Denis',
        metaDescription: 'Pigmento profesional para cejas tono Chocolate (Castaño Medio) J. Denis. Efecto sombra/rubor natural en piel y vello sin virar a rojo. Venta individual y mayoreo en México.',
        extraFaqs: [
            {
                question: '¿Para qué fototipo se recomienda el pigmento Chocolate / Castaño Medio J. Denis?',
                answer: 'El tono Chocolate (Castaño Medio) es el más versátil para fototipos latinos de cabello castaño claro a castaño oscuro, logrando un sombreado cálido y natural.',
            },
        ],
    },
    'tintura-topica-castano-medio': {
        metaTitle: 'Tintura Tópica Castaño Medio para Cejas (Efecto Sombra y Henna) | J. Denis',
        metaDescription: 'Tintura tópica para cejas tono Castaño Medio J. Denis. Coloración uniforme en piel y vello con acabado maquillaje empolvado de larga duración. Directo de fábrica en México.',
        extraFaqs: [
            {
                question: '¿Cuánto dura la Tintura Tópica Castaño Medio en las cejas?',
                answer: 'Permanece en la piel con efecto sombra entre 7 y 10 días y tiñe el vello de la ceja hasta por 4 semanas.',
            },
        ],
    },
    'activador-henna': {
        metaTitle: 'Activador de Henna Orgánico para Cejas (Potenciador de Color) | J. Denis México',
        metaDescription: 'Activador de Henna orgánico para cejas J. Denis. Potencia la fijación, intensidad y duración del pigmento y Brow Henna en piel y vello. Compra directo de fabricante en México.',
        extraFaqs: [
            {
                question: '¿Para qué sirve el Activador de Henna Orgánico para cejas J. Denis?',
                answer: 'El activador orgánico para cejas J. Denis reemplaza el agua común al mezclar la henna en un godete de cristal, logrando una oxidación controlada que duplica la fijación del tono en piel y vello.',
            },
        ],
    },
    'botox-pestanas': {
        metaTitle: 'Botox para Pestañas y Cejas con Queratina, Biotina y Pantenol | J. Denis',
        metaDescription: 'Tratamiento Botox para pestañas y cejas J. Denis. Hidrata, engrosa y repara la fibra capilar después del Lash Lifting o Laminado de Cejas. Venta individual y mayoreo en México.',
        extraFaqs: [
            {
                question: '¿Cómo se aplica el Botox para pestañas y cejas en el servicio de Lash Lifting?',
                answer: 'Se aplica después de retirar el paso neutralizante o el tinte, dejándolo actuar de 5 a 10 minutos para sellar la cutícula con vitaminas, queratina y pantenol.',
            },
        ],
    },
    'dark-red-pigmento-cejas': {
        metaTitle: 'Pigmento para Cejas Dark Red (Pelirrojo / Caoba) Profesional | J. Denis México',
        metaDescription: 'Pigmento profesional para cejas tono Dark Red (Pelirrojo / Caoba) J. Denis. Coloración de alta retención en piel y vello o para neutralizar subtonos fríos. Directo de fábrica en México.',
        extraFaqs: [
            {
                question: '¿Para qué sirve el Pigmento para Cejas Dark Red de J. Denis?',
                answer: 'El tono Dark Red está diseñado para cabellos pelirrojos o caobas y como modificador cálido al mezclar con tonos castaños para personalizar el diseño de ceja.',
            },
        ],
    },
    '21403ce0-8bde-4350-973c-8bbd7fbe7b39': {
        metaTitle: 'Pigmento para Cejas Dark Red (Pelirrojo / Caoba) Profesional | J. Denis México',
        metaDescription: 'Pigmento profesional para cejas tono Dark Red (Pelirrojo / Caoba) J. Denis. Coloración de alta retención en piel y vello o para neutralizar subtonos fríos. Directo de fábrica en México.',
        extraFaqs: [
            {
                question: '¿Para qué sirve el Pigmento para Cejas Dark Red de J. Denis?',
                answer: 'El tono Dark Red está diseñado para cabellos pelirrojos o caobas y como modificador cálido al mezclar con tonos castaños para personalizar el diseño de ceja.',
            },
        ],
    },
    'gel-ondulante-blue': {
        metaTitle: 'Gel Ondulante Blue para Rizado Permanente de Pestañas | J. Denis México',
        metaDescription: 'Gel Ondulante Blue profesional J. Denis para rizado de pestañas. Fórmula de acción controlada y alta eficacia para salón y lashistas. Venta menudeo y mayoreo directo de fábrica.',
        extraFaqs: [
            {
                question: '¿Cuál es el tiempo de pose del Gel Ondulante Blue J. Denis?',
                answer: 'El tiempo de pose recomendado oscila entre 10 y 15 minutos según el grosor de la pestaña natural, seguido siempre de la aplicación del Gel Neutralizante J. Denis.',
            },
        ],
    },
    '30920cc6-cd8f-4f9c-ab74-4e2264b2d33c': {
        metaTitle: 'Gel Ondulante Blue para Rizado Permanente de Pestañas | J. Denis México',
        metaDescription: 'Gel Ondulante Blue profesional J. Denis para rizado de pestañas. Fórmula de acción controlada y alta eficacia para salón y lashistas. Venta menudeo y mayoreo directo de fábrica.',
        extraFaqs: [],
    },
    'light-brown-pigmento-cejas': {
        metaTitle: 'Pigmento para Cejas Light Brown (Castaño Claro / Rubio Oscuro) | J. Denis',
        metaDescription: 'Pigmento profesional para cejas Light Brown (Castaño Claro) J. Denis. Efecto sombreado natural ideal para fototipos claros y rubios sin oscurecer en exceso.',
        extraFaqs: [
            {
                question: '¿En qué tonos de cabello luce mejor el pigmento Light Brown J. Denis?',
                answer: 'Es ideal para clientas con cabello rubio medio a oscuro o castaño claro que buscan definir la ceja con un efecto empolvado suave y luminoso.',
            },
        ],
    },
    '094eccd7-5967-48ad-bfc3-a6f07976b37d': {
        metaTitle: 'Pigmento para Cejas Light Brown (Castaño Claro / Rubio Oscuro) | J. Denis',
        metaDescription: 'Pigmento profesional para cejas Light Brown (Castaño Claro) J. Denis. Efecto sombreado natural ideal para fototipos claros y rubios sin oscurecer en exceso.',
        extraFaqs: [],
    },
    'adhesivo-transparente-grupo': {
        metaTitle: 'Adhesivo Transparente para Pestañas de Grupo y Punto | J. Denis México',
        metaDescription: 'Adhesivo transparente hipoalergénico para pestañas en grupo o por punto J. Denis. Fijación segura, acabado invisible y secado rápido. Compra menudeo y mayoreo.',
        extraFaqs: [
            {
                question: '¿Cómo retirar las pestañas aplicadas con Adhesivo Transparente J. Denis?',
                answer: 'Aplica Removedor de Adhesivo J. Denis con un microbrush sobre la unión y desliza suavemente sin tirar de la pestaña natural.',
            },
        ],
    },
    '20719896-e95a-42c7-a01a-c57a9983026a': {
        metaTitle: 'Adhesivo Transparente para Pestañas de Grupo y Punto | J. Denis México',
        metaDescription: 'Adhesivo transparente hipoalergénico para pestañas en grupo o por punto J. Denis. Fijación segura, acabado invisible y secado rápido. Compra menudeo y mayoreo.',
        extraFaqs: [],
    },
    'microbrush-10': {
        metaTitle: 'Microbrush Aplicadores de Precisión para Pestañas y Cejas (10 pzas) | J. Denis',
        metaDescription: 'Paquete de 10 aplicadores Microbrush de precisión sin pelusa J. Denis para Lash Lifting, extensión de pestañas, laminado y retiro de adhesivo. Insumos profesionales en México.',
        extraFaqs: [],
    },
    '04356a42-e90f-4f02-aa7a-53a2010194a5': {
        metaTitle: 'Microbrush Aplicadores de Precisión para Pestañas y Cejas (10 pzas) | J. Denis',
        metaDescription: 'Paquete de 10 aplicadores Microbrush de precisión sin pelusa J. Denis para Lash Lifting, extensión de pestañas, laminado y retiro de adhesivo. Insumos profesionales en México.',
        extraFaqs: [],
    },
    'godete-cristal': {
        metaTitle: 'Godete de Cristal Profesional para Henna, Pigmentos y Tintes de Cejas | J. Denis',
        metaDescription: 'Godete de Cristal macizo profesional J. Denis ($295 MXN) para mezclar Brow Henna, pigmentos de cejas, tintes y monómero sin absorber ni alterar la fórmula. Envío a todo México.',
        extraFaqs: [
            {
                question: '¿Por qué es indispensable mezclar la Henna y el Pigmento de cejas en un Godete de Cristal?',
                answer: 'El godete de cristal macizo es no poroso y químicamente inerte, lo que evita que el activador de henna o el oxidante reaccionen como ocurre con recipientes plásticos o metálicos.',
            },
        ],
    },
    'curva-lc-015-combo': {
        metaTitle: 'Extensiones de Pestañas Curva LC 0.15 Mixta (Efecto Foxy Eye y Lifting) | J. Denis',
        metaDescription: 'Blíster de Extensiones de Pestañas Curva LC grosor 0.15 Mixta J. Denis ($280 MXN). Base recta de alta retención y elevación tipo delineado ideal para párpado encapotado.',
        extraFaqs: [
            {
                question: '¿Para qué tipo de ojo se recomienda la Curva LC en extensiones de pestañas?',
                answer: 'La Curva LC es ideal para ojos con párpado encapotado, ojos profundos o diseños Foxy Eye / Cat Eye, ya que su base recta proyecta la pestaña hacia afuera antes de elevarla.',
            },
        ],
    },
    'curva-lc-010-combo': {
        metaTitle: 'Extensiones de Pestañas Curva LC 0.10 Mixta Profesional | J. Denis México',
        metaDescription: 'Blíster de Extensiones de Pestañas Curva LC grosor 0.10 Mixta J. Denis ($280 MXN). Ligereza superior y máxima superficie de contacto con el adhesivo para diseños Foxy Eye.',
        extraFaqs: [
            {
                question: '¿Qué diferencia hay entre Curva LC 0.10 y 0.15 J. Denis?',
                answer: 'El grosor 0.10 permite trabajar técnica clásica ligera o volumen tecnológico suave en pestañas naturales finas sin aportar peso extra.',
            },
        ],
    },
    'adhesivo-pads-lifting': {
        metaTitle: 'Adhesivo J. Denis para Pads de Lash Lifting y Rizado de Pestañas | Tienda Oficial',
        metaDescription: 'Adhesivo profesional hidrosoluble J. Denis para fijar pads de silicón y alinear pestañas en Lash Lifting y Rizado. Secado controlado y fácil retiro con agua.',
        extraFaqs: [
            {
                question: '¿Cómo se retira el Adhesivo para Pads de Lash Lifting J. Denis?',
                answer: 'Al ser una fórmula hidrosoluble de grado cosmético, se retira fácilmente al finalizar el procedimiento limpiando suavemente con agua purificada o solución fisiológica.',
            },
        ],
    },
    'adhesivo-rulos-blue': {
        metaTitle: 'Adhesivo J. Denis Blue para Rulos y Pads de Rizado de Pestañas ($60 MXN)',
        metaDescription: 'Adhesivo para Rulos y Pads línea Blue J. Denis ($60 MXN). Fijación firme y rápida para rizado permanente de pestañas y lash lifting profesional.',
        extraFaqs: [],
    },
};

export interface CategorySeoHubConfig {
    slug: 'cejas' | 'pestanas' | 'laminado-de-cejas' | 'lash-lifting' | 'henna-y-pigmentos';
    path: string;
    badge: string;
    h1Title: string;
    subtitle: string;
    metaTitle: string;
    metaDescription: string;
    targetCategories: string[];
    searchKeywords: string[];
    featuredProductSlugs: string[];
    technicalGuideTitle: string;
    technicalGuideIntro: string;
    protocolSteps: Array<{ step: string; title: string; detail: string }>;
    b2bHighlight: string;
    faqs: Array<{ question: string; answer: string }>;
}

export const CATEGORY_HUB_CONFIGS: Record<CategorySeoHubConfig['slug'], CategorySeoHubConfig> = {
    'cejas': {
        slug: 'cejas',
        path: '/cejas',
        badge: 'Línea Oficial J. Denis Cejas · Fabricante Mexicano desde 1998',
        h1Title: 'Productos Profesionales para Cejas J. Denis: Planchado, Laminado, Henna y Pigmentos',
        subtitle: 'Creadores del Planchado de Cejas en México. Todo el catálogo oficial J. Denis para diseño, fijación, laminado con cisteamina, rubor de henna y pigmentos de alta retención a precio de tienda y mayoreo.',
        metaTitle: 'J. Denis Cejas: Planchado, Laminado, Brow Henna y Pigmentos | Tienda Oficial México',
        metaDescription: 'Catálogo oficial J. Denis Cejas en México: Kits de Planchado y Laminado de Cejas con Cisteamina, Brow Henna, Pigmentos, Gel Fijador y Herramientas. Compra individual o mayoreo directo de fábrica.',
        targetCategories: ['Diseño de Cejas', 'Brow Henna', 'Pigmentos', 'Microblading', 'Tratamientos'],
        searchKeywords: ['ceja', 'planchado', 'laminado', 'henna', 'pigmento'],
        featuredProductSlugs: ['laminado-cejas', 'chocolate-pigmento-cejas', 'activador-henna', 'tintura-topica-castano-medio'],
        technicalGuideTitle: '¿Por qué los especialistas en México eligen la línea de Cejas J. Denis?',
        technicalGuideIntro: 'Desde 1998, nuestro laboratorio en Lindavista, Ciudad de México, ha formulado los productos estándar de la industria mexicana para moldear, pigmentar y nutrir la ceja latina sin maltratar la piel ni el folículo.',
        protocolSteps: [
            {
                step: '01',
                title: 'Higiene y Visagismo de Precisión',
                detail: 'Limpia la zona con Espuma Limpiadora J. Denis y realiza el mapeo anatómico con hilo pigmentado y vernier profesional.',
            },
            {
                step: '02',
                title: 'Moldeado: Planchado o Laminado con Cisteamina',
                detail: 'Alinea el vello rebelde con nuestro Kit de Planchado de Cejas clásico o el sistema Laminado Evolución con Cisteamina libre de tioglicolato agresivo.',
            },
            {
                step: '03',
                title: 'Coloración Efecto Sombra (Brow Henna o Pigmento)',
                detail: 'Deposita color uniforme en piel (7-14 días) y vello (hasta 4 semanas) con los 6 tonos de Brow Henna y Pigmentos J. Denis activados con Activador Orgánico.',
            },
            {
                step: '04',
                title: 'Nutrición Pos-Servicio y Cuidado en Casa',
                detail: 'Sella la cutícula con Botox de Pestañas y Cejas o Gel Reestructurante con Queratina para prolongar el efecto laminado todos los días.',
            },
        ],
        b2bHighlight: 'Abastece tu estudio de cejas, estética o distribuidora con hasta 30 a 60 servicios por kit profesional y precios escalonados directo de fábrica.',
        faqs: [
            {
                question: '¿Cuáles son los productos para cejas más vendidos de J. Denis?',
                answer: 'Los favoritos en México son el Kit de Laminado de Cejas con Cisteamina (30 aplicaciones), el Kit de Planchado de Cejas tradicional, la línea Brow Henna (tonos Chocolate, Castaño Claro, Medio y Oscuro), el Activador de Henna Orgánico y el Gel Fijador Reestructurante.',
            },
            {
                question: '¿Qué diferencia hay entre el Planchado de Cejas y el Laminado de Cejas J. Denis?',
                answer: 'El Planchado de Cejas fija y alisa el vello rebelde con una estructura definida clásica, mientras que el Laminado de Cejas con Cisteamina moldea la fibra con mayor suavidad, efecto pluma orgánico y nutrición intensiva.',
            },
            {
                question: '¿Puedo comprar productos J. Denis para cejas por mayoreo en México?',
                answer: 'Sí. Somos fabricantes nacionales y enviamos a los 32 estados de la República Mexicana con precios preferenciales para distribuidores, academias y salones de belleza.',
            },
        ],
    },
    'pestanas': {
        slug: 'pestanas',
        path: '/pestanas',
        badge: 'Línea Oficial J. Denis Pestañas · Innovación Oftalmológica y Cosmética',
        h1Title: 'Productos para Pestañas J. Denis: Lash Lifting, Rizado Permanente, Extensiones y Adhesivos',
        subtitle: 'Catálogo completo de insumos profesionales para lashistas y cuidado diario: Kits de Lash Lifting con Cisteamina, Gel Ondulante Jade, Blísters de Extensiones, Adhesivos y Tratamientos con Queratina.',
        metaTitle: 'J. Denis Pestañas: Lash Lifting, Rizado, Extensiones y Adhesivos | Tienda Oficial',
        metaDescription: 'Insumos profesionales J. Denis para pestañas en México: Kits de Lash Lifting con Cisteamina, Rizado Permanente Jade, Extensiones por blíster, Adhesivos hipoalergénicos y Botox. Menudeo y mayoreo.',
        targetCategories: ['Lash Lifting', 'Lash Curling', 'Extensiones', 'Adhesivos', 'Pestañas en Tira', 'Tratamientos'],
        searchKeywords: ['pestaña', 'lash', 'ondulante', 'rizado', 'adhesivo', 'botox'],
        featuredProductSlugs: ['jade-rizado-pestanas', 'gel-ondulante-blue', 'botox-pestanas', 'adhesivo-transparente-grupo'],
        technicalGuideTitle: 'Tecnología Mexicana para Elevación, Rizado y Extensión de Pestañas',
        technicalGuideIntro: 'Nuestras fórmulas para pestañas están diseñadas para ofrecer elevación de 6 a 8 semanas, retención superior en clima húmedo o cálido y nutrición profunda del folículo.',
        protocolSteps: [
            {
                step: '01',
                title: 'Lash Lifting Evolución con Cisteamina',
                detail: 'Eleva desde la raíz sin deshidratar ni quemar las puntas gracias a su fórmula suave con aminoácidos en sobres monodosis o presentación profesional.',
            },
            {
                step: '02',
                title: 'Lash Curling y Gel Ondulante Jade / Blue',
                detail: 'El sistema clásico líder en México para rizado permanente con rulos o pads anatómicos de silicón.',
            },
            {
                step: '03',
                title: 'Extensiones Tecnológicas y Pestañas de Grupo',
                detail: 'Fibras ultraligeras en curvas C, CC, D y LC acompañadas de adhesivos quirúrgicos y transparentes de baja emisión de vapores.',
            },
            {
                step: '04',
                title: 'Recuperación con Botox y Rímel de Queratina',
                detail: 'Engrosa y sella la pestaña natural después del procedimiento químico y aumenta tu ticket promedio con tratamientos de reventa en salón.',
            },
        ],
        b2bHighlight: 'Equipa tu cabina de pestañas o academia con kits de alto rendimiento y reposición individual de cada fase (ondulante, neutralizante, reestructurante y adhesivo).',
        faqs: [
            {
                question: '¿Cuánto dura el efecto del Rizado y Lash Lifting de J. Denis?',
                answer: 'El levantamiento o rizado permanece entre 6 y 8 semanas siguiendo el ciclo natural de renovación de la pestaña, sin necesidad de usar rizador mecánico.',
            },
            {
                question: '¿Venden los geles ondulantes y neutralizantes J. Denis por separado?',
                answer: 'Sí, además de los kits completos, puedes adquirir individualmente el Gel Ondulante (Jade o Blue), Gel Neutralizante, Gel Reestructurante, Adhesivo para Lifting y Botox de Pestañas.',
            },
            {
                question: '¿Cómo obtengo precios de distribuidor en la línea de pestañas J. Denis?',
                answer: 'Regístrate en nuestra sección de Distribuidores o solicita cotización por volumen vía WhatsApp para recibir tarifas de fabricante nacional.',
            },
        ],
    },
    'laminado-de-cejas': {
        slug: 'laminado-de-cejas',
        path: '/laminado-de-cejas',
        badge: 'Especialidad Clínica J. Denis · Fórmula con Cisteamina',
        h1Title: 'Laminado de Cejas y Planchado Profesional J. Denis con Cisteamina',
        subtitle: 'Domina la técnica de Brow Lamination y Planchado de Cejas con la marca creadora del procedimiento en México. Fórmulas seguras de 3 pasos que alinean, dan volumen y nutren la ceja.',
        metaTitle: 'Laminado de Cejas J. Denis con Cisteamina y Kits de Planchado | Tienda Oficial',
        metaDescription: 'Compra el Kit de Laminado de Cejas y Planchado Profesional J. Denis con Cisteamina (hasta 30 aplicaciones). Alinea cejas rebeldes sin maltratar. Envío a todo México menudeo y mayoreo.',
        targetCategories: ['Diseño de Cejas', 'Tratamientos', 'Herramientas'],
        searchKeywords: ['laminado', 'planchado', 'ceja', 'fijador', 'reestructurante', 'cisteamina'],
        featuredProductSlugs: ['laminado-cejas', 'botox-pestanas'],
        technicalGuideTitle: 'Protocolo Oficial de Laminado de Cejas J. Denis (Paso a Paso)',
        technicalGuideIntro: 'El sistema de Laminado de Cejas J. Denis flexibiliza los puentes disulfuro del vello mediante Cisteamina de grado cosmético para redirigir la ceja con total seguridad dérmica.',
        protocolSteps: [
            {
                step: 'Paso 1',
                title: 'Crema / Gel Direccionador con Cisteamina',
                detail: 'Ablanda suavemente la estructura del vello en 8 a 12 minutos permitiendo peinar la ceja en dirección ascendente para cubrir huecos y dar simetría.',
            },
            {
                step: 'Paso 2',
                title: 'Fijador Neutralizante Estabilizador',
                detail: 'Reconstruye los enlaces capilares en la nueva dirección deseada manteniendo el diseño intacto de 4 a 6 semanas.',
            },
            {
                step: 'Paso 3',
                title: 'Gel Reestructurante y Botox Nutritivo',
                detail: 'Hidrata profundamente con queratina, pantenol y biotina para un acabado sedoso, brillante y elástico.',
            },
            {
                step: 'Extra',
                title: 'Diseño y Coloración Complementaria',
                detail: 'Compatible con nuestros Pigmentos para Cejas y Brow Henna J. Denis para entregar un servicio completo de diseño + laminado + color.',
            },
        ],
        b2bHighlight: 'Con un solo Kit de Laminado de Cejas J. Denis realizas hasta 30 servicios profesionales de alto margen en tu estudio o estética.',
        faqs: [
            {
                question: '¿Cuántos servicios rinde el Kit de Laminado de Cejas J. Denis?',
                answer: 'Rinde aproximadamente 30 aplicaciones completas, convirtiéndolo en uno de los tratamientos más rentables para estudios de cejas y salones en México.',
            },
            {
                question: '¿Se puede aplicar tinte o henna el mismo día del laminado de cejas?',
                answer: 'Sí, recomendamos aplicar Pigmento para Cejas J. Denis después del paso neutralizante y finalizar siempre con Botox o Gel Reestructurante hidratante.',
            },
        ],
    },
    'lash-lifting': {
        slug: 'lash-lifting',
        path: '/lash-lifting',
        badge: 'Sistema Evolución J. Denis · Sin Daño Capilar',
        h1Title: 'Lash Lifting J. Denis con Cisteamina: Kits, Monodosis, Pads y Adhesivos',
        subtitle: 'Elevación panorámica de pestañas naturales desde la raíz. Fórmulas frescas en sobres monodosis y kits profesionales con Cisteamina que cuidan la salud ocular y capilar.',
        metaTitle: 'Kit Lash Lifting J. Denis con Cisteamina, Pads y Adhesivos | Tienda Oficial México',
        metaDescription: 'Catálogo oficial de Lash Lifting J. Denis en México: Kits Evolución con Cisteamina, sobres monodosis, pads de silicón anatómicos, adhesivo hidrosoluble y Botox. Venta individual y mayoreo.',
        targetCategories: ['Lash Lifting', 'Lash Curling', 'Adhesivos', 'Tratamientos', 'Herramientas'],
        searchKeywords: ['lifting', 'cisteamina', 'ondulante', 'pad', 'botox', 'adhesivo'],
        featuredProductSlugs: ['jade-rizado-pestanas', 'gel-ondulante-blue', 'botox-pestanas', 'microbrush-10'],
        technicalGuideTitle: 'Ventajas del Sistema Lash Lifting Evolución con Cisteamina J. Denis',
        technicalGuideIntro: 'A diferencia de los permanentes alcalinos agresivos, el Lash Lifting con Cisteamina J. Denis actúa respetando la elasticidad natural de la pestaña, evitando puntas quemadas o sobre-rizadas.',
        protocolSteps: [
            {
                step: 'Fase 1',
                title: 'Acoplamiento con Pads Anatómicos y Adhesivo Lifting',
                detail: 'Selecciona la talla exacta del pad de silicón (S, M, M1, M2, L) y alinea cada pestaña con nuestro adhesivo hidrosoluble de secado controlado.',
            },
            {
                step: 'Fase 2',
                title: 'Elevación con Crema Cisteamina (Paso 1)',
                detail: 'Aplica de la base al tercio medio de la pestaña (nunca en las puntas) para crear un levantamiento limpio de 45° a 90°.',
            },
            {
                step: 'Fase 3',
                title: 'Fijación Estructural (Paso 2) y Tinte',
                detail: 'Sella la curvatura con la fase neutralizante y potencia la mirada con Pigmento Negro Azulado o Castaño J. Denis.',
            },
            {
                step: 'Fase 4',
                title: 'Sellado con Botox de Pestañas y Queratina',
                detail: 'Retira residuos suavemente y nutre con Botox de Pestañas J. Denis para devolver brillo, grosor y resistencia.',
            },
        ],
        b2bHighlight: 'Ideal para lashistas profesionales y academias de belleza: empaques que conservan el 100% de la potencia activa en cada aplicación.',
        faqs: [
            {
                question: '¿Por qué es mejor el Lash Lifting con Cisteamina J. Denis?',
                answer: 'La cisteamina es un agente moldeador biocompatible mucho más gentil con la pestaña que el ácido tioglicólico tradicional, logrando una elevación duradera sin resecar la fibra.',
            },
            {
                question: '¿Qué incluye un kit completo de Lash Lifting J. Denis?',
                answer: 'Dependiendo de la presentación, incluye las fases de levantamiento, fijación y reestructuración, adhesivo para lifting, pads de silicón reutilizables y cepillos/herramientas de aislamiento.',
            },
        ],
    },
    'henna-y-pigmentos': {
        slug: 'henna-y-pigmentos',
        path: '/henna-y-pigmentos',
        badge: 'Colorimetría Latina J. Denis · Rubor y Sombra para Cejas',
        h1Title: 'Brow Henna, Rubor para Cejas y Pigmentos Profesionales J. Denis',
        subtitle: 'La gama de tonos diseñada específicamente para fototipos latinos: Rubio, Castaño Claro, Castaño Medio (Chocolate), Castaño Oscuro, Dark Red y Negro sin oxidación rojiza indeseada.',
        metaTitle: 'Brow Henna, Rubor y Pigmentos para Cejas J. Denis (Todos los Tonos) | México',
        metaDescription: 'Compra Brow Henna, Rubor/Sombra para Cejas, Tintura Tópica, Activador Orgánico y Pigmentos J. Denis en México. Tonos Chocolate, Castaño Claro, Medio, Oscuro y Negro. Menudeo y mayoreo.',
        targetCategories: ['Brow Henna', 'Pigmentos', 'Diseño de Cejas'],
        searchKeywords: ['henna', 'pigmento', 'tintura', 'castaño', 'chocolate', 'activador', 'rubor'],
        featuredProductSlugs: ['chocolate-pigmento-cejas', 'light-brown-pigmento-cejas', 'dark-red-pigmento-cejas', 'tintura-topica-castano-medio', 'activador-henna'],
        technicalGuideTitle: 'Guía de Colorimetría: Brow Henna vs. Pigmentos y Tinturas J. Denis',
        technicalGuideIntro: 'Tanto si buscas un efecto maquillaje empolvado ("rubor para cejas") que sombree la piel como si deseas teñir vello cano o claro tras un laminado, J. Denis cuenta con la fórmula exacta.',
        protocolSteps: [
            {
                step: 'Tono 01',
                title: 'Light Brown / Rubio y Castaño Claro',
                detail: 'Perfectos para cabellos rubios, cenizos o castaños claros que requieren definición suave y luminosa.',
            },
            {
                step: 'Tono 02',
                title: 'Chocolate / Castaño Medio (Best-Seller Nacional)',
                detail: 'El tono universal para pieles y cabellos latinos: aporta profundidad cálida y natural sin endurecer las facciones.',
            },
            {
                step: 'Tono 03',
                title: 'Castaño Oscuro, Dark Red y Negro',
                detail: 'Ideales para cabellos oscuros, pelirrojos/caobas o para teñir pestañas con intensidad tipo rímel.',
            },
            {
                step: 'Potenciador',
                title: 'Activador de Henna Orgánico J. Denis',
                detail: 'Mezcla de 3 a 5 gotas por medida en godete de cristal para obtener una pasta homogénea que duplica la retención en piel y vello.',
            },
        ],
        b2bHighlight: 'Cada frasco de Brow Henna o Pigmento J. Denis rinde decenas de servicios de diseño de ceja con costo por aplicación mínimo para tu salón.',
        faqs: [
            {
                question: '¿Cuánto dura la Brow Henna y el Pigmento J. Denis en piel y vello?',
                answer: 'El sombreado en piel dura de 7 a 14 días (según el tipo de piel y cuidados posteriores) y la coloración en el vello permanece hasta por 4 semanas.',
            },
            {
                question: '¿Para qué sirve el Activador de Henna J. Denis?',
                answer: 'Sustituye al agua común en la preparación de la henna para estabilizar el pH, acelerar la liberación del pigmento botánico y prolongar la fijación del tono.',
            },
        ],
    },
};

export function getProductGenericDescriptor(product: { name: string; category: string }): string {
    const nameLower = product.name.toLowerCase();
    const catLower = product.category.toLowerCase();

    if (catLower.includes('henna') || nameLower.includes('henna')) {
        return 'Rubor, Sombra y Henna para Cejas de Larga Duración';
    }
    if (catLower.includes('pigmento') || nameLower.includes('pigmento') || nameLower.includes('tinte')) {
        return 'Pigmento y Tinte Profesional para Cejas y Pestañas';
    }
    if (catLower.includes('diseño') || nameLower.includes('planchado') || nameLower.includes('fijador') || nameLower.includes('gel')) {
        return 'Gel Fijador, Laminado y Planchado de Cejas Profesional';
    }
    if (catLower.includes('lifting') || nameLower.includes('lifting') || nameLower.includes('rizado')) {
        return 'Lash Lifting y Rizado de Pestañas Profesional';
    }
    if (catLower.includes('adhesivo') || nameLower.includes('adhesivo') || nameLower.includes('pegamento')) {
        return 'Adhesivo y Pegamento Cosmético Profesional';
    }
    if (catLower.includes('tratamiento') || nameLower.includes('rímel') || nameLower.includes('rimel') || nameLower.includes('suero')) {
        return 'Tratamiento, Suero y Cuidado de Cejas y Pestañas';
    }
    return `${product.category} Cosmético Profesional y Mayoreo`;
}

export function buildOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': ['Organization', 'Brand'],
        name: 'J. Denis Cosméticos',
        alternateName: ['JDennis', 'J. Denis México', 'J Denis Lash & Brow'],
        url: 'https://jdenis.store',
        logo: 'https://jdenis.store/logo-new.jpeg',
        description: 'Fabricante nacional mexicano líder desde 1998 en cosméticos profesionales para cejas y pestañas: rubor y sombra de henna para cejas, pigmentos, gel fijador y planchado de cejas, lash lifting con cisteamina e insumos por mayoreo en todo México.',
        foundingDate: '1998',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Av. Montevideo #136, Col. Lindavista',
            addressLocality: 'Gustavo A. Madero, Ciudad de México',
            addressRegion: 'CDMX',
            postalCode: '07300',
            addressCountry: 'MX',
        },
        contactPoint: [
            {
                '@type': 'ContactPoint',
                telephone: '+52-55-5754-5568',
                contactType: 'sales',
                areaServed: 'MX',
                availableLanguage: ['Spanish'],
            },
        ],
        sameAs: [
            'https://www.instagram.com/jdenisoficial',
            'https://www.facebook.com/jdenisoficial',
        ],
    };
}
