# 🐝 Miel & Morir Soñando

> **El futuro no se borra. Se reconstruye.**

Repostería artesanal dominicana que fue borrada de la existencia digital y reconstruida desde cero como parte del reto académico **"Hackeando el Futuro de una Pyme"** (proyecto individual).

🌐 **Sitio publicado:** https://glimer04.github.io/pyme-resurreccion-digital/index.html

---

## 📖 La historia

La noche del **12 de marzo de 2026**, la página web, las redes sociales y el correo de la pyme desaparecieron sin explicación. Los clientes no podían encontrarla en Internet. Era como si nunca hubiera existido.

En la oficina se encontró un USB con un único mensaje:

> *"Tu negocio ha sido borrado de la existencia digital. Si quieres recuperarlo, deberás reinventarlo."*

Este repositorio es la respuesta a ese mensaje.

## 🎯 Misión cumplida

- ✅ Reconstruir la presencia digital desde cero
- ✅ Agregar funciones innovadoras y resistentes (Escudo anti-borrado, respaldo en GitHub)
- ✅ Diseñar una identidad visual única
- ✅ Crear un mensaje impactante de resurrección

## 🗂️ Bitácora de reconstrucción

**Fase 1 — Infraestructura HTML**
- `index.html`: pantalla de error con glitch, hero, historia del misterio, escudo anti-borrado, favoritos y testimonios
- `estilos.css`: identidad visual base (paleta miel/dorada + menta glitch)
- `script.js`: recuperación del sistema, modo claro/oscuro, easter egg, chatbot

**Fase 2 — Catálogo reinventado**
- `servicios.html`: catálogo con 8 productos con fotografía real, filtros por categoría y cotizador
- `script.js`: filtros, cálculo de precios en RD$ y conversión a dólares con API de tasa de cambio

**Fase 3 — Canal de pedidos**
- `contacto.html`: pruebas del incidente, formulario con fecha de entrega, código de descuento y mapa
- `script.js`: validaciones, mensaje prellenado de WhatsApp y mapa Leaflet

**Fase 4 — Documentación y despliegue**
- `README.md`: bitácora del rescate digital
- GitHub Pages: sitio publicado
- Colaborador: `edianfranklin` invitado al repositorio

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica de las 3 páginas |
| CSS3 | Identidad visual, animaciones glitch, diseño responsive, modo claro/oscuro |
| JavaScript (vanilla) | Interacciones, filtros, cotizador, validaciones, chatbot, escudo |
| Leaflet + OpenStreetMap | Mapa interactivo con la ubicación del taller |
| ExchangeRate-API (open.er-api.com) | Tasa del dólar para la cotización en US$ |
| GitHub Pages | Hosting del sitio publicado |

## 🎮 Funciones interactivas

| Función | Dónde | Cómo probarla |
|---|---|---|
| Pantalla de error → recuperación | Inicio | Clic en "RECUPERAR SISTEMA" (o "Saltar intro"). Para verla otra vez: `index.html?intro=1` |
| Modo claro / oscuro | Todas | Botón 🌙 en el header (se recuerda entre páginas) |
| Easter egg (receta secreta + código) | Todas | Botón **?** abajo a la izquierda, o escribe `miel` en el teclado |
| Chatbot "Miel" | Todas | Botón 💬 abajo a la derecha |
| Escudo anti-borrado | Inicio | Marca las 6 capas de protección y sube el nivel |
| Filtros del catálogo | Catálogo | Botones Bizcochos / Brownies / Fríos / Cajitas |
| Cotizador + tasa USD | Catálogo | Producto + tamaño + extras |
| Formulario de pedidos | Pedidos | Fecha ≥ 48 h, de lunes a sábado; el pedido sale por WhatsApp |
| Código de descuento | Pedidos | Se encuentra con el easter egg; vale una sola vez |
| Mapa interactivo | Pedidos | Marcador con la ubicación del taller |

## 🧪 Pruebas y validaciones

- **Nombre:** mínimo 3 caracteres
- **Correo:** formato válido (`usuario@dominio.ext`)
- **Teléfono:** exactamente 10 dígitos, solo números
- **Producto:** obligatorio
- **Fecha de entrega:** mínimo 48 horas desde hoy y no domingos
- **Dirección:** mínimo 8 caracteres
- **Código de descuento:** válido una sola vez por navegador

## 🎨 Identidad visual

- **Paleta:** dorado miel `#F2B705`, caramelo `#8B4513`, crema `#FFF3D6`, menta glitch `#00FFC6`, fondo oscuro `#0D0B1F`
- **Tipografía:** Georgia (serif, cálida) + Courier New (mono, técnica)
- **Elemento narrativo:** fénix de miel dorada emergiendo de un bizcocho, con dígitos binarios y código glitch
- **Símbolo:** 🐝 abeja + bizcocho con cereza

## ♿ Accesibilidad

Navegación por teclado con foco visible, `aria-label` en controles, `aria-live` en mensajes dinámicos, contraste revisado en modo claro y respeto a `prefers-reduced-motion`.

## 📁 Estructura del repositorio

```
pyme-resurreccion-digital/
├── index.html          # Inicio: intro, historia, escudo, favoritos
├── servicios.html      # Catálogo + cotizador
├── contacto.html       # Pruebas del incidente + pedidos + mapa
├── estilos.css         # Estilos de las 3 páginas
├── script.js           # Lógica de las 3 páginas
├── img/
│   ├── logo-miel.png
│   ├── hero-miel.jpg
│   └── productos/      # 8 fotos de productos (.jpg)
├── LICENSE
└── README.md
```

---

> ⚠️ Proyecto académico: la historia, el negocio, los testimonios, las direcciones y los teléfonos son ficticios.


