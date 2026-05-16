

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
    }
    else if (this.value === 'E') {
        TextArea_documento.maxLength = 11;
    }
    else if (this.value === 'V') {
        TextArea_documento.maxLength = 8;
    }
});

//funcion que convierte los datos de los textAreas en validos
document.addEventListener('DOMContentLoaded', () => {
    const monto = document.getElementById('monto');
    const telefono = document.getElementById('telefono');
    const TextArea_documento = document.getElementById('datos_documento');
    
    monto.addEventListener('beforeinput', function(evento) {

        const nuevoCaracter = evento.data; // Qué letra o número intentas meter
        //si el nuevo valor es diferente a un numero, bloqeuado
        if (nuevoCaracter !== null && !/[0-9.]/.test(nuevoCaracter)) {
            evento.preventDefault();
        }
        // si monto ya tiene un . y el nuevo valor tambien es un punto, va bloqueado
        if (nuevoCaracter === '.' && this.value.includes('.')) {
            evento.preventDefault();
        }
    });

    telefono.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '');
    });
    telefono.maxLength = 11
    
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


    if(  parseFloat(monto.value) ===0){
        //poner alerta y quitarle funcionalidad a detalles
        alert("Monto no puede ser 0.");

        return
    }

    if( telefono.value.length !=11 ){
        alert("Telefono incompleto.");    
        return
    }


    if (documento_elegido=== 'J' &&  TextArea_documento.value.length != 10 ) {
        alert("RIF incompleto.");

        return
    } else if (documento_elegido === 'P' &&  TextArea_documento.value.length != 11) {
        alert("Numero de pasaporte incompleto.");
        return
    } else if (documento_elegido === 'V'&&  TextArea_documento.value.length != 8){
        alert("Cedula incompleta.");
        return 
    }
    else if (documento_elegido === 'E'&&  TextArea_documento.value.length != 11){
        alert("Cedula extranjera incompleta.");
        return 
    }





    //se ponen datos adicionales si es transferencia
    if(paginaActual === 'transferencia'){
        const Texto_nombre = document.getElementById('nombre');
        const Texto_numero = document.getElementById('numero_de_cuenta');

        if (Texto_numero.value.length != 20) {
           alert("Numero de cuenta incompleto.");
            return 
        }


        console.log( (
            `transferencia exitosa!,
            Resumen: Nombre: ${Texto_nombre.value},
            Número: ${Texto_numero.value},
            Monto: ${monto.value},
            Documento: ${documento_elegido} (${TextArea_documento.value}),
            Teléfono: ${telefono.value},
            Banco: ${banco_elegido}`));

        alert(`Transferencia exitosa, por un monto de: ${monto.value}bs`);

    }
    else{
       console.log( (
                `Pago rapido exitoso!,
                Monto: ${monto.value},
                Documento: ${documento_elegido} (${TextArea_documento.value}),
                Teléfono: ${telefono.value},
            Banco: ${banco_elegido}`));
        
        alert(`Pago Rapido exitoso, por un monto de: ${monto.value}bs`);

        }

});