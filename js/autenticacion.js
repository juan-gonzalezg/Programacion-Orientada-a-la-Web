/**
 * Banca 360 - Lógica de Registro, Login y Seguridad
 */

const formRegistro = document.getElementById('form-registro');
const formPreguntas = document.getElementById('form-preguntas');
const formLogin = document.getElementById('form-login');

const seccionRegistro = document.getElementById('seccion-registro');
const seccionPreguntas = document.getElementById('seccion-preguntas');
const seccionLogin = document.getElementById('seccion-login');
const seccionFinal = document.getElementById('seccion-final');

const spinner = document.getElementById('spinner');
const btnEntrar = document.getElementById('btn-entrar');
const btnIrRegistro = document.getElementById('btn-ir-registro');

// REGISTRO
formRegistro.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const pass1 = document.getElementById('pass1').value;
    const pass2 = document.getElementById('pass2').value;

    if (pass1 !== pass2) {
        alert("Error de seguridad: Las contraseñas no coinciden.");
        return; 
    }
            
    alert("Registro exitoso. Es obligatorio configurar sus preguntas de seguridad.");
    seccionRegistro.hidden = true;
    seccionPreguntas.hidden = false;
});

// PREGUNTAS DE SEGURIDAD
formPreguntas.addEventListener('submit', (evento) => {
    evento.preventDefault();
    alert("Seguridad configurada correctamente. Ya puede iniciar sesión.");
    seccionPreguntas.hidden = true;
    seccionLogin.hidden = false;
});

// 📍 DEFENSA: LÓGICA DE INICIO DE SESIÓN CON VALIDACIÓN SIMULADA
formLogin.addEventListener('submit', (evento) => {
    evento.preventDefault();

    // 1. Capturar lo que el usuario escribió
    // Nota: Como estamos inyectando estilos de neo-banco, asegúrate de acceder a los inputs del form-login.
    const inputs = formLogin.querySelectorAll('input');
    const correoIngresado = inputs[0].value;
    const claveIngresada = inputs[1].value;

    // 2. Buscar si existe un cliente con esos datos exactos en nuestra "Base de datos" (cuentas.js)
    let clienteEncontradoIndex = -1;

    for (let i = 0; i < CLIENTES_MOCK.length; i++) {
        const cliente = CLIENTES_MOCK[i];
        if (cliente.usuario.correo === correoIngresado && cliente.usuario.contrasena === claveIngresada) {
            clienteEncontradoIndex = i;
            break;
        }
    }

    // 3. Validar resultado
    if (clienteEncontradoIndex === -1) {
        alert("Credenciales incorrectas. Verifique su correo o contraseña.");
        return; // Detiene el proceso, no entra al sistema
    }

    // 4. Si es correcto, guardar el ID del usuario en la memoria del navegador y simular carga
    localStorage.setItem('clienteActivoBanca360', clienteEncontradoIndex);

    spinner.hidden = false;
    btnEntrar.disabled = true;

    // Simulación profunda de 2 segundos requerida por el proyecto
    setTimeout(() => {
        seccionLogin.hidden = true;
        spinner.hidden = true;
        seccionFinal.hidden = false; 

        setTimeout(() => {
            window.location.href = './html/dashboard_resumen.html';
        }, 1000);
    }, 2000);
});

// NAVEGACIÓN ENTRE VISTAS
btnIrRegistro.addEventListener('click', () => {
    seccionLogin.hidden = true;
    seccionRegistro.hidden = false;
});