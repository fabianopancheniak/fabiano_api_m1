// importando a biblioteca 'express'
const express = require('express');
// importando as funcionalidades do 'express' para trabalho com rotas
const router = express.Router();
// importando o 'model' do usuário
const Users = require('../models/user');
// importando a biblioteca 'bcrypt'
const bcrypt = require('bcrypt');
// importando a biblioteca 'jsonwebtoken'
const jwt = require('jsonwebtoken');
// importando o middleware de autenticação
const auth = require('../middlewares/auth');
// importando a biblioteca para configurações
const config = require('../config/config');

/**
 * FUNÇÕES AUXILIARES
 * 
 * criando a função para a criação do token do usuário
 */
const createUserToken = (userId) => {
    return jwt.sign({ 
        id: userId }, 
        config.jwtPass,
        { expiresIn: config.jwtExpires });
};

// criando o endpoint para autenticar na API
router.post('/auth', (req,res) => {
    const { login, senha } = req.body;
    //const token = await Users.findOne(req.params.login);
    // testando se login ou senha não foram informados
    if (!login || !senha)
        return res.send({ error: 'Dados inválidos! '});
    // se foram informados
    Users.findOne({ login }, (err, data) => {
        if (err)
            return res.send({ error: 'Erro ao buscar usuário!' });
        if (!data)
            return res.send({ error: 'Usuário não encontrado! '});
        // caso não ocorra nenhuma das situações acima
        // comparar a senha informada com a senha salva
        bcrypt.compare(senha,data.senha, (err,same) => {
            // testando se as senhas não são iguais
            if (!same)          
                
                return res.send({error: 'Erro na autenticação!'});
            // se as senhas forem iguais
            // impedindo o retorno da senha
            data.senha = undefined;
            return res.send({ data, token: createUserToken(data.id) });
        });
    }).select('+senha');
});

// criando o endpoint para listar todo os usuários
/*router.get('/', async (req,res) => {
    try {
        // criando um objeto para receber os usuários
        const users = await Users.find({});
        return res.send(users);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na busca dos usuários!' });
    }
});*/

// criando o endpoint para salvar usuário
router.post('/create',  async (req,res) => {
    const { nome, sobrenome, nascimento, login, senha, dica_senha, cidade, estado } = req.body;
    console.log(`${nome} - ${sobrenome} - ${nascimento} - ${login} - ${senha} - ${dica_senha} - ${cidade} - ${estado}`);
    // testando se todos os campos obrigatórios foram informados
    if (!nome || !sobrenome || !nascimento || !login || !senha) 
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
    try {
        // verificando se o usuário/email já está cadastrado
        if (await Users.findOne({ login }))
            return res.send({ error: 'Usuário já cadastrado! '});
        // se o usuário ainda nao for cadastrado
        const user = await Users.create(req.body);
        // impedindo o retorno da senha
        user.senha = undefined;
        return res.status(201).send({ user, token: createUserToken(user.id) });
    }
    catch (err) {
        return res.send({ error: `Erro ao gravar o usuário: ${err}`})
    }
});

// criando o endpoint para alterar usuário
router.put('/update/:id', auth, async (req,res) => {
    const { nome, sobrenome, nascimento, login, senha, dica_senha, cidade, estado } = req.body;
    if (!nome || !sobrenome || !nascimento || !login || !senha) 
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
    try {
        // verificando se o usuário/email já está cadastrado
        if (await Users.findOne({login}))
            return res.send({ error: 'Usuário já cadastrado! '});
        // se o usuário ainda nao for cadastrado
        const user = await Users.findByIdAndUpdate(req.params.id, req.body);
        //findByIdAndUpdate
        // realizando uma nova busca após a alteração para obter o usuário com as alterações
        const userChanged = await Users.findById(req.params.id);
        // impedindo o retorno da senha
        userChanged.senha = undefined;
        return res.status(201).send({ userChanged});
    }
    catch (err) {
        return res.send({ error: `Erro ao atualizar o usuário: ${err}`})
    }     
});

// criando o endpoint para apagar usuário
router.delete('/delete/:id', auth, async (req,res) => {
    try {
        await Users.findByIdAndDelete(req.params.id);
        return res.send({ error: 'Usuário removido com sucesso!' });
    }
    catch (err) {
        return res.send({ error: 'Erro ao remover usuário!' });
    }     
});

// exportando o módulo
module.exports = router;