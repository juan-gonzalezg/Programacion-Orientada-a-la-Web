/**
 * Banca 360 - Lógica Principal de la Aplicación
 * NOTA: Los datos simulados (MOCK_DATA) provienen de cuentas.js, 
 * el cual debe ser cargado antes que este archivo en el HTML.
 */

document.addEventListener('DOMContentLoaded', () => {

    const paginaActual = document.body.getAttribute('data-current-nav');

    // ==========================================
    // 1. MODO OSCURO / MODO CLARO
    // ==========================================
    const themeBtn = document.getElementById('toggle-theme-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    if (themeBtn) {
        const actualizarBotonTema = () => {
            const esOscuro = document.documentElement.getAttribute('data-theme') === 'dark';
            if (themeIcon && themeText) {
                themeIcon.textContent = esOscuro ? '☀️' : '🌓';
                themeText.textContent = esOscuro ? 'Modo Claro' : 'Modo Oscuro';
            }
        };
        actualizarBotonTema();

        themeBtn.addEventListener('click', () => {
            const esOscuro = document.documentElement.getAttribute('data-theme') === 'dark';
            const nuevoTema = esOscuro ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', nuevoTema);
            if (typeof guardarTema === 'function') guardarTema(nuevoTema);
            actualizarBotonTema();
        });
    }

    // ==========================================
    // 2. DASHBOARD: OCULTAR / MOSTRAR SALDO Y DATOS DE USUARIO
    // ==========================================
    const balanceEl = document.getElementById('balance-amount');
    const toggleVisBtn = document.getElementById('toggle-visibility-btn');
    const visibilityIcon = document.getElementById('visibility-icon');
    
    // Inyectar datos del cliente activo leyendo desde MOCK_DATA (cuentas.js)
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
    // 3. RENDERIZADO DE TRANSACCIONES (DASHBOARD E HISTORIAL)
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
            // Si estamos en el dashboard, solo mostramos las últimas 3 transacciones
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

            // Funcionalidad para ir al detalle de la operación al hacer clic
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

        // Buscar la transacción específica
        for (let i = 0; i < MOCK_DATA.transacciones.length; i++) {
            if (MOCK_DATA.transacciones[i].id === refBuscada) {
                transaccionEncontrada = MOCK_DATA.transacciones[i];
                break;
            }
        }

        // Inyectar de manera segura verificando que el elemento existe
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

        // Lógica del botón volver
        const btnVolver = document.getElementById('back-to-history-btn');
        if (btnVolver) {
            btnVolver.addEventListener('click', () => {
                window.location.href = 'historial_movimientos.html';
            });
        }
    }

    // ==========================================
    // 6. FORMULARIOS (TRANSACCIONES, DEPÓSITOS Y PERFIL)
    // ==========================================
    const interceptarFormulario = (idBoton, mensajeExito) => {
        const boton = document.getElementById(idBoton);
        if (boton) {
            boton.addEventListener('click', (evento) => {
                // Validación para respetar las reglas de HTML5 (ej. evitar enviar campos vacíos)
                const form = boton.closest('form');
                if (form && !form.checkValidity()) return; 

                evento.preventDefault(); 
                alert(mensajeExito);
                window.location.href = 'dashboard_resumen.html'; 
            });
        }
    };

    if (paginaActual === 'transferir') interceptarFormulario('realizar', 'Transferencia realizada con éxito.');
    if (paginaActual === 'pago rapido') interceptarFormulario('realizar', 'Pago móvil procesado exitosamente.');
    if (paginaActual === 'depositos') interceptarFormulario('btn-depositar', 'Depósito registrado en el sistema simulado.');

    // Validación estricta para el cambio de clave en el perfil
    if (paginaActual === 'perfil') {
        const formCambioClave = document.getElementById('form-cambio-clave');
        if (formCambioClave) {
            // Llenar datos base del usuario
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
    // 7. CIERRE DE SESIÓN
    // ==========================================
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('¿Está seguro de que desea cerrar su sesión?')) {
                window.location.href = 'cierre_sesion.html';
            }
        });
    }
});