/**
 * Banca 360 — Cabecera común (mismo patrón que sidebar.js).
 * Cada página deja en <head> solo charset + este script; el resto se inyecta aquí.
 * Título: atributo data-page-title en <html> (ej. data-page-title="Banca 360 - Dashboard").
 * Tema: js/theme-persist.js (cargar antes) + read() antes de enlazar CSS (FOUC).
 */
(function () {
    var html = document.documentElement;
    var pref = typeof window.Banca360Theme !== 'undefined' ? window.Banca360Theme.read() : null;

    if (pref === 'dark') {
        html.setAttribute('data-theme', 'dark');
    } else if (pref === 'light') {
        html.setAttribute('data-theme', 'light');
    }

    if ((pref === 'dark' || pref === 'light') && typeof window.Banca360Theme !== 'undefined') {
        window.Banca360Theme.write(pref);
    }

    function appendToHead(node) {
        document.head.appendChild(node);
    }

    var viewport = document.createElement('meta');
    viewport.setAttribute('name', 'viewport');
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    appendToHead(viewport);

    var titleText = html.getAttribute('data-page-title') || 'Banca 360';
    var titleEl = document.createElement('title');
    titleEl.textContent = titleText;
    appendToHead(titleEl);

    var preGoogle = document.createElement('link');
    preGoogle.rel = 'preconnect';
    preGoogle.href = 'https://fonts.googleapis.com';
    appendToHead(preGoogle);

    var preGstatic = document.createElement('link');
    preGstatic.rel = 'preconnect';
    preGstatic.href = 'https://fonts.gstatic.com';
    preGstatic.setAttribute('crossorigin', 'anonymous');
    appendToHead(preGstatic);

    var fontCss = document.createElement('link');
    fontCss.rel = 'stylesheet';
    fontCss.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    appendToHead(fontCss);

    var appCss = document.createElement('link');
    appCss.rel = 'stylesheet';
    appCss.href = 'css/style_p2.css';
    appendToHead(appCss);
})();
