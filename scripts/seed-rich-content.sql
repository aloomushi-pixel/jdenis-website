-- Auto-generated seed: Rich content for products table
-- Generated: 2026-02-20T13:52:31.379Z
-- Source: website/src/data/products.ts
-- Products: 318 | Variant Groups: 17

BEGIN;

-- Product: Kit Lash Lifting Profesional J.Denis
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'kit-lash-lifting-profesional',
  'Kit Lash Lifting Profesional J.Denis',
  850,
  950,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-1024-1024.webp',
  'Lash Lifting',
  true,
  'Realza la belleza natural de tus pestañas. Eleva, alisa y engrosa tus pestañas desde la base, logrando un efecto de mayor longitud y curvatura de manera natural. Su fórmula hipoalergénica es segura y suave, proporcionando resultados duraderos.',
  '{"Pestañas visiblemente más largas sin extensiones","Curvatura natural y duradera","Seguro para todo tipo de pestañas gracias a su fórmula hipoalergénica","Fácil aplicación con resultados profesionales"}',
  '{"Crema Lash Lifting","Crema Fijadora","Loción Limpiadora","Loción Vitaminada","Pigmento para Pestañas","Reactor para pigmento","Gel Reestructurante","5 Lifting Pads (SS, S, M, L, LL)","Adhesivo para pads","Máscara en Gel Acondicionadora","20 Protectores de Párpados","10 Aplicadores con espátula","4 Microcepillos","4 Cepillos para Pestañas","2 Anillos","10 Contenedores"}',
  'Hasta 35 aplicaciones',
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting","Tratamientos"}',
  950,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Realza la belleza natural de tus pestañas. Eleva, alisa y engrosa tus pestañas desde la base, logrando un efecto de mayor longitud y curvatura de manera natural. Su fórmula hipoalergénica es segura y suave, proporcionando resultados duraderos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-1024-1024.webp',
  benefits = '{"Pestañas visiblemente más largas sin extensiones","Curvatura natural y duradera","Seguro para todo tipo de pestañas gracias a su fórmula hipoalergénica","Fácil aplicación con resultados profesionales"}',
  includes = '{"Crema Lash Lifting","Crema Fijadora","Loción Limpiadora","Loción Vitaminada","Pigmento para Pestañas","Reactor para pigmento","Gel Reestructurante","5 Lifting Pads (SS, S, M, L, LL)","Adhesivo para pads","Máscara en Gel Acondicionadora","20 Protectores de Párpados","10 Aplicadores con espátula","4 Microcepillos","4 Cepillos para Pestañas","2 Anillos","10 Contenedores"}',
  performance = 'Hasta 35 aplicaciones',
  related_categories = '{"Lash Lifting","Tratamientos"}',
  original_price = 950,
  updated_at = CURRENT_TIMESTAMP;

-- Product: BLUE Lash Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'blue-lash-lifting',
  'BLUE Lash Lifting',
  500,
  600,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/blue_mesa-de-trabajo-11-9092542207219bc30316691308859785-1024-1024.webp',
  'Lash Lifting',
  true,
  'Kit profesional de Lash Lifting BLUE con rendimiento extendido. Incluye pads de silicón reutilizables y geles de alta calidad para un lifting perfecto.',
  '{"Rendimiento extendido para mayor rentabilidad","Pads de silicón reutilizables","Geles de alta calidad profesional","Resultados naturales y duraderos"}',
  '{"Gel Ondulante BLUE","Gel Neutralizante BLUE","Gel Reestructurante","Pads de silicón reutilizables (varios tamaños)","Adhesivo para rulos BLUE","Limpiador de Impurezas BLUE","Herramientas de aplicación"}',
  'Hasta 60 aplicaciones',
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  600,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Kit profesional de Lash Lifting BLUE con rendimiento extendido. Incluye pads de silicón reutilizables y geles de alta calidad para un lifting perfecto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/blue_mesa-de-trabajo-11-9092542207219bc30316691308859785-1024-1024.webp',
  benefits = '{"Rendimiento extendido para mayor rentabilidad","Pads de silicón reutilizables","Geles de alta calidad profesional","Resultados naturales y duraderos"}',
  includes = '{"Gel Ondulante BLUE","Gel Neutralizante BLUE","Gel Reestructurante","Pads de silicón reutilizables (varios tamaños)","Adhesivo para rulos BLUE","Limpiador de Impurezas BLUE","Herramientas de aplicación"}',
  performance = 'Hasta 60 aplicaciones',
  related_categories = '{"Lash Lifting"}',
  original_price = 600,
  updated_at = CURRENT_TIMESTAMP;

-- Product: Crema Lash Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'crema-lifting-paso-1',
  'Crema Lash Lifting',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/lifind-031-646dca838619ceeaa016687969981669-1024-1024.webp',
  'Lash Lifting',
  false,
  'Paso inicial (1) para el moldeado químico del vello. Fórmula hipoalergénica con pH controlado que suaviza la estructura del cabello para lograr la nueva forma deseada.',
  '{}',
  '{}',
  NULL,
  '{"Paso 1 del sistema Lash Lifting","pH controlado","Fórmula hipoalergénica","Para uso profesional"}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Paso inicial (1) para el moldeado químico del vello. Fórmula hipoalergénica con pH controlado que suaviza la estructura del cabello para lograr la nueva forma deseada.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/lifind-031-646dca838619ceeaa016687969981669-1024-1024.webp',
  specifications = '{"Paso 1 del sistema Lash Lifting","pH controlado","Fórmula hipoalergénica","Para uso profesional"}',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Crema Lash Lifting Fijadora
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'crema-fijadora-paso-2',
  'Crema Lash Lifting Fijadora',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/lifind-041-e3cde4a2a43cc5e8cd16687971742837-1024-1024.webp',
  'Lash Lifting',
  false,
  'Paso final (2) con pH controlado para sellar la nueva forma sin dañar la cutícula. Fija el rizo de forma permanente y duradera.',
  '{}',
  '{}',
  NULL,
  '{"Paso 2 del sistema Lash Lifting","pH controlado","Sella sin dañar la cutícula","Fijación permanente"}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Paso final (2) con pH controlado para sellar la nueva forma sin dañar la cutícula. Fija el rizo de forma permanente y duradera.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/lifind-041-e3cde4a2a43cc5e8cd16687971742837-1024-1024.webp',
  specifications = '{"Paso 2 del sistema Lash Lifting","pH controlado","Sella sin dañar la cutícula","Fijación permanente"}',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Adhesivo Individual para Pads - Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'adhesivo-pads-lifting',
  'Adhesivo Individual para Pads - Lifting',
  380,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/ind_mesa-de-trabajo-11-dfc574ad69672ed3c216687966538196-1024-1024.webp',
  'Lash Lifting',
  false,
  'Adhesivo individual especializado para pads de lifting. Fijación precisa y segura para procedimientos profesionales de lash lifting.',
  '{}',
  '{}',
  NULL,
  '{"Fijación precisa para pads","Uso profesional","Compatible con todos los pads J.Denis"}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Adhesivo individual especializado para pads de lifting. Fijación precisa y segura para procedimientos profesionales de lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/ind_mesa-de-trabajo-11-dfc574ad69672ed3c216687966538196-1024-1024.webp',
  specifications = '{"Fijación precisa para pads","Uso profesional","Compatible con todos los pads J.Denis"}',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Peine para Lash Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'peine-lash-lifting',
  'Peine para Lash Lifting',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Lash Lifting',
  false,
  'Peine profesional diseñado específicamente para procedimientos de lash lifting. Permite separar y distribuir las pestañas de forma uniforme sobre el pad.',
  '{}',
  '{}',
  NULL,
  '{"Diseño ergonómico","Dientes finos de precisión","Ideal para separar pestañas sobre el pad"}',
  '{}',
  NULL,
  '{"Lash Lifting","Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Peine profesional diseñado específicamente para procedimientos de lash lifting. Permite separar y distribuir las pestañas de forma uniforme sobre el pad.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  specifications = '{"Diseño ergonómico","Dientes finos de precisión","Ideal para separar pestañas sobre el pad"}',
  related_categories = '{"Lash Lifting","Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Rosas con Micro Canales
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-rosas-micro-canales',
  'Pad Rosas con Micro Canales',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  'Lash Lifting',
  false,
  'Pads de silicón premium con micro canales que facilitan la separación y elevación de las pestañas. Tecnología avanzada para resultados uniformes y profesionales.',
  '{"Micro canales para mejor separación de pestañas","Silicón de alta calidad reutilizable","Múltiples tamaños en un paquete","Fácil limpieza y desinfección"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pads de silicón premium con micro canales que facilitan la separación y elevación de las pestañas. Tecnología avanzada para resultados uniformes y profesionales.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  benefits = '{"Micro canales para mejor separación de pestañas","Silicón de alta calidad reutilizable","Múltiples tamaños en un paquete","Fácil limpieza y desinfección"}',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Nube
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-nube',
  'Pad Nube',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2019-02-09-a-las-20-04-021-39c0aa667e05a80ed715497643400355-1024-1024.webp',
  'Lash Lifting',
  false,
  'Pad ultra suave con forma de nube para lash lifting. Diseño ergonómico que se adapta a la curvatura natural del párpado para resultados perfectos.',
  '{"Forma ergonómica tipo nube","Ultra suave para máximo confort","Se adapta a la curvatura del párpado"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad ultra suave con forma de nube para lash lifting. Diseño ergonómico que se adapta a la curvatura natural del párpado para resultados perfectos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2019-02-09-a-las-20-04-021-39c0aa667e05a80ed715497643400355-1024-1024.webp',
  benefits = '{"Forma ergonómica tipo nube","Ultra suave para máximo confort","Se adapta a la curvatura del párpado"}',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Anime
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-anime',
  'Pad Anime',
  250,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/anime-05-6e0e314c9e7228afe817410095004166-1024-1024.webp',
  'Lash Lifting',
  false,
  'Pad especial estilo Anime para crear un efecto de pestañas ultra abiertas y dramáticas. Ideal para looks artísticos y dramáticos.',
  '{"Efecto de pestañas ultra abiertas","Look dramático estilo anime","Silicón de alta calidad","Reutilizable"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad especial estilo Anime para crear un efecto de pestañas ultra abiertas y dramáticas. Ideal para looks artísticos y dramáticos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/anime-05-6e0e314c9e7228afe817410095004166-1024-1024.webp',
  benefits = '{"Efecto de pestañas ultra abiertas","Look dramático estilo anime","Silicón de alta calidad","Reutilizable"}',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Brow Henna
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'kit-brow-henna',
  'Brow Henna',
  1200,
  1400,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/brow-henna-061-fbdb257619cce9e95d16669249148944-1024-1024.webp',
  'Brow Henna',
  true,
  'Una alternativa natural para sombrear las cejas. Derivado de la planta de Henna, en 30 minutos deja un efecto de tatuaje en la piel y recubre el vello de las cejas dando una apariencia de mayor abundancia. No contiene amoniaco, plomo, ni peróxido.',
  '{"Efecto tatuaje natural en la piel","Sin amoniaco, plomo ni peróxido","Mayor apariencia de abundancia en cejas","Duración de 3 a 10 días según cuidado","Alternativa no invasiva al microblading"}',
  '{"Henna Castaño Obscuro (30 aplicaciones)","Henna Castaño Medio (30 aplicaciones)","Henna Castaño Claro (30 aplicaciones)","Primer exfoliante para cejas","Activador para polvo Henna","Regla de 20 cm","Lápiz para diseño de cejas","Recipiente mezclador","6 Plantillas para cejas","4 Cepillos para cejas","4 Microbrush","3 Perfiladores para delinear"}',
  'Hasta 90 aplicaciones totales (30 por tono)',
  '{}',
  '{}',
  NULL,
  '{"Brow Henna","Diseño de Cejas"}',
  1400,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Una alternativa natural para sombrear las cejas. Derivado de la planta de Henna, en 30 minutos deja un efecto de tatuaje en la piel y recubre el vello de las cejas dando una apariencia de mayor abundancia. No contiene amoniaco, plomo, ni peróxido.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/brow-henna-061-fbdb257619cce9e95d16669249148944-1024-1024.webp',
  benefits = '{"Efecto tatuaje natural en la piel","Sin amoniaco, plomo ni peróxido","Mayor apariencia de abundancia en cejas","Duración de 3 a 10 días según cuidado","Alternativa no invasiva al microblading"}',
  includes = '{"Henna Castaño Obscuro (30 aplicaciones)","Henna Castaño Medio (30 aplicaciones)","Henna Castaño Claro (30 aplicaciones)","Primer exfoliante para cejas","Activador para polvo Henna","Regla de 20 cm","Lápiz para diseño de cejas","Recipiente mezclador","6 Plantillas para cejas","4 Cepillos para cejas","4 Microbrush","3 Perfiladores para delinear"}',
  performance = 'Hasta 90 aplicaciones totales (30 por tono)',
  related_categories = '{"Brow Henna","Diseño de Cejas"}',
  original_price = 1400,
  updated_at = CURRENT_TIMESTAMP;

