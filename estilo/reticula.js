/* La Curaduría · landing «La retícula»: tema, menú, filtros de funciones y aparición al bajar.
   Sin dependencias. Si este archivo no carga, la página se lee completa igual. */
(function () {
  var raiz = document.documentElement;

  // 1. Tema oscuro / claro. Se guarda en este navegador con la misma llave de lacuraduria.net.
  var botonTema = document.getElementById('tema');
  if (botonTema) {
    botonTema.addEventListener('click', function () {
      var claro = raiz.getAttribute('data-tema') !== 'claro';
      raiz.setAttribute('data-tema', claro ? 'claro' : 'oscuro');
      try { localStorage.setItem('lc-tema', claro ? 'claro' : 'oscuro'); } catch (e) {}
    });
  }

  // 2. Menú en pantallas angostas.
  var barra = document.getElementById('barra');
  var botonMenu = document.getElementById('menu-boton');
  var cerrarMenu = function () {
    barra.classList.remove('abierta');
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.textContent = '≡';
  };
  if (barra && botonMenu) {
    botonMenu.addEventListener('click', function () {
      var abrir = !barra.classList.contains('abierta');
      if (!abrir) return cerrarMenu();
      barra.classList.add('abierta');
      botonMenu.setAttribute('aria-expanded', 'true');
      botonMenu.textContent = '×';
    });
    barra.querySelectorAll('.barra-nav a').forEach(function (a) { a.addEventListener('click', cerrarMenu); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') cerrarMenu(); });
  }

  // 3. Filtros de «Todas las funciones».
  var filtros = document.getElementById('filtros');
  var tabla = document.getElementById('tabla');
  if (filtros && tabla) {
    var filas = Array.prototype.slice.call(tabla.querySelectorAll('tbody tr'));
    var cuenta = document.getElementById('cuenta');
    var vacio = document.getElementById('vacio');
    var elegido = { para: 'todos', estado: 'todos' };
    var pintar = function () {
      var visibles = 0;
      filas.forEach(function (f) {
        var ok = (elegido.para === 'todos' || f.getAttribute('data-para') === elegido.para) &&
                 (elegido.estado === 'todos' || f.getAttribute('data-estado') === elegido.estado);
        f.hidden = !ok;
        if (ok) visibles++;
      });
      if (cuenta) cuenta.textContent = visibles + (visibles === 1 ? ' función' : ' funciones');
      if (vacio) vacio.hidden = visibles > 0;
      tabla.hidden = visibles === 0;
    };
    filtros.addEventListener('click', function (ev) {
      var chip = ev.target.closest('.chip');
      if (!chip) return;
      var grupo = chip.hasAttribute('data-para') ? 'para' : 'estado';
      elegido[grupo] = chip.getAttribute('data-' + grupo);
      filtros.querySelectorAll('[data-' + grupo + ']').forEach(function (c) {
        c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
      });
      pintar();
      if (window.lcEvento) window.lcEvento('filtro_funciones', { para: elegido.para, estado: elegido.estado });
    });
    pintar();
  }

  var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 4. Sonar escribe preguntas de ejemplo en la ventana del hero.
  var sonar = document.getElementById('sonar-texto');
  if (sonar && !quieto) {
    var frases = [
      'Un plan con música en vivo en Chapinero',
      '¿Dónde hay una exposición este fin de semana?',
      'Algo tranquilo para un domingo',
      'Una fiesta de house para el viernes'
    ];
    var n = 0, i = sonar.textContent.length, borrando = true;
    var paso = function () {
      var frase = frases[n];
      if (borrando) {
        i--;
        if (i <= 0) { borrando = false; n = (n + 1) % frases.length; }
      } else {
        i++;
        if (i >= frases[n].length) { borrando = true; sonar.textContent = frases[n]; return setTimeout(paso, 2600); }
      }
      sonar.textContent = (borrando ? frase : frases[n]).slice(0, Math.max(i, 0));
      setTimeout(paso, borrando ? 22 : 48);
    };
    setTimeout(paso, 2600);
  }

  // 5. Aparición al bajar.
  var piezas = document.querySelectorAll('.aparece');
  if (quieto || !('IntersectionObserver' in window)) {
    piezas.forEach(function (p) { p.classList.add('visto'); });
  } else {
    var ojo = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visto'); ojo.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    piezas.forEach(function (p) { ojo.observe(p); });
  }

  if (window.lcVista) window.lcVista('landing-reticula');
})();
