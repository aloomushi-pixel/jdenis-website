import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vqcjxzsibywdxpvkyysa.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxY2p4enNpYnl3ZHhwdmt5eXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNDgxMDAsImV4cCI6MjA4NTgyNDEwMH0.SzIov9XDCl0nFsTx_pCpVdlqnMTLQ10l1v-e2YNE5Xg';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const blogArticles = [
    {
        title: 'Nueva Generación de Adhesivos Hipoalergénicos',
        slug: 'nueva-generacion-adhesivos',
        excerpt: 'Descubre nuestra innovadora fórmula diseñada para los ojos más sensibles, ofreciendo máxima retención sin irritación.',
        featured_image: 'https://images.unsplash.com/photo-1599751449128-eb7249c3d6b1?q=80&w=2669&auto=format&fit=crop',
        content: `<p>Los profesionales de extensiones de pestañas conocen bien el desafío de encontrar un adhesivo que ofrezca una retención excepcional sin causar reacciones alérgicas. Con el lanzamiento de nuestra nueva generación de adhesivos hipoalergénicos, hemos logrado el equilibrio perfecto.</p>
    
    <h2>El Problema de la Sensibilidad</h2>
    <p>Tradicionalmente, los cianoacrilatos utilizados para la fijación rápida emiten vapores que pueden irritar la esclerótica o causar reacciones en la piel del párpado. Esto ha limitado a muchas clientas con ojos sensibles a disfrutar de extensiones voluminosas y duraderas.</p>

    <h2>Nuestra Solución Innovadora</h2>
    <p>La nueva fórmula J. Denis incorpora una purificación de triple fase que reduce la emisión de vapores en un 80%. Además, hemos integrado estabilizadores moleculares que, aunque polimerizan en tan solo 1 segundo, lo hacen con una exotermia mínima.</p>
    
    <h3>Beneficios Clave:</h3>
    <ul>
      <li><strong>Retención Garantizada:</strong> Hasta 6 semanas de retención.</li>
      <li><strong>Fijación Rápida:</strong> Secado de 0.5 a 1 segundo para agilizar tu trabajo.</li>
      <li><strong>Sin Vapores Claros:</strong> Perfecto para clientes sensibles, minimizando el lagrimeo y enrojecimiento.</li>
      <li><strong>Viscosidad Media:</strong> Se adhiere al instante, evitando que las pestañas se deslicen o se peguen entre sí.</li>
    </ul>

    <p>Experimenta la diferencia con nuestra línea <em>Sensitive Pro</em>. Eleva la calidad de tu servicio y asegura que tus clientas vuelvan siempre con una sonrisa y sin irritaciones.</p>`,
        author: 'J Denis Pro',
        categories: ['PRODUCTOS', 'TENDENCIAS'],
        tags: ['Adhesivos', 'Sensible', 'Innovación'],
        published: true,
        published_at: '2024-05-15T12:00:00Z',
        post_type: 'article',
    },
    {
        title: 'Tendencias en Volumen Ruso para 2024',
        slug: 'tendencias-volumen-ruso-2024',
        excerpt: 'Las técnicas de volumen siguen evolucionando. Te contamos qué estilos están dominando el mercado este año.',
        featured_image: 'https://images.unsplash.com/photo-1629579634734-75afc8a82dff?q=80&w=2574&auto=format&fit=crop',
        content: `<p>El Volumen Ruso no es solo una técnica, es un arte en constante evolución. En 2024, estamos viendo una transición hacia texturas más orgánicas y diseños personalizados que se alejan de los looks demasiado uniformes del pasado.</p>

    <h2>1. El Regreso del Estilo "Wispy"</h2>
    <p>La textura "Wispy" (o diseño desmechado) está de vuelta y más fuerte que nunca. Al combinar abanicos de volumen amplio con espigas (spikes) más largas y cerradas, se logra un efecto multidimensional que recuerda al estilo de Kim Kardashian, pero refinado para el día a día.</p>
    
    <h2>2. Abanicos Estrechos para Densidad Oscura</h2>
    <p>En contraposición a los abanicos súper abiertos, la tendencia actual favorece los abanicos estrechos (narrow fans). Esta técnica, utilizando diámetros de 0.03 o 0.05mm, crea una línea de las pestañas increíblemente densa y oscura, ideal para el look de "mega volumen" sin pesar.</p>

    <h2>3. Combinación de Curvaturas (L y M Mix)</h2>
    <p>La creatividad se ha desatado al mezclar curvaturas extremas. Usar curvaturas M o L en el tercio exterior del ojo, combinadas con C o CC en el interior, logra el codiciado efecto "Fox Eye" o delineado extremo, levantando el párpado sin cirugía.</p>

    <h2>4. Tonos Marrones y Subtonos</h2>
    <p>El negro azabache ya no es el rey absoluto. Las pestañas en tonos moca, chocolate oscuro e incluso con dejos de borgoña están ganando popularidad, especialmente para rubias o mujeres que buscan un volumen extremo pero con un resultado más suave a la luz del sol.</p>

    <p>Mantente a la vanguardia como lashista dominando estas técnicas. Explora nuestras bandejas de volumen de nueva generación, diseñadas para facilitar la apertura perfecta del abanico.</p>`,
        author: 'J Denis Academy',
        categories: ['TÉCNICAS', 'TENDENCIAS'],
        tags: ['Volumen Ruso', 'Wispy', 'Lash Mapping'],
        published: true,
        published_at: '2024-04-20T12:00:00Z',
        post_type: 'article',
    },
    {
        title: 'Cómo Preparar el Pelo Natural Correctamente',
        slug: 'como-preparar-pelo-natural-correctamente',
        excerpt: 'El secreto de una retención perfecta comienza antes de aplicar la primera extensión. Aprende los pasos esenciales.',
        featured_image: 'https://images.unsplash.com/photo-1596755389378-c116ba56e309?q=80&w=2574&auto=format&fit=crop',
        content: `<p>A menudo, los problemas de retención prematura se atribuyen al adhesivo, a la humedad del ambiente o a los cuidados posteriores de la clienta. Sin embargo, el culpable número uno de pestañas que se caen demasiado pronto es una preparación deficiente del pelo natural.</p>

    <h2>Paso 1: Limpieza Profunda</h2>
    <p>Incluso si la clienta llega sin maquillaje, es obligatorio usar un <em>Lash Shampoo</em>. Los restos de cremas, contaminación, aceites naturales de la piel o sudor actúan como una barrera impenetrable para el adhesivo. Un buen champú abrirá sutilmente la cutícula del pelo, preparando el terreno.</p>

    <h2>Paso 2: Enjuague Correcto</h2>
    <p>Dejar residuo de jabón es tan malo como no limpiar. Utiliza agua destilada y asegúrate de que el champú sea retirado completamente. Seca suavemente con papel tisú y un mini-ventilador para evitar dejar pelusas.</p>

    <h2>Paso 3: El Poder del Primer</h2>
    <p>No todos los Primer son iguales. Su función principal es deshidratar ligeramente la pestaña y equilibrar su pH. Esto crea un ambiente alcalino que acelera increíblemente la polimerización del cianoacrilato. Usa solo la cantidad necesaria; el exceso puede volver el pelo demasiado poroso.</p>

    <h2>Paso 4: El Acelerador de Curado (Opcional pero Recomendado)</h2>
    <p>En épocas de muy baja humedad, o cuando manejas adhesivos un poco lentos para tu ritmo de trabajo, aplicar un <em>Booster</em> o acelerador en la tira de extensiones (no en el pelo natural) puede salvarte la vida. Asegurará que el abanico no se cierre una vez adherido.</p>

    <p>Implementar esta rigurosa rutina de preparación puede añadir 5 minutos a tu servicio, pero reducirá drásticamente las quejas por mala retención y te ahorrará horas de retoques gratuitos. Usa siempre nuestra línea de preparación J. Denis para resultados garantizados.</p>`,
        author: 'Tech Team',
        categories: ['EDUCACIÓN', 'ESTUDIO'],
        tags: ['Retención', 'Primer', 'Lash Shampoo', 'Preparación'],
        published: true,
        published_at: '2024-03-10T12:00:00Z',
        post_type: 'article',
    }
];

async function seedBlogPosts() {
    console.log('Seeding blog posts...');
    for (const post of blogArticles) {
        // Check if it already exists
        const { data: existing } = await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', post.slug)
            .single();

        if (existing) {
            console.log(\`Post \${post.slug} already exists, skipping.\`);
      continue;
    }

    const { error } = await supabase.from('blog_posts').insert([post]);
    if (error) {
      console.error(\`Error inserting \${post.slug}:\`, error);
    } else {
      console.log(\`Successfully inserted \${post.slug}\`);
    }
  }
  console.log('Finished seeding blog posts.');
}

seedBlogPosts();