-- Product: Activador de Henna
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'activador-henna',
  'Activador de Henna',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/activador-henna-2-2398d7caec1193296817558879257390-1024-1024.webp',
  'Brow Henna',
  false,
  'Activador líquido esencial para la preparación del polvo de henna. Contenido de 50 ml. Mezclado con el polvo de henna, permite obtener la consistencia perfecta para la aplicación.',
  '{}',
  '{}',
  NULL,
  '{"Contenido: 50 ml","Compatible con todos los polvos Henna J.Denis","Fácil dosificación"}',
  '{}',
  NULL,
  '{"Brow Henna"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Activador líquido esencial para la preparación del polvo de henna. Contenido de 50 ml. Mezclado con el polvo de henna, permite obtener la consistencia perfecta para la aplicación.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/activador-henna-2-2398d7caec1193296817558879257390-1024-1024.webp',
  specifications = '{"Contenido: 50 ml","Compatible con todos los polvos Henna J.Denis","Fácil dosificación"}',
  related_categories = '{"Brow Henna"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Henna Directa
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'henna-directa-brown',
  'Henna Directa',
  370,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/brow-henna-061-fbdb257619cce9e95d16669249148944-1024-1024.webp',
  'Brow Henna',
  false,
  'Henna de aplicación directa sin mezcla compleja. Disponible en Medium Brown, Dark Brown y Black. Fórmula lista para usar con resultados inmediatos.',
  '{"Aplicación directa sin mezclas","Disponible en 3 tonos","Resultados inmediatos","Fácil de usar"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Brow Henna"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Henna de aplicación directa sin mezcla compleja. Disponible en Medium Brown, Dark Brown y Black. Fórmula lista para usar con resultados inmediatos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/brow-henna-061-fbdb257619cce9e95d16669249148944-1024-1024.webp',
  benefits = '{"Aplicación directa sin mezclas","Disponible en 3 tonos","Resultados inmediatos","Fácil de usar"}',
  related_categories = '{"Brow Henna"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Arco para Diseño de Cejas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'arco-diseno-cejas',
  'Arco para Diseño de Cejas',
  200,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/arco-hilo_000131-98d2fedde55c00a63616035616219256-1024-1024.webp',
  'Diseño de Cejas',
  false,
  'Arco profesional para diseño y medición perfecta de cejas. Herramienta esencial para simetría y proporción en el diseño profesional.',
  '{}',
  '{}',
  NULL,
  '{"Material de alta durabilidad","Mediciones precisas","Ideal para diseño simétrico"}',
  '{}',
  NULL,
  '{"Diseño de Cejas","Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Arco profesional para diseño y medición perfecta de cejas. Herramienta esencial para simetría y proporción en el diseño profesional.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/arco-hilo_000131-98d2fedde55c00a63616035616219256-1024-1024.webp',
  specifications = '{"Material de alta durabilidad","Mediciones precisas","Ideal para diseño simétrico"}',
  related_categories = '{"Diseño de Cejas","Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Lápiz de Cera
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'lapiz-cera',
  'Lápiz de Cera',
  70,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/mesa-de-trabajo-21-5623fc474fe25629fd16687989657552-1024-1024.webp',
  'Diseño de Cejas',
  false,
  'Lápiz de cera profesional para delinear y diseñar cejas con precisión. Trazo suave y definido que marca el diseño deseado antes del procedimiento.',
  '{}',
  '{}',
  NULL,
  '{"Trazo suave y preciso","Ideal para marcar diseño","Fácil de limpiar"}',
  '{}',
  NULL,
  '{"Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Lápiz de cera profesional para delinear y diseñar cejas con precisión. Trazo suave y definido que marca el diseño deseado antes del procedimiento.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/mesa-de-trabajo-21-5623fc474fe25629fd16687989657552-1024-1024.webp',
  specifications = '{"Trazo suave y preciso","Ideal para marcar diseño","Fácil de limpiar"}',
  related_categories = '{"Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Laminado de Cejas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'laminado-cejas',
  'Laminado de Cejas',
  200,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/diseno-021-ca4a861d525c316b2d16669243762302-1024-1024.webp',
  'Diseño de Cejas',
  true,
  'Sistema para moldear y fijar cejas rebeldes. Logra un efecto de cejas perfectamente peinadas y disciplinadas con resultados duraderos.',
  '{"Moldea cejas rebeldes","Efecto de cejas perfectamente peinadas","Fijación duradera","Resultados profesionales"}',
  '{"Gel Planchador","Gel Fijador","Gel Reestructurante","Cepillos para cejas"}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Diseño de Cejas","Brow Henna"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Sistema para moldear y fijar cejas rebeldes. Logra un efecto de cejas perfectamente peinadas y disciplinadas con resultados duraderos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/diseno-021-ca4a861d525c316b2d16669243762302-1024-1024.webp',
  benefits = '{"Moldea cejas rebeldes","Efecto de cejas perfectamente peinadas","Fijación duradera","Resultados profesionales"}',
  includes = '{"Gel Planchador","Gel Fijador","Gel Reestructurante","Cepillos para cejas"}',
  related_categories = '{"Diseño de Cejas","Brow Henna"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Tintura Tópica - Castaño Medio
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'tintura-topica-castano-medio',
  'Tintura Tópica - Castaño Medio',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/pigmento-light-brown-31-5d8c78b2d2ba43be9e16671823980793-1024-1024.webp',
  'Pigmentos',
  false,
  'Tintura tópica profesional tono castaño medio para pestañas y cejas. Color natural y duradero ideal para clientas con tono de cabello medio.',
  '{}',
  '{}',
  NULL,
  '{"Tono: Castaño Medio","Para cejas y pestañas","Fórmula profesional","Larga duración"}',
  '{}',
  NULL,
  '{"Pigmentos","Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Tintura tópica profesional tono castaño medio para pestañas y cejas. Color natural y duradero ideal para clientas con tono de cabello medio.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/pigmento-light-brown-31-5d8c78b2d2ba43be9e16671823980793-1024-1024.webp',
  specifications = '{"Tono: Castaño Medio","Para cejas y pestañas","Fórmula profesional","Larga duración"}',
  related_categories = '{"Pigmentos","Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Tintura Tópica - Castaño Oscuro
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'tintura-topica-castano-oscuro',
  'Tintura Tópica - Castaño Oscuro',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/pig-071-10ea3ab254a18fa68516691314001398-1024-1024.webp',
  'Pigmentos',
  false,
  'Tintura tópica profesional tono castaño oscuro para pestañas y cejas. Color intenso y duradero ideal para clientas con tono de cabello oscuro.',
  '{}',
  '{}',
  NULL,
  '{"Tono: Castaño Oscuro","Color intenso y duradero","Para cejas y pestañas","Fórmula profesional"}',
  '{}',
  NULL,
  '{"Pigmentos","Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Tintura tópica profesional tono castaño oscuro para pestañas y cejas. Color intenso y duradero ideal para clientas con tono de cabello oscuro.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/pig-071-10ea3ab254a18fa68516691314001398-1024-1024.webp',
  specifications = '{"Tono: Castaño Oscuro","Color intenso y duradero","Para cejas y pestañas","Fórmula profesional"}',
  related_categories = '{"Pigmentos","Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pigmento para Pestañas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pigmento-pestanas',
  'Pigmento para Pestañas',
  200,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/pigmento-pestanas-21-75321496155008e18a16671825880489-1024-1024.webp',
  'Pigmentos',
  false,
  'Pigmento negro puro con keratina para tinturar pestañas. Fórmula enriquecida que colorea y fortalece al mismo tiempo.',
  '{"Color negro puro intenso","Enriquecido con keratina","Colorea y fortalece","Resultados profesionales duraderos"}',
  '{"Pigmento negro con keratina","Reactor para pigmento","Protectores de párpados"}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pigmentos","Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pigmento negro puro con keratina para tinturar pestañas. Fórmula enriquecida que colorea y fortalece al mismo tiempo.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/pigmento-pestanas-21-75321496155008e18a16671825880489-1024-1024.webp',
  benefits = '{"Color negro puro intenso","Enriquecido con keratina","Colorea y fortalece","Resultados profesionales duraderos"}',
  includes = '{"Pigmento negro con keratina","Reactor para pigmento","Protectores de párpados"}',
  related_categories = '{"Pigmentos","Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Chocolate Pigmento para Cejas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'chocolate-pigmento-cejas',
  'Chocolate Pigmento para Cejas',
  200,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-4_mesa-de-trabajo-111-c242d37fa4b290473b16687990494212-1024-1024.webp',
  'Pigmentos',
  false,
  'Pigmento tono chocolate para cejas. Color cálido y natural que se adapta a diversos tonos de piel y cabello. Ideal para un look natural y sofisticado.',
  '{}',
  '{}',
  NULL,
  '{"Tono: Chocolate","Color cálido y natural","Para cejas","Compatible con Brow Henna"}',
  '{}',
  NULL,
  '{"Pigmentos","Brow Henna"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pigmento tono chocolate para cejas. Color cálido y natural que se adapta a diversos tonos de piel y cabello. Ideal para un look natural y sofisticado.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-4_mesa-de-trabajo-111-c242d37fa4b290473b16687990494212-1024-1024.webp',
  specifications = '{"Tono: Chocolate","Color cálido y natural","Para cejas","Compatible con Brow Henna"}',
  related_categories = '{"Pigmentos","Brow Henna"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: JADE Rizado de Pestañas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'jade-rizado-pestanas',
  'JADE Rizado de Pestañas',
  250,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/rizado-jade-11-ac3bb9dfd4f533b09316671818885563-1024-1024.webp',
  'Lash Curling',
  true,
  'Kit completo para rizado permanente de pestañas. Sistema profesional que crea una curvatura natural y duradera en las pestañas naturales.',
  '{"Rizado permanente natural","Kit completo listo para usar","Fórmula suave y segura","Resultados profesionales"}',
  '{"Adhesivo para rizado","Gel ondulante","Gel neutralizante","Rulos en diferentes tamaños","Herramientas de aplicación"}',
  'Hasta 30 aplicaciones',
  '{}',
  '{}',
  NULL,
  '{"Lash Curling","Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Kit completo para rizado permanente de pestañas. Sistema profesional que crea una curvatura natural y duradera en las pestañas naturales.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/rizado-jade-11-ac3bb9dfd4f533b09316671818885563-1024-1024.webp',
  benefits = '{"Rizado permanente natural","Kit completo listo para usar","Fórmula suave y segura","Resultados profesionales"}',
  includes = '{"Adhesivo para rizado","Gel ondulante","Gel neutralizante","Rulos en diferentes tamaños","Herramientas de aplicación"}',
  performance = 'Hasta 30 aplicaciones',
  related_categories = '{"Lash Curling","Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Rulos Desechables Curva Media M
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'rulos-desechables-m',
  'Rulos Desechables Curva Media M',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-041-c63eba028c157f5cb716669736468826-1024-1024.webp',
  'Lash Curling',
  false,
  'Rulos desechables de curva media tamaño M. Ideales para crear una curvatura natural y elegante en pestañas de longitud media.',
  '{}',
  '{}',
  NULL,
  '{"Tamaño: M (Curva Media)","Desechables para máxima higiene","Silicón de alta calidad"}',
  '{}',
  NULL,
  '{"Lash Curling","Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Rulos desechables de curva media tamaño M. Ideales para crear una curvatura natural y elegante en pestañas de longitud media.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-041-c63eba028c157f5cb716669736468826-1024-1024.webp',
  specifications = '{"Tamaño: M (Curva Media)","Desechables para máxima higiene","Silicón de alta calidad"}',
  related_categories = '{"Lash Curling","Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Rulos Desechables Curva Corta CH
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'rulos-desechables-ch',
  'Rulos Desechables Curva Corta CH',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-071-f0552b059105e2a53d16669736033613-1024-1024.webp',
  'Lash Curling',
  false,
  'Rulos desechables de curva corta tamaño CH. Ideales para pestañas cortas o para crear una curvatura más dramática.',
  '{}',
  '{}',
  NULL,
  '{"Tamaño: CH (Curva Corta)","Desechables para máxima higiene","Ideal para pestañas cortas"}',
  '{}',
  NULL,
  '{"Lash Curling","Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Rulos desechables de curva corta tamaño CH. Ideales para pestañas cortas o para crear una curvatura más dramática.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-071-f0552b059105e2a53d16669736033613-1024-1024.webp',
  specifications = '{"Tamaño: CH (Curva Corta)","Desechables para máxima higiene","Ideal para pestañas cortas"}',
  related_categories = '{"Lash Curling","Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Rulos Desechables Curva Amplia G
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'rulos-desechables-g',
  'Rulos Desechables Curva Amplia G',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1_mesa-de-trabajo-11-f490e5702841a57b1616669735647217-1024-1024.webp',
  'Lash Curling',
  false,
  'Rulos desechables de curva amplia tamaño G. Perfectos para pestañas largas o para un lifting más sutil y natural.',
  '{}',
  '{}',
  NULL,
  '{"Tamaño: G (Curva Amplia)","Desechables para máxima higiene","Ideal para pestañas largas"}',
  '{}',
  NULL,
  '{"Lash Curling","Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Rulos desechables de curva amplia tamaño G. Perfectos para pestañas largas o para un lifting más sutil y natural.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1_mesa-de-trabajo-11-f490e5702841a57b1616669735647217-1024-1024.webp',
  specifications = '{"Tamaño: G (Curva Amplia)","Desechables para máxima higiene","Ideal para pestañas largas"}',
  related_categories = '{"Lash Curling","Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Rulos Adhesivos Curva G
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'rulos-adhesivos-curva-g',
  'Rulos Adhesivos Curva G',
  70,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/53-rulos-adhesivos-031-2ade2563ab84da548d15314940318959-1024-1024.webp',
  'Lash Curling',
  false,
  'Rulos con adhesivo integrado curva G. Se adhieren directamente al párpado sin necesidad de adhesivo adicional. Reutilizables.',
  '{}',
  '{}',
  NULL,
  '{"Adhesivo integrado","Curva G (Amplia)","Reutilizables","Sin adhesivo adicional"}',
  '{}',
  NULL,
  '{"Lash Curling"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Rulos con adhesivo integrado curva G. Se adhieren directamente al párpado sin necesidad de adhesivo adicional. Reutilizables.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/53-rulos-adhesivos-031-2ade2563ab84da548d15314940318959-1024-1024.webp',
  specifications = '{"Adhesivo integrado","Curva G (Amplia)","Reutilizables","Sin adhesivo adicional"}',
  related_categories = '{"Lash Curling"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestaña Super Volume
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-super-volume',
  'Pestaña Super Volume',
  380,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/pestana-flat-6-67059c90c476666e3217112091825676-1024-1024.webp',
  'Extensiones',
  false,
  'Línea premium para técnicas de abanicos 2D a 6D. Máxima ligereza y suavidad. Ideal para volumen ruso con acabado profesional impecable.',
  '{"Ultra livianas para técnica de abanicos","Compatibles con técnicas 2D a 6D","Máxima suavidad y comodidad","Acabado profesional natural"}',
  '{}',
  NULL,
  '{"Técnica: Volumen ruso","Tipo: Super Volume","Material: Fibra PBT premium"}',
  '{}',
  NULL,
  '{"Extensiones","Adhesivos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Línea premium para técnicas de abanicos 2D a 6D. Máxima ligereza y suavidad. Ideal para volumen ruso con acabado profesional impecable.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/pestana-flat-6-67059c90c476666e3217112091825676-1024-1024.webp',
  benefits = '{"Ultra livianas para técnica de abanicos","Compatibles con técnicas 2D a 6D","Máxima suavidad y comodidad","Acabado profesional natural"}',
  specifications = '{"Técnica: Volumen ruso","Tipo: Super Volume","Material: Fibra PBT premium"}',
  related_categories = '{"Extensiones","Adhesivos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestañas Mink Curva C
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-mink-curva-c',
  'Pestañas Mink Curva C',
  280,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/jdc15co-0211-60d5279f4e8338fe8a15330550618599-1024-1024.webp',
  'Extensiones',
  false,
  'Pestañas de visón sintético de alta calidad. Curva C con acabado natural y elegante. Disponible en grosores 0.07, 0.10, 0.12, 0.15mm.',
  '{}',
  '{}',
  NULL,
  '{"Curva: C","Grosores: 0.07, 0.10, 0.12, 0.15mm","Material: Mink sintético premium","Acabado natural"}',
  '{}',
  NULL,
  '{"Extensiones","Adhesivos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestañas de visón sintético de alta calidad. Curva C con acabado natural y elegante. Disponible en grosores 0.07, 0.10, 0.12, 0.15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/jdc15co-0211-60d5279f4e8338fe8a15330550618599-1024-1024.webp',
  specifications = '{"Curva: C","Grosores: 0.07, 0.10, 0.12, 0.15mm","Material: Mink sintético premium","Acabado natural"}',
  related_categories = '{"Extensiones","Adhesivos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestañas Mink Curva D
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-mink-curva-d',
  'Pestañas Mink Curva D',
  280,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/pes-d-015-11-53f06c333b890ae6c416577544212430-1024-1024.webp',
  'Extensiones',
  false,
  'Pestañas de visón sintético de alta calidad. Curva D dramática para un efecto más abierto y llamativo.',
  '{}',
  '{}',
  NULL,
  '{"Curva: D (dramática)","Múltiples longitudes disponibles","Material: Mink sintético premium","Efecto abierto y llamativo"}',
  '{}',
  NULL,
  '{"Extensiones","Adhesivos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestañas de visón sintético de alta calidad. Curva D dramática para un efecto más abierto y llamativo.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/pes-d-015-11-53f06c333b890ae6c416577544212430-1024-1024.webp',
  specifications = '{"Curva: D (dramática)","Múltiples longitudes disponibles","Material: Mink sintético premium","Efecto abierto y llamativo"}',
  related_categories = '{"Extensiones","Adhesivos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestañas Volumen Gold
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-gold-volumen',
  'Pestañas Volumen Gold',
  360,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/gob05c-0111-5aff9bdf2451c13d3f15329792899738-1024-1024.webp',
  'Extensiones',
  false,
  'Línea Gold premium para técnicas de volumen ruso. Ultra livianas con la mejor calidad de fibra para una aplicación perfecta.',
  '{"Línea Gold premium","Ultra livianas para volumen ruso","Fibra de la más alta calidad","Aplicación perfecta"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones","Adhesivos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Línea Gold premium para técnicas de volumen ruso. Ultra livianas con la mejor calidad de fibra para una aplicación perfecta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/gob05c-0111-5aff9bdf2451c13d3f15329792899738-1024-1024.webp',
  benefits = '{"Línea Gold premium","Ultra livianas para volumen ruso","Fibra de la más alta calidad","Aplicación perfecta"}',
  related_categories = '{"Extensiones","Adhesivos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Extensiones en Grupo PRO
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'extensiones-grupo-pro',
  'Extensiones en Grupo PRO',
  360,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-21_mesa-de-trabajo-11-285849cb951c114fde15856909430891-1024-1024.webp',
  'Extensiones',
  false,
  'Extensiones de pestañas en grupo para aplicación profesional. Pre-formadas para una aplicación rápida y uniforme con efecto natural.',
  '{"Pre-formadas para aplicación rápida","Efecto natural y uniforme","Ideal para técnica clásica avanzada","Fibra de alta calidad"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones","Adhesivos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones de pestañas en grupo para aplicación profesional. Pre-formadas para una aplicación rápida y uniforme con efecto natural.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-21_mesa-de-trabajo-11-285849cb951c114fde15856909430891-1024-1024.webp',
  benefits = '{"Pre-formadas para aplicación rápida","Efecto natural y uniforme","Ideal para técnica clásica avanzada","Fibra de alta calidad"}',
  related_categories = '{"Extensiones","Adhesivos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Base para Pestañas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'base-pestanas',
  'Base para Pestañas',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/base-031-a0f3cbfe23723e3c4f16691451059225-1024-1024.webp',
  'Extensiones',
  false,
  'Base protectora para pestañas. Prepara las pestañas naturales antes de la aplicación de extensiones, mejorando la adherencia y protegiendo la fibra natural.',
  '{}',
  '{}',
  NULL,
  '{"Prepara la pestaña natural","Mejora la adherencia","Protege la fibra natural"}',
  '{}',
  NULL,
  '{"Extensiones","Adhesivos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Base protectora para pestañas. Prepara las pestañas naturales antes de la aplicación de extensiones, mejorando la adherencia y protegiendo la fibra natural.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/base-031-a0f3cbfe23723e3c4f16691451059225-1024-1024.webp',
  specifications = '{"Prepara la pestaña natural","Mejora la adherencia","Protege la fibra natural"}',
  related_categories = '{"Extensiones","Adhesivos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Adhesivo Supreme G4
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'adhesivo-supreme-g4',
  'Adhesivo Supreme G4',
  450,
  550,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-11-07-a-las-21-36-331-dbf626e4d91ead894e16678787549429-1024-1024.webp',
  'Adhesivos',
  false,
  'Adhesivo de alta viscosidad y secado rápido (1-2 seg). Ideal para técnica clásica y volumen. Duración de 6 a 8 semanas con cuidado adecuado.',
  '{"Secado rápido 1-2 segundos","Alta viscosidad para control perfecto","Duración 6-8 semanas","Hipoalergénico"}',
  '{}',
  NULL,
  '{"Secado: 1-2 segundos","Duración: 6-8 semanas","Para técnica clásica y volumen","Color: Negro"}',
  '{}',
  NULL,
  '{"Adhesivos","Extensiones"}',
  550,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Adhesivo de alta viscosidad y secado rápido (1-2 seg). Ideal para técnica clásica y volumen. Duración de 6 a 8 semanas con cuidado adecuado.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-11-07-a-las-21-36-331-dbf626e4d91ead894e16678787549429-1024-1024.webp',
  benefits = '{"Secado rápido 1-2 segundos","Alta viscosidad para control perfecto","Duración 6-8 semanas","Hipoalergénico"}',
  specifications = '{"Secado: 1-2 segundos","Duración: 6-8 semanas","Para técnica clásica y volumen","Color: Negro"}',
  related_categories = '{"Adhesivos","Extensiones"}',
  original_price = 550,
  updated_at = CURRENT_TIMESTAMP;

-- Product: Adhesivo Volumen
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'adhesivo-volumen',
  'Adhesivo Volumen',
  250,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/vol_mesa-de-trabajo-11-d61661ecf8820a785a16669241686028-1024-1024.webp',
  'Adhesivos',
  false,
  'Adhesivo Supreme para técnica de Volumen. Secado instantáneo, color negro intenso. Ideal para volumen 1 a 1, técnica japonesa, volumen ruso y pestañas dimensionales.',
  '{"Tiempo de secado instantáneo","Color negro intenso profesional","Alta resistencia al agua y humedad","Larga duración","Hipoalergénico para ojos sensibles","Textura de consistencia media"}',
  '{"Presentación de 8 ml"}',
  NULL,
  '{"Ingrediente principal: Ethyl-2-Cyanocrylate (grado médico)","Alcoxi-2-cianoacrilato para flexibilidad","PMMA para control de fijación","Negro de carbón 100% seguro"}',
  '{}',
  NULL,
  '{"Adhesivos","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Adhesivo Supreme para técnica de Volumen. Secado instantáneo, color negro intenso. Ideal para volumen 1 a 1, técnica japonesa, volumen ruso y pestañas dimensionales.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/vol_mesa-de-trabajo-11-d61661ecf8820a785a16669241686028-1024-1024.webp',
  benefits = '{"Tiempo de secado instantáneo","Color negro intenso profesional","Alta resistencia al agua y humedad","Larga duración","Hipoalergénico para ojos sensibles","Textura de consistencia media"}',
  includes = '{"Presentación de 8 ml"}',
  specifications = '{"Ingrediente principal: Ethyl-2-Cyanocrylate (grado médico)","Alcoxi-2-cianoacrilato para flexibilidad","PMMA para control de fijación","Negro de carbón 100% seguro"}',
  related_categories = '{"Adhesivos","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: After Care
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'after-care',
  'After Care',
  600,
  700,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/vitamina-011-556c65fa50decd1e2a15494016039704-1024-1024.webp',
  'Tratamientos',
  false,
  'Tratamiento post-procedimiento para el cuidado y recuperación de pestañas y cejas. Hidrata, fortalece y protege la fibra natural después de cualquier procedimiento.',
  '{"Hidrata profundamente","Fortalece las pestañas naturales","Protege después del procedimiento","Uso diario recomendado"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Tratamientos","Lash Lifting"}',
  700,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Tratamiento post-procedimiento para el cuidado y recuperación de pestañas y cejas. Hidrata, fortalece y protege la fibra natural después de cualquier procedimiento.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/vitamina-011-556c65fa50decd1e2a15494016039704-1024-1024.webp',
  benefits = '{"Hidrata profundamente","Fortalece las pestañas naturales","Protege después del procedimiento","Uso diario recomendado"}',
  related_categories = '{"Tratamientos","Lash Lifting"}',
  original_price = 700,
  updated_at = CURRENT_TIMESTAMP;

