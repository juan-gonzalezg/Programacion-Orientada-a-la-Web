/**
 * Banca 360 - Base de Datos Simulada (Mock Data)
 * Este archivo contiene EXCLUSIVAMENTE la información estática de los clientes.
 * Se incluyen contraseñas numéricas y preguntas de seguridad según los requisitos.
 */

const CLIENTES_MOCK = [
    {
        // CLIENTE 0: Perfil Promedio (5 movimientos)
        usuario: { 
            nombre: 'Juan González', 
            correo: 'juan.g@correo.com',
            contrasena: '123456', // Estrictamente 6 números
            preguntasSeguridad: [
                { pregunta: '¿Nombre de tu primera mascota?', respuesta: 'firulais' },
                { pregunta: '¿Ciudad de nacimiento?', respuesta: 'caracas' }
            ]
        },
        cuenta: { saldoDisponible: 4500.50, numeroEnmascarado: '•••• 9821' },
        transacciones: [
            { id: 'REF-893421', tipo: 'out', cat: 'pago-movil', desc: 'Pago Móvil a Farmatodo', fecha: '10/05/2026 10:45 AM', monto: 450.0, banco: 'Banesco' },
            { id: 'REF-102938', tipo: 'in', cat: 'transfer', desc: 'Transferencia de Nómina', fecha: '09/05/2026 03:20 PM', monto: 3200.0, banco: 'Mercantil' },
            { id: 'REF-992837', tipo: 'out', cat: 'card', desc: 'Suscripción Netflix', fecha: '08/05/2026 08:00 AM', monto: 180.0, banco: 'Visa *4567' },
            { id: 'REF-223344', tipo: 'in', cat: 'transfer', desc: 'Pago de deuda a favor', fecha: '01/05/2026 02:15 PM', monto: 150.0, banco: 'Provincial' },
            { id: 'REF-556677', tipo: 'out', cat: 'transfer', desc: 'Pago de condominio', fecha: '28/04/2026 09:00 AM', monto: 45.0, banco: 'Bancaribe' }
        ]
    },
    {
        // CLIENTE 1: Perfil Empresarial (3 movimientos)
        usuario: { 
            nombre: 'David Garcia', 
            correo: 'david.g@correo.com',
            contrasena: '7890123', // Más de 6 caracteres, estrictamente numéricos
            preguntasSeguridad: [
                { pregunta: '¿Nombre de tu primera mascota?', respuesta: 'luna' },
                { pregunta: '¿Ciudad de nacimiento?', respuesta: 'maracaibo' }
            ]
        },
        cuenta: { saldoDisponible: 125400.00, numeroEnmascarado: '•••• 1122' },
        transacciones: [
            { id: 'REF-554433', tipo: 'in', cat: 'transfer', desc: 'Transferencia Creador Contenido', fecha: '11/05/2026 09:15 AM', monto: 45000.0, banco: 'Bancamiga' },
            { id: 'REF-112233', tipo: 'in', cat: 'deposito', desc: 'Depósito por Taquilla', fecha: '08/05/2026 01:30 PM', monto: 12000.0, banco: 'Banca 360' },
            { id: 'REF-998877', tipo: 'out', cat: 'transfer', desc: 'Pago Proveedores', fecha: '05/05/2026 11:00 AM', monto: 5000.0, banco: 'Provincial' }
        ]
    },
    {
        // CLIENTE 2: Perfil Estudiante (2 movimientos)
        usuario: { 
            nombre: 'Roberto Ramirez', 
            correo: 'roberto.r@correo.com',
            contrasena: '45678901', // 6 caracteres numéricos
            preguntasSeguridad: [
                { pregunta: '¿Nombre de tu primera mascota?', respuesta: 'max' },
                { pregunta: '¿Ciudad de nacimiento?', respuesta: 'valencia' }
            ]
        },
        cuenta: { saldoDisponible: 15.20, numeroEnmascarado: '•••• 5543' },
        transacciones: [
            { id: 'REF-123123', tipo: 'out', cat: 'pago-movil', desc: 'Pago Móvil a Panadería', fecha: '12/05/2026 07:10 AM', monto: 35.0, banco: 'Banesco' },
            { id: 'REF-456456', tipo: 'out', cat: 'card', desc: 'Recarga de Saldo', fecha: '11/05/2026 06:45 PM', monto: 100.0, banco: 'Digitel' }
        ]
    }
];

// 📍 DEFENSA: Lógica para saber quién inició sesión
// Leemos la memoria del navegador. Si no hay nadie guardado (ej. entran directo al dashboard), usamos el cliente 0 por defecto.
let indiceGuardado = localStorage.getItem('clienteActivoBanca360');
const INDICE_CLIENTE_ACTIVO = indiceGuardado !== null ? parseInt(indiceGuardado) : 0; 

// Exportamos los datos del cliente activo a la variable global que usan las demás páginas
const MOCK_DATA = CLIENTES_MOCK[INDICE_CLIENTE_ACTIVO];