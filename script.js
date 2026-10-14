/* ==============================
   MIEL & MORIR SOÑANDO — script
   ============================== */

/* ============================================================
   1. EFECTO TERMINAL — PANTALLA DE ERROR HACKEADA
   ============================================================ */

// Textos que se van a "escribir" automáticamente
const lineasTerminal = [
  { id: 'linea-1', texto: 'Iniciando protocolo de búsqueda...' },
  { id: 'linea-2', texto: 'Buscando negocio: Miel & Morir Soñando' },
  { id: 'linea-3', texto: '✗ ERROR 0x404 — NEGOCIO NO ENCONTRADO' }
];

// Escribe una línea letra por letra
function escribirLinea(elementoId, texto, callback) {
  const elemento = document.getElementById(elementoId);
  if (!elemento) { if (callback) callback(); return; }

  let i = 0;
  elemento.textContent = '';

  const intervalo = setInterval(function () {
    elemento.textContent += texto.charAt(i);
    i++;
    if (i >= texto.length) {
      clearInterval(intervalo);
      if (callback) callback();
    }
  }, 35);
}

// Secuencia completa de la terminal
function iniciarSecuenciaTerminal() {
  escribirLinea(lineasTerminal[0].id, lineasTerminal[0].texto, function () {
    setTimeout(function () {
      escribirLinea(lineasTerminal[1].id, lineasTerminal[1].texto, function () {
        setTimeout(function () {
          escribirLinea(lineasTerminal[2].id, lineasTerminal[2].texto, function () {
            setTimeout(animarBarraProgreso, 500);
          });
        }, 400);
      });
    }, 400);
  });
}

// Anima la barra de progreso de 0% a 100% y luego falla
function animarBarraProgreso() {
  const barra = document.getElementById('barra-progreso');
  const porcentaje = document.getElementById('porcentaje-progreso');
  if (!barra || !porcentaje) return;

  let progreso = 0;
  const intervalo = setInterval(function () {
    // Incremento realista: rápido al principio, lento al final
    let avance;
    if (progreso < 40) {
      avance = Math.floor(Math.random() * 8) + 4;
    } else if (progreso < 80) {
      avance = Math.floor(Math.random() * 5) + 2;
    } else {
      avance = Math.floor(Math.random() * 3) + 1;
    }

    progreso += avance;

    if (progreso >= 100) {
      progreso = 100;
      clearInterval(intervalo);

      barra.style.backgroundSize = '100% 100%';
      porcentaje.textContent = '100%';

      // Pausa dramática antes del fallo
      setTimeout(function () {
        barra.style.backgroundImage = 'none';
        barra.style.backgroundColor = 'rgba(255, 92, 92, 0.3)';
        porcentaje.textContent = '✗ FALLÓ';
        porcentaje.style.color = '#ff5c5c';
        porcentaje.style.fontWeight = 'bold';

        // Después del fallo, revela el título y el botón
        setTimeout(revelarSistema, 800);
      }, 700);

      return;
    }

    barra.style.backgroundSize = progreso + '% 100%';
    porcentaje.textContent = progreso + '%';
  }, 180);
}

// Revela el título glitch y el botón después de la terminal
function revelarSistema() {
  const revelacion = document.getElementById('revelacion');
  if (!revelacion) return;

  revelacion.classList.add('visible');
  console.log('✨ Sistema revelado. Esperando acción del usuario.');
}

// 🎬 ARRANQUE DE LA SECUENCIA (defer garantiza DOM listo)
if (document.getElementById('pantalla-error')) {
  console.log('🎬 Iniciando secuencia de terminal en 300ms...');
  setTimeout(function () {
    console.log('▶ Ejecutando terminal...');
    iniciarSecuenciaTerminal();
  }, 300);
}

/* ============================================================
   2. PANTALLA DE ERROR → RECUPERAR SISTEMA
   ============================================================ */

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

/* ============================================================
   3. MODO CLARO / OSCURO
   ============================================================ */

const botonTema = document.getElementById('boton-tema');
if (botonTema) {
  botonTema.addEventListener('click', function () {
    document.body.classList.toggle('modo-claro');
    const esClaro = document.body.classList.contains('modo-claro');
    botonTema.textContent = esClaro ? '☀️' : '🌙';
  });
}

/* ============================================================
   4. EASTER EGG — RECETA SECRETA
   ============================================================ */

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

/* ============================================================
   5. CHATBOT MIEL
   ============================================================ */

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

/* ============================================================
   6. FILTROS DEL CATÁLOGO
   ============================================================ */

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

/* ============================================================
   7. COTIZADOR EN LÍNEA
   ============================================================ */

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

