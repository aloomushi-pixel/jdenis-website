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
    '21403ce0-8bde-4350-973c-8bbd7fbe7b39': {
        metaTitle: 'Extensiones de Pestañas Curva LC Profesional por Blíster | J. Denis México',
        metaDescription: 'Blíster de Extensiones de Pestañas Curva LC J. Denis. Efecto delineado lifting ideal para párpado encapotado y mirada felina (Foxy Eye). Insumos profesionales directo de fábrica.',
        extraFaqs: [
            {
                question: '¿Qué ventaja tiene la Curva LC en extensiones de pestañas?',
                answer: 'La Curva LC tiene una base recta con elevación pronunciada que supera el pliegue del párpado encapotado y ofrece mayor superficie de contacto con el adhesivo para máxima retención.',
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