-- Product: Máscara Acondicionadora de Pestañas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'mascara-acondicionadora',
  'Máscara Acondicionadora de Pestañas',
  120,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/mascara-con-queratina-y-vitamina-e-4-e0ac482677b85eddc017695390879846-1024-1024.webp',
  'Tratamientos',
  false,
  'Máscara acondicionadora que fortalece, nutre y alarga las pestañas naturales. Uso diario recomendado para resultados óptimos.',
  '{"Fortalece las pestañas","Nutre desde la raíz","Efecto alargador","Uso diario"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Tratamientos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Máscara acondicionadora que fortalece, nutre y alarga las pestañas naturales. Uso diario recomendado para resultados óptimos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/mascara-con-queratina-y-vitamina-e-4-e0ac482677b85eddc017695390879846-1024-1024.webp',
  benefits = '{"Fortalece las pestañas","Nutre desde la raíz","Efecto alargador","Uso diario"}',
  related_categories = '{"Tratamientos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Tratamiento Alargador para Cejas y Pestañas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'tratamiento-alargador',
  'Tratamiento Alargador para Cejas y Pestañas',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/vitamina-011-556c65fa50decd1e2a15494016039704-1024-1024.webp',
  'Tratamientos',
  true,
  'Reestructura, fortalece y alarga las pestañas y cejas en tan solo 4 semanas de uso continuo. Fórmula vitaminada para resultados visibles.',
  '{"Resultados visibles en 4 semanas","Reestructura la fibra capilar","Fortalece pestañas y cejas","Fórmula vitaminada"}',
  '{}',
  'Resultados visibles en 4 semanas',
  '{}',
  '{}',
  NULL,
  '{"Tratamientos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Reestructura, fortalece y alarga las pestañas y cejas en tan solo 4 semanas de uso continuo. Fórmula vitaminada para resultados visibles.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/vitamina-011-556c65fa50decd1e2a15494016039704-1024-1024.webp',
  benefits = '{"Resultados visibles en 4 semanas","Reestructura la fibra capilar","Fortalece pestañas y cejas","Fórmula vitaminada"}',
  performance = 'Resultados visibles en 4 semanas',
  related_categories = '{"Tratamientos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Perfilador Doble - Paquete de 3 Pzs
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'perfilador-doble',
  'Perfilador Doble - Paquete de 3 Pzs',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/mesa-de-trabajo-21-5623fc474fe25629fd16687989657552-1024-1024.webp',
  'Herramientas',
  false,
  'Perfilador doble de precisión. Paquete de 3 piezas para diseño y definición profesional de cejas. Doble punta para versatilidad.',
  '{}',
  '{}',
  NULL,
  '{"Paquete de 3 piezas","Doble punta","Para diseño profesional"}',
  '{}',
  NULL,
  '{"Herramientas","Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Perfilador doble de precisión. Paquete de 3 piezas para diseño y definición profesional de cejas. Doble punta para versatilidad.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/mesa-de-trabajo-21-5623fc474fe25629fd16687989657552-1024-1024.webp',
  specifications = '{"Paquete de 3 piezas","Doble punta","Para diseño profesional"}',
  related_categories = '{"Herramientas","Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Godete de Cristal
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'godete-cristal',
  'Godete de Cristal',
  295,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/81-cristal-redondo-grande-011-9e045060396cb69b3115856904456678-1024-1024.webp',
  'Herramientas',
  false,
  'Godete de cristal profesional para mezclas de pigmentos, tintes y adhesivos. Superficie lisa y fácil de limpiar. Ideal para trabajar con precisión.',
  '{}',
  '{}',
  NULL,
  '{"Cristal transparente de alta calidad","Superficie ultra lisa","Fácil limpieza y desinfección","Para mezclas de pigmentos y tintes"}',
  '{}',
  NULL,
  '{"Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Godete de cristal profesional para mezclas de pigmentos, tintes y adhesivos. Superficie lisa y fácil de limpiar. Ideal para trabajar con precisión.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/81-cristal-redondo-grande-011-9e045060396cb69b3115856904456678-1024-1024.webp',
  specifications = '{"Cristal transparente de alta calidad","Superficie ultra lisa","Fácil limpieza y desinfección","Para mezclas de pigmentos y tintes"}',
  related_categories = '{"Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Piedra de Jade
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'piedra-jade',
  'Piedra de Jade',
  80,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/piedra-jade-011-d010fed6068f57234f15494015022538-1024-1024.webp',
  'Herramientas',
  false,
  'Piedra de jade natural para depositar adhesivo durante la aplicación de extensiones de pestañas. Mantiene la temperatura del adhesivo estable.',
  '{}',
  '{}',
  NULL,
  '{"Jade natural","Mantiene temperatura estable del adhesivo","Superficie fría y lisa","Tamaño ergonómico"}',
  '{}',
  NULL,
  '{"Herramientas","Adhesivos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Piedra de jade natural para depositar adhesivo durante la aplicación de extensiones de pestañas. Mantiene la temperatura del adhesivo estable.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/piedra-jade-011-d010fed6068f57234f15494015022538-1024-1024.webp',
  specifications = '{"Jade natural","Mantiene temperatura estable del adhesivo","Superficie fría y lisa","Tamaño ergonómico"}',
  related_categories = '{"Herramientas","Adhesivos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Maniquí Microblading
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'maniqui-microblading',
  'Maniquí Microblading',
  300,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/h64fbe6378cc249cd88ae27bcf74d9993y1-108b75012dae3f992515856923521717-1024-1024.webp',
  'Herramientas',
  false,
  'Maniquí de práctica para perfeccionar la técnica de microblading. Piel realista para entrenar trazos y técnica antes de trabajar con clientes.',
  '{"Piel realista para práctica","Ideal para perfeccionar técnica","Reutilizable","Para principiantes y avanzados"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Microblading"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Maniquí de práctica para perfeccionar la técnica de microblading. Piel realista para entrenar trazos y técnica antes de trabajar con clientes.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/h64fbe6378cc249cd88ae27bcf74d9993y1-108b75012dae3f992515856923521717-1024-1024.webp',
  benefits = '{"Piel realista para práctica","Ideal para perfeccionar técnica","Reutilizable","Para principiantes y avanzados"}',
  related_categories = '{"Herramientas","Microblading"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Papel Térmico
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'papel-termico',
  'Papel Térmico',
  35,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/papel-termico-1-cf28baf56f9440056117582324679872-1024-1024.webp',
  'Herramientas',
  false,
  'Papel térmico para citas y recibos. Rollo compatible con impresoras térmicas estándar.',
  '{}',
  '{}',
  NULL,
  '{"Compatible con impresoras térmicas","Rollo estándar"}',
  '{}',
  NULL,
  '{"Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Papel térmico para citas y recibos. Rollo compatible con impresoras térmicas estándar.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/papel-termico-1-cf28baf56f9440056117582324679872-1024-1024.webp',
  specifications = '{"Compatible con impresoras térmicas","Rollo estándar"}',
  related_categories = '{"Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Lámpara Media Luna LED
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'lampara-media-luna',
  'Lámpara Media Luna LED',
  2600,
  3000,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/led-02-011-81a2bfd1118ab4719116813240087351-1024-1024.webp',
  'Accesorios',
  false,
  'Lámpara profesional LED de media luna con luz ajustable. Ideal para trabajo de precisión en extensiones de pestañas y procedimientos estéticos.',
  '{"Luz LED ajustable en intensidad","Diseño ergonómico media luna","Iluminación sin sombras","Para trabajo de precisión"}',
  '{}',
  NULL,
  '{"Tipo: LED","Forma: Media Luna","Intensidad ajustable","Bajo consumo energético"}',
  '{}',
  NULL,
  '{"Accesorios"}',
  3000,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Lámpara profesional LED de media luna con luz ajustable. Ideal para trabajo de precisión en extensiones de pestañas y procedimientos estéticos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/led-02-011-81a2bfd1118ab4719116813240087351-1024-1024.webp',
  benefits = '{"Luz LED ajustable en intensidad","Diseño ergonómico media luna","Iluminación sin sombras","Para trabajo de precisión"}',
  specifications = '{"Tipo: LED","Forma: Media Luna","Intensidad ajustable","Bajo consumo energético"}',
  related_categories = '{"Accesorios"}',
  original_price = 3000,
  updated_at = CURRENT_TIMESTAMP;

-- Product: Compass Silver Ratio
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'compass-silver-ratio',
  'Compass Silver Ratio',
  1270,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-1024-1024.webp',
  'Accesorios',
  false,
  'Compás de proporción áurea para mediciones precisas en micropigmentación y diseño de cejas. Herramienta premium de acero inoxidable.',
  '{}',
  '{}',
  NULL,
  '{"Material: Acero inoxidable","Proporción áurea integrada","Para micropigmentación y diseño","Calidad premium"}',
  '{}',
  NULL,
  '{"Accesorios","Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Compás de proporción áurea para mediciones precisas en micropigmentación y diseño de cejas. Herramienta premium de acero inoxidable.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-1024-1024.webp',
  specifications = '{"Material: Acero inoxidable","Proporción áurea integrada","Para micropigmentación y diseño","Calidad premium"}',
  related_categories = '{"Accesorios","Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Lash Shampoo Espuma
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'lash-shampoo',
  'Lash Shampoo Espuma',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/lash-shampoo-toronja-3-7e48d947857ba7bde617702337947545-1024-1024.webp',
  'Higiene',
  false,
  'Limpieza profunda de párpados y pestañas. Esencial para la asepsia y retención de extensiones. Espuma suave que no irrita.',
  '{"Limpieza profunda sin irritar","Mejora la retención de extensiones","Espuma suave","Para uso diario"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Higiene","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Limpieza profunda de párpados y pestañas. Esencial para la asepsia y retención de extensiones. Espuma suave que no irrita.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/lash-shampoo-toronja-3-7e48d947857ba7bde617702337947545-1024-1024.webp',
  benefits = '{"Limpieza profunda sin irritar","Mejora la retención de extensiones","Espuma suave","Para uso diario"}',
  related_categories = '{"Higiene","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Agua Micelar J.Denis
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'agua-micelar',
  'Agua Micelar J.Denis',
  75,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/agua_mesa-de-trabajo-1-29698059ab235edcb517344065964817-1024-1024.webp',
  'Higiene',
  false,
  'Remoción suave de maquillaje sin comprometer la barrera cutánea. Apto para pieles sensibles. Fórmula suave y efectiva.',
  '{"Remoción suave de maquillaje","No compromete la barrera cutánea","Apto para pieles sensibles","Sin alcohol"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Higiene"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Remoción suave de maquillaje sin comprometer la barrera cutánea. Apto para pieles sensibles. Fórmula suave y efectiva.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/agua_mesa-de-trabajo-1-29698059ab235edcb517344065964817-1024-1024.webp',
  benefits = '{"Remoción suave de maquillaje","No compromete la barrera cutánea","Apto para pieles sensibles","Sin alcohol"}',
  related_categories = '{"Higiene"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Tonificante Desinfectante
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'tonificante-desinfectante',
  'Tonificante Desinfectante',
  90,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/tmp_b64_f238b6e6-d105-422b-ad5a-6bc44dcc9d65_694809_702700-a4793955e071714ede17460410086368-1024-1024.webp',
  'Higiene',
  false,
  'Sanitizante de amplio espectro. Bactericida y viricida para piel y herramientas de trabajo. Esencial para la higiene profesional.',
  '{}',
  '{}',
  NULL,
  '{"Bactericida y viricida","Para piel y herramientas","Amplio espectro","Uso profesional"}',
  '{}',
  NULL,
  '{"Higiene"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Sanitizante de amplio espectro. Bactericida y viricida para piel y herramientas de trabajo. Esencial para la higiene profesional.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/tmp_b64_f238b6e6-d105-422b-ad5a-6bc44dcc9d65_694809_702700-a4793955e071714ede17460410086368-1024-1024.webp',
  specifications = '{"Bactericida y viricida","Para piel y herramientas","Amplio espectro","Uso profesional"}',
  related_categories = '{"Higiene"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Limpiador de Impurezas - Piel Mixta y Grasa
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'limpiador-impurezas',
  'Limpiador de Impurezas - Piel Mixta y Grasa',
  90,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/limpiador-de-impurezas-piel-mixta-y-piel-grasa-0e0ffdaf9bc06584a917561449421922-1024-1024.webp',
  'Higiene',
  false,
  'Limpiador especializado para pieles mixtas y grasas. Elimina impurezas y exceso de grasa preparando la piel para procedimientos de cejas y pestañas.',
  '{"Especial para piel mixta y grasa","Elimina impurezas profundamente","Prepara la piel para procedimientos","No reseca la piel"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Higiene"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Limpiador especializado para pieles mixtas y grasas. Elimina impurezas y exceso de grasa preparando la piel para procedimientos de cejas y pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/limpiador-de-impurezas-piel-mixta-y-piel-grasa-0e0ffdaf9bc06584a917561449421922-1024-1024.webp',
  benefits = '{"Especial para piel mixta y grasa","Elimina impurezas profundamente","Prepara la piel para procedimientos","No reseca la piel"}',
  related_categories = '{"Higiene"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Curva C
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-curva-c',
  'Pad Curva C',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  'Lash Lifting',
  false,
  'Pad de silicón con curva C para lash lifting. Diseño que proporciona una curvatura dramática y definida.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad de silicón con curva C para lash lifting. Diseño que proporciona una curvatura dramática y definida.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Rosa sin Canales
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-rosa-sin-canales',
  'Pad Rosa sin Canales',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  'Lash Lifting',
  false,
  'Pad rosa liso sin canales para lash lifting con acabado suave.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad rosa liso sin canales para lash lifting con acabado suave.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Superior e Inferior
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-superior-inferior',
  'Pad Superior e Inferior',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  'Lash Lifting',
  false,
  'Set de pads para párpado superior e inferior. Cobertura completa para lifting profesional.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Set de pads para párpado superior e inferior. Cobertura completa para lifting profesional.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Colors 8p
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-colors-8p',
  'Pad Colors 8p',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  'Lash Lifting',
  false,
  'Set de 8 pads de colores para lash lifting. Variedad de tamaños y curvaturas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Set de 8 pads de colores para lash lifting. Variedad de tamaños y curvaturas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Colors 6p
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-colors-6p',
  'Pad Colors 6p',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  'Lash Lifting',
  false,
  'Set de 6 pads de colores para lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Set de 6 pads de colores para lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Oso
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-oso',
  'Pad Oso',
  250,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  'Lash Lifting',
  false,
  'Pad con forma de oso para lash lifting. Diseño único que facilita la separación de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad con forma de oso para lash lifting. Diseño único que facilita la separación de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Corrector (Reversión)
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-corrector-reversion',
  'Pad Corrector (Reversión)',
  300,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  'Lash Lifting',
  false,
  'Pad especial para corrección y reversión de lifting. Ideal para corregir curvaturas no deseadas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad especial para corrección y reversión de lifting. Ideal para corregir curvaturas no deseadas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad 2 en 1
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-2-en-1',
  'Pad 2 en 1',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  'Lash Lifting',
  false,
  'Pad versátil 2 en 1 para lash lifting con doble funcionalidad.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad versátil 2 en 1 para lash lifting con doble funcionalidad.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Mariposa
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-mariposa',
  'Pad Mariposa',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  'Lash Lifting',
  false,
  'Pad con forma de mariposa para un lifting con efecto abierto y natural.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad con forma de mariposa para un lifting con efecto abierto y natural.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Elevación L
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-elevacion-l',
  'Pad Elevación L',
  250,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  'Lash Lifting',
  false,
  'Pad de elevación L para lifting con máxima curvatura y apertura.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad de elevación L para lifting con máxima curvatura y apertura.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad LD Simétricos
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-ld-simetricos',
  'Pad LD Simétricos',
  250,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  'Lash Lifting',
  false,
  'Pads LD simétricos para lifting uniforme y equilibrado.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pads LD simétricos para lifting uniforme y equilibrado.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/r31-2113caa06848677a7f15872659444717-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: PRO Lash Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pro-lash-lifting',
  'PRO Lash Lifting',
  385,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-1024-1024.webp',
  'Lash Lifting',
  false,
  'Kit PRO de lash lifting con fórmula mejorada para resultados profesionales superiores.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Kit PRO de lash lifting con fórmula mejorada para resultados profesionales superiores.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Adhesivo Individual para Pads - Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'adhesivo-individual-pads',
  'Adhesivo Individual para Pads - Lifting',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/ind_mesa-de-trabajo-11-dfc574ad69672ed3c216687966538196-1024-1024.webp',
  'Lash Lifting',
  false,
  'Adhesivo individual para pads de lifting. Fijación precisa y segura.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Adhesivo individual para pads de lifting. Fijación precisa y segura.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/ind_mesa-de-trabajo-11-dfc574ad69672ed3c216687966538196-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Lifting Tool - Espátula Elevadora
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'lifting-tool-espatula',
  'Lifting Tool - Espátula Elevadora',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Lash Lifting',
  false,
  'Espátula elevadora profesional para lifting de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting","Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Espátula elevadora profesional para lifting de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Lash Lifting","Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Lash Tool 2 en 1
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'lash-tool-2en1',
  'Lash Tool 2 en 1',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Lash Lifting',
  false,
  'Herramienta 2 en 1 para lifting de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting","Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Herramienta 2 en 1 para lifting de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Lash Lifting","Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Reestructurante Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'reestructurante-lifting',
  'Reestructurante Lifting',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-061-2e3f5f8fbac4155cb516687966859946-1024-1024.webp',
  'Lash Lifting',
  false,
  'Reestructurante para uso en procedimientos de lifting de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting","Tratamientos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Reestructurante para uso en procedimientos de lifting de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-061-2e3f5f8fbac4155cb516687966859946-1024-1024.webp',
  related_categories = '{"Lash Lifting","Tratamientos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Loción Limpiadora Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'locion-limpiadora-lifting',
  'Loción Limpiadora Lifting',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-031-3e42554c91778a025516687967769318-1024-1024.webp',
  'Lash Lifting',
  false,
  'Loción limpiadora especializada para procedimientos de lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting","Higiene"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Loción limpiadora especializada para procedimientos de lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-031-3e42554c91778a025516687967769318-1024-1024.webp',
  related_categories = '{"Lash Lifting","Higiene"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Loción Vitaminada
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'locion-vitaminada',
  'Loción Vitaminada',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/vitamina-011-556c65fa50decd1e2a15494016039704-1024-1024.webp',
  'Lash Lifting',
  false,
  'Loción vitaminada nutritiva para tratamiento post-lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting","Tratamientos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Loción vitaminada nutritiva para tratamiento post-lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/vitamina-011-556c65fa50decd1e2a15494016039704-1024-1024.webp',
  related_categories = '{"Lash Lifting","Tratamientos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Mini Cepillo para Laminado
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'mini-cepillo-laminado',
  'Mini Cepillo para Laminado',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Lash Lifting',
  false,
  'Mini cepillo especializado para procedimientos de laminado.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Mini cepillo especializado para procedimientos de laminado.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Mini Cepillo para Lash Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'mini-cepillo-lash-lifting',
  'Mini Cepillo para Lash Lifting',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Lash Lifting',
  false,
  'Mini cepillo para aplicación precisa en lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Mini cepillo para aplicación precisa en lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: 50 Cepillo Mini para Laminado
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  '50-cepillo-mini-laminado',
  '50 Cepillo Mini para Laminado',
  300,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Lash Lifting',
  false,
  'Pack de 50 mini cepillos para laminado. Uso desechable y profesional.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pack de 50 mini cepillos para laminado. Uso desechable y profesional.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cisteamina Lash & Brows
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cisteamina-lash-brows',
  'Cisteamina Lash & Brows',
  1800,
  2100,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-1024-1024.webp',
  'Lash Lifting',
  false,
  'Fórmula avanzada de cisteamina para lash lifting y laminado de cejas. Tecnología de última generación.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting","Diseño de Cejas"}',
  2100,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Fórmula avanzada de cisteamina para lash lifting y laminado de cejas. Tecnología de última generación.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-1024-1024.webp',
  related_categories = '{"Lash Lifting","Diseño de Cejas"}',
  original_price = 2100,
  updated_at = CURRENT_TIMESTAMP;

