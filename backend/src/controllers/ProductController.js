const ProductService = require('../services/ProductService');

const ProductController = {
  // Listar todos
  async index(req, res) {
    try {
      const products = await ProductService.listAllProducts();
      return res.json(products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return res.status(500).json({ error: "Erro ao buscar produtos", details: error.message });
    }
  },

  // Criar novo (Painel Admin)
  async store(req, res) {
    try {
      const product = await ProductService.createProduct(req.body);
      return res.status(201).json(product);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return res.status(500).json({ error: "Erro ao criar produto", details: error.message });
    }
  },

  // EDITAR (A função que estava faltando!)
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedProduct = await ProductService.updateProduct(id, req.body);
      return res.json(updatedProduct);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return res.status(500).json({ error: "Erro ao atualizar produto", details: error.message });
    }
  },

  // EXCLUIR
  async delete(req, res) {
    try {
      const { id } = req.params;
      await ProductService.deleteProduct(id);
      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return res.status(500).json({ error: "Erro ao deletar produto", details: error.message });
    }
  }
};

module.exports = ProductController;
