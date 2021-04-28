const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// criação do 'schema' para o usuário
const storeSchema = new Schema({
    nome: { type: String, required: true},
    site: { type: String, unique: true, required: true},
    tipo: { type: String},
    cidade: { type: String},
    estado: { type: String}
});

module.exports = mongoose.model('Store', storeSchema);

