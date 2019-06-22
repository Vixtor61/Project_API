var express = require('express');
var router = express.Router();
const user = require('../models/Terapista');
const pregunta = require('../models/Pregunta');
const sonido = require('../models/Sonido');
const upload =  require('../helpers/upload-helper');
const fs = require('fs');



router.get('/pregunta/:id',(req,res)=>{
    pregunta.findById(req.params.id).populate('idSonido').then(pregunta => {
        res.json(pregunta)
        console.log(pregunta);
        
        
    }).catch(err => {
        console.error(err);
        res.send('Ocurrió un error');
    });
})
router.get('/pregunta/',(req,res)=>{
    pregunta.find({}).populate('idSonido').then(preguntas => {
        res.json(preguntas)
        
        
    }).catch(err => {
        console.error(err);
        res.send('Ocurrió un error');
    });
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
        
        
    }).catch(err => {
        console.error(err);
        res.send('Ocurrió un error');
    });
    
})
router.get('/sonido/',(req,res)=>{
    sonido.find({}).then(sonido =>{
        res.send(sonido);
    }).catch(err => {
        console.error(err);
        res.send('Ocurrió un error');
    });

    
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


router.post('/preguntas/', (req, res, next) => {
    var dir = __dirname + '/upload';
    var us = JSON.parse(req.session.user)  
                            console.log(us);
                            
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
                            nivel: req.body.nivel
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
                console.log("ERROR");
                
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

module.exports = router;