const ProductService = require('../services/ProductService');
const asyncHandler = require('../utils/asyncHandler');

const ProductController = {
  index: asyncHandler(async (req, res) => {
    const products = await ProductService.listAllProducts();
    return res.json(products);
  }),

  show: asyncHandler(async (req, res) => {
    const product = await ProductService.findById(req.params.id);
    return res.json(product);
  }),

  store: asyncHandler(async (req, res) => {
    const product = await ProductService.createProduct(req.body);
    return res.status(201).json(product);
  }),

  update: asyncHandler(async (req, res) => {
    const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
    return res.json(updatedProduct);
  }),

  delete: asyncHandler(async (req, res) => {
    await ProductService.deleteProduct(req.params.id);
    return res.status(204).send();
  })
};

module.exports = ProductController;
