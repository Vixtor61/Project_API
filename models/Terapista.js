const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
    apellido: {
        type: String,
        default: true
    },
    tipo: {
        type: String,
        //required: true
    },
    activo: {
        type: Boolean,
        default: false
    } ,
    modify: {
        type: Boolean,
        default: false
    } 
});

UsuarioSchema.statics.authenticate = function (correo, password, callback) {
    User.findOne({ correo: correo })
        .exec(function (err, user) {
            if (err) {
                return callback(err)
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
                bcrypt.compare(password, user.password, function (err, result) {
                    if (result === true) {
                        return callback(null, user);
                    } else {
                        return callback(new Error('User or Password are wrong'));
                    }
                })
            });
    }                            

UsuarioSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
        return next(err);
        }
        if(user.modify){
            console.log('nice');
            
        }
        else{
            user.password = hash;
        }
        user.modify = false;
        
        next();
    });
    });




let User = mongoose.model('user', UsuarioSchema);
module.exports = User;