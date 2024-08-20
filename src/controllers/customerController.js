const fs = require('fs');
const path = require('path');
const multer = require('multer');
const ejs = require('ejs');
const axios = require('axios');
const { use } = require('../routes/customer');
/* const app = require("../app"); */

const controller = {}; 
//Función principal para iniciar el servidor.
controller.login = (req,res)=>{
    res.render("login", {

    })  
}

/* Las funciones para guardar imgs empiezan acá */
//Esta función almacena la imagen pasada en un directorio para así poder acceder a él luego.
const storage = multer.diskStorage ({
    
    destination: path.join(__dirname, "../public/img/imgPerfil" ),
    filename: (req, file, cb)=>{   
        console.log("NOMBRE QUE ESTA TOMANDO")
        cb(null, `${Date.now()}-${file.originalname}`)
        console.log("DATOS DE LA IMAGEN: ", file);
    }

})

//Acá llamo al función que almacena mi img en un fichero.
controller.uploading = multer();
const up = multer({storage : storage});
controller.upload = up.single("img");
//Esta función guarda la imagen en la base de datos. YA NO LA USO, PERO ME ENCANTÓ; ASÍ 
//LA DEJO ACÁ PARA MOSTRARLA.
controller.uploadFiles = (req, res)=>{
    req.getConnection((err, conn)=>{
        if (err) {

            res.json(err)

        }
        let tipo = req.file.mimetype ;
        let nombre = req.file.filename
        conn.query("INSERT INTO image SET ?", [{tipo, nombre}],
        (err, rows) =>{
            if (err) {

                res.json(err);

            }else{
                console.log("Imagen agregada")
                controller.registro(req, res);
            }
            
        })
    })
}
/* y terminan acá */


//Función que lista todos los pokemon cargándolos en el inicio.

function listar (req,res){
    console.log("LISTAR")
    req.getConnection((err, conn)=>{
        if (err){
                 
            res.json(err)

        }
        let referer = req.headers.referer;
        console.log("REVISION DE SI ES LISTA", req.body)

        let vista = path.join(__dirname, '..', 'views', 'partials', '_muro.ejs');
        let userActual = req.body.user;
        console.log(userActual, req.body)
        conn.query("SELECT * FROM user WHERE username = ?", userActual, (err, user)=>{
            if (err) {

                res.json(err)
                
            }
            console.log(user)
            if (referer.includes("/inicio")) {

                conn.query("SELECT * FROM pokemon", (err, pokemon)=>{
                    if (err){
                    
                        res.json(err)
        
                    }
                    console.log("entro a inicio")
                    let lista = {

                        pokemon: pokemon,
                        usuario : user

                    }
                    ejs.renderFile(vista, lista, (err, html) => {
                        if (err){
                    
                            res.json(err)
            
                        }
                        console.log("entro a enviar el html")


                        res.send(html);
                    });
                })    
                
            }else{

                console.log("entro a perfil")
                conn.query("SELECT * FROM pokemon WHERE user = ?", userActual, (err, pokemon)=>{
                    if (err){
                    
                        res.json(err)
        
                    }

                    let lista = {

                        pokemon: pokemon,
                        usuario : user

                    }              
                    ejs.renderFile(vista, lista, (err, html) => {
                        if (err){
                    
                            res.json(err)
            
                        }
                        res.send(html);
                    });
                }) 

            }
        })
    })  
}


//Función para agregar un pokémon a la base de datos.
controller.postear = (req, res)=>{
    console.log("POSTEAR")
    req.getConnection((err, conn)=>{
        if(err){

            res.json(err)
        
        }
        let newPokemon = req.body
        delete newPokemon["username"] 
        console.log("sinel eliminad: ",newPokemon)
        conn.query("INSERT INTO pokemon SET ?", newPokemon, (err, row)=>{
            if (err){
                 
                res.json(err)

            }
            listar(req, res);
            
        })

    })    
};

