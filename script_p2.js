/**
 * ============================================================================
 * BANCA 360 - CONTROLADOR PRINCIPAL (JavaScript Puro)
 * Proyecto 1 - Programación Orientada a la Web (UCAB)
 * ============================================================================
 * NOTA PARA LA DEFENSA: Al ser una arquitectura de múltiples archivos (MPA),
 * usamos condicionales (if) para ejecutar solo el código correspondiente a la 
 * página en la que el usuario se encuentra actualmente.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================================
       1. BASE DE DATOS SIMULADA Y PERSISTENCIA (Mock Data + LocalStorage)
       ============================================================================ */
    // 1. Definimos los datos iniciales "quemados" (Por si es la primera vez que entran)
    const transaccionesIniciales = [
        { id: 'REF-893421', tipo: 'out', categoria: 'pago-movil', concepto: 'Pago Móvil a Farmatodo', fecha: '10/05/2026 10:45 AM', monto: 450.00, bancoDestino: 'Banesco', estado: 'Operación Exitosa' },
        { id: 'REF-102938', tipo: 'in', categoria: 'transfer', concepto: 'Transferencia de Nómina', fecha: '09/05/2026 03:20 PM', monto: 3200.00, bancoDestino: 'Mercantil', estado: 'Operación Exitosa' },
        { id: 'REF-992837', tipo: 'out', categoria: 'card', concepto: 'Suscripción Netflix', fecha: '08/05/2026 08:00 AM', monto: 180.00, bancoDestino: 'Tarjeta Visa *4567', estado: 'Operación Exitosa' },
        { id: 'REF-554433', tipo: 'in', categoria: 'transfer', concepto: 'Pago por servicios freelance', fecha: '05/05/2026 11:15 AM', monto: 850.00, bancoDestino: 'Mercantil', estado: 'Operación Exitosa' },
        { id: 'REF-112233', tipo: 'out', categoria: 'pago-movil', concepto: 'Pago Móvil a Panadería', fecha: '04/05/2026 06:30 PM', monto: 120.00, bancoDestino: 'Provincial', estado: 'Operación Exitosa' }
    ];

    const saldoInicial = 4500.00;

    // 2. MAGIA DE PERSISTENCIA: Intentamos leer del localStorage
    let transacciones = JSON.parse(localStorage.getItem('bd_transacciones'));
    let saldoActual = parseFloat(localStorage.getItem('bd_saldo'));

    // 3. Si no existen en localStorage (es la primera vez que el usuario abre la app), 
    // cargamos los estáticos y los guardamos en el navegador.
    if (!transacciones) {
        transacciones = transaccionesIniciales;
        localStorage.setItem('bd_transacciones', JSON.stringify(transacciones));
    }

    if (isNaN(saldoActual)) {
        saldoActual = saldoInicial;
        localStorage.setItem('bd_saldo', saldoActual.toString());
    }

    let saldoVisible = true;

    // Función auxiliar global para formatear moneda
    const formatearMoneda = (monto) => {
        return `Bs. ${monto.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    /* ============================================================================
       2. CONTROLADOR DE TEMA GLOBAL (Modo Claro / Oscuro)
       ============================================================================ */
    const themeBtn = document.getElementById('toggle-theme-btn');
    const htmlTag = document.documentElement;

    // Recuperar la preferencia guardada previamente (Persistencia extra)
    if(localStorage.getItem('temaPreferido') === 'dark') {
        htmlTag.setAttribute('data-theme', 'dark');
        if(themeBtn) themeBtn.innerHTML = '<span aria-hidden="true">☀️</span> Modo Claro';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const temaActual = htmlTag.getAttribute('data-theme');
            if (temaActual === 'light') {
                htmlTag.setAttribute('data-theme', 'dark');
                themeBtn.innerHTML = '<span aria-hidden="true">☀️</span> Modo Claro';
                localStorage.setItem('temaPreferido', 'dark'); // Guardamos para otras páginas
            } else {
                htmlTag.setAttribute('data-theme', 'light');
                themeBtn.innerHTML = '<span aria-hidden="true">🌓</span> Modo Oscuro';
                localStorage.setItem('temaPreferido', 'light');
            }
        });
    }

    /* ============================================================================
       3. LÓGICA EXCLUSIVA DEL DASHBOARD (Ocultar/Mostrar Saldo)
       ============================================================================ */
    const toggleVisibilityBtn = document.getElementById('toggle-visibility-btn');
    const balanceAmountElement = document.getElementById('balance-amount');
    const visibilityIcon = document.getElementById('visibility-icon');

    // Solo se ejecuta si estamos en la página dashboard_resumen.html
    if (toggleVisibilityBtn && balanceAmountElement) {
        balanceAmountElement.textContent = formatearMoneda(saldoActual);

        toggleVisibilityBtn.addEventListener('click', () => {
            saldoVisible = !saldoVisible;
            if (saldoVisible) {
                balanceAmountElement.textContent = formatearMoneda(saldoActual);
                visibilityIcon.textContent = '👁️';
            } else {
                balanceAmountElement.textContent = '***';
                visibilityIcon.textContent = '🙈';
            }
        });
    }

    /* ============================================================================
       4. MOTOR DE RENDERIZADO DE TRANSACCIONES (Dashboard e Historial)
       ============================================================================ */
    const obtenerDatosVisuales = (tx) => {
        let icono, claseIcono, signo, claseMonto;
        if (tx.categoria === 'pago-movil') { icono = '📱'; claseIcono = 'icon-pago'; } 
        else if (tx.categoria === 'transfer') { icono = '🏦'; claseIcono = 'icon-transfer'; } 
        else { icono = '💳'; claseIcono = 'icon-card'; }

        if (tx.tipo === 'in') { signo = '+'; claseMonto = 'amount-in'; } 
        else { signo = '-'; claseMonto = 'amount-out'; }

        return { icono, claseIcono, signo, claseMonto };
    };

    const crearElementoTransaccion = (tx) => {
        const { icono, claseIcono, signo, claseMonto } = obtenerDatosVisuales(tx);
        const article = document.createElement('article');
        article.className = 'tx-item';
        article.tabIndex = 0;
        article.setAttribute('aria-label', `Ver detalle de ${tx.concepto}`);
        
        article.innerHTML = `
            <div class="tx-icon ${claseIcono}" aria-hidden="true">${icono}</div>
            <div class="tx-info">
                <h4 class="tx-title">${tx.concepto}</h4>
                <p class="tx-date">${tx.fecha}</p>
            </div>
            <div class="tx-amount ${claseMonto}">${signo} ${formatearMoneda(tx.monto)}</div>
        `;

        // Al hacer clic, guardamos los datos en localStorage y viajamos a la página de detalle
        article.addEventListener('click', () => {
            localStorage.setItem('txSeleccionada', JSON.stringify(tx));
            window.location.href = 'detalles_operacion.html';
        });
        
        return article;
    };

    const renderizarHistorial = (filtro = 'all') => {
        const historyContainer = document.getElementById('full-tx-list');
        const dashboardContainer = document.getElementById('recent-tx-list');
        
        if (historyContainer) historyContainer.innerHTML = '';
        if (dashboardContainer) dashboardContainer.innerHTML = '';

        // Si existe el contenedor del dashboard, mostramos solo 3
        if (dashboardContainer) {
            transacciones.slice(0, 3).forEach(tx => {
                dashboardContainer.appendChild(crearElementoTransaccion(tx));
            });
        }

        // Si existe el contenedor del historial, aplicamos filtros
        if (historyContainer) {
            const txFiltradas = transacciones.filter(tx => {
                if (filtro === 'in') return tx.tipo === 'in';
                if (filtro === 'out') return tx.tipo === 'out';
                return true;
            });

            if (txFiltradas.length === 0) {
                historyContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:20px;">No se encontraron movimientos.</p>';
                return;
            }

            txFiltradas.forEach(tx => historyContainer.appendChild(crearElementoTransaccion(tx)));
        }
    };

    // Renderizado inicial (se aplicará automáticamente al dashboard o al historial dependiendo de en cuál estemos)
    renderizarHistorial('all');


    /* ============================================================================
       5. LÓGICA EXCLUSIVA DEL HISTORIAL (Filtros)
       ============================================================================ */
    const btnsFiltro = [
        { id: 'filter-all', type: 'all' },
        { id: 'filter-income', type: 'in' },
        { id: 'filter-outcome', type: 'out' }
    ];

    // Comprobamos si estamos en historial_movimientos.html (si el primer botón de filtro existe)
    if (document.getElementById('filter-all')) {
        btnsFiltro.forEach(btnInfo => {
            const boton = document.getElementById(btnInfo.id);
            boton.addEventListener('click', () => {
                btnsFiltro.forEach(b => document.getElementById(b.id).classList.remove('active'));
                boton.classList.add('active');
                renderizarHistorial(btnInfo.type);
            });
        });
    }

    /* ============================================================================
       6. LÓGICA EXCLUSIVA DEL DETALLE DE TRANSACCIÓN
       ============================================================================ */
    // Comprobamos si estamos en la página detalles_operacion.html
    const detailAmount = document.getElementById('detail-amount');
    
    if (detailAmount) {
        // Recuperamos la información que guardamos en el localStorage antes de cambiar de página
        const txGuardada = localStorage.getItem('txSeleccionada');
        
        if (txGuardada) {
            const tx = JSON.parse(txGuardada);
            const { icono, claseIcono, signo, claseMonto } = obtenerDatosVisuales(tx);
            
            document.querySelector('.receipt-header .tx-icon').className = `tx-icon ${claseIcono} icon-large`;
            document.querySelector('.receipt-header .tx-icon').textContent = icono;

            detailAmount.className = `tx-amount-large ${claseMonto}`;
            detailAmount.textContent = `${signo} ${formatearMoneda(tx.monto)}`;

            document.getElementById('detail-ref').textContent = tx.id;
            document.getElementById('detail-date').textContent = tx.fecha;
            document.getElementById('detail-desc').textContent = tx.concepto;
            document.getElementById('detail-bank').textContent = tx.bancoDestino;
        } else {
            // Si alguien entra directo a detalles_operacion.html sin seleccionar, lo regresamos al historial
            window.location.href = 'historial_movimientos.html';
        }
    }


    /* ============================================================================
       7. CERRAR SESIÓN Y EXTRAS
       ============================================================================ */
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('¿Estás seguro que deseas cerrar sesión de forma segura?')) {
                alert('Sesión finalizada con éxito.');
                // window.location.href = 'login.html'; // Descomentar cuando exista login.html
            }
        });
    }

    const downloadBtn = document.getElementById('download-receipt-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            alert('Generando comprobante en PDF... \n(Simulación requerida por el PDF del proyecto)');
        });
    }

});