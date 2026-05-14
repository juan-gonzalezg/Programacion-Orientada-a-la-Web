/**
 * Banca 360 - Menú Lateral Dinámico
 * Se inyecta en todas las páginas para no repetir código HTML.
 */

(() => {
    const aside = document.getElementById('main-sidebar');
    if (!aside) return; 

    const paginaActual = document.body.getAttribute('data-current-nav') || 'dashboard';

    const marcarActivo = (nombrePagina) => {
        if (paginaActual === nombrePagina) {
            return 'nav-item active';
        } else {
            return 'nav-item';
        }
    };

    aside.innerHTML = `
        <div class="brand-logo">
            <span class="logo-icon" aria-hidden="true">🏦</span>
            <span class="logo-text">Banca 360</span>
        </div>
        <nav class="main-nav" aria-label="Navegación Principal">
            <ul class="nav-links">
                <li>
                    <a href="dashboard_resumen.html" class="${marcarActivo('dashboard')}">
                        <span class="nav-icon" aria-hidden="true">🏠</span><span class="nav-text">Resumen</span>
                    </a>
                </li>
                <li>
                    <a href="historial_movimientos.html" class="${marcarActivo('historial')}">
                        <span class="nav-icon" aria-hidden="true">📋</span><span class="nav-text">Historial</span>
                    </a>
                </li>
                <li>
                    <a href="HTML_transferencia.html" class="${marcarActivo('transferir')}">
                        <span class="nav-icon" aria-hidden="true">💸</span><span class="nav-text">Transferir</span>
                    </a>
                </li>
                <li>
                    <a href="HTML_pago_rapido.html" class="${marcarActivo('pago rapido')}">
                        <span class="nav-icon" aria-hidden="true">⚡</span><span class="nav-text">Pago rápido</span>
                    </a>
                </li>
                <li>
                    <!-- 📍 CORRECCIÓN: El archivo se llama depositos.html, no HTML_depositos.html -->
                    <a href="depositos.html" class="${marcarActivo('depositos')}">
                        <span class="nav-icon" aria-hidden="true">📈</span><span class="nav-text">Depósitos</span>
                    </a>
                </li>
                <li>
                    <a href="perfil_configuracion.html" class="${marcarActivo('perfil')}">
                        <span class="nav-icon" aria-hidden="true">👤</span><span class="nav-text">Perfil</span>
                    </a>
                </li>
            </ul>
        </nav>
        <div class="sidebar-footer">
            <button type="button" id="toggle-theme-btn" class="btn-outline">
                <span id="theme-icon" aria-hidden="true">🌓</span> <span id="theme-text">Modo Oscuro</span>
            </button>
            <button type="button" id="logout-btn" class="btn-outline btn-logout">Cerrar Sesión</button>
        </div>
    `;
})();