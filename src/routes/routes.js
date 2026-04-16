const express = require('express');
const router = express.Router();

// Importando os "Garçons" (Controllers)
const ProductController = require('../controllers/ProductController');
const OrderController = require('../controllers/OrderController');

// --- ROTAS PARA O FRONTEND ---

// 1. Rota para o Catálogo: O Geovanni vai usar isso para listar as roupas
// Método: GET | URL: http://localhost:3333/products
router.get('/products', ProductController.index);

// 2. Rota para o Pedido: O Geovanni vai usar isso antes de abrir o WhatsApp
// Método: POST | URL: http://localhost:3333/orders
router.post('/orders', OrderController.store);

module.exports = router;