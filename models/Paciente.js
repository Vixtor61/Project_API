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
    fecha_ingreso: {
        type: String,
        required: true
    },
    num_terapista: {
        type: Schema.Types.ObjectId, ref: 'user' 
    }
    
    
    
});


let User = mongoose.model('paciente', PacienteSchema);
module.exports = User;