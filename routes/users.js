var express = require('express');
var router = express.Router();
const user = require('../models/Terapista');
const pregunta = require('../models/Pregunta');
const sonido = require('../models/Sonido');
const upload =  require('../helpers/upload-helper');
const fs = require('fs');


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
        ruta: req.body.ruta,
        rutaImg: req.body.rutaImg
    });
    
    nuevoSonido.save().then(sonidoGuardado => {
        console.log(sonidoGuardado);
        
        res.send(sonidoGuardado);
    }).catch(err => {
        console.error(err);
        res.send('Ocurrió un error');
    });
})


router.post('/archivo/:id', (req, res, next) => {
    var dir = __dirname + '/upload';
    // if (!path.existsSync(dir)) {
    //     fs.mkdirSync(dir);
    // }
    if (!path.existsSync('/img') && !path.existsSync('/sounds') ) {
        fs.mkdirSync('/img');
        fs.mkdirSync('/sounds');
    }

    if(req.files){
        if(!upload.isEmpty(req.files)){
            //input ===> nombre de inputfile jade
            let file = req.files.input;
            let img = req.files.input2;
            let alias= req.files.input.name;
            let filename = req.params.id+'_'+Date.now() + '_' +file.name;
            let filenameIMG = req.params.id+'_'+Date.now() + '_' +img.name;
            file.mv('./public/upload/'+filename, (err)=>{
                if(err) throw err;
            });
            
            file.mv('./public/upload/sounds/'+filename, (err)=>{
                if(err) throw err;
            });
            
            file.mv('./public/upload/img/'+filenameIMG, (err)=>{
                if(err) throw err;
            });


            
            
            user.findById("5d0ad7934bf3b215a14b5695").then(data=>{
           
                
                console.log(data);
                
            })
            console.log(req.params.id);
            user.findById(req.params.id).then(data => {
                let stadistica = fs.statSync('./public/upload/'+filename);
                console.log(data);
               
                switch (file.mimetype) {
                    case 'application/x-msexcel':
                        data.archivos.push({
                            alias: alias,
                            nombre: filename,
                            tipo: file.mimetype,
                            peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                            icono: 'fa fa-file-excel'
                            });
                            break;
                    case 'application/msword':
                    data.archivos.push({
                        alias: alias,
                        nombre: filename,
                        tipo: file.mimetype,
                        peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                        icono: 'fa fa-file-word'
                        });
                            break;
                    case 'audio/mpeg':
                    data.archivos.push({
                        alias: alias,
                        nombre: filename,
                        tipo: file.mimetype,
                        peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                        icono: 'fa fa-music'
                        });
                            break;
                    case 'audio/mp3':
                        data.archivos.push({
                            alias: alias,
                            nombre: filename,
                            tipo: file.mimetype,
                            peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                            icono: 'fa fa-music'
                        });
                            break;
                    case 'application/x-rar-compressed':
                        data.archivos.push({
                            alias: alias,
                            nombre: filename,
                            tipo: file.mimetype,
                            peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                            icono: 'fa fa-file-archive'
                        });
                            break;
                    case 'application/zip':
                        data.archivos.push({
                            alias: alias,
                            nombre: filename,
                            tipo: file.mimetype,
                            peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                            icono: 'fa fa-file-archive'
                        });
                            break;
                    case 'application/vnd.ms-powerpoint':
                    data.archivos.push({
                        alias: alias,
                        nombre: filename,
                        tipo: file.mimetype,
                        peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                        icono: 'fa fa-file-powerpoint'
                        });
                            break;
    
                    case 'image/png':
                    console.log(alias);
                    data.archivos.push({
                        alias: alias,
                        nombre: filename,
                        tipo: file.mimetype,
                        peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                        icono: 'fa fa-file-image'
                        });
                            break;         
                    case 'image/jpeg':
                    data.archivos.push({
                        alias: alias,
                        nombre: filename,
                        tipo: file.mimetype,
                        peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                        icono: 'fa fa-file-image'
                        });
                            break;      
                    case 'video/mpeg':
                    data.archivos.push({
                        alias: alias,
                        nombre: filename,
                        tipo: file.mimetype,
                        peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                        icono: 'fa fa-file-video'
                        });
                            break;     
                    default:
                    data.archivos.push({
                        alias: alias,
                        nombre: filename,
                        tipo: file.mimetype,
                        peso: Math.round((stadistica['size']/1048576.0)*100)/100,
                        icono: 'fa fa-file'
                        });
                            break;
                }
                
                
                data.modify = true;
                data.save().then(() => {
                    res.redirect('/users/profile/' + req.params.id)
                });
                
            }).catch((err)=>{
                    console.log(err);
                    
            })
        }
    }else{
        console.log("HOLAAAA");
    }
    
    
});
router.post('/preguntas/', (req, res, next) => {
    var dir = __dirname + '/upload';
    var us = JSON.parse(req.session.user)  
                            console.log(us);
                            
    // if (!path.existsSync(dir)) {
    //     fs.mkdirSync(dir);
    // }
    /*
    if (!path.existsSync('/img') && !path.existsSync('/sounds') ) {
        fs.mkdirSync('/img');
        fs.mkdirSync('/sounds');
    }
*/
    if(req.files){
        if(!upload.isEmpty(req.files)){
            //input ===> nombre de inputfile jade
            if(valMime(req.files.input.mimetype,req.files.input2.mimetype)){
                let file = req.files.input;
                let img = req.files.input2;
                let alias= req.files.input.name;
                let filename = req.params.id+'_'+Date.now() + '_' +file.name;
                let filenameIMG = req.params.id+'_'+Date.now() + '_' +img.name;
                let ruta = '/upload/sounds/'+filename
                let rutaIMG = '/upload/img/'+filenameIMG
               
                console.log(img.mimetype);
                console.log(file.mimetype);
                
                
                const nuevoSonido = new sonido({
                    ruta: ruta,
                    rutaImg: rutaIMG
                });
                
                nuevoSonido.save().then(sonidoGuardado => {
                    
                        const nuevoPregunta = new pregunta({
                            idSonido: sonidoGuardado._id,
                            nivel: "2"
                        });
                        nuevoPregunta.save().then(pregunta=>{
         
                            file.mv('./public/upload/sounds/'+filename, (err)=>{
                                if(err) throw err;
                            });
                            
                            img.mv('./public/upload/img/'+filenameIMG, (err)=>{
                                if(err) throw err;
                            });
                            
                            
                            res.redirect('/admin/profile/'+us.userId)
                        
                        }).catch(err=>{id
                            console.error(err);
                            res.send('Ocurrió un error');
                        })
    
                    
                    
                  //  res.send(sonidoGuardado);
                }).catch(err => {
                    console.error(err);
                    res.send('Ocurrió un error');
                });
    

            }else{
                console.log("GG");
                
                res.redirect('/admin/profile/'+us.userId)
            }
            


            
        }else{
            res.redirect('/admin/profile/'+us.userId)
            console.log("No");
            
        }
    }else{
        res.redirect('/admin/profile/'+us.userId)
        console.log("NO");
    }
    
    
});
function valMime(sound,img){
    let s = false
    let i = false
    
    switch (img){
        case 'image/png':
            i = true
            break;
        case 'image/jpeg':
            i = true
            break;
        default:
            break;        
    }
    switch (sound){
        case 'application/ogg':
            s = true
            break;
        case 'audio/vorbis':
            s = true
            break;
        case 'audio/mpeg':
            s = true
            break;  
        
        case 'audio/mpeg':
            s = true
            break;
        default:
            break;           
    }
    return (i&s)

}
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
const User = require("../models/Terapista");
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