-- Product: Laminado Cisteamina Estabilizada
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'laminado-cisteamina-est',
  'Laminado Cisteamina Estabilizada',
  1500,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-1024-1024.webp',
  'Lash Lifting',
  false,
  'Kit de laminado con cisteamina estabilizada. Resultados duraderos y seguros.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Kit de laminado con cisteamina estabilizada. Resultados duraderos y seguros.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-1024-1024.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: 1.5 Shot Hidratante
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'shot-hidratante-15',
  '1.5 Shot Hidratante',
  650,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-1024-1024.webp',
  'Tratamientos',
  false,
  'Shot hidratante concentrado para nutrición intensiva de pestañas y cejas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Tratamientos","Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Shot hidratante concentrado para nutrición intensiva de pestañas y cejas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-1024-1024.webp',
  related_categories = '{"Tratamientos","Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Rulos Adhesivos Curva M/CH
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'rulos-adhesivos-m-ch',
  'Rulos Adhesivos Curva M/CH',
  70,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/53-rulos-adhesivos-031-2ade2563ab84da548d15314940318959-1024-1024.webp',
  'Lash Curling',
  false,
  'Rulos con adhesivo integrado curva M/CH para rizado de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Curling"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Rulos con adhesivo integrado curva M/CH para rizado de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/53-rulos-adhesivos-031-2ade2563ab84da548d15314940318959-1024-1024.webp',
  related_categories = '{"Lash Curling"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva B | 0.10 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-b-010-combo',
  'Curva B | 0.10 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/jdb15co-011-0fef63a529a3684df815330546086769-1024-1024.webp',
  'Extensiones',
  false,
  'Extensiones curva B grosor 0.10 en presentación mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva B grosor 0.10 en presentación mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/jdb15co-011-0fef63a529a3684df815330546086769-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva C | 0.10 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-c-010-combo',
  'Curva C | 0.10 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/jdc15co-011-82b84a8a4aa5f3ec2615330546508985-1024-1024.webp',
  'Extensiones',
  false,
  'Extensiones curva C grosor 0.10 en presentación mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva C grosor 0.10 en presentación mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/jdc15co-011-82b84a8a4aa5f3ec2615330546508985-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva L | 0.10 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-l-010-combo',
  'Curva L | 0.10 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/jdc15co-0211-60d5279f4e8338fe8a15330550618599-1024-1024.webp',
  'Extensiones',
  false,
  'Extensiones curva L grosor 0.10 en presentación mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva L grosor 0.10 en presentación mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/jdc15co-0211-60d5279f4e8338fe8a15330550618599-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva L | 0.15 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-l-015-combo',
  'Curva L | 0.15 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/jdc15co-0211-60d5279f4e8338fe8a15330550618599-1024-1024.webp',
  'Extensiones',
  false,
  'Extensiones curva L grosor 0.15 en presentación mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva L grosor 0.15 en presentación mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/jdc15co-0211-60d5279f4e8338fe8a15330550618599-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva LC | 0.10 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-lc-010-combo',
  'Curva LC | 0.10 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/clacc-011-1aa49ffc176c9df99e16691486329271-1024-1024.webp',
  'Extensiones',
  false,
  'Extensiones curva LC grosor 0.10 en presentación mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva LC grosor 0.10 en presentación mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/clacc-011-1aa49ffc176c9df99e16691486329271-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva LC | 0.15 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-lc-015-combo',
  'Curva LC | 0.15 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/clacc-011-1aa49ffc176c9df99e16691486329271-1024-1024.webp',
  'Extensiones',
  false,
  'Extensiones curva LC grosor 0.15 en presentación mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva LC grosor 0.15 en presentación mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/clacc-011-1aa49ffc176c9df99e16691486329271-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva CC | 0.15 | Combo
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-cc-015-combo',
  'Curva CC | 0.15 | Combo',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/clacc-011-1aa49ffc176c9df99e16691486329271-1024-1024.webp',
  'Extensiones',
  false,
  'Extensiones curva CC grosor 0.15 combo de 7 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva CC grosor 0.15 combo de 7 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/clacc-011-1aa49ffc176c9df99e16691486329271-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Easy Fan Curva C | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'easy-fan-curva-c',
  'Easy Fan Curva C | Mixta',
  380,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/jdc15co-0211-60d5279f4e8338fe8a15330550618599-1024-1024.webp',
  'Extensiones',
  false,
  'Extensiones Easy Fan curva C en presentación mixta. Apertura fácil para abanicos.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones Easy Fan curva C en presentación mixta. Apertura fácil para abanicos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/jdc15co-0211-60d5279f4e8338fe8a15330550618599-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Easy Fan Curva D | 0.05 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'easy-fan-curva-d-005',
  'Easy Fan Curva D | 0.05 | Mixta',
  380,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/pes-d-015-11-53f06c333b890ae6c416577544212430-1024-1024.webp',
  'Extensiones',
  false,
  'Extensiones Easy Fan curva D grosor 0.05 mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones Easy Fan curva D grosor 0.05 mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/pes-d-015-11-53f06c333b890ae6c416577544212430-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Easy Fan Curva D | 0.07 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'easy-fan-curva-d-007',
  'Easy Fan Curva D | 0.07 | Mixta',
  380,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/pes-d-015-11-53f06c333b890ae6c416577544212430-1024-1024.webp',
  'Extensiones',
  false,
  'Extensiones Easy Fan curva D grosor 0.07 mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones Easy Fan curva D grosor 0.07 mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/pes-d-015-11-53f06c333b890ae6c416577544212430-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 3D | Curva C | 0.07 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-3d-c-007',
  'Abanicos | 3D | Curva C | 0.07 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos pre-hechos 3D curva C grosor 0.07 mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos pre-hechos 3D curva C grosor 0.07 mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 2D | Curva B | 0.15 | 10mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-2d-b-015-10',
  'Abanicos | 2D | Curva B | 0.15 | 10mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 2D curva B grosor 0.15 largo 10mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 2D curva B grosor 0.15 largo 10mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 2D | Curva B | 0.15 | 12mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-2d-b-015-12',
  'Abanicos | 2D | Curva B | 0.15 | 12mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 2D curva B grosor 0.15 largo 12mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 2D curva B grosor 0.15 largo 12mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 2D | Curva C | 0.15 | 10mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-2d-c-015-10',
  'Abanicos | 2D | Curva C | 0.15 | 10mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 2D curva C grosor 0.15 largo 10mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 2D curva C grosor 0.15 largo 10mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 2D | Curva J | 0.15 | 10mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-2d-j-015-10',
  'Abanicos | 2D | Curva J | 0.15 | 10mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 2D curva J grosor 0.15 largo 10mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 2D curva J grosor 0.15 largo 10mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 2D | Curva J | 0.15 | 12mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-2d-j-015-12',
  'Abanicos | 2D | Curva J | 0.15 | 12mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 2D curva J grosor 0.15 largo 12mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 2D curva J grosor 0.15 largo 12mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 4D | Curva B | 0.15 | 10mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-4d-b-015-10',
  'Abanicos | 4D | Curva B | 0.15 | 10mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 4D curva B grosor 0.15 largo 10mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 4D curva B grosor 0.15 largo 10mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 4D | Curva B | 0.15 | 12mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-4d-b-015-12',
  'Abanicos | 4D | Curva B | 0.15 | 12mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 4D curva B grosor 0.15 largo 12mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 4D curva B grosor 0.15 largo 12mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 4D | Curva C | 0.05 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-4d-c-005',
  'Abanicos | 4D | Curva C | 0.05 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 4D curva C grosor 0.05 mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 4D curva C grosor 0.05 mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 4D | Curva C | 0.07 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-4d-c-007',
  'Abanicos | 4D | Curva C | 0.07 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 4D curva C grosor 0.07 mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 4D curva C grosor 0.07 mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 4D | Curva D | 0.05 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-4d-d-005',
  'Abanicos | 4D | Curva D | 0.05 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 4D curva D grosor 0.05 mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 4D curva D grosor 0.05 mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 4D | Curva D | 0.07 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-4d-d-007',
  'Abanicos | 4D | Curva D | 0.07 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 4D curva D grosor 0.07 mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 4D curva D grosor 0.07 mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 5D | Curva B | 0.15 | 10mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-5d-b-015-10',
  'Abanicos | 5D | Curva B | 0.15 | 10mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 5D curva B grosor 0.15 largo 10mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 5D curva B grosor 0.15 largo 10mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 5D | Curva J | 0.15 | 10mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-5d-j-015-10',
  'Abanicos | 5D | Curva J | 0.15 | 10mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 5D curva J grosor 0.15 largo 10mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 5D curva J grosor 0.15 largo 10mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 5D | Curva C | 0.05 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-5d-c-005',
  'Abanicos | 5D | Curva C | 0.05 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 5D curva C grosor 0.05 mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 5D curva C grosor 0.05 mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 5D | Curva C | 0.07 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-5d-c-007',
  'Abanicos | 5D | Curva C | 0.07 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 5D curva C grosor 0.07 mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 5D curva C grosor 0.07 mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 5D | Curva D | 0.05 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-5d-d-005',
  'Abanicos | 5D | Curva D | 0.05 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 5D curva D grosor 0.05 mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 5D curva D grosor 0.05 mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 5D | Curva D | 0.07 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-5d-d-007',
  'Abanicos | 5D | Curva D | 0.07 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Abanicos 5D curva D grosor 0.07 mixta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 5D curva D grosor 0.07 mixta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestaña (C) en Colores
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-c-colores',
  'Pestaña (C) en Colores',
  600,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/jdc15co-0211-60d5279f4e8338fe8a15330550618599-1024-1024.webp',
  'Extensiones',
  false,
  'Extensiones curva C en colores variados para looks creativos.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva C en colores variados para looks creativos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/jdc15co-0211-60d5279f4e8338fe8a15330550618599-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestaña (D) en Colores
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-d-colores',
  'Pestaña (D) en Colores',
  600,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/pes-d-015-11-53f06c333b890ae6c416577544212430-1024-1024.webp',
  'Extensiones',
  false,
  'Extensiones curva D en colores variados para looks creativos.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva D en colores variados para looks creativos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/pes-d-015-11-53f06c333b890ae6c416577544212430-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestañas en Grupo o Racimo
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-grupo-racimo',
  'Pestañas en Grupo o Racimo',
  32,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Pestañas en grupo o racimo para aplicación rápida y efecto natural.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestañas en grupo o racimo para aplicación rápida y efecto natural.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestañas en Grupo o Racimo Azul
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-grupo-racimo-azul',
  'Pestañas en Grupo o Racimo Azul',
  22,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Pestañas en grupo color azul para looks creativos.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestañas en grupo color azul para looks creativos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestañas en Grupo o Racimo Café
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-grupo-racimo-cafe',
  'Pestañas en Grupo o Racimo Café',
  22,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Pestañas en grupo color café para un look natural.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestañas en grupo color café para un look natural.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Modelos de Curvas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'modelos-de-curvas',
  'Modelos de Curvas',
  880,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/jdc15co-0211-60d5279f4e8338fe8a15330550618599-1024-1024.webp',
  'Extensiones',
  false,
  'Set de modelos de curvas para demostración y práctica profesional.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Set de modelos de curvas para demostración y práctica profesional.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/jdc15co-0211-60d5279f4e8338fe8a15330550618599-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestaña para Práctica
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-practica',
  'Pestaña para Práctica',
  55,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  'Extensiones',
  false,
  'Pestañas especiales para práctica de técnicas de extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestañas especiales para práctica de técnicas de extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/6d4ac5ec-8f5a-4c08-8907-05c497a5cbaf1-d7cd8a22073d7feac315894821721364-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestaña Individual (Negra)
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-individual-negra',
  'Pestaña Individual (Negra)',
  25,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-21_mesa-de-trabajo-11-285849cb951c114fde15856909430891-1024-1024.webp',
  'Extensiones',
  false,
  'Pestañas individuales color negro para aplicación pelo a pelo.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestañas individuales color negro para aplicación pelo a pelo.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-21_mesa-de-trabajo-11-285849cb951c114fde15856909430891-1024-1024.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestaña Americana de Tira
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-americana-tira',
  'Pestaña Americana de Tira',
  20,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/adhesivo-ihi-transparente-3-47c2520f7d78dfe66617552053250344-1024-1024.webp',
  'Pestañas en Tira',
  false,
  'Pestaña americana de tira. Disponible en múltiples modelos (001, 005, 012, 015, 020, 038, 042, 046, 503, 505, 507, 600, 606, 747M, 747S, 747XS, 107).',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pestañas en Tira"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestaña americana de tira. Disponible en múltiples modelos (001, 005, 012, 015, 020, 038, 042, 046, 503, 505, 507, 600, 606, 747M, 747S, 747XS, 107).',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/adhesivo-ihi-transparente-3-47c2520f7d78dfe66617552053250344-1024-1024.webp',
  related_categories = '{"Pestañas en Tira"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestaña Europea de Tira
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-europea-tira',
  'Pestaña Europea de Tira',
  25,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/adhesivo-ihi-transparente-3-47c2520f7d78dfe66617552053250344-1024-1024.webp',
  'Pestañas en Tira',
  false,
  'Pestaña europea de tira J.Eyelash. Modelos 22-78 disponibles. Fibra suave de alta calidad.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pestañas en Tira"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestaña europea de tira J.Eyelash. Modelos 22-78 disponibles. Fibra suave de alta calidad.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/adhesivo-ihi-transparente-3-47c2520f7d78dfe66617552053250344-1024-1024.webp',
  related_categories = '{"Pestañas en Tira"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestaña Decorada de Tira
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-decorada-tira',
  'Pestaña Decorada de Tira',
  20,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/adhesivo-ihi-transparente-3-47c2520f7d78dfe66617552053250344-1024-1024.webp',
  'Pestañas en Tira',
  false,
  'Pestañas decoradas para looks artísticos y eventos especiales. Múltiples modelos disponibles.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pestañas en Tira"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestañas decoradas para looks artísticos y eventos especiales. Múltiples modelos disponibles.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/adhesivo-ihi-transparente-3-47c2520f7d78dfe66617552053250344-1024-1024.webp',
  related_categories = '{"Pestañas en Tira"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Adhesivo Bálsamo 20 gr
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'adhesivo-balsamo-20gr',
  'Adhesivo Bálsamo 20 gr',
  260,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/vol_mesa-de-trabajo-11-d61661ecf8820a785a16669241686028-1024-1024.webp',
  'Adhesivos',
  false,
  'Adhesivo bálsamo de 20 gramos. Fórmula suave ideal para pieles sensibles.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Adhesivos","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Adhesivo bálsamo de 20 gramos. Fórmula suave ideal para pieles sensibles.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/vol_mesa-de-trabajo-11-d61661ecf8820a785a16669241686028-1024-1024.webp',
  related_categories = '{"Adhesivos","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Adhesivo Bálsamo Butter 30 gr
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'adhesivo-balsamo-butter-30gr',
  'Adhesivo Bálsamo Butter 30 gr',
  380,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/vol_mesa-de-trabajo-11-d61661ecf8820a785a16669241686028-1024-1024.webp',
  'Adhesivos',
  false,
  'Adhesivo bálsamo Butter 30 gramos. Textura cremosa para mejor control.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Adhesivos","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Adhesivo bálsamo Butter 30 gramos. Textura cremosa para mejor control.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/vol_mesa-de-trabajo-11-d61661ecf8820a785a16669241686028-1024-1024.webp',
  related_categories = '{"Adhesivos","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Tintura Tópica - Negro
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'tintura-topica-negro',
  'Tintura Tópica - Negro',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/pig-071-10ea3ab254a18fa68516691314001398-1024-1024.webp',
  'Pigmentos',
  false,
  'Tintura tópica profesional tono negro para cejas y pestañas. Color intenso y duradero.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pigmentos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Tintura tópica profesional tono negro para cejas y pestañas. Color intenso y duradero.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/pig-071-10ea3ab254a18fa68516691314001398-1024-1024.webp',
  related_categories = '{"Pigmentos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Sellador para Tintura Tópica
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'sellador-tintura-topica',
  'Sellador para Tintura Tópica',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/pig-071-10ea3ab254a18fa68516691314001398-1024-1024.webp',
  'Pigmentos',
  false,
  'Sellador complementario para tintura tópica. Fija el color y prolonga duración.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pigmentos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Sellador complementario para tintura tópica. Fija el color y prolonga duración.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/pig-071-10ea3ab254a18fa68516691314001398-1024-1024.webp',
  related_categories = '{"Pigmentos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Activador para Tintura Tópica
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'activador-tintura-topica',
  'Activador para Tintura Tópica',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/activador-henna-2-2398d7caec1193296817558879257390-1024-1024.webp',
  'Pigmentos',
  false,
  'Activador para tintura tópica. Necesario para la reacción de tinción.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pigmentos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Activador para tintura tópica. Necesario para la reacción de tinción.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/activador-henna-2-2398d7caec1193296817558879257390-1024-1024.webp',
  related_categories = '{"Pigmentos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Reestructurante Pigmento para Cejas y Pestañas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'reestructurante-pigmento',
  'Reestructurante Pigmento para Cejas y Pestañas',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-061-2e3f5f8fbac4155cb516687966859946-1024-1024.webp',
  'Pigmentos',
  false,
  'Reestructurante para uso con pigmentos en cejas y pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pigmentos","Tratamientos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Reestructurante para uso con pigmentos en cejas y pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-061-2e3f5f8fbac4155cb516687966859946-1024-1024.webp',
  related_categories = '{"Pigmentos","Tratamientos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Henna Directa
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'henna-directa-2',
  'Henna Directa',
  370,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/brow-henna-061-fbdb257619cce9e95d16669249148944-1024-1024.webp',
  'Brow Henna',
  false,
  'Henna directa disponible en Castaño Medio y Castaño Obscuro.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Brow Henna"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Henna directa disponible en Castaño Medio y Castaño Obscuro.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/brow-henna-061-fbdb257619cce9e95d16669249148944-1024-1024.webp',
  related_categories = '{"Brow Henna"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Mezclador de Henna
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'mezclador-henna',
  'Mezclador de Henna',
  180,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/brow-henna-061-fbdb257619cce9e95d16669249148944-1024-1024.webp',
  'Brow Henna',
  false,
  'Mezclador profesional para preparación de henna.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Brow Henna","Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Mezclador profesional para preparación de henna.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/brow-henna-061-fbdb257619cce9e95d16669249148944-1024-1024.webp',
  related_categories = '{"Brow Henna","Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Plantillas para Cejas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'plantillas-cejas',
  'Plantillas para Cejas',
  120,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/36-plantilla-ceja-6-011-b4bfd48aa95fec631d15856942870032-1024-1024.webp',
  'Diseño de Cejas',
  false,
  'Set de plantillas para diseño de cejas. Múltiples modelos disponibles.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Diseño de Cejas","Brow Henna"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Set de plantillas para diseño de cejas. Múltiples modelos disponibles.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/36-plantilla-ceja-6-011-b4bfd48aa95fec631d15856942870032-1024-1024.webp',
  related_categories = '{"Diseño de Cejas","Brow Henna"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cepillos para Pestañas con 50 pzas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cepillos-pestanas-50',
  'Cepillos para Pestañas con 50 pzas',
  80,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Pack de 50 cepillos desechables para pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pack de 50 cepillos desechables para pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cepillo Largo para Pestañas 100 piezas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cepillo-largo-100',
  'Cepillo Largo para Pestañas 100 piezas',
  260,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Pack de 100 cepillos largos para pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pack de 100 cepillos largos para pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cepillo con Guarda
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cepillo-con-guarda',
  'Cepillo con Guarda',
  85,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Cepillo para pestañas con guarda protectora.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Cepillo para pestañas con guarda protectora.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: 50 Cepillos para Pestañas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  '50-cepillos-pestanas',
  '50 Cepillos para Pestañas',
  80,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Pack de 50 cepillos para pestañas uso profesional.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pack de 50 cepillos para pestañas uso profesional.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Contenedor Mini para Base
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'contenedor-mini-base',
  'Contenedor Mini para Base',
  15,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/base-031-a0f3cbfe23723e3c4f16691451059225-1024-1024.webp',
  'Herramientas',
  false,
  'Contenedor mini para depositar base de adhesivo.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Contenedor mini para depositar base de adhesivo.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/base-031-a0f3cbfe23723e3c4f16691451059225-1024-1024.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Contenedor para Anillo con 50 pzas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'contenedor-anillo-50',
  'Contenedor para Anillo con 50 pzas',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/base-031-a0f3cbfe23723e3c4f16691451059225-1024-1024.webp',
  'Herramientas',
  false,
  'Pack de 50 contenedores para anillo de adhesivo.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pack de 50 contenedores para anillo de adhesivo.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/base-031-a0f3cbfe23723e3c4f16691451059225-1024-1024.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Regla Metálica
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'regla-metalica',
  'Regla Metálica',
  420,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-1024-1024.webp',
  'Herramientas',
  false,
  'Regla metálica profesional para mediciones precisas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Regla metálica profesional para mediciones precisas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-1024-1024.webp',
  related_categories = '{"Herramientas","Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Espejo Auxiliar G
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'espejo-auxiliar-g',
  'Espejo Auxiliar G',
  200,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/d_nq_np_638989-mlm42485527476_072020-w1-682f4c41249fc2a6f016034916189282-1024-1024.webp',
  'Herramientas',
  false,
  'Espejo auxiliar tamaño G para verificación de trabajo.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Espejo auxiliar tamaño G para verificación de trabajo.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/d_nq_np_638989-mlm42485527476_072020-w1-682f4c41249fc2a6f016034916189282-1024-1024.webp',
  related_categories = '{"Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza para Pestañas de Tira
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-pestanas-tira',
  'Pinza para Pestañas de Tira',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Pinza especializada para colocación de pestañas en tira.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Pestañas en Tira"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza especializada para colocación de pestañas en tira.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas","Pestañas en Tira"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza para Depilar
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-depilar',
  'Pinza para Depilar',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Pinza profesional para depilación de cejas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza profesional para depilación de cejas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas","Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Punta Larga
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-punta-larga',
  'Pinza Punta Larga',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Pinza con punta larga para extensiones de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza con punta larga para extensiones de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Abanicos sin Punta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-abanicos-sin-punta',
  'Pinza Abanicos sin Punta',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Pinza para crear abanicos sin punta. Ideal para técnica de volumen.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza para crear abanicos sin punta. Ideal para técnica de volumen.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Punta M-12
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-punta-m12',
  'Pinza Punta M-12',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Pinza punta M-12 para extensiones de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza punta M-12 para extensiones de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza para Colocar M-18
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-colocar-m18',
  'Pinza para Colocar M-18',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Pinza para colocar extensiones M-18.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza para colocar extensiones M-18.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Ele M-19
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-ele-m19',
  'Pinza Ele M-19',
  140,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Pinza Ele M-19 para técnica de extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza Ele M-19 para técnica de extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza MD 14 en Punta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-md14-punta',
  'Pinza MD 14 en Punta',
  200,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Pinza MD 14 con punta precisa para extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza MD 14 con punta precisa para extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza MD 14 en Ele
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-md14-ele',
  'Pinza MD 14 en Ele',
  200,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Pinza MD 14 en forma de Ele.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza MD 14 en forma de Ele.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Set 6 Pinzas y Tijera
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'set-6-pinzas-tijera',
  'Set 6 Pinzas y Tijera',
  650,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Set completo de 6 pinzas profesionales y tijera para extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Set completo de 6 pinzas profesionales y tijera para extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Set 5 Pinceles
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'set-5-pinceles',
  'Set 5 Pinceles',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Set de 5 pinceles profesionales para diseño de cejas y aplicación.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Set de 5 pinceles profesionales para diseño de cejas y aplicación.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas","Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Regla Curva Plástica para Diseño
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'regla-curva-plastica',
  'Regla Curva Plástica para Diseño',
  65,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/arco-hilo_000131-98d2fedde55c00a63616035616219256-1024-1024.webp',
  'Herramientas',
  false,
  'Regla curva plástica para diseño preciso de cejas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Regla curva plástica para diseño preciso de cejas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/arco-hilo_000131-98d2fedde55c00a63616035616219256-1024-1024.webp',
  related_categories = '{"Herramientas","Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Peine Separador de Pestañas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'peine-separador',
  'Peine Separador de Pestañas',
  80,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Peine separador profesional para pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Peine separador profesional para pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Funda para Pinza
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'funda-pinza',
  'Funda para Pinza',
  30,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Funda protectora para pinzas de extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Funda protectora para pinzas de extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Microbrush de 100 pz
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'microbrush-100pz',
  'Microbrush de 100 pz',
  80,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Pack de 100 microbrush para aplicaciones de precisión.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pack de 100 microbrush para aplicaciones de precisión.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: 100 Microbrush Largo
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  '100-microbrush-largo',
  '100 Microbrush Largo',
  90,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  'Herramientas',
  false,
  'Pack de 100 microbrush largos para procedimientos profesionales.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pack de 100 microbrush largos para procedimientos profesionales.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p31-c7c6e6930d4fa2037915872659858026-1024-1024.webp',
  related_categories = '{"Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Repuesto de Maniquí para Microblading
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'repuesto-maniqui-microblading',
  'Repuesto de Maniquí para Microblading',
  185,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/h64fbe6378cc249cd88ae27bcf74d9993y1-108b75012dae3f992515856923521717-1024-1024.webp',
  'Herramientas',
  false,
  'Repuesto de piel para maniquí de práctica de microblading.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Microblading"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Repuesto de piel para maniquí de práctica de microblading.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/h64fbe6378cc249cd88ae27bcf74d9993y1-108b75012dae3f992515856923521717-1024-1024.webp',
  related_categories = '{"Herramientas","Microblading"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Medidor de Humedad
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'medidor-humedad',
  'Medidor de Humedad',
  250,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-1024-1024.webp',
  'Herramientas',
  false,
  'Medidor de humedad ambiental para control de condiciones óptimas en procedimientos.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Medidor de humedad ambiental para control de condiciones óptimas en procedimientos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-1024-1024.webp',
  related_categories = '{"Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Gel Fijador para Diseño de Cejas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'gel-fijador-cejas',
  'Gel Fijador para Diseño de Cejas',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/brows-fixative-3-bcbac541f8e9fb29f417589971064547-1024-1024.webp',
  'Diseño de Cejas',
  false,
  'Gel fijador profesional para diseño de cejas. Mantiene la forma del diseño.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Gel fijador profesional para diseño de cejas. Mantiene la forma del diseño.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/brows-fixative-3-bcbac541f8e9fb29f417589971064547-1024-1024.webp',
  related_categories = '{"Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Gel Reestructurante para Diseño de Cejas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'gel-reestructurante-cejas',
  'Gel Reestructurante para Diseño de Cejas',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-061-2e3f5f8fbac4155cb516687966859946-1024-1024.webp',
  'Diseño de Cejas',
  false,
  'Gel reestructurante para diseño de cejas. Nutre y da forma.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Gel reestructurante para diseño de cejas. Nutre y da forma.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-061-2e3f5f8fbac4155cb516687966859946-1024-1024.webp',
  related_categories = '{"Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Stencil para Cejas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'stencil-cejas',
  'Stencil para Cejas',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/36-plantilla-ceja-6-011-b4bfd48aa95fec631d15856942870032-1024-1024.webp',
  'Diseño de Cejas',
  false,
  'Stencil profesional para diseño rápido y simétrico de cejas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Stencil profesional para diseño rápido y simétrico de cejas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/36-plantilla-ceja-6-011-b4bfd48aa95fec631d15856942870032-1024-1024.webp',
  related_categories = '{"Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Delineador Pencil
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'delineador-pencil',
  'Delineador Pencil',
  40,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/mesa-de-trabajo-21-5623fc474fe25629fd16687989657552-1024-1024.webp',
  'Diseño de Cejas',
  false,
  'Delineador tipo pencil disponible en 4 tonos para diseño de cejas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Delineador tipo pencil disponible en 4 tonos para diseño de cejas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/mesa-de-trabajo-21-5623fc474fe25629fd16687989657552-1024-1024.webp',
  related_categories = '{"Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Limpiador de Impurezas Piel Normal y Seca
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'limpiador-piel-normal-seca',
  'Limpiador de Impurezas Piel Normal y Seca',
  90,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/limpiador-de-impurezas-piel-mixta-y-piel-grasa-0e0ffdaf9bc06584a917561449421922-1024-1024.webp',
  'Higiene',
  false,
  'Limpiador de impurezas para piel normal y seca. Prepara la piel sin resecar.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Higiene"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Limpiador de impurezas para piel normal y seca. Prepara la piel sin resecar.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/limpiador-de-impurezas-piel-mixta-y-piel-grasa-0e0ffdaf9bc06584a917561449421922-1024-1024.webp',
  related_categories = '{"Higiene"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Mica Cubre Boca
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'mica-cubre-boca',
  'Mica Cubre Boca',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/mica1-1ead16074c150b7c3f15494014566587-1024-1024.webp',
  'Higiene',
  false,
  'Mica transparente cubre boca para protección durante procedimientos.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Higiene"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Mica transparente cubre boca para protección durante procedimientos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/mica1-1ead16074c150b7c3f15494014566587-1024-1024.webp',
  related_categories = '{"Higiene"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Guantes de Nitrilo
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'guantes-nitrilo',
  'Guantes de Nitrilo',
  390,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/5f19357c6ed20-ebd48acb-d3e2-4457-994f-5637326cd14b-1600x16001-9cfda1c2e5b7e63dcf16034906790930-1024-1024.webp',
  'Higiene',
  false,
  'Guantes de nitrilo profesional. Disponible en talla chica, mediana y grande.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Higiene"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Guantes de nitrilo profesional. Disponible en talla chica, mediana y grande.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/5f19357c6ed20-ebd48acb-d3e2-4457-994f-5637326cd14b-1600x16001-9cfda1c2e5b7e63dcf16034906790930-1024-1024.webp',
  related_categories = '{"Higiene"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pulsera Base con Medidas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pulsera-base-medidas',
  'Pulsera Base con Medidas',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-1024-1024.webp',
  'Accesorios',
  false,
  'Pulsera con base y medidas para apoyo durante procedimientos de extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pulsera con base y medidas para apoyo durante procedimientos de extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-1024-1024.webp',
  related_categories = '{"Accesorios","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Fijador de Maquillaje
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'fijador-maquillaje',
  'Fijador de Maquillaje',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/bifasico_mesa-de-trabajo-1-6eb4be9674069796fb17344099355972-1024-1024.webp',
  'Accesorios',
  false,
  'Fijador de maquillaje en spray para prolongar la duración del maquillaje.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Fijador de maquillaje en spray para prolongar la duración del maquillaje.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/bifasico_mesa-de-trabajo-1-6eb4be9674069796fb17344099355972-1024-1024.webp',
  related_categories = '{"Accesorios"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cinta Adhesiva (Colores)
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cinta-adhesiva-colores',
  'Cinta Adhesiva (Colores)',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/cinta-plastico11-a71209ec9ed985a90016034886124545-1024-1024.webp',
  'Accesorios',
  false,
  'Cinta adhesiva en colores para protección durante procedimientos.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Cinta adhesiva en colores para protección durante procedimientos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/cinta-plastico11-a71209ec9ed985a90016034886124545-1024-1024.webp',
  related_categories = '{"Accesorios","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Sticker Reutilizable para Párpado
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'sticker-reutilizable-parpado',
  'Sticker Reutilizable para Párpado',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/parpado-021-4abf45055504f2086716692331225943-1024-1024.webp',
  'Accesorios',
  false,
  'Sticker reutilizable para protección de párpado durante procedimientos.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Sticker reutilizable para protección de párpado durante procedimientos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/parpado-021-4abf45055504f2086716692331225943-1024-1024.webp',
  related_categories = '{"Accesorios","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Lash Ribbon
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'lash-ribbon',
  'Lash Ribbon',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/cinta-microfoam11-8f139166d09bc9572916034888094159-1024-1024.webp',
  'Accesorios',
  false,
  'Cinta para pestañas lash ribbon para separación y protección.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Cinta para pestañas lash ribbon para separación y protección.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/cinta-microfoam11-8f139166d09bc9572916034888094159-1024-1024.webp',
  related_categories = '{"Accesorios","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Glue Less Powder
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'glue-less-powder',
  'Glue Less Powder',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/shaker_mesa-de-trabajo-1-copia-4e0418ae0983baf4f617344074504573-1024-1024.webp',
  'Accesorios',
  false,
  'Polvo para mejorar la retención del adhesivo. Optimiza el secado.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios","Adhesivos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Polvo para mejorar la retención del adhesivo. Optimiza el secado.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/shaker_mesa-de-trabajo-1-copia-4e0418ae0983baf4f617344074504573-1024-1024.webp',
  related_categories = '{"Accesorios","Adhesivos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Air Pump
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'air-pump',
  'Air Pump',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/54-air-pump-04-0111-ee7967faab158a16a715314972504963-1024-1024.webp',
  'Accesorios',
  false,
  'Bomba de aire para secado rápido del adhesivo de extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Bomba de aire para secado rápido del adhesivo de extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/54-air-pump-04-0111-ee7967faab158a16a715314972504963-1024-1024.webp',
  related_categories = '{"Accesorios","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Tratamiento Capilar pH 4
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'tratamiento-capilar-ph4',
  'Tratamiento Capilar pH 4',
  75,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-30-a-las-19-57-071-04021a75d3be481cba16671814910615-1024-1024.webp',
  'Tratamientos',
  false,
  'Tratamiento capilar con pH 4 para nutrición y reestructuración.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Tratamientos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Tratamiento capilar con pH 4 para nutrición y reestructuración.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-30-a-las-19-57-071-04021a75d3be481cba16671814910615-1024-1024.webp',
  related_categories = '{"Tratamientos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Botox Pestañas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'botox-pestanas',
  'Botox Pestañas',
  200,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-30-a-las-19-57-071-04021a75d3be481cba16671814910615-1024-1024.webp',
  'Tratamientos',
  false,
  'Tratamiento botox para pestañas. Nutre, engrosa y fortalece desde la raíz.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Tratamientos","Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Tratamiento botox para pestañas. Nutre, engrosa y fortalece desde la raíz.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-30-a-las-19-57-071-04021a75d3be481cba16671814910615-1024-1024.webp',
  related_categories = '{"Tratamientos","Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: After Care
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'after-care-microblading',
  'After Care',
  500,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/vitamina-011-556c65fa50decd1e2a15494016039704-1024-1024.webp',
  'Microblading',
  false,
  'Tratamiento After Care para post-procedimiento de microblading.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Microblading"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Tratamiento After Care para post-procedimiento de microblading.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/vitamina-011-556c65fa50decd1e2a15494016039704-1024-1024.webp',
  related_categories = '{"Microblading"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Limpiador de Impurezas - Blue
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'limpiador-impurezas-blue',
  'Limpiador de Impurezas - Blue',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-031-3e42554c91778a025516687967769318-480-0.webp',
  'Lash Curling',
  false,
  'Preparador para la zona de ojos, elimina grasa e impurezas antes de aplicar procedimientos de rizado o extensiones.',
  '{"Mejora la adherencia de los productos"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Curling","Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Preparador para la zona de ojos, elimina grasa e impurezas antes de aplicar procedimientos de rizado o extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-031-3e42554c91778a025516687967769318-480-0.webp',
  benefits = '{"Mejora la adherencia de los productos"}',
  related_categories = '{"Lash Curling","Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Adhesivo para Rulos - Blue
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'adhesivo-rulos-blue',
  'Adhesivo para Rulos - Blue',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/ind_mesa-de-trabajo-11-dfc574ad69672ed3c216687966538196-480-0.webp',
  'Lash Curling',
  false,
  'Adhesivo especializado para fijar rulos durante el proceso de rizado de pestañas línea Blue.',
  '{"Fijación precisa","Fácil de limpiar"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Curling"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Adhesivo especializado para fijar rulos durante el proceso de rizado de pestañas línea Blue.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/ind_mesa-de-trabajo-11-dfc574ad69672ed3c216687966538196-480-0.webp',
  benefits = '{"Fijación precisa","Fácil de limpiar"}',
  related_categories = '{"Lash Curling"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Gel Ondulante - Blue
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'gel-ondulante-blue',
  'Gel Ondulante - Blue',
  90,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-041-0b50e932a81e17ebed16687967632100-480-0.webp',
  'Lash Curling',
  false,
  'Paso 1 para el rizado de pestañas línea Blue. Permite moldear la fibra capilar.',
  '{"Acción rápida","Resultados duraderos"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Curling"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Paso 1 para el rizado de pestañas línea Blue. Permite moldear la fibra capilar.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-041-0b50e932a81e17ebed16687967632100-480-0.webp',
  benefits = '{"Acción rápida","Resultados duraderos"}',
  related_categories = '{"Lash Curling"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Gel Neutralizante - Blue
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'gel-neutralizante-blue',
  'Gel Neutralizante - Blue',
  90,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-051-6de996f39be86e521716687967109859-480-0.webp',
  'Lash Curling',
  false,
  'Paso 2 para el rizado de pestañas línea Blue. Fija la forma ondulada deseada.',
  '{"Estabiliza el proceso químico"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Curling"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Paso 2 para el rizado de pestañas línea Blue. Fija la forma ondulada deseada.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-051-6de996f39be86e521716687967109859-480-0.webp',
  benefits = '{"Estabiliza el proceso químico"}',
  related_categories = '{"Lash Curling"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Gel Reestructurante - Blue
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'gel-reestructurante-blue',
  'Gel Reestructurante - Blue',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-061-2e3f5f8fbac4155cb516687966859946-480-0.webp',
  'Lash Curling',
  false,
  'Gel para hidratar y fortalecer las pestañas después del rizado línea Blue.',
  '{"Nutre y suaviza la pestaña"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Curling"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Gel para hidratar y fortalecer las pestañas después del rizado línea Blue.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/ind-061-2e3f5f8fbac4155cb516687966859946-480-0.webp',
  benefits = '{"Nutre y suaviza la pestaña"}',
  related_categories = '{"Lash Curling"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Adhesivo Transparente Pestañas en Tira IHI
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'adhesivo-transparente-tira-ihi',
  'Adhesivo Transparente Pestañas en Tira IHI',
  40,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/adhesivo-ihi-transparente-3-47c2520f7d78dfe66617552053250344-480-0.webp',
  'Adhesivos',
  false,
  'Adhesivo transparente para pestañas de tira. Brinda una fijación segura y discreta.',
  '{"Invisible al secar","Larga duración"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Adhesivos","Pestañas en Tira"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Adhesivo transparente para pestañas de tira. Brinda una fijación segura y discreta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/adhesivo-ihi-transparente-3-47c2520f7d78dfe66617552053250344-480-0.webp',
  benefits = '{"Invisible al secar","Larga duración"}',
  related_categories = '{"Adhesivos","Pestañas en Tira"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Adhesivo Obscuro Pestañas en Tira IHI
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'adhesivo-obscuro-tira-ihi',
  'Adhesivo Obscuro Pestañas en Tira IHI',
  40,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/adhesivo-ihi-transparente-3-47c2520f7d78dfe66617552053250344-480-0.webp',
  'Adhesivos',
  false,
  'Adhesivo negro para pestañas de tira. Efecto de delineado natural.',
  '{"Efecto delineado","Fijación fuerte"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Adhesivos","Pestañas en Tira"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Adhesivo negro para pestañas de tira. Efecto de delineado natural.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/adhesivo-ihi-transparente-3-47c2520f7d78dfe66617552053250344-480-0.webp',
  benefits = '{"Efecto delineado","Fijación fuerte"}',
  related_categories = '{"Adhesivos","Pestañas en Tira"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Adhesivo Negro - Pestañas en Grupo
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'adhesivo-negro-grupo',
  'Adhesivo Negro - Pestañas en Grupo',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/kerat-021-36b8dbd9c51caa6a6a16691318586913-480-0.webp',
  'Adhesivos',
  false,
  'Adhesivo especializado para pestañas en grupo. Tono negro para un efecto de delineado.',
  '{"Secado rápido","Tono negro intenso"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Adhesivos","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Adhesivo especializado para pestañas en grupo. Tono negro para un efecto de delineado.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/kerat-021-36b8dbd9c51caa6a6a16691318586913-480-0.webp',
  benefits = '{"Secado rápido","Tono negro intenso"}',
  related_categories = '{"Adhesivos","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Adhesivo Transparente - Pestañas en Grupo
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'adhesivo-transparente-grupo',
  'Adhesivo Transparente - Pestañas en Grupo',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/kerat-061-5e6f566b3df2fabc7e16691319066677-480-0.webp',
  'Adhesivos',
  false,
  'Adhesivo transparente de alta fijación para pestañas en grupo o individuales de nudo.',
  '{"Fijación fuerte","Acabado natural"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Adhesivos","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Adhesivo transparente de alta fijación para pestañas en grupo o individuales de nudo.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/kerat-061-5e6f566b3df2fabc7e16691319066677-480-0.webp',
  benefits = '{"Fijación fuerte","Acabado natural"}',
  related_categories = '{"Adhesivos","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Quitapestañas Líquido - Pestañas en Grupo
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'quitapestanas-liquido-grupo',
  'Quitapestañas Líquido - Pestañas en Grupo',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/quit-061-2d6795ce0280cfc02c16691323314869-480-0.webp',
  'Adhesivos',
  false,
  'Líquido para remover adhesivos de pestañas en grupo de manera segura sin dañar la pestaña natural.',
  '{"Remoción suave y rápida"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Adhesivos","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Líquido para remover adhesivos de pestañas en grupo de manera segura sin dañar la pestaña natural.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/quit-061-2d6795ce0280cfc02c16691323314869-480-0.webp',
  benefits = '{"Remoción suave y rápida"}',
  related_categories = '{"Adhesivos","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Adhesivo Libre de Látex - Transparente
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'adhesivo-latex-transparente',
  'Adhesivo Libre de Látex - Transparente',
  90,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/adhesivo-ihi-transparente-3-47c2520f7d78dfe66617552053250344-480-0.webp',
  'Adhesivos',
  false,
  'Adhesivo transparente libre de látex para pieles sensibles.',
  '{"Hipoalergénico","Secado transparente"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Adhesivos","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Adhesivo transparente libre de látex para pieles sensibles.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/adhesivo-ihi-transparente-3-47c2520f7d78dfe66617552053250344-480-0.webp',
  benefits = '{"Hipoalergénico","Secado transparente"}',
  related_categories = '{"Adhesivos","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Adhesivo Libre de Látex - Blanco
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'adhesivo-latex-blanco',
  'Adhesivo Libre de Látex - Blanco',
  90,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/adhesivo-ihi-transparente-3-47c2520f7d78dfe66617552053250344-480-0.webp',
  'Adhesivos',
  false,
  'Adhesivo blanco libre de látex para pieles sensibles.',
  '{"Hipoalergénico","Alta fijación"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Adhesivos","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Adhesivo blanco libre de látex para pieles sensibles.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/adhesivo-ihi-transparente-3-47c2520f7d78dfe66617552053250344-480-0.webp',
  benefits = '{"Hipoalergénico","Alta fijación"}',
  related_categories = '{"Adhesivos","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Removedor Pink Gel
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'removedor-pink-gel',
  'Removedor Pink Gel',
  280,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/kerat-021-36b8dbd9c51caa6a6a16691318586913-480-0.webp',
  'Adhesivos',
  false,
  'Removedor en gel rosa para extensiones de pestañas. Remoción segura y gentil.',
  '{"No gotea","Remoción controlada"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Adhesivos","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Removedor en gel rosa para extensiones de pestañas. Remoción segura y gentil.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/kerat-021-36b8dbd9c51caa6a6a16691318586913-480-0.webp',
  benefits = '{"No gotea","Remoción controlada"}',
  related_categories = '{"Adhesivos","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Removedor Clear Gel
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'removedor-clear-gel',
  'Removedor Clear Gel',
  280,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/kerat-061-5e6f566b3df2fabc7e16691319066677-480-0.webp',
  'Adhesivos',
  false,
  'Removedor en gel transparente para extensiones de pestañas. Remoción precisa.',
  '{"Transparente","Sin residuos"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Adhesivos","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Removedor en gel transparente para extensiones de pestañas. Remoción precisa.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/kerat-061-5e6f566b3df2fabc7e16691319066677-480-0.webp',
  benefits = '{"Transparente","Sin residuos"}',
  related_categories = '{"Adhesivos","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Sellador para Extensiones de Pestañas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'sellador-extensiones',
  'Sellador para Extensiones de Pestañas',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/kerat-061-5e6f566b3df2fabc7e16691319066677-480-0.webp',
  'Adhesivos',
  false,
  'Sellador para prolongar la duración de las extensiones de pestañas.',
  '{"Mayor duración del adhesivo","Protección extra"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Adhesivos","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Sellador para prolongar la duración de las extensiones de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/kerat-061-5e6f566b3df2fabc7e16691319066677-480-0.webp',
  benefits = '{"Mayor duración del adhesivo","Protección extra"}',
  related_categories = '{"Adhesivos","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Lash Primer
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'lash-primer',
  'Lash Primer',
  250,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/kerat-021-36b8dbd9c51caa6a6a16691318586913-480-0.webp',
  'Adhesivos',
  false,
  'Primer para pestañas. Prepara la pestaña natural para mejor adherencia del adhesivo.',
  '{"Mejor retención","Limpieza profunda"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Adhesivos","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Primer para pestañas. Prepara la pestaña natural para mejor adherencia del adhesivo.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/kerat-021-36b8dbd9c51caa6a6a16691318586913-480-0.webp',
  benefits = '{"Mejor retención","Limpieza profunda"}',
  related_categories = '{"Adhesivos","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Máscara con Vitamina E y Queratina
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'mascara-vitamina-e-queratina',
  'Máscara con Vitamina E y Queratina',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/mascara-con-queratina-y-vitamina-e-4-e0ac482677b85eddc017695390879846-480-0.webp',
  'Máscaras',
  false,
  'Se recomienda su uso después del rizado de pestañas. Enriquecida con vitamina E y Queratina para fortalecer.',
  '{"Fortalecimiento y definición"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Máscaras","Tratamientos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Se recomienda su uso después del rizado de pestañas. Enriquecida con vitamina E y Queratina para fortalecer.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/mascara-con-queratina-y-vitamina-e-4-e0ac482677b85eddc017695390879846-480-0.webp',
  benefits = '{"Fortalecimiento y definición"}',
  related_categories = '{"Máscaras","Tratamientos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Máscara con Microfibras Alargadoras
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'mascara-microfibras-alargadoras',
  'Máscara con Microfibras Alargadoras',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/mascara-con-queratina-y-vitamina-e-4-e0ac482677b85eddc017695390879846-480-0.webp',
  'Máscaras',
  false,
  'Máscara para pestañas con microfibras alargadoras. Efecto pestañas más largas y voluminosas.',
  '{"Efecto alargador","Volumen extra"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Máscaras","Tratamientos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Máscara para pestañas con microfibras alargadoras. Efecto pestañas más largas y voluminosas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/mascara-con-queratina-y-vitamina-e-4-e0ac482677b85eddc017695390879846-480-0.webp',
  benefits = '{"Efecto alargador","Volumen extra"}',
  related_categories = '{"Máscaras","Tratamientos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Beige Pigmento para Cejas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'beige-pigmento-cejas',
  'Beige Pigmento para Cejas',
  200,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Pigmentos',
  false,
  'Pigmento profesional tono Beige para diseño de cejas con henna.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pigmentos","Brow Henna"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pigmento profesional tono Beige para diseño de cejas con henna.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Pigmentos","Brow Henna"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Brown Gray Pigmento para Cejas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'brown-gray-pigmento-cejas',
  'Brown Gray Pigmento para Cejas',
  200,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Pigmentos',
  false,
  'Pigmento profesional tono Brown Gray para diseño de cejas con henna.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pigmentos","Brow Henna"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pigmento profesional tono Brown Gray para diseño de cejas con henna.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Pigmentos","Brow Henna"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Light Brown Pigmento para Cejas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'light-brown-pigmento-cejas',
  'Light Brown Pigmento para Cejas',
  200,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Pigmentos',
  false,
  'Pigmento profesional tono Light Brown para diseño de cejas con henna.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pigmentos","Brow Henna"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pigmento profesional tono Light Brown para diseño de cejas con henna.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Pigmentos","Brow Henna"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Dark Red Pigmento para Cejas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'dark-red-pigmento-cejas',
  'Dark Red Pigmento para Cejas',
  200,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Pigmentos',
  false,
  'Pigmento profesional tono Dark Red para diseño de cejas con henna.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pigmentos","Brow Henna"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pigmento profesional tono Dark Red para diseño de cejas con henna.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Pigmentos","Brow Henna"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Reactor para Pigmento
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'reactor-pigmento',
  'Reactor para Pigmento',
  30,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Pigmentos',
  false,
  'Reactor para activar el pigmento de cejas y pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pigmentos"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Reactor para activar el pigmento de cejas y pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Pigmentos"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva B | 0.05 | GOLD Combo 8-15mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'gold-curva-b-005',
  'Curva B | 0.05 | GOLD Combo 8-15mm',
  400,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Extensiones GOLD premium Curva B grosor 0.05mm combo de 8 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones GOLD premium Curva B grosor 0.05mm combo de 8 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva B | 0.10 | GOLD Combo 8-15mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'gold-curva-b-010',
  'Curva B | 0.10 | GOLD Combo 8-15mm',
  400,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Extensiones GOLD premium Curva B grosor 0.10mm combo de 8 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones GOLD premium Curva B grosor 0.10mm combo de 8 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva B | 0.12 | GOLD Combo 8-15mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'gold-curva-b-012',
  'Curva B | 0.12 | GOLD Combo 8-15mm',
  400,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Extensiones GOLD premium Curva B grosor 0.12mm combo de 8 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones GOLD premium Curva B grosor 0.12mm combo de 8 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva B | 0.20 | GOLD Combo 8-15mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'gold-curva-b-020',
  'Curva B | 0.20 | GOLD Combo 8-15mm',
  400,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Extensiones GOLD premium Curva B grosor 0.20mm combo de 8 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones GOLD premium Curva B grosor 0.20mm combo de 8 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva C | 0.12 | GOLD Combo 8-15mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'gold-curva-c-012',
  'Curva C | 0.12 | GOLD Combo 8-15mm',
  400,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Extensiones GOLD premium Curva C grosor 0.12mm combo de 8 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones GOLD premium Curva C grosor 0.12mm combo de 8 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva D | 0.10 | GOLD Combo 8-15mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'gold-curva-d-010',
  'Curva D | 0.10 | GOLD Combo 8-15mm',
  400,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Extensiones GOLD premium Curva D grosor 0.10mm combo de 8 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones GOLD premium Curva D grosor 0.10mm combo de 8 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva D | 0.20 | GOLD Combo 8-15mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'gold-curva-d-020',
  'Curva D | 0.20 | GOLD Combo 8-15mm',
  400,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Extensiones GOLD premium Curva D grosor 0.20mm combo de 8 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones GOLD premium Curva D grosor 0.20mm combo de 8 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva CC | 0.15 | Mix 7-15mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-cc-015-mix',
  'Curva CC | 0.15 | Mix 7-15mm',
  400,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Extensiones Curva CC grosor 0.15mm mix de 7 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones Curva CC grosor 0.15mm mix de 7 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestaña Curva C | 0.20 | 17mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-c-020-17mm',
  'Pestaña Curva C | 0.20 | 17mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Pestaña individual Curva C grosor 0.20mm largo 17mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestaña individual Curva C grosor 0.20mm largo 17mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva C | 0.15 | Combo 8-15mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-c-015-combo',
  'Curva C | 0.15 | Combo 8-15mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Extensiones Curva C grosor 0.15mm combo de 8 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones Curva C grosor 0.15mm combo de 8 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva B | 0.15 | Combo 8-15mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-b-015-combo',
  'Curva B | 0.15 | Combo 8-15mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Extensiones Curva B grosor 0.15mm combo de 8 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones Curva B grosor 0.15mm combo de 8 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva B | 0.20 | Combo 8-15mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-b-020-combo',
  'Curva B | 0.20 | Combo 8-15mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Extensiones Curva B grosor 0.20mm combo de 8 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones Curva B grosor 0.20mm combo de 8 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva C | 0.25 | Combo 8-15mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-c-025-combo',
  'Curva C | 0.25 | Combo 8-15mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Extensiones Curva C grosor 0.25mm combo de 8 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones Curva C grosor 0.25mm combo de 8 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva D | 0.25 | Combo 8-15mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-d-025-combo',
  'Curva D | 0.25 | Combo 8-15mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Extensiones Curva D grosor 0.25mm combo de 8 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones Curva D grosor 0.25mm combo de 8 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva C | 0.05 | Dimensional 3D Combo
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-c-005-3d',
  'Curva C | 0.05 | Dimensional 3D Combo',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Extensiones dimensionales 3D Curva C grosor 0.05mm combo.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones dimensionales 3D Curva C grosor 0.05mm combo.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestaña | Curva C | 0.15
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-curva-c-015',
  'Pestaña | Curva C | 0.15',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Pestaña individual Curva C grosor 0.15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestaña individual Curva C grosor 0.15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestaña | Curva D | 0.15
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-curva-d-015',
  'Pestaña | Curva D | 0.15',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Extensiones',
  false,
  'Pestaña individual Curva D grosor 0.15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestaña individual Curva D grosor 0.15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Volumen Extensiones Mod. A1
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-volumen-a1',
  'Pinza Volumen Extensiones Mod. A1',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Pinza profesional para extensiones de volumen modelo A1.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza profesional para extensiones de volumen modelo A1.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Volumen Extensiones Mod. A2
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-volumen-a2',
  'Pinza Volumen Extensiones Mod. A2',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Pinza profesional para extensiones de volumen modelo A2.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza profesional para extensiones de volumen modelo A2.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Ele para Extensiones
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-ele-extensiones',
  'Pinza Ele para Extensiones',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Pinza en forma de L para colocar extensiones de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza en forma de L para colocar extensiones de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Punta para Extensiones
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-punta-extensiones',
  'Pinza Punta para Extensiones',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Pinza de punta fina para aislar y colocar extensiones de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza de punta fina para aislar y colocar extensiones de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza para Colocar
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-colocar',
  'Pinza para Colocar',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Pinza profesional para colocar extensiones de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza profesional para colocar extensiones de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Volumen Cod: TVA4
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-volumen-tva4',
  'Pinza Volumen Cod: TVA4',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Pinza de volumen modelo TVA4 para extensiones de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza de volumen modelo TVA4 para extensiones de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Vetus MCS-18
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-vetus-mcs18',
  'Pinza Vetus MCS-18',
  250,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Pinza profesional Vetus modelo MCS-18. Acero de alta calidad.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza profesional Vetus modelo MCS-18. Acero de alta calidad.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Vetus MCS-12
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-vetus-mcs12',
  'Pinza Vetus MCS-12',
  250,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Pinza profesional Vetus modelo MCS-12. Acero de alta calidad.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza profesional Vetus modelo MCS-12. Acero de alta calidad.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Extensiones en Grupo con Keratina
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-keratina-grupo',
  'Pinza Extensiones en Grupo con Keratina',
  70,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Pinza para extensiones en grupo con recubrimiento de keratina.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza para extensiones en grupo con recubrimiento de keratina.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Botox para Cejas y Pestañas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'botox-cejas-pestanas',
  'Botox para Cejas y Pestañas',
  600,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-30-a-las-19-57-071-04021a75d3be481cba16671814910615-480-0.webp',
  'Tratamientos',
  true,
  'Kit completo de Botox para cejas y pestañas. Nutre, engrosa y fortalece desde la raíz.',
  '{"Engrosamiento","Nutrición profunda","Fortalecimiento"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Tratamientos","Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Kit completo de Botox para cejas y pestañas. Nutre, engrosa y fortalece desde la raíz.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-30-a-las-19-57-071-04021a75d3be481cba16671814910615-480-0.webp',
  benefits = '{"Engrosamiento","Nutrición profunda","Fortalecimiento"}',
  related_categories = '{"Tratamientos","Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cisteamina Lash & Brows
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cisteamina-lash-brows-kit',
  'Cisteamina Lash & Brows',
  1800,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-30-a-las-19-57-071-04021a75d3be481cba16671814910615-480-0.webp',
  'Tratamientos',
  true,
  'Kit profesional de Cisteamina para tratamiento de pestañas y cejas. Alternativa avanzada al lifting tradicional.',
  '{"Fórmula de cisteamina","Menos agresivo","Resultados superiores"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Tratamientos","Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Kit profesional de Cisteamina para tratamiento de pestañas y cejas. Alternativa avanzada al lifting tradicional.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-30-a-las-19-57-071-04021a75d3be481cba16671814910615-480-0.webp',
  benefits = '{"Fórmula de cisteamina","Menos agresivo","Resultados superiores"}',
  related_categories = '{"Tratamientos","Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Laminado Cisteamina Estabilizada
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'laminado-cisteamina',
  'Laminado Cisteamina Estabilizada',
  1500,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-30-a-las-19-57-071-04021a75d3be481cba16671814910615-480-0.webp',
  'Tratamientos',
  false,
  'Kit profesional de laminado con cisteamina estabilizada. Resultados premium para cejas.',
  '{"Cisteamina estabilizada","Resultados duraderos","Sin dañar la fibra capilar"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Tratamientos","Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Kit profesional de laminado con cisteamina estabilizada. Resultados premium para cejas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-30-a-las-19-57-071-04021a75d3be481cba16671814910615-480-0.webp',
  benefits = '{"Cisteamina estabilizada","Resultados duraderos","Sin dañar la fibra capilar"}',
  related_categories = '{"Tratamientos","Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: PRO Lash Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pro-lash-lifting-kit',
  'PRO Lash Lifting',
  385,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Lash Lifting',
  false,
  'Kit PRO Lash Lifting. Versión compacta profesional del kit de lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Kit PRO Lash Lifting. Versión compacta profesional del kit de lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Clips para Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'clips-lifting',
  'Clips para Lifting',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Lash Lifting',
  false,
  'Set de clips profesionales para procedimiento de lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting","Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Set de clips profesionales para procedimiento de lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Lash Lifting","Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Aro
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-aro',
  'Pad Aro',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Lash Lifting',
  false,
  'Pad en forma de aro para lifting. Diseño ergonómico.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad en forma de aro para lifting. Diseño ergonómico.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Espátula Plástica - Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'espatula-plastica-lifting',
  'Espátula Plástica - Lifting',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Lash Lifting',
  false,
  'Espátula plástica para aplicación de productos durante lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting","Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Espátula plástica para aplicación de productos durante lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Lash Lifting","Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Crema Lash Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'crema-lash-lifting-ind',
  'Crema Lash Lifting',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Lash Lifting',
  false,
  'Crema individual para lash lifting. Repuesto para kit.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Crema individual para lash lifting. Repuesto para kit.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Crema Fijadora Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'crema-fijadora-lifting-ind',
  'Crema Fijadora Lifting',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Lash Lifting',
  false,
  'Crema fijadora individual para lash lifting. Repuesto para kit.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Crema fijadora individual para lash lifting. Repuesto para kit.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Rollo Plástico Osmótico
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'rollo-plastico-osmotico',
  'Rollo Plástico Osmótico',
  80,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Lash Lifting',
  false,
  'Rollo de plástico osmótico para potenciar el efecto del lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting","Accesorios"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Rollo de plástico osmótico para potenciar el efecto del lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Lash Lifting","Accesorios"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Brow Fixative - Brow Soap
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'brow-fixative-soap',
  'Brow Fixative - Brow Soap',
  70,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/brows-fixative-3-bcbac541f8e9fb29f417589971064547-480-0.webp',
  'Diseño de Cejas',
  false,
  'Jabón fijador para cejas. Efecto brow lamination natural.',
  '{"Fijación duradera","Acabado natural"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Jabón fijador para cejas. Efecto brow lamination natural.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/brows-fixative-3-bcbac541f8e9fb29f417589971064547-480-0.webp',
  benefits = '{"Fijación duradera","Acabado natural"}',
  related_categories = '{"Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cristal para Adhesivo 6.5 cm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cristal-adhesivo-65',
  'Cristal para Adhesivo 6.5 cm',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Cristal de 6.5 cm para depositar adhesivo de extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Cristal de 6.5 cm para depositar adhesivo de extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cristal para Adhesivo 4.5 cm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cristal-adhesivo-45',
  'Cristal para Adhesivo 4.5 cm',
  80,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Cristal de 4.5 cm para depositar adhesivo de extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Cristal de 4.5 cm para depositar adhesivo de extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Holder Cristal
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'holder-cristal',
  'Holder Cristal',
  140,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Soporte holder para cristal de adhesivo.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Soporte holder para cristal de adhesivo.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Soporte de Pestañas de Silicón
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'soporte-pestanas-silicon',
  'Soporte de Pestañas de Silicón',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Soporte de silicón para organizar pestañas durante el procedimiento.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Soporte de silicón para organizar pestañas durante el procedimiento.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Protector para Párpado 20 pares
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'protector-parpado-20',
  'Protector para Párpado 20 pares',
  40,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Accesorios',
  false,
  'Protectores de gel para párpado inferior. Paquete de 20 pares.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Protectores de gel para párpado inferior. Paquete de 20 pares.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Accesorios","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Protector para Párpado 70 pares
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'protector-parpado-70',
  'Protector para Párpado 70 pares',
  70,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Accesorios',
  false,
  'Protectores de gel para párpado inferior. Paquete de 70 pares.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Protectores de gel para párpado inferior. Paquete de 70 pares.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Accesorios","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Espejo para Pestañas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'espejo-pestanas',
  'Espejo para Pestañas',
  80,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Espejo auxiliar para verificar la colocación de extensiones de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Espejo auxiliar para verificar la colocación de extensiones de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cepillo Individual para Pestañas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cepillo-individual-pestanas',
  'Cepillo Individual para Pestañas',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Accesorios',
  false,
  'Cepillo individual para peinar y separar extensiones de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Cepillo individual para peinar y separar extensiones de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Accesorios","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Anillo con 10 Contenedores
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'anillo-10-contenedores',
  'Anillo con 10 Contenedores',
  30,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Accesorios',
  false,
  'Anillo con 10 contenedores para adhesivo y productos durante procedimientos.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Anillo con 10 contenedores para adhesivo y productos durante procedimientos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Accesorios","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Anillo Copa Volumen 10 pzas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'anillo-copa-volumen-10',
  'Anillo Copa Volumen 10 pzas',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Accesorios',
  false,
  'Anillo tipo copa para volumen. Paquete de 10 piezas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Anillo tipo copa para volumen. Paquete de 10 piezas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Accesorios","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cinta Adhesiva
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cinta-adhesiva-ext',
  'Cinta Adhesiva',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/cinta-plastico11-a71209ec9ed985a90016034886124545-480-0.webp',
  'Accesorios',
  false,
  'Cinta adhesiva para protección durante procedimientos de extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Cinta adhesiva para protección durante procedimientos de extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/cinta-plastico11-a71209ec9ed985a90016034886124545-480-0.webp',
  related_categories = '{"Accesorios","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cinta Microfoam
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cinta-microfoam',
  'Cinta Microfoam',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/cinta-microfoam11-8f139166d09bc9572916034888094159-480-0.webp',
  'Accesorios',
  false,
  'Cinta microfoam profesional para protección de párpados durante extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Cinta microfoam profesional para protección de párpados durante extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/cinta-microfoam11-8f139166d09bc9572916034888094159-480-0.webp',
  related_categories = '{"Accesorios","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Espátula Cosmética
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'espatula-cosmetica',
  'Espátula Cosmética',
  20,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/23_mesa-de-trabajo-11-259e00bae1071806dc16687974095793-480-0.webp',
  'Accesorios',
  false,
  'Espátula para mezclar pigmentos, cremas o retirar producto de manera higiénica.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Espátula para mezclar pigmentos, cremas o retirar producto de manera higiénica.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/23_mesa-de-trabajo-11-259e00bae1071806dc16687974095793-480-0.webp',
  related_categories = '{"Accesorios"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Microbrush 10 pzas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'microbrush-10',
  'Microbrush 10 pzas',
  35,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/micro10-031-bf736fe965e0d7493b16691440926657-480-0.webp',
  'Accesorios',
  false,
  'Microaplicadores desechables para aplicación precisa. Paquete de 10 piezas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Microaplicadores desechables para aplicación precisa. Paquete de 10 piezas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/micro10-031-bf736fe965e0d7493b16691440926657-480-0.webp',
  related_categories = '{"Accesorios"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cepillos para Pestañas 10 pzas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cepillos10-pestanas',
  'Cepillos para Pestañas 10 pzas',
  40,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/micro10-031-bf736fe965e0d7493b16691440926657-480-0.webp',
  'Accesorios',
  false,
  'Cepillos desechables para pestañas. Paquete de 10 piezas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Cepillos desechables para pestañas. Paquete de 10 piezas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/micro10-031-bf736fe965e0d7493b16691440926657-480-0.webp',
  related_categories = '{"Accesorios"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cepillos para Pestañas 50 pzas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cepillos-50-piezas',
  'Cepillos para Pestañas 50 pzas',
  65,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/micro10-031-bf736fe965e0d7493b16691440926657-480-0.webp',
  'Accesorios',
  false,
  'Cepillos desechables para pestañas. Paquete de 50 piezas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Cepillos desechables para pestañas. Paquete de 50 piezas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/micro10-031-bf736fe965e0d7493b16691440926657-480-0.webp',
  related_categories = '{"Accesorios"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cepillo Largo para Pestañas 100 pzas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cepillo-largo-100pz',
  'Cepillo Largo para Pestañas 100 pzas',
  260,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/micro10-031-bf736fe965e0d7493b16691440926657-480-0.webp',
  'Accesorios',
  false,
  'Cepillos largos para pestañas. Paquete de 100 piezas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Cepillos largos para pestañas. Paquete de 100 piezas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/micro10-031-bf736fe965e0d7493b16691440926657-480-0.webp',
  related_categories = '{"Accesorios"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Lash Shampo Espuma
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'lash-shampo-espuma',
  'Lash Shampo Espuma',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/bifasico_mesa-de-trabajo-1-6eb4be9674069796fb17344099355972-480-0.webp',
  'Higiene',
  false,
  'Shampoo en espuma para limpieza de extensiones de pestañas y pestañas naturales.',
  '{"Limpieza suave","No daña extensiones"}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Higiene","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Shampoo en espuma para limpieza de extensiones de pestañas y pestañas naturales.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/bifasico_mesa-de-trabajo-1-6eb4be9674069796fb17344099355972-480-0.webp',
  benefits = '{"Limpieza suave","No daña extensiones"}',
  related_categories = '{"Higiene","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Desmaquillante Bifásico
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'desmaquillante-bifasico',
  'Desmaquillante Bifásico',
  75,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/bifasico_mesa-de-trabajo-1-6eb4be9674069796fb17344099355972-480-0.webp',
  'Higiene',
  false,
  'Desmaquillante bifásico suave para limpieza de ojos y extensiones de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Higiene"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Desmaquillante bifásico suave para limpieza de ojos y extensiones de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/bifasico_mesa-de-trabajo-1-6eb4be9674069796fb17344099355972-480-0.webp',
  related_categories = '{"Higiene"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Desinfectante para Pinzas y Pads
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'desinfectante-pinzas-pads',
  'Desinfectante para Pinzas y Pads',
  75,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/bifasico_mesa-de-trabajo-1-6eb4be9674069796fb17344099355972-480-0.webp',
  'Higiene',
  false,
  'Desinfectante profesional para limpieza de pinzas y pads de lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Higiene","Herramientas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Desinfectante profesional para limpieza de pinzas y pads de lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/bifasico_mesa-de-trabajo-1-6eb4be9674069796fb17344099355972-480-0.webp',
  related_categories = '{"Higiene","Herramientas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Brocha para Limpieza
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'brocha-limpieza',
  'Brocha para Limpieza',
  120,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Higiene',
  false,
  'Brocha profesional para limpieza de pestañas antes de procedimientos.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Higiene","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Brocha profesional para limpieza de pestañas antes de procedimientos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Higiene","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cubrebocas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cubrebocas',
  'Cubrebocas',
  25,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/mica1-1ead16074c150b7c3f15494014566587-480-0.webp',
  'Higiene',
  false,
  'Cubrebocas desechable para protección durante procedimientos.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Higiene"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Cubrebocas desechable para protección durante procedimientos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/mica1-1ead16074c150b7c3f15494014566587-480-0.webp',
  related_categories = '{"Higiene"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Seis Caretas Faciales
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'seis-caretas-faciales',
  'Seis Caretas Faciales',
  120,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/mica1-1ead16074c150b7c3f15494014566587-480-0.webp',
  'Higiene',
  false,
  'Paquete de 6 caretas faciales protectoras para procedimientos.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Higiene"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Paquete de 6 caretas faciales protectoras para procedimientos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/mica1-1ead16074c150b7c3f15494014566587-480-0.webp',
  related_categories = '{"Higiene"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Paño Limpiador de Boquilla
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pano-limpiador-boquilla',
  'Paño Limpiador de Boquilla',
  120,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Accesorios',
  false,
  'Paño profesional para limpieza de boquilla de pegamento.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Paño profesional para limpieza de boquilla de pegamento.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Accesorios","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Vernier
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'vernier',
  'Vernier',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Vernier de precisión para medir largo de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Vernier de precisión para medir largo de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: J.EYEBROW
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'j-eyebrow',
  'J.EYEBROW',
  25,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/brows-fixative-3-bcbac541f8e9fb29f417589971064547-480-0.webp',
  'Diseño de Cejas',
  false,
  'Producto J.EYEBROW para diseño rápido de cejas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Producto J.EYEBROW para diseño rápido de cejas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/brows-fixative-3-bcbac541f8e9fb29f417589971064547-480-0.webp',
  related_categories = '{"Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Exhibidor de Tiras
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'exhibidor-tiras',
  'Exhibidor de Tiras',
  300,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Exhibidor profesional para mostrar pestañas de tira en punto de venta.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Pestañas en Tira"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Exhibidor profesional para mostrar pestañas de tira en punto de venta.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Pestañas en Tira"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Glue Shaker
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'glue-shaker',
  'Glue Shaker',
  650,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/shaker_mesa-de-trabajo-1-copia-4e0418ae0983baf4f617344074504573-480-0.webp',
  'Herramientas',
  false,
  'Agitador eléctrico de adhesivo para extensiones de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Agitador eléctrico de adhesivo para extensiones de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/shaker_mesa-de-trabajo-1-copia-4e0418ae0983baf4f617344074504573-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Maniquí Práctica de Extensiones
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'maniqui-extensiones',
  'Maniquí Práctica de Extensiones',
  220,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Maniquí para práctica de extensiones de pestañas por profesionales.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Maniquí para práctica de extensiones de pestañas por profesionales.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Almohada con Estante Organizador
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'almohada-estante-organizador',
  'Almohada con Estante Organizador',
  750,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  'Herramientas',
  false,
  'Almohada profesional con estante organizador integrado para procedimientos de extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Almohada profesional con estante organizador integrado para procedimientos de extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verni-081-c75fff1cc921fb9b2816691435265855-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Tatuaje Temporal para Cejas
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'tatuaje-temporal-cejas',
  'Tatuaje Temporal para Cejas',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/brows-fixative-3-bcbac541f8e9fb29f417589971064547-480-0.webp',
  'Diseño de Cejas',
  false,
  'Tatuaje temporal para diseño y prueba de forma de cejas antes de procedimiento permanente.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Tatuaje temporal para diseño y prueba de forma de cejas antes de procedimiento permanente.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/brows-fixative-3-bcbac541f8e9fb29f417589971064547-480-0.webp',
  related_categories = '{"Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Perfilador Pocket para Ceja
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'perfilador-pocket-ceja',
  'Perfilador Pocket para Ceja',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/brows-fixative-3-bcbac541f8e9fb29f417589971064547-480-0.webp',
  'Diseño de Cejas',
  false,
  'Perfilador compacto pocket para diseño de cejas portátil.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Perfilador compacto pocket para diseño de cejas portátil.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/brows-fixative-3-bcbac541f8e9fb29f417589971064547-480-0.webp',
  related_categories = '{"Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Sellador para Tintura Tópica
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'sellador-tintura',
  'Sellador para Tintura Tópica',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Tintura',
  false,
  'Sellador profesional para tintura tópica de cejas y pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Tintura"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Sellador profesional para tintura tópica de cejas y pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Tintura"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Activador para Tintura Tópica
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'activador-tintura',
  'Activador para Tintura Tópica',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Tintura',
  false,
  'Activador profesional para tintura tópica de cejas y pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Tintura"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Activador profesional para tintura tópica de cejas y pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Tintura"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad 2 en 1
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-2-en-1',
  'Pad 2 en 1',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/pad-2en1-04-ca761e232e805d891e17410115760489-480-0.webp',
  'Lash Lifting',
  false,
  'Pad de silicón 2 en 1 para lash lifting profesional.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad de silicón 2 en 1 para lash lifting profesional.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/pad-2en1-04-ca761e232e805d891e17410115760489-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Anime
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-anime',
  'Pad Anime',
  250,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/anime-05-6e0e314c9e7228afe817410095004166-480-0.webp',
  'Lash Lifting',
  false,
  'Pad de silicón diseño Anime para lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad de silicón diseño Anime para lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/anime-05-6e0e314c9e7228afe817410095004166-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Curva C
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-curva-c',
  'Pad Curva C',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-2-031964be3ce015c34417187368845684-480-0.webp',
  'Lash Lifting',
  false,
  'Pad de silicón con curva C para lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad de silicón con curva C para lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-2-031964be3ce015c34417187368845684-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Rosa sin Canales
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-rosa-sin-canales',
  'Pad Rosa sin Canales',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2021-04-20-a-las-12-51-361-31ffe5daf9b33aeaba16189411299706-480-0.webp',
  'Lash Lifting',
  false,
  'Pad rosa liso sin canales para lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad rosa liso sin canales para lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2021-04-20-a-las-12-51-361-31ffe5daf9b33aeaba16189411299706-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Superior e Inferior
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-superior-inferior',
  'Pad Superior e Inferior',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/verdes-03-a758a450feb27d7f7617187363942632-480-0.webp',
  'Lash Lifting',
  false,
  'Set de pads para pestañas superiores e inferiores.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Set de pads para pestañas superiores e inferiores.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/verdes-03-a758a450feb27d7f7617187363942632-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Colors 8p
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-colors-8p',
  'Pad Colors 8p',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/color8_mesa-de-trabajo-1-082794b81eb64ce0f317187370015350-480-0.webp',
  'Lash Lifting',
  false,
  'Set de 8 pads de colores para lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Set de 8 pads de colores para lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/color8_mesa-de-trabajo-1-082794b81eb64ce0f317187370015350-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Colors 6p
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-colors-6p',
  'Pad Colors 6p',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/color6_mesa-de-trabajo-1-99c271f1e6277b582917187371558250-480-0.webp',
  'Lash Lifting',
  false,
  'Set de 6 pads de colores para lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Set de 6 pads de colores para lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/color6_mesa-de-trabajo-1-99c271f1e6277b582917187371558250-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Oso
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-oso',
  'Pad Oso',
  250,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/osos-03-f51e1dda485dee146d17410099492242-480-0.webp',
  'Lash Lifting',
  false,
  'Pad de silicón diseño Oso para lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad de silicón diseño Oso para lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/osos-03-f51e1dda485dee146d17410099492242-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Corrector (Reversión)
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-corrector-reversion',
  'Pad Corrector (Reversión)',
  300,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-2-031964be3ce015c34417187368845684-480-0.webp',
  'Lash Lifting',
  false,
  'Pad corrector para reversión de lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad corrector para reversión de lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-2-031964be3ce015c34417187368845684-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Mariposa
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-mariposa',
  'Pad Mariposa',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/mariposa-05-764fa14cdfc67005ba17410124758679-480-0.webp',
  'Lash Lifting',
  false,
  'Pad de silicón diseño Mariposa para lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad de silicón diseño Mariposa para lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/mariposa-05-764fa14cdfc67005ba17410124758679-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Elevación L
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-elevacion-l',
  'Pad Elevación L',
  250,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-2-031964be3ce015c34417187368845684-480-0.webp',
  'Lash Lifting',
  false,
  'Pad de elevación tipo L para lash lifting avanzado.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad de elevación tipo L para lash lifting avanzado.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-2-031964be3ce015c34417187368845684-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad LD Simétricos
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-ld-simetricos',
  'Pad LD Simétricos',
  250,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-2-031964be3ce015c34417187368845684-480-0.webp',
  'Lash Lifting',
  false,
  'Pads LD simétricos para lash lifting profesional.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pads LD simétricos para lash lifting profesional.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-2-031964be3ce015c34417187368845684-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pad Nube
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pad-nube',
  'Pad Nube',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-2-031964be3ce015c34417187368845684-480-0.webp',
  'Lash Lifting',
  false,
  'Pad de silicón diseño Nube para lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pad de silicón diseño Nube para lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-2-031964be3ce015c34417187368845684-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestaña Europea de Tira
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-europea-tira',
  'Pestaña Europea de Tira',
  25,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p22-011-a2a1a932fdb14dab2f16494552819533-480-0.webp',
  'Pestañas en Tira',
  false,
  'Pestaña de tira estilo europeo.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pestañas en Tira"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestaña de tira estilo europeo.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p22-011-a2a1a932fdb14dab2f16494552819533-480-0.webp',
  related_categories = '{"Pestañas en Tira"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestaña Decorada de Tira
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-decorada-tira',
  'Pestaña Decorada de Tira',
  20,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/p351-01-50b64373b52faf553616494555466379-480-0.webp',
  'Pestañas en Tira',
  false,
  'Pestaña de tira decorada para ocasiones especiales.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pestañas en Tira"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestaña de tira decorada para ocasiones especiales.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/p351-01-50b64373b52faf553616494555466379-480-0.webp',
  related_categories = '{"Pestañas en Tira"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestaña (D) en Colores
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-d-colores',
  'Pestaña (D) en Colores',
  600,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/big-color-021-35719d95d60eae65d216847754951631-480-0.webp',
  'Extensiones',
  false,
  'Extensiones de pestañas curva D en colores variados.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones de pestañas curva D en colores variados.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/big-color-021-35719d95d60eae65d216847754951631-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pestañas en Grupo o Racimo Azul
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pestana-grupo-racimo-azul',
  'Pestañas en Grupo o Racimo Azul',
  22,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-2-031964be3ce015c34417187368845684-480-0.webp',
  'Pestañas en Tira',
  false,
  'Pestañas en grupo o racimo color azul.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Pestañas en Tira"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pestañas en grupo o racimo color azul.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-2-031964be3ce015c34417187368845684-480-0.webp',
  related_categories = '{"Pestañas en Tira"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Mini Cepillo para Lash Lifting
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'mini-cepillo-lash-lifting',
  'Mini Cepillo para Lash Lifting',
  40,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/fotoooo-19-263e9d2bf7a3e0676017188111757694-480-0.webp',
  'Lash Lifting',
  false,
  'Mini cepillo individual para lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting","Accesorios"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Mini cepillo individual para lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/fotoooo-19-263e9d2bf7a3e0676017188111757694-480-0.webp',
  related_categories = '{"Lash Lifting","Accesorios"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: 50 Cepillos Mini para Laminado
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  '50-cepillo-mini-laminado',
  '50 Cepillos Mini para Laminado',
  160,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/minibrush-2-753349217864bef5fa17558789995527-480-0.webp',
  'Lash Lifting',
  false,
  'Paquete de 50 mini cepillos para laminado de cejas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting","Accesorios"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Paquete de 50 mini cepillos para laminado de cejas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/minibrush-2-753349217864bef5fa17558789995527-480-0.webp',
  related_categories = '{"Lash Lifting","Accesorios"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Cepillo con Guarda
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'cepillo-con-guarda',
  'Cepillo con Guarda',
  85,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-2-031964be3ce015c34417187368845684-480-0.webp',
  'Accesorios',
  false,
  'Cepillo para pestañas con guarda protectora.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Cepillo para pestañas con guarda protectora.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-2-031964be3ce015c34417187368845684-480-0.webp',
  related_categories = '{"Accesorios"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: 50 Cepillos para Pestañas Pro
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  '50-cepillos-pestanas',
  '50 Cepillos para Pestañas Pro',
  60,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/eyelash-brush-73d2f3c727699f45f317558790353516-480-0.webp',
  'Accesorios',
  false,
  'Paquete profesional de 50 cepillos para pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Accesorios"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Paquete profesional de 50 cepillos para pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/eyelash-brush-73d2f3c727699f45f317558790353516-480-0.webp',
  related_categories = '{"Accesorios"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 2D | Curva B | 0.15 | 10 mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-2d-b-015-10',
  'Abanicos | 2D | Curva B | 0.15 | 10 mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 2D curva B grosor 0.15 medida 10mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 2D curva B grosor 0.15 medida 10mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 2D | Curva B | 0.15 | 12 mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-2d-b-015-12',
  'Abanicos | 2D | Curva B | 0.15 | 12 mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-121-c941335c7f2fdfa69716339836792483-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 2D curva B grosor 0.15 medida 12mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 2D curva B grosor 0.15 medida 12mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-121-c941335c7f2fdfa69716339836792483-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 4D | Curva B | 0.15 | 10 mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-4d-b-015-10',
  'Abanicos | 4D | Curva B | 0.15 | 10 mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 4D curva B grosor 0.15 medida 10mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 4D curva B grosor 0.15 medida 10mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 4D | Curva B | 0.15 | 12 mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-4d-b-015-12',
  'Abanicos | 4D | Curva B | 0.15 | 12 mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-121-c941335c7f2fdfa69716339836792483-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 4D curva B grosor 0.15 medida 12mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 4D curva B grosor 0.15 medida 12mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-121-c941335c7f2fdfa69716339836792483-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 5D | Curva B | 0.15 | 10 mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-5d-b-015-10',
  'Abanicos | 5D | Curva B | 0.15 | 10 mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 5D curva B grosor 0.15 medida 10mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 5D curva B grosor 0.15 medida 10mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 4D | Curva C | 0.05 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-4d-c-005',
  'Abanicos | 4D | Curva C | 0.05 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 4D curva C grosor 0.05 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 4D curva C grosor 0.05 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 5D | Curva C | 0.05 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-5d-c-005',
  'Abanicos | 5D | Curva C | 0.05 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 5D curva C grosor 0.05 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 5D curva C grosor 0.05 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 4D | Curva C | 0.07 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-4d-c-007',
  'Abanicos | 4D | Curva C | 0.07 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 4D curva C grosor 0.07 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 4D curva C grosor 0.07 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 5D | Curva C | 0.07 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-5d-c-007',
  'Abanicos | 5D | Curva C | 0.07 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 5D curva C grosor 0.07 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 5D curva C grosor 0.07 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 2D | Curva C | 0.15 | 10 mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-2d-c-015-10',
  'Abanicos | 2D | Curva C | 0.15 | 10 mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 2D curva C grosor 0.15 medida 10mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 2D curva C grosor 0.15 medida 10mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva C | 0.10 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-c-010-combo',
  'Curva C | 0.10 | Mixta',
  280,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Extensiones curva C grosor 0.10 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva C grosor 0.10 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva CC | 0.15 | Combo 7-15 mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-cc-015-combo',
  'Curva CC | 0.15 | Combo 7-15 mm',
  280,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Extensiones curva CC grosor 0.15 combo de 7 a 15mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva CC grosor 0.15 combo de 7 a 15mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 4D | Curva D | 0.05 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-4d-d-005',
  'Abanicos | 4D | Curva D | 0.05 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 4D curva D grosor 0.05 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 4D curva D grosor 0.05 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 5D | Curva D | 0.05 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-5d-d-005',
  'Abanicos | 5D | Curva D | 0.05 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 5D curva D grosor 0.05 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 5D curva D grosor 0.05 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Easy Fan Curva D | 0.05 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'easy-fan-d-005',
  'Easy Fan Curva D | 0.05 | Mixta',
  380,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Easy Fan curva D grosor 0.05 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Easy Fan curva D grosor 0.05 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 4D | Curva D | 0.07 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-4d-d-007',
  'Abanicos | 4D | Curva D | 0.07 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 4D curva D grosor 0.07 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 4D curva D grosor 0.07 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 5D | Curva D | 0.07 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-5d-d-007',
  'Abanicos | 5D | Curva D | 0.07 | Mixta',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 5D curva D grosor 0.07 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 5D curva D grosor 0.07 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Easy Fan Curva D | 0.07 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'easy-fan-d-007',
  'Easy Fan Curva D | 0.07 | Mixta',
  380,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Easy Fan curva D grosor 0.07 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Easy Fan curva D grosor 0.07 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 2D | Curva J | 0.15 | 10 mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-2d-j-015-10',
  'Abanicos | 2D | Curva J | 0.15 | 10 mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 2D curva J grosor 0.15 medida 10mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 2D curva J grosor 0.15 medida 10mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 2D | Curva J | 0.15 | 12 mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-2d-j-015-12',
  'Abanicos | 2D | Curva J | 0.15 | 12 mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-121-c941335c7f2fdfa69716339836792483-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 2D curva J grosor 0.15 medida 12mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 2D curva J grosor 0.15 medida 12mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-121-c941335c7f2fdfa69716339836792483-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Abanicos | 5D | Curva J | 0.15 | 10 mm
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'abanicos-5d-j-015-10',
  'Abanicos | 5D | Curva J | 0.15 | 10 mm',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Abanicos 5D curva J grosor 0.15 medida 10mm.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Abanicos 5D curva J grosor 0.15 medida 10mm.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva L | 0.10 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-l-010-combo',
  'Curva L | 0.10 | Mixta',
  280,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Extensiones curva L grosor 0.10 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva L grosor 0.10 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva L | 0.15 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-l-015-combo',
  'Curva L | 0.15 | Mixta',
  280,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Extensiones curva L grosor 0.15 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva L grosor 0.15 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva LC | 0.10 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-lc-010-combo',
  'Curva LC | 0.10 | Mixta',
  280,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Extensiones curva LC grosor 0.10 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva LC grosor 0.10 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Curva LC | 0.15 | Mixta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'curva-lc-015-combo',
  'Curva LC | 0.15 | Mixta',
  280,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  'Extensiones',
  false,
  'Extensiones curva LC grosor 0.15 combo mixto.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Extensiones curva LC grosor 0.15 combo mixto.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/2d-0-15-b-101-ed1be18f240c6503c716337346424009-480-0.webp',
  related_categories = '{"Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Abanicos sin Punta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-abanicos-sin-punta',
  'Pinza Abanicos sin Punta',
  100,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-punta-11-01f6336c5e77686f5b16275044778948-480-0.webp',
  'Herramientas',
  false,
  'Pinza para abanicos sin punta para extensiones de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza para abanicos sin punta para extensiones de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-punta-11-01f6336c5e77686f5b16275044778948-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Ele M-19
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-ele-m19',
  'Pinza Ele M-19',
  140,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-f73143c3262f6e86e317344090343101-480-0.webp',
  'Herramientas',
  false,
  'Pinza profesional en forma de ele modelo M-19.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza profesional en forma de ele modelo M-19.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-f73143c3262f6e86e317344090343101-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza MD 14 en Ele
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-md14-ele',
  'Pinza MD 14 en Ele',
  200,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/rnqo91301-301a1e5c1eb7c2d41016567718166121-480-0.webp',
  'Herramientas',
  false,
  'Pinza MD 14 en forma de ele para extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza MD 14 en forma de ele para extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/rnqo91301-301a1e5c1eb7c2d41016567718166121-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza MD 14 en Punta
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-md14-punta',
  'Pinza MD 14 en Punta',
  200,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/wpfs53581-363b5cfbc93b7d967216567716588826-480-0.webp',
  'Herramientas',
  false,
  'Pinza MD 14 en punta para extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza MD 14 en punta para extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/wpfs53581-363b5cfbc93b7d967216567716588826-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza para Colocar M-18
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-colocar-m18',
  'Pinza para Colocar M-18',
  140,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-f73143c3262f6e86e317344090343101-480-0.webp',
  'Herramientas',
  false,
  'Pinza para colocar extensiones modelo M-18.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza para colocar extensiones modelo M-18.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-f73143c3262f6e86e317344090343101-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza para Depilar
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-depilar',
  'Pinza para Depilar',
  150,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/con-peine-plata1-5bdd469dc6a19e888716274269228512-480-0.webp',
  'Herramientas',
  false,
  'Pinza profesional para depilar cejas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Diseño de Cejas"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza profesional para depilar cejas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/con-peine-plata1-5bdd469dc6a19e888716274269228512-480-0.webp',
  related_categories = '{"Herramientas","Diseño de Cejas"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Punta Larga
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-punta-larga',
  'Pinza Punta Larga',
  140,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-f73143c3262f6e86e317344090343101-480-0.webp',
  'Herramientas',
  false,
  'Pinza de punta larga para extensiones de pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza de punta larga para extensiones de pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-f73143c3262f6e86e317344090343101-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Pinza Punta M-12
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'pinza-punta-m12',
  'Pinza Punta M-12',
  140,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-f73143c3262f6e86e317344090343101-480-0.webp',
  'Herramientas',
  false,
  'Pinza punta modelo M-12 para extensiones.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Herramientas","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Pinza punta modelo M-12 para extensiones.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-f73143c3262f6e86e317344090343101-480-0.webp',
  related_categories = '{"Herramientas","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Adhesivo Bálsamo Butter 30 gr
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'adhesivo-balsamo-30gr',
  'Adhesivo Bálsamo Butter 30 gr',
  380,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Adhesivos',
  false,
  'Adhesivo bálsamo butter presentación de 30 gramos.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Adhesivos","Extensiones"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Adhesivo bálsamo butter presentación de 30 gramos.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Adhesivos","Extensiones"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Limpiador de Impurezas | Piel Normal y Seca
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'limpiador-impurezas-normal-seca',
  'Limpiador de Impurezas | Piel Normal y Seca',
  90,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Higiene',
  false,
  'Limpiador de impurezas formulado para piel normal y seca.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Higiene","Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Limpiador de impurezas formulado para piel normal y seca.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Higiene","Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Tintura Tópica - Castaño Oscuro
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'tintura-topica-castano-oscuro',
  'Tintura Tópica - Castaño Oscuro',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Tintura',
  false,
  'Tintura tópica profesional color castaño oscuro para cejas y pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Tintura"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Tintura tópica profesional color castaño oscuro para cejas y pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Tintura"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Tintura Tópica - Negro
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'tintura-topica-negro',
  'Tintura Tópica - Negro',
  350,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  'Tintura',
  false,
  'Tintura tópica profesional color negro para cejas y pestañas.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Tintura"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Tintura tópica profesional color negro para cejas y pestañas.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/captura-de-pantalla-2022-10-27-a-las-22-07-361-25ed0e1a59714d490e16669266380337-480-0.webp',
  related_categories = '{"Tintura"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Rulos Adhesivos Curva CH
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'rulos-adhesivos-curva-ch',
  'Rulos Adhesivos Curva CH',
  70,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-071-f0552b059105e2a53d16669736033613-480-0.webp',
  'Lash Lifting',
  false,
  'Rulos adhesivos curva corta (CH) para lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Rulos adhesivos curva corta (CH) para lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-071-f0552b059105e2a53d16669736033613-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Rulos Adhesivos Curva M
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'rulos-adhesivos-curva-m',
  'Rulos Adhesivos Curva M',
  70,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-071-f0552b059105e2a53d16669736033613-480-0.webp',
  'Lash Lifting',
  false,
  'Rulos adhesivos curva media (M) para lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Rulos adhesivos curva media (M) para lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-071-f0552b059105e2a53d16669736033613-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Rulos Desechables Curva Corta CH
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'rulos-desechables-ch',
  'Rulos Desechables Curva Corta CH',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-071-f0552b059105e2a53d16669736033613-480-0.webp',
  'Lash Lifting',
  false,
  'Rulos desechables curva corta (CH) para lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Rulos desechables curva corta (CH) para lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-071-f0552b059105e2a53d16669736033613-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Product: Rulos Desechables Curva Amplia G
