let pokemonFiltro = document.getElementById("formFiltro");
let btnCancelarEdicion = document.getElementById("btnCancelarCambios");
let formEditar = document.getElementById("formEditar");

//Función para filtrar los pokemon según las peticiones del user. 
if (pokemonFiltro != null) {

    pokemonFiltro.addEventListener("submit", (event)=>{

        event.preventDefault();
    
        const formData = new FormData(event.currentTarget);
    
        fetch("/filtrar", {
            method: "POST",
            body : formData,
    
        })
        .then(response=>{
    
            if (response.ok) {
                
                return response.text();
    
            }
    
        }).then(html =>{
    
            let div = document.getElementById("parteMuro");
    
            div.innerHTML= html;

            agregarEventosEliminar();
        
        })
    
    })
    
}


//Funcines para agregar a los botones del lateral en el perfil los eventos correspondientes.
let btnEditar = document.getElementById("btnEditar");

function addEvento (){
    
    let pantalla = document.getElementById("div-pantalla");
    let areaEdicion = document.getElementById("areaEdicion");
    let btnEditar = document.getElementById("btnEditar");
    let btnCorreo = document.getElementById("btnOcultarCorreo");
    let btnTelf = document.getElementById("btnOcultarTelefono");
    let btnCancelarEdicion = document.getElementById("btnCancelarCambios");

    btnEditar.addEventListener("click", ()=>{
    
        pantalla.style.display= "block"
        areaEdicion.style.display= "block"

    })

    btnCancelarEdicion.addEventListener("click", ()=>{
    
        pantalla.style.display= "none"
        areaEdicion.style.display= "none"
    
    })

    btnTelf.addEventListener("click", ()=>{

        let lineaTelf = document.getElementById("lineaTelefono");
    
        if(btnTelf.innerHTML == "<b>Teléfono</b>"){
    
            btnTelf.title = "Ocultar teléfono";
            btnTelf.innerHTML = lineaTelf.innerHTML
    
        }else{
    
            btnTelf.innerHTML = "<b>Teléfono</b>"
            btnTelf.title = "Mostrar teléfono";
    
        } 
    
    })


    btnCorreo.addEventListener("click", ()=>{

        let lineaCorreo = document.getElementById("lineaCorreo");
    
        if(btnCorreo.innerHTML == "<b>Correo</b>" ){
    
            btnCorreo.title = "Ocultar email";
            btnCorreo.innerHTML = lineaCorreo.innerHTML
    
        }else{
    
            btnCorreo.innerHTML = "<b>Correo</b>"
            btnCorreo.title = "Mostrar email";
    
        } 
    
    })

}
if (btnEditar) {
    addEvento()
}


//Función para guardar los datos modificados del user en la BD.
formEditar.addEventListener("submit", (event)=>{

    event.preventDefault();
        
    const formData = new FormData(event.currentTarget);
        
    fetch("/editarUser", {
        method: "POST",
        body : formData,
        
    })
    .then(response=>{
        
        if (response.ok) {
                    
            return response.text();
        
        }
        
    }).then(html =>{

        if(html.length > 100){

            let div = document.getElementById("parteLateral");
            div.innerHTML= html;
        
        }else{

            let div = document.getElementById("divAnuncioContraseña");
            div.innerHTML= html;

        }
        addEvento()  
    })
     
} )
