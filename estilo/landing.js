/* La Curaduría · landing «Cartel nocturno». Tres cosas, ninguna escucha el scroll:
   1. Revelado: .t-rv y el chat (.t-chat) reciben .t-dentro al entrar en pantalla.
   2. Logo de la barra: aparece cuando el del hero sale de la pantalla.
   3. Pestañas «Para quién», con teclado (flechas, Inicio, Fin). */
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
    var marca = document.querySelector('.t-hero-marca');
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
