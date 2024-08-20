//Obtengo los botones de perfil e inicio.
let inicio = document.getElementById("btnInicio");
let userIniciado = document.getElementById('userIniciado');
let storage

//Defino el nombre que se va a mostrar al acceder al perfil.
document.addEventListener("DOMContentLoaded", ()=>{
    //Lo obtengo del sessionstorage.
     storage = sessionStorage.getItem('userActual')
    //Sino existe lo defino.
    if (storage == null) {

        let userActual = document.getElementById("userActual").value
        sessionStorage.setItem('userActual', userActual)

    }
    //Lo agrego a la barra de navegación
    userIniciado.innerHTML = userIniciado.innerHTML+"<p class='my-0'>"+sessionStorage.getItem("userActual")+"</p>";
    userIniciado.href = "/perfil/"+sessionStorage.getItem("userActual");

    cargaExclusivosUser()
})

//Seleciono cual de las opciones del inicio se verá brillante

document.addEventListener("DOMContentLoaded", ()=>{

    let url = window.location.href
    let imagenPerfilNav = document.getElementById("imgPerfilNav")
    let imagenInicioNav = document.getElementById("imgInicioNav")
    imagenInicioNav.style.borderRadius = "50%";
    imagenPerfilNav.style.borderRadius = "50%";


    if(url.includes("inicio")){

        userIniciado.classList.remove("active")
        inicio.classList.add("active")
        imagenInicioNav.style.background = "white"
        imagenPerfilNav.style.background = "transparent"

    }else if(url.includes("perfil")){

        if (url.includes(storage)) {

            userIniciado.classList.add("active")
            inicio.classList.remove("active")
            imagenInicioNav.style.background = "transparent"
            imagenPerfilNav.style.background = "white"
            
        }else{

            inicio.classList.remove("active")
            imagenInicioNav.style.background = "transparent"

        }


    }

})

//Cierro sesión
function cerrarSesion(){

    sessionStorage.removeItem('userActual')

}

//Función que mantiene al inicio informado de quien es el user logado.
inicio.addEventListener("click", (event)=>{
    
    event.preventDefault()

    //Obtengo el user.
    let user= sessionStorage.getItem("userActual")
    //Creo un formulario y le agrego atributos..
    var form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", "/inicio");
    //Creo elementos que se encargarán de pasar a las peticiones el user. 
    var parametro = document.createElement("input");
    parametro.name = "username";
    parametro.value = user
    var parametro2 = document.createElement("input");
    parametro2.name = "verdad";
    parametro2.value = "true";

    form.append(parametro, parametro2)
    document.body.appendChild(form)

    //Envio el form al servidor.
    form.submit();
    
})