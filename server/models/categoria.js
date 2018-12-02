const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria.']
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Categoria', categoriaSchema);