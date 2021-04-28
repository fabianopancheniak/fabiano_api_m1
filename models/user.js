const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// criação do 'schema' para o usuário
const userSchema = new Schema({
    nome: { type: String, required: true},
    sobrenome: { type: String, required: true},
    nascimento: { type: String, required: true },
    login: { type: String, required: true, unique: true},
    senha: { type: String, required: true},
    dica_senha: { type: String},
    cidade: { type: String},
    estado: { type: String}
});

// criando uma nova função para preparar os campos
userSchema.pre('save', async function (next) {
    let user = this;
    // testando se o campo de senha foi modificado
    if (!user.isModified('senha'))
        return next();
    // criando o hash para o campo password
    user.senha = await bcrypt.hash(user.senha, 10);
    return next();
});

module.exports = mongoose.model('User', userSchema);

