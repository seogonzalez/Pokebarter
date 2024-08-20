//obtengo el form donde posteo pokemon.
let pokemonPostado = document.getElementById("pokemonPosteado");
//Le agrego evento al hace submit.
pokemonPostado.addEventListener("submit", (event)=>{

    event.preventDefault();
    //Relaizo petición fetch con los datos del formulario.
    const formData = new FormData(event.currentTarget);
    fetch("/postear", {
        method: "POST",
        body : formData,

    })
    .then(response=>{

        if (response.ok) {
            
            return response.text();

        }

    }).then(html =>{
        //Inserto el HTML devuelto en la zona donde se ven los post.
        let div = document.getElementById("parteMuro");
        div.innerHTML= html;

        agregarEventosEliminar();
    
    })

})

//
let pokemonBuscado = document.getElementById("input-PokemonBuscado");
let p = document.getElementById("mensaje-notFound");

//Doy función al botón Continuar del area de posteo. 
async function habilitarCampos(event, accion=false) {
    //Convierto los nombres obtenidos en minúsculas les doy formato.
    pokemonEncontrado = pokemonBuscado.value.toLowerCase()
    pokemonEncontrado = pokemonEncontrado.replace(/\s+/g, '-');
    //Consulyo la pokeAPI.
    try {

        consultaPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonEncontrado}`);
        consultaPokemon = await consultaPokemon.json();
        /* consultaPokemon = JSON.stringify(consultaPokemon);*/
        detallesPokemon.info = consultaPokemon 

    } catch (error) {

    }
    
    if(ARRAY_POKEMON.includes(pokemonEncontrado)){

        accion = true

    }else{
        //Si el nombre del pokemon no existe entre los pokémon existentes, miestro un aviso que lo indica.
        p.style.display = "block"
        setTimeout(()=>{
            p.style.display = "none"
        }, 800)

    }

    //Obtengo las característicvas del pokémon que se añadirá.
    let divCaracteristicas = document.getElementById("div-caracteristicas");
    //Doy función a los botones de continuar, ofrecer, solicitar y cancelar.
    if (event.target.id == "btn-Cancelar" || event.target.id == "btnSoli" || event.target.id == "btnOfre") {       
        //Deja todo preparado para realizar un nuevo post
        pokemonBuscado.readOnly = false;
        let btnContinuar = document.getElementById("btn-Continuar");
        divCaracteristicas.style.display = "none";
        btnContinuar.disabled = false;

        pokemonBuscado.value = "";
  
        // Iterar sobre los campos y vaciar sus valores
        campos.forEach(function(campo) {
            campo.value = '';
        });
        
    }else{
        //Sino muestra el resto del formulario y llama a la función que se encarga de deplegar las opciones
        //correspondientes a cada campo.
        if(accion == true){

            pokemonBuscado.readOnly = true
            divCaracteristicas.style.display = "block";
            let inputAtaque = document.getElementsByClassName("input-pokemonAtaque");

            for (let i = 0; i < inputAtaque.length; i++) {
                
                inputAtaque[i].value = "";
                
            }

            let habilidades = document.getElementById("select-PokemonHabilidad")
            event.target.disabled = true
            desplegar(habilidades)
            
            let pokemonJuego = document.getElementById("select-PokemonJuego");
            event.target.disabled = true
            desplegar(pokemonJuego)

        }else if (accion == false) {

            divCaracteristicas.style.display = "none";
            
        }
    }   

}

//Función para asignar la imagen y el estado al pokémon
function darValoresOcultos(event){

    
    let estado = document.getElementById("estadoPokemon");    
    //Indico si el estado es ofrecido o solicitado.
    estado.value = event;

    let sexo = document.getElementById("sexo");
    let imgPokemon = document.getElementById("imgPokemon");
    let shiny = document.getElementById("checkboxShiny");
    
    //Si es seleccionado el checkbox envío true, sino false para indicar si es o no shiny.
    shiny = shiny.checked;
    if (shiny.checked) {
        shiny.value = "true";
    } else {
        shiny.value = "false";
    }

    //Defino la imagen en función al sexo y si es o no shiny.
    let datosPokemon = detallesPokemon.info;
    datosPokemon = datosPokemon.sprites;

    if (sexo.value == "M" || sexo.value == "-") {

        if (shiny == true) {

            imgPokemon.value = datosPokemon.front_shiny;
            
        } else {

            imgPokemon.value = datosPokemon.front_default;
            
        }
        
    } else if(sexo.value == "F") {

        if (shiny == true) {

            if ( datosPokemon.front_shiny_female == null) {
                
                imgPokemon.value = datosPokemon.front_shiny;

            } else {

                imgPokemon.value = datosPokemon.front_shiny_female;

            }

        } else {

            if ( datosPokemon.front_female == null) {
                
                imgPokemon.value = datosPokemon.front_default;

            } else {

                imgPokemon.value = datosPokemon.front_female;

            }
            
        }
        
    }

} 

//Obtengo los elemento que usaré. 
let btnContinuar = document.getElementById("btn-Continuar");
let btnCancelar = document.getElementById("btn-Cancelar");
let btnOfre = document.getElementById("btnOfre");
let btnSoli = document.getElementById("btnSoli")
//Agrego los eventos a los elementos obtenidos.
btnOfre.addEventListener("click", habilitarCampos);
btnSoli.addEventListener("click", habilitarCampos);
btnContinuar.addEventListener("click", habilitarCampos);
btnCancelar.addEventListener("click", habilitarCampos);
