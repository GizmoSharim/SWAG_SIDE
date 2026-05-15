const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function normalizeProductInput(data) {
  const images = Array.isArray(data.images)
    ? data.images.map((url) => String(url).trim()).filter(Boolean)
    : [];

  const sizes = Array.isArray(data.sizes)
    ? data.sizes.map((size) => String(size).trim()).filter(Boolean)
    : [];

  return {
    name: String(data.name || '').trim(),
    description: String(data.description || '').trim(),
    price: Number(data.price),
    sizes,
    images,
  };
}

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
    const product = normalizeProductInput(data);

    return await prisma.product.update({
      where: { id: Number(id) },
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        sizes: product.sizes
      }
    });
  },

  async deleteProduct(id) {
    await prisma.image.deleteMany({ where: { productId: Number(id) } });
    return await prisma.product.delete({ where: { id: Number(id) } });
  },

  async createProduct(data) {
    const product = normalizeProductInput(data);

    return await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        sizes: product.sizes,
        images: { create: product.images.map(url => ({ url })) }
      },
      include: { images: true }
    });
  }
};

module.exports = ProductService;
