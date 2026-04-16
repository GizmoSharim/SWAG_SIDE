const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ProductService = {
  async listAllProducts() {
    return await prisma.product.findMany({
      include: { images: true }
    });
  }
};

module.exports = ProductService;