INSERT INTO products (slug, name, price, compare_at_price, image_url, category, is_featured, description, benefits, includes, performance, specifications, gallery, video, related_categories, original_price, distributor_price, promotion)
VALUES (
  'rulos-desechables-g',
  'Rulos Desechables Curva Amplia G',
  50,
  NULL,
  'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-071-f0552b059105e2a53d16669736033613-480-0.webp',
  'Lash Lifting',
  false,
  'Rulos desechables curva amplia (G) para lash lifting.',
  '{}',
  '{}',
  NULL,
  '{}',
  '{}',
  NULL,
  '{"Lash Lifting"}',
  NULL,
  NULL,
  NULL
)
ON CONFLICT (slug) DO UPDATE SET
  description = 'Rulos desechables curva amplia (G) para lash lifting.',
  image_url = 'https://acdn-us.mitiendanube.com/stores/694/809/products/sin-titulo-1-071-f0552b059105e2a53d16669736033613-480-0.webp',
  related_categories = '{"Lash Lifting"}',
  updated_at = CURRENT_TIMESTAMP;

-- Mark bestsellers as featured
UPDATE products SET is_featured = true WHERE slug IN ('laminado-cejas', 'jade-rizado-pestanas', 'chocolate-pigmento-cejas', 'pigmento-pestanas', 'tratamiento-alargador', 'adhesivo-supreme-g4');

