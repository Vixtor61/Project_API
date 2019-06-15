const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const PreguntaSchema = new Schema({
    
    ruta: {
        type: String,
        required: true
    }
});


let User = mongoose.model('sonido', UsuarioSchema);
module.exports = User;