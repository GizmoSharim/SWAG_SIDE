const ProductService = require('../services/ProductService');

const ProductController = {
  async index(req, res) {
    try {
      const products = await ProductService.listAllProducts();
      return res.json(products);
    } catch (error) {
      // Aqui o erro cai no middleware que criamos no server.js
      return res.status(500).json({ error: "Erro interno ao buscar produtos" });
    }
  }
};

module.exports = ProductController;