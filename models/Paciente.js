const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const PacienteSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    Apellido: {
        type: String,
        required: true
    },
    Nivel: {
        type: Number,
        required: true
    },
    
    
    
});


let User = mongoose.model('paciente', PacienteSchema);
module.exports = User;