var express = require('express');
var router = express.Router();
const user = require('../models/Usuario');
const pregunta = require('../models/Pregunta');
const sonido = require('../models/Sonido');
const upload =  require('../helpers/upload-helper');
const fs = require('fs');

//Modificar todos los findbyid , estan quemados a 5bfee5f78763d84258a7c7d1

/** Rutas de archivos */
router.get('/profile/:id', (req, res, next) => {
    //res.render('mainUser')
    console.log("SESION");
    console.log("  ");
    
    console.log(req.session.user);
    
    if(req.session.user){
        console.log(req.params.id);
        user.findById(req.params.id).then(usuario => {
            // res.send(usuario.archivos);
            console.log(usuario);
            res.render('mainUser',{user: usuario.nombre,
                usrid: usuario.id});
            // res.send('archivo cargado')
        })
    }else{
        res.render("login")
    }
    
});

//creacion de nuevos usuarios
router.post('/perf_crear', function(req, res, next) {
    const nuevoUsuario = new user({
        correo: req.body.correo,
        password: 'test',
        activo: true,
        nombre: req.body.nombre,
        tipo: 'user'
    });
    
    nuevoUsuario.save().then(usuarioGuardado => {
        res.send(usuarioGuardado);
    }).catch(err => {
        console.error(err);
        res.send('Ocurrió un error');
    });
})

/** Rutas de perfil */
router.get('/perfil/:id', (req, res, next) => {
    res.send('Get Perfil');
});

router.put('/perfil/:id', (req, res, next) => {
    if(req.session.user){
        res.send('Put Perfil');
    }else{
        res.render('login');
    }
    
});

router.get('/config/', (req,res)=>{
    if(req.session.user){
        res.render('configuser');
    }else{
        res.render('login');
    }
    
});
router.get('/pregunta/:id',(req,res)=>{
    pregunta.findById(req.params.id).populate('idSonido').then(pregunta => {
        res.send(pregunta);
        console.log(pregunta);
        
        
    })
})
router.post('/pregunta/',(req,res)=>{
    const nuevoPregunta = new pregunta({
        idSonido: req.body.idSonido
    });
    
    nuevoPregunta.save().then(preguntaGuardado => {
        console.log(preguntaGuardado);
        console.log(preguntaGuardado);
        
        res.send(preguntaGuardado);
    }).catch(err => {
        console.error(err);
        res.send('Ocurrió un error');
    });
})

router.get('/sonido/:id',(req,res)=>{
    sonido.findById(req.params.id).then(sonido => {
        res.send(sonido);
        console.log(sonido);
        
        
    })
    
})
router.get('/sonido/',(req,res)=>{
    sonido.find({}).then(sonido =>{
        res.send(sonido);
    })

    
})
router.post('/sonido/',(req,res)=>{
    const nuevoSonido = new sonido({
        ruta: req.body.ruta
    });
    
    nuevoSonido.save().then(sonidoGuardado => {
        console.log(sonidoGuardado);
        
        res.send(sonidoGuardado);
    }).catch(err => {
        console.error(err);
        res.send('Ocurrió un error');
    });
})



router.put('/config/:id', (req, res)=>{
    
    let update = {
        nombre: req.body.nombre,
        //password: req.body.password
    }
    user.findByIdAndUpdate(req.params.id, update, function(err, nu){
        if(err){
            res.status(500);
            res.json({code: 500, err});
        }
        else{
            console.log("HOOOOOOLA");
            
            res.json({ok: true, nu, update});     
        }     
    });
});

const AuthController = require("../controllers/UserController");
//Requerimos el Middelware que hemos creado
const AuthMiddleware = require("../middlewares/AuthMiddleware");
//Requerimos el modelo
const User = require("../models/Usuario");
//ruta que nos devolvera el formulario para crear usuarios
router.post('/signup',AuthController.store);

//ruta que enviara los datos del usuario para almacenarlos en la base de datos
router.get('/signup',AuthController.create);
//ruta que nos devolvera el formulario para ingresar
router.get('/signin',AuthController.login);
//ruta que enviara los datos del usuario para ingresar al sistema
router.post('/signin',AuthController.signin);
//ruta para salir del sistema
router.get('/logout',AuthController.logout);
/*Middlewar que verifica que solo los usuarios registrados podran ingresar a esta seccion */
router.use(AuthMiddleware.isAuthentication);
//ruta para acceder al perifl
router.get('/profile',AuthController.profile);

module.exports = router;