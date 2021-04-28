const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// criação do 'schema' para o usuário
const productSchema = new Schema({
    nome: { type: String, required: true},
    tipo: { type: String},
    marca: { type: String, required: true },
    preco: { type: Number, required: true},
    foto: { type: String}
});

module.exports = mongoose.model('Product', productSchema);

