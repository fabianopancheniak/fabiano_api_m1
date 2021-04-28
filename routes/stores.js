const express = require('express');
const router = express.Router();
const Stores = require('../models/store');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const config = require('../config/config');

// criando o endpoint para listar todo os usuários
router.get('/', async (req,res) => {
    try {
        // criando um objeto para receber os usuários
        const stores = await Stores.find({});
        return res.send(stores);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na busca das lojas!' });
    }
});

// criando o endpoint para salvar usuário
router.post('/create',  async (req,res) => {
    const { nome, site, tipo, cidade, estado } = req.body;
    console.log(`${nome} - ${site} - ${tipo} - ${cidade} - ${estado}`);
    // testando se todos os campos obrigatórios foram informados
    if (!nome || !site) 
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
        try {
            // verificando se o usuário/email já está cadastrado
            if (await Stores.findOne({ site }))
                return res.send({ error: 'Domínio já registrado! '});

                const store = await Stores.create(req.body);
                return res.status(201).send({ error: 'Loja inserida!' });
        }
        catch (err) {
            return res.send({ error: `Erro ao gravar loja: ${err}`})
        }
});

// criando o endpoint para alterar usuário
router.put('/update/:id', auth, async (req,res) => {
    const { nome, site, tipo, cidade, estado } = req.body;
    if (!nome || !site) 
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
    try {
        // verificando se o usuário/email já está cadastrado
        if (await Stores.findOne({ site }))
            return res.send({ error: 'Domínio já registrado! '});     
            
            const store = await Stores.findByIdAndUpdate(req.params.id, req.body);        
            const storeChanged = await Stores.findById(req.params.id);
            return res.status(201).send({ storeChanged});
    }
    catch (err) {
        return res.send({ error: `Erro ao atualizar loja: ${err}`})
    }     
});

// criando o endpoint para apagar usuário
/*router.delete('/delete/:id', auth, async (req,res) => {
    try {
        await Stores.findByIdAndDelete(req.params.id);
        return res.send({ error: 'Loja removido com sucesso!' });
    }
    catch (err) {
        return res.send({ error: 'Erro ao remover loja!' });
    }     
});*/

// exportando o módulo
module.exports = router;