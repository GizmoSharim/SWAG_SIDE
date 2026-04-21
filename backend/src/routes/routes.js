const express = require('express');
const router = express.Router();

// Importando os "Garçons" (Controllers)
const ProductController = require('../controllers/ProductController');
const OrderController = require('../controllers/OrderController');

// --- ROTAS PARA O CATÁLOGO E PAINEL ---

// Listar produtos 
router.get('/products', ProductController.index);

// NOVO: Deletar produto 
router.delete('/products/:id', ProductController.delete);

// NOVO: Editar produto 
router.put('/products/:id', ProductController.update);

// NOVO: Adicionar produto 
// Método: POST | URL: http://localhost:3333/products
router.post('/products', ProductController.store);

// --- ROTAS PARA PEDIDOS ---

// Criar pedido antes do WhatsApp
router.post('/orders', OrderController.store);

module.exports = router;