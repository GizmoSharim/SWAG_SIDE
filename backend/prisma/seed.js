const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const catalog = [
  {
    name: 'Camisa Oversized',
    description: 'Algodao pesado, caimento amplo e gola reforcada.',
    price: 129.9,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['#111111', '#ffffff', '#8d8a82'],
    stock: 24,
    category: 'Camisetas',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    name: 'Tech Trousers',
    description: 'Calca utilitaria em sarja tecnica com bolso lateral.',
    price: 239.9,
    sizes: ['38', '40', '42', '44'],
    colors: ['#0d0d0d', '#6f7568', '#d8d5ce'],
    stock: 16,
    category: 'Calcas',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    name: 'Denim Jacket',
    description: 'Jaqueta jeans reta com lavagem escura e estrutura limpa.',
    price: 319.9,
    sizes: ['P', 'M', 'G'],
    colors: ['#1f2937', '#111111'],
    stock: 10,
    category: 'Jaquetas',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1543076447-215ad9ba6923?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    name: 'Essential Hoodie',
    description: 'Moletom encorpado, minimalista e pronto para a rua.',
    price: 269.9,
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['#111111', '#c8c3b9', '#6b6b6b'],
    stock: 18,
    category: 'Moletons',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    name: 'Urban Sneakers',
    description: 'Tenis urbano de silhueta limpa para completar o drop.',
    price: 299.9,
    sizes: ['38', '39', '40', '41', '42'],
    colors: ['#111111', '#ffffff', '#6b6b6b'],
    stock: 14,
    category: 'Calçados',
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop'
    ]
  }
];

const slugify = (value) =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

async function createVariants(product, item) {
  for (const sizeName of item.sizes) {
    const size = await prisma.size.upsert({
      where: { name: sizeName },
      update: {},
      create: { name: sizeName }
    });

    for (const colorHex of item.colors) {
      const color = await prisma.color.upsert({
        where: { name_hex: { name: colorHex, hex: colorHex } },
        update: {},
        create: { name: colorHex, hex: colorHex }
      });

      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          sizeId: size.id,
          colorId: color.id,
          sku: `SWG-${product.id}-${sizeName}-${colorHex}`.replace(/[^A-Za-z0-9-]/g, '').toUpperCase()
        }
      });

      await prisma.stock.create({
        data: {
          variantId: variant.id,
          quantity: Math.max(1, Math.floor(item.stock / item.sizes.length))
        }
      });
    }
  }
}

async function main() {
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.address.deleteMany();
  await prisma.order.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.category.deleteMany();

  const passwordHash = await bcrypt.hash('Admin@123456', 12);
  await prisma.user.upsert({
    where: { email: 'admin@swegside.com' },
    update: { role: 'ADMIN', passwordHash },
    create: {
      name: 'Administrador SWEG SIDE',
      email: 'admin@swegside.com',
      whatsapp: '5592985867288',
      passwordHash,
      role: 'ADMIN'
    }
  });

  for (const item of catalog) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(item.category) },
      update: { name: item.category },
      create: { name: item.category, slug: slugify(item.category) }
    });

    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: slugify(item.name),
        description: item.description,
        price: item.price,
        sizes: item.sizes,
        stock: item.stock,
        category: item.category,
        categoryId: category.id,
        featured: item.featured,
        active: true,
        images: {
          create: item.images.map((url, index) => ({
            url,
            position: index,
            isMain: index === 0,
            alt: item.name
          }))
        }
      }
    });

    await createVariants(product, item);
  }

  await prisma.banner.createMany({
    data: [
      {
        title: 'SWEG SIDE',
        subtitle: 'Streetwear minimalista para rotina real.',
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1800&auto=format&fit=crop',
        linkUrl: '/#destaques',
        position: 'hero'
      },
      {
        title: 'OVERSIZED SYSTEM',
        subtitle: 'Linhas limpas, peso certo, rua sem excesso.',
        imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1200&auto=format&fit=crop',
        linkUrl: '/#drop',
        position: 'bento'
      }
    ]
  });

  console.log('Seed SWAG SIDE concluido.');
  console.log('Admin: admin@swegside.com / Admin@123456');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
