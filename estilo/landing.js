/* La Curaduría · landing «Cartel nocturno». Tres cosas, ninguna escucha el scroll:
   1. Revelado: .t-rv y el chat (.t-chat) reciben .t-dentro al entrar en pantalla.
   2. Logo de la barra: aparece cuando el del hero sale de la pantalla.
   3. Pestañas «Para quién», con teclado (flechas, Inicio, Fin).
   4. El teléfono de Catálogo Q: lacuraduria.net con capturas reales que se recorren. */
(function () {
  var raiz = document.documentElement;

  // 1. Revelado
  if ('IntersectionObserver' in window) {
    var revelar = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('t-dentro'); revelar.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.t-rv, .t-chat').forEach(function (el) { revelar.observe(el); });

    // 2. Logo de la barra
    var marca = document.querySelector('.t-portada-titulo, .t-hero-marca');
    if (marca) {
      new IntersectionObserver(function (entradas) {
        raiz.classList.toggle('t-marca-visible', !entradas[0].isIntersecting);
      }, { rootMargin: '-64px 0px 0px 0px' }).observe(marca);
    } else {
      raiz.classList.add('t-marca-visible');
    }
  } else {
    document.querySelectorAll('.t-rv, .t-chat').forEach(function (el) { el.classList.add('t-dentro'); });
    raiz.classList.add('t-marca-visible');
  }

  // 3. Pestañas
  var lista = document.querySelector('[data-t-pestanas]');
  if (!lista) return;
  var pestanas = Array.prototype.slice.call(lista.querySelectorAll('[role="tab"]'));
  function elegir(p, enfocar) {
    pestanas.forEach(function (x) {
      var activa = x === p;
      x.setAttribute('aria-selected', activa ? 'true' : 'false');
      x.tabIndex = activa ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !activa;
    });
    if (enfocar) p.focus();
  }
  pestanas.forEach(function (p, i) {
    p.addEventListener('click', function () { elegir(p, false); });
    p.addEventListener('keydown', function (ev) {
      var n = pestanas.length, destino = null;
      if (ev.key === 'ArrowRight') destino = pestanas[(i + 1) % n];
      else if (ev.key === 'ArrowLeft') destino = pestanas[(i - 1 + n) % n];
      else if (ev.key === 'Home') destino = pestanas[0];
      else if (ev.key === 'End') destino = pestanas[n - 1];
      if (destino) { ev.preventDefault(); elegir(destino, true); }
    });
  });
})();

// 4. El teléfono de Catálogo Q: capturas reales de lacuraduria.net que se recorren con scroll.
//    Las pestañas (abajo en el teléfono y debajo de él) cambian de página; tocar la pantalla abre
//    la misma página en el sitio real. No es un iframe porque el sitio no deja mostrarse en otra página.
(function () {
  var tel = document.querySelector('[data-guia-tel]');
  if (!tel) return;
  var PAGINAS = {
    inicio: { img: 'guia-inicio.jpg', alto: 5064, url: 'https://lacuraduria.net/', nombre: 'Inicio' },
    eventos: { img: 'guia-eventos.jpg', alto: 5064, url: 'https://lacuraduria.net/eventos', nombre: 'Eventos' },
    perfiles: { img: 'guia-perfiles.jpg', alto: 5064, url: 'https://lacuraduria.net/perfiles', nombre: 'Páginas' },
    contenidos: { img: 'guia-contenidos.jpg', alto: 3970, url: 'https://lacuraduria.net/contenidos', nombre: 'Publicaciones' }
  };
  var vivo = tel.querySelector('[data-vivo]');
  var pie = tel.querySelector('[data-vivo-pie]');
  var paginas = tel.querySelector('.t-vivo-paginas');
  var demo = tel.querySelector('[data-demo]');
  var scroll = tel.querySelector('[data-vivo-scroll]');
  var img = tel.querySelector('[data-vivo-img]');
  var enlace = tel.querySelector('[data-vivo-enlace]');

  function ir(cual) {
    var pg = PAGINAS[cual];
    if (!pg) return;
    img.src = '/img/producto/' + pg.img;
    img.height = pg.alto;
    img.alt = pg.nombre + ' de lacuraduria.net';
    enlace.href = pg.url;
    scroll.scrollTop = 0;
    paginas.querySelectorAll('[data-vivo-ir]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-vivo-ir') === cual ? 'true' : 'false');
    });
  }
  tel.querySelectorAll('[data-vivo-ir]').forEach(function (b) {
    b.addEventListener('click', function () { ir(b.getAttribute('data-vivo-ir')); });
  });
  // Se cargan por adelantado las otras páginas, cuando el teléfono ya se ve
  setTimeout(function () { Object.keys(PAGINAS).forEach(function (k) { new Image().src = '/img/producto/' + PAGINAS[k].img; }); }, 2500);

  var botones = tel.querySelectorAll('[data-guia-ver]');
  function ver(cual) {
    var enVivo = cual !== 'guia';
    vivo.hidden = paginas.hidden = pie.hidden = !enVivo;
    demo.hidden = enVivo;
    if (!enVivo && demo.lcGuion) demo.lcGuion();
    botones.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-guia-ver') === cual ? 'true' : 'false'); });
  }
  botones.forEach(function (b) { b.addEventListener('click', function () { ver(b.getAttribute('data-guia-ver')); }); });
  window.lcGuiaVer = ver;
})();

// 5. «Esta semana» como carrusel en movimiento (se duplican las tarjetas para que gire sin cortes).
//    Se detiene al pasar el cursor o al tocar, y no se mueve si la persona pidió menos movimiento.
(function () {
  document.querySelectorAll('[data-carrusel]').forEach(function (c) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var pista = document.createElement('div'); pista.className = 't-carrusel-pista';
    while (c.firstChild) pista.appendChild(c.firstChild);
    Array.prototype.slice.call(pista.children).forEach(function (n) { var k = n.cloneNode(true); k.setAttribute('aria-hidden', 'true'); k.tabIndex = -1; pista.appendChild(k); });
    c.appendChild(pista); c.classList.add('t-carrusel-activo');
  });
})();

// 6. Calculadora de retorno en una ventana.
(function () {
  var d = document.querySelector('[data-roi-dialogo]'), b = document.querySelector('[data-abrir-roi]');
  if (!d || !b) return;
  b.addEventListener('click', function () { if (d.showModal) d.showModal(); else d.setAttribute('open', ''); });
  d.querySelector('[data-cerrar-roi]').addEventListener('click', function () { d.close ? d.close() : d.removeAttribute('open'); });
  d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
})();
