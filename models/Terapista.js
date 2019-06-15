const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const TerapistaSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    Apellido: {
        type: String,
        required: true
    },
    num_terapista:{
        type : String,
        required: true
    }
    
    
    
});


let User = mongoose.model('terapista', TerapistaSchema);
module.exports = User;