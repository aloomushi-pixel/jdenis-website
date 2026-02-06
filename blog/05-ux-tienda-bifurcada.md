# 🛍️ UX Writing: Experiencia de Tienda Bifurcada

> **Tipo de Contenido:** Micro-copy UX  
> **Objetivo:** Diferenciación de experiencia B2C vs B2B  
> **Implementación:** Homepage, headers, modales, CTAs

---

## Arquitectura de la Experiencia Bifurcada

```
jdenis.store/
├── / (Homepage con selector)
├── /tienda (B2C - Consumidor Final)
└── /mayoreo (B2B - Profesionales)
```

---

## 1. Modal de Bienvenida (Primera Visita)

### Diseño del Modal

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│           🌟 Bienvenida a J. Denis                         │
│                                                             │
│     ¿Cómo prefieres comprar hoy?                           │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │   👤 SOY CLIENTA    │  │  💼 SOY PROFESIONAL │          │
│  │                     │  │                     │          │
│  │  Quiero resultados  │  │  Quiero precios de  │          │
│  │  de salón en casa   │  │  mayoreo para mi    │          │
│  │                     │  │  negocio            │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                             │
│           No te preocupes, puedes cambiar después           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Mensajes B2C (Cliente Final)

### Hero Banner Principal

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        ✨ RESULTADOS DE SALÓN, EN TU CASA ✨                ║
║                                                              ║
║   Kits profesionales diseñados para que logres una          ║
║   mirada perfecta con total seguridad.                      ║
║                                                              ║
║   🚚 Envío gratis a partir de $499                          ║
║   📦 Kit completo con instrucciones paso a paso             ║
║   💬 Soporte por WhatsApp si tienes dudas                   ║
║                                                              ║
║              [ VER KITS PARA CASA ]                          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Propuesta de Valor B2C

| Beneficio | Micro-copy |
|-----------|------------|
| **Seguridad** | "Fórmulas oftalmológicamente testeadas. Tu seguridad es nuestra prioridad." |
| **Facilidad** | "Sin experiencia previa. Nuestras guías te llevan paso a paso." |
| **Resultados** | "Pestañas con curva natural que dura 6-8 semanas." |
| **Soporte** | "¿Dudas? Escríbenos por WhatsApp y te ayudamos en tiempo real." |

### Copy para Cards de Producto (B2C)

**Kit Lash Lifting en Casa**
```
Tu primera vez merece un kit completo.

✓ Todo lo que necesitas incluido
✓ Instrucciones en video
✓ Soporte WhatsApp 24/7
✓ Resultado salón garantizado

$449 MXN · Envío gratis CDMX
```

**Sérum Reestructurante**
```
Nutre tus pestañas entre tratamientos.

Con Queratina hidrolizada y Vitamina E 
para pestañas más fuertes y flexibles.

Úsalo cada noche para máximos resultados.

$189 MXN
```

### Mensajes de Confianza B2C

- "Más de 50,000 clientas satisfechas en México"
- "Fabricado en México con estándares internacionales"
- "Devolución sin preguntas en 30 días"
- "Pago seguro con Mercado Pago y tarjetas"

---

## 3. Mensajes B2B (Profesional)

### Hero Banner Principal

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     💼 PRECIOS DE MAYOREO PARA PROFESIONALES 💼            ║
║                                                              ║
║   Accede a descuentos exclusivos, soporte técnico           ║
║   local y productos Hecho en México que tus clientas        ║
║   amarán.                                                   ║
║                                                              ║
║   📊 Hasta 40% OFF en volumen                               ║
║   🎓 Certificación gratuita incluida                        ║
║   🇲🇽 Garantía de producto mexicano                         ║
║                                                              ║
║         [ SOLICITAR ACCESO MAYOREO ]                         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

### Propuesta de Valor B2B

| Beneficio | Micro-copy |
|-----------|------------|
| **Rentabilidad** | "Márgenes del 70%+. Tu negocio crece con cada servicio." |
| **Soporte** | "Línea directa con instructoras certificadas. Resolvemos dudas técnicas al instante." |
| **Calidad** | "Hecho en México = reposición rápida, sin aduanas, sin sorpresas." |
| **Exclusividad** | "Productos que no encontrarás en Amazon ni MercadoLibre." |

### Copy para Cards de Producto (B2B)

**Kit Profesional 50 Aplicaciones**
```
MAYOREO · Requiere cuenta B2B

El kit que eligen las lashistas top de México.

✓ 50 aplicaciones por kit
✓ Costo por servicio: $28 MXN
✓ Margen sugerido: $370+ por servicio
✓ Ficha técnica incluida

$1,399 MXN (antes $1,999)
Precio solo para cuentas verificadas
```

