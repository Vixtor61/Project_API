const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const PreguntaSchema = new Schema({
    idSonido: {
        type: Schema.Types.ObjectId, ref: 'sonido' 
    }
});


let User = mongoose.model('preguntas', PreguntaSchema);
module.exports = User;