//Función para iniciar sesión.
controller.inicio = (req, res)=>{

    console.log("INICIO")
    let verdad = req.body.verdad
    let username = req.body.username
    let html = "<p class='text-danger mb-0'>Los datos introducidos no son correctos</p>";
    if(username == null){
        username = req.body.user
        verdad = "true" 
    }
    console.log("username ", username)
    let contrasenia =  req.body.contrasenia;

    req.getConnection((err, conn)=>{
        if (err){
                  
            res.json(err)
  
        }
        conn.query('SELECT * FROM user WHERE username = ?', username, (err, user)=>{
            if (err){
                    
                res.json(err)

            } 
            
            console.log("Realiza consulta de user ", user[0])  
            //Si no hay user con el nombre enviado lo indica al cliente.
            if (user[0] == null) { 

                console.log("Datos incorrectos, envió html")
                res.send(html)
                    
            }else{
                //Sino procede con la consulta de los pokémon.
                let password = user[0].contrasenia

                conn.query('SELECT * FROM pokemon', (err2, pokemon) => {
                    console.log("Entro a la consulta de los pokemon")
                    if (err2) {
                        
                        res.json(err2);
                           
                    }
                    //Si la contraseña es correcta renderíza la cuenta del user.
                    if(password == contrasenia || verdad == "true"){
                        console.log("entró a la parte de render")
                        res.render("inicio", {
    
                            usuario : user,
                            pokemon : pokemon
    
                        })
                    }else {
                        //Si no lo indica.
                        console.log("No coincide contraseña.")
                        res.send(html)

                    }
                })
            }
        })
    })  
}
//Función para crear un nuevo user.
controller.registro = (req, res)=>{
    console.log("REGISTRO")
    req.getConnection((err, conn)=>{
        if (err){
                 
            res.json(err)

        }

        let newUser = req.body

        if(req.file){
            let img = req.file.filename
            newUser.img = img;
        }
        
        conn.query('SELECT * FROM user WHERE username = ?', newUser.username , (err, user)=>{
            if (err){
                        
                res.json(err);
        
            } 
            console.log("Obtuvo el user", user)
            //Si el username no está en la base, crea uno nuevo.
            if(user.length < 1){

                conn.query('INSERT INTO user SET ?', newUser , (err, user)=>{
                    if (err){
                                
                        res.json(err);
                
                    }
                    console.log("User agregado a la base")
                    res.redirect("/")  
                
                })

            }else{
                //Sino indica al cliente que ya existe y no lo agrega.
                let html = "<p class='text-danger mb-0 small'>Usuername ya existente</p>";
                console.log("Envió HTML");
                res.send(html)

            }
        })                   
    }            
)};

//Método para entrar en los perfiles de los user
controller.perfil = (req, res) =>{
    console.log("PERFIL")
    let username = req.params.user;
    req.getConnection((err, conn)=>{
        if (err) {

            res.json(err)
            
        }
        conn.query("SELECT * FROM user WHERE username = ?", username, (err, user)=>{
            if (err) {

                res.json(err)
                
            }
            conn.query("SELECT * FROM pokemon WHERE user = ?", username, (err, pokemon)=>{
                if (err) {

                    res.json(err)
                    
                }
                res.render("perfil", {
                    usuario: user,
                    pokemon: pokemon
                })

            })

        })


    })

}

/* Función para filtrar los pokémon a través de lateral */
controller.filtrar = (req, res)=>{
    console.log("FILTRAR")
    req.getConnection((err, conn)=>{
        if (err) {

            res.json(err)
            
        }
        let shiny = req.body.shiny;
        let pokemonBuscado = req.body.pokemon;
        let estado = req.body.estado;
        console.log("est: ", estado, "shiny: ", shiny, "pokemon: ", pokemonBuscado)
        let vista = path.join(__dirname, '..', 'views', 'partials', '_muro.ejs');
        conn.query("SELECT * FROM user WHERE username = ?", req.body.username, (err, user)=>{
            if(err){
                
                res.json(err);
            
            }
            conn.query("SELECT * FROM pokemon", (err, pokemon)=>{
                if(err){
                
                    res.json(err);
                
                }

                if(pokemonBuscado != null && pokemonBuscado != ""){

                    console.log("Entro a pokemon buscado")
                    pokemon = pokemon.filter(objeto => objeto.pokemon == pokemonBuscado);

                }

                if(shiny == 1){

                    console.log("Entro a pokemon shiny")
                    pokemon = pokemon.filter(objeto => objeto.shiny != 0);

                }

                if (estado != "todos") {

                    console.log("Entro a estado")
                    pokemon = pokemon.filter(objeto => objeto.estado == estado);
                        
                }       
                console.log("COMO QUEDA DESPUÉS DE FILTRAR",pokemon)

                if (pokemon.length  > 0) {

                    let lista = {

                        pokemon: pokemon,
                        usuario: user
    
                    }
                    ejs.renderFile(vista, lista, (err, html) => {
                        if (err){
                    
                            res.json(err)
                
                        }
                        res.send(html);
                    });

                }else{

                    res.send(
                            '<div class="pt-3 d-flex bg-gris px-3 justify-content-center rounded align-items-center mx-auto my-5 ">'+
                                '<p class="text-light mx-auto d-flex justify-content-center align-items-center " ><em>No se encontró ningun resultado asociado.</em></p>'+
                            '</div>'
                            ) 
    
                }
    
            })  


        })   
               

    })
                    
}

