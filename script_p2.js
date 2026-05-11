/**
 * ============================================================================
 * BANCA 360 - CONTROLADOR PRINCIPAL (JavaScript Puro)
 * Proyecto 1 - Programación Orientada a la Web (UCAB)
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================================
       1. BASE DE DATOS SIMULADA (Datos 100% Estáticos)
       ============================================================================ */
    const transacciones = [
        { id: 'REF-893421', tipo: 'out', categoria: 'pago-movil', concepto: 'Pago Móvil a Farmatodo', fecha: '10/05/2026 10:45 AM', monto: 450.00, bancoDestino: 'Banesco', estado: 'Operación Exitosa' },
        { id: 'REF-102938', tipo: 'in', categoria: 'transfer', concepto: 'Transferencia de Nómina', fecha: '09/05/2026 03:20 PM', monto: 3200.00, bancoDestino: 'Mercantil', estado: 'Operación Exitosa' },
        { id: 'REF-992837', tipo: 'out', categoria: 'card', concepto: 'Suscripción Netflix', fecha: '08/05/2026 08:00 AM', monto: 180.00, bancoDestino: 'Tarjeta Visa *4567', estado: 'Operación Exitosa' },
        { id: 'REF-554433', tipo: 'in', categoria: 'transfer', concepto: 'Pago por servicios freelance', fecha: '05/05/2026 11:15 AM', monto: 850.00, bancoDestino: 'Mercantil', estado: 'Operación Exitosa' },
        { id: 'REF-112233', tipo: 'out', categoria: 'pago-movil', concepto: 'Pago Móvil a Panadería', fecha: '04/05/2026 06:30 PM', monto: 120.00, bancoDestino: 'Provincial', estado: 'Operación Exitosa' }
    ];

    let saldoActual = 4500.00;
    let saldoVisible = true;

    const formatearMoneda = (monto) => {
        return `Bs. ${monto.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    /* ============================================================================
       2. CONTROLADOR DE TEMA GLOBAL (Modo Claro / Oscuro)
       * Nota: Aquí SÍ mantenemos localStorage porque es la única forma 
       * de que la página no vuelva al modo claro al cambiar de pestaña.
       * Esto es "Estado de Interfaz", no base de datos.
       ============================================================================ */
    const themeBtn = document.getElementById('toggle-theme-btn');
    const htmlTag = document.documentElement;

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
                localStorage.setItem('temaPreferido', 'dark'); 
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
       4. MOTOR DE RENDERIZADO DE TRANSACCIONES
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
        
        article.innerHTML = `
            <div class="tx-icon ${claseIcono}" aria-hidden="true">${icono}</div>
            <div class="tx-info">
                <h4 class="tx-title">${tx.concepto}</h4>
                <p class="tx-date">${tx.fecha}</p>
            </div>
            <div class="tx-amount ${claseMonto}">${signo} ${formatearMoneda(tx.monto)}</div>
        `;

        // CAMBIO IMPORTANTE: Pasamos el ID por la URL en vez de usar localStorage
        article.addEventListener('click', () => {
            window.location.href = `detalles_operacion.html?id=${tx.id}`;
        });
        
        return article;
    };

    const renderizarHistorial = (filtro = 'all') => {
        const historyContainer = document.getElementById('full-tx-list');
        const dashboardContainer = document.getElementById('recent-tx-list');
        
        if (historyContainer) historyContainer.innerHTML = '';
        if (dashboardContainer) dashboardContainer.innerHTML = '';

        if (dashboardContainer) {
            transacciones.slice(0, 3).forEach(tx => {
                dashboardContainer.appendChild(crearElementoTransaccion(tx));
            });
        }

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

    renderizarHistorial('all');


    /* ============================================================================
       5. LÓGICA EXCLUSIVA DEL HISTORIAL (Filtros)
       ============================================================================ */
    const btnsFiltro = [
        { id: 'filter-all', type: 'all' },
        { id: 'filter-income', type: 'in' },
        { id: 'filter-outcome', type: 'out' }
    ];

    if (document.getElementById('filter-all')) {
        btnsFiltro.forEach(btnInfo => {
            const boton = document.getElementById(btnInfo.id);
            if(boton) {
                boton.addEventListener('click', () => {
                    btnsFiltro.forEach(b => {
                        const el = document.getElementById(b.id);
                        if(el) el.classList.remove('active');
                    });
                    boton.classList.add('active');
                    renderizarHistorial(btnInfo.type);
                });
            }
        });
    }

    /* ============================================================================
       6. LÓGICA EXCLUSIVA DEL DETALLE DE TRANSACCIÓN (Leyendo de la URL)
       ============================================================================ */
    const detailAmount = document.getElementById('detail-amount');
    
    if (detailAmount) {
        // CAMBIO IMPORTANTE: Leemos el ID desde la URL (?id=REF-123)
        const parametrosURL = new URLSearchParams(window.location.search);
        const idTransaccion = parametrosURL.get('id');
        
        if (idTransaccion) {
            // Buscamos la transacción en nuestra base de datos estática
            const tx = transacciones.find(t => t.id === idTransaccion);

            if(tx) {
                const { icono, claseIcono, signo, claseMonto } = obtenerDatosVisuales(tx);
                
                const iconElement = document.querySelector('.receipt-header .tx-icon');
                if(iconElement) {
                    iconElement.className = `tx-icon ${claseIcono} icon-large`;
                    iconElement.textContent = icono;
                }

                detailAmount.className = `tx-amount-large ${claseMonto}`;
                detailAmount.textContent = `${signo} ${formatearMoneda(tx.monto)}`;

                const idEl = document.getElementById('detail-ref'); if(idEl) idEl.textContent = tx.id;
                const dateEl = document.getElementById('detail-date'); if(dateEl) dateEl.textContent = tx.fecha;
                const descEl = document.getElementById('detail-desc'); if(descEl) descEl.textContent = tx.concepto;
                const bankEl = document.getElementById('detail-bank'); if(bankEl) bankEl.textContent = tx.bancoDestino;
            } else {
                // Si el ID no existe en los datos estáticos
                window.location.href = 'historial_movimientos.html';
            }
        } else {
            // Si entra directo sin ID
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
                window.location.href = 'login.html'; 
            }
        });
    }
});