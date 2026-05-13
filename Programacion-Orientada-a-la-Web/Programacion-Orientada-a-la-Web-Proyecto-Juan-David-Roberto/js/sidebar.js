/**
 * Banca 360 — Sidebar compartido (multipágina, vanilla JS).
 * Cada página indica la sección activa con data-current-nav en <body>.
 * Valores: dashboard | historial | detalle | transferir | perfil
 * (detalle resalta Historial, coherente con el flujo desde el listado).
 */


(function () {      //busca en el archivo que va a cargar el elemento con id "main-sidebar" para reemplazarlo
    var aside = document.getElementById('main-sidebar');
    if (!aside) return;

        //revisa que exista el body del documento, y extrae el atributo del body
    var raw = (document.body && document.body.getAttribute('data-current-nav')) || '';
   //si no existe se decide que estas en dashboard
    var current = raw.trim().toLowerCase() || 'dashboard';

    var activeDashboard = current === 'dashboard';  
    var activeHistorial = current === 'historial' || current === 'detalle';
    var activeTransfer = current === 'transferir';
    
    var activePagorapido = current === 'Pagorapido';
    var activeDeposito = current === 'Desposito';

    var activePerfil = current === 'perfil';

    function navClass(isActive) {
        return 'nav-item' + (isActive ? ' active' : '');
    }

    aside.innerHTML =
        '<div class="brand-logo">' +
        '<span class="logo-icon" aria-hidden="true">🏦</span>' +
        '<span class="logo-text">Banca 360</span>' +
        '</div>' +
        '<nav class="main-nav" aria-label="Navegación Principal">' +
        '<ul class="nav-links">' +
        '<li><a href="dashboard_resumen.html" class="' + navClass(activeDashboard) + '" id="link-dashboard">' +
        '<span class="nav-icon" aria-hidden="true">🏠</span><span class="nav-text">Resumen</span></a></li>' +
        '<li><a href="historial_movimientos.html" class="' + navClass(activeHistorial) + '" id="link-history">' +
        '<span class="nav-icon" aria-hidden="true">📋</span><span class="nav-text">Historial</span></a></li>' +
        '<li><a href="HTML_transferencia.html" class="' + navClass(activeTransfer) + '" id="link-transfers">' +
        '<span class="nav-icon" aria-hidden="true">💸</span><span class="nav-text">Transferir</span></a></li>' +


        '<li><a href="HTML_pago_rapido.html" class="' + navClass(activePagorapido) + '" id="link-pagorapido">' +
        '<span class="nav-icon" aria-hidden="true">⚡</span><span class="nav-text">Pago rapido</span></a></li>' +
        '<li><a href="HTML_transferencia.html" class="' + navClass(activeDeposito) + '" id="link-deposito">' +
        '<span class="nav-icon" aria-hidden="true"> 📈 </span><span class="nav-text">Depositos</span></a></li>' +
        
        '<li><a href="#profile-view" class="' + navClass(activePerfil) + '" id="link-profile">' +
        '<span class="nav-icon" aria-hidden="true">👤</span><span class="nav-text">Perfil</span></a></li>'+
        
        
        '</ul></nav>' +
        '<div class="sidebar-footer">' +
        '<button type="button" id="toggle-theme-btn" class="btn-outline">' +
        '<span aria-hidden="true">🌓</span> Modo Oscuro</button>' +
        '<button type="button" id="logout-btn" class="btn-outline btn-logout">Cerrar Sesión</button>' +
        '</div>';
})();
