
//falta validacion de cantidad de dinero y si la cuenta esta en bd
//validacion que verifique si la cantidad de caracteres es correcta  
// aviso de transferencia realizada por * cantidad


const paginaActual = document.body.id;

//funcion que limita la cantidad de caracteres en los datos del documento 
const Selector_documentos = document.getElementById('selector_documento');
Selector_documentos.addEventListener(   'change' , function() {    
    const TextArea_documento = document.getElementById('datos_documento');


    TextArea_documento.value = "";
    
    if (this.value === 'J') {
        TextArea_documento.maxLength = 10;
    } else if (this.value === 'P') {
        TextArea_documento.maxLength = 11;
    } else {
        TextArea_documento.maxLength = 9;
    }
});

//funcion que convierte los datos de los textAreas en validos
document.addEventListener('DOMContentLoaded', () => {
    const monto = document.getElementById('monto');
    const telefono = document.getElementById('telefono');
    const TextArea_documento = document.getElementById('datos_documento');
    
    monto.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '');
    });

    telefono.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '');
    });
    telefono.maxLength = 12
    
    TextArea_documento.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '');
    });

    //en caso de transferencia se piden datos adicionales
    if(paginaActual === 'transferencia'){
        const nombre = document.getElementById('nombre');
        const numero = document.getElementById('numero_de_cuenta');
        nombre.addEventListener('input', function() {
           this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
        });

        numero.addEventListener('input', function() {
            this.value = this.value.replace(/[^\d]/g, '');
        });
        numero.maxLength = 20
    };
});


const boton_realizar = document.getElementById('realizar');

boton_realizar.addEventListener('click', function(event) {

    /*dado a que el boton Realizar_transferencia esta dentro de un form, tiende a recargar la pagina, esta funcion lo evita*/ 
    event.preventDefault();
 

    /*captura de los datos en cada uno de los text areas y selectors*/
    const monto = document.getElementById('monto');
    const telefono = document.getElementById('telefono');

    const tipos_de_documento = document.getElementById('selector_documento');
    var documento_elegido = tipos_de_documento.value;
    const TextArea_documento = document.getElementById('datos_documento');

    const bancos = document.getElementById('selector_banco');
    var banco_elegido = bancos.value;

    //se ponen datos adicionales si es transferencia
    if(paginaActual === 'transferencia'){
        const Texto_nombre = document.getElementById('nombre');
        const Texto_numero = document.getElementById('numero_de_cuenta');

        console.log( (
            `transferencia exitosa!,
            Resumen: Nombre: ${Texto_nombre.value},
            Número: ${Texto_numero.value},
            Monto: ${monto.value},
            Documento: ${documento_elegido} (${TextArea_documento.value}),
            Teléfono: ${telefono.value},
            Banco: ${banco_elegido}`));
    }


    console.log( (
            `Pago rapido exitoso!,
            Monto: ${monto.value},
            Documento: ${documento_elegido} (${TextArea_documento.value}),
            Teléfono: ${telefono.value},
            Banco: ${banco_elegido}`));

});