-- =============================================
-- VARIANT GROUPS AND PRODUCT VARIANTS
-- =============================================

-- Clear existing variant data to re-seed
DELETE FROM product_variants;
DELETE FROM variant_groups;

-- Variant Group 1: Extensiones Mink J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Extensiones Mink J.Denis', '["Curva"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Extensiones Mink J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pestana-mink-curva-c', '{"Curva":"C"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pestana-mink-curva-d', '{"Curva":"D"}'::jsonb);
END $$;

-- Variant Group 2: Extensiones Individuales Mixtas
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Extensiones Individuales Mixtas', '["Curva","Grosor"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Extensiones Individuales Mixtas' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'curva-b-010-combo', '{"Curva":"B","Grosor":"0.10"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'curva-c-010-combo', '{"Curva":"C","Grosor":"0.10"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'curva-l-010-combo', '{"Curva":"L","Grosor":"0.10"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'curva-l-015-combo', '{"Curva":"L","Grosor":"0.15"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'curva-lc-010-combo', '{"Curva":"LC","Grosor":"0.10"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'curva-lc-015-combo', '{"Curva":"LC","Grosor":"0.15"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'curva-cc-015-combo', '{"Curva":"CC","Grosor":"0.15"}'::jsonb);
END $$;

-- Variant Group 3: Extensiones Easy Fan J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Extensiones Easy Fan J.Denis', '["Curva","Grosor"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Extensiones Easy Fan J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'easy-fan-curva-c', '{"Curva":"C","Grosor":"Mixta"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'easy-fan-curva-d-005', '{"Curva":"D","Grosor":"0.05"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'easy-fan-curva-d-007', '{"Curva":"D","Grosor":"0.07"}'::jsonb);
END $$;

-- Variant Group 4: Abanicos Pre-hechos J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Abanicos Pre-hechos J.Denis', '["Dimensión","Curva","Grosor","Largo"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Abanicos Pre-hechos J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-3d-c-007', '{"Dimensión":"3D","Curva":"C","Grosor":"0.07","Largo":"Mixta"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-2d-b-015-10', '{"Dimensión":"2D","Curva":"B","Grosor":"0.15","Largo":"10mm"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-2d-b-015-12', '{"Dimensión":"2D","Curva":"B","Grosor":"0.15","Largo":"12mm"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-2d-c-015-10', '{"Dimensión":"2D","Curva":"C","Grosor":"0.15","Largo":"10mm"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-2d-j-015-10', '{"Dimensión":"2D","Curva":"J","Grosor":"0.15","Largo":"10mm"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-2d-j-015-12', '{"Dimensión":"2D","Curva":"J","Grosor":"0.15","Largo":"12mm"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-4d-b-015-10', '{"Dimensión":"4D","Curva":"B","Grosor":"0.15","Largo":"10mm"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-4d-b-015-12', '{"Dimensión":"4D","Curva":"B","Grosor":"0.15","Largo":"12mm"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-4d-c-005', '{"Dimensión":"4D","Curva":"C","Grosor":"0.05","Largo":"Mixta"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-4d-c-007', '{"Dimensión":"4D","Curva":"C","Grosor":"0.07","Largo":"Mixta"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-4d-d-005', '{"Dimensión":"4D","Curva":"D","Grosor":"0.05","Largo":"Mixta"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-4d-d-007', '{"Dimensión":"4D","Curva":"D","Grosor":"0.07","Largo":"Mixta"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-5d-b-015-10', '{"Dimensión":"5D","Curva":"B","Grosor":"0.15","Largo":"10mm"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-5d-j-015-10', '{"Dimensión":"5D","Curva":"J","Grosor":"0.15","Largo":"10mm"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-5d-c-005', '{"Dimensión":"5D","Curva":"C","Grosor":"0.05","Largo":"Mixta"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-5d-c-007', '{"Dimensión":"5D","Curva":"C","Grosor":"0.07","Largo":"Mixta"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-5d-d-005', '{"Dimensión":"5D","Curva":"D","Grosor":"0.05","Largo":"Mixta"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'abanicos-5d-d-007', '{"Dimensión":"5D","Curva":"D","Grosor":"0.07","Largo":"Mixta"}'::jsonb);
END $$;

-- Variant Group 5: Extensiones en Colores J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Extensiones en Colores J.Denis', '["Curva"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Extensiones en Colores J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pestana-c-colores', '{"Curva":"C"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pestana-d-colores', '{"Curva":"D"}'::jsonb);
END $$;

-- Variant Group 6: Rulos Desechables J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Rulos Desechables J.Denis', '["Tamaño"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Rulos Desechables J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'rulos-desechables-ch', '{"Tamaño":"CH (Corta)"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'rulos-desechables-m', '{"Tamaño":"M (Media)"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'rulos-desechables-g', '{"Tamaño":"G (Amplia)"}'::jsonb);
END $$;

-- Variant Group 7: Rulos Adhesivos J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Rulos Adhesivos J.Denis', '["Curva"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Rulos Adhesivos J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'rulos-adhesivos-curva-g', '{"Curva":"G"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'rulos-adhesivos-curva-ch', '{"Curva":"CH"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'rulos-adhesivos-curva-m', '{"Curva":"M"}'::jsonb);
END $$;

-- Variant Group 8: Tintura Tópica J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Tintura Tópica J.Denis', '["Tono"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Tintura Tópica J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'tintura-topica-castano-medio', '{"Tono":"Castaño Medio"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'tintura-topica-castano-oscuro', '{"Tono":"Castaño Oscuro"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'tintura-topica-negro', '{"Tono":"Negro"}'::jsonb);
END $$;

-- Variant Group 9: Pestañas en Grupo o Racimo
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Pestañas en Grupo o Racimo', '["Color"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Pestañas en Grupo o Racimo' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pestana-grupo-racimo', '{"Color":"Negro"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pestana-grupo-racimo-azul', '{"Color":"Azul"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pestana-grupo-racimo-cafe', '{"Color":"Café"}'::jsonb);
END $$;

-- Variant Group 10: Crema Lash Lifting J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Crema Lash Lifting J.Denis', '["Paso"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Crema Lash Lifting J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'crema-lifting-paso-1', '{"Paso":"1 – Ondulante"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'crema-fijadora-paso-2', '{"Paso":"2 – Fijadora"}'::jsonb);
END $$;

-- Variant Group 11: Limpiador de Impurezas J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Limpiador de Impurezas J.Denis', '["Tipo de Piel"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Limpiador de Impurezas J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'limpiador-impurezas', '{"Tipo de Piel":"Mixta / Grasa"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'limpiador-impurezas-normal-seca', '{"Tipo de Piel":"Normal / Seca"}'::jsonb);
END $$;

-- Variant Group 12: Adhesivo Bálsamo J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Adhesivo Bálsamo J.Denis', '["Presentación"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Adhesivo Bálsamo J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'adhesivo-balsamo-20gr', '{"Presentación":"20 gr"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'adhesivo-balsamo-30gr', '{"Presentación":"Butter 30 gr"}'::jsonb);
END $$;

-- Variant Group 13: Pinzas Profesionales J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Pinzas Profesionales J.Denis', '["Modelo"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Pinzas Profesionales J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pinza-pestanas-tira', '{"Modelo":"Pestañas de Tira"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pinza-depilar', '{"Modelo":"Depilar"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pinza-punta-larga', '{"Modelo":"Punta Larga"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pinza-abanicos-sin-punta', '{"Modelo":"Abanicos sin Punta"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pinza-punta-m12', '{"Modelo":"Punta M-12"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pinza-colocar-m18', '{"Modelo":"Colocar M-18"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pinza-ele-m19', '{"Modelo":"Ele M-19"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pinza-md14-punta', '{"Modelo":"MD 14 en Punta"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pinza-md14-ele', '{"Modelo":"MD 14 en Ele"}'::jsonb);
END $$;

-- Variant Group 14: Pads para Lash Lifting J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Pads para Lash Lifting J.Denis', '["Diseño"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Pads para Lash Lifting J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pad-rosas-micro-canales', '{"Diseño":"Rosas con Micro Canales"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pad-nube', '{"Diseño":"Nube"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pad-anime', '{"Diseño":"Anime"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pad-curva-c', '{"Diseño":"Curva C"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pad-rosa-sin-canales', '{"Diseño":"Rosa sin Canales"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pad-superior-inferior', '{"Diseño":"Superior e Inferior"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pad-colors-8p', '{"Diseño":"Colors 8p"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pad-colors-6p', '{"Diseño":"Colors 6p"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pad-oso', '{"Diseño":"Oso"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pad-corrector-reversion', '{"Diseño":"Corrector (Reversión)"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pad-2-en-1', '{"Diseño":"2 en 1"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pad-mariposa', '{"Diseño":"Mariposa"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pad-elevacion-l', '{"Diseño":"Elevación L"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pad-ld-simetricos', '{"Diseño":"LD Simétricos"}'::jsonb);
END $$;

-- Variant Group 15: Pestañas de Tira J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Pestañas de Tira J.Denis', '["Tipo"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Pestañas de Tira J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pestana-americana-tira', '{"Tipo":"Americana"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pestana-europea-tira', '{"Tipo":"Europea"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'pestana-decorada-tira', '{"Tipo":"Decorada"}'::jsonb);
END $$;

-- Variant Group 16: Mini Cepillos J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Mini Cepillos J.Denis', '["Uso"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Mini Cepillos J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'mini-cepillo-laminado', '{"Uso":"Laminado (1 pza)"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'mini-cepillo-lash-lifting', '{"Uso":"Lash Lifting (1 pza)"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, '50-cepillo-mini-laminado', '{"Uso":"Laminado (50 pzas)"}'::jsonb);
END $$;

-- Variant Group 17: Cepillos para Pestañas J.Denis
INSERT INTO variant_groups (id, name, attribute_names)
VALUES (gen_random_uuid(), 'Cepillos para Pestañas J.Denis', '["Presentación"]'::jsonb)
RETURNING id;

-- Store the variant group ID for product_variants
DO $$
DECLARE vg_id uuid;
BEGIN
  SELECT id INTO vg_id FROM variant_groups WHERE name = 'Cepillos para Pestañas J.Denis' LIMIT 1;
  
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'cepillos-pestanas-50', '{"Presentación":"50 pzas Estándar"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'cepillo-largo-100', '{"Presentación":"100 pzas Largo"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, 'cepillo-con-guarda', '{"Presentación":"Con Guarda"}'::jsonb);
  INSERT INTO product_variants (group_id, product_id, attributes)
  VALUES (vg_id, '50-cepillos-pestanas', '{"Presentación":"50 pzas Pro"}'::jsonb);
END $$;

COMMIT;
