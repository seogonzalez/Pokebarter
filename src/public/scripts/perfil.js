/* //Obtengo los elementos necesarios. */
let iniciado = document.getElementById("userActual").value
let user;
let partePerfil = document.getElementById("partePerfil");
let parteMuro = document.getElementById("parteMuro");
let editarInfo = document.getElementById("btnEditar")
let editarImg = document.getElementById("editarImg")
let fromImg = document.getElementById("fromImg")
let fileUserImg = document.getElementById("fileUserImg")
let btnOfrecido = document.getElementById("btnOfrecidos")
let btnSolicitado = document.getElementById("btnSolicitados")
let formOfreYSoli = document.getElementById("formOfreYSoli")
let formLista = document.getElementById("formLista")
let zonaPerfil = document.getElementById("zonaPerfil")
let parteLateral = document.getElementById("parteLateral");
let mostrarLateral = document.getElementById("mostrarLateral");


if(mostrarLateral){

    mostrarLateral.addEventListener("click", ()=>{

        if(parteLateral.style.visibility == "visible"){

            parteLateral.style.visibility = "hidden";

        }else{
            
            parteLateral.style.visibility = "visible"
            
        }

        

    })

}

//Función que elimina las opciones exclusivas del user en su perfil para otros perfiles al entrar en ellos.
document.addEventListener("DOMContentLoaded", cargaExclusivosUser())

function cargaExclusivosUser(){

    user = sessionStorage.getItem("userActual")

    if (user != iniciado ){

        partePosteo.style.display = "none";
        editarImg.style.display = "none";
        editarInfo.style.display = "none";
        ocultarBotonEliminar()

    }
    var patron = /^https?:\/\/[^\/]+\/inicio\/?$/;
    var urlActual = window.location.href;
    
    if(patron.test(urlActual)){
        partePosteo.style.display = "block";
    }

}


function ocultarBotonEliminar() {

    if (user != iniciado) {

        let tdBoton = document.querySelectorAll("#btnEliminarPost");

        for (let i = 0; i < tdBoton.length; i++) {
            
            tdBoton[i].style.display = "none";
            
        }
            
    }

}

//Evento para el botón que actualiza la imagen.
fileUserImg.addEventListener("input", ()=>{

    fromImg.submit();

})


//Función que le da la capacidad de eliminar a los botones generados en las listas.
if (formLista) {

    formLista.addEventListener("submit", (event)=>{

        event.preventDefault();
            
        const formData = new FormData(event.currentTarget);
            
        fetch("/eliminarLista", {
            method: "POST",
            body : formData,
            
        })
        .then(response=>{
            
            if (response.ok) {
                        
                return response.text();
            
            }
            
        }).then(html =>{
    
            if(html.length > 100){
    
                parteMuro.innerHTML= html;
            
            }
        })
         
    })
    
}


//Función que muestar los pokémon del user en forma de lista filtrando por el estado.
if (formOfreYSoli) {

    formOfreYSoli.addEventListener("submit", (event)=>{

        event.preventDefault();
    
        let ofrecido = document.getElementById("btnOfrecidos");
        let solicitado = document.getElementById("btnSolicitados");
    
        let formData = {}
        //Selecciono el estado por el que filtraré y modifico las propiedades de ese botón.
        if(event.submitter.classList.contains("active")){
    
            formData.estado = "todos";
            event.submitter.classList.remove("active");
            event.submitter.title = "Filtrar"
    
    
        }else if (event.submitter.id == "btnOfrecidos") {
    
            formData.estado = "ofrecido"
            ofrecido.classList.add("active")
            solicitado.classList.remove("active")
            ofrecido.title = "Mostrar todos"
            solicitado.title = "Filtrar"
            
        }else if (event.submitter.id == "btnSolicitados") {
    
            formData.estado = "solicitado"
            ofrecido.classList.remove("active")
            solicitado.classList.add("active")
            solicitado.title = "Mostrar todos"
            ofrecido.title = "Filtrar"
    
            
        }
        
        formData.user = document.getElementById("userPerfil").innerHTML
        //Hago petición fetch y luego pinto con AJAX.
        fetch("/mostrarListas", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(formData),
            
        })
        .then(response=>{
            
            if (response.ok) {
                        
                return response.text();
            
            }
            
        }).then(html =>{ 
    
            if(html.length > 100){
    
                parteMuro.innerHTML= html;
    
                agregarEventosEliminar()
                ocultarBotonEliminar()
            
            }else{
                
                parteMuro.innerHTML = `<h4  class="text-center" id="título lista">No hay ningun Pokémon ${formData.estado}</h4>`
    
            }
    
        })  
         
    })    
    
}

//Función para asignar los botones de eliminar post sólo a los post del user logado.
const observer = new MutationObserver(function(mutationsList, observer) {
    // Itero a través de las mutaciones.
    for(const mutation of mutationsList) {
      //Si se agrega algo al div
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            
            let boton = document.querySelectorAll("#eliminarPokemonLista");
            let tdBoton = document.querySelectorAll("#tdBoton")


            boton.addEventListener("click", (event)=>{

                let btn = event.currentTarget;

            })


            if(user != iniciado){

                if(boton != null){

                    boton.forEach(btn => {
                        btn.style.display = "none" 
                    });

                }

                if(tdBoton != null){

                    tdBoton.forEach(btn => {
                        btn.style.display = "none" 
                    });

                }


            }
        }
    }
});

// Configuro las opciones del observador
const config = { childList: true };
//Inicio la observación del div
observer.observe(parteMuro, config);

//Función que actualiza la imagen de perfil.
editarImg.addEventListener("change", (event)=>{

    event.preventDefault()

    let formData = new FormData();

    formData.append('img', event.target.files[0]);
    formData.append('username', iniciado);

    fetch("/actualizarImg", {
        
        method: "POST",
        body : formData,
        
    }).then(response=>{
        
        if (response.ok) {
                    
            return response.text();
        
        }
        
    }).then(html =>{


        partePerfil.innerHTML= html;


    }) .catch(error => {
        // Manejar errores aquí
        console.error('Error al realizar la petición:', error);
    }); 

}) 

//Función para cambiar el perfil al hacer scroll.
document.addEventListener('scroll', ()=>{

    const scrollPoint = 288.6; // Punto específico en el scroll
    let zonaLateral = document.getElementById("zonaLateral");

    if (window.innerWidth >= 550) {
        if (window.scrollY >= scrollPoint) {
            zonaPerfil.classList.add('scrolled');
            zonaPerfil.style.position = "fixed";
            zonaLateral.classList.add('scrolledLateral');
            zonaLateral.style.position = "fixed";
            zonaLateral.classList.remove('zonaLateral');
    
        } else {
            zonaPerfil.classList.remove('scrolled');
            zonaLateral.classList.remove('scrolledLateral');
            zonaLateral.classList.add('zonaLateral');
        }
    }
    
});
/* Función que muestra el area lateral */
function mostrarMenu(){

    if (window.innerWidth >= 1035) {
    
        parteLateral.style.visibility = "visible";

    }else if(window.innerWidth < 1035){

        parteLateral.style.visibility = "hidden";
        
    }
}


mostrarMenu();

window.addEventListener('resize', mostrarMenu);
