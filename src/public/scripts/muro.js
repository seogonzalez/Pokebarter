//Obtengo el user logado
let userPokemon = sessionStorage.getItem("userActual");

//Creo un evento al cargar el DOM para que llame a una función que agregue eventos.
document.addEventListener("load", agregarEventosEliminar())

//Función que agrega eventos a los botones de eliminar.
function agregarEventosEliminar() {

    let btnEliminar = document.querySelectorAll("#btnEliminarPost")
        
    for (let i = 0; i < btnEliminar.length; i++) {

        btnEliminar[i].addEventListener("click", eliminar);
                
    }
}

//Función que elimina los post.
function eliminar(event){

    //Aseguro que el use no se haya equivocado al presionar el botón.
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "ms-2",
          cancelButton: "ms-2 me-2",
          popup: 'shadowPopup'
        },
    });
    swalWithBootstrapButtons.fire({
        title: "¿Quieres eliminar este post?",
        icon: "warning",
        toast: true,
        color: "#fff",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        confirmButtonColor: "#009999",
        cancelButtonColor: "#009999",
        background: "#2e3030"
    }).then((result) => {
        //Si afirma obtiene el pokémon que se quiere eliminar.
        if (result.isConfirmed) {
            
            let contenedorPokemon = event.target.closest("#post");
            let userPokemon = sessionStorage.getItem("userActual");
            let id = contenedorPokemon.querySelector("#idPokemon").value;

            let datos = {
                id : id,
                user: userPokemon
            }

            let lista = contenedorPokemon.querySelector("#esLista").value;

            if(lista == "si"){

                let estado = contenedorPokemon.querySelector("#estado").value;

                datos.estado = estado;
                datos.lista = lista;

            }

            //Realiza una petición fetch que lo elimina.
            fetch("/eliminar", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(datos),
        
            })
            .then(response=>{
        
                if (response.ok) {
                    
                    return response.text();
        
                }
        
            }).then(html =>{
                
                //Pinta los no eliminados y luego le agrega evento a los botones de nuevo.
                let div = document.getElementById("parteMuro");
                div.innerHTML= html;
                
                agregarEventosEliminar()
            
            })    
        } 
    })
}


    
    






