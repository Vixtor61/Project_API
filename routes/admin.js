var express = require('express');
var router = express.Router();
const Usuario = require('../models/Terapista');
var MongoClient = require('mongodb').MongoClient;

// Ruta principal de la pantalla admin
router.get('/profile/:id', function(req, res, next) {
    Usuario.findById(req.body.id).then(usuario => {
        Usuario.find({},function(err,users){
            var listUsers = {};
            users.forEach(function(user) {
                listUsers[user._id] =user;
              });
              res.render('admin', { admin: usuario, users: listUsers });
        })     
    });
})


//Ruta para ver perfil propio
router.get('/admin_perf', function(req, res, next) {
    res.render('AdminProfile')
})

//Ruta para editar perfil de admin
router.put('/admin_perf_edit/:id', function(req, res, next) {
    res.send('Editando perfil de admin')
})

// Ruta de creacion de nuevos admins
router.post('/perf_crear', function(req, res, next) {
    
    const nuevoUsuario = new Usuario({
        nombre: req.body.nombre,
        correo: req.body.correo,
        password: 'AdminWeb1234',
        tipo: 'admin',
        activo: true
    });
    nuevoUsuario.save().then(usuarioGuardado => {
        res.send(usuarioGuardado);
    }).catch(err => {
        console.error(err);
        res.send('Ocurrió un error');
    });
})



const AuthController = require("../controllers/UserController");
const AuthMiddleware = require("../middlewares/AuthMiddleware");

router.get('/logout',AuthController.logout);


module.exports = router;
