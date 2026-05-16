/**
 * Banca 360 - Lógica Principal de la Aplicación
 * NOTA: Los datos simulados (MOCK_DATA) provienen de cuentas.js, 
 * el cual debe ser cargado antes que este archivo en el HTML.
 */

document.addEventListener('DOMContentLoaded', () => {

    const paginaActual = document.body.getAttribute('data-current-nav');

    // ==========================================
    // 1. MODO OSCURO / MODO CLARO (Adaptado para Escritorio y Móvil)
    // ==========================================
    // Escuchamos tanto el botón del sidebar como el botón del perfil (móvil)
    const themeBtn = document.getElementById('toggle-theme-btn');
    const perfilThemeBtn = document.getElementById('perfil-theme-btn');
    
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');
    const perfilThemeIcon = document.getElementById('perfil-theme-icon');
    const perfilThemeText = document.getElementById('perfil-theme-text');

    const actualizarBotonesTema = () => {
        const esOscuro = document.documentElement.getAttribute('data-theme') === 'dark';
        
        // Actualiza el botón del sidebar si existe
        if (themeIcon && themeText) {
            themeIcon.textContent = esOscuro ? '☀️' : '🌓';
            themeText.textContent = esOscuro ? 'Modo Claro' : 'Modo Oscuro';
        }
        // Actualiza el botón de la vista móvil de perfil si existe
        if (perfilThemeIcon && perfilThemeText) {
            perfilThemeIcon.textContent = esOscuro ? '☀️' : '🌓';
            perfilThemeText.textContent = esOscuro ? 'Modo Claro' : 'Modo Oscuro';
        }
    };
    
    actualizarBotonesTema(); // Ejecuta al cargar la página

    const alternarTema = () => {
        const esOscuro = document.documentElement.getAttribute('data-theme') === 'dark';
        const nuevoTema = esOscuro ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nuevoTema);
        
        // Usa la persistencia que ya tienes programada en tu archivo theme-persist.js
        if (typeof window.Banca360Theme !== 'undefined') {
            window.Banca360Theme.write(nuevoTema);
        }
        actualizarBotonesTema();
    };

    // Asignamos el evento de clic a cualquier botón de tema que esté en la pantalla
    if (themeBtn) themeBtn.addEventListener('click', alternarTema);
    if (perfilThemeBtn) perfilThemeBtn.addEventListener('click', alternarTema);

    // ==========================================
    // 2. DASHBOARD: OCULTAR / MOSTRAR SALDO Y DATOS DE USUARIO
    // ==========================================
    const balanceEl = document.getElementById('balance-amount');
    const toggleVisBtn = document.getElementById('toggle-visibility-btn');
    const visibilityIcon = document.getElementById('visibility-icon');
    
    const tituloDash = document.getElementById('dashboard-title');
    if (tituloDash) tituloDash.textContent = 'Hola, ' + MOCK_DATA.usuario.nombre;
    const mascaraCuenta = document.getElementById('account-mask');
    if (mascaraCuenta) mascaraCuenta.textContent = 'Cuenta ' + MOCK_DATA.cuenta.numeroEnmascarado;

    if (toggleVisBtn && balanceEl) {
        let saldoVisible = true;
        const textoSaldoReal = 'Bs. ' + MOCK_DATA.cuenta.saldoDisponible.toFixed(2);
        
        balanceEl.textContent = textoSaldoReal; 

        toggleVisBtn.addEventListener('click', () => {
            saldoVisible = !saldoVisible;
            if (saldoVisible) {
                balanceEl.textContent = textoSaldoReal;
                visibilityIcon.textContent = '👁️';
            } else {
                balanceEl.textContent = 'Bs. ••••••';
                visibilityIcon.textContent = '🙈';
            }
        });
    }

    // ==========================================
    // 3. RENDERIZADO DE TRANSACCIONES
    // ==========================================
    const renderizarTransacciones = (filtro = 'all') => {
        const contenedorRecientes = document.getElementById('recent-tx-list');
        const contenedorHistorial = document.getElementById('full-tx-list');
        
        const contenedor = contenedorRecientes || contenedorHistorial;
        if (!contenedor) return;

        contenedor.innerHTML = ''; 

        for (let i = 0; i < MOCK_DATA.transacciones.length; i++) {
            const tx = MOCK_DATA.transacciones[i];

            if (filtro !== 'all' && tx.tipo !== filtro) continue;
            if (contenedorRecientes && i >= 3) break;

            const icono = tx.tipo === 'in' ? '⬇️' : '⬆️';
            const signo = tx.tipo === 'in' ? '+' : '-';
            const colorClase = tx.tipo === 'in' ? 'color: green;' : 'color: red;';

            const itemHTML = `
                <article class="tx-item" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 8px; cursor: pointer;">
                    <strong>${icono} ${tx.desc}</strong> <br>
                    <small>${tx.fecha}</small> <br>
                    <strong style="${colorClase}">${signo} Bs. ${tx.monto.toFixed(2)}</strong>
                </article>
            `;
            
            contenedor.insertAdjacentHTML('beforeend', itemHTML);

            const ultimoElemento = contenedor.lastElementChild;
            ultimoElemento.addEventListener('click', () => {
                window.location.href = 'detalles_operacion.html?ref=' + encodeURIComponent(tx.id);
            });
        }
    };

    if (paginaActual === 'dashboard' || paginaActual === 'historial') {
        renderizarTransacciones('all');
    }

    // ==========================================
    // 4. SISTEMA DE FILTROS EN HISTORIAL
    // ==========================================
    const botonesFiltro = document.querySelectorAll('.filter-btn');
    if (botonesFiltro.length > 0) {
        botonesFiltro.forEach(boton => {
            boton.addEventListener('click', () => {
                botonesFiltro.forEach(b => b.classList.remove('active'));
                boton.classList.add('active');
                renderizarTransacciones(boton.getAttribute('data-filter'));
            });
        });
    }

    // ==========================================
    // 5. VISTA DETALLE DE OPERACIÓN
    // ==========================================
    if (paginaActual === 'detalle') {
        const parametrosURL = new URLSearchParams(window.location.search);
        const refBuscada = parametrosURL.get('ref');

        let transaccionEncontrada = MOCK_DATA.transacciones[0]; 

        for (let i = 0; i < MOCK_DATA.transacciones.length; i++) {
            if (MOCK_DATA.transacciones[i].id === refBuscada) {
                transaccionEncontrada = MOCK_DATA.transacciones[i];
                break;
            }
        }

        const elRef = document.getElementById('detail-ref');
        if (elRef) elRef.textContent = transaccionEncontrada.id;

        const elDate = document.getElementById('detail-date');
        if (elDate) elDate.textContent = transaccionEncontrada.fecha;

        const elDesc = document.getElementById('detail-desc');
        if (elDesc) elDesc.textContent = transaccionEncontrada.desc;

        const elBank = document.getElementById('detail-bank');
        if (elBank) elBank.textContent = transaccionEncontrada.banco;
        
        const elAmount = document.getElementById('detail-amount');
        const signo = transaccionEncontrada.tipo === 'in' ? '+' : '-';
        if (elAmount) elAmount.textContent = `${signo} Bs. ${transaccionEncontrada.monto.toFixed(2)}`;
        
        const elStatus = document.getElementById('detail-status');
        if (elStatus) elStatus.textContent = 'Operación Exitosa';

        const btnVolver = document.getElementById('back-to-history-btn');
        if (btnVolver) {
            btnVolver.addEventListener('click', () => {
                window.location.href = 'historial_movimientos.html';
            });
        }
    }

  
    if (paginaActual === 'depositos') interceptarFormulario('btn-depositar', 'Depósito registrado en el sistema simulado.');


    
    if (paginaActual === 'perfil') {
        const formCambioClave = document.getElementById('form-cambio-clave');
        if (formCambioClave) {
            document.getElementById('perfil-nombre').textContent = MOCK_DATA.usuario.nombre;
            document.getElementById('perfil-correo').textContent = MOCK_DATA.usuario.correo;

            formCambioClave.addEventListener('submit', (evento) => {
                evento.preventDefault();
                
                const passNueva = document.getElementById('pass_nueva').value;
                const passConfirmar = document.getElementById('pass_confirmar').value;

                if (passNueva !== passConfirmar) {
                    alert("Error de seguridad: La nueva contraseña y la confirmación no coinciden.");
                    return;
                }

                alert('Contraseña actualizada correctamente de forma segura.');
                window.location.href = 'dashboard_resumen.html';
            });
        }
    }

    // ==========================================
    // 7. CIERRE DE SESIÓN (Adaptado para Escritorio y Móvil)
    // ==========================================
    const logoutBtn = document.getElementById('logout-btn');
    const perfilLogoutBtn = document.getElementById('perfil-logout-btn');

    const procesarLogout = () => {
        if (confirm('¿Está seguro de que desea cerrar su sesión?')) {
            window.location.href = 'cierre_sesion.html';
        }
    };

    // Asignamos el evento de clic a cualquier botón de cierre de sesión que esté activo
    if (logoutBtn) logoutBtn.addEventListener('click', procesarLogout);
    if (perfilLogoutBtn) perfilLogoutBtn.addEventListener('click', procesarLogout);
});