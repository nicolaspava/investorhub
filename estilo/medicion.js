/* La Curaduría · medición del embudo (backlog US-13).
   1. Guarda de dónde llegó la visita (UTM y gclid de Google Ads) la primera vez, y lo conserva
      hasta el registro o la compra: lcOrigen() lo devuelve como texto para mandarlo con el pago o el contacto.
   2. lcEvento(nombre, datos) manda el evento a Google Analytics 4 / Google Ads si están configurados
      (las etiquetas <meta name="lc-ga4"> y <meta name="lc-ads"> en index.html) y siempre a window.dataLayer.
   3. Eventos automáticos: landing_view (cada pantalla), cta_click (botones con data-evento),
      purchase_founders (al volver de Mercado Pago con el pago aprobado, una sola vez por pago).
   Visitas de prueba: abrir el sitio con ?prueba=1 marca este navegador como de prueba y no cuenta. */
(function () {
  var guardar = function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} };
  var leer = function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } };
  var q = new URLSearchParams(location.search);

  if (q.get('prueba') === '1') guardar('lc_prueba', '1');
  if (q.get('prueba') === '0') guardar('lc_prueba', '');
  var esPrueba = leer('lc_prueba') === '1';

  // 1. Origen: primer contacto (no se pisa) y último contacto con campaña.
  var campos = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];
  var ahora = campos.filter(function (c) { return q.get(c); }).map(function (c) { return c + '=' + q.get(c).slice(0, 80); }).join('&');
  if (ahora) { if (!leer('lc_origen_primero')) guardar('lc_origen_primero', ahora); guardar('lc_origen_ultimo', ahora); }
  if (!leer('lc_origen_primero') && document.referrer && document.referrer.indexOf(location.host) < 0) {
    guardar('lc_origen_primero', 'referencia=' + document.referrer.slice(0, 120));
  }
  window.lcOrigen = function () {
    var p = leer('lc_origen_primero') || 'directo', u = leer('lc_origen_ultimo');
    return (u && u !== p ? 'ultimo: ' + u + ' | primero: ' : '') + p + (esPrueba ? ' | PRUEBA' : '');
  };

  // 2. Envío de eventos
  window.dataLayer = window.dataLayer || [];
  var meta = function (n) { var m = document.querySelector('meta[name="' + n + '"]'); return m && m.content.trim(); };
  var ga4 = meta('lc-ga4'), ads = meta('lc-ads');   // ads: «AW-123456789/etiqueta-de-conversion»
  if (!esPrueba && (ga4 || ads)) {
    window.gtag = function () { window.dataLayer.push(arguments); };
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4 || ads.split('/')[0]);
    document.head.appendChild(s);
    gtag('js', new Date());
    if (ga4) gtag('config', ga4, { send_page_view: false });
    if (ads) gtag('config', ads.split('/')[0]);
  }
  window.lcEvento = function (nombre, datos) {
    datos = datos || {};
    if (esPrueba) { datos.prueba = true; }
    window.dataLayer.push(Object.assign({ event: nombre }, datos));
    if (window.gtag && !esPrueba) {
      gtag('event', nombre, datos);
      // Las compras también cuentan como conversión de Google Ads
      if (ads && nombre === 'purchase_founders') gtag('event', 'conversion', { send_to: ads, value: datos.value, currency: 'COP', transaction_id: datos.transaction_id });
    }
  };

  // 3. Automáticos
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest && ev.target.closest('[data-evento]');
    if (el) window.lcEvento(el.getAttribute('data-evento'), { texto: (el.textContent || '').trim().slice(0, 60), pantalla: location.pathname + location.hash });
  }, true);
  window.lcVista = function (pantalla) { window.lcEvento('landing_view', { pantalla: pantalla }); };

  if (q.get('pago') === 'ok') {
    var id = q.get('payment_id') || q.get('collection_id') || '';
    var hechos = leer('lc_compras') || '';
    if (id && hechos.indexOf(id) < 0 && (q.get('status') || q.get('collection_status')) === 'approved') {
      guardar('lc_compras', hechos + ',' + id);
      window.lcEvento('purchase_founders', { transaction_id: id, value: 100000, currency: 'COP' });
    }
  }
})();
