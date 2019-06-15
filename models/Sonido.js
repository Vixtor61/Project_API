const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const SonidoSchema = new Schema({
    
    ruta: {
        type: String,
        required: true
    }
});


let User = mongoose.model('sonido',SonidoSchema);
module.exports = User;