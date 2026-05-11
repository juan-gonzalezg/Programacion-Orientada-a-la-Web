
/**
         * ==========================================
         * BANCA 360 - LÓGICA SPA INTELIGENTE
         * ==========================================
         */
        document.addEventListener('DOMContentLoaded', () => {
            
            // 1. DATOS MOCK
            const transacciones = [
                { id: 'REF-893421', tipo: 'out', cat: 'pago-movil', desc: 'Pago Móvil a Farmatodo', fecha: '10/05/2026 10:45 AM', monto: 450.0, banco: 'Banesco' },
                { id: 'REF-102938', tipo: 'in', cat: 'transfer', desc: 'Transferencia de Nómina', fecha: '09/05/2026 03:20 PM', monto: 3200.0, banco: 'Mercantil' },
                { id: 'REF-992837', tipo: 'out', cat: 'card', desc: 'Suscripción Netflix', fecha: '08/05/2026 08:00 AM', monto: 180.0, banco: 'Visa *4567' }
            ];

            // 2. ESTADO DE NAVEGACIÓN
            let currentView = 'dashboard-view';
            let previousView = 'dashboard-view'; // <-- Clave para el botón "Volver"

            const navigate = (target) => {
                if (target !== 'transaction-detail-view') previousView = target;
                
                document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
                document.getElementById(target).classList.add('active');
                
                document.querySelectorAll('.nav-item').forEach(n => {
                    n.classList.toggle('active', n.getAttribute('data-view') === target);
                });
                
                if (target === 'dashboard-view' || target === 'history-view') render();
            };

            // 3. TEMA OSCURO
            const themeBtn = document.getElementById('toggle-theme-btn');
            themeBtn.onclick = () => {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                const next = isDark ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem('temaPreferido', next);
                themeBtn.textContent = next === 'dark' ? '☀️ Modo Claro' : '🌓 Modo Oscuro';
            };
            if(localStorage.getItem('temaPreferido') === 'dark') themeBtn.click();

            // 4. VISIBILIDAD SALDO
            let saldoVisible = true;
            document.getElementById('toggle-visibility-btn').onclick = () => {
                saldoVisible = !saldoVisible;
                document.getElementById('balance-amount').textContent = saldoVisible ? 'Bs. 4,500.00' : 'Bs. ••••••';
                document.getElementById('toggle-visibility-btn').textContent = saldoVisible ? '👁️' : '🙈';
            };

            // 5. RENDERIZADO
            const render = (filter = 'all') => {
                const containers = {
                    'dashboard-tx-list': transacciones.slice(0, 3),
                    'full-tx-list': transacciones.filter(t => filter === 'all' || t.tipo === filter)
                };

                for (const [id, data] of Object.entries(containers)) {
                    const el = document.getElementById(id);
                    if (!el) continue;
                    el.innerHTML = '';
                    data.forEach(tx => {
                        const item = document.createElement('div');
                        item.className = 'tx-item';
                        const icon = tx.cat === 'pago-movil' ? '📱' : (tx.cat === 'transfer' ? '🏦' : '💳');
                        const iconClass = tx.cat === 'pago-movil' ? 'icon-pago' : 'icon-transfer';
                        
                        item.innerHTML = `
                            <div class="tx-icon ${iconClass}">${icon}</div>
                            <div class="tx-info"><p class="tx-title">${tx.desc}</p><p class="tx-date">${tx.fecha}</p></div>
                            <p class="tx-amount ${tx.tipo === 'in' ? 'amount-in' : ''}">${tx.tipo === 'in' ? '+' : '-'} Bs. ${tx.monto.toFixed(2)}</p>
                        `;
                        item.onclick = () => {
                            // Cargar Detalle
                            document.getElementById('detail-icon').textContent = icon;
                            document.getElementById('detail-icon').className = `tx-icon ${iconClass}`;
                            document.getElementById('detail-amount').textContent = `${tx.tipo === 'in' ? '+' : '-'} Bs. ${tx.monto.toFixed(2)}`;
                            document.getElementById('detail-amount').className = tx.tipo === 'in' ? 'amount-in' : '';
                            document.getElementById('detail-rows').innerHTML = `
                                <div class="receipt-row"><span>Referencia</span><span class="receipt-value">${tx.id}</span></div>
                                <div class="receipt-row"><span>Fecha</span><span class="receipt-value">${tx.fecha}</span></div>
                                <div class="receipt-row"><span>Concepto</span><span class="receipt-value">${tx.desc}</span></div>
                                <div class="receipt-row"><span>Banco</span><span class="receipt-value">${tx.banco}</span></div>
                            `;
                            navigate('transaction-detail-view');
                        };
                        el.appendChild(item);
                    });
                }
            };

            // 6. EVENTOS
            document.querySelectorAll('[data-view]').forEach(b => b.onclick = () => navigate(b.getAttribute('data-view')));
            document.getElementById('back-btn').onclick = () => navigate(previousView);
            document.querySelectorAll('.filter-btn').forEach(b => b.onclick = () => {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                b.classList.add('active');
                render(b.getAttribute('data-filter'));
            });
            document.getElementById('logout-btn').onclick = () => confirm('¿Cerrar sesión?') && location.reload();

            render();
        });