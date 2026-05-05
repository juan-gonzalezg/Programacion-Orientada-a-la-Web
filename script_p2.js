/**
 * ============================================================================
 * BANCA 360 - CONTROLADOR PRINCIPAL (JavaScript Puro)
 * Proyecto 1 - Programación Orientada a la Web (UCAB)
 * ============================================================================
 * * Este archivo maneja toda la lógica del lado del cliente (SPA), incluyendo:
 * - Navegación dinámica entre vistas.
 * - Modo Claro/Oscuro.
 * - Ocultar/Mostrar saldo.
 * - Carga y renderizado dinámico de transacciones (Simulación de Base de Datos).
 * - Sistema de filtros (Entradas/Salidas).
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================================
       1. BASE DE DATOS SIMULADA (Mock Data)
       ============================================================================ */
    // Como el proyecto pide datos estáticos y no backend, usamos un Array de Objetos.
    const transacciones = [
        {
            id: 'REF-893421',
            tipo: 'out', // Salida
            categoria: 'pago-movil',
            concepto: 'Pago Móvil a Farmatodo',
            fecha: '10/05/2026 10:45 AM',
            monto: 450.00,
            bancoDestino: 'Banesco',
            estado: 'Operación Exitosa'
        },
        {
            id: 'REF-102938',
            tipo: 'in', // Entrada
            categoria: 'transfer',
            concepto: 'Transferencia de Nómina',
            fecha: '09/05/2026 03:20 PM',
            monto: 3200.00,
            bancoDestino: 'Mercantil',
            estado: 'Operación Exitosa'
        },
        {
            id: 'REF-992837',
            tipo: 'out',
            categoria: 'card',
            concepto: 'Suscripción Netflix',
            fecha: '08/05/2026 08:00 AM',
            monto: 180.00,
            bancoDestino: 'Tarjeta Visa *4567',
            estado: 'Operación Exitosa'
        },
        {
            id: 'REF-554433',
            tipo: 'in',
            categoria: 'transfer',
            concepto: 'Pago por servicios freelance',
            fecha: '05/05/2026 11:15 AM',
            monto: 850.00,
            bancoDestino: 'Mercantil',
            estado: 'Operación Exitosa'
        },
        {
            id: 'REF-112233',
            tipo: 'out',
            categoria: 'pago-movil',
            concepto: 'Pago Móvil a Panadería',
            fecha: '04/05/2026 06:30 PM',
            monto: 120.00,
            bancoDestino: 'Provincial',
            estado: 'Operación Exitosa'
        }
    ];

    // Variables de estado global
    let saldoActual = 4500.00;
    let saldoVisible = true;


    /* ============================================================================
       2. CONTROLADOR DE VISTAS (SPA - Single Page Application)
       ============================================================================ */
    // Esta función oculta todas las secciones y muestra solo la solicitada
    const cambiarVista = (idVistaActiva) => {
        // 1. Ocultar todas las vistas
        document.querySelectorAll('.view-section').forEach(vista => {
            vista.classList.remove('active');
        });
        
        // 2. Mostrar la vista seleccionada
        document.getElementById(idVistaActiva).classList.add('active');

        // 3. Actualizar la clase 'active' en el menú de navegación (si aplica)
        document.querySelectorAll('.nav-item').forEach(link => {
            link.classList.remove('active');
        });
        
        // Mapeo simple para activar el botón del menú correspondiente
        const linkId = `link-${idVistaActiva.split('-')[0]}`;
        const linkElement = document.getElementById(linkId);
        if (linkElement) {
            linkElement.classList.add('active');
        }
    };

    // Asignar eventos a los botones del menú lateral
    document.getElementById('link-dashboard').addEventListener('click', (e) => {
        e.preventDefault(); cambiarVista('dashboard-view');
    });
    document.getElementById('link-history').addEventListener('click', (e) => {
        e.preventDefault(); cambiarVista('history-view');
    });
    // Link de "Ver todos" en el dashboard
    document.getElementById('link-view-all').addEventListener('click', (e) => {
        e.preventDefault(); cambiarVista('history-view');
    });
    // Botón de "Volver" en el detalle de la transacción
    document.getElementById('back-to-history-btn').addEventListener('click', () => {
        cambiarVista('history-view');
    });


    /* ============================================================================
       3. CONTROLADOR DE TEMA (Modo Claro / Oscuro)
       ============================================================================ */
    const themeBtn = document.getElementById('toggle-theme-btn');
    const htmlTag = document.documentElement; // Etiqueta <html>

    themeBtn.addEventListener('click', () => {
        const temaActual = htmlTag.getAttribute('data-theme');
        
        if (temaActual === 'light') {
            htmlTag.setAttribute('data-theme', 'dark');
            themeBtn.innerHTML = '<span aria-hidden="true">☀️</span> Modo Claro';
        } else {
            htmlTag.setAttribute('data-theme', 'light');
            themeBtn.innerHTML = '<span aria-hidden="true">🌓</span> Modo Oscuro';
        }
    });


    /* ============================================================================
       4. CONTROLADOR DE PRIVACIDAD (Ocultar/Mostrar Saldo)
       ============================================================================ */
    const toggleVisibilityBtn = document.getElementById('toggle-visibility-btn');
    const balanceAmountElement = document.getElementById('balance-amount');
    const visibilityIcon = document.getElementById('visibility-icon');

    // Función auxiliar para formatear moneda
    const formatearMoneda = (monto) => {
        return `Bs. ${monto.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    toggleVisibilityBtn.addEventListener('click', () => {
        saldoVisible = !saldoVisible;
        
        if (saldoVisible) {
            balanceAmountElement.textContent = formatearMoneda(saldoActual);
            visibilityIcon.textContent = '👁️';
        } else {
            balanceAmountElement.textContent = '***';
            visibilityIcon.textContent = '🙈'; // Cambia el icono para mejor UX
        }
    });

    // Inicializar el saldo al cargar la página
    balanceAmountElement.textContent = formatearMoneda(saldoActual);


    /* ============================================================================
       5. MOTOR DE RENDERIZADO DE TRANSACCIONES
       ============================================================================ */
    
    // Función para obtener el icono e información visual según la categoría
    const obtenerDatosVisuales = (tx) => {
        let icono, claseIcono, signo, claseMonto;

        if (tx.categoria === 'pago-movil') {
            icono = '📱'; claseIcono = 'icon-pago';
        } else if (tx.categoria === 'transfer') {
            icono = '🏦'; claseIcono = 'icon-transfer';
        } else {
            icono = '💳'; claseIcono = 'icon-card';
        }

        if (tx.tipo === 'in') {
            signo = '+'; claseMonto = 'amount-in';
        } else {
            signo = '-'; claseMonto = 'amount-out';
        }

        return { icono, claseIcono, signo, claseMonto };
    };

    // Función para generar el HTML de un ítem de transacción
    const crearElementoTransaccion = (tx) => {
        const { icono, claseIcono, signo, claseMonto } = obtenerDatosVisuales(tx);
        const montoFormateado = formatearMoneda(tx.monto);

        const article = document.createElement('article');
        article.className = 'tx-item';
        article.tabIndex = 0; // Accesibilidad
        article.setAttribute('aria-label', `Ver detalle de ${tx.concepto}`);
        
        article.innerHTML = `
            <div class="tx-icon ${claseIcono}" aria-hidden="true">${icono}</div>
            <div class="tx-info">
                <h4 class="tx-title">${tx.concepto}</h4>
                <p class="tx-date">${tx.fecha}</p>
            </div>
            <div class="tx-amount ${claseMonto}">${signo} ${montoFormateado}</div>
        `;

        // Evento para abrir el detalle al hacer clic
        article.addEventListener('click', () => abrirDetalleTransaccion(tx));
        
        return article;
    };

    // Función para renderizar el historial (aplica filtros si existen)
    const renderizarHistorial = (filtro = 'all') => {
        const historyContainer = document.getElementById('full-tx-list');
        const dashboardContainer = document.getElementById('recent-tx-list');
        
        // Limpiar contenedores
        historyContainer.innerHTML = '';
        if (dashboardContainer) dashboardContainer.innerHTML = '';

        // Renderizar últimos 3 en el dashboard
        transacciones.slice(0, 3).forEach(tx => {
            if (dashboardContainer) dashboardContainer.appendChild(crearElementoTransaccion(tx));
        });

        // Filtrar y renderizar en la vista de historial completo
        const transaccionesFiltradas = transacciones.filter(tx => {
            if (filtro === 'in') return tx.tipo === 'in';
            if (filtro === 'out') return tx.tipo === 'out';
            return true; // 'all'
        });

        if (transaccionesFiltradas.length === 0) {
            historyContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:20px;">No se encontraron movimientos.</p>';
            return;
        }

        transaccionesFiltradas.forEach(tx => {
            historyContainer.appendChild(crearElementoTransaccion(tx));
        });
    };


    /* ============================================================================
       6. CONTROLADOR DEL DETALLE DE TRANSACCIÓN
       ============================================================================ */
    const abrirDetalleTransaccion = (tx) => {
        const { icono, claseIcono, signo, claseMonto } = obtenerDatosVisuales(tx);
        
        // Actualizar el DOM de la vista de detalles
        const headerIcon = document.querySelector('.receipt-header .tx-icon');
        headerIcon.className = `tx-icon ${claseIcono} icon-large`;
        headerIcon.textContent = icono;

        const montoElement = document.getElementById('detail-amount');
        montoElement.className = `tx-amount-large ${claseMonto}`;
        montoElement.textContent = `${signo} ${formatearMoneda(tx.monto)}`;

        document.getElementById('detail-ref').textContent = tx.id;
        document.getElementById('detail-date').textContent = tx.fecha;
        document.getElementById('detail-desc').textContent = tx.concepto;
        document.getElementById('detail-bank').textContent = tx.bancoDestino;

        // Cambiar a la vista de detalle
        cambiarVista('transaction-detail-view');
    };


    /* ============================================================================
       7. CONTROLADOR DE FILTROS DEL HISTORIAL
       ============================================================================ */
    const btnsFiltro = [
        { id: 'filter-all', type: 'all' },
        { id: 'filter-income', type: 'in' },
        { id: 'filter-outcome', type: 'out' }
    ];

    btnsFiltro.forEach(btnInfo => {
        const boton = document.getElementById(btnInfo.id);
        boton.addEventListener('click', () => {
            // Quitar clase active de todos los botones
            btnsFiltro.forEach(b => document.getElementById(b.id).classList.remove('active'));
            // Activar el presionado
            boton.classList.add('active');
            // Ejecutar el filtrado
            renderizarHistorial(btnInfo.type);
        });
    });


    /* ============================================================================
       8. FUNCIONALIDADES ADICIONALES (Cerrar Sesión, etc.)
       ============================================================================ */
    document.getElementById('logout-btn').addEventListener('click', () => {
        // Simulación de cierre de sesión exigida por el PDF
        const confirmar = confirm('¿Estás seguro que deseas cerrar sesión de forma segura?');
        if (confirmar) {
            // Aquí iría el window.location.href = 'login.html';
            alert('Sesión finalizada con éxito. Redirigiendo a la pantalla de inicio...');
            // Para propósitos de demostración, recargamos la página simulando una salida
            window.location.reload();
        }
    });

    document.getElementById('download-receipt-btn').addEventListener('click', () => {
        alert('Generando comprobante en PDF... \n(Esta es una simulación visual requerida en el proyecto)');
    });

    // Inicializar la aplicación renderizando los datos por primera vez
    renderizarHistorial('all');

});