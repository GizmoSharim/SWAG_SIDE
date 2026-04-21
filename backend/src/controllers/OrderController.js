const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const OrderController = {
  async store(req, res) {
    console.log("Dados recebidos no Body:", req.body); 

    try {
      // Verificando se o prisma.order existe antes de tentar criar
      if (!prisma.order) {
        throw new Error("A tabela 'order' não foi encontrada no Prisma. Verifique seu schema.prisma");
      }

      const { customerName, whatsapp, total, items } = req.body;

      const order = await prisma.order.create({
        data: {
          customerName: customerName,
          whatsapp: whatsapp,
          total: Number(total), 
          items: items, 
          status: "AGUARDANDO_WHATSAPP" 
        }
      });

      return res.status(201).json(order);

    } catch (error) {
      console.error("ERRO NO CONTROLADOR:", error);
      return res.status(500).json({ 
        error: "Erro ao registrar intenção de compra",
        details: error.message 
      });
    }
  }
};

module.exports = OrderController;