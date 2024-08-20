const express = require('express');
const path = require("path");
const morgan = require("morgan");
const mysql = require("mysql");
const myConnection = require("express-myconnection");
const mime = import("mime");
const router = require("../src/routes/customer");



const app = express();

//importar rutas
const customerRoutes = require("./routes/customer");
const multer = require('multer');

//Configuración
app.set('port', process.env.PORT || 3000);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



//Middlewares
app.use(express.static(path.join(__dirname, 'views')));
app.use(morgan("dev"))
app.use(myConnection(mysql,{
    host: "localhost",
    user: "root",
    password: "1234",
    port: 3306,
    database: "pokebarter"
}, "single"));
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//Rutas
app.use("/", customerRoutes);

//archivos statics

app.use(express.static(path.join(__dirname, 'public')));

//Manejar redirecciones

app.get('/descargar/:archivo', (req, res) => {
  const archivo = req.params.archivo;
  const rutaArchivo = path.join(__dirname, 'public', archivo);
  
  // Obtener el tipo MIME del archivo
  const mimeType = mime.getType(rutaArchivo);

  // Configurar el tipo MIME en la respuesta
  res.setHeader('Content-Type', mimeType);

  // Redirigir al archivo en lugar de descargarlo
  res.sendFile(rutaArchivo);
});


// Configuración para servir archivos JavaScript con el tipo MIME correcto
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'text/javascript');
  }
  next();
});



//Inicia el servidor.
app.listen(app.get('port') , ()=> {

    console.log("Server iniciado");
})

module.exports = app;