**Refill Queratina 500ml**
```
MAYOREO · Ahorro máximo

Recarga profesional para alto volumen.

✓ Rinde 200+ aplicaciones
✓ Misma fórmula premium
✓ Envase económico

$899 MXN
```

### Mensajes de Exclusividad B2B

- "Solo para profesionales verificados"
- "Tu éxito es nuestro éxito — crecemos juntas"
- "Mismo día de envío en pedidos antes de 2pm"
- "Factura fiscal disponible para todos los pedidos"

### Badges de Confianza B2B

```
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ 🇲🇽             │  │ 🏭             │  │ 📞             │  
│ HECHO EN       │  │ FABRICANTES    │  │ SOPORTE        │
│ MÉXICO         │  │ DIRECTOS       │  │ TÉCNICO        │
│                │  │                │  │ LOCAL          │
└────────────────┘  └────────────────┘  └────────────────┘
```

---

## 4. Mensajes Contextuales

### Header Sticky (B2C)
```
🚚 Envío GRATIS en pedidos +$499 | 💬 ¿Dudas? Escríbenos
```

### Header Sticky (B2B)
```
💼 Precios Mayoreo Activos | 📊 Tu descuento: 35% | 🎓 Certificación: Completada ✓
```

### Carrito Vacío (B2C)
```
Tu carrito está esperando...

¿Primera vez? Te recomendamos empezar con 
nuestro Kit Lash Lifting en Casa.

Incluye todo lo que necesitas + guía en video.

[ Ver Kit Recomendado ]
```

### Carrito Vacío (B2B)
```
¡Hora de resurtir!

Los productos más vendidos de este mes:
• Kit Profesional 50 apps (-15% esta semana)
• Refill Queratina 500ml
• Silicona Cloud Pad (nuevo)

[ Explorar Catálogo Mayoreo ]
```

---

## 5. Transición Entre Modos

### B2C → B2B
```
¿Eres profesional de la belleza?

Accede a precios de mayoreo, soporte técnico 
y certificación gratuita.

[ Solicitar Cuenta Profesional ]

Solo necesitas: RFC o constancia de negocio
```

### B2B → B2C
```
¿Buscas productos para uso personal?

Nuestra tienda regular tiene kits diseñados 
para usar en casa con total seguridad.

[ Ir a Tienda Regular ]
```

---

## 6. Formulario de Registro B2B

### Campos Requeridos

```
┌─────────────────────────────────────────────────────────────┐
│  💼 SOLICITUD DE CUENTA MAYOREO                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Nombre completo: ________________________________          │
│                                                             │
│  Email profesional: ________________________________        │
│                                                             │
│  WhatsApp: ________________________________                 │
│                                                             │
│  Ciudad: ________________________________                   │
│                                                             │
│  ¿Tienes constancia de situación fiscal?                   │
│  ○ Sí, la adjunto   ○ No, pero tengo negocio activo        │
│                                                             │
│  ¿Cuántos servicios realizas al mes? (aproximado)          │
│  ○ 1-10   ○ 11-30   ○ 31-50   ○ 50+                        │
│                                                             │
│  [ ENVIAR SOLICITUD ]                                       │
│                                                             │
│  ⏱️ Revisamos solicitudes en 24-48 horas hábiles           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Confirmación de Envío

```
✅ ¡Solicitud Recibida!

Revisaremos tu información en las próximas 24-48 horas.

Mientras tanto:
• Sigue nuestra Academia en Instagram
• Únete al grupo de WhatsApp de pre-aprobados
• Descarga nuestra guía de precios sugeridos

¿Preguntas? Responde a este correo o escríbenos al WhatsApp.
```

---

## 7. Implementación Técnica

### LocalStorage Keys
```javascript
// Almacenar preferencia de usuario
localStorage.setItem('jdenis_user_type', 'b2c' | 'b2b');
localStorage.setItem('jdenis_b2b_verified', 'true' | 'false');
```

### Rutas Diferenciadas
```
/tienda → Catálogo B2C con precios públicos
/mayoreo → Catálogo B2B (requiere login)
/api/products?type=b2c → Productos con precio retail
/api/products?type=b2b → Productos con precio mayoreo
```

### CSS Classes
```css
.b2c-only { /* Solo visible en modo B2C */ }
.b2b-only { /* Solo visible en modo B2B */ }
.show-b2c .b2c-only { display: block; }
.show-b2b .b2b-only { display: block; }
```
