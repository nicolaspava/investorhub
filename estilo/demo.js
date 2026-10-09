/* La Curaduría · la demo del hero.
   El computador muestra Pro (la gestión) y el teléfono la GuÍA y el perfil de
   un artista. Las dos pantallas están conectadas, como en la plataforma:
   - publicar el borrador en Pro lo anuncia la GuÍA;
   - editar la frase del perfil en Pro cambia el perfil en el teléfono;
   - pedir booking desde el perfil llega a Mensajes en Pro.
   Todo es local: nada sale de la página. Los artistas y eventos son reales,
   tomados de lacuraduria.net (8 oct 2026). */
(function () {
  var demo = document.querySelector('[data-demo]');
  if (!demo) return;
  var $ = function (s, r) { return (r || demo).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || demo).querySelectorAll(s)); };
  var quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tocada = false;           // si la persona ya tocó algo, no hay reproducción automática
  demo.addEventListener('pointerdown', function () { tocada = true; }, { once: true });
  demo.addEventListener('keydown', function () { tocada = true; }, { once: true });

  /* ── 1. El lienzo del computador se diseña a 1000 × 640 y se escala ── */
  var marco = $('[data-pc-marco]'), lienzo = $('[data-pc-lienzo]');
  var escala = 1;
  function escalar() {
    escala = marco.clientWidth / 1000;
    lienzo.style.transform = 'scale(' + escala + ')';
    if (ventanaAbierta) ubicarVentana();
  }
  if ('ResizeObserver' in window) new ResizeObserver(escalar).observe(marco);
  else window.addEventListener('resize', escalar);
  escalar();

  /* ── 2. Pro: las vistas y la ventana que explica cada una ─────────── */
  var funciones = [
    { id: 'eventos', titulo: 'Eventos',
      texto: 'Crea el evento una vez, con fecha, lugar, entradas y artistas. Al publicarlo aparece en la cartelera, en el mapa, en el perfil de los artistas y en la GuÍA.',
      prueba: 'Pruébalo: publica el borrador y mira el teléfono.' },
    { id: 'convocatorias', titulo: 'Convocatorias',
      texto: 'Abre una convocatoria y recibe postulaciones con el perfil completo de cada artista. Seleccionas con tu equipo, sin hojas de cálculo.',
      prueba: 'Pruébalo: selecciona a quien quieras programar.' },
    { id: 'produccion', titulo: 'Producción',
      texto: 'La hoja de producción de cada fecha: horario, rider, hospitality, dietas y contactos, compartida con artistas y equipo.',
      prueba: 'Pruébalo: marca lo que ya está listo en el rider.' },
    { id: 'perfiles', titulo: 'Perfiles',
      texto: 'El toolkit del artista: lo que se llena aquí es su perfil público y su kit de booking. Una sola fuente, siempre al día.',
      prueba: 'Pruébalo: cambia la frase y toca «Ver en la GuÍA».' },
    { id: 'mensajes', titulo: 'Mensajes',
      texto: 'Booking, producción y prensa en una sola bandeja, no regados entre WhatsApp y el correo.',
      prueba: 'Pruébalo: pide booking desde el perfil en el teléfono.' },
    { id: 'comunicacion', titulo: 'Comunicación',
      texto: 'Las piezas de difusión del evento (post, historia y afiche) salen de los datos que ya cargaste.',
      prueba: 'Pruébalo: cambia de formato.' }
  ];
  var actual = 0, ventanaAbierta = true;
  var ventana = $('[data-ventana]'), punto = $('[data-punto]'), nota = $('[data-nota]');

  function ir(id, abrirVentana) {
    var i = funciones.findIndex(function (f) { return f.id === id; });
    if (i < 0) return;
    actual = i;
    $$('[data-vista]').forEach(function (v) { v.hidden = v.getAttribute('data-vista') !== id; });
    $$('[data-ir]').forEach(function (b) {
      var es = b.getAttribute('data-ir') === id;
      if (es) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    var f = funciones[i];
    $('[data-v-paso]').textContent = (i + 1) + ' / ' + funciones.length;
    $('[data-v-titulo]').textContent = f.titulo;
    $('[data-v-texto]').textContent = f.texto;
    $('[data-v-prueba]').textContent = f.prueba;
    nota.innerHTML = '<b>' + f.titulo + '.</b> ' + f.texto;
    if (id === 'mensajes') $('[data-cuenta]').hidden = true;
    if (abrirVentana !== false) ventanaAbierta = true;
    ventana.hidden = !ventanaAbierta;
    ubicarVentana();
  }

  // La ventana se pone junto al elemento que marca cada vista (data-ancla),
  // en coordenadas del lienzo sin escalar.
  function ubicarVentana() {
    var ancla = $('[data-ancla="' + funciones[actual].id + '"]');
    if (!ancla) return;
    var rl = lienzo.getBoundingClientRect(), ra = ancla.getBoundingClientRect();
    var x = (ra.left - rl.left) / escala, y = (ra.top - rl.top) / escala;
    var w = ra.width / escala, h = ra.height / escala;
    punto.style.left = (x + w - 6) + 'px';
    punto.style.top = (y - 6) + 'px';
    var vw = 360, vh = ventana.offsetHeight || 220;
    // Debajo de todo el contenido de la vista, para no tapar lo que se puede tocar;
    // si no cabe, debajo del ancla; si tampoco, encima. Nunca sobre la franja
    // derecha, donde se apoya el teléfono.
    var vista = $('[data-vista="' + funciones[actual].id + '"]');
    var fondo = (vista.getBoundingClientRect().bottom - rl.top) / escala;
    var vx = Math.min(Math.max(x + w - vw, 228), 1000 - vw - 130), vy = fondo + 14;
    if (vy + vh > 626) vy = y + h + 14;
    if (vy + vh > 626) vy = Math.max(16, y - vh - 14);
    ventana.style.left = vx + 'px';
    ventana.style.top = vy + 'px';
  }

  $$('[data-ir]').forEach(function (b) {
    b.addEventListener('click', function () { ir(b.getAttribute('data-ir')); });
  });
  $('[data-v-siguiente]').addEventListener('click', function () {
    ir(funciones[(actual + 1) % funciones.length].id);
  });
  $('[data-v-cerrar]').addEventListener('click', function () { ventanaAbierta = false; ventana.hidden = true; });
  punto.addEventListener('click', function () { ventanaAbierta = true; ventana.hidden = false; ubicarVentana(); });
  punto.removeAttribute('aria-hidden');
  punto.setAttribute('role', 'button');
  punto.setAttribute('tabindex', '0');
  punto.setAttribute('aria-label', 'Qué hace esta función');
  punto.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); punto.click(); } });

  function avisar(sel, texto) {
    var a = $(sel);
    a.textContent = texto;
    a.classList.add('t-visible');
    clearTimeout(a._t);
    a._t = setTimeout(function () { a.classList.remove('t-visible'); }, 3200);
  }

  // Acciones de Pro
  demo.addEventListener('click', function (e) {
    var b = e.target.closest('[data-accion]');
    if (!b) return;
    var accion = b.getAttribute('data-accion');
    if (accion === 'crear') avisar('[data-aviso-pc]', 'En la demo puedes publicar el borrador de la lista.');
    if (accion === 'publicar') {
      var fila = b.closest('[data-ev-borrador]');
      var estado = $('[data-estado]', fila);
      estado.textContent = 'Publicado'; estado.classList.add('t-pro-estado-ok');
      b.disabled = true; b.textContent = 'Publicado';
      avisar('[data-aviso-pc]', 'Publicado en la cartelera, el mapa y la GuÍA.');
      mostrarMovil('guia');
      setTimeout(function () {
        responder('Nuevo en la cartelera, por si te interesa el rock bogotano:', [EVENTOS.edicion], true);
      }, 600);
    }
    if (accion === 'seleccionar' || accion === 'pasar') {
      var tarjeta = b.closest('.t-pro-post');
      tarjeta.classList.toggle('t-elegida', accion === 'seleccionar');
      tarjeta.classList.toggle('t-pasada', accion === 'pasar');
      var n = $$('.t-pro-post.t-elegida').length;
      avisar('[data-aviso-pc]', accion === 'seleccionar' ? n + (n === 1 ? ' artista seleccionado' : ' artistas seleccionados') + ' para la programación.' : 'Postulación archivada.');
    }
    if (accion === 'ver-perfil') { abrirPerfil('la-payara'); avisar('[data-aviso-movil]', 'Así se ve en la GuÍA.'); }
    if (accion === 'generar') avisar('[data-aviso-pc]', '3 piezas listas para compartir: post, historia y afiche.');
  });

  // Formatos de las piezas
  $$('[data-formato]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-formato]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $('[data-pieza]').setAttribute('data-pieza', b.getAttribute('data-formato'));
    });
  });

  // La frase del perfil: lo que se escribe en Pro es lo que sale en la GuÍA
  var frase = $('[data-frase]');
  frase.addEventListener('input', function () {
    ARTISTAS['la-payara'].frase = frase.value;
    if (perfilAbierto === 'la-payara') $('[data-mp-frase]').textContent = frase.value;
  });

  /* ── 3. El teléfono: la GuÍA y el perfil ──────────────────────────── */
  var ARTISTAS = {
    'la-payara': { nombre: 'La Payara', img: 'la-payara.jpg', w: 560, h: 300, frase: 'Psicodelia amazónica de pulso plurirrítmico.',
      bio: 'Proyecto de exploración sonora que nace de un viaje antropológico por Colombia. Lleva los saberes musicales y ancestrales a la pista, en diálogo con la cultura club. Prepara su álbum «Colombia», que sale a finales de octubre.',
      generos: ['Electrónica', 'Sonidos de raíz', 'Psicodelia'] },
    'veronica-cian': { nombre: 'Verónica Cian', img: 'veronica-cian.jpg', w: 388, h: 560, frase: 'Ambient y drone que convierten memoria, bioelectricidad y paisaje en textura.', generos: ['Ambient', 'Drone'] },
    'guaricha': { nombre: 'GUARICHA', img: 'guaricha.jpg', w: 560, h: 315, frase: 'Ritual de rock industrial bogotano.', generos: ['Rock', 'Industrial'] },
    'maria-manuela': { nombre: 'María Manuela', img: 'maria-manuela.jpg', w: 560, h: 373, frase: 'Cute dembow.', generos: ['Dembow'] }
  };
  var EVENTOS = {
    nusar: { nombre: 'Nusar 3000', img: 'ev-nusar.jpg', cuando: 'Vie 9 oct · 9:00 p.m.', donde: 'GATE CLUB', slug: 'nusar-3000' },
    mir: { nombre: 'Mir Nicolas & Nico Miseria', img: 'ev-mir.jpg', cuando: 'Vie 9 oct', donde: 'Enter Enter Enter', slug: 'mir-nicolas-nico-miseria-mrnoym' },
    vuelo: { nombre: 'El Vuelo Sinfónico', img: 'ev-vuelo.jpg', cuando: 'Vie 16 oct · 8:00 p.m.', donde: 'Ojo de Tigre', slug: 'el-vuelo-sinfonico-qhk0hg' },
    edicion: { nombre: 'Edición Ltda · lanzamiento EP', img: 'ev-edicion.jpg', cuando: 'Sáb 7 nov · 6:30 p.m.', donde: 'Ace of Spades', slug: 'edicion-ltda-lanzamiento-ep-gigyp4' }
  };
  var RESPUESTAS = {
    finde: ['Este fin de semana en Bogotá:', [EVENTOS.nusar, EVENTOS.mir]],
    artistas: ['Por lo que te gusta, te pueden interesar:', [{ a: 'la-payara' }, { a: 'veronica-cian' }, { a: 'guaricha' }]],
    escuchar: ['La Payara lanza su álbum «Colombia» a finales de octubre. Escúchala en su perfil, y si te gusta lo ambiental, a Verónica Cian:', [{ a: 'la-payara' }, { a: 'veronica-cian' }]]
  };
  var msgs = $('[data-msgs]'), sug = $('[data-sug]'), form = $('[data-form]'), entrada = $('#t-mv-pregunta');
  var perfilAbierto = null, ocupada = false;

  function el(tag, clase, texto) { var n = document.createElement(tag); if (clase) n.className = clase; if (texto) n.textContent = texto; return n; }
  function bajar() { msgs.scrollTo({ top: msgs.scrollHeight, behavior: quieto ? 'auto' : 'smooth' }); }

  function tarjeta(item) {
    if (item.a) {
      var a = ARTISTAS[item.a];
      var b = el('button', 't-mv-tarjeta');
      b.type = 'button';
      b.innerHTML = '<img src="/img/demo/' + a.img + '" alt="" width="' + a.w + '" height="' + a.h + '"><span><small style="--c: var(--p-cyan);">Artista</small><b></b><em></em></span>';
      b.querySelector('b').textContent = a.nombre;
      b.querySelector('em').textContent = a.frase;
      b.addEventListener('click', function () { abrirPerfil(item.a); });
      return b;
    }
    var t = el('a', 't-mv-tarjeta');
    t.href = 'https://lacuraduria.net/evento/' + item.slug; t.target = '_blank'; t.rel = 'noopener';
    t.innerHTML = '<img src="/img/demo/' + item.img + '" alt="" width="320" height="420"><span><small style="--c: var(--p-coral);">Evento</small><b></b><em></em></span>';
    t.querySelector('b').textContent = item.nombre;
    t.querySelector('em').textContent = item.cuando + ' · ' + item.donde;
    return t;
  }

  function responder(texto, items, sinPregunta) {
    var escribiendo = el('p', 't-mv-burbuja t-mv-escribe');
    escribiendo.innerHTML = '<i></i><i></i><i></i>';
    escribiendo.setAttribute('aria-label', 'La GuÍA está escribiendo');
    msgs.appendChild(escribiendo); bajar();
    ocupada = true;
    setTimeout(function () {
      escribiendo.remove();
      var r = el('div', 't-mv-resp');
      r.appendChild(el('p', 't-mv-burbuja' + (sinPregunta ? ' t-mv-nuevo' : ''), texto));
      (items || []).forEach(function (it) { r.appendChild(tarjeta(it)); });
      msgs.appendChild(r); bajar();
      ocupada = false;
    }, quieto ? 150 : 900);
  }

  function preguntar(clave, texto) {
    if (ocupada) return;
    msgs.appendChild(el('p', 't-mv-burbuja t-mv-yo', texto)); bajar();
    var r = RESPUESTAS[clave];
    if (r) responder(r[0], r[1]);
    else responder('En esta demo respondo a las sugerencias de abajo. En la plataforma, la GuÍA busca en toda la cartelera, el directorio y los contenidos.');
  }

  function adivinar(t) {
    t = t.toLowerCase();
    if (/fin de semana|finde|hoy|evento|plan|fiesta|concierto|salir/.test(t)) return 'finde';
    if (/artista|banda|dj|recomi|conocer|quién|quien/.test(t)) return 'artistas';
    if (/escuchar|música|musica|set|álbum|album|sonido|oír|oir/.test(t)) return 'escuchar';
    return null;
  }

  sug.addEventListener('click', function (e) {
    var b = e.target.closest('[data-preg]');
    if (b) preguntar(b.getAttribute('data-preg'), b.textContent);
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var t = entrada.value.trim();
    if (!t) return;
    entrada.value = '';
    preguntar(adivinar(t), t);
  });

  var vistaPerfil = $('[data-movil="perfil"]');
  function mostrarMovil(cual) {
    $('[data-movil="guia"]').hidden = cual !== 'guia';
    vistaPerfil.hidden = cual !== 'perfil';
    if (cual === 'guia') perfilAbierto = null;
  }

  function abrirPerfil(id) {
    var a = ARTISTAS[id];
    perfilAbierto = id;
    vistaPerfil.innerHTML =
      '<div class="t-mp-portada"><img src="/img/demo/' + a.img + '" alt="" width="' + a.w + '" height="' + a.h + '">' +
      '<button type="button" class="t-mp-volver" data-volver>' + ICONOS.volver + ' GuÍA</button></div>' +
      '<div class="t-mp-cuerpo">' +
      '<p class="t-mp-tipo"><span class="t-tipo" style="--c: var(--p-cyan);" aria-hidden="true"></span>Artista · Bogotá</p>' +
      '<h4 class="t-mp-nombre"><span data-mp-nombre></span>' + ICONOS.verificado + '</h4>' +
      '<p class="t-mp-frase" data-mp-frase></p>' +
      '<div class="t-mp-acc"><button type="button" class="t-mp-btn" data-seguir aria-pressed="false">' + ICONOS.corazon + ' Seguir</button><button type="button" class="t-mp-btn t-mp-btn-pri" data-booking>Pedir booking</button></div>' +
      (a.bio ? '<p class="t-mp-bio" data-mp-bio></p>' : '') +
      '<p class="t-mp-generos">' + a.generos.map(function (g) { return '<i>' + g + '</i>'; }).join('') + '</p>' +
      '</div>';
    $('[data-mp-nombre]').textContent = a.nombre;
    $('[data-mp-frase]').textContent = a.frase;
    if (a.bio) $('[data-mp-bio]').textContent = a.bio;
    $('[data-volver]').addEventListener('click', function () { mostrarMovil('guia'); });
    var seguir = $('[data-seguir]');
    seguir.addEventListener('click', function () {
      var si = seguir.getAttribute('aria-pressed') !== 'true';
      seguir.setAttribute('aria-pressed', si ? 'true' : 'false');
      seguir.lastChild.textContent = si ? ' Siguiendo' : ' Seguir';
      if (si) avisar('[data-aviso-movil]', 'Guardado en tu ruta: te avisamos de sus fechas.');
    });
    $('[data-booking]').addEventListener('click', function (e) {
      var b = e.currentTarget;
      b.disabled = true; b.textContent = 'Solicitud enviada';
      avisar('[data-aviso-movil]', 'Le llega a su equipo, en Pro.');
      llegaBooking(a.nombre);
    });
    mostrarMovil('perfil');
    vistaPerfil.scrollTop = 0;
  }

  function llegaBooking(nombre) {
    var hilos = $('[data-hilos]');
    var li = el('li', 't-nuevo');
    li.innerHTML = '<b></b><span></span>';
    li.querySelector('b').textContent = 'Nueva solicitud';
    li.querySelector('span').textContent = 'Booking · Quieren a ' + nombre + ' para una fecha en noviembre.';
    $$('li', hilos).forEach(function (x) { x.classList.remove('t-activo'); });
    hilos.insertBefore(li, hilos.firstChild);
    li.classList.add('t-activo');
    if (hilos.children.length > 3) hilos.removeChild(hilos.lastElementChild);
    var hilo = $('.t-pro-hilo');
    hilo.innerHTML = '';
    hilo.appendChild(el('p', 't-pro-msj', 'Hola. Vimos el perfil de ' + nombre + ' en la GuÍA y queremos programarlo en una fecha de noviembre. ¿Nos compartes condiciones y rider?'));
    if (funciones[actual].id !== 'mensajes') $('[data-cuenta]').hidden = false;
    avisar('[data-aviso-pc]', 'Nuevo mensaje: solicitud de booking para ' + nombre + '.');
  }

  // Los íconos del perfil vienen en <template data-icono> dentro de la demo.
  var ICONOS = { volver: '', verificado: '', corazon: '' };
  $$('template[data-icono]').forEach(function (t) { ICONOS[t.getAttribute('data-icono')] = t.innerHTML.trim(); });

  /* ── 4. Arranque ───────────────────────────────────────────────────── */
  ir('eventos');
  // Cuando la demo está a la vista y nadie la ha tocado, la GuÍA responde sola una vez.
  if (!quieto && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      setTimeout(function () {
        if (!tocada) preguntar('finde', '¿Qué hay este fin de semana?');
      }, 2200);
    }, { threshold: 0.4 });
    io.observe($('.t-movil'));
  }
})();