/* Función que elimina los post realizados */
controller.eliminarPost = (req, res)=>{
    console.log("ELIMINAR POST")
    console.log(req.body);
    req.getConnection((err, conn)=>{
        if(err){

            res.json(err)

        }
        let listado = req.body.lista;
        let id = req.body.id
        console.log("el id es: ", id)
        conn.query("DELETE FROM pokemon WHERE id = ?", id, (err, row)=>{
            if(err){

                res.json(err)

            }
            console.log("Se eliminó post de id ", id, "Este es el valor de lista", listado);

            if(listado){
                
                console.log("redirigido a mostrar lists");
                mostarFromatoLista(req, res)

            }else{
                
                console.log("redirigido a listar");
                listar(req, res);
                
               
            }
            
            

        })
    })


}

/* Método para editar los datos del user */
controller.editarUser = (req, res)=>{
    console.log("EDITAR USER");
    req.getConnection((err, conn)=>{
        if(err){

            res.json(err)

        }
        conn.query("SELECT * FROM user WHERE username = ?", req.body.username, (err, user)=>{
            if(err){

                res.json(err)
    
            }
            if (user[0].contrasenia == req.body.contrasenia) {
                
                const vista = path.join(__dirname, '..', 'views', 'partials', '_lateral.ejs');
                let datos = req.body;
                conn.query("UPDATE user SET nombre = ?, apellido = ?, email = ?, telefono = ?, datos_adicionales = ? WHERE username = ?", [datos.nombre, datos.apellido, datos.email, datos.telefono, datos.datos_adicionales, datos.username], (err, row)=>{
                    if (err) {
                        
                        res.json(err)

                    }
                    conn.query("SELECT * FROM user WHERE username = ?", datos.username, (err, user)=>{
                        if (err) {
                        
                            res.json(err)
    
                        }
                        let lista = {
                            usuario : user
                        }
                        ejs.renderFile(vista, lista, (err, html) => {        
                            if (err){ 
                                                
                                res.json(err)
                                        
                            }
                            console.log("entro a enviarl el html")
                            res.send(html);
                                                
                        });

                    })

                })
                
            }else {

                res.send('<p class="text-danger my-auto">La contraseña no es correcta</p>')

            }

        })

    })

}
/* Método para mostrar en formato de lista */
function mostarFromatoLista(req, res) {
    console.log("MOSTRAR LISTAS", req.body);
    req.getConnection((err, conn)=>{
        if (err) {

            res.json(err)
        }
        conn.query("SELECT * FROM user WHERE username = ?", req.body.user, (err, user)=>{
            if (err) {
                
                res.json(err)
            
            }
            conn.query("SELECT * FROM pokemon WHERE user = ?", [req.body.user], (err, pokemon)=>{
                if (err) {

                    res.json(err)
                
                }
                console.log(pokemon)

                let vista = path.join(__dirname, '..', 'views', 'partials', '_listas.ejs');

                if (req.body.estado == "solicitado") {

                    console.log("Entro a solicitados ")
                    pokemon = pokemon.filter(objeto => objeto.estado == req.body.estado);
                    
                }else if (req.body.estado == "ofrecido") {

                    console.log("Entro a ofrecidos")
                    pokemon = pokemon.filter(objeto => objeto.estado == req.body.estado);
    
                }else if (req.body.estado == "todos"){
                     
                    vista = path.join(__dirname, '..', 'views', 'partials', '_muro.ejs');

                } 

                let lista = { 

                    pokemon : pokemon,
                    usuario: user

                }

                ejs.renderFile(vista, lista, (err, html)=>{
                    if (err) {
                        res.json(err)
                    }
                    console.log("entro a enviarl el html en mostrar listas ", html);
                    res.send(html);

                })
            })
        })
    })
    
}


/* Método para mostrar las listas de ofrecidos y solicitados */
controller.mostrarListas = (req, res)=>{

    mostarFromatoLista(req, res)
    
}

controller.actualizarImg = (req, res)=>{ 
    console.log("ACTUALIZACIÓN DE IMG")
    req.getConnection((err, conn)=>{
        if (err){
             
            res.json(err)

        }
                
        let user = req.body
        
        if(req.file){
            let img = req.file.filename
            user.img = img;
        }
        
        conn.query('UPDATE user SET img = ? WHERE username = ?;', [user.img, user.username] , (err, resultado)=>{
            if (err){
                        
                res.json(err);
        
            } 
            console.log("SE HA INSERTADO NUEVA IMAGEN DE PERFIL")
            conn.query("SELECT * FROM user WHERE username = ?", user.username, (err, user)=>{
                if (err) {
                
                    res.json(err)

                }

                let lista = {
                    usuario : user
                }
                
                const vista = path.join(__dirname, '..', 'views', 'partials', '_profile.ejs');
                ejs.renderFile(vista, lista, (err, html) => {        
                    if (err){ 
                                        
                        res.json(err)
                                
                    }
                    
                    console.log("entro a enviarl el html")
                    res.send(html);
                                        
                });
            })

        })                     
    }             
)};


module.exports = controller;