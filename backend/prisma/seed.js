const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.product.create({
    data: {
      name: "Camisa Oversized Black",
      description: "Camisa 100% algodão, fio 30.1 penteado. Ideal para um visual streetwear.",
      price: 129.90,
      sizes: ["P", "M", "G", "GG"],
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500" },
          { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=500" },
          { url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=500" }
        ]
      }
      
    }
  })
  console.log("✅ Produto de teste criado com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })