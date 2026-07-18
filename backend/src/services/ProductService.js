const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

const slugify = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function splitList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
}

function normalizeImages(images) {
  if (Array.isArray(images)) {
    return images
      .map((image, index) => typeof image === 'string'
        ? { url: image, position: index, isMain: index === 0 }
        : {
            url: image.url,
            alt: image.alt,
            publicId: image.publicId,
            position: image.position ?? index,
            isMain: image.isMain ?? index === 0
          })
      .filter((image) => image.url);
  }

  return splitList(images).map((url, index) => ({ url, position: index, isMain: index === 0 }));
}

function normalizeProductData(data) {
  return {
    name: String(data.name).trim(),
    slug: slugify(data.name),
    description: String(data.description || '').trim(),
    price: Number(data.price),
    sizes: splitList(data.sizes),
    colors: splitList(data.colors),
    stock: Number(data.stock ?? 0),
    category: String(data.category || 'Camisetas').trim(),
    featured: Boolean(data.featured),
    active: data.active !== false,
    images: normalizeImages(data.images)
  };
}

function serializeProduct(product) {
  const variantColors = product.variants
    ?.map((variant) => variant.color?.hex)
    .filter(Boolean) || [];

  return {
    ...product,
    colors: [...new Set(variantColors)],
    images: product.images || [],
    sizes: product.sizes || []
  };
}

async function ensureCategory(tx, name) {
  return tx.category.upsert({
    where: { slug: slugify(name) },
    update: { name },
    create: { name, slug: slugify(name) }
  });
}

async function replaceVariants(tx, productId, sizes, colors, stock) {
  const existingVariants = await tx.productVariant.findMany({
    where: { productId },
    select: { id: true }
  });
  await tx.stock.deleteMany({
    where: { variantId: { in: existingVariants.map((variant) => variant.id) } }
  });
  await tx.productVariant.deleteMany({ where: { productId } });

  if (!sizes.length && !colors.length) return;

  const safeSizes = sizes.length ? sizes : ['Unico'];
  const safeColors = colors.length ? colors : [null];

  for (const sizeName of safeSizes) {
    const size = await tx.size.upsert({
      where: { name: sizeName },
      update: {},
      create: { name: sizeName }
    });

    for (const colorHex of safeColors) {
      let color = null;
      if (colorHex) {
        color = await tx.color.upsert({
          where: { name_hex: { name: colorHex, hex: colorHex } },
          update: {},
          create: { name: colorHex, hex: colorHex }
        });
      }

      const variant = await tx.productVariant.create({
        data: {
          productId,
          sizeId: size.id,
          colorId: color?.id,
          sku: `SWG-${productId}-${sizeName}-${colorHex || 'STD'}`.replace(/[^A-Za-z0-9-]/g, '').toUpperCase()
        }
      });

      await tx.stock.create({
        data: {
          variantId: variant.id,
          quantity: Math.floor(stock / safeSizes.length)
        }
      });
    }
  }
}

const includeProduct = {
  images: { orderBy: [{ isMain: 'desc' }, { position: 'asc' }] },
  variants: {
    include: {
      size: true,
      color: true,
      stock: true
    }
  },
  categoryRef: true
};

const ProductService = {
  async listAllProducts() {
    const products = await prisma.product.findMany({
      where: { active: true },
      include: includeProduct,
      orderBy: { createdAt: 'desc' }
    });

    return products.map(serializeProduct);
  },

  async findById(id) {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: includeProduct
    });

    if (!product || !product.active) {
      throw new AppError('Produto nao encontrado', 404, 'PRODUCT_NOT_FOUND');
    }

    return serializeProduct(product);
  },

  async createProduct(data) {
    const productData = normalizeProductData(data);

    return prisma.$transaction(async (tx) => {
      const category = await ensureCategory(tx, productData.category);
      const product = await tx.product.create({
        data: {
          name: productData.name,
          slug: `${productData.slug}-${Date.now()}`,
          description: productData.description,
          price: productData.price,
          sizes: productData.sizes,
          stock: productData.stock,
          category: productData.category,
          categoryId: category.id,
          featured: productData.featured,
          active: productData.active,
          images: { create: productData.images }
        },
        include: includeProduct
      });

      await replaceVariants(tx, product.id, productData.sizes, productData.colors, productData.stock);
      const created = await tx.product.findUnique({ where: { id: product.id }, include: includeProduct });
      return serializeProduct(created);
    });
  },

  async updateProduct(id, data) {
    const productData = normalizeProductData(data);

    await prisma.$transaction(async (tx) => {
      const category = await ensureCategory(tx, productData.category);
      await tx.productImage.deleteMany({ where: { productId: Number(id) } });

      await tx.product.update({
        where: { id: Number(id) },
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          sizes: productData.sizes,
          stock: productData.stock,
          category: productData.category,
          categoryId: category.id,
          featured: productData.featured,
          active: productData.active,
          images: { create: productData.images }
        }
      });

      await replaceVariants(tx, Number(id), productData.sizes, productData.colors, productData.stock);
    });

    return ProductService.findById(id);
  },

  async deleteProduct(id) {
    return prisma.product.update({
      where: { id: Number(id) },
      data: { active: false }
    });
  }
};

module.exports = ProductService;
