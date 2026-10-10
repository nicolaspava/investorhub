/* La Curaduría · la demo del hero (v4, 8 oct 2026).
   Computador: La Terminal con sus diez módulos y su estado (ya, beta, próximamente).
   Teléfono: La Guía (inicio, eventos, perfiles, contenidos), la GuÍA y el perfil de un artista.
   Las pantallas están conectadas, como en la plataforma:
   - publicar un evento o un contenido en La Terminal lo muestra La Guía;
   - la frase del perfil que se edita en La Terminal cambia el perfil del teléfono;
   - pedir booking desde el perfil llega al CRM.
   Todo es local: nada sale de la página. Artistas, eventos y contenidos son reales,
   tomados de lacuraduria.net (8 oct 2026). */
// Puede haber varias demos: la completa (computador y teléfono) en La Terminal y la del teléfono solo en La Guía.
function montarDemo(demo) {
  var $ = function (s, r) { return (r || demo).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || demo).querySelectorAll(s)); };
  var quieto = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function el(tag, clase, texto) { var n = document.createElement(tag); if (clase) n.className = clase; if (texto) n.textContent = texto; return n; }
  var ICONOS = {};
  $$('template[data-icono]').forEach(function (t) { ICONOS[t.getAttribute('data-icono')] = t.innerHTML.trim(); });
  var ESTADOS = { ya: 'Ya disponible', beta: 'Beta · febrero 2027', pronto: 'Próximamente' };

  function avisar(sel, texto) {
    var a = $(sel);
    if (!a) return;
    a.textContent = texto;
    a.classList.add('t-visible');
    clearTimeout(a._t);
    a._t = setTimeout(function () { a.classList.remove('t-visible'); }, 3200);
  }
  var hayPC = !!$('[data-pc-marco]');
  if (hayPC) {
  /* ── 1. El lienzo del computador: 1000 × 640, escalado al ancho ── */
  var marco = $('[data-pc-marco]'), lienzo = $('[data-pc-lienzo]'), escala = 1;
  function escalar() {
    escala = marco.clientWidth / 1000;
    lienzo.style.transform = 'scale(' + escala + ')';
    if (ventanaAbierta) ubicarVentana();
  }

  /* ── 2. La Terminal: módulos y ventana ─────────────────────────── */
  var modulos = [
    { id: 'perfiles', estado: 'ya', titulo: 'Perfil y press kit',
      texto: 'Reúne en tu perfil fotos, bio, editorial, rider y prensa. Promotores, bookers y periodistas encuentran ahí todo para programarte y hacer contenido.',
      prueba: 'Pruébalo: cambia la frase y toca «Ver en La Guía».' },
    { id: 'eventos', estado: 'ya', titulo: 'Eventos',
      texto: 'Creas el evento una vez y aparece en la cartelera, en el mapa y en el perfil de los artistas.',
      prueba: 'Pruébalo: publica el borrador y mira el teléfono.' },
    { id: 'contenidos', estado: 'beta', titulo: 'Gestor de contenidos',
      texto: 'Publica reseñas, crónicas, sets y entrevistas, conectados con tus eventos y con los artistas protagonistas.',
      prueba: 'Pruébalo: publica la reseña y mira Contenidos en el teléfono.' },
    { id: 'seo', estado: 'beta', titulo: 'Entrenamiento SEO',
      texto: 'Lecciones cortas para que tu perfil y tus contenidos aparezcan en los buscadores, sin depender de las redes.',
      prueba: 'Pruébalo: marca las lecciones que ya hiciste.' },
    { id: 'enlace', estado: 'beta', titulo: 'ENLACE academia',
      texto: 'La ruta de formación en gestión cultural de ENLACE, dentro de La Terminal.',
      prueba: 'Pruébalo: continúa un curso.' },
    { id: 'crm', estado: 'beta', titulo: 'CRM',
      texto: 'Bookers, prensa y público en un solo lugar, no regados entre WhatsApp y el correo.',
      prueba: 'Pruébalo: pide booking desde el perfil en el teléfono.' },
    { id: 'convocatorias', estado: 'pronto', titulo: 'Convocatorias',
      texto: 'Como artista, te postulas con tu perfil y tu press kit. Como organizador, recibes postulaciones completas y eliges.',
      prueba: 'Pruébalo: postúlate y luego cambia a «Organizo».' },
    { id: 'pro', estado: 'pronto', titulo: 'Perfil PRO',
      texto: 'Más alcance para tu perfil: impulso de visibilidad en La Guía, kit de booking e insignia PRO.',
      prueba: 'Pruébalo: activa y desactiva cada opción.' },
    { id: 'cobro', estado: 'pronto', titulo: 'Cobro',
      texto: 'Vende entradas, productos y servicios desde tu perfil.',
      prueba: '' },
    { id: 'analitica', estado: 'pronto', titulo: 'Analítica',
      texto: 'Quién visita tu perfil, desde dónde y qué guarda. Los datos de esta vista son de ejemplo.',
      prueba: '' }
  ];
  var actual = 0, ventanaAbierta = true;
  var ventana = $('[data-ventana]'), punto = $('[data-punto]'), nota = $('[data-nota]');

  function ir(id, abrirVentana) {
    var i = modulos.findIndex(function (m) { return m.id === id; });
    if (i < 0) return;
    actual = i;
    var m = modulos[i];
    $$('[data-vista]').forEach(function (v) { v.hidden = v.getAttribute('data-vista') !== id; });
    $$('[data-ir]').forEach(function (b) {
      if (b.getAttribute('data-ir') === id) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    $('[data-v-estado]').textContent = ESTADOS[m.estado];
    ventana.setAttribute('data-estado', m.estado);
    $('[data-v-paso]').textContent = (i + 1) + ' / ' + modulos.length;
    $('[data-v-titulo]').textContent = m.titulo;
    $('[data-v-texto]').textContent = m.texto;
    $('[data-v-prueba]').textContent = m.prueba;
    $('[data-v-prueba]').hidden = !m.prueba;
    nota.innerHTML = '<span data-estado="' + m.estado + '">' + ESTADOS[m.estado] + '</span><b>' + m.titulo + '.</b> ' + m.texto;
    if (id === 'crm') $('[data-cuenta]').hidden = true;
    if (abrirVentana !== false) ventanaAbierta = true;
    ventana.hidden = !ventanaAbierta;
    ubicarVentana();
  }

  // Debajo del contenido de la vista; si no cabe, debajo del ancla; si no, encima.
  // Nunca sobre la franja derecha, donde se apoya el teléfono.
  function ubicarVentana() {
    var m = modulos[actual];
    var ancla = $('[data-ancla="' + m.id + '"]') || $('[data-vista="' + m.id + '"] .t-pro-cab');
    var rl = lienzo.getBoundingClientRect(), ra = ancla.getBoundingClientRect();
    if (!rl.width) return;
    var x = (ra.left - rl.left) / escala, y = (ra.top - rl.top) / escala;
    var w = ra.width / escala, h = ra.height / escala;
    punto.style.left = (x + w - 6) + 'px';
    punto.style.top = (y - 6) + 'px';
    var vw = 360, vh = ventana.offsetHeight || 220;
    var vista = $('[data-vista="' + m.id + '"]');
    var fondo = (vista.getBoundingClientRect().bottom - rl.top) / escala;
    var vx = Math.min(Math.max(x + w - vw, 240), 1000 - vw - 130), vy = fondo + 14;
    if (vy + vh > 626) vy = y + h + 14;
    if (vy + vh > 626) vy = Math.max(16, y - vh - 14);
    ventana.style.left = vx + 'px';
    ventana.style.top = vy + 'px';
  }

  $$('[data-ir]').forEach(function (b) { b.addEventListener('click', function () { ir(b.getAttribute('data-ir')); }); });
  $('[data-v-siguiente]').addEventListener('click', function () { ir(modulos[(actual + 1) % modulos.length].id); });
  $('[data-v-cerrar]').addEventListener('click', function () { cerrarVentana(); });
  punto.addEventListener('click', function () { ventanaAbierta = true; ventana.hidden = false; ubicarVentana(); });
  punto.removeAttribute('aria-hidden');
  punto.setAttribute('role', 'button');
  punto.setAttribute('tabindex', '0');
  punto.setAttribute('aria-label', 'Qué hace este módulo');
  punto.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); punto.click(); } });

  function cerrarVentana() { ventanaAbierta = false; ventana.hidden = true; }

  // Acciones de La Terminal
  demo.addEventListener('click', function (e) {
    var b = e.target.closest('[data-accion]');
    if (!b) return;
    var accion = b.getAttribute('data-accion');
    if (accion === 'crear' || accion === 'crear-contenido' || accion === 'crear-producto') avisar('[data-aviso-pc]', 'En la demo puedes publicar el borrador de la lista.');
    if (accion === 'copiar-kit') avisar('[data-aviso-pc]', 'Enlace copiado: lacuraduria.net/perfil/la-payara');
    if (accion === 'ver-perfil') { abrirPerfil('la-payara'); avisar('[data-aviso-movil]', 'Así se ve en La Guía.'); }
    if (accion === 'publicar') {
      var est = $('[data-estado]', b.closest('[data-ev-borrador]'));
      est.textContent = 'Publicado'; est.classList.add('t-pro-estado-ok');
      b.disabled = true; b.textContent = 'Publicado';
      EVENTOS_LISTA.unshift(Object.assign({ nuevo: true }, EVENTOS.edicion));
      pintarListas();
      mostrarMovil('eventos');
      avisar('[data-aviso-pc]', 'Publicado en la cartelera, el mapa y el perfil de los artistas.');
    }
    if (accion === 'publicar-contenido') {
      b.disabled = true; b.textContent = 'Publicado';
      CONTENIDOS.unshift({ titulo: '«La muerte» del Grupo TiSón', tipo: 'Reseña', img: 'co-tison.jpg', w: 480, h: 360, slug: 'la-muerte-del-grupo-tison-ozs3i5', nuevo: true });
      pintarListas();
      mostrarMovil('contenidos');
      avisar('[data-aviso-pc]', 'Publicado en Contenidos, conectado con el artista.');
    }
    if (accion === 'curso') avisar('[data-aviso-pc]', 'Los cursos de ENLACE abren como beta en febrero de 2027.');
    if (accion === 'postular') {
      b.disabled = true; b.textContent = 'Postulado';
      avisar('[data-aviso-pc]', 'Te postulaste a «' + b.closest('li').querySelector('b').textContent + '» con tu perfil y tu press kit.');
    }
    if (accion === 'seleccionar' || accion === 'pasar') {
      var t = b.closest('.t-pro-post');
      t.classList.toggle('t-elegida', accion === 'seleccionar');
      t.classList.toggle('t-pasada', accion === 'pasar');
      avisar('[data-aviso-pc]', accion === 'seleccionar' ? 'Seleccionado para la programación.' : 'Postulación archivada.');
    }
  });

  // Recursos del press kit
  $$('[data-recurso]').forEach(function (b) {
    b.addEventListener('click', function () { avisar('[data-aviso-pc]', 'Lo descargan promotores, bookers y periodistas desde tu perfil.'); });
  });

  // Entrenamiento SEO: lecciones hechas
  var lecciones = $$('[data-leccion]');
  lecciones.forEach(function (c) {
    c.addEventListener('change', function () {
      var n = lecciones.filter(function (x) { return x.checked; }).length;
      $('[data-seo-cuenta]').textContent = n + ' de ' + lecciones.length + ' lecciones';
    });
  });

  // Perfil PRO: interruptores
  $$('[data-interruptor]').forEach(function (c) {
    c.addEventListener('change', function () { avisar('[data-aviso-pc]', c.checked ? 'Activado en tu perfil.' : 'Desactivado.'); });
  });

  // CRM: filtros
  $$('[data-filtro]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filtro');
      $$('[data-filtro]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $$('[data-contactos] li').forEach(function (li) { li.hidden = f !== 'todos' && li.getAttribute('data-tipo') !== f; });
    });
  });

  // Convocatorias: como artista o como organizador
  var titulos = { aplicar: 'Convocatorias abiertas', organizar: 'Noches de electrónica' };
  $$('[data-modo]').forEach(function (b) {
    b.addEventListener('click', function () {
      var modo = b.getAttribute('data-modo');
      $$('[data-modo]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      $$('[data-panel]').forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== modo; });
      $('[data-conv-titulo]').textContent = titulos[modo];
      cerrarVentana();
    });
  });

  // La frase del perfil: lo que se escribe en La Terminal es lo que sale en La Guía
  var frase = $('[data-frase]');
  frase.addEventListener('input', function () {
    ARTISTAS['la-payara'].frase = frase.value;
    if (perfilAbierto === 'la-payara') $('[data-mp-frase]').textContent = frase.value;
  });

  } // fin de lo que solo existe con el computador

  /* ── 3. El teléfono: La Guía ───────────────────────────────────── */
  var ARTISTAS = {
    'la-payara': { nombre: 'La Payara', img: 'la-payara.jpg', w: 560, h: 300, frase: 'Psicodelia amazónica de pulso plurirrítmico.',
      bio: 'Proyecto de exploración sonora que nace de un viaje antropológico por Colombia. Lleva los saberes musicales y ancestrales a la pista, en diálogo con la cultura club. Prepara su álbum «Colombia», que sale a finales de octubre.',
      generos: ['Electrónica', 'Sonidos de raíz', 'Psicodelia'] },
    'veronica-cian': { nombre: 'Verónica Cian', img: 'veronica-cian.jpg', w: 388, h: 560, frase: 'Ambient y drone que convierten memoria, bioelectricidad y paisaje en textura.', generos: ['Ambient', 'Drone'] },
    'guaricha': { nombre: 'GUARICHA', img: 'guaricha.jpg', w: 560, h: 315, frase: 'Ritual de rock industrial bogotano.', generos: ['Rock', 'Industrial'] },
    'maria-manuela': { nombre: 'María Manuela', img: 'maria-manuela.jpg', w: 560, h: 373, frase: 'Cute dembow.', generos: ['Dembow'] },
    'cata-p': { nombre: 'Cata P', img: 'cata-p.jpg', w: 560, h: 550, frase: 'Una deriva hacia el minimal desde el house.', generos: ['House', 'Minimal'] },
    'js2600': { nombre: 'JS2600', img: 'js2600.jpg', w: 560, h: 374, frase: 'Intersecciones sonoras entre luz y oscuridad.', generos: ['Electrónica'] }
  };
  var EVENTOS = {
    nusar: { nombre: 'Nusar 3000', img: 'ev-nusar.jpg', cuando: 'Vie 9 oct · 9:00 p.m.', donde: 'GATE CLUB', slug: 'nusar-3000' },
    mir: { nombre: 'Mir Nicolas & Nico Miseria', img: 'ev-mir.jpg', cuando: 'Vie 9 oct', donde: 'Enter Enter Enter', slug: 'mir-nicolas-nico-miseria-mrnoym' },
    vuelo: { nombre: 'El Vuelo Sinfónico', img: 'ev-vuelo.jpg', cuando: 'Vie 16 oct · 8:00 p.m.', donde: 'Ojo de Tigre', slug: 'el-vuelo-sinfonico-qhk0hg' },
    colmillos: { nombre: 'Colmillos, sangre y sudor', img: 'ev-colmillos.jpg', cuando: 'Vie 23 oct · 5:00 p.m.', donde: 'A Seis Manos', slug: 'colmillos-sangre-y-sudor' },
    edicion: { nombre: 'Edición Ltda · lanzamiento EP', img: 'ev-edicion.jpg', cuando: 'Sáb 7 nov · 6:30 p.m.', donde: 'Ace of Spades', slug: 'edicion-ltda-lanzamiento-ep-gigyp4' }
  };
  var EVENTOS_LISTA = [EVENTOS.nusar, EVENTOS.mir, EVENTOS.vuelo, EVENTOS.colmillos];
  var CONTENIDOS = [
    { titulo: 'El Vuelo Sinfónico', tipo: 'Artículo', img: 'co-vuelo.jpg', w: 364, h: 480, slug: 'el-vuelo-sinfonico-zx3cbm' },
    { titulo: 'Klande Beats: el dancehall como memoria de la pista bogotana', tipo: 'Crónica sonora', img: 'co-klande.jpg', w: 457, h: 480, slug: 'klande-beats-el-dancehall-como-memoria-de-la-pista-bogotana-7bzkyc' },
    { titulo: 'Hard Trance Vol. 1 by paradoxx.raw', tipo: 'Audio', img: 'co-trance.jpg', w: 270, h: 480, slug: 'hard-trance-vol-1-by-paradoxx-raw-902ucb' }
  ];
  // Qué de La Guía ya existe: todo menos la GuÍA (el chat).
  var ESTADO_MOVIL = { inicio: 'ya', eventos: 'ya', perfiles: 'ya', contenidos: 'ya', perfil: 'ya', guia: 'pronto' };

  var chip = $('[data-mv-chip]'), vistaPerfil = $('[data-movil="perfil"]'), perfilAbierto = null;
  function mostrarMovil(cual) {
    $$('[data-movil]').forEach(function (s) { s.hidden = s.getAttribute('data-movil') !== cual; });
    $$('.t-mv-tabs [data-mv-ir]').forEach(function (b) {
      var es = b.getAttribute('data-mv-ir') === cual || (cual === 'guia' && b.getAttribute('data-mv-ir') === 'inicio');
      if (es) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    var e = ESTADO_MOVIL[cual];
    chip.textContent = ESTADOS[e];
    chip.setAttribute('data-estado', e);
    if (cual !== 'perfil') perfilAbierto = null;
    var s = $('[data-movil="' + cual + '"] .t-mv-scroll');
    if (s) s.scrollTop = 0;
  }
  $$('[data-mv-ir]').forEach(function (b) { b.addEventListener('click', function () { mostrarMovil(b.getAttribute('data-mv-ir')); }); });
  $('[data-abrir-guia]').addEventListener('click', function () { mostrarMovil('guia'); });

  function tarjetaEvento(ev) {
    var t = el('a', 't-mv-tarjeta' + (ev.nuevo ? ' t-mv-nuevo' : ''));
    t.href = 'https://lacuraduria.net/evento/' + ev.slug; t.target = '_blank'; t.rel = 'noopener';
    t.innerHTML = '<img src="/img/demo/' + ev.img + '" alt="" width="320" height="420"><span><small style="--c: var(--p-coral);">' + (ev.nuevo ? 'Nuevo · Evento' : 'Evento') + '</small><b></b><em></em></span>';
    t.querySelector('b').textContent = ev.nombre;
    t.querySelector('em').textContent = ev.cuando + ' · ' + ev.donde;
    return t;
  }
  function tarjetaArtista(id) {
    var a = ARTISTAS[id];
    var b = el('button', 't-mv-tarjeta'); b.type = 'button';
    b.innerHTML = '<img src="/img/demo/' + a.img + '" alt="" width="' + a.w + '" height="' + a.h + '"><span><small style="--c: var(--p-cyan);">Artista</small><b></b><em></em></span>';
    b.querySelector('b').textContent = a.nombre;
    b.querySelector('em').textContent = a.frase;
    b.addEventListener('click', function () { abrirPerfil(id); });
    return b;
  }
  function pintarListas() {
    var semana = $('[data-mv-semana]'); semana.innerHTML = '';
    EVENTOS_LISTA.slice(0, 3).forEach(function (ev) {
      var c = el('a', 't-mv-cartel'); c.href = 'https://lacuraduria.net/evento/' + ev.slug; c.target = '_blank'; c.rel = 'noopener';
      c.innerHTML = '<img src="/img/demo/' + ev.img + '" alt="" width="320" height="420"><b></b><small></small>';
      c.querySelector('b').textContent = ev.nombre; c.querySelector('small').textContent = ev.cuando;
      semana.appendChild(c);
    });
    var lista = $('[data-mv-eventos]'); lista.innerHTML = '';
    EVENTOS_LISTA.forEach(function (ev) { lista.appendChild(tarjetaEvento(ev)); });
    var cont = $('[data-mv-contenidos]'); cont.innerHTML = '';
    CONTENIDOS.forEach(function (c) {
      var t = el('a', 't-mv-tarjeta' + (c.nuevo ? ' t-mv-nuevo' : ''));
      t.href = 'https://lacuraduria.net/contenido/' + c.slug; t.target = '_blank'; t.rel = 'noopener';
      t.innerHTML = '<img src="/img/demo/' + c.img + '" alt="" width="' + c.w + '" height="' + c.h + '"><span><small style="--c: var(--p-green);"></small><b></b></span>';
      t.querySelector('small').textContent = c.nuevo ? 'Nuevo · ' + c.tipo : c.tipo;
      t.querySelector('b').textContent = c.titulo;
      cont.appendChild(t);
    });
  }
  (function pintarArtistas() {
    var rej = $('[data-mv-perfiles]'), av = $('[data-mv-avatares]');
    Object.keys(ARTISTAS).forEach(function (id) {
      var a = ARTISTAS[id];
      ['t-mv-ficha', 't-mv-avatar-btn'].forEach(function (clase, k) {
        var b = el('button', clase); b.type = 'button';
        b.innerHTML = '<img src="/img/demo/' + a.img + '" alt="" width="' + a.w + '" height="' + a.h + '"><b></b>';
        b.querySelector('b').textContent = a.nombre;
        b.addEventListener('click', function () { abrirPerfil(id); });
        (k ? av : rej).appendChild(b);
      });
    });
  })();
  pintarListas();

  // La GuÍA (próximamente): responde a las sugerencias
  var RESPUESTAS = {
    finde: ['Este fin de semana en Bogotá:', [{ ev: 'nusar' }, { ev: 'mir' }]],
    artistas: ['Por lo que te gusta, te pueden interesar:', [{ a: 'la-payara' }, { a: 'veronica-cian' }, { a: 'guaricha' }]],
    escuchar: ['La Payara lanza su álbum «Colombia» a finales de octubre. Y si te gusta lo ambiental, Verónica Cian:', [{ a: 'la-payara' }, { a: 'veronica-cian' }]]
  };
  var msgs = $('[data-msgs]'), sug = $('[data-sug]'), form = $('[data-form]'), entrada = $('[data-pregunta]'), ocupada = false;
  function bajar() { msgs.scrollTo({ top: msgs.scrollHeight, behavior: quieto ? 'auto' : 'smooth' }); }
  function responder(texto, items) {
    var esc = el('p', 't-mv-burbuja t-mv-escribe'); esc.innerHTML = '<i></i><i></i><i></i>';
    msgs.appendChild(esc); bajar(); ocupada = true;
    setTimeout(function () {
      esc.remove();
      var r = el('div', 't-mv-resp');
      r.appendChild(el('p', 't-mv-burbuja', texto));
      (items || []).forEach(function (it) { r.appendChild(it.a ? tarjetaArtista(it.a) : tarjetaEvento(EVENTOS[it.ev])); });
      msgs.appendChild(r); bajar(); ocupada = false;
    }, quieto ? 150 : 900);
  }
  function preguntar(clave, texto) {
    if (ocupada) return;
    msgs.appendChild(el('p', 't-mv-burbuja t-mv-yo', texto)); bajar();
    var r = RESPUESTAS[clave];
    if (r) responder(r[0], r[1]);
    else responder('En esta demo respondo a las sugerencias de abajo. Cuando salga, la GuÍA buscará en toda la cartelera, el directorio y los contenidos.');
  }
  function adivinar(t) {
    t = t.toLowerCase();
    if (/fin de semana|finde|hoy|evento|plan|fiesta|concierto|salir/.test(t)) return 'finde';
    if (/artista|banda|dj|recomi|conocer|quién|quien/.test(t)) return 'artistas';
    if (/escuchar|música|musica|set|álbum|album|sonido/.test(t)) return 'escuchar';
    return null;
  }
  sug.addEventListener('click', function (e) { var b = e.target.closest('[data-preg]'); if (b) preguntar(b.getAttribute('data-preg'), b.textContent); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var t = entrada.value.trim(); if (!t) return;
    entrada.value = ''; preguntar(adivinar(t), t);
  });

  // El perfil del artista
  function abrirPerfil(id) {
    var a = ARTISTAS[id];
    vistaPerfil.innerHTML =
      '<div class="t-mp-portada"><img src="/img/demo/' + a.img + '" alt="" width="' + a.w + '" height="' + a.h + '"></div>' +
      '<div class="t-mp-cuerpo">' +
      '<p class="t-mp-tipo"><span class="t-tipo" style="--c: var(--p-cyan);" aria-hidden="true"></span>Artista · Bogotá</p>' +
      '<h4 class="t-mp-nombre"><span data-mp-nombre></span>' + ICONOS.verificado + '</h4>' +
      '<p class="t-mp-frase" data-mp-frase></p>' +
      '<div class="t-mp-acc"><button type="button" class="t-mp-btn" data-seguir aria-pressed="false">' + ICONOS.corazon + ' Guardar</button><button type="button" class="t-mp-btn t-mp-btn-pri" data-booking>Pedir booking <em>Beta</em></button></div>' +
      '<h5 class="t-mp-sub">Press kit</h5>' +
      '<div class="t-mp-kit"><span>' + ICONOS.fotos + 'Fotos</span><span>' + ICONOS.bio + 'Bio</span><span>' + ICONOS.rider + 'Rider</span><span>' + ICONOS.prensa + 'Prensa</span></div>' +
      '<button type="button" class="t-mp-btn t-mp-descargar" data-descargar>' + ICONOS.descargar + ' Descargar press kit</button>' +
      (a.bio ? '<h5 class="t-mp-sub">Sobre el proyecto</h5><p class="t-mp-bio" data-mp-bio></p>' : '') +
      '<p class="t-mp-generos">' + a.generos.map(function (g) { return '<i>' + g + '</i>'; }).join('') + '</p>' +
      '</div>';
    $('[data-mp-nombre]').textContent = a.nombre;
    $('[data-mp-frase]').textContent = a.frase;
    if (a.bio) $('[data-mp-bio]').textContent = a.bio;
    var guardar = $('[data-seguir]');
    guardar.addEventListener('click', function () {
      var si = guardar.getAttribute('aria-pressed') !== 'true';
      guardar.setAttribute('aria-pressed', si ? 'true' : 'false');
      guardar.lastChild.textContent = si ? ' Guardado' : ' Guardar';
      if (si) avisar('[data-aviso-movil]', 'Guardado en tu ruta cultural.');
    });
    $('[data-descargar]').addEventListener('click', function () { avisar('[data-aviso-movil]', 'Fotos, bio, rider y prensa, listos para tu nota o tu cartel.'); });
    $('[data-booking]').addEventListener('click', function (e) {
      var b = e.currentTarget; b.disabled = true; b.textContent = 'Solicitud enviada';
      avisar('[data-aviso-movil]', 'Le llega a su CRM, en La Terminal.');
      llegaBooking(a.nombre);
    });
    mostrarMovil('perfil');
    perfilAbierto = id;
    vistaPerfil.scrollTop = 0;
  }

  function llegaBooking(nombre) {
    if (!hayPC) return;
    var lista = $('[data-contactos]');
    var li = el('li', 't-nuevo'); li.setAttribute('data-tipo', 'booker');
    li.innerHTML = '<b>Nueva solicitud</b><i style="--c: var(--p-coral);">Booker</i><span></span><small>Ahora</small>';
    li.querySelector('span').textContent = 'Quieren a ' + nombre + ' para una fecha en noviembre.';
    lista.insertBefore(li, lista.firstChild);
    if (modulos[actual].id !== 'crm') $('[data-cuenta]').hidden = false;
    avisar('[data-aviso-pc]', 'Nuevo contacto en el CRM: solicitud de booking para ' + nombre + '.');
  }

  /* ── 4. Arranque ───────────────────────────────────────────────── */
  if (hayPC) {
    if ('ResizeObserver' in window) new ResizeObserver(escalar).observe(marco);
    else window.addEventListener('resize', escalar);
    escalar();
    ir('perfiles');
    // Para que otras secciones de la página abran un módulo: lcDemo.ir('crm')
    window.lcDemo = { ir: function (id) { ir(id); } };
  }
  mostrarMovil('inicio');
}
document.querySelectorAll('[data-demo]').forEach(montarDemo);
