/**
 * Banca 360 — Cabecera común.
 * Se encarga ÚNICAMENTE de la persistencia del tema (Modo Oscuro/Claro)
 * y de evitar el parpadeo blanco (FOUC).
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

    // Oculta la página un instante hasta que cargue el CSS
    var antiFoucStyle = document.createElement('style');
    antiFoucStyle.innerHTML = 'html { opacity: 0; transition: opacity 0.3s ease-in-out; background-color: var(--bg-body, #F8FAFC); }';
    document.head.appendChild(antiFoucStyle);

    // Muestra la página una vez el DOM y el CSS están listos
    window.addEventListener('load', function() {
        html.style.opacity = '1';
    });
})();