/* ==============================================================
   MIEL & MORIR SOÑANDO — script.js (versión final)
   Un solo archivo para las 3 páginas. Cada módulo se activa solo
   si encuentra sus elementos en la página donde se carga.

   ÍNDICE
   ---------------------------------------------------------------
    0. Configuración (CONFIG) y catálogo de precios (CATALOGO)
    1. Utilidades ($, almacén seguro, nodos, formato, fechas)
    2. Modo claro / oscuro (se recuerda entre páginas)
    3. Pantalla de error / intro (terminal + recarga forzada)
    4. Easter egg (receta secreta y código de descuento)
    5. Chatbot "Miel" (respuestas por palabras clave)
    6. Filtros del catálogo (todos / bizcocho / brownie / frío / caja)
    7. Cotizador en línea (precio en RD$ + guardado para pedido)
    8. Formulario de pedidos (validación, código, WhatsApp)
    9. Mapa interactivo (Leaflet + OpenStreetMap)
   10. Arranque (llama a todos los módulos)
   ============================================================== */
(function () {
  'use strict';

  /* ============================================================
     0. CONFIGURACIÓN 
     ============================================================ */
  const CONFIG = {
    // Número de WhatsApp: código de país + número, sin + ni espacios.
    // Es un número de ejemplo: cámbialo por uno real si quieres probarlo.
    whatsapp: '18095550123',
    codigo: 'RESURGIR20',
    descuento: 0.2,
    taller: [18.4861, -69.9312]
  };

  // Fuente única de precios para el chatbot y el pedido.
  // Debe coincidir con los precios de servicios.html.
  const CATALOGO = {
    'Bizcocho de Miel': 1200,
    'Bizcocho Personalizado': 1500,
    'Brownie Fudge': 350,
    'Blondie de Coco': 450,
    'Flan de Coco': 500,
    'Cheesecake de Mango': 550,
    'Cajita Regalo Petit': 800,
    'Cajita Regalo Premium': 1600
  };

  /* ============================================================
     1. UTILIDADES
     ============================================================ */
  function $(id) { return document.getElementById(id); }

  // Acceso seguro a localStorage / sessionStorage (pueden fallar en modo privado)
  const almacen = {
    leer: function (tipo, clave) {
      try { return window[tipo].getItem(clave); } catch (e) { return null; }
    },
    guardar: function (tipo, clave, valor) {
      try { window[tipo].setItem(clave, valor); } catch (e) { /* sin almacenamiento */ }
    },
    borrar: function (tipo, clave) {
      try { window[tipo].removeItem(clave); } catch (e) { /* sin almacenamiento */ }
    }
  };

  // Crea un elemento con texto seguro (textContent, nunca innerHTML)
  function nodo(etiqueta, texto, atributos) {
    const n = document.createElement(etiqueta);
    if (texto) n.textContent = texto;
    if (atributos) {
      Object.keys(atributos).forEach(function (k) { n.setAttribute(k, atributos[k]); });
    }
    return n;
  }

  function formatoRD(numero) {
    return 'RD$' + Math.round(numero).toLocaleString('en-US');
  }

  // Minúsculas y sin acentos, para que "envío" y "envio" sean lo mismo
  function normalizar(texto) {
    return texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  function aISO(fecha) {
    return fecha.getFullYear() + '-' +
      String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
      String(fecha.getDate()).padStart(2, '0');
  }

  function formatearFecha(iso) {
    const partes = iso.split('-');
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return parseInt(partes[2], 10) + ' de ' + meses[parseInt(partes[1], 10) - 1] + ' de ' + partes[0];
  }

  /* ============================================================
     2. MODO CLARO / OSCURO (se recuerda entre páginas)
     El sitio nace oscuro porque es parte de su identidad visual.
     ============================================================ */
  function iniciarTema() {
    if (almacen.leer('localStorage', 'tema') === 'claro') {
      document.body.classList.add('modo-claro');
    }

    const boton = $('boton-tema');
    if (!boton) return;

    function pintar() {
      const claro = document.body.classList.contains('modo-claro');
      boton.textContent = claro ? '☀️' : '🌙';
      boton.setAttribute('aria-pressed', String(claro));
      boton.setAttribute('aria-label', claro ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    }

    boton.addEventListener('click', function () {
      document.body.classList.toggle('modo-claro');
      almacen.guardar('localStorage', 'tema',
        document.body.classList.contains('modo-claro') ? 'claro' : 'oscuro');
      pintar();
    });

    pintar();
  }

  /* ============================================================
     3. PANTALLA DE ERROR → "RECUPERAR SISTEMA"
     - Se muestra una vez por sesión (o siempre con ?intro=1)
     - Se puede saltar con el botón o con la tecla Esc
     - Respeta "reducir movimiento" del sistema
     ============================================================ */
  const LINEAS_TERMINAL = [
    'Iniciando protocolo de búsqueda...',
    'Buscando negocio: Miel & Morir Soñando',
    '✗ ERROR 0x404 — NEGOCIO NO ENCONTRADO'
  ];

  function iniciarIntro() {
    const pantalla = $('pantalla-error');
    const sitio = $('sitio');
    if (!pantalla || !sitio) return;

    const forzada = new URLSearchParams(window.location.search).get('intro') === '1';
    const yaVista = almacen.leer('sessionStorage', 'intro_vista') === '1';

    let cancelada = false;
    const pendientes = [];

    function programar(funcion, ms) {
      const id = setTimeout(function () { if (!cancelada) funcion(); }, ms);
      pendientes.push(id);
    }

    function entrar(conFoco) {
      cancelada = true;
      pendientes.forEach(clearTimeout);
      pantalla.classList.add('oculto');
      sitio.classList.remove('oculto');
      almacen.guardar('sessionStorage', 'intro_vista', '1');
      window.scrollTo(0, 0);
      if (conFoco) {
        const titulo = sitio.querySelector('h1');
        if (titulo) {
          titulo.setAttribute('tabindex', '-1');
          titulo.focus({ preventScroll: true });
        }
      }
    }

    // Visitante que ya vio la intro en esta sesión: directo al sitio
    if (yaVista && !forzada) {
      entrar(false);
      return;
    }

    // Botón "Saltar" (se crea solo si no existe en el HTML)
    if (!$('boton-saltar')) {
      const saltar = nodo('button', 'Saltar intro ▸', {
        id: 'boton-saltar', type: 'button', 'class': 'boton-saltar mono'
      });
      pantalla.appendChild(saltar);
    }
    $('boton-saltar').addEventListener('click', function () { entrar(true); });

    const botonRecuperar = $('boton-recuperar');
    if (botonRecuperar) {
      botonRecuperar.addEventListener('click', function () { entrar(true); });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !pantalla.classList.contains('oculto')) entrar(true);
    });

    function revelar() {
      const revelacion = $('revelacion');
      if (!revelacion) return;
      revelacion.classList.add('visible');
      if (botonRecuperar) botonRecuperar.focus({ preventScroll: true });
    }

    function marcarFallo(barra, porcentaje) {
      barra.style.backgroundImage = 'none';
      barra.style.backgroundColor = 'rgba(255, 92, 92, 0.3)';
      porcentaje.textContent = '✗ FALLÓ';
      porcentaje.style.color = '#ff5c5c';
      porcentaje.style.fontWeight = 'bold';
    }

    // Escribe una línea letra por letra
    function escribir(idElemento, texto, alTerminar) {
      const elemento = $(idElemento);
      if (!elemento) { alTerminar(); return; }
      let i = 0;
      elemento.textContent = '';
      (function siguiente() {
        if (i >= texto.length) { alTerminar(); return; }
        elemento.textContent += texto.charAt(i);
        i++;
        programar(siguiente, 25);
      })();
    }

    function animarBarra() {
      const barra = $('barra-progreso');
      const porcentaje = $('porcentaje-progreso');
      if (!barra || !porcentaje) { revelar(); return; }

      let progreso = 0;
      (function paso() {
        let avance;
        if (progreso < 40) avance = Math.floor(Math.random() * 8) + 5;
        else if (progreso < 80) avance = Math.floor(Math.random() * 5) + 3;
        else avance = Math.floor(Math.random() * 3) + 2;

        progreso = Math.min(100, progreso + avance);
        barra.style.backgroundSize = progreso + '% 100%';
        porcentaje.textContent = progreso + '%';

        if (progreso < 100) { programar(paso, 110); return; }

        // Pausa dramática antes del fallo
        programar(function () {
          marcarFallo(barra, porcentaje);
          programar(revelar, 700);
        }, 600);
      })();
    }

    function secuencia() {
      escribir('linea-1', LINEAS_TERMINAL[0], function () {
        programar(function () {
          escribir('linea-2', LINEAS_TERMINAL[1], function () {
            programar(function () {
              escribir('linea-3', LINEAS_TERMINAL[2], function () {
                programar(animarBarra, 400);
              });
            }, 350);
          });
        }, 350);
      });
    }

    const reducirMovimiento = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducirMovimiento) {
      // Sin animaciones: se muestra el estado final de golpe
      LINEAS_TERMINAL.forEach(function (texto, i) {
        const el = $('linea-' + (i + 1));
        if (el) el.textContent = texto;
      });
      const barra = $('barra-progreso');
      const porcentaje = $('porcentaje-progreso');
      if (barra && porcentaje) {
        barra.style.backgroundSize = '100% 100%';
        marcarFallo(barra, porcentaje);
      }
      revelar();
    } else {
      programar(secuencia, 300);
    }
   
    // Enlace "Repetir la intro" del footer: fuerza recarga limpia
    const enlaceRepetir = document.getElementById('repetir-intro');
    if (enlaceRepetir) {
      enlaceRepetir.addEventListener('click', function (e) {
        e.preventDefault();
        // Borra la marca de "intro vista" y fuerza recarga sin caché
        almacen.borrar('sessionStorage', 'intro_vista');
        window.location.href = 'index.html?intro=1&t=' + Date.now();
      });
    }
    
  }

  /* ============================================================
     4. EASTER EGG — RECETA SECRETA
     Se abre con el botón "?" o escribiendo la palabra "miel"
     en cualquier parte de la página (fuera de un campo de texto).
     ============================================================ */
  function iniciarSecreto() {
    const boton = $('boton-secreto');
    let dialogo = null;

    function construir() {
      dialogo = nodo('dialog', '', { 'class': 'secreto', 'aria-labelledby': 'secreto-titulo' });
      const contenido = nodo('div', '', { 'class': 'secreto__contenido' });

      contenido.appendChild(nodo('h2', '🍰 Receta secreta de Doña Carmen', { id: 'secreto-titulo' }));
      contenido.appendChild(nodo('p', 'Bizcocho de miel dominicano:'));

      const lista = nodo('ul');
      ['3 tazas de harina', '1 taza de miel pura', '4 huevos criollos',
        '1 cucharadita de vainilla', 'Un toque de canela'].forEach(function (ingrediente) {
        lista.appendChild(nodo('li', ingrediente));
      });
      contenido.appendChild(lista);

      const codigo = nodo('p');
      codigo.appendChild(document.createTextNode('Código secreto: '));
      codigo.appendChild(nodo('code', CONFIG.codigo));
      contenido.appendChild(codigo);
      contenido.appendChild(nodo('p', 'Úsalo en tu primer pedido y llévate 20% de descuento 🐝'));

      const cerrar = nodo('button', 'Cerrar', { type: 'button', 'class': 'boton boton--primario' });
      cerrar.addEventListener('click', function () { dialogo.close(); });
      contenido.appendChild(cerrar);

      dialogo.appendChild(contenido);
      // Clic fuera de la caja = cerrar
      dialogo.addEventListener('click', function (e) { if (e.target === dialogo) dialogo.close(); });
      document.body.appendChild(dialogo);
    }

    function abrir() {
      if (!dialogo) construir();
      if (typeof dialogo.showModal === 'function') {
        if (!dialogo.open) dialogo.showModal();
      } else {
        alert('Receta secreta de Doña Carmen\n\nCódigo secreto: ' + CONFIG.codigo +
          '\nÚsalo en tu primer pedido y llévate 20% de descuento.');
      }
    }

    if (boton) boton.addEventListener('click', abrir);

    // Segunda forma (oculta) de encontrarlo: escribir "miel"
    let secuencia = '';
    document.addEventListener('keydown', function (e) {
      const destino = e.target && e.target.tagName;
      if (destino === 'INPUT' || destino === 'TEXTAREA' || destino === 'SELECT') return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
      secuencia = (secuencia + e.key.toLowerCase()).slice(-4);
      if (secuencia === 'miel') { secuencia = ''; abrir(); }
    });
  }

  /* ============================================================
     5. CHATBOT "MIEL"
     Responde por palabras clave (no es IA). Ignora acentos.
     El orden de las reglas importa: gana la primera que coincida.
     ============================================================ */
  function listaPrecios() {
    return Object.keys(CATALOGO).map(function (nombre) {
      return nombre + ' ' + formatoRD(CATALOGO[nombre]);
    }).join(' · ');
  }

  const REGLAS_CHAT = [
    {
      claves: ['historia', 'misterio', 'borraron', 'usb', 'expediente', 'que paso', '12 de marzo'],
      respuesta: function () {
        return 'El 12 de marzo nos borraron de Internet, pero volvimos más dulces. La historia completa está en el Inicio 🐝';
      }
    },
    {
      claves: ['seguridad', 'proteg', 'respaldo', 'hack', 'ataque', 'escudo', 'resistent'],
      respuesta: function () {
        return 'Ahora el sitio vive en GitHub (cada cambio queda respaldado) y seguimos un protocolo anti-borrado: verificación en dos pasos, canales alternos y plan de recuperación. Míralo en "Escudo anti-borrado", en el Inicio 🔐';
      }
    },
    {
      claves: ['descuento', 'codigo', 'promo', 'oferta', 'cupon'],
      respuesta: function () {
        return 'Hay un código de bienvenida para tu primer pedido. Pista: en esta web hay un botón "?" escondido 🐝';
      }
    },
    {
      claves: ['precio', 'cuanto', 'cuesta', 'costo', 'valor', 'tarifa'],
      respuesta: function () {
        return 'Precios desde: ' + listaPrecios() + '. Puedes calcular tu pedido en el cotizador del Catálogo.';
      }
    },
    {
      claves: ['entrega', 'envio', 'domicilio', 'delivery', 'despacho', 'express'],
      respuesta: function () {
        return 'Entregamos en Santo Domingo, de lunes a sábado. Elige la fecha en el formulario con al menos 48 horas de anticipación; por RD$400 extra puedes fijar el horario de entrega 🚚';
      }
    },
    {
      claves: ['donde', 'ubicacion', 'direccion', 'taller', 'mapa', 'horario', 'abren', 'abierto'],
      respuesta: function () {
        return 'Estamos en Calle Duarte #123, Zona Colonial, Santo Domingo. Abrimos de lunes a sábado, de 9 AM a 7 PM. El mapa está en la página de Pedidos 📍';
      }
    },
    {
      claves: ['pedido', 'pedir', 'comprar', 'ordenar', 'encargar', 'reservar', 'cotiz'],
      respuesta: function () {
        return 'Puedes cotizar en el Catálogo y luego entrar a Pedidos para llenar el formulario con tu fecha de entrega. Te confirmamos por WhatsApp 📱';
      }
    },
    {
      claves: ['bizcocho', 'pastel', 'torta', 'cumple', 'boda'],
      respuesta: function () {
        return 'Tenemos el Bizcocho de Miel (desde ' + formatoRD(CATALOGO['Bizcocho de Miel']) +
          ') y el Bizcocho Personalizado (desde ' + formatoRD(CATALOGO['Bizcocho Personalizado']) +
          '), ideal para cumpleaños y bodas 🍰';
      }
    },
    {
      claves: ['brownie', 'blondie', 'chocolate'],
      respuesta: function () {
        return 'El Brownie Fudge (chocolate 70%, nueces y sal marina) va desde ' + formatoRD(CATALOGO['Brownie Fudge']) +
          ' y el Blondie de Coco desde ' + formatoRD(CATALOGO['Blondie de Coco']) + ' 🍫';
      }
    },
    {
      claves: ['flan', 'cheesecake', 'mango', 'frio', 'coco'],
      respuesta: function () {
        return 'En postres fríos tenemos Flan de Coco (desde ' + formatoRD(CATALOGO['Flan de Coco']) +
          ') y Cheesecake de Mango (desde ' + formatoRD(CATALOGO['Cheesecake de Mango']) + ') 🍮';
      }
    },
    {
      claves: ['caja', 'cajita', 'regalo', 'obsequio'],
      respuesta: function () {
        return 'La Cajita Petit trae 6 mini postres (desde ' + formatoRD(CATALOGO['Cajita Regalo Petit']) +
          ') y la Premium trae 12 con tarjeta y lazo dorado (desde ' + formatoRD(CATALOGO['Cajita Regalo Premium']) + ') 🎁';
      }
    },
    {
      claves: ['catalogo', 'menu', 'productos', 'venden', 'tienen'],
      respuesta: function () {
        return 'Hacemos bizcochos, brownies, postres fríos y cajitas de regalo. Mira el Catálogo completo o dime el nombre de un postre 🐝';
      }
    },
    {
      claves: ['gracias', 'genial', 'perfecto'],
      respuesta: function () { return '¡Con gusto! Aquí estaré si se te antoja algo dulce 🐝'; }
    },
    {
      claves: ['hola', 'buenas', 'saludos'],
      respuesta: function () { return '¡Hola! Soy Miel 🐝 ¿Buscas algo dulce para hoy?'; }
    }
  ];

  const RESPUESTA_DEFECTO = 'Aún estoy aprendiendo 🐝 Prueba con: catálogo, precios, entrega, pedido, seguridad o historia.';

  function responderChat(pregunta) {
    const texto = normalizar(pregunta);
    for (let i = 0; i < REGLAS_CHAT.length; i++) {
      const regla = REGLAS_CHAT[i];
      const coincide = regla.claves.some(function (clave) { return texto.indexOf(clave) !== -1; });
      if (coincide) return regla.respuesta();
    }
    return RESPUESTA_DEFECTO;
  }

  function iniciarChat() {
    const boton = $('boton-chat');
    const panel = $('asistente');
    const formulario = $('chat-formulario');
    const entrada = $('chat-entrada');
    const mensajes = $('chat-mensajes');
    if (!boton || !panel || !formulario || !entrada || !mensajes) return;

    boton.setAttribute('aria-expanded', 'false');

    function alternar(abrir) {
      panel.classList.toggle('abierto', abrir);
      boton.setAttribute('aria-expanded', String(abrir));
      if (abrir) entrada.focus();
    }

    function agregar(texto, clase) {
      mensajes.appendChild(nodo('p', texto, { 'class': clase }));
      mensajes.scrollTop = mensajes.scrollHeight;
    }

    boton.addEventListener('click', function () {
      alternar(!panel.classList.contains('abierto'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('abierto')) {
        alternar(false);
        boton.focus();
      }
    });

    formulario.addEventListener('submit', function (e) {
      e.preventDefault();
      const pregunta = entrada.value.trim();
      if (!pregunta) return;

      agregar(pregunta, 'mensaje-usuario');
      entrada.value = '';
      setTimeout(function () { agregar(responderChat(pregunta), 'mensaje-bot'); }, 400);
    });
  }

  /* ============================================================
     6. FILTROS DEL CATÁLOGO
     ============================================================ */
  function iniciarFiltros() {
    const botones = document.querySelectorAll('.filtro');
    const productos = document.querySelectorAll('.producto');
    if (!botones.length) return;

    botones.forEach(function (boton) {
      boton.setAttribute('aria-pressed', boton.classList.contains('activo') ? 'true' : 'false');

      boton.addEventListener('click', function () {
        botones.forEach(function (b) {
          b.classList.remove('activo');
          b.setAttribute('aria-pressed', 'false');
        });
        boton.classList.add('activo');
        boton.setAttribute('aria-pressed', 'true');

        const filtro = boton.dataset.filtro;
        productos.forEach(function (producto) {
          const visible = filtro === 'todos' || producto.dataset.categoria === filtro;
          producto.classList.toggle('oculto-producto', !visible);
        });
      });
    });
  }

  /* ============================================================
     7. COTIZADOR EN LÍNEA
     ============================================================ */

  function linea(etiqueta, valor, resaltar) {
    const div = nodo('div');
    div.appendChild(document.createTextNode(etiqueta));
    if (resaltar) div.appendChild(nodo('strong', valor));
    else div.appendChild(document.createTextNode(valor));
    return div;
  }

  function iniciarCotizador() {
    const formulario = $('cotizador');
    const salida = $('resultado-cotizador');
    if (!formulario || !salida) return;

    // Botones "Cotizar" de cada producto: preseleccionan el producto
    document.querySelectorAll('.boton-cotizar').forEach(function (boton) {
      boton.addEventListener('click', function () {
        const select = $('producto-cotizar');
        const nombre = boton.dataset.producto;
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].value.indexOf(nombre + '|') === 0) {
            select.selectedIndex = i;
            break;
          }
        }
        formulario.scrollIntoView({ behavior: 'smooth', block: 'center' });
        select.focus({ preventScroll: true });
      });
    });

        formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();

      const selProducto = $('producto-cotizar');
      const selTamano = $('porciones-cotizar');
      const selExtra = $('extras-cotizar');

      salida.textContent = '';

      if (!selProducto.value) {
        salida.textContent = '⚠️ Selecciona un producto primero.';
        return;
      }

      const partes = selProducto.value.split('|');
      const nombre = partes[0];
      const base = parseFloat(partes[1]);
      const factor = parseFloat(selTamano.value);
      const extra = parseFloat(selExtra.value);
      const total = base * factor + extra;

      const tamanoTexto = selTamano.options[selTamano.selectedIndex].text;
      const extraTexto = selExtra.options[selExtra.selectedIndex].text;

      salida.appendChild(linea('🍰 Producto: ', nombre, false));
      salida.appendChild(linea('Precio base: ', formatoRD(base), false));
      salida.appendChild(linea('Tamaño: ', tamanoTexto, false));
      salida.appendChild(linea('Extra: ', extraTexto, false));
      salida.appendChild(linea('Total estimado: ', formatoRD(total), true));

      const lineaAviso = nodo('div');
      lineaAviso.appendChild(nodo('small', 'El precio final puede variar según la decoración. Confirma por WhatsApp.'));
      salida.appendChild(nodo('br'));
      salida.appendChild(lineaAviso);

      // Guardar la cotización para precargarla en el formulario de pedidos
      almacen.guardar('localStorage', 'miel_cotizacion', JSON.stringify({
        producto: nombre,
        nota: 'Cotización: ' + tamanoTexto + ' · ' + extraTexto + ' · Total estimado ' + formatoRD(total)
      }));

      const irPedido = $('boton-ir-pedido');
      if (irPedido) irPedido.style.display = 'inline-block';
    });

  /* ============================================================
     8. FORMULARIO DE PEDIDOS (validación, descuento, WhatsApp)
     ============================================================ */
  function iniciarPedido() {
    const formulario = $('formulario-contacto');
    const estado = $('estado-formulario');
    if (!formulario || !estado) return;

    const selProducto = $('producto-contacto');
    const inputFecha = $('fecha-entrega');
    const inputTelefono = $('telefono');
    const inputNotas = $('notas');               // opcional (textarea)
    const inputCodigo = $('codigo-descuento');
    const botonAplicar = $('aplicar-codigo');
    const estadoCodigo = $('estado-codigo');

    const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    // ---- Precargar lo cotizado en el catálogo ----
    const cotizacion = almacen.leer('localStorage', 'miel_cotizacion');
    if (cotizacion) {
      try {
        const datos = JSON.parse(cotizacion);
        if (selProducto) {
          for (let i = 0; i < selProducto.options.length; i++) {
            if (selProducto.options[i].value === datos.producto) {
              selProducto.selectedIndex = i;
              break;
            }
          }
        }
        if (inputNotas && datos.nota) inputNotas.value = datos.nota;
      } catch (e) { /* dato dañado: se ignora */ }
      almacen.borrar('localStorage', 'miel_cotizacion');
    }

    // ---- Fecha mínima: 2 días después de hoy (48 horas) ----
    const hoyMas2 = new Date();
    hoyMas2.setDate(hoyMas2.getDate() + 2);
    const fechaMinima = aISO(hoyMas2);
    if (inputFecha) inputFecha.min = fechaMinima;

    // ---- Teléfono: solo números ----
    if (inputTelefono) {
      inputTelefono.addEventListener('input', function (e) {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
      });
    }

    // ---- Código de descuento (solo primer pedido) ----
    function codigoValido(valor) {
      return valor.trim().toUpperCase() === CONFIG.codigo;
    }

    function pintarCodigo(tipo, mensaje) {
      if (!estadoCodigo) return;
      estadoCodigo.className = 'estado-codigo ' + tipo;
      estadoCodigo.textContent = mensaje;
    }

    function bloquearCodigo() {
      if (!inputCodigo || !botonAplicar) return;
      inputCodigo.disabled = true;
      inputCodigo.placeholder = 'Código ya utilizado';
      botonAplicar.disabled = true;
      botonAplicar.textContent = 'Usado';
      pintarCodigo('usado', '🐝 Ya usaste tu código de bienvenida. ¡Gracias por tu primer pedido!');
    }

    if (almacen.leer('localStorage', 'miel_descuento_usado') === 'true') {
      bloquearCodigo();
    }

    if (inputCodigo && botonAplicar) {
      botonAplicar.addEventListener('click', function () {
        const valor = inputCodigo.value.trim();
        if (!valor) {
          pintarCodigo('invalido', '⚠ Escribe un código primero.');
        } else if (codigoValido(valor)) {
          pintarCodigo('valido', '✅ ¡Código válido! Tendrás 20% de descuento en este primer pedido.');
        } else {
          pintarCodigo('invalido', '⚠ Código no reconocido. Verifica e intenta de nuevo.');
        }
      });

      // Enter dentro del campo aplica el código en lugar de enviar el pedido
      inputCodigo.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          botonAplicar.click();
        }
      });
    }

    // ---- Mensajes de estado ----
    function mostrarError(mensaje, idCampo) {
      estado.className = 'estado-formulario error';
      estado.textContent = '⚠ ' + mensaje;
      const campo = idCampo ? $(idCampo) : null;
      if (campo) campo.focus();
    }

    // ---- Envío ----
    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      estado.className = 'estado-formulario';
      estado.textContent = '';

      const nombre = $('nombre').value.trim();
      const correo = $('correo').value.trim();
      const telefono = inputTelefono.value.replace(/\D/g, '');
      const producto = selProducto.value;
      const fecha = inputFecha.value;
      const direccion = $('direccion').value.trim();
      const notas = inputNotas ? inputNotas.value.trim() : '';
      const codigo = inputCodigo && !inputCodigo.disabled ? inputCodigo.value.trim() : '';

      if (nombre.length < 3) return mostrarError('Por favor escribe tu nombre completo.', 'nombre');
      if (!REGEX_CORREO.test(correo)) return mostrarError('El correo no parece válido.', 'correo');
      if (telefono.length !== 10) return mostrarError('El teléfono debe tener 10 dígitos (ej: 8095550123).', 'telefono');
      if (!producto) return mostrarError('Selecciona un producto del catálogo.', 'producto-contacto');
      if (!fecha) return mostrarError('Debes elegir una fecha de entrega.', 'fecha-entrega');
      if (fecha < fechaMinima) {
        return mostrarError('La fecha de entrega debe ser al menos 48 horas después de hoy.', 'fecha-entrega');
      }
      if (new Date(fecha + 'T12:00:00').getDay() === 0) {
        return mostrarError('Entregamos de lunes a sábado. Elige otra fecha.', 'fecha-entrega');
      }
      if (direccion.length < 8) return mostrarError('Por favor escribe una dirección más completa.', 'direccion');

      let aplicaDescuento = false;
      if (codigo) {
        if (!codigoValido(codigo)) {
          return mostrarError('El código de descuento no es válido. Corrígelo o déjalo vacío.', 'codigo-descuento');
        }
        aplicaDescuento = true;
      }

      // Mensaje prellenado para WhatsApp
      const textoWhatsApp = [
        'Hola, quiero hacer un pedido en Miel & Morir Soñando:',
        '• Producto: ' + producto,
        '• Fecha de entrega: ' + formatearFecha(fecha),
        '• Dirección: ' + direccion,
        '• Nombre: ' + nombre,
        '• Teléfono: ' + telefono,
        notas ? '• Notas: ' + notas : '',
        aplicaDescuento ? '• Código: ' + CONFIG.codigo + ' (20% de descuento)' : ''
      ].filter(Boolean).join('\n');

      const enlaceWhatsApp = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(textoWhatsApp);

      // Confirmación (todo con textContent: sin riesgo de inyección)
      estado.className = 'estado-formulario exito';
      estado.textContent = '';

      const l1 = nodo('div');
      l1.append('🍰 ¡Gracias, ', nodo('strong', nombre.split(' ')[0]), '!');
      const l2 = nodo('div');
      l2.append('Tu pedido de ', nodo('strong', producto), ' fue registrado para el ' + formatearFecha(fecha) + '.');
      estado.append(l1, l2);

      if (aplicaDescuento && CATALOGO[producto]) {
        const base = CATALOGO[producto];
        const conDescuento = base * (1 - CONFIG.descuento);
        estado.appendChild(nodo('div',
          '🎁 Con tu código ' + CONFIG.codigo + ', el precio desde ' + formatoRD(base) +
          ' baja a ' + formatoRD(conDescuento) + '.'));
      }

      const boton = nodo('a', '📱 Confirmar por WhatsApp', {
        href: enlaceWhatsApp, target: '_blank', rel: 'noopener', 'class': 'boton boton--primario'
      });
      boton.style.marginTop = '12px';
      estado.appendChild(boton);
      estado.appendChild(nodo('br'));
      estado.appendChild(nodo('small', 'Esta es una demostración académica. No se envió ningún correo real.'));

      if (aplicaDescuento) {
        almacen.guardar('localStorage', 'miel_descuento_usado', 'true');
      }

      formulario.reset();
      if (estadoCodigo) { estadoCodigo.className = 'estado-codigo'; estadoCodigo.textContent = ''; }
      if (aplicaDescuento) bloquearCodigo();
      estado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }


  /* ============================================================
     9. MAPA INTERACTIVO (LEAFLET + OPENSTREETMAP)
     ============================================================ */
  function iniciarMapa() {
    const contenedor = $('mapa');
    if (!contenedor) return;

    if (typeof L === 'undefined') {
      contenedor.textContent = 'El mapa no pudo cargarse. Revisa tu conexión.';
      contenedor.style.padding = '20px';
      return;
    }

    const mapa = L.map('mapa', { scrollWheelZoom: false }).setView(CONFIG.taller, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(mapa);

    L.marker(CONFIG.taller).addTo(mapa).bindPopup(
      '<strong>🐝 Miel &amp; Morir Soñando</strong>' +
      'Taller principal<br>' +
      'Calle Duarte #123, Zona Colonial<br>' +
      'Santo Domingo, R.D.<br>' +
      '<small>Abierto de lunes a sábado · 9 AM – 7 PM</small>'
    ).openPopup();

    L.circle(CONFIG.taller, {
      color: '#F2B705',
      fillColor: '#F2B705',
      fillOpacity: 0.1,
      radius: 350
    }).addTo(mapa);
  }

  /* ============================================================
     10. ARRANQUE
     ============================================================ */
  iniciarTema();
  iniciarIntro();
  iniciarSecreto();
  iniciarChat();
  iniciarFiltros();
  iniciarCotizador();
  iniciarPedido();
  iniciarMapa();
})();
