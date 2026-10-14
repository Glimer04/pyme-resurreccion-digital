/* ==============================
   MIEL & MORIR SOÑANDO — script
   ============================== */

// 1. PANTALLA DE ERROR → RECUPERAR
const pantallaError = document.getElementById('pantalla-error');
const sitio = document.getElementById('sitio');
const botonRecuperar = document.getElementById('boton-recuperar');

if (botonRecuperar) {
  botonRecuperar.addEventListener('click', function () {
    pantallaError.classList.add('oculto');
    sitio.classList.remove('oculto');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 2. MODO CLARO / OSCURO
const botonTema = document.getElementById('boton-tema');
if (botonTema) {
  botonTema.addEventListener('click', function () {
    document.body.classList.toggle('modo-claro');
    const esClaro = document.body.classList.contains('modo-claro');
    botonTema.textContent = esClaro ? '☀️' : '🌙';
  });
}

// 3. EASTER EGG — RECETA SECRETA
const botonSecreto = document.getElementById('boton-secreto');
if (botonSecreto) {
  botonSecreto.addEventListener('click', function () {
    alert(
      '🍰 RECETA SECRETA DE LA ABUELA CARMEN 🍰\n\n' +
      'Bizcocho de miel dominicano:\n' +
      '• 3 tazas de harina\n' +
      '• 1 taza de miel pura\n' +
      '• 4 huevos criollos\n' +
      '• 1 cucharadita de vainilla\n' +
      '• Un toque de canela\n\n' +
      'Código secreto: RESURGIR20\n' +
      'Úsalo en tu primer pedido y llévate 20% de descuento 🐝'
    );
  });
}

// 4. CHATBOT MIEL
const botonChat = document.getElementById('boton-chat');
const asistente = document.getElementById('asistente');
const chatFormulario = document.getElementById('chat-formulario');
const chatEntrada = document.getElementById('chat-entrada');
const chatMensajes = document.getElementById('chat-mensajes');

if (botonChat) {
  botonChat.addEventListener('click', function () {
    asistente.classList.toggle('abierto');
    if (asistente.classList.contains('abierto')) {
      chatEntrada.focus();
    }
  });
}

if (chatFormulario) {
  chatFormulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    const pregunta = chatEntrada.value.trim().toLowerCase();
    if (pregunta === '') return;

    agregarMensaje(chatEntrada.value, 'mensaje-usuario');

    let respuesta;

    if (pregunta.includes('hola') || pregunta.includes('buenas')) {
      respuesta = '¡Hola! Soy Miel 🐝 ¿Buscas algo dulce para hoy?';
    } else if (pregunta.includes('bizcocho')) {
      respuesta = 'Nuestros bizcochos son famosos: vainilla, chocolate, miel y zanahoria. Todos con merengue y cereza 🍰';
    } else if (pregunta.includes('brownie') || pregunta.includes('brownies')) {
      respuesta = '¡Los brownies son nuestra debilidad! Fudge, nueces y un toque de sal marina. Desde RD$350.';
    } else if (pregunta.includes('precio') || pregunta.includes('cuanto') || pregunta.includes('cuesta')) {
      respuesta = 'Los precios empiezan en RD$350 por brownies y RD$1,200 por bizcochos personalizados. ¿Te paso el catálogo completo?';
    } else if (pregunta.includes('entrega') || pregunta.includes('envio') || pregunta.includes('domicilio')) {
      respuesta = 'Hacemos entregas en Santo Domingo el mismo día si pides antes de las 10 AM. También enviamos al interior del país 📦';
    } else if (pregunta.includes('historia') || pregunta.includes('misterio') || pregunta.includes('borraron')) {
      respuesta = 'Nos borraron de Internet el 12 de marzo... pero volvimos más dulces. Puedes leer la historia completa en la página de Inicio 🐝';
    } else if (pregunta.includes('pedido') || pregunta.includes('comprar') || pregunta.includes('ordenar')) {
      respuesta = '¡Perfecto! Entra a la página de Pedidos y llena el formulario con fecha de entrega. Te confirmamos por WhatsApp 📱';
    } else if (pregunta.includes('seguridad') || pregunta.includes('proteger')) {
      respuesta = 'Ahora tenemos respaldos automáticos, contraseñas seguras y verificación en dos pasos. ¡No nos vuelven a borrar! 🔐';
    } else {
      respuesta = 'Aún estoy aprendiendo 🐝 Prueba con: bizcocho, brownie, precio, entrega o pedido.';
    }

    setTimeout(function () {
      agregarMensaje(respuesta, 'mensaje-bot');
    }, 400);

    chatEntrada.value = '';
  });
}

function agregarMensaje(texto, clase) {
  const mensaje = document.createElement('p');
  mensaje.className = clase;
  mensaje.textContent = texto;
  chatMensajes.appendChild(mensaje);
  chatMensajes.scrollTop = chatMensajes.scrollHeight;
}

console.log('🐝 Miel & Morir Soñando: sistema iniciado.');

/* ============ FILTROS DEL CATÁLOGO ============ */
const botonesFiltro = document.querySelectorAll('.filtro');
const productos = document.querySelectorAll('.producto');

botonesFiltro.forEach(function (boton) {
  boton.addEventListener('click', function () {
    botonesFiltro.forEach(function (b) { b.classList.remove('activo'); });
    boton.classList.add('activo');

    const filtro = boton.dataset.filtro;

    productos.forEach(function (producto) {
      if (filtro === 'todos' || producto.dataset.categoria === filtro) {
        producto.classList.remove('oculto-producto');
      } else {
        producto.classList.add('oculto-producto');
      }
    });
  });
});

/* ============ COTIZADOR EN LÍNEA ============ */
const formCotizador = document.getElementById('cotizador');
const resultadoCotizador = document.getElementById('resultado-cotizador');

if (formCotizador) {
  formCotizador.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const productoSeleccionado = document.getElementById('producto-cotizar').value;
    const porciones = parseFloat(document.getElementById('porciones-cotizar').value);
    const extras = parseFloat(document.getElementById('extras-cotizar').value);

    if (!productoSeleccionado) {
      resultadoCotizador.innerHTML = '⚠️ Selecciona un producto primero.';
      return;
    }

    const partes = productoSeleccionado.split('|');
    const nombre = partes[0];
    const base = parseFloat(partes[1]);

    const total = (base * porciones) + extras;

    resultadoCotizador.innerHTML =
      '🍰 Producto: <strong>' + nombre + '</strong><br>' +
      'Precio base: RD$' + base.toLocaleString('es-DO') + '<br>' +
      'Total estimado: <strong>RD$' + total.toLocaleString('es-DO') + '</strong><br>' +
      '<small>Precio final puede variar según decoración. Confirma por WhatsApp.</small>';
  });
}

/* ============ BOTONES "COTIZAR" DE PRODUCTOS ============ */
const botonesCotizar = document.querySelectorAll('.boton-cotizar');

botonesCotizar.forEach(function (boton) {
  boton.addEventListener('click', function () {
    const nombre = boton.dataset.producto;
    const base = boton.dataset.base;

    // Auto-selecciona en el cotizador de abajo
    const select = document.getElementById('producto-cotizar');
    if (select) {
      // Busca la opción que coincida
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value.startsWith(nombre + '|')) {
          select.selectedIndex = i;
          break;
        }
      }
      // Baja hasta el cotizador
      document.getElementById('cotizador').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});

