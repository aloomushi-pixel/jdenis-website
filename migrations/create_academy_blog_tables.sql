-- Crear extensión para UUIDs si no existe
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TABLA: academy_courses
-- ========================================
CREATE TABLE IF NOT EXISTS academy_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    duration TEXT NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    topics TEXT[] NOT NULL,
    badge TEXT NOT NULL CHECK (badge IN ('presencial', 'online', 'replay')),
    next_date TEXT NOT NULL,
    link TEXT NOT NULL,
    dc3 BOOLEAN DEFAULT FALSE,
    video TEXT,
    video_title TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_academy_courses_active ON academy_courses(active, created_at DESC);

-- ========================================
-- TABLA: academy_events
-- ========================================
CREATE TABLE IF NOT EXISTS academy_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('congreso', 'live')),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_academy_events_active ON academy_events(active, created_at DESC);

-- ========================================
-- TABLA: blog_posts
-- ========================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    author TEXT DEFAULT 'J. Denis',
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    categories TEXT[],
    tags TEXT[],
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);

-- ========================================
-- MIGRACIÓN DE DATOS EXISTENTES - ACADEMY COURSES
-- ========================================
INSERT INTO academy_courses (title, duration, price, description, topics, badge, next_date, link, dc3, video, video_title) VALUES
('Lash Lifting con Cisteamina — Curso Certificado DC-3', '2 días', 4500, 'Curso certificado ante la STPS con constancia DC-3 incluida. Domina la técnica de lifting con Cisteamina Estabilizada: el sistema más seguro del mercado. Capacitación oficial válida para cumplimiento de normas laborales.', 
 ARRAY['Cisteamina vs. Tioglicólico', 'Shot 1.5 Hidratante', 'Selección de pads', 'Práctica con modelo', 'Constancia DC-3 / STPS'], 
 'presencial', '3 de Marzo 2026', 'https://wa.me/525565116087?text=Hola! Quiero inscribirme al curso: Lash Lifting con Cisteamina', TRUE, NULL, NULL),

('Lifting Coreano (Korean Lash Lift) — Certificación STPS', '1 día', 3800, 'Curso con validez oficial DC-3 ante la STPS. Aprende la técnica coreana de 51K reproducciones: rizo abierto y natural con Cisteamina + Shot 1.5. Incluye constancia DC-3 y kit de práctica.', 
 ARRAY['Filosofía K-Beauty', 'Molde plano vs. nube', 'Combo Cisteamina + Shot 1.5', 'Rizo tipo J y L', 'Constancia DC-3 / STPS'], 
 'presencial', '5 de Marzo 2026', 'https://wa.me/525565116087?text=Hola! Quiero inscribirme al curso: Lifting Coreano', TRUE, NULL, NULL),

('Laminado de Cejas Profesional — Constancia DC-3', '1 día', 3500, 'Capacitación certificada STPS con constancia DC-3. Aprende de los creadores del laminado de cejas en México. Técnica completa de moldeo, fijación y coloración con Brow Henna. Cumple normativa laboral.', 
 ARRAY['Mapeo y diseño de cejas', 'Laminado paso a paso', 'Brow Henna tono a tono', 'Aftercare', 'Constancia DC-3 / STPS'], 
 'presencial', '10 de Marzo 2026', 'https://wa.me/525565116087?text=Hola! Quiero inscribirme al curso: Laminado de Cejas Profesional', TRUE, '/videos/Video_con_logo_J_DENIS.mp4', 'Técnica Brow Henna J. Denis'),

('Business Pro 2026 by Gaby Cisneros', '2 horas', 0, '¡GRATIS! "Evolución de los Colorantes en Cejas" impartido por Gabriela Elizalde, CEO de J. Denis. Acceso vía WhatsApp.', 
 ARRAY['Historia de los colorantes', 'Henna vs. tinturas tópicas', 'Tendencias 2026', 'Sesión de preguntas'], 
 'online', '23 de Febrero 2026, 6:00 PM', 'https://chat.whatsapp.com/DEZ2b9q50qpDLM98AHcN8o?mode=gi_t', FALSE, NULL, NULL),

('Masterclass: Lifting Coreano & Cisteamina', '1.5 horas', 0, '¡GRATIS! Reprise del Live más visto (+51K reproducciones). La Maestra Gaby explica paso a paso el nuevo sistema de lifting coreano con Cisteamina.', 
 ARRAY['¿Qué es Cisteamina?', 'Etanolamina explicada', 'Demo en vivo del combo', 'Resolución de dudas'], 
 'replay', 'Disponible en replay', 'https://www.youtube.com/watch?v=jeUk-RibCec', FALSE, NULL, NULL),

('Glue Less Powder: Técnica sin Adhesivo', '45 min', 0, '¡GRATIS! Aprende a utilizar el revolucionario adhesivo en polvo para lifting de pestañas. Ideal para pieles sensibles.', 
 ARRAY['Aplicación del polvo', 'Ventajas vs. adhesivo líquido', 'Pieles sensibles', 'Tips de la Maestra Gaby'], 
 'replay', 'Disponible en replay', 'https://www.youtube.com/watch?v=WeZHAEXMEOQ', FALSE, NULL, NULL)
ON CONFLICT DO NOTHING;

-- ========================================
-- MIGRACIÓN DE DATOS EXISTENTES - ACADEMY EVENTS
-- ========================================
INSERT INTO academy_events (title, date, location, description, type) VALUES
('A la Belleza Profesional', '15-16 de Febrero 2026', 'Stands #64 y #72, Centro de Convenciones, CDMX', 'J. Denis estará presente con demostraciones en vivo de Cisteamina Estabilizada, Shot 1.5 y el nuevo sistema Glue Less Powder.', 'congreso'),

('Business Pro 2026 — Gaby Cisneros', '23 de Febrero 2026, 6:00 PM', 'Online vía WhatsApp (acceso gratuito)', '"Evolución de los Colorantes en Cejas" por la CEO Gabriela Elizalde. Sigue elevando tu conocimiento profesional desde donde estés.', 'live')
ON CONFLICT DO NOTHING;

-- ========================================
-- MIGRACIÓN DE DATOS EXISTENTES - BLOG POSTS
-- ========================================
INSERT INTO blog_posts (slug, title, subtitle, content, excerpt, categories, tags, published, published_at) VALUES
('laminado-vs-microblading', 
 'Laminado vs. Microblading: Por Qué Tu Mirada Prefiere la Química Inteligente', 
 'La revolución del embellecimiento no invasivo', 
 '# Laminado vs. Microblading: Por Qué Tu Mirada Prefiere la Química Inteligente

## La revolución del embellecimiento no invasivo | Por J. Denis

[... contenido completo del markdown ...]',
 'Comparación completa entre el laminado de pestañas y el microblading de cejas. Descubre por qué el laminado es la opción preferida para quienes valoran su tiempo, comodidad y bienestar.',
 ARRAY['Técnicas', 'Comparativas'],
 ARRAY['laminado', 'microblading', 'pestañas', 'cejas'],
 TRUE,
 '2026-02-01 10:00:00+00')
ON CONFLICT (slug) DO NOTHING;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Migración completada: academy_courses, academy_events, blog_posts creadas e inicializadas';
END $$;
