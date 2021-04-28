const express = require('express');
const router = express.Router();
const Products = require('../models/product');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const config = require('../config/config');


// criando o endpoint para listar todo os usuários
router.get('/', async (req,res) => {
    try {
        // criando um objeto para receber os usuários
        const products = await Products.find({});
        return res.send(products);
    }
    catch (err) {
        return res.status(500).send({ error: 'Erro na busca dos produtos!' });
    }
});

// criando o endpoint para salvar usuário
router.post('/create',  async (req,res) => {
    const { nome, tipo, marca, preco, foto } = req.body;
    console.log(`${nome} - ${tipo} - ${marca} - ${preco} - ${foto}`);
    // testando se todos os campos obrigatórios foram informados
    if (!nome || !marca || !preco) 
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
    try {
        if (preco<=0)
            return res.send({ error: 'Informe um preço válido'});

            const product = await Products.create(req.body);
            return res.status(201).send({ error: 'Produto inserido!' });
    }
    catch (err) {
        return res.send({ error: `Erro ao gravar o produto: ${err}`})
    }
});

// criando o endpoint para alterar usuário
router.put('/update/:id', auth, async (req,res) => {
    const { nome, tipo, marca, preco, foto } = req.body;
    if (!nome || !marca || !preco) 
        return res.send({ error: 'Verifique se todos os campos obrigatórios foram informados! '});
        try {
            if (preco<=0)
                return res.send({ error: 'Informe um preço válido'});

            const product = await Products.findByIdAndUpdate(req.params.id, req.body);        
            const productChanged = await Products.findById(req.params.id);
            return res.status(201).send({ productChanged});
        }
        catch (err) {
            return res.send({ error: `Erro ao atualizar o produto: ${err}`})
        }
    });

// criando o endpoint para apagar usuário
router.delete('/delete/:id', auth, async (req,res) => {
    try {
        await Products.findByIdAndDelete(req.params.id);
        return res.send({ error: 'Produto removido com sucesso!' });
    }
    catch (err) {
        return res.send({ error: 'Erro ao remover produto!' });
    }     
});

// exportando o módulo
module.exports = router;