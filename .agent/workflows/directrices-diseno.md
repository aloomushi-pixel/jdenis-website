# Directrices de Diseño J. Denis

Este documento contiene los estilos y directrices visuales definidos para mantener consistencia en toda la plataforma web de J. Denis, estandarizando componentes clave como botones, headers, y tarjetas con fondos especiales.

## 1. Colores Principales (Variables de Tailwind/CSS)
*   **Azul Corporativo J. Denis**: `#001641` (Representado como `brand-blue`). Es el color de fondo para headers, footers y overlays principales.
*   **Dorado J. Denis**: `#d4a832` (Representado como `gold` o `brand-gold`). Usado para acentos, iconos y botones de llamado a la acción primarios.
*   **Crema**: `#fdfbf7` (Representado como `cream` o `brand-cream`). Usado para fondos de secciones limpias.

## 2. Botones Universales

Se ha establecido un nuevo estándar para la distribución de botones gemelos (ejemplo en el Hero):

### 2.1 Botón Izquierdo (Acción Primaria / Solid)
*   **Fondo**: Dorado sólido.
*   **Texto**: Azul corporativo oscuro.
*   **Forma**: Totalmente redondeado (`rounded-full`).
*   **Efectos**: Sombra dorada tenue (`shadow-lg shadow-gold/20`), transición suave al hacer hover (`hover:-translate-y-1 hover:bg-yellow-400`).
*   **Clases Tailwind**: `bg-gold text-brand-blue px-8 py-3.5 rounded-full font-semibold hover:bg-yellow-400 transition-all duration-300 shadow-lg shadow-gold/20 group hover:-translate-y-1`

### 2.2 Botón Derecho (Acción Secundaria / Glassmorphism)
*   **Fondo**: Transparente con efecto Glassmorphism (difuminado de fondo).
*   **Texto**: Blanco.
*   **Forma**: Borde blanco semi-transparente, totalmente redondeado (`rounded-full`).
*   **Efectos**: Difuminado en fondo (`backdrop-blur-md`), relleno semi-blanco al hover, movimiento al hover (`hover:-translate-y-1`).
*   **Clases Tailwind**: `border border-white/80 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/10 hover:border-white transition-all duration-300 backdrop-blur-md hover:-translate-y-1`

## 3. Tipografía
*   **Titulares Premium**: `font-serif` (`Cormorant Garamond`). Enfatizar palabras clave usando `<i className="text-gold font-bold">Texto</i>`. Para lograr máximo peso visual usar `font-black` y `style={{ fontWeight: 800 }}`.
*   **Cuerpo y Descripciones**: `font-sans` (`Inter` o `Roboto`). Letra ligera (`font-light`), color blanco o crema al 80% o 90% (`text-white/90`) sobre fondos oscuros.

## 4. Fondos y Overlays
Cuando se utilicen imágenes o videos de fondo:
1.  **Overlay Gradiente**: Utilizar un gradiente azul marino para facilitar la lectura del texto. 
    `bg-gradient-to-t from-brand-blue/90 via-brand-blue/40 to-transparent`
2.  **Textura Suave**: Opcionalmente, agregar el patrón botánico con opacidad baja (`opacity-10`) para agregar lujo.
3.  **Tarjetas Flotantes (Pills)**: Para etiquetas pequeñas (ej. "Academia J. Denis"), usar estilo glassmorphism:
    `border border-gold/50 text-gold text-xs uppercase py-1.5 px-5 rounded-full shadow-sm backdrop-blur-sm`
