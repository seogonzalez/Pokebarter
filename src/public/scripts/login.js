//Obtengo la zona de registro.
let div_Registro = document.getElementById("div-registro")
let pantalla = document.getElementById("div-pantalla")
//Obtengo el botón para registrar
let btn_Registro = document.getElementById("registrar")
//Le agrego evento para que muestre la zona de registro al ser presionado.
btn_Registro.addEventListener("click", ()=>{

    div_Registro.style.display= "block";
    pantalla.style.display= "block";

})
//Obtengo el botón para cerrar la zona re registro.
let x = document.getElementById("x-cerrar")
//Le agrego evento para que deje de mostrar la zona de registro.
x.addEventListener("click", ()=>{

    div_Registro.style.display= "none";
    pantalla.style.display= "none";

})

//obtengo el form de registro.
let formResistro = document.getElementById("formRegistro");
//Agrego un evento que hace petición fetch al hacer submit.
formResistro.addEventListener("submit", (event)=>{
  //obtengo el div donde insertaré contenido en caso de que el use ya exista.
  const div = document.getElementById('userRegistrado');
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  //Hago una petición fetch con los datos del formulario.
  fetch("/registro", {
    method: "POST",
    body : formData,
  
  })
  .then(response=>{
   
    if (response.ok) {
              
      return response.text();
  
    }
  
  }).then(html =>{
    //Si encuentra que el username existe devuelve un HTML particular y entra para insertarlo en el div e
    //indicar que ese username está ya tomado.
    if (html == "<p class='text-danger mb-0 small'>Usuername ya existente</p>") {
      
      div.innerHTML= html;
      
    } else {
      //Sino, vacía los elemento del formulario de registro y lo desaparece.
      let elementos = formResistro.elements;

      for (var i = 0; i < elementos.length; i++) {
        if (elementos[i].type !== "button" && elementos[i].type !== "submit" && elementos[i].type !== "reset") {
          elementos[i].value = "";
        }
      }

      div.innerHTML = "";
      div_Registro.style.display= "none";
      pantalla.style.display= "none";

      Swal.fire({
        icon: "success",
        text: "Registro efectuado exitosamente",
        showConfirmButton: false,
        confirmButtonColor: "#009999",
        timer: 2000
      })
      
    }
      
  })

})


let formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", (event)=>{

  event.preventDefault();

  let div = document.getElementById("datosIncorrectos")

  const formData = new FormData(event.currentTarget);

  //Hago una petición fetch con los datos del formulario.
  fetch("/inicio", {
    method: "POST",
    body : formData,
  
  })
  .then(response=>{
   
    if (response.ok) {
              
      return response.text();
  
    }
  
  }).then(html =>{
    //Si el user enviado no es correcto devuelve un HTML y lo muestra informándolo
    if (html != "<p class='text-danger mb-0'>Los datos introducidos no son correctos</p>") {
      //Sino, envía el formulario para iniciar sesión.
      formLogin.submit()
      
    } else {

      div.innerHTML= html;

    }
       
  })


})
  
  
  
