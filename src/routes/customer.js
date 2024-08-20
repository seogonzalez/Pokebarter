const express = require("express");
const router = express.Router();
const controller = require("../controllers/customerController") 

router.get( "/", controller.login)
router.post("/inicio", controller.upload, controller.inicio)
router.post("/postear", controller.uploading.any(), controller.postear)
router.post("/registro", controller.upload, controller.registro)
router.get("/perfil/:user", controller.perfil)
router.post("/filtrar", controller.uploading.any(), controller.filtrar) 
router.post("/eliminar", controller.eliminarPost)
router.post("/editarUser", controller.uploading.any(), controller.editarUser)
/* router.post("/cambiarImg",  controller.upload, controller.cambiarImg) */
router.post("/eliminarLista", controller.uploading.any(), controller.eliminarPost)
router.post("/mostrarListas", controller.uploading.any(), controller.mostrarListas)
router.post("/actualizarImg", controller.upload , controller.actualizarImg)

module.exports = router;
