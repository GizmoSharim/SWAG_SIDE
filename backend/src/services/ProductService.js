const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ProductService = {
  async listAllProducts() {
    return await prisma.product.findMany({ include: { images: true } });
  },

  // NOVO: Achar um produto específico para carregar no formulário
  async findById(id) {
    return await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { images: true }
    });
  },

  // NOVO: Atualizar os dados (Preço, Nome, etc)
  async updateProduct(id, data) {
    return await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        sizes: data.sizes
      }
    });
  },

  async deleteProduct(id) {
    await prisma.image.deleteMany({ where: { productId: Number(id) } });
    return await prisma.product.delete({ where: { id: Number(id) } });
  },

  async createProduct(data) {
    return await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        sizes: data.sizes,
        images: { create: data.images.map(url => ({ url })) }
      },
      include: { images: true }
    });
  }
};

module.exports = ProductService;