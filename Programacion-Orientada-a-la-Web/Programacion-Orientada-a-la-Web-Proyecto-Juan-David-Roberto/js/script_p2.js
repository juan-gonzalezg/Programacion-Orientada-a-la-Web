/**
 * ==========================================
 * BANCA 360 - LÓGICA (MULTIPÁGINA + DASHBOARD)
 * MOCK: sessionStorage + mismo bundle en window.name que el tema (theme-persist.js).
 * ==========================================
 */
document.addEventListener('DOMContentLoaded', () => {

    var MOCK_STORAGE_KEY = 'banca360_mock';

    var MOCK_DEFAULT = {
        usuario: { nombreMostrar: 'Alejandro' },
        cuenta: {
            saldoDisponible: 4500,
            numeroEnmascarado: '•••• 9821'
        },
        mensajeEstadoDefault: 'Operación Exitosa',
        transacciones: [
            { id: 'REF-893421', tipo: 'out', cat: 'pago-movil', desc: 'Pago Móvil a Farmatodo', fecha: '10/05/2026 10:45 AM', monto: 450.0, banco: 'Banesco', estado: 'Operación Exitosa' },
            { id: 'REF-102938', tipo: 'in', cat: 'transfer', desc: 'Transferencia de Nómina', fecha: '09/05/2026 03:20 PM', monto: 3200.0, banco: 'Mercantil', estado: 'Operación Exitosa' },
            { id: 'REF-992837', tipo: 'out', cat: 'card', desc: 'Suscripción Netflix', fecha: '08/05/2026 08:00 AM', monto: 180.0, banco: 'Visa *4567', estado: 'Operación Exitosa' }
        ]
    };

    function normalizarMock(o) {
        var d = MOCK_DEFAULT;
        return {
            usuario: Object.assign({}, d.usuario, o.usuario || {}),
            cuenta: Object.assign({}, d.cuenta, o.cuenta || {}),
            mensajeEstadoDefault: o.mensajeEstadoDefault || d.mensajeEstadoDefault,
            transacciones: (Array.isArray(o.transacciones) && o.transacciones.length)
                ? o.transacciones
                : d.transacciones.slice()
        };
    }

    function mockDesdeAlmacenamientoSesion() {
        try {
            var raw = null;
            if (typeof window.Banca360MockStore !== 'undefined') {
                raw = window.Banca360MockStore.readJson();
            } else {
                raw = sessionStorage.getItem(MOCK_STORAGE_KEY);
            }
            if (raw) {
                var o = JSON.parse(raw);
                if (o && Array.isArray(o.transacciones)) return normalizarMock(o);
            }
        } catch (e) { /* */ }
        return null;
    }

    function guardarMockSesion(mock) {
        var json = JSON.stringify(mock);
        if (typeof window.Banca360MockStore !== 'undefined') {
            window.Banca360MockStore.writeJson(json);
        } else {
            try {
                sessionStorage.setItem(MOCK_STORAGE_KEY, json);
            } catch (e) { /* */ }
        }
    }

    var MOCK = mockDesdeAlmacenamientoSesion();
    if (!MOCK) {
        MOCK = normalizarMock(JSON.parse(JSON.stringify(MOCK_DEFAULT)));
    }
    guardarMockSesion(MOCK);

    var transacciones = MOCK.transacciones;

    function fmtMontoBs(valor) {
        return 'Bs. ' + Number(valor).toFixed(2);
    }

    function iconoYClasePorCat(cat) {
        if (cat === 'pago-movil') return { icon: '📱', iconClass: 'icon-pago' };
        if (cat === 'transfer') return { icon: '🏦', iconClass: 'icon-transfer' };
        return { icon: '💳', iconClass: 'icon-card' };
    }

    function transaccionPorRefParam(refParam) {
        if (!refParam) return transacciones[0];
        var decoded = decodeURIComponent(refParam);
        var found = transacciones.find(function (t) {
            return t.id === decoded || t.id.replace(/^REF-/, '') === decoded;
        });
        return found || transacciones[0];
    }

    function aplicarDetalleEnDom(tx) {
        var ic = iconoYClasePorCat(tx.cat);
        var sign = tx.tipo === 'in' ? '+' : '-';

        var iconEl = document.getElementById('detail-receipt-icon');
        if (iconEl) {
            iconEl.textContent = ic.icon;
            iconEl.className = 'tx-icon ' + ic.iconClass + ' icon-large';
        }

        var detailAmount = document.getElementById('detail-amount');
        if (detailAmount) {
            detailAmount.textContent = sign + ' Bs. ' + tx.monto.toFixed(2);
            detailAmount.className = 'tx-amount-large ' + (tx.tipo === 'in' ? 'amount-in' : 'amount-out');
        }

        var st = document.getElementById('detail-status');
        if (st) {
            st.textContent = tx.estado || MOCK.mensajeEstadoDefault;
            st.className = 'receipt-status success';
        }

        var ref = document.getElementById('detail-ref');
        var date = document.getElementById('detail-date');
        var desc = document.getElementById('detail-desc');
        var bank = document.getElementById('detail-bank');
        if (ref) ref.textContent = tx.id.replace(/^REF-/, '');
        if (date) date.textContent = tx.fecha;
        if (desc) desc.textContent = tx.desc;
        if (bank) bank.textContent = tx.banco;
    }

    function pintarDatosCuentaEnDashboard() {
        var title = document.getElementById('dashboard-title');
        if (title) title.textContent = 'Hola, ' + MOCK.usuario.nombreMostrar;

        var bal = document.getElementById('balance-amount');
        if (bal) bal.textContent = fmtMontoBs(MOCK.cuenta.saldoDisponible);

        var acc = document.getElementById('account-mask');
        if (acc) acc.textContent = 'Cuenta ' + MOCK.cuenta.numeroEnmascarado;
    }

    var themeBtn = document.getElementById('toggle-theme-btn');
    if (themeBtn) {
        var syncThemeLabel = function () {
            var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            themeBtn.innerHTML = isDark
                ? '<span aria-hidden="true">☀️</span> Modo Claro'
                : '<span aria-hidden="true">🌓</span> Modo Oscuro';
        };
        syncThemeLabel();
        themeBtn.addEventListener('click', function () {
            var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            var next = isDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            if (typeof window.Banca360Theme !== 'undefined') {
                window.Banca360Theme.write(next);
            }
            syncThemeLabel();
        });
    }

    var balanceTextoVisible = function () { return fmtMontoBs(MOCK.cuenta.saldoDisponible); };
    var toggleVisBtn = document.getElementById('toggle-visibility-btn');
    var balanceEl = document.getElementById('balance-amount');
    var visibilityIcon = document.getElementById('visibility-icon');
    if (toggleVisBtn && balanceEl) {
        var saldoVisible = true;
        toggleVisBtn.addEventListener('click', function () {
            saldoVisible = !saldoVisible;
            balanceEl.textContent = saldoVisible ? balanceTextoVisible() : 'Bs. ••••••';
            if (visibilityIcon) {
                visibilityIcon.textContent = saldoVisible ? '👁️' : '🙈';
            } else {
                toggleVisBtn.setAttribute('aria-label', saldoVisible ? 'Ocultar saldo' : 'Mostrar saldo');
            }
        });
    }

    var render = function (filter) {
        filter = filter || 'all';
        var containers = {
            'recent-tx-list': transacciones.slice(0, 3),
            'full-tx-list': transacciones.filter(function (t) {
                return filter === 'all' || t.tipo === filter;
            })
        };

        Object.keys(containers).forEach(function (id) {
            var data = containers[id];
            var el = document.getElementById(id);
            if (!el) return;
            el.innerHTML = '';
            data.forEach(function (tx) {
                var item = document.createElement('article');
                item.className = 'tx-item';
                item.setAttribute('tabindex', '0');
                item.setAttribute('aria-label', 'Ver detalle de ' + tx.desc);

                var ic = iconoYClasePorCat(tx.cat);
                var amountClass = tx.tipo === 'in' ? 'tx-amount amount-in' : 'tx-amount amount-out';
                var sign = tx.tipo === 'in' ? '+' : '-';

                item.innerHTML =
                    '<div class="tx-icon ' + ic.iconClass + '" aria-hidden="true">' + ic.icon + '</div>' +
                    '<div class="tx-info">' +
                    '<h4 class="tx-title">' + tx.desc + '</h4>' +
                    '<p class="tx-date">' + tx.fecha + '</p></div>' +
                    '<div class="' + amountClass + '">' + sign + ' Bs. ' + tx.monto.toFixed(2) + '</div>';

                item.addEventListener('click', function () {
                    window.location.href = 'detalles_operacion.html?ref=' + encodeURIComponent(tx.id);
                });
                el.appendChild(item);
            });
        });
    };

    document.querySelectorAll('.filter-btn').forEach(function (b) {
        b.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(function (btn) { btn.classList.remove('active'); });
            b.classList.add('active');
            var f = b.getAttribute('data-filter') || 'all';
            render(f);
        });
    });

    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            if (confirm('¿Cerrar sesión?')) location.reload();
        });
    }

    pintarDatosCuentaEnDashboard();

    var nav = document.body && document.body.getAttribute('data-current-nav');
    if (nav === 'detalle') {
        var params = new URLSearchParams(window.location.search);
        aplicarDetalleEnDom(transaccionPorRefParam(params.get('ref')));
    }

    render();
});
