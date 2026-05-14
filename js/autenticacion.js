/**
 * Banca 360 - Lógica de Registro, Login y Seguridad (Para index.html)
 */

// 1. SELECCIÓN DE ELEMENTOS (Usando selectores vistos en clase)
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

// 2. LÓGICA DE REGISTRO Y VALIDACIÓN ESTRICTA
formRegistro.addEventListener('submit', (evento) => {
    // FUNCIÓN NO VISTA EN CLASE: preventDefault()
    // Funcionalidad: Evita que el formulario recargue la página web por defecto al darle al botón "submit".
    evento.preventDefault();

    const pass1 = document.getElementById('pass1').value;
    const pass2 = document.getElementById('pass2').value;

    // Validación: Las contraseñas deben coincidir
    if (pass1 !== pass2) {
        alert("Error de seguridad: Las contraseñas no coinciden.");
        return; // Detiene la ejecución
    }
            
    alert("Registro exitoso. Es obligatorio configurar sus preguntas de seguridad.");
    
    // Ocultar registro y mostrar preguntas manipulando el atributo 'hidden'
    seccionRegistro.hidden = true;
    seccionPreguntas.hidden = false;
});

// 3. LÓGICA DE PREGUNTAS DE SEGURIDAD
formPreguntas.addEventListener('submit', (evento) => {
    evento.preventDefault();
    alert("Seguridad configurada correctamente. Ya puede iniciar sesión.");
    
    seccionPreguntas.hidden = true;
    seccionLogin.hidden = false;
});

// 4. LÓGICA DE INICIO DE SESIÓN Y SPINNER (Requisito del PDF: exactamente 2 segundos)
formLogin.addEventListener('submit', (evento) => {
    evento.preventDefault();

    // Mostrar spinner y bloquear botón
    spinner.hidden = false;
    btnEntrar.disabled = true;

    // FUNCIÓN NO VISTA EN CLASE: setTimeout(funcion, milisegundos)
    // Funcionalidad: Retrasa la ejecución del código que tiene adentro por un tiempo específico. 
    // 2000 milisegundos = exactamente 2 segundos requeridos por el proyecto.
    setTimeout(() => {
        seccionLogin.hidden = true;
        spinner.hidden = true;
        seccionFinal.hidden = false; 

        // Simular redirección al dashboard luego de 1 segundo de ver el mensaje de bienvenida
        setTimeout(() => {
            // FUNCIÓN NO VISTA EN CLASE: window.location.href
            // Funcionalidad: Redirige al usuario a otra página HTML (como hacer clic en un enlace).
            window.location.href = 'dashboard_resumen.html';
        }, 1000);

    }, 2000);
});

// 5. NAVEGACIÓN ENTRE LOGIN Y REGISTRO
btnIrRegistro.addEventListener('click', () => {
    seccionLogin.hidden = true;
    seccionRegistro.hidden = false;
});