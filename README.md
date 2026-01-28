# 🇧🇷 Cocina Brasileña - Sitio Web

## Descripción

Sitio web premium para **Cocina Brasileña**, un restaurante de comida típica brasileña ubicado en Argentina. El sitio presenta un diseño moderno, profesional y completamente funcional con sistema de carrito de compras y pedidos por WhatsApp.

## ✨ Características Principales

### 🎨 Diseño Premium
- **Inspirado en la bandera brasileña** con colores verde, amarillo y azul
- Diseño responsivo y mobile-first
- Animaciones suaves y transiciones elegantes
- Efectos parallax y hover interactivos
- Tipografía moderna con fuentes Google (Poppins & Righteous)

### 🍽️ Sistema de Menú
- **30 platos auténticos** organizados en 4 categorías:
  - Principales (8 platos)
  - Acompañamientos (6 opciones)
  - Bebidas (7 opciones)
  - Postres (9 opciones)
- Filtros de categorías interactivos
- Imágenes de alta calidad
- Precios en pesos argentinos
- Badges especiales (Más Pedido, Favorito, etc.)

### 🛒 Carrito de Compras
- Agregar/remover items
- Ajustar cantidades
- Cálculo automático de totales
- Persistencia en localStorage
- Notificaciones visuales
- Interface intuitiva y moderna

### 📱 Integración WhatsApp
- **Número:** +55 13 98176-3452
- Envío automático de pedidos
- Formato profesional del mensaje
- Botón flotante siempre visible
- Links directos en footer y contacto

### 📋 Formulario de Pedido
- Datos del cliente (nombre, teléfono)
- Dirección de entrega (calle, número)
- Campo de observaciones
- Validación de campos
- Resumen del pedido antes de enviar

### 🎯 Secciones del Sitio
1. **Hero/Inicio** - Presentación impactante con mascote
2. **Sobre Nosotros** - Historia y valores
3. **Menú** - Catálogo completo de productos
4. **Contacto** - Información y ubicación

## 📁 Estructura del Proyecto

```
cocina-brasilena/
│
├── index.html              # Página principal
│
├── css/
│   └── styles.css          # Estilos completos del sitio
│
├── js/
│   ├── menu-data.js        # Datos del menú y productos
│   ├── cart.js             # Sistema de carrito de compras
│   └── main.js             # Funcionalidades principales
│
└── images/
    ├── logo.png            # Logotipo con fondo transparente
    └── mascote.jpg         # Mascote del restaurante
```

## 🚀 Instalación y Uso

### Opción 1: Abrir Directamente
1. Extraer el archivo ZIP
2. Abrir `index.html` en cualquier navegador moderno
3. ¡Listo para usar!

### Opción 2: Servidor Local (Recomendado)

**Con Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Con Node.js:**
```bash
npx http-server -p 8000
```

**Con PHP:**
```bash
php -S localhost:8000
```

Luego abrir: `http://localhost:8000`

## 🎨 Paleta de Colores

Inspirada en la bandera de Brasil:

- **Verde Principal:** `#009739`
- **Verde Oscuro:** `#006B28`
- **Amarillo Principal:** `#FEDD00`
- **Amarillo Oscuro:** `#F5C700`
- **Azul Principal:** `#002776`
- **Blanco:** `#FFFFFF`

## 📱 Responsive Design

El sitio es completamente responsive y se adapta a:

- 📱 **Móviles** (< 480px)
- 📱 **Tablets** (480px - 768px)
- 💻 **Desktop** (768px - 1200px)
- 🖥️ **Large Desktop** (> 1200px)

## ⚡ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos avanzados con Flexbox y Grid
- **JavaScript (ES6+)** - Funcionalidades interactivas
- **Font Awesome 6** - Iconos profesionales
- **Google Fonts** - Tipografía premium
- **LocalStorage API** - Persistencia del carrito

## 🛠️ Características Técnicas

### Performance
- Lazy loading de imágenes
- Código optimizado y minificable
- Sin dependencias de frameworks pesados
- Carga rápida (< 3 segundos)

### Accesibilidad
- Navegación por teclado
- Semántica HTML correcta
- Contraste de colores adecuado
- ARIA labels donde corresponde

### SEO
- Meta tags optimizados
- Estructura semántica
- URLs amigables
- Imágenes con alt text

### Seguridad
- Sin vulnerabilidades XSS
- Validación de formularios
- Sanitización de inputs
- HTTPS ready

## 📞 Configuración de WhatsApp

Para cambiar el número de WhatsApp, modificar en:

1. **index.html** - Links de WhatsApp
2. **js/cart.js** - Variable `whatsappNumber`

```javascript
// En js/cart.js línea ~220
const whatsappNumber = '5513981763452'; // Cambiar aquí
```

Formato: País + Código de área + Número (sin espacios ni símbolos)

## 💰 Modificar Precios

Los precios se encuentran en `js/menu-data.js`:

```javascript
{
    id: 1,
    name: "Feijoada Completa",
    price: 8500, // <-- Modificar aquí (sin puntos ni comas)
    // ...
}
```

## ➕ Agregar Nuevos Platos

En `js/menu-data.js`, agregar nuevo objeto al array `menuData`:

```javascript
{
    id: 31, // ID único
    name: "Nombre del Plato",
    category: "principales", // principales, acompañamientos, bebidas, postres
    price: 5000,
    description: "Descripción detallada...",
    image: "URL_de_imagen",
    popular: false,
    badge: "Nuevo" // Opcional
}
```

## 🎨 Personalización de Colores

Modificar variables CSS en `css/styles.css`:

```css
:root {
    --brazil-green: #009739;
    --brazil-yellow: #FEDD00;
    --brazil-blue: #002776;
    /* Cambiar estos valores según necesidad */
}
```

## 📊 Estadísticas del Proyecto

- **Líneas de código HTML:** ~450
- **Líneas de código CSS:** ~1800
- **Líneas de código JavaScript:** ~1200
- **Total de productos:** 30
- **Peso total:** < 2MB (con imágenes optimizadas)

## 🌟 Funcionalidades Futuras (Opcionales)

- [ ] Sistema de autenticación de usuarios
- [ ] Programa de fidelidad/puntos
- [ ] Múltiples métodos de pago
- [ ] Historial de pedidos
- [ ] Sistema de reseñas
- [ ] Integración con Google Maps
- [ ] Chat en vivo
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Multi-idioma

## 🐛 Soporte y Mantenimiento

Para soporte técnico o consultas:
- **WhatsApp:** +55 13 98176-3452
- **Email:** (Agregar email si existe)

## 📄 Licencia

Este proyecto fue desarrollado específicamente para **Cocina Brasileña**.
Todos los derechos reservados © 2025

## 👨‍💻 Desarrollo

Desarrollado con ❤️ y cachaça 🥃

**Características del desarrollo:**
- Código limpio y comentado
- Arquitectura modular
- Buenas prácticas de JavaScript
- CSS con metodología BEM
- Mobile-first approach
- Performance optimizada

## 🎉 Agradecimientos

Gracias por elegir este diseño para tu restaurante. ¡Que tengas mucho éxito! 🇧🇷

---

**Última actualización:** Enero 2025
**Versión:** 1.0.0
