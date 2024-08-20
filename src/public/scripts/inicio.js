let botones = document.getElementById("btn-buscar");
let divSeleccionado = document.getElementById("div-seleccionado");
let inputs = document.getElementsByTagName("input");
let lista;
const ARRAY_POKEMON = new Array();
const detallesPokemon = new Object();
const juegos = new Array();
let juegoLista;

var urlActual = window.location.href;

// Asigna la barra de posteo al inicio


/* Hago llamada a la API de Pokémon para obtener los datos necesarios de los pokémon */
document.addEventListener("DOMContentLoaded", async ()=>{

    try{
        
        lista = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
        lista = await lista.json();
        lista = await lista.results;

        for (let i = 0; i < lista.length; i++) {

            let pokemon = lista[i].name;
            ARRAY_POKEMON.push(pokemon);
               
        }

        juegoLista = await fetch("https://pokeapi.co/api/v2/version?limit=100000&offset=0");
        juegoLista = await juegoLista.json();
        juegoLista = await juegoLista.results;

        for (let i = 0; i < juegoLista.length; i++) {

            let juego = juegoLista[i].name
            juego = juego[0].toUpperCase() + juego.substring(1);
            juegos.push("Pokémon "+juego);
               
        }
    
    }catch{

        console.error(error);

    }
    
})

/* Función para mostrar los datos compatibles con lo introducido en el input */
async function desplegar(event){
    //Recojo el valor dentro del input que ha sido cambiado.
    let inputValor = event.target;
    let regExpre

    let desplegable = function(aRecorrer, datalist){

        datalist.innerHTML = "";

        for (let i = 0; i < aRecorrer.length; i++) {
            //Obtengo el valor del nombre del registro de la lista recorrido.
            let evaluado = aRecorrer[i].name
            //Si cumple con la expresión regular entra.
            if (regExpre.test(evaluado) == true) {
                //Crea una opción con el nobre que introduce en el datalist
                let option = document.createElement("option");
                if (evaluado != "Jangmo-o" && evaluado != "Hakamo-o" && evaluado != "Kommo-o") {
                    evaluado = formatearTexto(evaluado);
                }
                option.value = evaluado;
                evaluado = evaluado[0].toUpperCase() + evaluado.substring(1);
                option.id = "opciones";
                
                option.class = "text-light bg-dark";
                datalist.appendChild(option);

            } 
        }

    }
    
    if(inputValor != null){

        var valor = inputValor.value.toLowerCase();
        regExpre = new RegExp('^' + valor + '.*');//Expresión regular para filtrar
        
    }
    //Si es el de buscar Pokémon entra y sugiere sengún se van ingresando caracteres.
    if (inputValor != null && inputValor.id == "input-PokemonBuscado") {
        //Obtengo el Datalist asociado a la zona del input.
        let datalist = document.getElementById("lista-PokemonBuscado");
        //Recorro la lista de los pokémon.
        desplegable(lista, datalist, valor)

    }else if ( inputValor != null && inputValor.id == "input-pokemonAtaque") {

        let datalist = document.getElementById("lista-PokemonAtaque");
        datalist.innerHTML = "";//Lo vacío.

        let datosPokemon = detallesPokemon.info
        let moves = new Array()
        datosPokemon.moves.forEach(element => {

            moves.push(element.move)
            
        });

        
        desplegable(moves, datalist, valor)

    }else if (event.id == "select-PokemonHabilidad") {

        event.innerHTML = "";
        let option1 = document.createElement("option");
        option1.innerHTML = ""
        event.appendChild(option1);
        let datosPokemon = detallesPokemon.info

        datosPokemon.abilities.forEach(element => {
            
            let evaluado = element.ability.name 
            evaluado = formatearTexto(evaluado);
            let option = document.createElement("option");
            evaluado = evaluado[0].toUpperCase() + evaluado.substring(1);
            option.innerHTML = evaluado;
            option.value = evaluado;
            event.appendChild(option);
            
        });

    }else if (event.id == "select-PokemonJuego") {

        event.innerHTML = "";
        let datosPokemon = detallesPokemon.info
        let i;

        if (datosPokemon.id <= 151) {
            //primera gen
            i = 0;
            
        } else if (datosPokemon.id > 151 && datosPokemon.id <= 251) {
            //segunda gen
            i = 3;
            
        } else if (datosPokemon.id > 251 && datosPokemon.id <= 360) {
            //tercera gen
            i = 6;
            
        } else if (datosPokemon.id > 386 && datosPokemon.id <= 493) {
            //cuarta gen
            i = 11;
            
        } else if (datosPokemon.id > 493 && datosPokemon.id <= 649) {
            //quinta gen
            i = 16;
            
        } else if (datosPokemon.id > 649 && datosPokemon.id <= 721) {
            //sexta gen
            i = 22;
            
        } else if (datosPokemon.id > 721 && datosPokemon.id <= 809) {
            //septima gen
            i = 27;
            
        } else if (datosPokemon.id > 809 && datosPokemon.id <= 905) {
            //octava gen
            i = 32;
            
        } else if (datosPokemon.id > 905 && datosPokemon.id <= 1025) {
            //novena gen
            i = 38;
            
        } 

        for (i ; i < juegoLista.length; i++) {

            let evaluado = juegoLista[i].name;
            let option = document.createElement("option");
            evaluado = evaluado[0].toUpperCase() + evaluado.substring(1)
            evaluado = formatearTexto(evaluado);
            evaluado = "Pokémon "+evaluado;
            option.value = evaluado;
            option.innerHTML = evaluado;
            event.append(option);
            
        }
        let option = document.createElement("option");
        option.value = "Pokémon Go";
        option.innerHTML = "Pokémon Go";
        event.append(option);


    }else if (inputValor != null && inputValor.id == "nivel") {
        //Obtengo el Datalist asociado a la zona del input.
        let input = document.getElementById("nivel");
        let valor = input.value
        
        if (valor > 100) {
            input.value = 100;  
        } else if (valor < 1) {
            input.value  = 1;  
        }


    }

}

/* Le asigno un evento a todos los input de la página */
for (let i = 0; i < inputs.length; i++) {
    
    inputs[i].addEventListener("input", desplegar);
    
}



//Función para eliminar guiones y convertir la siguiente leytra en mayúcula.
function formatearTexto(texto) {
    
    texto = texto.replace(/-/g, ' ');

    texto = texto.replace(/(?:^|\s)\S/g, function(letra) {
      return letra.toUpperCase();
    });
  
    return texto;
}