/* ============================================================
   8. BOTONES "COTIZAR" DE PRODUCTOS
   ============================================================ */

const botonesCotizar = document.querySelectorAll('.boton-cotizar');

botonesCotizar.forEach(function (boton) {
  boton.addEventListener('click', function () {
    const nombre = boton.dataset.producto;

    const select = document.getElementById('producto-cotizar');
    if (select) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value.startsWith(nombre + '|')) {
          select.selectedIndex = i;
          break;
        }
      }
      document.getElementById('cotizador').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});

/* ============================================================
   9. FORMULARIO DE PEDIDOS
   ============================================================ */

const formularioContacto = document.getElementById('formulario-contacto');
const estadoFormulario = document.getElementById('estado-formulario');

if (formularioContacto) {
  // Configurar fecha mínima: 48 horas a partir de hoy
  const inputFecha = document.getElementById('fecha-entrega');
  if (inputFecha) {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 2);
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    inputFecha.min = `${yyyy}-${mm}-${dd}`;
  }

  formularioContacto.addEventListener('submit', function (evento) {
    evento.preventDefault();
    estadoFormulario.className = 'estado-formulario';
    estadoFormulario.textContent = '';

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const producto = document.getElementById('producto-contacto').value;
  
     // Filtrar teléfono: solo números
  const inputTelefono = document.getElementById('telefono');
  if (inputTelefono) {
    inputTelefono.addEventListener('input', function (e) {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
  }
    const fecha = document.getElementById('fecha-entrega').value;
    const direccion = document.getElementById('direccion').value.trim();

    if (nombre.length < 3) {
      return mostrarError('Por favor escribe tu nombre completo.');
    }

    if (!correo.includes('@') || !correo.includes('.')) {
      return mostrarError('El correo no parece válido.');
    }

    if (telefono.replace(/\D/g, '').length < 10) {
      return mostrarError('El teléfono debe tener al menos 10 dígitos.');
    }

    if (!producto) {
      return mostrarError('Selecciona un producto del catálogo.');
    }

    if (!fecha) {
      return mostrarError('Debes elegir una fecha de entrega.');
    }

    const fechaElegida = new Date(fecha + 'T12:00:00');
    const fechaMinima = new Date();
    fechaMinima.setDate(fechaMinima.getDate() + 2);
    fechaMinima.setHours(0, 0, 0, 0);

    if (fechaElegida < fechaMinima) {
      return mostrarError('La fecha de entrega debe ser al menos 48 horas después de hoy.');
    }

    if (direccion.length < 8) {
      return mostrarError('Por favor escribe una dirección más completa.');
    }

    estadoFormulario.className = 'estado-formulario exito';
    estadoFormulario.innerHTML =
      '🍰 ¡Gracias, <strong>' + nombre.split(' ')[0] + '</strong>!<br>' +
      'Tu pedido de <strong>' + producto + '</strong> fue registrado para el ' +
      formatearFecha(fecha) + '.<br>' +
      '<small>Esta es una demostración académica. No se envió ningún correo real.</small>';

    formularioContacto.reset();
  });
}

function mostrarError(mensaje) {
  estadoFormulario.className = 'estado-formulario error';
  estadoFormulario.textContent = '⚠ ' + mensaje;
}

function formatearFecha(iso) {
  const partes = iso.split('-');
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return partes[2] + ' de ' + meses[parseInt(partes[1], 10) - 1] + ' de ' + partes[0];
}

/* ============================================================
   10. MAPA INTERACTIVO (LEAFLET)
   ============================================================ */

const contenedorMapa = document.getElementById('mapa');

if (contenedorMapa && typeof L !== 'undefined') {
  const latitud = 18.4861;
  const longitud = -69.9312;

  const mapa = L.map('mapa').setView([latitud, longitud], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 19
  }).addTo(mapa);

  const marcador = L.marker([latitud, longitud]).addTo(mapa);

  marcador.bindPopup(
    '<strong>🐝 Miel & Morir Soñando</strong>' +
    'Taller principal<br>' +
    'Calle Duarte #123, Zona Colonial<br>' +
    'Santo Domingo, R.D.<br>' +
    '<small>Abierto de lunes a sábado · 9 AM – 7 PM</small>'
  ).openPopup();

  L.circle([latitud, longitud], {
    color: '#F2B705',
    fillColor: '#F2B705',
    fillOpacity: 0.1,
    radius: 350
  }).addTo(mapa);

} else if (contenedorMapa && typeof L === 'undefined') {
  contenedorMapa.innerHTML =
    '<p style="padding:20px;color:#b8b0c9;">El mapa no pudo cargarse. Revisa tu conexión.</p>';
}

console.log('📍 Mapa y formulario cargados correctamente.');

